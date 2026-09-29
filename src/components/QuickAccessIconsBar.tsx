import React from 'react';
import {
  Check,
  MonitorPlay,
  Info,
  BookOpen,
  UserCheck,
  AtSign,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

interface QuickAccessIconsBarProps {
  onNavigate: (view: string) => void;
  onOpenLogin: (role?: UserRole) => void;
}

export const QuickAccessIconsBar: React.FC<QuickAccessIconsBarProps> = ({
  onNavigate,
  onOpenLogin,
}) => {
  const items = [
    {
      id: 'admission',
      title: 'الالتحاق بالكلية',
      subtitle: 'التقديم الإلكتروني المباشر',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[2.5px] border-[#0b2545] flex items-center justify-center text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white group-hover:border-[#0b2545] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
        </div>
      ),
      badge: 'متاح للتقديم',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      action: () => onNavigate('registration'),
    },
    {
      id: 'lms',
      title: 'نظام التعلم الإلكتروني',
      subtext: '(LMS)',
      subtitle: 'المحاضرات والفصول الحية',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[2.5px] border-[#0b2545] flex items-center justify-center text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white group-hover:border-[#0b2545] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 fill-current"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="3" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="12" cy="8" r="1.5" fill="currentColor" />
            <polygon points="10 11 15 13 10 15" fill="currentColor" />
            <path d="M7 21h10M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      ),
      badge: 'فصول ذكية',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      action: () => onNavigate('student-portal'),
    },
    {
      id: 'sis',
      title: 'نظام معلومات الطالب',
      subtext: '(SIS)',
      subtitle: 'السجل والدرجات والجدول',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[2.5px] border-[#0b2545] flex items-center justify-center text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white group-hover:border-[#0b2545] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105">
          <span className="font-serif font-black text-3xl sm:text-4xl">i</span>
        </div>
      ),
      badge: 'سجل معتمد',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      action: () => onNavigate('transcript'),
    },
    {
      id: 'library',
      title: 'المكتبة الإلكترونية',
      subtitle: 'معايير IFRS وقارئ الكتب',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[2.5px] border-[#0b2545] flex items-center justify-center text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white group-hover:border-[#0b2545] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105">
          <div className="relative">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="11" x2="13" y2="11" />
              <path d="M15 16l2 4M9 16l-2 4M5 20h14" />
            </svg>
            <span className="absolute -top-1 -right-1 font-black text-[9px] bg-[#c59b6d] text-white px-1 rounded-sm">
              A
            </span>
          </div>
        </div>
      ),
      badge: 'قراءة أونلاين',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      action: () => onNavigate('library'),
    },
    {
      id: 'staff',
      title: 'بوابة الموظفين والأساتذة',
      subtitle: 'أعضاء التدريس والإدارة',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[2.5px] border-[#0b2545] flex items-center justify-center text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white group-hover:border-[#0b2545] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 fill-current"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="8" r="4" fill="none" />
            <path d="M5.5 20a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      ),
      badge: 'هيئة التدريس',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      action: () => onOpenLogin('instructor'),
    },
    {
      id: 'verification-fees',
      title: 'البريد والتحقق وسداد الرسوم',
      subtitle: 'مطابقة الوثائق والدفع الإلكتروني',
      icon: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[2.5px] border-[#0b2545] flex items-center justify-center text-[#0b2545] group-hover:bg-[#0b2545] group-hover:text-white group-hover:border-[#0b2545] transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:scale-105">
          <AtSign className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
        </div>
      ),
      badge: 'فوري وبنكك',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      action: () => onNavigate('fees'),
    },
  ];

  return (
    <section className="bg-white py-8 sm:py-12 border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[#8a6135] text-xs font-black tracking-widest uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
            منظومة الخدمات الإلكترونية الموحدة (NSCA Quick Services)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0b2545]">
            بوابات الوصول السريع والأنظمة الأكاديمية
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1">
            اضغط على أي بوابة للدخول المباشر إلى المنظومة الأكاديمية أو السجل أو المكتبة الرقمية
          </p>
        </div>

        {/* 6 Circular Icons Row matching Image 1 and Image 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6 justify-items-center">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="group flex flex-col items-center text-center w-full max-w-[170px] p-2 rounded-2xl hover:bg-slate-50/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0b2545]/20 cursor-pointer"
            >
              {/* Circular Icon Container */}
              <div className="relative mb-3 flex items-center justify-center">
                {item.icon}
                {item.badge && (
                  <span
                    className={`absolute -bottom-2 text-[9px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${item.badgeColor} whitespace-nowrap`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Subtext */}
              <div className="space-y-0.5 mt-1.5">
                <h3 className="font-bold text-xs sm:text-[13px] text-[#0b2545] group-hover:text-[#133e68] transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.subtext && (
                  <span className="text-[11px] font-black text-slate-500 block font-mono">
                    {item.subtext}
                  </span>
                )}
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1 group-hover:text-slate-600 transition-colors">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
