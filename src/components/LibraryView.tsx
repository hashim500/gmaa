import React, { useState } from 'react';
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
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { DEFAULT_LIBRARY_RESOURCES } from '../data/academicData';
import { LibraryResource } from '../types';

export const LibraryView: React.FC = () => {
  const [resources, setResources] = useState<LibraryResource[]>(DEFAULT_LIBRARY_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewResource, setPreviewResource] = useState<LibraryResource | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'كافة المراجع والمصادر' },
    { id: 'معايير محاسبية دولية', label: 'معايير IFRS / IAS' },
    { id: 'قوانين وضرائب سودانية', label: 'الضرائب والزكاة بالسودان' },
    { id: 'كتب ومقررات أكاديمية', label: 'المقررات الدراسية المعتمدة' },
    { id: 'أبحاث ودوريات محاسبية', label: 'المراجعة والأبحاث المهنية' },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      res.title.includes(searchQuery) ||
      res.author.includes(searchQuery) ||
      res.tags.some((t) => t.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (res: LibraryResource) => {
    setResources((prev) =>
      prev.map((item) =>
        item.id === res.id ? { ...item, downloadCount: item.downloadCount + 1 } : item
      )
    );
    setDownloadSuccess(res.title);
    setTimeout(() => setDownloadSuccess(null), 3500);

    // Create a simulated downloadable text blob representing the resource outline & summary
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-right flex-col md:flex-row">
            <CollegeLogo size="xl" />
            <div className="space-y-1.5">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black inline-block">
                المستودع والمكتبة المحاسبية الرقمية • NSCA E-Library
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                المكتبة المركزية للمراجع والمعايير المحاسبية
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                بوابة إلكترونية متكاملة تتيح لطلاب وباحثي الكلية الوصول المجاني إلى أحدث معايير المحاسبة الدولية (IFRS)، القوانين الضريبية السودانية، ومقررات برامج البكالوريوس المعتمدة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>تم بدء تنزيل المصدر الأكاديمي بنجاح: <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالعنوان، الكاتب، معايير IFRS، الضرائب، Odoo..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pr-11 pl-4 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-bold transition flex-shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-black">
                  {res.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-bold">
                  {res.format} • {res.fileSize}
                </span>
              </div>

              <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                {res.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {res.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {res.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-500 text-[11px]">
                <span>{res.pages} صفحة</span> • <span>{res.downloadCount} تنزيل</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-xl transition"
                  title="معاينة تفاصيل المصدر"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(res)}
                  className="bg-[#0b2545] hover:bg-[#133e68] text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  تحميل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
                {previewResource.category}
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">{previewResource.title}</h3>
              <p className="text-xs text-amber-900 font-bold">المؤلف / جهة الإصدار: {previewResource.author}</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">الملخص والبيان الأكاديمي:</p>
                {previewResource.description}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50/50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">سنة الإصدار</span>
                  <strong className="text-slate-800">{previewResource.year}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">عدد الصفحات</span>
                  <strong className="text-slate-800">{previewResource.pages} صفحة</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">حجم الملف</span>
                  <strong className="text-slate-800">{previewResource.fileSize}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
                className="px-6 py-2 bg-[#0b2545] hover:bg-[#133e68] text-white text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-400" /> تحميل الملف الأكاديمي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
