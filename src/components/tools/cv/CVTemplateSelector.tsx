import React from 'react';
import {
  Layers,
  FileSpreadsheet,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  UserCheck,
  GraduationCap,
  Briefcase,
  ChevronLeft,
} from 'lucide-react';
import { CVTemplate } from '../CVBuilderTool';

interface CVTemplateSelectorProps {
  onSelectTemplate: (template: CVTemplate) => void;
  onBack: () => void;
}

export const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({
  onSelectTemplate,
  onBack,
}) => {
  const templates = [
    {
      id: 'modern' as CVTemplate,
      title: 'السيرة الذاتية العصرية',
      enTitle: 'Two-Column Modern',
      badge: 'الأكثر طلباً للشركات والوظائف التقنية',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      icon: Layers,
      iconColor: 'bg-indigo-600 text-white',
      accentBorder: 'hover:border-indigo-500 focus:border-indigo-500',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      description:
        'تصميم ثنائي الأعمدة مع شريط جانبي مخصص لمعلومات الاتصال والصورة والمهارات التفاعلية، وعمود رئيسي للمسار المهني والتعليم.',
      highlights: [
        'شريط جانبي ملون للبيانات الشخصية والصورة',
        'مؤشرات ونسب مئوية تفاعلية للمهارات التقنية',
        'عرض بارز للنبذة التعريفية وتفاصيل الخبرات',
        'خيارات ألوان عصرية وخطوط حديثة مريحة للعين',
      ],
      suitableFor: 'المطورون، المصممون، المسوقون، والمهن الإدارية والتقنية الحديثة',
    },
    {
      id: 'table' as CVTemplate,
      title: 'سيرة الجدول التفاعلي',
      enTitle: 'Interactive Tabular',
      badge: 'معتمد للمسابقات والجهات الحكومية والمالية',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: FileSpreadsheet,
      iconColor: 'bg-emerald-600 text-white',
      accentBorder: 'hover:border-emerald-500 focus:border-emerald-500',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      description:
        'تصميم رسمي مقسم لجداول تفاعلية واضحة ومحددة، يسهل على لجان الفحص والتوظيف مراجعة التواريخ والجهات والمؤهلات بنظرة سريعة.',
      highlights: [
        'جداول مستقلة: المؤهلات، الخبرات، والدورات',
        'إمكانية إضافة وحذف صفوف الجداول ديناميكياً',
        'ترتيب بيانات الهوية الوطنية وتاريخ الميلاد بدقة',
        'تنسيق جدولي احترافي مع خطوط واضحة وحدود مريحة',
      ],
      suitableFor: 'القطاع الحكومي، المحاسبون، الماليون، والوظائف الإدارية والرقابية',
    },
    {
      id: 'classic' as CVTemplate,
      title: 'السيرة الذاتية الكلاسيكية',
      enTitle: 'Classic Academic',
      badge: 'للأساتذة، الباحثين، والأطباء والمهندسين',
      badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: Award,
      iconColor: 'bg-amber-600 text-white',
      accentBorder: 'hover:border-amber-500 focus:border-amber-500',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      description:
        'تنسيق أكاديمي رصين بتسلسل زمني دقيق مخصص للمسار العلمي والجامعي، مع تركيز خاص على الأبحاث المنشورة والتوصيات والشهادات العليا.',
      highlights: [
        'أقسام مخصصة للأبحاث والأوراق العلمية ورابط ORCID',
        'توثيق الأطروحات والمشرفين والدرجات العليا (دكتوراه/ماجستير)',
        'حقول الخبرات التدريسية والمقررات الأكاديمية واللجان',
        'توثيق الجوائز والمنح والمعرفين الأكاديميين',
      ],
      suitableFor: 'الأكاديميون، المحاضرون، الباحثون، الأطباء، والمستشارون القانونيون',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للأدوات</span>
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              منشئ السيرة الذاتية الاحترافي (CV Builder)
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              اختر القالب الأنسب لطبيعة وظيفتك ومجالك للبدء في تحرير الحقول المخصصة له
            </p>
          </div>
        </div>
      </div>

      {/* 3 Template Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.id}
              className={`group flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${tpl.accentBorder}`}
            >
              {/* Card Top: Header & Badges */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tpl.iconColor} shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${tpl.badgeColor}`}>
                    {tpl.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {tpl.title}
                  </h3>
                  <div className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    {tpl.enTitle}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Highlights list */}
                <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    أبرز ميزات لوحة التحكم:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {tpl.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suitable for note */}
                <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-200">الأنسب لـ: </strong>
                  {tpl.suitableFor}
                </div>
              </div>

              {/* Card Bottom: Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectTemplate(tpl.id)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl ${tpl.btnColor} py-3 px-4 text-xs font-black text-white shadow-md transition-all active:scale-98 cursor-pointer`}
                >
                  <span>بدء تعديل {tpl.title}</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
