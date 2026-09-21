import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Presentation,
  ShieldAlert,
  Zap,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
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
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  const notifySuccess = (user: User) => {
    if (onLoginSuccess) onLoginSuccess(user);
    if (onSuccessLogin) onSuccessLogin(user);
    onClose();
  };

  // Sync initialRole when changed
  React.useEffect(() => {
    setActiveRole(initialRole);
    if (initialRole === 'student') {
      setEmailOrId(DEMO_USERS.student.studentId || '');
    } else if (initialRole === 'instructor') {
      setEmailOrId(DEMO_USERS.instructor.email);
    } else {
      setEmailOrId(DEMO_USERS.admin.email);
    }
  }, [initialRole]);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'student') {
      setEmailOrId(DEMO_USERS.student.studentId || 'NSAC-2023-104');
    } else if (role === 'instructor') {
      setEmailOrId(DEMO_USERS.instructor.email);
    } else {
      setEmailOrId(DEMO_USERS.admin.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = DEMO_USERS[activeRole];
      notifySuccess(user);
    }, 500);
  };

  const handleQuickDemo = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      notifySuccess(DEMO_USERS[role]);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with College Emblem */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-1">
            <CollegeLogo size="lg" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {activeRole === 'student' && 'بوابة تسجيل دخول الطالب'}
            {activeRole === 'instructor' && 'بوابة تسجيل دخول عضو هيئة التدريس'}
            {activeRole === 'admin' && 'بوابة تسجيل دخول إدارة الكلية'}
          </h3>
          <p className="text-xs text-slate-500">
            أهلاً بك في البوابة الإلكترونية المعتمدة لكلية السودان الجديد للمحاسبة
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeRole === 'student'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> طالب
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('instructor')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeRole === 'instructor'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-4 h-4" /> معلم
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> إداري
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {activeRole === 'student'
                ? 'الرقم الجامعي أو البريد الجامعي'
                : 'البريد الإلكتروني الأكاديمي'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                placeholder={
                  activeRole === 'student'
                    ? 'NSAC-2023-104'
                    : 'instructor@nsac.edu.sd'
                }
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                كلمة المرور
              </label>
              <span className="text-[11px] text-blue-700 font-semibold cursor-pointer hover:underline">
                نسيت كلمة المرور؟
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 ${
              activeRole === 'student'
                ? 'bg-blue-700 hover:bg-blue-800'
                : activeRole === 'instructor'
                ? 'bg-slate-800 hover:bg-slate-900'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>تسجيل الدخول للنظام</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>تجربة فورية بنقرة واحدة (حسابات جاهزة للاستعراض):</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="w-full bg-blue-50/90 hover:bg-blue-100 text-blue-900 border border-blue-200/80 rounded-xl px-3 py-2 text-xs font-bold transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>دخول تجريبي كـ: <strong>طالب (محمد أحمد عثمان)</strong></span>
              </div>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-md">
                فوري
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('instructor')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-slate-700" />
                <span>دخول تجريبي كـ: <strong>معلم (د. عبد الله النور)</strong></span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
                فوري
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="w-full bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>دخول تجريبي كـ: <strong>إدارة الكلية (العميد)</strong></span>
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-md">
                فوري
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
