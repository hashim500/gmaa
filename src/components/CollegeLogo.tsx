import React, { useState } from 'react';

interface CollegeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  textPosition?: 'bottom' | 'side';
  lightText?: boolean;
  variant?: 'image' | 'vector' | 'auto';
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textPosition = 'side',
  lightText = false,
  variant = 'auto',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
  };

  const useImage = (variant === 'image' || variant === 'auto') && !imgError;

  return (
    <div
      className={`inline-flex items-center gap-3 ${
        textPosition === 'bottom' ? 'flex-col text-center' : 'flex-row'
      } ${className}`}
    >
      <div
        className={`relative flex-shrink-0 ${sizeClasses[size]} drop-shadow-md rounded-2xl overflow-hidden flex items-center justify-center`}
      >
        {useImage ? (
          <img
            src="/college_logo.jpg"
            alt="شعار كلية السودان الجديد للمحاسبة - New Sudan College of Accountancy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-xl select-none"
          />
        ) : (
          <svg
            viewBox="0 0 400 400"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full select-none"
          >
            <defs>
              <radialGradient id="sealBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#123b6b" />
                <stop offset="70%" stopColor="#0b2545" />
                <stop offset="100%" stopColor="#06182c" />
              </radialGradient>

              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fae588" />
                <stop offset="35%" stopColor="#c59b6d" />
                <stop offset="70%" stopColor="#8a6135" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>

              <path id="textArcTop" d="M 55,200 A 145,145 0 1,1 345,200" fill="none" />
              <path id="textArcBottom" d="M 60,200 A 140,140 0 0,0 340,200" fill="none" />
            </defs>

            {/* Shield Outline & Glow */}
            <circle cx="200" cy="200" r="195" fill="url(#goldGrad)" />
            <circle cx="200" cy="200" r="185" fill="url(#sealBg)" stroke="#c59b6d" strokeWidth="3" />

            <circle cx="45" cy="200" r="7" fill="url(#goldGrad)" />
            <circle cx="355" cy="200" r="7" fill="url(#goldGrad)" />

            <text fill="#ffffff" fontSize="24" fontWeight="900" letterSpacing="1" fontFamily="'Cairo', sans-serif">
              <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
                كلية السودان الجديد للمحاسبة
              </textPath>
            </text>

            <text fill="#fae588" fontSize="16" fontWeight="800" letterSpacing="2" fontFamily="'Cairo', sans-serif">
              <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">
                NEW SUDAN COLLEGE OF ACCOUNTANCY
              </textPath>
            </text>

            <circle cx="200" cy="200" r="132" fill="none" stroke="url(#goldGrad)" strokeWidth="4" />
            <circle cx="200" cy="200" r="126" fill="url(#sealBg)" />

            {/* Map & Wreath */}
            <g stroke="url(#goldGrad)" strokeWidth="2.5" fill="url(#goldGrad)" opacity="0.95">
              <path d="M 125,170 Q 110,135 135,110" fill="none" strokeWidth="2.5" />
              <path d="M 275,170 Q 290,135 265,110" fill="none" strokeWidth="2.5" />
            </g>

            <g transform="translate(162, 82) scale(0.75)" fill="#ffffff" opacity="0.95">
              <path
                d="M 22,2 Q 40,0 60,6 L 75,15 L 70,30 L 78,42 L 68,55 L 60,50 L 52,62 L 40,65 L 35,55 L 20,48 L 15,35 L 20,20 Z"
                stroke="#c59b6d"
                strokeWidth="1.5"
              />
            </g>

            {/* Abacus & Book */}
            <g transform="translate(130, 165)" stroke="url(#goldGrad)" strokeWidth="3" fill="none">
              <rect x="0" y="0" width="140" height="52" rx="4" strokeWidth="3.5" />
              <line x1="0" y1="18" x2="140" y2="18" strokeWidth="2.5" />
            </g>

            <g transform="translate(200, 275)">
              <path
                d="M 0,-18 Q -50,-42 -108,-35 L -100,2 Q -48,-6 0,10 Q 48,-6 100,2 L 108,-35 Q 50,-42 0,-18 Z"
                fill="#ffffff"
                stroke="url(#goldGrad)"
                strokeWidth="1.5"
              />
              <line x1="0" y1="-20" x2="0" y2="16" stroke="url(#goldGrad)" strokeWidth="3" />
            </g>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight leading-none text-base sm:text-lg ${
              lightText ? 'text-white' : 'text-slate-900'
            }`}
          >
            كلية السودان الجديد للمحاسبة
          </span>
          <span
            className={`text-[11px] sm:text-xs font-bold mt-1 tracking-wider ${
              lightText ? 'text-amber-300' : 'text-amber-700'
            }`}
          >
            NEW SUDAN COLLEGE OF ACCOUNTANCY
          </span>
          <span
            className={`text-[10px] font-medium mt-0.5 ${
              lightText ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            المنصة الأكاديمية الإلكترونية المتطورة • NSCA
          </span>
        </div>
      )}
    </div>
  );
};
