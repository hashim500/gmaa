import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Award,
  CheckCircle,
  Briefcase,
  Layers,
  ArrowRight,
  ChevronLeft,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Building,
  BarChart3,
  Database,
  FileSpreadsheet,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

interface AcademicProgramsViewProps {
  initialProgramId?: string;
  onNavigate?: (view: string) => void;
  onBackToHome?: () => void;
}

export const AcademicProgramsView: React.FC<AcademicProgramsViewProps> = ({
  initialProgramId = 'accounting',
  onNavigate,
  onBackToHome,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>(initialProgramId);

  useEffect(() => {
    if (initialProgramId) {
      setSelectedProgram(initialProgramId);
    }
  }, [initialProgramId]);

  const programs = [
    {
      id: 'accounting',
      title: 'بكالوريوس المحاسبة والتمويل',
      englishTitle: 'Bachelor of Accounting and Finance (B.Sc.)',
      duration: '4 سنوات دراسية (8 فصول أكاديمية)',
      creditHours: '136 ساعة معتمدة',
      degree: 'بكالوريوس الشرف في المحاسبة والتمويل',
      acceptanceRate: 'الشهادة السودانية (أكاديمي/تجاري) بنسبة لا تقل عن 65% أو ما يعادلها',
      icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      color: 'from-amber-600 to-amber-800',
      tag: 'البرنامج الأكثر طلباً',
      overview:
        'يهدف برنامج بكالوريوس المحاسبة والتمويل إلى إعداد محاسبين مهنيين ومدراء ماليين يتمتعون بمعرفة معمقة في إعداد القوائم المالية، المراجعة القانونية، والتحليل المالي المتطور وفق المعايير الدولية لإعداد التقارير المالية (IFRS).',
      admissionRequirements: [
        'النجاح في الشهادة الثانوية السودانية (المساق العلمي أو الأدبي أو التجاري).',
        'الحصول على النسبة المئوية المعتمدة من وزارة التعليم العالي للقبول العام أو الخاص (65% كحد أدنى).',
        'استيفاء شروط المواد المؤهلة (اللغة العربية، اللغة الإنجليزية، الرياضيات كمتطلب أساسي).',
        'معادلة الشهادات العربية والأجنبية الصادرة من خارج السودان من قبل وزارة التعليم العالي والبحث العلمي.',
        'اجتياز المقابلة الشخصية والكشف الطبي المعتمد لدى الكلية.',
      ],
      careers: [
        'محاسب قانوني ومدقق حسابات خارجي بالشركات والمكاتب الاستشارية',
        'مدير مالي ومراقب حسابات بالبنوك والمؤسسات المصرفية والمالية',
        'محلل مالي ومستشار استثمار في أسواق الأوراق المالية والبورصة',
        'محاسب تكاليف ومخطط ميزانيات في كبرى المصانع والشركات التجارية',
        'مفتش مالي وفاحص ضريبي لدى ديوان الضرائب والأجهزة الرقابية الحكومية',
      ],
      plan: [
        {
          year: 'السنة الأولى (الإعداد التأسيسي)',
          courses: [
            'مبادئ المحاسبة المالية (1)',
            'مبادئ إدارة الأعمال',
            'مبادئ الاقتصاد الجزئي والكلي',
            'الرياضيات للعلوم المالية',
            'اللغة الإنجليزية للأعمال (1)',
            'مهارات الحاسوب وتطبيقات المكاتب',
          ],
        },
        {
          year: 'السنة الثانية (البناء التخصصي)',
          courses: [
            'المحاسبة المتوسطة (1) و(2)',
            'محاسبة التكاليف المتقدمة',
            'إدارة المنشآت المالية والمصارف',
            'القانون التجاري وقانون الشركات السوداني',
            'الإحصاء المالي والتطبيقي',
            'محاسبة المنظمات غير الربحية والحكومية',
          ],
        },
        {
          year: 'السنة الثالثة (التعمق المهني)',
          courses: [
            'معايير المحاسبة الدولية (IFRS / IAS)',
            'المراجعة وتدقيق الحسابات (1)',
            'الإدارة المالية المتقدمة وتقييم المشاريع',
            'المحاسبة الضريبية وحسابات الزكاة بالسودان',
            'نظم المعلومات المحاسبية المحوسبة',
            'محاسبة البنوك والتأمين التكافلي',
          ],
        },
        {
          year: 'السنة الرابعة (التخرج والاحتراف)',
          courses: [
            'المحاسبة المتقدمة وعمليات الاندماج',
            'مراجعة الحسابات المتقدمة والحوكمة المؤسسية',
            'التحليل المالي ودراسات الجدوى الاقتصادية',
            'المحاسبة الإدارية الاستراتيجية',
            'مشروع التخرج والبحث المحاسبي التطبيقي',
            'التدريب الميداني والعملي في المؤسسات الشريكة',
          ],
        },
      ],
    },
    {
      id: 'ais',
      title: 'بكالوريوس نظم المعلومات المحاسبية',
      englishTitle: 'Bachelor of Accounting Information Systems (AIS)',
      duration: '4 سنوات دراسية (8 فصول أكاديمية)',
      creditHours: '138 ساعة معتمدة',
      degree: 'بكالوريوس الشرف في نظم المعلومات المحاسبية',
      acceptanceRate: 'الشهادة الثانوية السودانية بنسبة لا تقل عن 63% أو ما يعادلها',
      icon: <Database className="w-6 h-6 text-blue-500" />,
      color: 'from-blue-600 to-blue-800',
      tag: 'مزيج التقنية والمالية',
      overview:
        'برنامج فريد يجمع بين المعرفة المحاسبية العميقة وأحدث التقنيات البرمجية، حيث يتعلم الطالب كيفية تصميم وتشغيل وتدقيق الأنظمة المالية المحوسبة وحزم تخطيط موارد المؤسسات (ERP) وقواعد البيانات المالية السحابية.',
      admissionRequirements: [
        'النجاح في الشهادة الثانوية السودانية (المساق العلمي أو الهندسي أو التجاري أو الأدبي المستوفي للرياضيات).',
        'الحصول على نسبة القبول المعتمدة لا تقل عن 63% للعام الدراسي المعني.',
        'اجتياز اختبار كفاءة استخدام الحاسوب التأسيسي أو المقابلة الشخصية.',
        'استيفاء الأوراق الثبوتية وصور الشهادات الموثقة.',
      ],
      careers: [
        'مستشار ومطور أنظمة تخطيط الموارد (ERP Consultant - SAP / Oracle / Odoo)',
        'مدقق أنظمة المعلومات المالية ومراجع تكنولوجيا المحاسبة (IT Auditor)',
        'محلل بيانات مالية ونظم معلومات (Financial Data Analyst)',
        'مدير قواعد البيانات المالية والمحاسبية بالشركات والمصارف',
        'مصمم أنظمة الفوترة الإلكترونية والدفع الرقمي للتجارة الإلكترونية',
      ],
      plan: [
        {
          year: 'السنة الأولى',
          courses: [
            'مقدمة في نظم المعلومات',
            'مبادئ المحاسبة المالية',
            'أساسيات البرمجة وقواعد البيانات',
            'رياضيات الأعمال والإحصاء',
            'اللغة الإنجليزية المتخصصة',
          ],
        },
        {
          year: 'السنة الثانية',
          courses: [
            'تصميم قواعد البيانات المحاسبية (SQL)',
            'المحاسبة المتوسطة ونظم التكاليف',
            'تطبيقات الجداول الإلكترونية المتقدمة (Excel for Finance)',
            'شبكات الاتصالات وأمن البيانات المالية',
            'تحليل وتصميم النظم المالية',
          ],
        },
        {
          year: 'السنة الثالثة',
          courses: [
            'أنظمة تخطيط موارد المؤسسات (Enterprise Resource Planning)',
            'رقابة وتدقيق النظم المحوسبة (IT Auditing)',
            'المحاسبة السحابية وبوابات الدفع الإلكتروني',
            'معايير المحاسبة الدولية وتطبيقاتها الآلية',
            'التحليل المالي الذكي (Business Intelligence)',
          ],
        },
        {
          year: 'السنة الرابعة',
          courses: [
            'أمن المعلومات المالية ومكافحة الجرائم الإلكترونية',
            'إدارة مشاريع تقنية المعلومات المالية',
            'الذكاء الاصطناعي في التدقيق والتحليل المالي',
            'مشروع التخرج في تصميم نظام محاسبي تطبيقي',
            'تدريب عملي متقدم في شركات البرمجيات والبنوك',
          ],
        },
      ],
    },
    {
      id: 'tax',
      title: 'دبلوم المحاسبة والمراجعة الضريبية',
      englishTitle: 'Diploma in Accounting & Tax Auditing',
      duration: 'سنتان دراسيتان (4 فصول أكاديمية)',
      creditHours: '68 ساعة معتمدة',
      degree: 'الدبلوم المهني العالي في المحاسبة والمراجعة الضريبية',
      acceptanceRate: 'الشهادة السودانية بنسبة لا تقل عن 55% أو الدبلوم الفني المماثل',
      icon: <FileSpreadsheet className="w-6 h-6 text-emerald-500" />,
      color: 'from-emerald-600 to-emerald-800',
      tag: 'تأهيل وظيفي سريع',
      overview:
        'برنامج مهني عملي مكثف يركز على إكساب الطالب مهارات مسك الدفاتر المحاسبية، إعداد الإقرارات الضريبية والقيمة المضافة، والتسويات مع ديوان الضرائب السوداني، مما يتيح التوظيف المباشر في سوق العمل.',
      admissionRequirements: [
        'الشهادة الثانوية السودانية بجميع مساقاتها (علمي، أدبي، تجاري، فني) بنسبة 55% فما فوق.',
        'يُقبل الحاصلون على الشهادات الفنية والمهنية المعتمدة.',
        'فرصة التجسير لاحقاً لبرنامج البكالوريوس بعد استيفاء الشروط الأكاديمية.',
      ],
      careers: [
        'محاسب ضرائب ومسؤول الإقرارات الضريبية بالشركات',
        'مساعد مدقق حسابات ومراجع دفاتر قانوني',
        'مسؤول حسابات الرواتب والأجور والتأمينات الاجتماعية',
        'محاسب إداري ومساعد محاسب بالمنشآت المتوسطة والصغيرة',
      ],
      plan: [
        {
          year: 'السنة الأولى (الأساسيات المحاسبية)',
          courses: [
            'أصول المحاسبة المالية ومسك الدفاتر',
            'محاسبة الشركات الفردية والتضامنية',
            'مبادئ القانون التجاري والضريبي',
            'تطبيقات الحاسوب في المحاسبة (البرامج المحاسبية الجاهزة)',
            'مهارات التواصل وكتابة التقارير المالية',
          ],
        },
        {
          year: 'السنة الثانية (التطبيق الضريبي والمراجعة)',
          courses: [
            'الضريبة على أرباح الأعمال وضريبة الدخل الشخصي بالسودان',
            'ضريبة القيمة المضافة وإجراءات التحصيل',
            'حسابات الزكاة والتشريعات المنظمة لها',
            'المراجعة الداخلية وضبط المستندات',
            'مشروع التدريب العملي الميداني والتطبيقي',
          ],
        },
      ],
    },
    {
      id: 'curriculum',
      title: 'الخطط الدراسية وتوصيف المقررات الأكاديمية',
      englishTitle: 'Curriculum Structure & Course Descriptions',
      duration: 'دليل أكاديمي معتمد لجميع المسارات والمستويات',
      creditHours: 'مصفوفة الساعات المعتمدة والمتطلبات السابقة',
      degree: 'دليل الأمانة العلمية ولوائح الامتحانات',
      acceptanceRate: 'متاح للطلاب والأساتذة للاطلاع على التوصيف الكامل للمواد',
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      color: 'from-purple-600 to-purple-800',
      tag: 'الدليل الأكاديمي الشامل',
      overview:
        'يوفر هذا الدليل توصيفاً شاملاً لجميع المقررات الدراسية، الساعات النظرية والتطبيقية، مخرجات التعلم المستهدفة، والمراجع المعتمدة، بما يتوافق مع معايير الهيئة الوطنية للتقويم والاعتماد الأكاديمي.',
      admissionRequirements: [
        'يخضع نظام الدراسة للائحة الساعات المعتمدة (Credit Hours System).',
        'يتطلب تسجيل أي مقرر متقدم اجتياز المقررات السابقة المحددة في الخطة.',
        'الحد الأدنى للعبء الدراسي في الفصل هو 12 ساعة معتمدة، والحد الأقصى 21 ساعة.',
      ],
      careers: [
        'معرفة مسارك الدراسي ومقررات التخرج بدقة تامة',
        'تسهيل معادلة المقررات للطلاب المحولين من وإلى الكلية',
        'التوافق مع برامج الزمالات المهنية الدولية (ACCA / CPA / CMA)',
      ],
      plan: [
        {
          year: 'مكونات الخطة الأكاديمية الإجمالية',
          courses: [
            'متطلبات الجامعة والكلية العامة (اللغات، الحاسوب، الثقافة الوطنية، الدراسات الإنسانية)',
            'المقررات التخصصية الإجبارية في المحاسبة والتمويل ونظم المعلومات',
            'المقررات التخصصية الاختيارية (مقررات تخصصية دقيقة بحسب رغبة الطالب)',
            'ساعات التدريب العملي الميداني ومشروع التخرج الإلزامي',
          ],
        },
      ],
    },
  ];

  const currentProg = programs.find((p) => p.id === selectedProgram) || programs[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-[#0b2545] text-white border-b-4 border-[#c59b6d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#c59b6d_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#c59b6d]/20 border border-[#c59b6d]/40 text-[#fae588] text-xs font-black px-3.5 py-1 rounded-full">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>البرامج والدرجات العلمية المعتمدة</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                البرامج الأكاديمية والخطط الدراسية
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                استعرض تفاصيل برامج البكالوريوس والدبلوم، متطلبات القبول ونسب الثانوية، الخطط الدراسية، والفرص المهنية المستقبلية لكل تخصص.
              </p>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <span>العودة للرئيسية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* PROGRAM SELECTOR TABS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {programs.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProgram(p.id)}
              className={`p-4 rounded-2xl text-right border transition flex flex-col justify-between ${
                selectedProgram === p.id
                  ? 'bg-white border-[#c59b6d] shadow-lg ring-2 ring-[#c59b6d]/30'
                  : 'bg-white/90 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="p-2.5 rounded-xl bg-slate-100">{p.icon}</div>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    selectedProgram === p.id ? 'bg-[#0b2545] text-amber-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {p.tag}
                </span>
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 line-clamp-1">{p.title}</h3>
                <span className="text-[11px] text-slate-500 font-bold block mt-1">{p.duration}</span>
              </div>
            </button>
          ))}
        </div>

        {/* SELECTED PROGRAM FULL DETAILS */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Program Header */}
          <div className="bg-gradient-to-r from-[#06182c] via-[#0b2545] to-[#133e68] p-6 sm:p-10 text-white relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="bg-[#c59b6d] text-[#0b2545] font-black text-xs px-3 py-1 rounded-full inline-block">
                  {currentProg.degree}
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white">{currentProg.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 font-mono">{currentProg.englishTitle}</p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('registration')}
                  className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>تقديم طلب التحاق بهذا البرنامج</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">مدة الدراسة:</span>
                <span className="font-bold text-white block mt-0.5">{currentProg.duration}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">الساعات المعتمدة:</span>
                <span className="font-bold text-white block mt-0.5">{currentProg.creditHours}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">نسبة القبول التقريبية:</span>
                <span className="font-bold text-amber-300 block mt-0.5">{currentProg.acceptanceRate}</span>
              </div>
            </div>
          </div>

          {/* Program Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Overview */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 border-r-4 border-[#c59b6d] pr-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#c59b6d]" />
                <span>نبذة شاملة عن البرنامج وأهدافه الأكاديمية</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {currentProg.overview}
              </p>
            </div>

            {/* Admission Requirements */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 border-r-4 border-blue-600 pr-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>شروط ومتطلبات القبول والتسجيل المعتمدة</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentProg.admissionRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Careers */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 border-r-4 border-emerald-600 pr-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>مجالات العمل والوظائف المستقبلية للخريجين</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentProg.careers.map((career, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1 text-xs"
                  >
                    <span className="font-black text-emerald-900 block">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Plan by Year */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 border-r-4 border-purple-600 pr-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <span>الهيكل الفصلي وتوزيع المقررات عبر السنوات</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProg.plan.map((lvl, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900">{lvl.year}</h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {lvl.courses.length} مساقات
                      </span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {lvl.courses.map((course, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c59b6d]"></span>
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            {onNavigate && (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <h4 className="font-black text-sm text-[#8a6135]">هل أنت مستعد لبدء مسيرتك المحاسبية معنا؟</h4>
                  <p className="text-xs text-slate-600">
                    التقديم متاح الآن إلكترونياً لجميع الطلاب للعام الجامعي الجديد 2025 / 2026.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('registration')}
                  className="bg-[#0b2545] hover:bg-[#133e68] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <span>تقديم طلب الالتحاق</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
