import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenCookiePolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenCookiePolicy,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pdftools_cookie_consent');
      if (!stored) {
        // Show after a brief delay so it doesn't obstruct initial page render
        const timer = setTimeout(() => setIsVisible(true), 900);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        'pdftools_cookie_consent',
        JSON.stringify({
          status: 'accepted_all',
          essential: true,
          analytics: true,
          ads: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (e) {
      // ignore
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(
        'pdftools_cookie_consent',
        JSON.stringify({
          status: 'dismissed',
          essential: true,
          analytics: false,
          ads: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (e) {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      id="cookie-consent-widget"
      role="region"
      aria-label="تنبيه ملفات تعريف الارتباط"
      className="no-print fixed bottom-4 end-4 z-50 w-[92vw] max-w-sm sm:max-w-[380px] animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 sm:p-4.5 shadow-2xl backdrop-blur-md text-slate-100">
        {/* Close / Dismiss button */}
        <button
          id="cookie-dismiss-btn"
          type="button"
          onClick={handleDismiss}
          aria-label="إغلاق التنبيه"
          className="absolute top-2.5 start-2.5 p-1 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with cookie icon & notice */}
        <div className="flex items-start gap-2.5 ps-5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Cookie className="h-4 w-4" />
          </div>
          <p className="text-[12.5px] leading-relaxed text-slate-200">
            يستخدم هذا الموقع ملفات تعريف الارتباط من Google لتقديم خدماته وتحليل حركة المرور وعرض الإعلانات المخصصة.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex flex-col gap-2">
          {/* Main Acceptance Button (Exact Orange / Amber style like in the user screenshot) */}
          <button
            id="cookie-accept-all-btn"
            type="button"
            onClick={handleAcceptAll}
            className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md hover:from-amber-500 hover:to-orange-400 active:scale-[0.98] transition cursor-pointer"
          >
            أنني موافق على تعريف الارتباط
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
            <button
              id="cookie-learn-more-btn"
              type="button"
              onClick={onOpenCookiePolicy}
              className="text-slate-400 hover:text-amber-400 underline underline-offset-2 transition"
            >
              مزيد من المعلومات والخيارات
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Privacy & Security</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
