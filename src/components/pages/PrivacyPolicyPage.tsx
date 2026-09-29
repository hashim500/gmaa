import React from 'react';
import { ShieldCheck, Lock, Eye, Cookie, FileText, CheckCircle2, ArrowRight, ExternalLink, Mail, AlertTriangle } from 'lucide-react';
import { LegalPageId } from '../../types';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: LegalPageId) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
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
            سياسة الخصوصية
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
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              سياسة الخصوصية وحماية البيانات (Privacy Policy)
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              آخر تحديث: <strong>10 سبتمبر 2026</strong>. نلتزم بأعلى معايير الشفافية واحترام سرية بياناتك ومستنداتك الشخصية.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Articles */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Section 1: Introduction */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              1
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              مقدمة ومبدأ الخصوصية الصارمة (Privacy by Design)
            </h2>
          </div>
          <p>
            أهلاً بك في منصة <strong>PdfDoer</strong>. نحن ندرك تماماً مدى حساسية المستندات التي تتعامل معها، مثل العقود القانونية، الشهادات، الفواتير، والسير الذاتية. لذلك صُممت منصتنا على مبدأ <strong>"المعالجة المحلية الصفرية" (Zero-Server Architecture)</strong>، حيث تتم كافة العمليات داخل متصفح الإنترنت بجهازك مباشرة دون رفع أي ملف إلى خوادمنا نهائياً.
          </p>
          <div className="mt-4 rounded-xl bg-teal-50/60 p-4 border border-teal-100 dark:bg-teal-950/30 dark:border-teal-900/40 text-xs">
            <strong className="text-teal-900 dark:text-teal-200 block mb-1">
              🔒 ضمان عدم رفع الملفات:
            </strong>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              عند استخدامك لأدوات دمج الـ PDF، أو تقطيعه، أو استخراج النصوص، أو كتابة السيرة الذاتية، فإن المعالجة تتم بنسبة 100% داخل ذاكرة الوصول العشوائي (RAM) لجهازك باستخدام تقنيات WebAssembly و JavaScript. لا نملك، ولا نستطيع، الاطلاع على أي مستند ترفعه.
            </p>
          </div>
        </section>

        {/* Section 2: Google AdSense & Third-Party Cookies (MANDATORY FOR ADSENSE) */}
        <section className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-xs dark:border-amber-900/50 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 font-bold text-xs">
              2
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              إعلانات Google AdSense وملفات تعريف الارتباط للطرف الثالث (Cookies)
            </h2>
          </div>
          <p className="mb-3">
            وفقاً لسياسات ومتطلبات برنامج <strong>Google AdSense</strong> ولوائح الإعلانات الرقمية العالمية، نوضح لزوارنا الكرام البنود الإلزامية التالية:
          </p>
          <ul className="list-disc list-inside space-y-2.5 pe-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>استخدام ملفات الكوكيز في الإعلانات:</strong> يستعين موقعنا بشركاء إعلانيين من أطراف ثالثة، وعلى رأسهم شركة <strong>Google LLC</strong>، لعرض الإعلانات عند زيارة موقعنا.
            </li>
            <li>
              <strong>ملف تعريف الارتباط DoubleClick DART:</strong> تستخدم Google ملفات تعريف الارتباط لعرض الإعلانات للمستخدمين بناءً على زياراتهم السابقة لهذا الموقع أو لمواقع أخرى عبر شبكة الإنترنت.
            </li>
            <li>
              <strong>الإعلانات المخصصة:</strong> يتيح استخدام ملفات تعريف الارتباط الإعلانية لشركة Google وشركائها إمكانية تقديم إعلانات ملائمة لاهتمامات الزائر.
            </li>
            <li>
              <strong>إلغاء الاشتراك في الإعلانات المخصصة:</strong> يحق لأي مستخدم إلغاء الاشتراك في الإعلانات المخصصة (Personalized Advertising) في أي وقت عبر زيارة صفحة{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-teal-600 hover:underline dark:text-teal-400"
              >
                إعدادات إعلانات Google
                <ExternalLink className="h-3 w-3" />
              </a>
              ، أو عبر موقع{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-teal-600 hover:underline dark:text-teal-400"
              >
                AboutAds.info
                <ExternalLink className="h-3 w-3" />
              </a>
              .
            </li>
            <li>
              لمزيد من التفاصيل حول كيفية إدارة Google للبيانات في منتجاتها الإعلانية، يمكنك مراجعة{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-teal-600 hover:underline dark:text-teal-400"
              >
                سياسة خصوصية إعلانات Google
                <ExternalLink className="h-3 w-3" />
              </a>
              .
            </li>
          </ul>
        </section>

        {/* Section 3: Data We Collect */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              3
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              البيانات التي نجمعها وكيفية التعامل معها
            </h2>
          </div>
          <p className="mb-3">
            حرصاً على الشفافية التامة، نحدد بدقة أنواع البيانات التي يتم التعامل معها:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                بيانات التفضيلات المحلية (LocalStorage)
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                نخزن محلياً فقط تفضيلاتك للغة (العربية/الإنجليزية) ووضع الشاشة (الداكن/الفاتح) لضمان تجربة مستخدم مريحة، ولا يتم إرسالها لأي جهة.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                سجلات الخادم القياسية (Log Files)
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                مثل معظم مواقع الويب، تسجل خوادم الاستضافة تلقائياً معلومات روتينية غير شخصية تشمل نوع المتصفح ومزود الخدمة وتوقيت الزيارة لأغراض صيانة البنية التحتية.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: GDPR Rights (Europe) & CCPA (California) */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              4
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              حقوق المستخدمين وفق لائحة GDPR وقانون كاليفورنيا CCPA
            </h2>
          </div>
          <p className="mb-3">
            إذا كنت من سكان الاتحاد الأوروبي أو ولاية كاليفورنيا، فإنك تتمتع بالحقوق القانونية التالية:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p><strong>• حق الوصول والاطلاع:</strong> معرفة أي بيانات تُعالج عنك وطلب نسخة منها.</p>
            <p><strong>• حق التصحيح والمحو:</strong> طلب تعديل أو مسح أي معلومات غير دقيقة.</p>
            <p><strong>• عدم بيع البيانات (Do Not Sell My Info):</strong> نؤكد التزامنا المطلق بأننا لا نبيع أو نؤجر أي بيانات مستخدمين لأي جهة تجارية كانت.</p>
            <p><strong>• سحب الموافقة:</strong> يمكنك في أي وقت تعديل موافقتك على الكوكيز من خلال شريط الخصوصية أو مسح سجل المتصفح.</p>
          </div>
        </section>

        {/* Section 5: Children's Privacy (COPPA) */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-bold text-xs">
              5
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              خصوصية الأطفال (COPPA Compliance)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            حماية خصوصية الأطفال أمر بالغ الأهمية بالنسبة لنا. منصتنا غير موجهة للأطفال دون سن 13 عاماً، ونحن لا نجمع عمداً أي بيانات شخصية تعريفية من الأطفال. إذا علمت أن طفلك قد زودنا بمعلومات دون موافقة ولي الأمر، يرجى مراسلتنا فوراً لاتخاذ التدابير اللازمة.
          </p>
        </section>

        {/* Section 6: Contact & Inquiries */}
        <section className="rounded-2xl border border-teal-200/60 bg-teal-50/40 p-6 shadow-xs dark:border-teal-900/40 dark:bg-teal-950/20">
          <div className="flex items-center gap-2.5 mb-2">
            <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              التواصل بخصوص الخصوصية وحماية البيانات
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            إذا كانت لديك أية أسئلة، أو استفسارات حول سياسة الخصوصية هذه، أو كنت ترغب في ممارسة أي من حقوقك القانونية، يسعدنا تواصلك معنا مباشرة عبر صفحة{' '}
            <button
              type="button"
              onClick={() => onNavigatePage('contact')}
              className="font-bold text-teal-700 underline dark:text-teal-300"
            >
              اتصل بنا
            </button>{' '}
            أو عبر البريد الإلكتروني الرسمي: <span className="font-mono font-bold text-slate-900 dark:text-white">privacy@pdftools.pro</span>.
          </p>
        </section>
      </div>

      {/* Footer page navigation shortcuts */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onNavigatePage('terms')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          ← شروط الاستخدام والخدمة
        </button>
        <button
          type="button"
          onClick={() => onNavigatePage('cookies')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          سياسة الكوكيز وإعداداتها →
        </button>
      </div>
    </div>
  );
};
