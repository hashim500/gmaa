import React from 'react';
import { FileCheck, Shield, AlertCircle, Scale, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { LegalPageId } from '../../types';

interface TermsOfServicePageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: LegalPageId) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({
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
            شروط الاستخدام والخدمة
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
      <div className="mb-8 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-teal-50/30 to-slate-50 p-6 shadow-xs dark:border-slate-800 dark:bg-gradient-to-r dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-500/20">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                شروط الاستخدام والاتفاقية (Terms of Service)
              </h1>
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                اتفاقية الاستخدام القانوني
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              تاريخ السريان: <strong>10 سبتمبر 2026</strong>. تحدد هذه الشروط التزاماتك كزائر وحقوقك عند استخدام منصة PdfDoer.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Articles */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Section 1: Acceptance */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              1
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              قبول الشروط والأهلية
            </h2>
          </div>
          <p>
            بدخولك واستخدامك لمنصة <strong>PdfDoer</strong>، فإنك توافق صراحةً وكاملاً على الالتزام بكافة الشروط والأحكام الواردة هنا، وبسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى التوقف عن استخدام المنصة فوراً.
          </p>
        </section>

        {/* Section 2: Permitted Usage & Intellectual Property */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              2
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              الاستخدام المسموح به وحقوق الملكية الفكرية
            </h2>
          </div>
          <p className="mb-3">
            نمنحك ترخيصاً مجانياً، غير حصري، وقابلاً للإلغاء لاستخدام الأدوات والميزات المتاحة للأغراض الشخصية أو التجارية المشروعة:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pe-1">
            <li>
              <strong>ملكية المستندات والملفات:</strong> تحتفظ بملكية جميع المستندات والصور والسير الذاتية التي تنشئها أو تعالجها. نحن لا ندعي أي حق ملكية لمحتواك.
            </li>
            <li>
              <strong>حقوق برمجيات المنصة:</strong> كافة التصاميم البرمجية، العلامات، الأيقونات، والشفرات المصدرية هي ملك حصري لمنصة PDF Tools ومحمية بموجب قوانين الملكية الفكرية وحقوق النشر.
            </li>
          </ul>
        </section>

        {/* Section 3: User Obligations & Prohibited Conduct */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              3
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              التزامات المستخدم والاستخدام المحظور
            </h2>
          </div>
          <p className="mb-3">
            يُحظر تماماً استخدام أدوات الموقع في أي من الأنشطة التالية:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5 dark:border-red-900/30 dark:bg-red-950/20">
              <strong className="text-red-900 dark:text-red-200 block mb-1">
                🚫 التزوير والانتهاك غير القانوني:
              </strong>
              <p className="text-slate-600 dark:text-slate-400">
                معالجة أو تعديل أو إزالة الأختام أو التوقيعات من مستندات أو هويات رسمية دون تفويض قانوني صريح من صاحب الحق.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5 dark:border-red-900/30 dark:bg-red-950/20">
              <strong className="text-red-900 dark:text-red-200 block mb-1">
                🚫 الإضرار بالبنية التحتية:
              </strong>
              <p className="text-slate-600 dark:text-slate-400">
                محاولة إغراق الموقع بهجمات حرمان من الخدمة (DoS) أو كشط البيانات آلياً (Scraping) بصورة غير مصرح بها.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Google AdSense & Third-Party Services */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              4
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              الإعلانات والخدمات التابعة لأطراف ثالثة (AdSense)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            قد يعرض الموقع إعلانات تجارية تديرها شبكة <strong>Google AdSense</strong> أو شبكات إعلانية شريكة. نحن لا نتحمل أي مسؤولية قانونية عن محتوى أو دقة أو جودة أي سلع أو خدمات يتم الإعلان عنها عبر تلك الشبكات الخارجية، وأي تعامل تجاري بينك وبين تلك الأطراف هو على مسؤوليتك الخاصة.
          </p>
        </section>

        {/* Section 5: Disclaimer of Warranties & Limitation of Liability */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              5
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              إخلاء المسؤولية وحدود الضمان (Disclaimer of Warranties)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            يتم توفير خدمات المنصة والأدوات البرمجية <strong>"كما هي" (AS IS)</strong> و <strong>"كما هي متاحة" (AS AVAILABLE)</strong> دون أي ضمانات صريحة أو ضمنية تتعلق بالدقة، أو ملاءمة غرض معين، أو التوافق التام مع كافة برامج قراءة ملفات الـ PDF الخارجية.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            إلى أقصى حد يسمح به القانون المعمول به، لا تتحمل المنصة أو القائمون عليها أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة، أو فقدان للبيانات، أو أخطاء ناتجة عن استخدام الموقع.
          </p>
        </section>

        {/* Section 6: Modifications */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              6
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              تعديل الشروط والاتفاقية
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            نحتفظ بالحق في تحديث وتعديل هذه الشروط في أي وقت. وسيتم نشر التعديلات في هذه الصفحة مع تحديث تاريخ "تاريخ السريان". استمرارك في استخدام الموقع بعد نشر أي تعديل يُعتبر قبولاً صريحاً منك بتلك التعديلات.
          </p>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onNavigatePage('privacy')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          ← سياسة الخصوصية
        </button>
        <button
          type="button"
          onClick={() => onNavigatePage('about')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          من نحن / عن المنصة →
        </button>
      </div>
    </div>
  );
};
