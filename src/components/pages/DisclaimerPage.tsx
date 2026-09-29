import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, ExternalLink, Megaphone, FileText } from 'lucide-react';
import { LegalPageId } from '../../types';

interface DisclaimerPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: LegalPageId) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({
  onBackToHome,
  onNavigatePage,
}) => {
  return (
    <div className="mx-auto max-w-4xl py-6 px-4 sm:px-6">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition"
          >
            الرئيسية
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            إخلاء المسؤولية والإعلانات
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          <span>العودة للأدوات الرئيسية</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="mb-8 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/70 p-6 shadow-xs dark:border-amber-900/50 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                إخلاء المسؤولية وسياسة الإفصاح الإعلاني (Disclaimer)
              </h1>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 dark:bg-amber-900/80 dark:text-amber-200">
                إفصاح قانوني وإعلاني
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              تاريخ التحديث: <strong>10 سبتمبر 2026</strong>. يوضح هذا البيان حدود المسؤولية القانونية وطبيعة الإعلانات المنشورة عبر Google AdSense.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Articles */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Section 1: Advertising Disclosure (AdSense Specific) */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-amber-600" />
            1. الإفصاح عن إعلانات الطرف الثالث (Google AdSense Disclosure)
          </h2>
          <p className="mb-3">
            تحتوي صفحات موقع <strong>PDF Tools</strong> على إعلانات رقمية تُدار وتقدم بواسطة شبكة <strong>Google AdSense</strong> وشبكات إعلانية شريكة. يرجى الانتباه إلى النقاط التالية:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pe-1">
            <li>
              <strong>تمييز الإعلانات:</strong> تظهر كافة المواد الإعلانية موسومة بوضوح بعبارة "إعلان" أو "Ads by Google" للفصل الصريح بين أدوات الموقع والمحتوى التجاري الترويجي.
            </li>
            <li>
              <strong>عدم التأييد أو الضمان:</strong> ظهور أي إعلان لمنتج أو خدمة على صفحاتنا لا يعني بأي حال من الأحوال تزكية أو مصادقة أو ضماناً من موقعنا لجودة أو أمان هذا المنتج أو المعلن.
            </li>
            <li>
              <strong>المعاملات الخارجية:</strong> عند النقر على أي رابط إعلاني، يتم توجيهك إلى مواقع ويب مستقلة تخضع لسياسات الخصوصية وشروط الاستخدام الخاصة بمالكيها، ولسنا طرفاً في أي تعامل ينشأ بينك وبينهم.
            </li>
          </ul>
        </section>

        {/* Section 2: Technical & Accuracy Disclaimer */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-teal-600" />
            2. دقة المعالجة والأدوات التقنية
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            نبذل أقصى جهودنا البرمجية لضمان عمل أدوات دمج وتقسيم وتعديل ملفات الـ PDF، وإنشاء السير الذاتية بأعلى دقة ممكنة. ومع ذلك، نظراً لاختلاف معايير وتشفيرات ملفات الـ PDF المتداولة حول العالم، فإننا لا نضمن خلو مخرجات التحويل من الأخطاء التنسيقية بنسبة 100%.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ننصح دائماً بمراجعة ومعاينة المستند الناتج قبل اعتماده رسمياً، والاحتفاظ بنسخة احتياطية من ملفاتك الأصلية قبل إجراء أي تعديل أو ضغط.
          </p>
        </section>

        {/* Section 3: Legal & Document Usage */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
            3. الاستخدام القانوني للمستندات والأختام والتوقيعات
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            المستخدم هو المسؤول القانوني الأول والأخير عن كافة المستندات والتوقيعات وبطاقات الهوية التي يعالجها أو يصدرها عبر الموقع. لا تتحمل المنصة أي مسؤولية مدنية أو جنائية عن أي استخدام غير مشروع، أو انتهاك لحقوق الطبع والنشر، أو تزوير مستندات رسمية.
          </p>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onNavigatePage('cookies')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          ← سياسة ملفات تعريف الارتباط
        </button>
        <button
          type="button"
          onClick={() => onNavigatePage('privacy')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          سياسة الخصوصية →
        </button>
      </div>
    </div>
  );
};
