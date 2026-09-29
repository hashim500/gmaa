import React, { useState } from 'react';
import { ShieldCheck, Lock, Cpu, Printer, Zap, Sparkles, Play, Pause } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

interface PrivacyBannerProps {
  t: TranslationDict;
  className?: string;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ t, className = '' }) => {
  const [isPaused, setIsPaused] = useState(false);

  const bannerItems = [
    {
      icon: <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />,
      text: 'معالجة محلية 100% — لا تُرفع ملفاتك إلى أي خادم، لضمان الخصوصية التامة',
      badge: 'خصوصية قصوى',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
    },
    {
      icon: <Cpu className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
      text: 'Client-Side Engine',
      subtext: 'محرك معالجة مدمج في متصفحك',
      badge: 'Local WASM & JS',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    },
    {
      icon: <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
      text: 'Zero Server Uploads',
      subtext: 'ملفاتك وسيرتك الذاتية لا تغادر جهازك أبداً',
      badge: 'حماية كاملة',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    },
    {
      icon: <Printer className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />,
      text: 'طباعة فورية وحفظ كـ PDF عالي الدقة دون علامة مائية',
      badge: 'جاهز للطباعة',
      badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300',
    },
    {
      icon: <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
      text: 'يعمل بلا إنترنت — سرعة فائقة واستقلالية تامة',
      badge: 'Offline-First',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    },
    {
      icon: <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />,
      text: 'أدوات PDF احترافية ومنشئ السيرة الذاتية التفاعلي بأحدث المعايير',
      badge: 'مجانًا 100%',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
    },
  ];

  return (
    <div
      className={`privacy-banner-container no-print relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-teal-200/90 bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-teal-50/80 px-2 py-1.5 text-xs font-medium text-teal-950 shadow-xs transition-colors dark:border-teal-900/60 dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-teal-950/40 dark:text-teal-200 ${className}`}
    >
      {/* Left/Right Edge Fade Masks for smooth gradient entry and exit */}
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-12 rounded-s-2xl bg-gradient-to-e from-teal-50/90 to-transparent dark:from-slate-900/90 rtl:bg-gradient-to-l ltr:bg-gradient-to-r" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 rounded-e-2xl bg-gradient-to-s from-transparent to-teal-50/90 dark:to-slate-900/90 rtl:bg-gradient-to-r ltr:bg-gradient-to-l" />

      <div className="relative flex items-center">
        {/* Fixed Title & Status Pin on the side */}
        <div className="z-20 flex shrink-0 items-center gap-2 pe-3 ps-1 border-e border-teal-200/80 bg-teal-50/95 py-0.5 dark:border-teal-800/80 dark:bg-slate-900/95">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
          </span>
          <span className="font-bold text-[11px] tracking-wide text-teal-900 dark:text-teal-100 whitespace-nowrap">
            🔒 أمان محلي
          </span>
          {/* Pause / Resume button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex h-5 w-5 items-center justify-center rounded text-teal-700 hover:bg-teal-200/60 dark:text-teal-300 dark:hover:bg-teal-800/60"
            title={isPaused ? 'استئناف الحركة' : 'إيقاف الحركة مؤقتاً'}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>

        {/* Slow Animated Marquee Ticker */}
        <div className={`overflow-hidden flex-1 ${isPaused ? 'pause-marquee' : ''}`}>
          <div className="animate-marquee-slow flex items-center gap-8 whitespace-nowrap py-0.5">
            {/* First sequence */}
            {bannerItems.map((item, idx) => (
              <div
                key={`banner-1-${idx}`}
                className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 transition hover:bg-white/60 dark:hover:bg-slate-900/60"
              >
                {item.icon}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.text}
                </span>
                {item.subtext && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    ({item.subtext})
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="text-teal-400/60">•</span>
              </div>
            ))}

            {/* Duplicated sequence for endless loop */}
            {bannerItems.map((item, idx) => (
              <div
                key={`banner-2-${idx}`}
                className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 transition hover:bg-white/60 dark:hover:bg-slate-900/60"
              >
                {item.icon}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.text}
                </span>
                {item.subtext && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    ({item.subtext})
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                <span className="text-teal-400/60">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
