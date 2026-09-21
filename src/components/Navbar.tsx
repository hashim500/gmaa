import React, { useState } from 'react';
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenLogin,
  onLogout,
  onOpenSupport,
  onOpenStudentCard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    if (view === 'support' && onOpenSupport) {
      onOpenSupport();
      setMobileMenuOpen(false);
      return;
    }
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Academic Notification & Contact Bar */}
      <div className="bg-[#0b2545] text-slate-300 text-[11px] px-4 py-1.5 hidden sm:flex items-center justify-between border-b border-[#06182c]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            المنصة الإلكترونية الرسمية لكلية السودان الجديد للمحاسبة (NSCA) - القبول والتسجيل 2026/2027 متاح
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">جمهورية السودان • وزارة التعليم العالي والبحث العلمي</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNav('verification')}
            className="hover:text-amber-300 transition flex items-center gap-1 text-amber-300/90 font-bold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> بوابة التحقق من الوثائق
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => handleNav('support')}
            className="hover:text-amber-300 transition flex items-center gap-1 text-slate-300"
          >
            <Headphones className="w-3.5 h-3.5 text-slate-400" /> الدعم الأكاديمي
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Official Crest Emblem */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
          id="college-header-logo-btn"
        >
          <CollegeLogo size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-xl text-[#0b2545] tracking-tight group-hover:text-[#133e68] transition">
                كلية السودان الجديد للمحاسبة
              </h1>
              <span className="hidden xl:inline-block bg-amber-50 text-[#8a6135] font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                المنصة الجامعية المعتمدة
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#8a6135] font-black tracking-wider">
              NEW SUDAN COLLEGE OF ACCOUNTANCY (NSCA)
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-slate-700">
          <button
            onClick={() => handleNav('home')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'home'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <Home className="w-4 h-4 text-slate-500" /> الرئيسية
          </button>

          <button
            onClick={() => handleNav('schedule')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'schedule'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" /> الجدول الدراسي
          </button>

          <button
            onClick={() => handleNav('certificates')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'certificates'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" /> الشهادات
          </button>

          <button
            onClick={() => handleNav('transcript')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'transcript'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" /> كشف الدرجات
          </button>

          <button
            onClick={() => handleNav('verification')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'verification'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> التحقق من الوثائق
          </button>

          <button
            onClick={() => handleNav('library')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'library'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" /> المكتبة الرقمية
          </button>

          <button
            onClick={() => handleNav('fees')}
            className={`transition flex items-center gap-1.5 py-1 ${
              currentView === 'fees'
                ? 'text-[#0b2545] font-black border-b-2 border-[#c59b6d]'
                : 'hover:text-[#0b2545]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" /> دفع الرسوم
          </button>
        </nav>

        {/* User Status / Portals Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-[#0b2545] text-amber-300 flex items-center justify-center font-black text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-right">
                <span className="block text-xs font-black text-slate-800 leading-tight">
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

              {currentUser.role === 'student' && onOpenStudentCard && (
                <button
                  onClick={onOpenStudentCard}
                  className="bg-amber-100 hover:bg-amber-200 text-[#8a6135] text-xs font-bold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
                  title="استعراض البطاقة الجامعية الذكية"
                >
                  <IdCard className="w-3.5 h-3.5" /> البطاقة
                </button>
              )}

              <button
                onClick={() => {
                  if (currentUser.role === 'student') handleNav('student-portal');
                  else if (currentUser.role === 'instructor') handleNav('instructor-portal');
                  else handleNav('admin-portal');
                }}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow-xs"
              >
                لوحة التحكم
              </button>
              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                className="text-slate-400 hover:text-red-600 p-1.5 transition rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('student')}
                id="header-student-login-btn"
                className="bg-[#0b2545] hover:bg-[#133e68] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" /> بوابة الطالب
              </button>
              <button
                onClick={() => onOpenLogin('instructor')}
                id="header-instructor-login-btn"
                className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Presentation className="w-4 h-4 text-slate-300" /> هيئة التدريس
              </button>
              <button
                onClick={() => onOpenLogin('admin')}
                id="header-admin-login-btn"
                className="bg-[#c59b6d] hover:bg-[#b2834c] text-[#0b2545] px-3.5 py-2 rounded-xl font-black text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" /> الإدارة
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          aria-label="القائمة"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {currentUser && (
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-slate-900 font-black block">{currentUser.name}</span>
                <span className="text-[10px] text-[#8a6135] font-bold">
                  {currentUser.role === 'student' ? 'بوابة الطالب' : currentUser.role === 'instructor' ? 'هيئة التدريس' : 'الإدارة العامة'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentUser.role === 'student' && onOpenStudentCard && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenStudentCard();
                    }}
                    className="text-xs bg-amber-200 text-[#8a6135] px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1"
                  >
                    <IdCard className="w-3.5 h-3.5" /> البطاقة
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentUser.role === 'student') handleNav('student-portal');
                    else if (currentUser.role === 'instructor') handleNav('instructor-portal');
                    else handleNav('admin-portal');
                  }}
                  className="text-xs bg-[#0b2545] text-white px-3 py-1.5 rounded-xl font-black"
                >
                  لوحتي
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => handleNav('home')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <Home className="w-4 h-4 text-slate-500" /> الرئيسية
            </button>
            <button
              onClick={() => handleNav('schedule')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <Calendar className="w-4 h-4 text-blue-600" /> الجدول الأسبوعي
            </button>
            <button
              onClick={() => handleNav('certificates')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <Award className="w-4 h-4 text-amber-600" /> شهادات الكلية
            </button>
            <button
              onClick={() => handleNav('transcript')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <FileText className="w-4 h-4 text-indigo-600" /> كشف الدرجات
            </button>
            <button
              onClick={() => handleNav('verification')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> التحقق من الوثائق
            </button>
            <button
              onClick={() => handleNav('library')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <BookOpen className="w-4 h-4 text-purple-600" /> المكتبة الرقمية
            </button>
            <button
              onClick={() => handleNav('fees')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" /> دفع الرسوم
            </button>
            <button
              onClick={() => handleNav('support')}
              className="p-2.5 text-right rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-800"
            >
              <Headphones className="w-4 h-4 text-slate-500" /> الدعم الفني
            </button>
          </div>

          {!currentUser ? (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 font-bold">تسجيل الدخول إلى البوابات:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('student');
                  }}
                  className="bg-[#0b2545] text-white py-2 px-2 rounded-xl font-bold text-center text-[11px] flex flex-col items-center gap-1 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-amber-300" /> الطالب
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('instructor');
                  }}
                  className="bg-slate-800 text-white py-2 px-2 rounded-xl font-bold text-center text-[11px] flex flex-col items-center gap-1 shadow-xs"
                >
                  <Presentation className="w-4 h-4 text-slate-300" /> المعلم
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('admin');
                  }}
                  className="bg-[#c59b6d] text-[#0b2545] py-2 px-2 rounded-xl font-black text-center text-[11px] flex flex-col items-center gap-1 shadow-xs"
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
              className="w-full text-right p-2.5 text-red-600 font-bold text-xs bg-red-50 rounded-xl flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> تسجيل الخروج من النظام
            </button>
          )}
        </div>
      )}
    </header>
  );
};
