import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2, Cpu, Zap, FileText, Lock } from 'lucide-react';
import { LegalPageId } from '../types';

interface HomeEducationalGuideProps {
  onNavigatePage: (page: LegalPageId) => void;
}

export const HomeEducationalGuide: React.FC<HomeEducationalGuideProps> = ({
  onNavigatePage,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'كيف تضمن منصة PdfDoer سرية وأمان مستنداتي وملفاتي؟',
      a: 'تعتمد منصتنا على تقنية المعالجة من جانب العميل (Client-Side Processing) بنسبة 100%. عند اختيارك لأي ملف أو تعديله، تتم قراءته ومعالجته داخل ذاكرة المتصفح عبر شفرات JavaScript و WebAssembly. لا يتم رفع أي بايت واحد إلى خوادم الإنترنت، وتظل وثائقك محمية داخل جهازك الشخصي تماماً.',
    },
    {
      q: 'هل الأدوات مجانية بالكامل؟ وهل توجد قيود على عدد الملفات أو علامات مائية؟',
      a: 'نعم، جميع الأدوات (منشئ السير الذاتية، دمج الـ PDF، التقسيم، إزالة الأختام، حماية المستندات) مجانية وغير مقيدة، ولا نضع أي علامة مائية إجبارية على مخرجاتك. يتم تمويل المنصة عبر إعلانات Google AdSense المفلترة وغير المزعجة لضمان استمرار المجانية.',
    },
    {
      q: 'ما هي معايير السيرة الذاتية القياسية لدعم أنظمة التوظيف (ATS)؟',
      a: 'صُمم محرر السيرة الذاتية لدينا وفق مقاس الورق القياسي A4 ومعدل دقة طباعة 300 DPI، مع تنظيم بيانات الاتصال، والخبرات، والمؤهلات الأكاديمية بنصوص واضحة وقابلة للقراءة من خوارزميات الفرز الآلي للوظائف (ATS).',
    },
    {
      q: 'هل يمكنني استخدام الأدوات في وضع عدم الاتصال (Offline)؟',
      a: 'نعم! بمجرد تحميل الصفحة في متصفحك لأول مرة، يمكنك الاستمرار في دمج المستندات وتقسيمها حتى وإن انقطع اتصالك بالإنترنت، لأن محرك المعالجة يعمل محلياً في جهازك.',
    },
    {
      q: 'كيف تؤثر ملفات الكوكيز والإعلانات على استخدامي للموقع؟',
      a: 'نستخدم ملفات الكوكيز الضرورية لحفظ تفضيلاتك (مثل اللغة والمظهر الداكن). كما تستخدم شبكة Google AdSense ملفات تعريف الارتباط الإعلانية لعرض إعلانات ملائمة. يمكنك دائماً إدارة وتعديل موافقتك عبر صفحة سياسة الكوكيز.',
    },
  ];

  return (
    <section className="no-print mt-16 space-y-10">
      {/* 3-Step Educational Overview */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 text-center">
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            دليل الأمان وسرعة الإنجاز
          </span>
          <h2 className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            كيف تعمل أدوات PdfDoer في متصفحك مباشرة؟
          </h2>
          <p className="mx-auto mt-1 max-w-xl text-xs text-slate-600 dark:text-slate-400">
            ثلاث خطوات بسيطة تمنحك تحكماً كاملاً بمستنداتك مع ضمان خصوصية لا تضاهى
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-sm mb-3">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              اختر أداتك وارفع ملفك
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              اختر الأداة المطلوبة (دمج، تقسيم، ضغط، حماية) ثم اسحب ملفاتك أو اخترها. يُفتح الملف فوراً في المتصفح دون انتظار رفع عبر الإنترنت.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm mb-3">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              معالجة محلية بالكامل
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              تتم العمليات الحسابية وقراءة الصفحات وتعديل الـ PDF محلياً داخل ذاكرة جهازك باستخدام خوارزميات الويب الحديثة المدمجة.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800/80 dark:bg-slate-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm mb-3">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              تنزيل فوري عالي الجودة
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              احصل على ملفك المنتهي جاهزاً للطباعة أو الإرسال بدقة فائقة وبدون أي علامات مائية أو اشتراكات مدفوعة.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion FAQs Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal-600" />
              الأسئلة الشائعة حول المنصة والأمان (FAQ)
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              إجابات واضحة وشفافة حول آلية عمل الموقع وحقوقك
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigatePage('privacy')}
            className="text-xs font-bold text-teal-700 hover:underline dark:text-teal-400"
          >
            اطلع على سياسة الخصوصية الكاملة ←
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/70 transition dark:border-slate-800 dark:bg-slate-800/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  <span className="pe-2">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-teal-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-slate-200/60 p-4 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
