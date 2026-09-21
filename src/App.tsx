import React, { useState, useEffect } from 'react';
import {
  Bell,
  GraduationCap,
  Presentation,
  ShieldAlert,
  Award,
  CreditCard,
  Headphones,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  FileText,
  BookOpen,
  IdCard,
} from 'lucide-react';
import { User, UserRole, Lecture, Announcement } from './types';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { StudentPortal } from './components/StudentPortal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { AdminPortal } from './components/AdminPortal';
import { CertificatesView } from './components/CertificatesView';
import { FeesPaymentView } from './components/FeesPaymentView';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { VerificationPortal } from './components/VerificationPortal';
import { TranscriptView } from './components/TranscriptView';
import { LibraryView } from './components/LibraryView';
import { StudentCardModal } from './components/StudentCardModal';
import { LoginModal } from './components/LoginModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { SupportModal } from './components/SupportModal';
import { CollegeLogo } from './components/CollegeLogo';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole>('student');
  const [supportModalOpen, setSupportModalOpen] = useState<boolean>(false);
  const [studentCardModalOpen, setStudentCardModalOpen] = useState<boolean>(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  // App data
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  // Load state and current user
  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    setAnnouncements(storage.getAnnouncements());
    setLectures(storage.getLectures());

    const handleStorageUpdate = () => {
      setAnnouncements(storage.getAnnouncements());
      setLectures(storage.getLectures());
      setCurrentUser(storage.getCurrentUser());
    };

    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, []);

  const handleOpenLogin = (role: UserRole = 'student') => {
    setLoginInitialRole(role);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'student') setCurrentView('student');
    else if (user.role === 'instructor') setCurrentView('instructor');
    else if (user.role === 'admin') setCurrentView('admin');
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleNavigate = (view: string) => {
    // If student view clicked without student login, open login or set demo
    if (view === 'student' && (!currentUser || currentUser.role !== 'student')) {
      handleOpenLogin('student');
      return;
    }
    // If instructor view clicked without instructor login
    if (view === 'instructor' && (!currentUser || currentUser.role !== 'instructor')) {
      handleOpenLogin('instructor');
      return;
    }
    // If admin view clicked without admin login
    if (view === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      handleOpenLogin('admin');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const urgentAnnouncement = announcements.find((a) => a.isUrgent);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-slate-950">
      {/* URGENT TICKER BAR */}
      {urgentAnnouncement && (
        <div className="bg-red-700 text-white text-xs py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-white text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase whitespace-nowrap animate-pulse">
                إعلان عاجل
              </span>
              <span className="font-bold truncate">{urgentAnnouncement.title}:</span>
              <span className="text-red-100 text-[11px] truncate hidden sm:inline">
                {urgentAnnouncement.content}
              </span>
            </div>
            <button
              onClick={() => handleNavigate('home')}
              className="text-[11px] font-bold underline hover:text-amber-200 whitespace-nowrap"
            >
              التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* MAIN NAVIGATION BAR */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenSupport={() => setSupportModalOpen(true)}
        onOpenStudentCard={() => setStudentCardModalOpen(true)}
      />

      {/* CONTENT ROUTING */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onOpenLogin={handleOpenLogin}
            onNavigate={handleNavigate}
            announcements={announcements}
            lectures={lectures}
            onSelectLecture={(lec) => setActiveLecture(lec)}
          />
        )}

        {currentView === 'student' && currentUser && currentUser.role === 'student' && (
          <StudentPortal
            student={currentUser}
            onNavigate={handleNavigate}
            onOpenLecture={(lec: Lecture) => setActiveLecture(lec)}
          />
        )}

        {currentView === 'instructor' && currentUser && currentUser.role === 'instructor' && (
          <InstructorDashboard instructor={currentUser} />
        )}

        {currentView === 'admin' && currentUser && currentUser.role === 'admin' && (
          <AdminPortal adminUser={currentUser} />
        )}

        {currentView === 'certificates' && (
          <CertificatesView currentUser={currentUser} />
        )}

        {currentView === 'fees' && (
          <FeesPaymentView currentUser={currentUser} />
        )}

        {currentView === 'schedule' && (
          <WeeklyScheduleView
            currentUser={currentUser}
            onOpenLecture={(lecId) => {
              const lec = lectures.find((l) => l.id === lecId);
              if (lec) setActiveLecture(lec);
            }}
          />
        )}

        {currentView === 'verification' && (
          <VerificationPortal />
        )}

        {currentView === 'transcript' && (
          <TranscriptView currentUser={currentUser} />
        )}

        {currentView === 'library' && (
          <LibraryView />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0b2545] text-slate-300 border-t border-[#06182c] text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: College Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <CollegeLogo size="md" />
                <div>
                  <h4 className="font-black text-white text-sm">كلية السودان الجديد للمحاسبة</h4>
                  <p className="text-[11px] text-[#c59b6d] font-bold">New Sudan College of Accountancy</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                مؤسسة جامعية أكاديمية رائدة متخصصة في المحاسبة الإلكترونية، نظم المعلومات المالية، والمراجعة المحوسبة وفق المعايير المحاسبية الدولية IFRS.
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>معتمدة من وزارة التعليم العالي والبحث العلمي</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs border-b border-slate-700/60 pb-2">
                البوابات والأنظمة الأكاديمية
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => handleOpenLogin('student')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                    <span>بوابة الطالب الإلكترونية</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('transcript')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                    <span>السجل الأكاديمي وكشف الدرجات المعتمد</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('verification')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                    <span>نظام التحقق الإلكتروني من صحة الشهادات</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('library')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                    <span>المكتبة الرقمية والمستودع المحاسبي</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('certificates')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                    <span>طلب وتوثيق الشهادات الجامعية</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Financial & Services */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs border-b border-slate-700/60 pb-2">
                الخدمات الإلكترونية
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => handleNavigate('fees')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 rotate-180" />
                    <span>سداد الرسوم عبر تطبيق بنكك وفوري</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('schedule')}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 rotate-180" />
                    <span>جدول المحاضرات واللقاءات التفاعلية</span>
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@drama7sd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                    <span>قناة الكلية الرسمية على يوتيوب (@drama7sd)</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setSupportModalOpen(true)}
                    className="hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                    <span>مركز الاستفسارات والدعم الفني والمالي</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact info */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs border-b border-slate-700/60 pb-2">
                التواصل والمقر الأكاديمي
              </h5>
              <div className="space-y-2 text-slate-400 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>الخرطوم - شارع الجمهورية / أمانة الشؤون العلمية والتعليم الإلكتروني</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="dir-ltr font-mono">admission@nsac.edu.sd</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="dir-ltr font-mono">+249 912 000 111</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-[11px] text-slate-400 space-y-1">
            <p>
              جميع الحقوق محفوظة © {new Date().getFullYear()} - كلية السودان الجديد للمحاسبة (New Sudan College of Accountancy)
            </p>
            <p className="text-slate-500">
              مرخصة ومعتمدة من وزارة التعليم العالي والبحث العلمي - جمهورية السودان.
            </p>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={loginModalOpen}
        initialRole={loginInitialRole}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* VIDEO PLAYER MODAL */}
      <VideoPlayerModal
        lecture={activeLecture}
        isOpen={Boolean(activeLecture)}
        onClose={() => setActiveLecture(null)}
      />

      {/* SUPPORT & INQUIRY MODAL */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      {/* STUDENT SMART ID CARD MODAL */}
      {studentCardModalOpen && currentUser && (
        <StudentCardModal
          student={currentUser}
          onClose={() => setStudentCardModalOpen(false)}
        />
      )}
    </div>
  );
}
