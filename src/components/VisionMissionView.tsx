import React from 'react';
import {
  Building2,
  Target,
  Compass,
  Award,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Printer,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Layers,
  HeartHandshake,
  Lightbulb,
  Scale,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

interface VisionMissionViewProps {
  onBackToHome: () => void;
  onNavigate: (view: string) => void;
}

export const VisionMissionView: React.FC<VisionMissionViewProps> = ({
  onBackToHome,
  onNavigate,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const coreValues = [
    {
      title: 'النزاهة والشفافية والأمانة المهنية',
      desc: 'الالتزام الصارم بقواعد السلوك الأخلاقي والمهني المعتمد عالمياً في ممارسة مهنة المحاسبة والتدقيق، وترسيخ الصدق في كافة المعاملات والتقارير المالية.',
      icon: Scale,
      color: 'border-amber-400 bg-amber-50/60 text-amber-900',
      badge: 'قيمة جوهرية أولى',
    },
    {
      title: 'الجودة والاعتماد الأكاديمي الصارم',
      desc: 'تبني أعلى المعايير الأكاديمية والمهنية الصادرة عن وزارة التعليم العالي والبحث العلمي ومجلس تنظيم مهنة المحاسبة والمراجعة السوداني.',
      icon: Award,
      color: 'border-blue-400 bg-blue-50/60 text-blue-900',
      badge: 'معايير IFRS & IES',
    },
    {
      title: 'الريادة والتحول الرقمي في المحاسبة',
      desc: 'دمج تقنيات نظم المعلومات المحاسبية السحابية (AIS)، وبرمجيات تخطيط المؤسسات (ERP)، والتدقيق الآلي في صلب البرامج الدراسية والتدريب العملي.',
      icon: Layers,
      color: 'border-indigo-400 bg-indigo-50/60 text-indigo-900',
      badge: 'محاسبة رقمية ذكية',
    },
    {
      title: 'المسؤولية المجتمعية والوطنية',
      desc: 'المساهمة الفاعلة في نهضة الاقتصاد السوداني عبر تأهيل طاقات شبابية قادرة على إدارة الموارد المالية بكفاءة عالية وإعادة إعمار المؤسسات الوطنية.',
      icon: HeartHandshake,
      color: 'border-emerald-400 bg-emerald-50/60 text-emerald-900',
      badge: 'خدمة المجتمع السوداني',
    },
    {
      title: 'الابتكار والتعلم المستمر',
      desc: 'تشجيع التفكير النقدي والتحليلي لدى الطلاب، وتوفير بيئة تعليمية ذكية تحفز على البحث العلمي المالي ومتابعة مستجدات المعايير الدولية.',
      icon: Lightbulb,
      color: 'border-purple-400 bg-purple-50/60 text-purple-900',
      badge: 'تطوير مستمر',
    },
    {
      title: 'الشراكة المهنية مع قطاع الأعمال',
      desc: 'بناء جسور تعاون وثيقة مع البنوك السودانية، المكاتب المحاسبية المعتمدة، وديوان المراجع القومي لربط الخريجين مباشرة بسوق العمل الحقيقي.',
      icon: Target,
      color: 'border-rose-400 bg-rose-50/60 text-rose-900',
      badge: 'شراكات تشغيلية',
    },
  ];

  const strategicGoals = [
    {
      id: '01',
      title: 'تأهيل كوادر محاسبية للمنافسة المحلية والإقليمية والدولية',
      detail:
        'إكساب الطلاب المعارف المتقدمة والمهارات التطبيقية في إعداد وتحليل القوائم المالية وفق معايير المحاسبة الدولية (IFRS/IAS) وتأهيلهم لشهادات الزمالة المهنية (CPA, ACCA, SOCPA).',
    },
    {
      id: '02',
      title: 'تطوير منظومة التعليم الإلكتروني التفاعلي الشامل (E-Learning)',
      detail:
        'تمكين الطلاب في كل ولايات السودان وخارجها من الحصول على تعليم نوعي متميز عبر محاضرات مسجلة ومباشرة، مستودع رقمي للكتب والمراجع، ونظام إدارة تعليمي ذكي.',
    },
    {
      id: '03',
      title: 'مواكبة التحول الرقمي والذكاء الاصطناعي في التدقيق والمحاسبة',
      detail:
        'تضمين مساقات أنظمة تخطيط موارد المؤسسات (ERP)، وبرامج المحاسبة المتقدمة، وقواعد البيانات السحابية في الخطط الدراسية لمواكبة متطلبات العصر.',
    },
    {
      id: '04',
      title: 'تعزيز البحث العلمي المالي والاقتصادي التطبيقي',
      detail:
        'دعم الأبحاث والدراسات الميدانية التي تعالج قضايا السياسات المالية، والضريبية، وتحديات التدقيق والحوكمة في المؤسسات السودانية والإقليمية.',
    },
    {
      id: '05',
      title: 'بناء شراكات استراتيجية مع القطاع المصرفي والمالي',
      detail:
        'توفير فرص تدريب عملي حقيقي وتطبيق ميداني لطلاب الكلية لدى البنوك والشركات الاستثمارية ومكاتب المراجعة القانونية قبل التخرج.',
    },
    {
      id: '06',
      title: 'ترسيخ الحوكمة والنزاهة وحماية المال العام',
      detail:
        'تخريج محاسبين ومراجعين مؤمنين بقدسية الأمانة المالية وحماية مقدرات الوطن والشفافية في الكشف عن الاختلالات المالية ومكافحة الفساد.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* TOP BAR / BREADCRUMBS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={onBackToHome}
              className="hover:text-amber-700 font-bold transition"
            >
              الرئيسية
            </button>
            <span>/</span>
            <span className="text-slate-400">عن الكلية</span>
            <span>/</span>
            <span className="text-[#0b2545] font-black">الرؤية والرسالة والأهداف</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>طباعة الوثيقة الرسمية</span>
            </button>
            <button
              onClick={onBackToHome}
              className="bg-[#0b2545] hover:bg-[#133e68] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>العودة للرئيسية</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>

        {/* HERO BANNER - DIGNIFIED ACADEMIC IDENTITY */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06182c] via-[#0b2545] to-[#164472] text-white p-8 sm:p-14 border-4 border-[#c59b6d] shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fae588_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-right max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#c59b6d]/20 border border-[#c59b6d]/40 text-[#fae588] px-4 py-1 rounded-full text-xs font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>الوثيقة الاستراتيجية المعتمدة • كلية السودان الجديد للمحاسبة</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                الرؤية والرسالة والأهداف الاستراتيجية
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                الصرح الأكاديمي الرائد لإعداد وتأهيل المحاسبين والمدققين الماليين في جمهورية السودان وفق أرفع المعايير الدولية والمهنية (IFRS).
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-amber-200 font-bold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> وزارة التعليم العالي والبحث العلمي
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-300" /> معايير التعليم المحاسبي الدولي (IES)
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-3xl border-2 border-[#c59b6d]/50 shadow-2xl">
              <CollegeLogo size="xl" />
            </div>
          </div>
        </div>

        {/* 1. VISION & MISSION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VISION CARD */}
          <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 shadow-sm space-y-5 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-black text-2xl shadow-xs">
                  <Target className="w-7 h-7 text-amber-700" />
                </div>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3 py-1 rounded-full">
                  الرؤية الأكاديمية (Our Vision)
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#0b2545]">
                رؤية كلية السودان الجديد للمحاسبة
              </h2>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 border border-amber-200 text-slate-800 leading-relaxed font-semibold text-sm sm:text-base text-justify">
                «الريادة والتميز في تقديم تعليم محاسبي أكاديمي ومهني متطور، يسهم في إعداد كوادر وطنية رائدة ومؤهلة وقادرة على مواكبة التطورات العلمية والتقنية، والمنافسة بقوة في سوق العمل محليًا وإقليميًا ودوليًا، وفقًا لأرفع المعايير الأكاديمية والمهنية المعتمدة عالمياً.»
              </div>
            </div>

            <div className="pt-4 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>معتمدة من مجلس أمناء الكلية وأمانة الشؤون العلمية</span>
            </div>
          </div>

          {/* MISSION CARD */}
          <div className="bg-white rounded-3xl border-2 border-blue-300 p-8 shadow-sm space-y-5 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-900 flex items-center justify-center font-black text-2xl shadow-xs">
                  <Compass className="w-7 h-7 text-blue-700" />
                </div>
                <span className="bg-blue-100 text-blue-900 border border-blue-300 text-xs font-black px-3 py-1 rounded-full">
                  الرسالة التعليمية والمهنية (Our Mission)
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#0b2545]">
                رسالة كلية السودان الجديد للمحاسبة
              </h2>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-blue-50/40 border border-blue-200 text-slate-800 leading-relaxed font-semibold text-sm sm:text-base text-justify">
                «تسعى كلية السودان الجديد للمحاسبة إلى تقديم برامج أكاديمية ومهنية متخصصة ومبتكرة في المحاسبة والعلوم ذات الصلة، من خلال بيئة تعليمية ذكية ومحفزة، ونخبة من أعضاء هيئة التدريس المؤهلين، ومناهج حديثة تجمع بين الرصانة النظرية والتطبيق العملي، مع تعزيز البحث العلمي وخدمة المجتمع، وترسيخ قيم المهنية والنزاهة والمسؤولية الأخلاقية، بما يسهم في تحقيق التنمية المستدامة ونهضة المجتمع السوداني.»
              </div>
            </div>

            <div className="pt-4 border-t border-blue-100 flex items-center gap-2 text-xs text-blue-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>مستوحاة من متطلبات التنمية الوطنية وبناء اقتصاد المعرفة</span>
            </div>
          </div>
        </div>

        {/* 2. CORE VALUES SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#8a6135] bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full inline-block">
              القيم المؤسسية والأخلاقية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              القيم الجوهرية لكلية السودان الجديد للمحاسبة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              الركائز الثابتة التي تحكم ممارساتنا الأكاديمية والمهنية وتبني شخصية خريجينا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border-2 ${val.color} space-y-3 shadow-xs hover:shadow-md transition`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full shadow-2xs">
                      {val.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-base leading-snug">{val.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-700">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. STRATEGIC GOALS SECTION */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0b2545] to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 border border-slate-800">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-300 bg-amber-400/20 border border-amber-400/30 px-3.5 py-1 rounded-full inline-block">
              الخارطة الأكاديمية والعملية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              الأهداف الاستراتيجية للكلية
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              غايات نسعى لتحقيقها بالعمل المؤسسي الدؤوب والابتكار التعليمي المستمر.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategicGoals.map((g) => (
              <div
                key={g.id}
                className="bg-slate-800/80 hover:bg-slate-800 border border-white/10 p-6 rounded-2xl space-y-3 transition flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center font-black text-lg">
                  {g.id}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-black text-sm sm:text-base text-amber-100">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed text-justify">
                    {g.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. DEAN'S STATEMENT */}
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-200">
            <div className="w-20 h-20 rounded-2xl bg-[#0b2545] text-amber-300 flex items-center justify-center flex-shrink-0 text-3xl font-black shadow-md border-2 border-amber-300">
              👨‍🏫
            </div>
            <div className="space-y-1 text-center md:text-right">
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
                كلمة أمانة الكلية والعمادة
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                كلمة عميد كلية السودان الجديد للمحاسبة
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                أ.د. عبد الباقي محمد عثمان • عميد الكلية وأستاذ المحاسبة والتمويل
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify font-normal bg-amber-50/30 p-6 rounded-2xl border border-amber-100">
            <p>
              «بسم الله الرحمن الرحيم، والصلاة والسلام على أشرف المرسلين. يسرني باسم أسرة كلية السودان الجديد للمحاسبة أن أرحب بكم في هذا الصرح الأكاديمي الذي تأسس حاملاً رؤية وطنية طموحة لإعادة صياغة التعليم المحاسبي في السودان والمنطقة.
            </p>
            <p>
              إن مهنة المحاسبة والمالية لم تعد مجرد قيد للدفاتر وتسجيل للعمليات، بل غدت عصب التخطيط الاستراتيجي وصناعة القرار في المنظمات الحديثة. ولذا، عكفنا على تصميم خطط دراسية تجمع بين أعلى المعايير الدولية (IFRS/IAS) وأحدث تقنيات التحول الرقمي وبرمجيات تخطيط الموارد، مع توفير بيئة تعليمية ذكية تتيح لكل طالب سوداني في داخل البلاد أو خارجها فرصة تحصيل أكاديمي رصين وميسر.
            </p>
            <p>
              نعاهدكم أن نظل أوفياء لرسالتنا، محافظين على أرفع معايير الجودة والنزاهة، مساهمين بعلمنا وخريجينا في نهضة وإعمار وطننا الحبيب.»
            </p>
          </div>
        </div>

        {/* 5. ACTION CALL TO REGISTER & EXPLORE */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl print:hidden">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              انضم إلى نخبة المحاسبين والمدققين الماليين
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-bold max-w-xl">
              باب التقديم والالتحاق الإلكتروني مفتوح الآن لبرامج البكالوريوس والدبلومات المهنية المعتمدة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('registration')}
              className="bg-[#0b2545] hover:bg-[#133e68] text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>تقديم طلب التحاق جديد</span>
            </button>
            <button
              onClick={() => onNavigate('programs-accounting')}
              className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-indigo-700" />
              <span>استعراض البرامج الأكاديمية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
