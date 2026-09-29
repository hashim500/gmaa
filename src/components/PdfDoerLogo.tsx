import React from 'react';

interface PdfDoerLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export const PdfDoerLogo: React.FC<PdfDoerLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon / Logo Symbol */}
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25 transition-transform duration-200 group-hover:scale-105 ${iconSizeClasses}`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-6 sm:w-6 drop-shadow-xs"
        >
          {/* Document Sheet Shape with Folded Top-Right Corner */}
          <path
            d="M10 8C10 6.89543 10.8954 6 12 6H23L30 13V32C30 33.1046 29.1046 34 28 34H12C10.8954 34 10 33.1046 10 32V8Z"
            fill="white"
            fillOpacity="0.22"
          />
          <path
            d="M23 6V11C23 12.1046 23.8954 13 25 13H30"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="white"
            fillOpacity="0.4"
          />
          {/* Document Outline */}
          <path
            d="M10 8C10 6.89543 10.8954 6 12 6H23L30 13V32C30 33.1046 29.1046 34 28 34H12C10.8954 34 10 33.1046 10 32V8Z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dynamic "Doer" Action Checkmark / Lightning Strike */}
          <path
            d="M15 21.5L19 25.5L26 17"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Small Action Accent Dot */}
          <circle cx="15.5" cy="14.5" r="1.5" fill="white" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white ${textSizeClasses}`}
            >
              Pdf<span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">Doer</span>
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
