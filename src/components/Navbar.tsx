import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Presentation,
  ShieldAlert,
  Menu,
  X,
  CreditCard,
  Award,
  LogOut,
  Home,
  BookOpen,
  Headphones,
  Calendar,
  ShieldCheck,
  FileText,
  IdCard,
  User as UserIcon,
  UserCheck,
  ChevronDown,
  Sparkles,
  Camera,
  Search,
  ExternalLink,
  BookMarked,
  CheckCircle2,
  FileCheck,
  Building2,
  Phone,
  Mail,
  Clock,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: (role?: UserRole) => void;
  onLogout: () => void;
  onOpenSupport?: () => void;
  onOpenStudentCard?: () => void;
  onOpenProfile?: () => void;
}

interface DropdownItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  view?: string;
  action?: () => void;
  badge?: string;
}

interface DropdownMenuSection {
  id: string;
  label: string;
  items: DropdownItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenLogin,
  onLogout,
  onOpenSupport,
  onOpenStudentCard,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (view: string) => {
    if (view === 'support' && onOpenSupport) {
      onOpenSupport();
      setMobileMenuOpen(false);
      setActiveDropdown(null);
      return;
    }
    onNavigate(view);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setProfileMenuOpen(false);
  };

  const userPhoto = currentUser?.avatarUrl || currentUser?.photoUrl || '';

  // Academic Dropdown Sections with strict user requirements
  const navDropdowns: DropdownMenuSection[] = [
    {
      id: 'about',
      label: 'عن الكلية',
      items: [
        {
          title: 'الرؤية والرسالة والأهداف الاستراتيجية',
          desc: 'صفحة خاصة: ريادة التعليم المحاسبي، القيم الجوهرية، الأهداف، وكلمة العميد.',
          icon: Building2,
          view: 'vision-mission',
          badge: 'صفحة خاصة',
        },
        {
          title: 'الأخبار والتعاميم الرسمية',
          desc: 'المركز الإعلامي الرسمي: كافة الأخبار والتعاميم ومواعيد الامتحانات وقرارات الكلية.',
          icon: FileText,
          view: 'news',
          badge: 'صفحة الأخبار',
        },
      ],
    },
    {
      id: 'programs',
      label: 'البرامج الأكاديمية',
      items: [
        {
          title: 'بكالوريوس المحاسبة والتمويل',
          desc: '4 سنوات دراسية (136 ساعة معتمدة) - شروط القبول، الخطة الدراسية، وفرص العمل.',
          icon: GraduationCap,
          view: 'programs-accounting',
          badge: '4 سنوات',
        },
        {
          title: 'بكالوريوس نظم المعلومات المحاسبية',
          desc: '4 سنوات دراسية (138 ساعة معتمدة) - دمج أنظمة ERP والمحاسبة المحوسبة الحديثة.',
          icon: Layers,
          view: 'programs-ais',
          badge: 'تقني محاسبي',
        },
        {
          title: 'دبلوم المحاسبة والمراجعة الضريبية',
          desc: 'سنتان دراسيتان (68 ساعة معتمدة) - تأهيل عملي لسوق العمل وقوانين الضرائب.',
          icon: BookMarked,
          view: 'programs-tax',
          badge: 'دبلوم سنتان',
        },
        {
          title: 'الخطط الدراسية وتوصيف المقررات',
          desc: 'استعراض مصفوفة الساعات والمتطلبات السابقة وتفاصيل المساقات لجميع المستويات.',
          icon: Calendar,
          view: 'programs-curriculum',
        },
      ],
    },
    {
      id: 'admissions',
      label: 'القبول والتسجيل',
      items: [
        {
          title: 'تقديم طلب التحاق جديد (Admissions)',
          desc: 'بوابة التقديم الإلكتروني المباشر للطلاب الجدد للعام الأكاديمي 2025/2026.',
          icon: CheckCircle2,
          view: 'registration',
          badge: 'مفتوح الآن',
        },
        {
          title: 'تتبع حالة طلب الالتحاق',
          desc: 'الاستعلام الفوري عن نتيجة فحص الطلب وقرار القبول المبدئي بالرقم المرجعي والوطني.',
          icon: Search,
          view: 'registration-track',
        },
        {
          title: 'شروط ونسب القبول المعتمدة',
          desc: 'صفحة متكاملة لشروط القبول، النسب للشهادة السودانية والمعادلات والأوراق المطلوبة.',
          icon: FileCheck,
          view: 'admission-requirements',
          badge: 'شروط ونسب',
        },
        {
          title: 'مواعيد القبول والتقويم الجامعي',
          desc: 'جدول مواعيد مراحل القبول، بداية الفصول الدراسية، والتقويم الأكاديمي السنوي بصفحة واحدة.',
          icon: Clock,
          view: 'academic-calendar',
          badge: 'تقويم شامل',
        },
      ],
    },
    {
      id: 'students',
      label: 'الطلاب والخدمات',
      items:
        currentUser?.role === 'student'
          ? [
              {
                title: 'بوابة الطالب الذكية (LMS / SIS)',
                desc: 'لوحة التحكم الأكاديمية لمتابعة المحاضرات الحية، الواجبات، والأنشطة.',
                icon: GraduationCap,
                view: 'student-portal',
              },
              {
                title: 'الجدول الدراسي والمحاضرات الأسبوعية',
                desc: 'مواعيد المحاضرات الحضورية والافتراضية والبث المباشر للدفعة.',
                icon: Calendar,
                view: 'schedule',
              },
              {
                title: 'كشف الدرجات والسجل الأكاديمي',
                desc: 'بيان الدرجات المعتمد مع تفاصيل المعدل الفصلي والتراكمي (GPA).',
                icon: FileText,
                view: 'transcript',
              },
              {
                title: 'طلب الشهادات والإفادات الرسمية',
                desc: 'استخراج وتوثيق إفادة القيد الجامعي وشهادات الكلية الإلكترونية.',
                icon: Award,
                view: 'certificates',
              },
            ]
          : [
              {
                title: 'بوابة الطالب الذكية (LMS / SIS)',
                desc: 'تسجيل الدخول إلى البوابة الطلابية لمتابعة المقررات والجداول والدرجات.',
                icon: GraduationCap,
                view: 'student-portal',
              },
            ],
    },
    {
      id: 'library',
      label: 'المكتبة والبحوث',
      items: [
        {
          title: 'المكتبة الرقمية وقارئ الكتب التفاعلي',
          desc: 'تصفح وقراءة الكتب المنهجية والمراجع المحاسبية المعتمدة مباشرة بالمتصفح.',
          icon: BookOpen,
          view: 'library',
          badge: 'قارئ مدمج',
        },
        {
          title: 'معايير المحاسبة الدولية (IFRS/IAS)',
          desc: 'المكتبة الرسمية لنصوص المعايير المحاسبية والتقارير المالية الدولية.',
          icon: BookMarked,
          view: 'library',
        },
        {
          title: 'قوانين الضرائب والمراجعة في السودان',
          desc: 'المستودع القانوني للتشريعات المالية السودانية وضريبة القيمة المضافة.',
          icon: FileCheck,
          view: 'library',
        },
      ],
    },
    {
      id: 'verification-fees',
      label: 'التحقق والسداد',
      items: [
        {
          title: 'التحقق الإلكتروني من صحة الوثائق',
          desc: 'خدمة التحقق الفوري المباشر من صحة الشهادات وكشوفات الدرجات برمز QR.',
          icon: ShieldCheck,
          view: 'verification',
          badge: 'فحص فوري',
        },
        {
          title: 'سداد الرسوم الدراسية إلكترونياً',
          desc: 'دفع الرسوم عبر تطبيق بنكك، فوري، المحافظ الإلكترونية، مع إصدار إشعار فوري معتمد.',
          icon: CreditCard,
          view: 'fees',
          badge: 'بنكك وفوري',
        },
        {
          title: 'سندات القبض والإيصالات المالية',
          desc: 'استعراض وطباعة إيصالات السداد المؤرخة والمختومة من الإدارة المالية للكلية.',
          icon: FileText,
          view: 'fees',
        },
        {
          title: 'الدعم الأكاديمي والاستفسارات',
          desc: 'تواصل مباشر مع مسجلي الكلية، الدعم الفني، والمساعدة الأكاديمية لحل أي معوقات.',
          icon: Headphones,
          view: 'support',
        },
      ],
    },
  ];

  // Quick search handler
  const filteredSearchItems = searchQuery.trim()
    ? navDropdowns
        .flatMap((s) => s.items)
        .filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  return (
    <header className="bg-white sticky top-0 z-40 shadow-xs border-b border-slate-200" ref={navRef}>
      {/* 1. TOP UTILITY BAR (مثل شريط الجامعة العربية المفتوحة بالسودان - Image 3) */}
      <div className="bg-[#0b2545] text-slate-200 text-[11px] border-b border-[#c59b6d]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          {/* Contact Helpline & Quick Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <a
                href="tel:+249912000111"
                className="flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-200 hover:text-white transition font-mono bg-white/10 px-2.5 py-1 rounded-full border border-white/10"
                title="هاتف استعلامات الكلية المعتمد"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span className="dir-ltr font-bold">+249 912 000 111</span>
              </a>

              {/* Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#c59b6d] hover:text-[#0b2545] flex items-center justify-center transition cursor-pointer"
                title="بحث سريع في الكلية والمقررات"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Academic Info & Fast Actions */}
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden lg:flex items-center gap-1.5 text-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              المنصة الرسمية المعتمدة • وزارة التعليم العالي والبحث العلمي - جمهورية السودان
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNav('verification')}
                className="text-amber-300 hover:text-white transition flex items-center gap-1 font-bold text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> التحقق من الشهادات
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => handleNav('support')}
                className="text-slate-300 hover:text-amber-300 transition flex items-center gap-1 text-[11px]"
              >
                <Headphones className="w-3.5 h-3.5 text-slate-400" /> الدعم والمساعدة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN LOGO & BRANDING ROW */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 flex-nowrap border-b border-slate-100">
        {/* College Official Emblem */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0 flex-shrink"
          id="college-header-logo-btn"
        >
          <div className="flex-shrink-0">
            <CollegeLogo size="sm" className="sm:hidden" />
            <CollegeLogo size="md" className="hidden sm:block" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-black text-sm sm:text-lg lg:text-2xl text-[#0b2545] tracking-tight group-hover:text-[#133e68] transition truncate sm:whitespace-normal">
                كلية السودان الجديد للمحاسبة
              </h1>
              <span className="hidden lg:inline-block bg-amber-50 text-[#8a6135] font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                مؤسسة جامعية معتمدة
              </span>
            </div>
            <p className="hidden xs:block text-[9px] sm:text-xs text-[#8a6135] font-black tracking-wider truncate">
              NEW SUDAN COLLEGE OF ACCOUNTANCY (NSCA)
            </p>
          </div>
        </div>

        {/* Quick Actions & Portals */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Direct CTA: تسجيل طالب جديد */}
          <button
            onClick={() => handleNav('registration')}
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2.5 rounded-2xl font-black text-xs shadow-xs hover:shadow-md transition border border-amber-400 group cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950 group-hover:scale-110 transition" />
            <span>الالتحاق والتسجيل الجديد</span>
          </button>

          {/* User Profile / Login Options */}
          {currentUser ? (
            <div className="relative" ref={profileMenuRef}>
              {/* Desktop Profile Pill (Hidden on Mobile) */}
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 pr-2.5 rounded-2xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 text-right cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border-2 border-[#c59b6d] flex items-center justify-center">
                      {userPhoto ? (
                        <img src={userPhoto} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-black text-xs text-[#0b2545]">{currentUser.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>

                  <div>
                    <span className="block text-xs font-black text-slate-900 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-[#8a6135]">
                      {currentUser.role === 'student'
                        ? 'طالب'
                        : currentUser.role === 'instructor'
                        ? 'أستاذ'
                        : 'إدارة'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Direct to portal */}
                <button
                  onClick={() => {
                    if (currentUser.role === 'student') handleNav('student-portal');
                    else if (currentUser.role === 'instructor') handleNav('instructor-portal');
                    else handleNav('admin-portal');
                  }}
                  className="bg-[#0b2545] hover:bg-[#133e68] text-white text-xs font-black px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  لوحة التحكم
                </button>
              </div>

              {/* Mobile Compact Avatar Button (Prevents breaking layout or appearing under logo) */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="md:hidden flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 pl-1.5 rounded-xl shadow-2xs cursor-pointer"
                aria-label="قائمة الملف الشخصي"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border-2 border-[#c59b6d] flex items-center justify-center">
                    {userPhoto ? (
                      <img src={userPhoto} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-xs text-[#0b2545]">{currentUser.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 left-0 w-2 h-2 bg-emerald-500 border border-white rounded-full"></span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-right animate-fade-in">
                  <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border-2 border-[#c59b6d] flex-shrink-0">
                      {userPhoto ? (
                        <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-slate-800">
                          {currentUser.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-xs text-slate-900 truncate">{currentUser.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{currentUser.studentId || currentUser.email}</p>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5 text-xs font-bold text-slate-700">
                    {/* Direct to dashboard button in mobile dropdown */}
                    <button
                      onClick={() => {
                        if (currentUser.role === 'student') handleNav('student-portal');
                        else if (currentUser.role === 'instructor') handleNav('instructor-portal');
                        else handleNav('admin-portal');
                      }}
                      className="w-full text-right p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0b2545] font-black flex items-center gap-2.5 transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>الانتقال إلى لوحة التحكم</span>
                    </button>

                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => handleNav('student-profile')}
                        className="w-full text-right p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 transition text-emerald-800"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-600" />
                        <span>بروفيل وسيرة الطالب الأكاديمية</span>
                      </button>
                    )}

                    {currentUser.role === 'instructor' && (
                      <button
                        onClick={() => handleNav('instructor-profile')}
                        className="w-full text-right p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 transition text-purple-800"
                      >
                        <UserIcon className="w-4 h-4 text-purple-600" />
                        <span>بروفيل الأستاذ والإنتاج العلمي</span>
                      </button>
                    )}

                    {onOpenStudentCard && currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          onOpenStudentCard();
                        }}
                        className="w-full text-right p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 transition text-amber-900"
                      >
                        <IdCard className="w-4 h-4 text-amber-600" />
                        <span>البطاقة الجامعية الذكية (QR)</span>
                      </button>
                    )}

                    <button
                      onClick={onLogout}
                      className="w-full text-right p-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 transition border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج من الحساب</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenLogin('student')}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>دخول الطلاب</span>
              </button>
              <button
                onClick={() => onOpenLogin('instructor')}
                className="hidden md:flex bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl font-bold text-xs transition items-center gap-1.5 cursor-pointer"
              >
                <Presentation className="w-4 h-4 text-slate-600" />
                <span>هيئة التدريس</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center min-w-[36px] min-h-[36px] cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* 3. DESKTOP ACADEMIC DROPDOWNS BAR (كما في موقع الجامعة العربية المفتوحة بالسودان - Image 3) */}
      <nav className="hidden xl:block bg-slate-50/90 border-t border-slate-100 shadow-2xs relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Home button */}
            <button
              onClick={() => handleNav('home')}
              className={`py-3 px-3.5 text-xs font-black transition flex items-center gap-1.5 border-b-2 ${
                currentView === 'home' && !activeDropdown
                  ? 'border-[#0b2545] text-[#0b2545] bg-white shadow-2xs'
                  : 'border-transparent text-slate-700 hover:text-[#0b2545] hover:bg-slate-100/80'
              }`}
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>الرئيسية</span>
            </button>

            {/* Dropdown Items with descriptions */}
            {navDropdowns.map((sec) => {
              const isOpen = activeDropdown === sec.id;
              return (
                <div
                  key={sec.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(sec.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : sec.id)}
                    className={`py-3 px-3.5 text-xs font-black transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
                      isOpen
                        ? 'border-[#c59b6d] text-[#0b2545] bg-white shadow-2xs'
                        : 'border-transparent text-slate-700 hover:text-[#0b2545] hover:bg-slate-100/80'
                    }`}
                  >
                    <span>{sec.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#c59b6d]' : ''
                      }`}
                    />
                  </button>

                  {/* Mega-Dropdown Menu with texts for each item */}
                  {isOpen && (
                    <div className="absolute right-0 top-full mt-0 w-[520px] bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-4 z-50 animate-fade-in grid grid-cols-1 gap-2.5 text-right">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                        <span className="text-xs font-black text-[#0b2545] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#c59b6d]"></span>
                          {sec.label} • كلية السودان الجديد للمحاسبة
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">دليل الأقسام والخدمات</span>
                      </div>

                      {/* Dropdown Items with Title AND Descriptive Text */}
                      <div className="grid grid-cols-1 gap-2">
                        {sec.items.map((item, idx) => {
                          const IconComp = item.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (item.action) {
                                  item.action();
                                } else if (item.view) {
                                  handleNav(item.view);
                                }
                                setActiveDropdown(null);
                              }}
                              className="group text-right p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 flex items-start gap-3 w-full cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-xs text-[#0b2545] group-hover:text-[#133e68] transition-colors">
                                    {item.title}
                                  </h4>
                                  {item.badge && (
                                    <span className="text-[9px] font-black bg-amber-50 text-[#8a6135] border border-amber-200 px-1.5 py-0.2 rounded-md">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {/* The user requested: "مع كتابة نصوص في كل صفحة منسدله" */}
                                <p className="text-[11px] text-slate-500 group-hover:text-slate-700 leading-snug mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick indicator on left */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>بوابة القبول 2026/2027 نشطة</span>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER MENU WITH ACCORDION SECTIONS */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in shadow-xl">
          {/* User Profile Card for Mobile (when logged in) */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-[#06182c] via-[#0b2545] to-[#133e68] text-white p-4 rounded-2xl shadow-md border border-[#c59b6d]/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 border-2 border-[#c59b6d] flex-shrink-0 flex items-center justify-center">
                  {userPhoto ? (
                    <img src={userPhoto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-black text-base text-amber-300">{currentUser.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#c59b6d]/30 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {currentUser.role === 'student' ? 'طالب مقيد' : currentUser.role === 'instructor' ? 'هيئة التدريس' : 'إدارة الكلية'}
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-white truncate mt-1">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-300 font-mono truncate">{currentUser.studentId || currentUser.email}</p>
                </div>
              </div>

              {/* Fast Mobile Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15">
                <button
                  onClick={() => {
                    if (currentUser.role === 'student') handleNav('student-portal');
                    else if (currentUser.role === 'instructor') handleNav('instructor-portal');
                    else handleNav('admin-portal');
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2 px-2 rounded-xl text-center shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>لوحة التحكم</span>
                </button>

                {currentUser.role === 'student' ? (
                  <button
                    onClick={() => handleNav('student-profile')}
                    className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2 px-2 rounded-xl text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>بروفيل الطالب</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav('instructor-profile')}
                    className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2 px-2 rounded-xl text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>سيرة الأستاذ</span>
                  </button>
                )}
              </div>

              {onOpenStudentCard && currentUser.role === 'student' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStudentCard();
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <IdCard className="w-4 h-4 text-amber-400" />
                  <span>عرض البطاقة الجامعية الذكية (QR)</span>
                </button>
              )}
            </div>
          ) : (
            /* Quick Buttons for Guest Visitors */
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => handleNav('home')}
                className="p-2.5 bg-slate-100 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-600" /> الرئيسية
              </button>
              <button
                onClick={() => handleNav('registration')}
                className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> تسجيل جديد
              </button>
            </div>
          )}

          {/* Mobile Accordion for each dropdown */}
          <div className="space-y-2">
            {navDropdowns.map((sec) => {
              const isExpanded = mobileExpandedSection === sec.id;
              return (
                <div key={sec.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setMobileExpandedSection(isExpanded ? null : sec.id)}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-black text-[#0b2545] transition"
                  >
                    <span>{sec.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-2 bg-white divide-y divide-slate-100 space-y-1">
                      {sec.items.map((item, idx) => {
                        const IconComp = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (item.action) item.action();
                              else if (item.view) handleNav(item.view);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-right p-2 rounded-xl hover:bg-slate-50 transition flex items-start gap-2.5"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-[#0b2545] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="font-bold text-xs text-[#0b2545] flex items-center justify-between">
                                <span>{item.title}</span>
                                {item.badge && (
                                  <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Login Options in Mobile */}
          {!currentUser ? (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 font-bold">بوابات الدخول الأكاديمية:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('student');
                  }}
                  className="bg-[#0b2545] text-white py-2.5 rounded-xl font-bold text-center text-[11px] flex flex-col items-center gap-1 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-amber-300" /> الطلاب
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('instructor');
                  }}
                  className="bg-slate-800 text-white py-2.5 rounded-xl font-bold text-center text-[11px] flex flex-col items-center gap-1 shadow-xs"
                >
                  <Presentation className="w-4 h-4 text-slate-300" /> التدريس
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('admin');
                  }}
                  className="bg-[#c59b6d] text-[#0b2545] py-2.5 rounded-xl font-black text-center text-[11px] flex flex-col items-center gap-1 shadow-xs"
                >
                  <ShieldAlert className="w-4 h-4" /> الإدارة
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-right p-2.5 text-rose-600 font-bold text-xs bg-rose-50 rounded-xl flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> تسجيل الخروج من النظام
            </button>
          )}
        </div>
      )}

      {/* 5. QUICK SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#0b2545]" />
                <h3 className="font-black text-sm text-[#0b2545]">البحث في بوابات وأقسام كلية السودان الجديد</h3>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن: المقررات، القبول، الرسوم، الشهادات، المكتبة، أو كشف الدرجات..."
                className="w-full text-xs p-3.5 pr-10 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-none focus:border-[#0b2545]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 text-xs">
              {searchQuery.trim() ? (
                filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (item.action) item.action();
                        else if (item.view) handleNav(item.view);
                        setSearchModalOpen(false);
                      }}
                      className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-2.5 transition"
                    >
                      <item.icon className="w-4 h-4 text-[#0b2545] mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4 font-medium">
                    لم يتم العثور على نتائج مطابقة لـ "{searchQuery}"
                  </p>
                )
              ) : (
                <div className="py-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">روابط سريعة مقترحة:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleNav('registration');
                        setSearchModalOpen(false);
                      }}
                      className="text-right p-2 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                    >
                      • استمارة القبول والتسجيل
                    </button>
                    <button
                      onClick={() => {
                        handleNav('library');
                        setSearchModalOpen(false);
                      }}
                      className="text-right p-2 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                    >
                      • المكتبة وقارئ الكتب
                    </button>
                    <button
                      onClick={() => {
                        handleNav('verification');
                        setSearchModalOpen(false);
                      }}
                      className="text-right p-2 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                    >
                      • التحقق من صحة الوثائق
                    </button>
                    <button
                      onClick={() => {
                        handleNav('fees');
                        setSearchModalOpen(false);
                      }}
                      className="text-right p-2 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                    >
                      • دفع وسداد الرسوم الدراسية
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
