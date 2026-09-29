import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, AlertCircle, Copy, Check, ArrowRight } from 'lucide-react';
import { LegalPageId } from '../../types';

interface ContactUsPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: LegalPageId) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onBackToHome,
  onNavigatePage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; email: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactEmail = 'support@pdftools.pro';

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('يرجى ملء كافة الحقول الإلزامية (الاسم، البريد الإلكتروني، ونص الرسالة)');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح للتواصل معك');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketNum = 'TK-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicket({
        id: ticketNum,
        email: email.trim(),
      });
      // Clear form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 900);
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
            اتصل بنا
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
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                اتصل بنا وتواصل مع فريق العمل
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                رد خلال 24-48 ساعة
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              يسعدنا دائماً تلقي اقتراحاتكم، واستفساراتكم الفنية، أو طلبات الدعم والإعلانات. فريقنا متواجد للرد على كافة الرسائل.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main: Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              أرسل رسالة مباشرة
            </h2>

            {submittedTicket ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  تم استلام رسالتك بنجاح!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  شكراً لتواصلك معنا. تم إنشاء تذكرة متابعة برقم{' '}
                  <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                    {submittedTicket.id}
                  </strong>
                  . سيصلك الرد على بريدك:{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {submittedTicket.email}
                  </span>{' '}
                  خلال مدة أقصاها 48 ساعة.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمد"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Category & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      تصنيف الرسالة
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="support">دعم فني واستخدام الأدوات</option>
                      <option value="feedback">اقتراح ميزة أو أداة جديدة</option>
                      <option value="bug">الإبلاغ عن خلل أو خطأ برمجي</option>
                      <option value="advertising">استفسار إعلاني أو شراكة</option>
                      <option value="privacy">الخصوصية وحقوق البيانات (GDPR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      موضوع الرسالة
                    </label>
                    <input
                      type="text"
                      placeholder="عنوان مختصر للرسالة"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    تفاصيل الرسالة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="اكتب رسالتك أو استفسارك هنا بكل وضوح..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    🔒 جميع بياناتك محمية وفقاً لسياسة الخصوصية.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right/Side: Official Contact Details & Info */}
        <div className="space-y-4">
          {/* Email card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-teal-600" />
              البريد الإلكتروني المباشر
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              يمكنك مراسلتنا مباشرة من بريدك الإلكتروني في أي وقت:
            </p>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
              <span className="truncate">{contactEmail}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-teal-700 shadow-2xs hover:bg-slate-100 dark:bg-slate-700 dark:text-teal-300"
                title="نسخ البريد"
              >
                {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedEmail ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          {/* Working Hours & SLA */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              أوقات الاستجابة والمساعدة
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center justify-between">
                <span>أيام العمل:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">طوال أيام الأسبوع</span>
              </li>
              <li className="flex items-center justify-between">
                <span>متوسط الرد:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">خلال 24 إلى 48 ساعة</span>
              </li>
              <li className="flex items-center justify-between">
                <span>الدعم الفني:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">مجاني 100%</span>
              </li>
            </ul>
          </div>

          {/* FAQs shortcut */}
          <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 text-xs dark:border-teal-900/40 dark:bg-teal-950/20">
            <strong className="text-teal-950 dark:text-teal-200 block mb-1">
              💡 هل تبحث عن إجابة فورية؟
            </strong>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              اطلع على سياسات الموقع لمزيد من الإيضاحات حول الأمان والخصوصية:
            </p>
            <div className="flex flex-col gap-1.5 font-semibold text-teal-700 dark:text-teal-300">
              <button
                type="button"
                onClick={() => onNavigatePage('privacy')}
                className="text-right hover:underline"
              >
                • كيف نضمن سرية مستنداتك؟
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage('cookies')}
                className="text-right hover:underline"
              >
                • ما هي ملفات الكوكيز المستخدمة في الموقع؟
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onNavigatePage('about')}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          ← عن المنصة ورسالتها
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
