import React, { useEffect } from 'react';
import { Sparkles, Layers } from 'lucide-react';

export type AdFormat = 'auto' | 'horizontal' | 'rectangle' | 'vertical-flank';

export interface AdSenseBannerProps {
  slotId?: string;
  client?: string;
  format?: AdFormat;
  className?: string;
  label?: string;
  hidePlaceholderInProd?: boolean;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = '0000000000',
  client = 'ca-pub-XXXXXXXXXXXXXXXX',
  format = 'auto',
  className = '',
  label,
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle;
        if (Array.isArray(adsbygoogle)) {
          adsbygoogle.push({});
        }
      }
    } catch {
      // AdSense script may not be loaded or blocked by adblockers, silently ignore
    }
  }, []);

  // Format-specific layouts
  if (format === 'vertical-flank') {
    return (
      <div
        className={`no-print select-none rounded-2xl border border-slate-200/90 bg-white/80 p-2.5 text-center shadow-xs backdrop-blur-xs transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60 ${className}`}
        style={{ minHeight: '560px', width: '100%' }}
      >
        {/* Subtle Policy Label */}
        <div className="mb-2 flex items-center justify-center gap-1.5 border-b border-slate-100 pb-1.5 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label || 'إعلان • AD'}
          </span>
        </div>

        {/* Real AdSense Ins Slot (activated when real publisher client script is included) */}
        <div className="relative flex h-[500px] w-full flex-col items-center justify-between overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format="vertical"
            data-full-width-responsive="false"
          />

          {/* Polite Placeholder visuals (visible when adsbygoogle does not render an iframe) */}
          <div className="my-auto flex flex-col items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <Layers className="h-5 w-5 opacity-80" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                مساحة إعلانية جانبية
              </p>
              <p className="text-[10px] text-slate-400 font-mono">160 × 600</p>
            </div>
          </div>

          <div className="w-full border-t border-slate-200/60 pt-2 text-[9px] text-slate-400 dark:border-slate-800/60">
            Google AdSense
          </div>
        </div>
      </div>
    );
  }

  if (format === 'rectangle') {
    return (
      <div
        className={`no-print select-none rounded-2xl border border-slate-200/90 bg-white/80 p-3 text-center shadow-xs backdrop-blur-xs transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60 ${className}`}
      >
        <div className="mb-1.5 flex items-center justify-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label || 'إعلان • Advertisement'}
          </span>
        </div>

        <div className="relative flex min-h-[250px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format="rectangle"
            data-full-width-responsive="true"
          />

          <div className="flex flex-col items-center gap-1.5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              مساحة إعلانية (Google AdSense)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">300 × 250 Medium Rectangle</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Horizontal Banner / Responsive Leaderboard
  return (
    <div
      className={`no-print select-none overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-3 text-center shadow-xs backdrop-blur-xs transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60 ${className}`}
    >
      {/* Required AdSense Policy Label */}
      <div className="mb-1.5 flex items-center justify-between px-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label || 'إعلان • Advertisement'}
        </span>
        <span className="text-[9px] text-slate-400/80 dark:text-slate-500 font-mono">
          Google AdSense
        </span>
      </div>

      {/* Ad unit container */}
      <div className="relative flex min-h-[90px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 py-3.5 px-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
              مساحة إعلانية (Google AdSense)
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            إعلانات آمنة ومفلترة تساهم في إتاحة كافة الأدوات مجاناً
          </span>
        </div>
      </div>
    </div>
  );
};
