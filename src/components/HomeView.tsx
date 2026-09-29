import React from 'react';
import {
  GraduationCap,
  Presentation,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Award,
  CreditCard,
  Bell,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Sparkles,
  Play,
  ShieldCheck,
  FileText,
  IdCard,
  Building,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { QuickAccessIconsBar } from './QuickAccessIconsBar';
import { UserRole, Announcement, Lecture } from '../types';

interface HomeViewProps {
  onOpenLogin: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  announcements: Announcement[];
  lectures: Lecture[];
  onSelectLecture: (lec: Lecture) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenLogin,
  onNavigate,
  announcements,
  lectures,
  onSelectLecture,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* HERO SECTION WITH NEW ROYAL NAVY & WARM GOLD PALETTE */}
      <section className="relative bg-gradient-to-br from-[#06182c] via-[#0b2545] to-[#133e68] text-white overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#c59b6d]">
        {/* Subtle geometric academic background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fae588_1.2px,transparent_1.2px)] [background-size:28px_28px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-[#c59b6d]/20 border border-[#c59b6d]/40 text-[#fae588] px-4 py-1.5 rounded-full text-xs font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>المنصة الجامعية الرسمية للتعليم المحاسبي الإلكتروني • جمهورية السودان</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
              كلية السودان الجديد <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#fae588] to-[#c59b6d]">
                للمحاسبة والعلوم المالية
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-medium">
              صرح أكاديمي إلكتروني رائد متخصص في إعداد وتأهيل المحاسبين والمدققين الماليين في السودان وفق المعايير الدولية (IFRS). بيئة ذكية تجمع بين المحاضرات الحية، الواجبات المتطورة، السجل الأكاديمي الرقمي، والتحقق الفوري من الشهادات.
            </p>

            {/* Quick Portals Entry Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onNavigate('registration')}
                id="hero-register-portal-btn"
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl transition flex items-center gap-2 group border-2 border-amber-300"
              >
                <GraduationCap className="w-5 h-5 text-slate-950 group-hover:scale-110 transition" />
                <span>تسجيل طالب جديد للالتحاق بالكلية</span>
                <ArrowRight className="w-4 h-4 rotate-180 text-slate-950" />
              </button>

              <button
                onClick={() => onOpenLogin('student')}
                id="hero-student-portal-btn"
                className="bg-[#0b2545] hover:bg-[#133e68] text-white border border-[#c59b6d]/50 px-5 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition flex items-center gap-2 group"
              >
                <GraduationCap className="w-5 h-5 text-amber-300 group-hover:scale-110 transition" />
                <span>دخول بوابة الطالب</span>
              </button>

              <button
                onClick={() => onOpenLogin('instructor')}
                id="hero-instructor-portal-btn"
                className="bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <Presentation className="w-5 h-5 text-slate-300" />
                <span>بوابة هيئة التدريس</span>
              </button>

              <button
                onClick={() => onOpenLogin('admin')}
                id="hero-admin-portal-btn"
                className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] px-5 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>الإدارة الأكاديمية</span>
              </button>
            </div>

            {/* Fast Stats Row */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/15 text-center lg:text-right">
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#fae588] block">100%</span>
                <span className="text-[11px] text-slate-300">تعليم محاسبي إلكتروني</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">IFRS & AIS</span>
                <span className="text-[11px] text-slate-300">معايير مهنية دولية</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">فوري وبنكك</span>
                <span className="text-[11px] text-slate-300">سداد إلكتروني معتمد</span>
              </div>
            </div>
          </div>

          {/* College Official Emblem Showcase & Announcements Preview */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative mx-auto flex flex-col items-center">
              {/* Emblem glow */}
              <div className="absolute w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-[#c59b6d]/40 shadow-2xl">
                <CollegeLogo size="2xl" />
              </div>
            </div>

            {/* Urgent Announcements Card in Hero */}
            <div className="bg-[#0b2545]/90 backdrop-blur-md rounded-3xl border border-white/15 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                  <h3 className="font-bold text-xs sm:text-sm text-white">إعلانات الكلية العاجلة للطلاب</h3>
                </div>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  تحديث مباشر
                </span>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pl-1">
                {announcements.slice(0, 2).map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1 hover:border-amber-400/40 transition text-right"
                  >
                    <div className="flex justify-between items-center text-[10px] text-amber-300 font-bold">
                      <span>{ann.department}</span>
                      <span className="text-slate-400">{ann.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white leading-tight">{ann.title}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 CIRCULAR QUICK ACCESS ICONS (مثل موقع الجامعة العربية المفتوحة بالسودان - Image 1 & Image 3) */}
      <QuickAccessIconsBar
        onNavigate={onNavigate}
        onOpenLogin={(role) => onOpenLogin(role || 'student')}
      />

      {/* NEW SECTION: ANNOUNCING PROPOSED SYSTEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-right">
              <span className="bg-[#0b2545] text-amber-300 text-[11px] font-black px-3 py-1 rounded-full">
                جديد المنظومة الجامعية المتطورة
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                بوابات إلكترونية جديدة تم تدشينها لخدمة الطلاب والمجتمع
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                تمت إضافة نظام التحقق الإلكتروني من صحة الوثائق، كشف الدرجات والسجل الأكاديمي، والمكتبة والمستودع المحاسبي الرقمي.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={() => onNavigate('verification')}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" /> التحقق من الوثائق
              </button>
              <button
                onClick={() => onNavigate('transcript')}
                className="bg-white hover:bg-slate-50 text-[#0b2545] border border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <FileText className="w-4 h-4 text-indigo-600" /> كشف الدرجات
              </button>
              <button
                onClick={() => onNavigate('library')}
                className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <BookOpen className="w-4 h-4" /> المكتبة الرقمية
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SERVICES ACCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#8a6135] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            المنظومة الأكاديمية والخدمية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            أقسام وخدمات كلية السودان الجديد للمحاسبة
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Student Portal */}
          <div
            onClick={() => onOpenLogin('student')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 bg-slate-100 text-[#0b2545] rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6 text-[#0b2545]" />
            </div>
            <h3 className="font-black text-base text-slate-900">بوابة الطالب والمحاضرات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              حضور المحاضرات والدروس الأكاديمية المسجلة، استلام الواجبات، رفع الحلول المتنوعة، ومتابعة النتائج التفاعلية.
            </p>
            <div className="pt-2 text-xs font-bold text-[#0b2545] flex items-center gap-1">
              <span>الدخول للبوابة</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-600" />
            </div>
          </div>

          {/* Card 2: Instructor Portal */}
          <div
            onClick={() => onOpenLogin('instructor')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-105 transition">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900">لوحة تحكم المعلم</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              جدولة المحاضرات والدروس الرقمية، طرح الواجبات بالنص والفيديو والصور والملفات، واستعراض الحلول وتصحيحها.
            </p>
            <div className="pt-2 text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>الدخول للبوابة</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-600" />
            </div>
          </div>

          {/* Card 3: Certificates */}
          <div
            onClick={() => onNavigate('certificates')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-105 transition">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900">شهادات الكلية والإفادات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              الاستعلام وطلب الشهادات الأكاديمية وكشوفات الدرجات مع الشعار المحدث، والباركود والأختام الرسمية المعتمدة.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-700 flex items-center gap-1">
              <span>طلب أو طباعة شهادة</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </div>
          </div>

          {/* Card 4: Fees */}
          <div
            onClick={() => onNavigate('fees')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer space-y-4 group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-bold group-hover:scale-105 transition">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-slate-900">سداد الرسوم المصرفي</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              سداد الرسوم الدراسية عبر تطبيقات البنوك السودانية (بنكك وفوري) واستخراج سند القبض الإلكتروني المختوم فوراً.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>بوابة الدفع والسداد</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED VISION & MISSION SHOWCASE - LINKS TO FULL DEDICATED PAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#06182c] via-[#0b2545] to-[#164472] text-white rounded-3xl border-2 border-[#c59b6d] p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fae588_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-right max-w-3xl">
              <span className="text-xs font-black text-amber-300 bg-amber-400/20 border border-amber-300/40 px-3.5 py-1 rounded-full inline-block">
                الهوية الأكاديمية والتوجه الاستراتيجي
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                الرؤية والرسالة لكلية السودان الجديد للمحاسبة
              </h2>
              <p className="text-xs sm:text-base text-slate-200 leading-relaxed">
                الريادة في تقديم تعليم محاسبي أكاديمي ومهني متميز، يسهم في إعداد كوادر وطنية مؤهلة وقادرة على مواكبة التطورات العلمية والتقنية، والمنافسة بقوة في سوق العمل محليًا وإقليميًا ودوليًا وفقًا للمعايير الأكاديمية والمهنية المعتمدة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-right">
                  <span className="text-amber-300 font-black text-xs block">🎯 الرؤية الأكاديمية</span>
                  <span className="text-[11px] text-slate-300">الريادة والتميز المحاسبي الدولي (IFRS)</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-right">
                  <span className="text-amber-300 font-black text-xs block">📜 الرسالة والأهداف</span>
                  <span className="text-[11px] text-slate-300">تأهيل كوادر تجمع الرصانة والتطبيق</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-right">
                  <span className="text-amber-300 font-black text-xs block">💎 القيم المؤسسية</span>
                  <span className="text-[11px] text-slate-300">النزاهة، الجودة، والتحول الرقمي الذكي</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 flex-shrink-0 w-full lg:w-auto">
              <button
                onClick={() => onNavigate('vision-mission')}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 group border-2 border-amber-300"
              >
                <span>الانتقال لصفحة الرؤية والرسالة كاملة</span>
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
              </button>

              <button
                onClick={() => onNavigate('programs-accounting')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>استعراض البرامج الأكاديمية</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMIC PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#8a6135] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              البرامج الأكاديمية والدرجات العلمية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              تخصصات مهنية معتمدة تفتح لك آفاق العمل في كبرى المؤسسات
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => onNavigate('programs-accounting')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:shadow-md transition space-y-3 text-right group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0b2545] text-amber-300 flex items-center justify-center font-black text-lg group-hover:scale-105 transition">
                  1
                </div>
                <h4 className="font-black text-base text-slate-900 group-hover:text-[#0b2545] transition">
                  بكالوريوس المحاسبة والتمويل
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  برنامج متكامل لمدة 4 سنوات (136 ساعة معتمدة) يركز على المحاسبة المالية، المراجعة والتدقيق، ومعايير إعداد التقارير الدولية IFRS.
                </p>
              </div>
              <div className="text-[11px] font-black text-[#8a6135] pt-2 flex items-center gap-1">
                <span>استعراض المتطلبات والخطة الدراسية</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('programs-ais')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-3 text-right group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-lg group-hover:scale-105 transition">
                  2
                </div>
                <h4 className="font-black text-base text-slate-900 group-hover:text-blue-700 transition">
                  بكالوريوس نظم المعلومات المحاسبية
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  دمج تقنيات المحاسبة والتحول الرقمي، أنظمة تخطيط المؤسسات ERP، وتدقيق قواعد البيانات المالية السحابية (138 ساعة معتمدة).
                </p>
              </div>
              <div className="text-[11px] font-black text-blue-700 pt-2 flex items-center gap-1">
                <span>استعراض المتطلبات والخطة الدراسية</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </button>

            <button
              onClick={() => onNavigate('programs-tax')}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition space-y-3 text-right group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg group-hover:scale-105 transition">
                  3
                </div>
                <h4 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition">
                  دبلوم المحاسبة والمراجعة الضريبية
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تأهيل عملي مركز لمدة سنتين (68 ساعة معتمدة) في مسك الدفاتر، إعداد الإقرارات الضريبية، وحسابات القيمة المضافة والزكاة.
                </p>
              </div>
              <div className="text-[11px] font-black text-emerald-700 pt-2 flex items-center gap-1">
                <span>استعراض المتطلبات والخطة الدراسية</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
