import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  Bookmark,
  Sparkles,
  Filter,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Layers,
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  Share2,
  BookMarked,
  Printer,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { ONLINE_BOOKS } from '../data/onlineBooksData';
import { LibraryResource, OnlineBook } from '../types';
import { storage } from '../services/storage';

export const LibraryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'documents'>('books');
  const [onlineBooks, setOnlineBooks] = useState<OnlineBook[]>(ONLINE_BOOKS);
  const [resources, setResources] = useState<LibraryResource[]>(() => storage.getPdfResources(true));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleStorageUpdate = () => {
      setResources(storage.getPdfResources(true));
    };
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
    };
  }, []);
  
  // Book Reader State
  const [readingBook, setReadingBook] = useState<OnlineBook | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [previewResource, setPreviewResource] = useState<LibraryResource | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const bookCategories = [
    { id: 'all', label: 'كافة الكتب والمراجع' },
    { id: 'محاسبة مالية', label: 'المحاسبة المالية' },
    { id: 'معايير دولية', label: 'معايير IFRS' },
    { id: 'تدقيق ومراجعة', label: 'التدقيق والمراجعة' },
    { id: 'العلوم المالية', label: 'التحليل المالي والاستثمار' },
    { id: 'نظم المعلومات', label: 'نظم المعلومات المحاسبية' },
    { id: 'إدارة الأعمال', label: 'إدارة الأعمال والريادة' },
  ];

  const docCategories = [
    { id: 'all', label: 'كافة الوثائق والأبحاث' },
    { id: 'معايير محاسبية دولية', label: 'معايير IFRS / IAS' },
    { id: 'قوانين وضرائب سودانية', label: 'الضرائب والزكاة بالسودان' },
    { id: 'كتب ومقررات أكاديمية', label: 'المقررات الدراسية المعتمدة' },
    { id: 'لوائح وسياسات جامعية', label: 'اللوائح والأنظمة الجامعية' },
    { id: 'ملخصات ومذكرات المحاضرات', label: 'مذكرات وسلايدات المحاضرات' },
    { id: 'أبحاث ودوريات محاسبية', label: 'المراجعة والأبحاث المهنية' },
  ];

  const filteredBooks = onlineBooks.filter((book) => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      book.title.includes(searchQuery) ||
      book.author.includes(searchQuery) ||
      book.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      res.category.includes(selectedCategory) ||
      selectedCategory.includes(res.category);
    const matchesSearch =
      !searchQuery.trim() ||
      res.title.includes(searchQuery) ||
      res.author.includes(searchQuery) ||
      (res.course && res.course.includes(searchQuery)) ||
      res.tags.some((t) => t.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleDownloadBook = (book: OnlineBook) => {
    setDownloadSuccess(book.title);
    setTimeout(() => setDownloadSuccess(null), 3500);

    const cleanContent = book.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const textData = `كلية السودان الجديد للمحاسبة (NSCA)\nالمكتبة الرقمية - مستودع الكتب المعتمدة\n\nالكتاب: ${book.title}\nالمؤلف: ${book.author}\nالتصنيف: ${book.category}\nسنة النشر: ${book.year || '2026'}\nالرقم المعياري (ISBN): ${book.isbn || 'غير محدد'}\nعدد الصفحات: ${book.pages || 300}\n\nالوصف:\n${book.description}\n\nنص ومقتطفات الكتاب:\n${cleanContent}\n\nجميع الحقوق محفوظة لكلية السودان الجديد للمحاسبة © ${new Date().getFullYear()}`;
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadResource = (res: LibraryResource) => {
    storage.incrementPdfDownload(res.id);
    setResources((prev) =>
      prev.map((item) =>
        item.id === res.id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item
      )
    );
    setDownloadSuccess(res.title);
    setTimeout(() => setDownloadSuccess(null), 3500);

    if (res.dataUrl && res.dataUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = res.dataUrl;
      link.download = res.fileName || `${res.title}.pdf`;
      link.click();
      return;
    }

    if (res.directUrl || (res.dataUrl && res.dataUrl.startsWith('http'))) {
      const downloadUrl = res.directUrl || res.dataUrl || '';
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = res.fileName || `${res.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const content = `كلية السودان الجديد للمحاسبة (NSCA)\nالمستودع الأكاديمي الرقمي\n\nالعنوان: ${res.title}\nالمؤلف: ${res.author}\nالتصنيف: ${res.category}\nسنة النشر: ${res.year}\nعدد الصفحات: ${res.pages}\n\nالوصف الأكاديمي:\n${res.description}\n\nالكلمات المفتاحية: ${res.tags.join(', ')}\n\nجميع الحقوق محفوظة لكلية السودان الجديد للمحاسبة © ${new Date().getFullYear()}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.substring(0, 30)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border-2 border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-right flex-col md:flex-row">
            <CollegeLogo size="xl" />
            <div className="space-y-1.5">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black inline-block">
                مكتبة الكلية الرقمية المركزية • NSCA Digital Library
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                المكتبة الأكاديمية وقارئ الكتب التفاعلي
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                منصة معرفية ذكية تتيح لطلاب وباحثي الكلية قراءة الكتب والمراجع المحاسبية المعتمدة مباشرة عبر الموقع أو تحميلها مجاناً، بالإضافة إلى مستودع أبحاث ومعايير المحاسبة الدولية (IFRS).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>تم تنزيل المصدر الأكاديمي بنجاح: <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => {
            setActiveTab('books');
            setSelectedCategory('all');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === 'books'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> كتب ومقررات الكلية (قراءة بالموقع)
          <span className="bg-amber-500/30 px-2 py-0.5 rounded-full text-[10px] mr-1">
            {onlineBooks.length} كتب
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('documents');
            setSelectedCategory('all');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-blue-800 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" /> مستودع الأبحاث والمعايير (PDF / ملفات)
          <span className="bg-blue-500/30 px-2 py-0.5 rounded-full text-[10px] mr-1">
            {resources.length} ملفاً
          </span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'books'
                ? 'ابحث باسم الكتاب، المؤلف (د. أحمد التجاني، بروفيسور الفاتح...)، أو التخصص...'
                : 'ابحث في المراجع المحاسبية، المعايير الدولية IFRS، أو القوانين الضريبية...'
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pr-11 pl-4 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 pl-2">
            <Filter className="w-3.5 h-3.5" /> التصنيف:
          </span>
          {(activeTab === 'books' ? bookCategories : docCategories).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKS GRID: VERTICAL RECTANGULAR BOOK COVERS */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>عرض {filteredBooks.length} كتب ومراجع أكاديمية متاحة للقراءة</span>
            <span>انقر على "قراءة الكتاب" للمطالعة الفورية على المتصفح</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Vertical Book Cover Presentation */}
                <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                  {/* Book Spine Shadow Accent */}
                  <div className="absolute top-0 bottom-0 right-4 w-4 bg-black/40 z-10 pointer-events-none" />

                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-44 object-cover rounded-r-lg rounded-l-xs shadow-2xl border-r-4 border-[#c59b6d] transform group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute top-3 right-3 z-20">
                    <span className="bg-slate-900/85 backdrop-blur-xs text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {book.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {book.pages} صفحة
                    </span>
                  </div>
                </div>

                {/* Book Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-black text-base text-slate-900 group-hover:text-amber-600 transition line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-600">
                      المؤلف: <span className="text-amber-800">{book.author}</span>
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setReadingBook(book)}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-4 h-4" /> قراءة الكتاب بالموقع
                    </button>

                    <button
                      onClick={() => handleDownloadBook(book)}
                      title="تحميل ملخص الكتاب"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTS & IFRS RESOURCES GRID */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      res.category === 'معايير محاسبية دولية'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : res.category === 'قوانين وضرائب سودانية'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {res.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {res.format} • {res.fileSize}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-snug line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    المؤلف / الجهة: {res.author} ({res.year})
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-md border border-slate-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-700" /> قراءة ومعاينة
                </button>
                {res.allowDownload !== false ? (
                  <button
                    onClick={() => handleDownloadResource(res)}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    title="تحميل الملف"
                  >
                    <Download className="w-3.5 h-3.5" /> تحميل
                  </button>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-2 rounded-xl">
                    للقراءة فقط
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INTERACTIVE IN-SITE BOOK READER MODAL */}
      {readingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className={`w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] border ${
              isNightMode
                ? 'bg-slate-950 text-slate-100 border-slate-800'
                : 'bg-[#faf8f5] text-slate-900 border-amber-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* READER CONTROLS HEADER */}
            <div
              className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
                isNightMode
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white border-amber-200 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base line-clamp-1">{readingBook.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {readingBook.author} • {readingBook.category}
                  </p>
                </div>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-2">
                {/* Font Zoom */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-slate-700 dark:text-slate-300">
                  <button
                    onClick={() => {
                      if (fontSize === 'xl') setFontSize('lg');
                      else if (fontSize === 'lg') setFontSize('base');
                      else if (fontSize === 'base') setFontSize('sm');
                    }}
                    title="تصغير الخط"
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold px-2">حجم الخط</span>
                  <button
                    onClick={() => {
                      if (fontSize === 'sm') setFontSize('base');
                      else if (fontSize === 'base') setFontSize('lg');
                      else if (fontSize === 'lg') setFontSize('xl');
                    }}
                    title="تكبير الخط"
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Night Mode Toggle */}
                <button
                  onClick={() => setIsNightMode(!isNightMode)}
                  title={isNightMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                  className={`p-2 rounded-xl border transition ${
                    isNightMode
                      ? 'bg-slate-800 border-slate-700 text-amber-400'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Download */}
                <button
                  onClick={() => handleDownloadBook(readingBook)}
                  title="تحميل الكتاب"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تحميل</span>
                </button>

                {/* Close */}
                <button
                  onClick={() => setReadingBook(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 transition"
                  aria-label="إغلاق القارئ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* READING CONTENT PANE */}
            <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6">
              {/* Book Metadata Ribbon */}
              <div
                className={`p-4 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                  isNightMode
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-amber-50/70 border-amber-200/80 text-slate-700'
                }`}
              >
                <span>الرقم المعياري الدولي (ISBN): <strong>{readingBook.isbn || '978-99942-0-112-4'}</strong></span>
                <span>سنة النشر: <strong>{readingBook.year || '2026'}</strong></span>
                <span>عدد الصفحات: <strong>{readingBook.pages || 384} صفحة</strong></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ نسخة معتمدة من الكلية</span>
              </div>

              {/* Rendered Book Content */}
              <div
                className={`prose max-w-none leading-relaxed font-serif ${
                  fontSize === 'sm'
                    ? 'text-xs'
                    : fontSize === 'base'
                    ? 'text-sm sm:text-base'
                    : fontSize === 'lg'
                    ? 'text-lg'
                    : 'text-xl'
                } ${isNightMode ? 'text-slate-200' : 'text-slate-800'}`}
                dangerouslySetInnerHTML={{ __html: readingBook.content }}
              />
            </div>

            {/* FOOTER */}
            <div
              className={`p-4 border-t text-xs flex items-center justify-between ${
                isNightMode
                  ? 'bg-slate-900 border-slate-800 text-slate-400'
                  : 'bg-white border-amber-200 text-slate-500'
              }`}
            >
              <span>جميع الحقوق محفوظة لكلية السودان الجديد للمحاسبة © {new Date().getFullYear()}</span>
              <button
                onClick={() => window.print()}
                className="hover:underline flex items-center gap-1 font-bold text-amber-600"
              >
                <Printer className="w-3.5 h-3.5" /> طباعة الفصل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACADEMIC PDF DOCUMENT PREVIEW MODAL */}
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
                {previewResource.allowDownload !== false && (
                  <button
                    onClick={() => handleDownloadResource(previewResource)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    تحميل الملف
                  </button>
                )}
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
              {(previewResource.directUrl ||
                (previewResource.dataUrl &&
                  (previewResource.dataUrl.startsWith('data:application/pdf') ||
                    previewResource.dataUrl.startsWith('http')))) ? (
                <div className="space-y-3">
                  {(previewResource.directUrl || (previewResource.dataUrl && previewResource.dataUrl.startsWith('http'))) && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-blue-700" />
                        عارض الكتب والمستندات التفاعلي (iframe Viewer)
                      </span>
                      <a
                        href={previewResource.directUrl || previewResource.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> فتح في نافذة مستقلة
                      </a>
                    </div>
                  )}
                  <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-200">
                    <iframe
                      src={previewResource.directUrl || previewResource.dataUrl}
                      title={previewResource.title}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
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

                  <div className="space-y-3">
                    <h4 className="font-black text-sm text-slate-900 border-r-4 border-red-600 pr-2">
                      مقدمة ومحاور المستند الأكاديمي:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/40 p-4 rounded-xl border border-amber-200/50 whitespace-pre-wrap">
                      {previewResource.description}
                    </p>
                  </div>

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
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                تم التنزيل {previewResource.downloadCount || 0} مرة
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
