import React from 'react';
import { Info, Sparkles, ShieldCheck, HeartHandshake, Laptop, Cpu, CheckCircle2, ArrowRight, Zap, Award } from 'lucide-react';
import { LegalPageId } from '../../types';

interface AboutUsPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: LegalPageId) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
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
            من نحن
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

      {/* Hero Header */}
      <div className="mb-8 rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-teal-50/80 p-6 sm:p-8 shadow-xs dark:border-teal-900/50 dark:bg-gradient-to-r dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-teal-950/40">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-500/25">
            <Info className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                عن منصة PdfDoer — رؤيتنا ورسالتنا
              </h1>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 dark:bg-teal-900/80 dark:text-teal-200">
                100% مجانية وخاصة
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              منصة عربية متطورة توفر حزمة أدوات مستندات متكاملة تعمل بالكامل داخل متصفحك. هدفنا تمكين الأفراد والمؤسسات والطلاب من معالجة ملفاتهم بحرية، وسرعة فائقة، وسرية مطلقة دون الحاجة لرفعها إلى أي خادم خارجي.
            </p>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Story & Problem We Solve */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            لماذا أنشأنا PdfDoer؟
          </h2>
          <p className="mb-3">
            تحتاج غالبية أدوات تعديل وتحويل ملفات الـ PDF الشائعة على الإنترنت إلى رفع المستندات إلى خوادم سحابية مجهولة، مما يعرض البيانات المالية، والسجلات الطبية، والهويات الرسمية، والاتفاقيات التجارية لمخاطر التجسس أو التسريب الرقمي.
          </p>
          <p>
            انطلق مشروع <strong>PdfDoer</strong> للإجابة على هذا التحدي: <em>"كيف نمكن المستخدم من دمج، تقسيم، ضغط، وتعديل ملفات الـ PDF، وإنشاء السير الذاتية الاحترافية بأعلى جودة مع ضمان عدم خروج الملف من جهازه إطلاقاً؟"</em>
          </p>
        </section>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              الخصوصية أولاً (Privacy by Design)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              ملفاتك تبقى لك وحدك. كل كود المعالجة يُنفذ محلياً في جهازك بدون تخزين سحابي.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              سرعة فورية بدون انتظار
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              لا وجود لأوقات رفع وتنزيل طويلة؛ المعالجة سريعة كسرعة حاسوبك أو هاتفك.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-3">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              أدوات احترافية غير مقيدة
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              أدوات دمج، تقسيم، كتابة سيرة ذاتية A4، واستخراج أختام، بدون علامات مائية إجبارية.
            </p>
          </div>
        </div>

        {/* Technologies behind */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-teal-600" />
            التقنيات المستخدمة
          </h2>
          <p className="mb-4">
            تعتمد المنصة على أحدث معايير الويب المفتوحة (Open Web Standards)، ومن أبرزها:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
              <div>
                <strong>مكتبة PDF-Lib & WebAssembly:</strong> لقراءة وتعديل وتقسيم ملفات الـ PDF الثنائية مباشرة في المتصفح.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
              <div>
                <strong>HTML5 Canvas & Rendering Engines:</strong> لتوليد السير الذاتية وتصديرها بجودة طباعة فائقة 300 DPI.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
              <div>
                <strong>React 18 & TypeScript:</strong> لضمان أداء مستقر، متجاوب، وخالٍ من الأخطاء عبر كافة الأجهزة والهواتف.
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
              <div>
                <strong>Web Crypto API:</strong> لتطبيق التشفير وحماية المستندات بكلمات مرور بأمان تام.
              </div>
            </div>
          </div>
        </section>

        {/* How we keep it free (AdSense Transparency) */}
        <section className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-amber-600" />
            كيف نبقي الموقع مجانياً؟ (الشفافية الإعلانية)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            تطوير وصيانة أدوات المستندات وتوفير البنية التحتية يتطلب تكاليف تشغيلية ومجهوداً برمجياً مستمراً. لكي نتمكن من تقديم هذه الأدوات <strong>مجاناً 100%</strong> لجميع الطلاب والمستخدمين دون اشتراكات شهرية أو بيع أي بيانات، فإننا نعتمد على عرض إعلانات رقمية غير مزعجة من خلال برنامج <strong>Google AdSense</strong>.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            وجود الإعلانات المنضبطة هو شريان الحياة الذي يضمن استمرار هذا المشروع مفتوحاً ومتاحاً للجميع، مع احترامنا الكامل لتجربة تصفحك وخصوصيتك.
          </p>
        </section>
      </div>

      {/* Footer navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onNavigatePage('terms')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          ← شروط الاستخدام
        </button>
        <button
          type="button"
          onClick={() => onNavigatePage('contact')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          تواصل معنا →
        </button>
      </div>
    </div>
  );
};
