import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Printer,
  Sparkles,
  AlertCircle,
  FileText,
  Building,
  GraduationCap,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

interface AcademicCalendarViewProps {
  onBackToHome?: () => void;
  onNavigate?: (view: string) => void;
}

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({
  onBackToHome,
  onNavigate,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const admissionTimeline = [
    {
      phase: 'المرحلة الأولى',
      title: 'فتح باب التقديم الإلكتروني والمباشر للطلاب الجدد',
      date: 'من 01 سبتمبر 2025 إلى 15 أكتوبر 2025',
      status: 'مستمر حالياً',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      details: 'استقبال طلبات الالتحاق لبرامج البكالوريوس والدبلوم عبر البوابة الإلكترونية ومكتب القبول المركزي بالكلية.',
    },
    {
      phase: 'المرحلة الثانية',
      title: 'معاينة الشهادات ومطابقة الأصول وإجراء المقابلات',
      date: 'من 16 أكتوبر 2025 إلى 25 أكتوبر 2025',
      status: 'قريباً',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      details: 'مراجعة أصول الشهادات الثانوية ومعادلات وزارة التعليم العالي للشهادات العربية والأجنبية.',
    },
    {
      phase: 'المرحلة الثالثة',
      title: 'إعلان قوائم المقبولين وإصدار أرقام القيد الجامعي',
      date: '28 أكتوبر 2025',
      status: 'مجدول',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      details: 'إرسال رسائل القبول عبر البريد الإلكتروني والرسائل النصية وتفعيل بوابات الطلاب الذكية.',
    },
    {
      phase: 'المرحلة الرابعة',
      title: 'فترة سداد الرسوم وإصدار البطاقات الجامعية الذكية',
      date: 'من 01 نوفمبر 2025 إلى 15 نوفمبر 2025',
      status: 'مجدول',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-300',
      details: 'إتمام إجراءات السداد المصرفي واستلام البطاقات الجامعية المشفرة (CR80) وحزم المقررات.',
    },
  ];

  const semester1Events = [
    { date: '2025-11-16', event: 'بدء الدراسة والمحاضرات للفصل الدراسي الأول لجميع المستويات', type: 'academic' },
    { date: 'من 16 إلى 26 نوفمبر 2025', event: 'فترة الحذف والإضافة للمقررات الدراسية وتعديل الجداول', type: 'admin' },
    { date: '2026-01-01', event: 'عطلة رأس السنة الميلادية وعيد الاستقلال الوطني', type: 'holiday' },
    { date: 'من 10 إلى 18 يناير 2026', event: 'امتحانات منتصف الفصل الدراسي الأول (Midterm Exams)', type: 'exam' },
    { date: '2026-02-15', event: 'نهاية المحاضرات للفصل الدراسي الأول وبدء أسبوع المراجعة والاستعداد', type: 'academic' },
    { date: 'من 22 فبراير إلى 08 مارس 2026', event: 'الامتحانات النهائية للفصل الدراسي الأول (Final Exams)', type: 'exam' },
    { date: 'من 09 إلى 22 مارس 2026', event: 'إجازة منتصف العام الدراسي وإعلان النتائج', type: 'holiday' },
  ];

  const semester2Events = [
    { date: '2026-03-23', event: 'بدء الدراسة والمحاضرات للفصل الدراسي الثاني', type: 'academic' },
    { date: 'من 23 إلى 31 مارس 2026', event: 'فترة تأكيد التسجيل وسداد القسط الثاني من الرسوم الدراسية', type: 'admin' },
    { date: 'من 10 إلى 18 مايو 2026', event: 'امتحانات منتصف الفصل الدراسي الثاني (Midterm Exams)', type: 'exam' },
    { date: '2026-06-20', event: 'نهاية المحاضرات للفصل الدراسي الثاني وتجهيز مشاريع التخرج', type: 'academic' },
    { date: 'من 28 يونيو إلى 12 يوليو 2026', event: 'الامتحانات النهائية للفصل الدراسي الثاني ومناقشة بحوث التخرج', type: 'exam' },
    { date: '2026-07-25', event: 'إعلان النتائج واعتماد كشوفات الخريجين من مجلس الأساتذة', type: 'admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-[#0b2545] text-white border-b-4 border-[#c59b6d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#c59b6d_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#c59b6d]/20 border border-[#c59b6d]/40 text-[#fae588] text-xs font-black px-3.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>أمانة الشؤون العلمية والتقويم المعتمد</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                مواعيد القبول والتقويم الجامعي 2025 / 2026
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                الجدول الزمني الموحد لمراحل القبول والتسجيل، المواعيد الأكاديمية، فترات الامتحانات، والعطل الرسمية لكافة الفرق الدراسية.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] font-black px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التقويم</span>
              </button>
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <span>الرئيسية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {/* ADMISSION TIMELINE SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600" />
              <div>
                <h2 className="text-lg font-black text-slate-900">أولاً: مواعيد وإجراءات القبول والتسجيل 2025 / 2026</h2>
                <span className="text-xs text-slate-500">الجدول الزمني لاستقبال طلبات الالتحاق وإصدار قرارات القبول</span>
              </div>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('registration')}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>تقديم طلب الآن</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-300" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {admissionTimeline.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {item.phase}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">{item.title}</h3>
                  <div className="text-xs text-amber-800 font-bold mt-1 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ACADEMIC CALENDAR DUAL-SEMESTER TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEMESTER 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  الفصل الدراسي الأول
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">التقويم التفصيلي للفصل الأول</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">14 أسبوعاً دراسياً</span>
            </div>

            <div className="space-y-3">
              {semester1Events.map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    ev.type === 'exam'
                      ? 'bg-red-50/70 border-red-200 text-red-950'
                      : ev.type === 'holiday'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="font-mono font-bold text-[11px] min-w-[120px] text-slate-600 block pt-0.5">
                    {ev.date}
                  </span>
                  <div className="font-semibold leading-relaxed">{ev.event}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEMESTER 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  الفصل الدراسي الثاني
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">التقويم التفصيلي للفصل الثاني</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">14 أسبوعاً دراسياً</span>
            </div>

            <div className="space-y-3">
              {semester2Events.map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    ev.type === 'exam'
                      ? 'bg-red-50/70 border-red-200 text-red-950'
                      : ev.type === 'holiday'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="font-mono font-bold text-[11px] min-w-[120px] text-slate-600 block pt-0.5">
                    {ev.date}
                  </span>
                  <div className="font-semibold leading-relaxed">{ev.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IMPORTANT NOTES & APPROVAL STAMP */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm text-white">الاعتماد الأكاديمي للتقويم الجامعي</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                صدر ومعتمد بقرار مجلس الأساتذة وأمانة الشؤون العلمية بكلية السودان الجديد للمحاسبة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">الخرطوم - السودان</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300 font-bold text-xs">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
