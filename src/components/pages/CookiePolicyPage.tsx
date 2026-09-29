import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings, CheckCircle2, ArrowRight, ExternalLink, Save } from 'lucide-react';
import { LegalPageId } from '../../types';

interface CookiePolicyPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: LegalPageId) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({
  onBackToHome,
  onNavigatePage,
}) => {
  // User consent toggles
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [allowAds, setAllowAds] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pdftools_cookie_consent');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.analytics === 'boolean') setAllowAnalytics(parsed.analytics);
        if (typeof parsed.ads === 'boolean') setAllowAds(parsed.ads);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(
        'pdftools_cookie_consent',
        JSON.stringify({
          status: 'custom',
          essential: true,
          analytics: allowAnalytics,
          ads: allowAds,
          timestamp: new Date().toISOString(),
        })
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      // ignore
    }
  };

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
            سياسة ملفات تعريف الارتباط (Cookies)
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
      <div className="mb-8 rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/70 via-emerald-50/40 to-teal-50/70 p-6 shadow-xs dark:border-teal-900/50 dark:bg-gradient-to-r dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-teal-950/40">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-500/20">
            <Cookie className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                سياسة ملفات تعريف الارتباط وإعدادات الموافقة (Cookie Policy)
              </h1>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 dark:bg-teal-900/80 dark:text-teal-200">
                Google EU Consent & ePrivacy
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              توضح هذه الصفحة ما هي ملفات الكوكيز، وكيف نستخدمها مع شركائنا الإعلانيين (Google AdSense)، وكيف يمكنك التحكم فيها بحرية تامة.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Section 1: What is a cookie? */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-100 text-teal-800 text-xs font-bold dark:bg-teal-950 dark:text-teal-300">
              1
            </span>
            ما هي ملفات تعريف الارتباط (Cookies) والتخزين المحلي؟
          </h2>
          <p>
            ملفات تعريف الارتباط هي ملفات نصية صغيرة يضعها موقع الويب على حاسوبك أو هاتفك المحمول عند زيارته. تهدف هذه الملفات إلى تذكر تفضيلاتك وتسهيل التصفح، بالإضافة إلى مساعدة الشبكات الإعلانية في تقديم إعلانات ذات صلة باهتماماتك.
          </p>
        </section>

        {/* Section 2: Types of Cookies We Use */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-100 text-teal-800 text-xs font-bold dark:bg-teal-950 dark:text-teal-300">
              2
            </span>
            أنواع ملفات الكوكيز المستخدمة في موقعنا
          </h2>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  1. ملفات الكوكيز الضرورية والأساسية (Strictly Necessary)
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  إلزامية للعمل
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                ملفات لا غنى عنها لعمل الموقع التقني، وتستخدم لتذكر تفضيل اللغة التي تختارها، والوضع الليلي/الفاتح، وحفظ حالة جلسة التحرير الحالية في متصفحك. لا يمكن إيقافها.
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-950/40 dark:bg-amber-950/20">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  2. ملفات إعلانات Google AdSense (Advertising & Targeting Cookies)
                </span>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                  أطراف ثالثة
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                تستخدم Google وشركاؤها ملفات تعريف ارتباط (مثل ملف DoubleClick DART) لقياس أداء الحملات الإعلانية وتقديم إعلانات موجهة تهم الزائر. يمكنك دائماً إيقاف الإعلانات المخصصة عبر لوحة إعدادات Google.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  3. ملفات التحليلات وتحسين الأداء (Performance & Analytics)
                </span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                  اختيارية
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                تساعدنا في معرفة الصفحات الأكثر زيارة وأوقات الذروة دون جمع أي بيانات شخصية، بهدف تحسين استقرار وسرعة الأدوات.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Preference Manager */}
        <section className="rounded-2xl border border-teal-200 bg-white p-6 shadow-xs dark:border-teal-900/60 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-5 w-5 text-teal-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              لوحة التحكم بتفضيلاتك لملفات الكوكيز
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
            يمكنك تفعيل أو إلغاء تفعيل الفئات الاختيارية أدناه، ثم الضغط على "حفظ التفضيلات":
          </p>

          <div className="space-y-4">
            {/* Toggle 1: Essential (Disabled/Always active) */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  الكوكيز الأساسية والوظيفية
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  ضرورية لعمل محررات الـ PDF وحفظ لغة الواجهة
                </span>
              </div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                مفعلة دائماً
              </span>
            </div>

            {/* Toggle 2: Advertising / Google AdSense */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  إعلانات Google AdSense المخصصة
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  تسمح بعرض إعلانات ملائمة تدعم مجانية المنصة
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAds}
                  onChange={(e) => setAllowAds(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-slate-700 peer-checked:bg-teal-600"></div>
              </label>
            </div>

            {/* Toggle 3: Analytics */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  كوكيز الإحصاء والأداء المجهول
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  لقياس عدد الزيارات والصفحات النشطة
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAnalytics}
                  onChange={(e) => setAllowAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-slate-700 peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                تم حفظ تفضيلاتك بنجاح!
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                تسري التعديلات فوراً على جلسة تصفحك الحالية.
              </span>
            )}

            <button
              type="button"
              onClick={handleSavePreferences}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
            >
              <Save className="h-3.5 w-3.5" />
              <span>حفظ خياراتي</span>
            </button>
          </div>
        </section>

        {/* Section 4: Browser Level Controls */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
            كيف تعطل الكوكيز من إعدادات متصفحك مباشرة؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            تتيح معظم المتصفحات (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) حظر الكوكيز أو مسحها عبر إعدادات "الخصوصية والأمان" (Privacy & Security Settings).
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ملاحظة: حظر ملفات الكوكيز الأساسية قد يؤدي إلى فقدان إعداداتك المفضلة (مثل اللغة أو التفضيل الليلي) في كل مرة تعيد فيها فتح الموقع.
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
          onClick={() => onNavigatePage('disclaimer')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          إخلاء المسؤولية وسياسة الإعلانات →
        </button>
      </div>
    </div>
  );
};
