import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  Bell,
  Search,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Bookmark,
  Share2,
  FileText,
  AlertCircle,
  Building,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

interface NewsItem {
  id: string;
  title: string;
  category: 'أخبار الكلية' | 'تعاميم رسمية' | 'شؤون الطلاب' | 'امتحانات وجداول' | 'مؤتمرات وفعاليات';
  date: string;
  readTime: string;
  summary: string;
  content: string[];
  isImportant?: boolean;
  source: string;
  imageUrl?: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-1',
    title: 'بدء التسجيل للعام الجامعي 2025 / 2026 بكليات وبرامج كلية السودان الجديد للمحاسبة',
    category: 'تعاميم رسمية',
    date: '2026-09-20',
    readTime: '3 دقائق',
    isImportant: true,
    source: 'أمانة الشؤون العلمية وإدارة القبول',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    summary:
      'تعلن أمانة الشؤون العلمية عن فتح باب القبول والتسجيل المباشر والإلكتروني للطلاب الجدد من حملة الشهادة السودانية والشهادات العربية والأجنبية المعادلة.',
    content: [
      'تعلن كلية السودان الجديد للمحاسبة عن بدء إجراءات التقديم والقبول لبرامج البكالوريوس والدبلوم العالي للعام الدراسي 2025/2026م.',
      'تشمل البرامج المتاحة هذا العام: بكالوريوس المحاسبة والتمويل، بكالوريوس نظم المعلومات المحاسبية المحوسبة (AIS)، ودبلوم المحاسبة والمراجعة الضريبية المعتمد.',
      'يمكن للطلاب وأولياء الأمور إتمام إجراءات التقديم إلكترونياً بالكامل عبر بوابة القبول بالموقع، أو مراجعة مكاتب القبول بالكلية بالخرطوم مع إحضار أصول الشهادات والأوراق الثبوتية.',
    ],
  },
  {
    id: 'news-2',
    title: 'إعلان جدول الامتحانات النهائية للفصل الدراسي وتوزيع لجان المراقبة',
    category: 'امتحانات وجداول',
    date: '2026-09-18',
    readTime: '2 دقيقة',
    isImportant: true,
    source: 'لجنة الامتحانات المركزية',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    summary:
      'اعتمدت لجنة الامتحانات المركزية جدول الامتحانات النهائية لجميع المستويات الدراسية، مع التأكيد على ضرورة إبراز البطاقة الجامعية الذكية للدخول.',
    content: [
      'نهيب بجميع طلاب وطالبات الكلية الاطلاع على جدول الامتحانات النهائي عبر بوابة الطالب الذكية أو لوحات الإعلانات الرسمية.',
      'يُشترط لدخول قاعات الامتحان حمل البطاقة الجامعية الذكية المشفرة والالتزام التام بالزي الأكاديمي والمواعيد المحددة.',
      'تتمنى إدارة الكلية لجميع الطلاب التوفيق والنجاح والسداد.',
    ],
  },
  {
    id: 'news-3',
    title: 'تحديث منصة المقررات الرقمية وربط المكتبة ببنوك المعايير المحاسبية الدولية (IFRS)',
    category: 'أخبار الكلية',
    date: '2026-09-15',
    readTime: '4 دقائق',
    isImportant: false,
    source: 'مركز التعليم الإلكتروني وتقنية المعلومات',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    summary:
      'تم بنجاح تحديث المكتبة الرقمية وإتاحة أحدث الإصدارات الدولية من معايير المحاسبة والتقارير المالية للطلاب والباحثين مع إمكانية التحميل والمعاينة المباشرة.',
    content: [
      'في إطار خطة الكلية للتحول الرقمي وتوفير المراجع العالمية، أطلقت عمادة الكلية التحديث الشامل للمكتبة الرقمية.',
      'يتضمن التحديث أكثر من 500 كتاب ومرجع معتمد في فروع المحاسبة الإدارية، الضرائب السودانية، المراجعة والتدقيق، ونظم تخطيط الموارد ERP.',
      'المستندات متاحة بصيغة PDF وتدعم التصفح المباشر والقراءة داخل المتصفح أو التنزيل للأجهزة الشخصية.',
    ],
  },
  {
    id: 'news-4',
    title: 'ورشة عمل تطبيقية حول "التحول نحو الفاتورة الإلكترونية والأنظمة الضريبية المحوسبة"',
    category: 'مؤتمرات وفعاليات',
    date: '2026-09-10',
    readTime: '3 دقائق',
    isImportant: false,
    source: 'قسم المحاسبة وشؤون التدريب المهني',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    summary:
      'نظمت الكلية ورشة تدريبية لطلاب المستويين الثالث والرابع بالتعاون مع خبراء في ديوان الضرائب وأنظمة تخطيط المؤسسات المالية.',
    content: [
      'شهدت قاعة المؤتمرات الكبرى بالكلية انعقاد ورشة عمل متخصصة حول تطبيقات الفاتورة الضريبية الرقمية ومراجعة الحسابات الآلية.',
      'استعرضت الورشة سيناريوهات واقعية للشركات وكيفية إعداد التسويات البنكية والبيانات المالية المعيارية.',
      'سيحصل المشاركون في نهاية الدورة على شهادة حضور معتمدة ضمن برنامج التطوير المهني المستمر.',
    ],
  },
  {
    id: 'news-5',
    title: 'تعميم إداري: تفعيل خدمة سداد الرسوم الجامعية عبر التطبيقات البنكية (بنكك وفوري)',
    category: 'شؤون الطلاب',
    date: '2026-09-05',
    readTime: '2 دقيقة',
    isImportant: true,
    source: 'الإدارة المالية والحسابات',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    summary:
      'حرصاً على راحة الطلاب وأولياء الأمور، تم توفير خدمات الدفع الإلكتروني المباشر واستخراج سندات القبض الفورية عبر المنظومة.',
    content: [
      'تعلن الإدارة المالية بكلية السودان الجديد للمحاسبة عن تفعيل استقبال الرسوم الدراسية ورسوم الشهادات عبر الحسابات البنكية الرسمية للكلية.',
      'بعد إتمام عملية التحويل، يقوم الطالب برفع إشعار التحويل عبر بوابة السداد الإلكتروني بالمنصة للحصول على إيصال التوريد المالي المعتمد فوراً.',
    ],
  },
];

interface NewsAnnouncementsViewProps {
  onBackToHome?: () => void;
  onNavigate?: (view: string) => void;
}

export const NewsAnnouncementsView: React.FC<NewsAnnouncementsViewProps> = ({
  onBackToHome,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const categories = ['الكل', 'تعاميم رسمية', 'أخبار الكلية', 'امتحانات وجداول', 'شؤون الطلاب', 'مؤتمرات وفعاليات'];

  const filteredNews = NEWS_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'الكل' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* HERO BANNER */}
      <div className="bg-[#0b2545] text-white border-b-4 border-[#c59b6d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#c59b6d_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#c59b6d]/20 border border-[#c59b6d]/40 text-[#fae588] text-xs font-black px-3.5 py-1 rounded-full">
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span>المركز الإعلامي والأخبار الرسمية</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                الأخبار والتعاميم والقرارات الرسمية
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                متابعة حية لكافة القرارات الأكاديمية الصادرة عن عمادة الكلية، مواعيد الامتحانات، التقويم الجامعي، والفعاليات العلمية المستمرة.
              </p>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <span>العودة للرئيسية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="ابحث في الأخبار والتعاميم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0b2545]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          {/* Categories Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#0b2545] text-amber-300 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* NEWS LISTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#c59b6d] transition overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image or Category Header */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="bg-[#0b2545]/90 backdrop-blur-xs text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-300/30">
                      {item.category}
                    </span>
                    {item.isImportant && (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs animate-pulse">
                        هام وعاجل
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 text-white text-xs flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-[11px]">{item.date}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-[11px] text-slate-200">{item.source}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-black text-base text-slate-900 group-hover:text-[#0b2545] transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.summary}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">وقت القراءة: {item.readTime}</span>
                <button
                  onClick={() => setSelectedArticle(item)}
                  className="bg-amber-50 hover:bg-amber-100 text-[#8a6135] font-black text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>قراءة الخبر كاملاً</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 my-8 space-y-3">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">لا توجد أخبار مطابقة لبحثك</h4>
            <p className="text-xs text-slate-500">جرب كتابة كلمات مختلفة أو اختر تصنيفاً آخر.</p>
          </div>
        )}
      </div>

      {/* ARTICLE DETAILS MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-fade-in">
            {/* Modal Header */}
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-xs transition"
              >
                ✕
              </button>

              <div className="absolute bottom-5 right-5 left-5 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#c59b6d] text-[#0b2545] text-xs font-black px-2.5 py-0.5 rounded-md">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">{selectedArticle.date}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-300">{selectedArticle.source}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-bold text-[#8a6135] leading-relaxed">
                {selectedArticle.summary}
              </div>

              <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CollegeLogo size="sm" />
                  <span className="font-bold text-slate-700">كلية السودان الجديد للمحاسبة</span>
                </div>
                <span>المركز الإعلامي المعتمد</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition"
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
