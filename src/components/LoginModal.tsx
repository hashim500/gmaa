import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Presentation,
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../services/storage';

interface LoginModalProps {
  isOpen: boolean;
  initialRole: UserRole;
  onClose: () => void;
  onSuccessLogin?: (user: User) => void;
  onLoginSuccess?: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialRole,
  onClose,
  onSuccessLogin,
  onLoginSuccess,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole || 'student');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const notifySuccess = (user: User) => {
    if (onLoginSuccess) onLoginSuccess(user);
    if (onSuccessLogin) onSuccessLogin(user);
    onClose();
  };

  // Reset form when opened or role changed
  React.useEffect(() => {
    setActiveRole(initialRole || 'student');
    setEmailOrId('');
    setPassword('');
    setErrorMessage(null);
  }, [initialRole, isOpen]);

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setEmailOrId('');
    setPassword('');
    setErrorMessage(null);
  };

  const fillDemoCredentials = () => {
    if (activeRole === 'student') {
      setEmailOrId('NSAC-2023-104');
      setPassword('123456');
    } else if (activeRole === 'instructor') {
      setEmailOrId('inst-1');
      setPassword('123456');
    } else {
      setEmailOrId('adm-1');
      setPassword('123456');
    }
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = emailOrId.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      setErrorMessage('يرجى إدخال اسم المستخدم أو الرقم الجامعي وكلمة المرور.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Verify Credentials strictly based on Role and Accounts
      if (activeRole === 'student') {
        const validId = 'nsac-2023-104';
        const validEmail = 'mohamed.ahmed@nsac.edu.sd';
        const isPassValid = cleanPass === 'std@2026' || cleanPass === '123456';

        if ((cleanInput === validId || cleanInput === validEmail) && isPassValid) {
          notifySuccess(DEMO_USERS.student);
          return;
        }
      } else if (activeRole === 'instructor') {
        const validId = 'inst-1';
        const validEmail = 'abdullah.alnour@nsac.edu.sd';
        const isPassValid = cleanPass === 'prof@2026' || cleanPass === '123456';

        if ((cleanInput === validId || cleanInput === validEmail) && isPassValid) {
          notifySuccess(DEMO_USERS.instructor);
          return;
        }
      } else if (activeRole === 'admin') {
        const validEmail1 = 'admin@nsac.edu.sd';
        const validEmail2 = 'dean@nsac.edu.sd';
        const validId = 'adm-1';
        const isPassValid = cleanPass === 'admin@2026' || cleanPass === '123456';

        if ((cleanInput === validEmail1 || cleanInput === validEmail2 || cleanInput === validId) && isPassValid) {
          notifySuccess(DEMO_USERS.admin);
          return;
        }
      }

      setErrorMessage('بيانات الدخول غير صحيحة. يرجى التحقق من صحة الرقم الجامعي/البريد الإلكتروني وكلمة المرور.');
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-[#c59b6d]/40 overflow-hidden relative my-auto animate-fade-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner - Sticky on mobile so exit button is always reachable */}
        <div className="bg-gradient-to-r from-[#06182c] via-[#0b2545] to-[#133e68] p-4 sm:p-6 text-white relative border-b-2 border-[#c59b6d] flex-shrink-0">
          {/* Prominent High-Visibility Close Button for Mobile & Desktop */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 left-3.5 text-white bg-white/20 hover:bg-white/35 active:bg-white/40 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition shadow-md z-30 cursor-pointer border border-white/30"
            aria-label="إغلاق نافذة تسجيل الدخول"
            title="إغلاق والعودة إلى الموقع"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3 pr-1">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0">
              <CollegeLogo size="sm" />
            </div>
            <div className="pl-12">
              <div className="inline-flex items-center gap-1.5 bg-[#c59b6d]/20 text-[#fae588] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>بوابة الدخول الموحدة الآمنة</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">كلية السودان الجديد للمحاسبة</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">تسجيل الدخول للأنظمة والخدمات الجامعية</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Role Selector Tabs */}
          <div>
            <label className="text-[11px] font-black text-slate-600 block mb-2">اختر البوابة المستهدفة:</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRole === 'student'
                    ? 'bg-[#0b2545] text-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> طالب
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('instructor')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRole === 'instructor'
                    ? 'bg-[#0b2545] text-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-4 h-4" /> أستاذ
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-[#0b2545] text-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4" /> إدارة
              </button>
            </div>
          </div>

          {/* Quick Demo Autofill Helper */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="text-right">
              <span className="text-[10px] text-amber-800 font-bold block">
                {activeRole === 'student'
                  ? 'حساب تجريبي: NSAC-2023-104 (123456)'
                  : activeRole === 'instructor'
                  ? 'حساب أستاذ: inst-1 (123456)'
                  : 'حساب إدارة: adm-1 (123456)'}
              </span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-xs transition flex-shrink-0 cursor-pointer"
            >
              تعبئة تلقائية
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeRole === 'student'
                  ? 'الرقم الجامعي أو البريد الإلكتروني'
                  : 'البريد الإلكتروني الجامعي أو المعرّف الأكاديمي'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={
                    activeRole === 'student'
                      ? 'مثال: NSAC-2023-104 أو البريد الجامعي'
                      : activeRole === 'instructor'
                      ? 'البريد الجامعي للأستاذ (inst-1)'
                      : 'البريد الرسمي للإدارة الأكاديمية (adm-1)'
                  }
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:border-transparent transition"
                />
                <div className="absolute right-3 top-3 text-slate-400">
                  {activeRole === 'student' ? <GraduationCap className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">كلمة المرور السرية</label>
                <span className="text-[10px] text-slate-400">مشفرة بأمان</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2545] focus:border-transparent transition"
                />
                <div className="absolute right-3 top-3 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0b2545] focus:ring-[#0b2545]"
                />
                <span>تذكر بيانات تسجيل الدخول</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert('لإعادة تعيين كلمة المرور أو في حال فقدان بيانات الدخول، يرجى مراجعة إدارة القبول والتسجيل أو مسؤولي الدعم الفني بالكلية.')
                }
                className="text-[#0b2545] hover:underline font-bold text-[11px]"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Action Buttons: Submit AND Explicit Mobile-Friendly Cancel Button */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0b2545] hover:bg-[#133e68] text-white font-black py-3 rounded-2xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>
                      تسجيل الدخول إلى{' '}
                      {activeRole === 'student' ? 'بوابة الطالب' : activeRole === 'instructor' ? 'بوابة المعلم' : 'لوحة الإدارة'}
                    </span>
                    <ArrowRight className="w-4 h-4 rotate-180 text-amber-300 group-hover:-translate-x-1 transition" />
                  </>
                )}
              </button>

              {/* Explicit Exit / Cancel Button for Mobile & Desktop */}
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>إلغاء والعودة إلى الموقع</span>
              </button>
            </div>
          </form>

          {/* Privacy & Security Notice */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>نظام تسجيل دخول مشفر وخاص بمنسوبي كلية السودان الجديد للمحاسبة.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
