import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  Plus,
  Layers,
  Calendar,
  User,
  GraduationCap,
  ExternalLink,
  Printer,
  FileCheck,
  Sparkles,
  RefreshCw,
  FolderPlus,
  SlidersHorizontal,
} from 'lucide-react';
import { LibraryResource } from '../types';
import { storage } from '../services/storage';

interface AdminPdfManagerProps {
  onRefresh?: () => void;
}

const CATEGORIES = [
  'معايير محاسبية دولية (IFRS / IAS)',
  'قوانين وضرائب سودانية',
  'كتب ومقررات أكاديمية معتمدة',
  'لوائح وسياسات جامعية',
  'ملخصات ومذكرات المحاضرات',
  'أبحاث ودوريات محاسبية',
  'نماذج واستمارات إدارية',
];

const COLLEGE_COURSES = [
  'عام (كافة التخصصات والمستويات)',
  'المحاسبة في بيئة التجارة الإلكترونية',
  'نظم المعلومات المحاسبية (AIS)',
  'المعايير الدولية لإعداد التقارير المالية (IFRS)',
  'المراجعة والتدقيق المالي الرقمي',
  'محاسبة التكاليف والمحاسبة الإدارية',
  'المحاسبة الضريبية والزكاة بالسودان',
  'أصول المحاسبة المالية (1 و 2)',
  'المحاسبة المتوسطة والمتقدمة',
  'تطبيقات البرمجيات ومنظومة Odoo و QuickBooks',
];

export const AdminPdfManager: React.FC<AdminPdfManagerProps> = ({ onRefresh }) => {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  
  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingResource, setEditingResource] = useState<LibraryResource | null>(null);
  const [previewResource, setPreviewResource] = useState<LibraryResource | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // File upload form state
  const [sourceType, setSourceType] = useState<'file' | 'url'>('file');
  const [directUrl, setDirectUrl] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('2.5 MB');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('أمانة الشؤون العلمية - كلية السودان الجديد للمحاسبة');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [course, setCourse] = useState(COLLEGE_COURSES[0]);
  const [year, setYear] = useState('2026');
  const [pages, setPages] = useState<number>(45);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('محاسبة, معايير, كلية السودان الجديد');
  const [isVisibleToStudents, setIsVisibleToStudents] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadResources = () => {
    const list = storage.getPdfResources();
    setResources(list);
  };

  useEffect(() => {
    loadResources();
    const handleStorageUpdate = () => loadResources();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Handle local PDF file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('يرجى اختيار ملف بصيغة PDF فقط.');
      return;
    }

    // Auto-fill title if empty
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (!title) {
      setTitle(cleanName.replace(/[-_]/g, ' '));
    }
    setFileName(file.name);

    // Calculate human-readable size
    const mb = file.size / (1024 * 1024);
    if (mb >= 1) {
      setFileSize(`${mb.toFixed(1)} MB`);
    } else {
      const kb = Math.round(file.size / 1024);
      setFileSize(`${kb} KB`);
    }

    setIsUploadingFile(true);
    setUploadProgress(40);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadProgress(100);
      setIsUploadingFile(false);
      if (typeof reader.result === 'string') {
        setFileDataUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setIsUploadingFile(false);
      alert('حدث خطأ أثناء قراءة الملف، يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  // Reset form
  const resetForm = () => {
    setEditingResource(null);
    setSourceType('file');
    setDirectUrl('');
    setFileDataUrl('');
    setFileName('');
    setFileSize('2.5 MB');
    setTitle('');
    setAuthor('أمانة الشؤون العلمية - كلية السودان الجديد للمحاسبة');
    setCategory(CATEGORIES[0]);
    setCourse(COLLEGE_COURSES[0]);
    setYear('2026');
    setPages(45);
    setDescription('');
    setTagsInput('محاسبة, معايير, كلية السودان الجديد');
    setIsVisibleToStudents(true);
    setAllowDownload(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowUploadModal(true);
  };

  const handleOpenEditModal = (res: LibraryResource) => {
    setEditingResource(res);
    setSourceType(res.sourceType || (res.directUrl ? 'url' : 'file'));
    setDirectUrl(res.directUrl || '');
    setTitle(res.title);
    setAuthor(res.author);
    setCategory(res.category);
    setCourse(res.course || COLLEGE_COURSES[0]);
    setYear(res.year);
    setPages(res.pages || 30);
    setFileSize(res.fileSize || '2.0 MB');
    setFileName(res.fileName || `${res.title}.pdf`);
    setFileDataUrl(res.dataUrl || '');
    setDescription(res.description);
    setTagsInput(res.tags ? res.tags.join(', ') : '');
    setIsVisibleToStudents(res.isVisibleToStudents !== false);
    setAllowDownload(res.allowDownload !== false);
    setShowUploadModal(true);
  };

  // Submit Add or Edit
  const handleSavePdf = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('يرجى كتابة عنوان المستند أو الكتاب.');
      return;
    }

    if (sourceType === 'url' && !directUrl.trim()) {
      alert('يرجى إدخال الرابط المباشر للمستند أو الكتاب.');
      return;
    }

    const tagsArray = tagsInput
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const effectiveDataUrl = sourceType === 'url' ? directUrl.trim() : (fileDataUrl || editingResource?.dataUrl || '');

    if (editingResource) {
      // Update existing
      storage.updatePdfResource(editingResource.id, {
        title: title.trim(),
        author: author.trim(),
        category,
        course,
        year,
        pages: Number(pages) || 1,
        fileSize,
        fileName: fileName || `${title.trim()}.pdf`,
        dataUrl: effectiveDataUrl,
        directUrl: sourceType === 'url' ? directUrl.trim() : undefined,
        sourceType,
        description: description.trim(),
        tags: tagsArray.length > 0 ? tagsArray : ['مستند', 'محاسبة'],
        isVisibleToStudents,
        allowDownload,
      });
      triggerToast(`تم تحديث بيانات ملف "${title}" بنجاح.`);
    } else {
      // Create new
      storage.addPdfResource({
        title: title.trim(),
        author: author.trim(),
        category,
        course,
        year,
        pages: Number(pages) || 1,
        fileSize,
        fileName: fileName || `${title.trim()}.pdf`,
        dataUrl: effectiveDataUrl,
        directUrl: sourceType === 'url' ? directUrl.trim() : undefined,
        sourceType,
        format: 'PDF',
        description:
          description.trim() ||
          `ملف ومستند أكاديمي معتمد من كلية السودان الجديد للمحاسبة ضمن مساق ${course}.`,
        tags: tagsArray.length > 0 ? tagsArray : ['محاسبة', 'مقررات', 'NSCA'],
        isVisibleToStudents,
        allowDownload,
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: 'إدارة الكلية والأمانة العلمية',
      });
      triggerToast(`تم إضافة وحفظ ملف/رابط "${title}" بنجاح.`);
    }

    setShowUploadModal(false);
    resetForm();
    loadResources();
    if (onRefresh) onRefresh();
  };

  // Toggle visibility (Eye / EyeOff)
  const handleToggleVisibility = (id: string, currentTitle: string) => {
    const newState = storage.togglePdfResourceVisibility(id);
    loadResources();
    triggerToast(
      newState
        ? `تم إتاحة ملف "${currentTitle}" للطلاب في المكتبة والمقررات بنجاح.`
        : `تم إخفاء ملف "${currentTitle}" عن الطلاب وأصبح مرئياً للإدارة فقط.`
    );
    if (onRefresh) onRefresh();
  };

  // Delete resource
  const handleDeleteResource = (id: string) => {
    storage.deletePdfResource(id);
    setDeleteConfirmId(null);
    loadResources();
    triggerToast('تم حذف ملف الـ PDF نهائياً من مستودع الكلية.');
    if (onRefresh) onRefresh();
  };

  // Direct download handler
  const handleDownloadPdf = (res: LibraryResource) => {
    storage.incrementPdfDownload(res.id);
    loadResources();

    if (res.dataUrl && res.dataUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = res.dataUrl;
      link.download = res.fileName || `${res.title}.pdf`;
      link.click();
    } else if (res.directUrl || (res.dataUrl && res.dataUrl.startsWith('http'))) {
      const downloadUrl = res.directUrl || res.dataUrl || '';
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = res.fileName || `${res.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate clean PDF text snapshot download
      const docContent = `كلية السودان الجديد للمحاسبة (NSCA)\nأمانة الشؤون العلمية - المستودع الأكاديمي المعتمد\n\nالعنوان: ${res.title}\nالمؤلف/الجهة: ${res.author}\nالتصنيف: ${res.category}\nالمساق/المقرر: ${res.course || 'عام'}\nسنة الإصدار: ${res.year}\nعدد الصفحات: ${res.pages} صفحة\nحجم الملف: ${res.fileSize}\n\nالوصف ومحاور المحتوى:\n${res.description}\n\nالكلمات المفتاحية: ${res.tags?.join('، ')}\n\nجميع الحقوق محفوظة لكلية السودان الجديد للمحاسبة © ${new Date().getFullYear()}`;
      const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${res.title.substring(0, 35)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
    triggerToast(`جاري تنزيل ملف "${res.title}"...`);
  };

  // Filtering
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      !searchQuery.trim() ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.course && res.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.tags && res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = categoryFilter === 'all' || res.category === categoryFilter;

    const isVisible = res.isVisibleToStudents !== false;
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && isVisible) ||
      (visibilityFilter === 'hidden' && !isVisible);

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const totalFiles = resources.length;
  const visibleCount = resources.filter((r) => r.isVisibleToStudents !== false).length;
  const hiddenCount = totalFiles - visibleCount;
  const totalDownloads = resources.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);

  return (
    <div className="bg-white rounded-3xl border-2 border-blue-950/20 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-950 text-amber-400 text-[11px] font-black px-3 py-1 rounded-full border border-amber-400/30">
              صلاحية الإدارة الأكاديمية • PDF Portal
            </span>
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600" />
              التحكم في رفع وإدارة ملفات الـ PDF والمراجع الأكاديمية
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            رفع ملفات ومقررات الـ PDF، معايير المحاسبة، قوانين الضرائب، اللوائح الجامعية ومذكرات المحاضرات مع التحكم الكامل في إظهارها للطلاب في المكتبة والمقررات أو إخفائها كمسودة إدارية.
          </p>
        </div>

        {/* UPLOAD NEW PDF ACTION BUTTON */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAddModal}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm shadow-red-600/20"
          >
            <Upload className="w-4 h-4" />
            رفع ملف PDF جديد
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
          <span className="text-[11px] text-slate-500 font-bold block">إجمالي ملفات PDF</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalFiles} ملف</span>
          <span className="text-[10px] text-slate-400 font-semibold">بالمستودع الأكاديمي</span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl">
          <span className="text-[11px] text-emerald-800 font-bold block">منشورة ومتاحة للطلاب</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{visibleCount} ملف</span>
          <span className="text-[10px] text-emerald-600 font-semibold">ظاهرة فورياً بالمكتبة</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl">
          <span className="text-[11px] text-amber-900 font-bold block">مخفية / مسودة للإدارة</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{hiddenCount} ملف</span>
          <span className="text-[10px] text-amber-600 font-semibold">غير ظاهرة للطلاب</span>
        </div>

        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl">
          <span className="text-[11px] text-blue-900 font-bold block">إجمالي التحميلات</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{totalDownloads.toLocaleString()}</span>
          <span className="text-[10px] text-blue-600 font-semibold">تنزيل وتداول للطلاب</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في ملفات الـ PDF بالاسم، المؤلف، المقرر، أو الكلمات المفتاحية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Visibility Filter Buttons */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 p-1 rounded-xl w-full md:w-auto text-xs font-bold">
            <button
              onClick={() => setVisibilityFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                visibilityFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              الكل ({totalFiles})
            </button>
            <button
              onClick={() => setVisibilityFilter('visible')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                visibilityFilter === 'visible'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              مرئي للطلاب ({visibleCount})
            </button>
            <button
              onClick={() => setVisibilityFilter('hidden')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                visibilityFilter === 'hidden'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              مخفي ({hiddenCount})
            </button>
          </div>
        </div>

        {/* Category Chips Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-bold whitespace-nowrap pl-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> التصنيف:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition text-xs ${
              categoryFilter === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            كافة التصنيفات
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition text-xs ${
                categoryFilter === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PDF RESOURCES TABLE */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-black text-slate-700 text-sm">لا توجد ملفات PDF مطابقة للبحث أو الفلتر</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            يمكنك رفع ملف PDF جديد أو تغيير معايير البحث والفلترة لعرض الملفات.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> رفع ملف جديد الآن
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[11px]">
              <tr>
                <th className="p-3.5 font-bold">ملف الـ PDF والعنوان</th>
                <th className="p-3.5 font-bold">التصنيف والمقرر</th>
                <th className="p-3.5 font-bold">المؤلف / الجهة</th>
                <th className="p-3.5 font-bold">الحجم والصفحات</th>
                <th className="p-3.5 font-bold">حالة الظهور للطلاب</th>
                <th className="p-3.5 font-bold text-center">التحميلات</th>
                <th className="p-3.5 font-bold text-center">إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.map((res) => {
                const isVisible = res.isVisibleToStudents !== false;
                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition">
                    {/* TITLE & ICON */}
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-black text-xs border border-red-200">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block line-clamp-1" title={res.title}>
                            {res.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {res.fileName || `${res.title}.pdf`}
                          </span>
                          {res.uploadedAt && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              رُفع بتاريخ: {res.uploadedAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY & COURSE */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md text-[10px] font-bold block w-max mb-1">
                        {res.category}
                      </span>
                      {res.course && (
                        <span className="text-[10px] text-slate-500 font-semibold block truncate max-w-[170px]" title={res.course}>
                          {res.course}
                        </span>
                      )}
                    </td>

                    {/* AUTHOR */}
                    <td className="p-3.5">
                      <span className="text-slate-800 font-medium block truncate max-w-[150px]" title={res.author}>
                        {res.author}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{res.year}</span>
                    </td>

                    {/* SIZE & PAGES */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800">{res.fileSize || '2.4 MB'}</span>
                        <span className="text-slate-400 text-[10px] block font-sans">
                          {res.pages || 35} صفحة
                        </span>
                      </div>
                    </td>

                    {/* VISIBILITY BADGE */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isVisible ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1">
                          <Eye className="w-3 h-3 text-emerald-600" />
                          مرئي للطلاب
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1">
                          <EyeOff className="w-3 h-3 text-amber-600" />
                          مخفي (مسودة للإدارة)
                        </span>
                      )}
                    </td>

                    {/* DOWNLOADS */}
                    <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                      {res.downloadCount || 0}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* TOGGLE VISIBILITY */}
                        <button
                          onClick={() => handleToggleVisibility(res.id, res.title)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition ${
                            isVisible
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={isVisible ? 'إخفاء الملف عن الطلاب' : 'إتاحة الملف فورياً للطلاب'}
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        {/* PREVIEW / READ */}
                        <button
                          onClick={() => setPreviewResource(res)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-1.5 rounded-lg transition border border-blue-200"
                          title="معاينة وقراءة الملف"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>

                        {/* DOWNLOAD */}
                        <button
                          onClick={() => handleDownloadPdf(res)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition border border-slate-200"
                          title="تنزيل الملف"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* EDIT */}
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition border border-slate-200"
                          title="تعديل بيانات الملف"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteConfirmId(res.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded-lg transition border border-rose-200"
                          title="حذف الملف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* UPLOAD / EDIT PDF MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  مركز وثائق الكلية الأكاديمية
                </span>
                <h3 className="font-black text-xl text-slate-900 mt-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  {editingResource ? 'تعديل بيانات ومحددات ملف الـ PDF' : 'رفع ملف PDF جديد إلى المنظومة'}
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePdf} className="space-y-4 text-xs">
              {/* SOURCE SELECTOR: LOCAL FILE VS DIRECT URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">طريقة إضافة الكتاب / المستند الأكاديمي:</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSourceType('file')}
                    className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                      sourceType === 'file'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>رفع ملف PDF من الجهاز</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('url')}
                    className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                      sourceType === 'url'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>رابط مباشر لكتاب / PDF (iframe)</span>
                  </button>
                </div>
              </div>

              {/* OPTION A: LOCAL FILE PICKER */}
              {sourceType === 'file' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    ملف الـ PDF المرفوع (اختر ملف من جهازك أو اسحبه هنا) *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-4 sm:p-6 text-center cursor-pointer bg-slate-50 hover:bg-red-50/30 transition"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,application/pdf"
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      {fileName ? (
                        <div>
                          <span className="font-black text-slate-900 text-sm block">{fileName}</span>
                          <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                            ✓ تم تحديد الملف بنجاح ({fileSize})
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-black text-slate-800 text-xs block">
                            انقر هنا لاختيار ملف PDF أو قم بسحبه وإفلاته
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            يدعم كافة ملفات الـ PDF الأكاديمية (الكتب، المذكرات، المعايير، اللوائح)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* OPTION B: DIRECT URL INPUT */}
              {sourceType === 'url' && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <ExternalLink className="w-4 h-4 text-blue-700" />
                    <span>إدخال الرابط المباشر للمستند أو الكتاب الإلكتروني</span>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      الرابط المباشر للمستند / رابط عارض الـ PDF أو iframe *
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/books/financial_accounting.pdf أو رابط Google Drive المباشر"
                      value={directUrl}
                      onChange={(e) => setDirectUrl(e.target.value)}
                      className="w-full bg-white border border-blue-300 rounded-xl p-3 font-mono text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      يدعم روابط ملفات PDF المباشرة، ومكتبات الكتب السحابية، وروابط التضمين (iframe) لتصفح وقراءة الكتاب وتحميله مباشرة من قبل الطلاب.
                    </p>
                  </div>
                </div>
              )}

              {/* TITLE */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان ملف الـ PDF / اسم الكتاب أو الوثيقة *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المعايير الدولية لإعداد التقارير المالية (IFRS 16 - عقود الإيجار)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* CATEGORY & ASSOCIATED COURSE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التصنيف الأكاديمي *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المساق / المقرر الدراسي المرتبط</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                  >
                    {COLLEGE_COURSES.map((crs) => (
                      <option key={crs} value={crs}>
                        {crs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AUTHOR & YEAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">المؤلف / الجهة المصدرة *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="مثال: مجلس المعايير المحاسبية الدولية / أمانة الشؤون العلمية"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">سنة الإصدار / النسخة</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* PAGES & ESTIMATED SIZE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد الصفحات التقريبي</label>
                  <input
                    type="number"
                    min="1"
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">حجم الملف المسجل</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="مثال: 4.8 MB"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الوصف الأكاديمي ومحاور الملف (يظهر للطلاب والباحثين)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب شرحاً موجزاً لما يتضمنه الملف والمواضيع المحاسبية التي يغطيها..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 leading-relaxed"
                />
              </div>

              {/* TAGS */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الكلمات المفتاحية والوسوم (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="IFRS, ضرائب, مراجعة, مذكرات, المستوى الثالث"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              {/* PERMISSIONS & TOGGLES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <input
                    type="checkbox"
                    id="vis_toggle"
                    checked={isVisibleToStudents}
                    onChange={(e) => setIsVisibleToStudents(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="vis_toggle" className="font-bold cursor-pointer text-xs text-emerald-950">
                    إتاحة وظهور الملف فورياً للطلاب في المكتبة والمقررات
                  </label>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <input
                    type="checkbox"
                    id="dl_toggle"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="dl_toggle" className="font-bold cursor-pointer text-xs text-blue-950">
                    السماح للطلاب بتنزيل وتحميل الملف مباشرة
                  </label>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  {editingResource ? 'حفظ تعديلات المستند' : 'اعتماد ونشر ملف الـ PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF PREVIEW & READER MODAL */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* PREVIEW HEADER */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm">
                  PDF
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base line-clamp-1">{previewResource.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    {previewResource.author} • {previewResource.category} • {previewResource.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf(previewResource)}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  تحميل
                </button>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PREVIEW BODY */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
              {/* If actual PDF base64 or Direct URL exists */}
              {(previewResource.directUrl ||
                (previewResource.dataUrl &&
                  (previewResource.dataUrl.startsWith('data:application/pdf') ||
                    previewResource.dataUrl.startsWith('http')))) ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4 text-blue-700" />
                      عارض الـ PDF والتضمين الرقمي (iframe Viewer)
                    </span>
                    {(previewResource.directUrl || (previewResource.dataUrl && previewResource.dataUrl.startsWith('http'))) && (
                      <a
                        href={previewResource.directUrl || previewResource.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> فتح الرابط في نافذة مستقلة
                      </a>
                    )}
                  </div>
                  <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-200">
                    <iframe
                      src={previewResource.directUrl || previewResource.dataUrl}
                      title={previewResource.title}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                /* Structured Academic Document Viewer */
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  {/* Official Header */}
                  <div className="border-b-2 border-red-600/30 pb-4 text-center space-y-1">
                    <span className="text-[11px] font-black text-red-600 block">
                      جمهورية السودان • وزارة التعليم العالي والبحث العلمي
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      كلية السودان الجديد للمحاسبة (NSCA)
                    </h2>
                    <span className="text-xs text-slate-500 font-semibold block">
                      المستودع الأكاديمي الرقمي والوثائق المعتمدة
                    </span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">العنوان:</span>
                      <span className="font-bold text-slate-900 block">{previewResource.title}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">التصنيف:</span>
                      <span className="font-bold text-blue-800 block">{previewResource.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">المؤلف:</span>
                      <span className="font-bold text-slate-800 block">{previewResource.author}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">عدد الصفحات والحجم:</span>
                      <span className="font-bold text-slate-800 block">
                        {previewResource.pages || 40} صفحة ({previewResource.fileSize})
                      </span>
                    </div>
                  </div>

                  {/* Description / Content Preview */}
                  <div className="space-y-3">
                    <h4 className="font-black text-sm text-slate-900 border-r-4 border-red-600 pr-2">
                      مقدمة ومحاور المستند الأكاديمي:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/40 p-4 rounded-xl border border-amber-200/50 whitespace-pre-wrap">
                      {previewResource.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {previewResource.tags && previewResource.tags.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        الكلمات المفتاحية:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {previewResource.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Visibility Note */}
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {previewResource.isVisibleToStudents !== false ? (
                        <>
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-emerald-900">
                            هذا المستند مرئي حالياً لكافة الطلاب في المكتبة الرقمية وقوائم المقررات.
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-amber-900">
                            هذا المستند مخفي حالياً عن الطلاب ومحفوظ كمسودة خاصة للإدارة فقط.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PREVIEW FOOTER */}
            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                معرّف المستند: {previewResource.id}
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-black text-base text-slate-900">تأكيد حذف ملف الـ PDF</h4>
              <p className="text-xs text-slate-500">
                هل أنت متأكد من حذف هذا الملف نهائياً من مستودع الكلية؟ لن يتمكن الطلاب أو الأساتذة من الوصول إليه لاحقاً.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteResource(deleteConfirmId)}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-sm"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
