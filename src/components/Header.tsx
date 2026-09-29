import React, { useState, useRef, useEffect } from 'react';
import {
  Moon,
  Sun,
  Globe,
  FileText,
  ChevronDown,
  Menu,
  X,
  Layers,
  Split,
  Minimize2,
  RefreshCw,
  Briefcase,
  Grid,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Mail,
  Info,
  Eye,
} from 'lucide-react';
import { SupportedLanguage, LegalPageId, ToolId } from '../types';
import { TranslationDict } from '../i18n/translations';
import {
  TOOLS_CONFIG,
  CONVERT_MENU_ITEMS,
  BUSINESS_MENU_ITEMS,
  MEGA_MENU_COLUMNS,
} from '../utils/toolsConfig';
import { PdfDoerLogo } from './PdfDoerLogo';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  t: TranslationDict;
  onGoHome: () => void;
  activeTool?: ToolId | null;
  onSelectTool?: (toolId: ToolId) => void;
  onToggleMobileSidebar?: () => void;
  onNavigateLegalPage?: (page: LegalPageId) => void;
  textScale?: number;
  onIncreaseTextScale?: () => void;
  onDecreaseTextScale?: () => void;
  onResetTextScale?: () => void;
  isGrayscale?: boolean;
  onToggleGrayscale?: () => void;
}

const LANGUAGES: { code: SupportedLanguage; name: string; flag: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  t,
  onGoHome,
  activeTool,
  onSelectTool,
  onToggleMobileSidebar,
  onNavigateLegalPage,
  textScale = 100,
  onIncreaseTextScale,
  onDecreaseTextScale,
  onResetTextScale,
  isGrayscale = false,
  onToggleGrayscale,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'convert' | 'business' | 'mega' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToolClick = (toolId: ToolId) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onSelectTool) {
      onSelectTool(toolId);
    }
  };

  const getToolTitle = (toolId: ToolId) => {
    const tool = TOOLS_CONFIG[toolId];
    if (!tool) return toolId;
    return (t.tools as any)[tool.titleKey]?.title || tool.titleKey;
  };

  const getToolDesc = (toolId: ToolId) => {
    const tool = TOOLS_CONFIG[toolId];
    if (!tool) return '';
    return (t.tools as any)[tool.titleKey]?.desc || '';
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/90 dark:bg-slate-900/95"
    >
      {/* Main Top Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Right Section in RTL (Logo & Brand) */}
        <div className="flex items-center gap-3">
          <button
            id="btn-brand-home"
            onClick={() => {
              setOpenDropdown(null);
              onGoHome();
            }}
            className="group flex items-center text-start transition-opacity hover:opacity-95 focus:outline-none"
          >
            <PdfDoerLogo
              size="md"
              subtitle="أدوات PDF احترافية ومجانية 100%"
            />
          </button>
        </div>

        {/* Center / Main Navigation Links (Desktop like iLovePDF) */}
        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {/* 1. Direct Link: دمج PDF */}
          <button
            type="button"
            id="nav-btn-merge"
            onClick={() => handleToolClick('merge')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
              activeTool === 'merge'
                ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                : 'text-slate-700 hover:bg-slate-100 hover:text-red-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-red-400'
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-white shadow-xs">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span>دمج PDF</span>
          </button>

          {/* 2. Direct Link: تقسيم PDF */}
          <button
            type="button"
            id="nav-btn-split"
            onClick={() => handleToolClick('split')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
              activeTool === 'split'
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                : 'text-slate-700 hover:bg-slate-100 hover:text-amber-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-amber-400'
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-white shadow-xs">
              <Split className="h-3.5 w-3.5" />
            </span>
            <span>تقسيم PDF</span>
          </button>

          {/* 3. Direct Link: ضغط PDF */}
          <button
            type="button"
            id="nav-btn-compress"
            onClick={() => handleToolClick('compress')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
              activeTool === 'compress'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400'
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white shadow-xs">
              <Minimize2 className="h-3.5 w-3.5" />
            </span>
            <span>ضغط PDF</span>
          </button>

          {/* 4. Dropdown: تحويل PDF ▾ */}
          <div className="relative">
            <button
              type="button"
              id="nav-btn-convert"
              onClick={() =>
                setOpenDropdown(openDropdown === 'convert' ? null : 'convert')
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                openDropdown === 'convert'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white shadow-xs">
                <RefreshCw className="h-3.5 w-3.5" />
              </span>
              <span>تحويل PDF</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === 'convert' ? 'rotate-180 text-blue-600' : 'opacity-70'
                }`}
              />
            </button>

            {/* Convert Dropdown Menu */}
            {openDropdown === 'convert' && (
              <div className="absolute start-0 top-full mt-2 w-[480px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="grid grid-cols-2 gap-4">
                  {/* Column 1: التحويل إلى PDF */}
                  <div>
                    <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      التحويل إلى PDF
                    </h4>
                    <div className="space-y-1">
                      {CONVERT_MENU_ITEMS.toPdf.map((toolId) => {
                        const tool = TOOLS_CONFIG[toolId];
                        const Icon = tool.icon;
                        return (
                          <button
                            key={toolId}
                            onClick={() => handleToolClick(toolId)}
                            className="group flex w-full items-center gap-3 rounded-xl p-2 text-start transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tool.colors.bg} text-white shadow-sm transition-transform group-hover:scale-105`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                                  {getToolTitle(toolId)}
                                </span>
                              </div>
                              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                                {getToolDesc(toolId)}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: التحويل من PDF */}
                  <div>
                    <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      التحويل من PDF
                    </h4>
                    <div className="space-y-1">
                      {CONVERT_MENU_ITEMS.fromPdf.map((toolId) => {
                        const tool = TOOLS_CONFIG[toolId];
                        const Icon = tool.icon;
                        return (
                          <button
                            key={toolId}
                            onClick={() => handleToolClick(toolId)}
                            className="group flex w-full items-center gap-3 rounded-xl p-2 text-start transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tool.colors.bg} text-white shadow-sm transition-transform group-hover:scale-105`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                                  {getToolTitle(toolId)}
                                </span>
                              </div>
                              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                                {getToolDesc(toolId)}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Dropdown: أدوات الأعمال والمالية ▾ */}
          <div className="relative">
            <button
              type="button"
              id="nav-btn-business"
              onClick={() =>
                setOpenDropdown(openDropdown === 'business' ? null : 'business')
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                openDropdown === 'business'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white shadow-xs">
                <Briefcase className="h-3.5 w-3.5" />
              </span>
              <span>أدوات الأعمال والمالية</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === 'business'
                    ? 'rotate-180 text-emerald-600'
                    : 'opacity-70'
                }`}
              />
            </button>

            {/* Business Dropdown Menu */}
            {openDropdown === 'business' && (
              <div className="absolute start-0 top-full mt-2 w-[460px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                    أدوات الشركات والمحاسبة والرواتب
                  </h4>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                    معتمد للطباعة
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BUSINESS_MENU_ITEMS.map((toolId) => {
                    const tool = TOOLS_CONFIG[toolId];
                    const Icon = tool.icon;
                    return (
                      <button
                        key={toolId}
                        onClick={() => handleToolClick(toolId)}
                        className="group flex items-center gap-3 rounded-xl p-2.5 text-start transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.colors.bg} text-white shadow-sm transition-transform group-hover:scale-105`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                            {getToolTitle(toolId)}
                          </span>
                          <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">
                            {tool.badgeText || getToolDesc(toolId)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 6. MEGA MENU: جميع أدوات PDF ▾ */}
          <div className="relative">
            <button
              type="button"
              id="nav-btn-mega"
              onClick={() =>
                setOpenDropdown(openDropdown === 'mega' ? null : 'mega')
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition-all ${
                openDropdown === 'mega'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'text-slate-900 hover:bg-slate-100 hover:text-rose-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-rose-400'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-xs">
                <Grid className="h-3.5 w-3.5" />
              </span>
              <span>جميع أدوات PDF</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openDropdown === 'mega'
                    ? 'rotate-180 text-rose-600'
                    : 'opacity-70'
                }`}
              />
            </button>

            {/* Mega Menu Full-Width Floating Panel */}
            {openDropdown === 'mega' && (
              <div className="fixed inset-x-4 top-16 z-50 mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-200/90 bg-white/98 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/98 animate-in fade-in-50 zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 text-white shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      مجموعة أدوات PDF الذكية المتكاملة (35+ أداة)
                    </h3>
                  </div>
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* 5 Distinct Columns with Colored Badges like iLovePDF */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {MEGA_MENU_COLUMNS.map((column, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className={`h-2.5 w-2.5 rounded-full ${column.iconBg}`} />
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {column.title}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {column.tools.map((toolId) => {
                          const tool = TOOLS_CONFIG[toolId];
                          if (!tool) return null;
                          const Icon = tool.icon;
                          const isCurrent = activeTool === toolId;

                          return (
                            <button
                              key={toolId}
                              onClick={() => handleToolClick(toolId)}
                              className={`group flex w-full items-center gap-2.5 rounded-xl p-2 text-start transition-all ${
                                isCurrent
                                  ? 'bg-rose-50 font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                              }`}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tool.colors.bg} text-white shadow-xs transition-transform group-hover:scale-110`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold group-hover:text-rose-600 dark:group-hover:text-rose-400">
                                  {getToolTitle(toolId)}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Left Section in RTL (Language, Theme, Legal Links, Mobile Toggle) */}
        <div className="flex items-center gap-2">
          {/* Quick Legal links on large screens */}
          {onNavigateLegalPage && (
            <div className="hidden items-center gap-1 text-xs font-bold text-slate-500 xl:flex dark:text-slate-400 me-2">
              <button
                type="button"
                onClick={() => onNavigateLegalPage('privacy')}
                className="rounded-lg px-2 py-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition"
              >
                الخصوصية
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onNavigateLegalPage('contact')}
                className="rounded-lg px-2 py-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition"
              >
                اتصل بنا
              </button>
            </div>
          )}

          {/* Accessibility Tools matching User's request and screenshot */}
          <div className="flex items-center gap-1 sm:gap-1.5 rounded-2xl border border-slate-200 bg-slate-50/90 p-1 dark:border-slate-800 dark:bg-slate-900/90 shadow-2xs">
            {/* Decrease text size: - A */}
            <button
              type="button"
              id="btn-font-decrease"
              onClick={onDecreaseTextScale}
              className="flex h-8 px-2.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition active:scale-95 cursor-pointer shadow-2xs"
              title="تصغير حجم نصوص الموقع (- A)"
            >
              - A
            </button>

            {/* Increase text size: + A */}
            <button
              type="button"
              id="btn-font-increase"
              onClick={onIncreaseTextScale}
              className="flex h-8 px-2.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition active:scale-95 cursor-pointer shadow-2xs"
              title="تكبير حجم نصوص الموقع (+ A)"
            >
              + A
            </button>

            {/* Reset Scale if not 100% */}
            {textScale !== 100 && (
              <button
                type="button"
                onClick={onResetTextScale}
                className="hidden sm:flex text-[10px] font-bold font-mono px-1.5 py-1 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 hover:bg-teal-100 transition cursor-pointer"
                title="إعادة ضبط حجم الخط إلى 100%"
              >
                {textScale}%
              </button>
            )}

            {/* Grayscale / Color Blocking Button */}
            <button
              type="button"
              id="btn-toggle-grayscale"
              onClick={onToggleGrayscale}
              className={`flex h-8 px-2 items-center gap-1 rounded-xl border text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs ${
                isGrayscale
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
              title={
                isGrayscale
                  ? 'إلغاء حجب الألوان والعودة للوضع الطبيعي'
                  : 'تفعيل حجب الألوان والتدرج الرمادي (Grayscale)'
              }
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">
                {isGrayscale ? 'ألوان' : 'رمادي'}
              </span>
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                id="btn-language-menu"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex h-8 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-2xs"
                title={t.switchLanguage}
              >
                <span className="uppercase text-[11px] font-bold">
                  {currentLang.toUpperCase()}
                </span>
                <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute end-0 top-full z-50 mt-1.5 min-w-[140px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        id={`btn-lang-${lang.code}`}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          currentLang === lang.code
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {currentLang === lang.code && (
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Switcher Button */}
            <button
              id="btn-toggle-theme"
              onClick={onToggleDarkMode}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-2xs cursor-pointer"
              title={isDarkMode ? t.lightMode : t.darkMode}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 transition-transform hover:-rotate-12" />
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="btn-open-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            title="القائمة العلوية للأدوات"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Top Dropdown Drawer (when clicked on mobile) */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-6 shadow-2xl lg:hidden dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
          {/* Mobile Accessibility Bar */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>تخصيص العرض وحجم الخط</span>
              {textScale !== 100 && (
                <button
                  type="button"
                  onClick={onResetTextScale}
                  className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline"
                >
                  إعادة ضبط الخط ({textScale}%)
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={onDecreaseTextScale}
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs"
                title="تصغير الخط"
              >
                - A
              </button>
              <button
                type="button"
                onClick={onIncreaseTextScale}
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs"
                title="تكبير الخط"
              >
                + A
              </button>
              <button
                type="button"
                onClick={onToggleGrayscale}
                className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-bold shadow-2xs ${
                  isGrayscale
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
                title="حجب الألوان"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="text-[11px]">{isGrayscale ? 'ألوان' : 'رمادي'}</span>
              </button>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs"
                title="تبديل الوضع"
              >
                {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-600" />}
                <span className="text-[11px]">{isDarkMode ? 'نهاري' : 'ليلي'}</span>
              </button>
            </div>
          </div>
          {/* Quick Primary Links with Colorful Badges */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleToolClick('merge')}
              className="flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white">
                <Layers className="h-4 w-4" />
              </span>
              <span>دمج PDF</span>
            </button>
            <button
              onClick={() => handleToolClick('split')}
              className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Split className="h-4 w-4" />
              </span>
              <span>تقسيم PDF</span>
            </button>
            <button
              onClick={() => handleToolClick('compress')}
              className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Minimize2 className="h-4 w-4" />
              </span>
              <span>ضغط PDF</span>
            </button>
            <button
              onClick={() => handleToolClick('payroll')}
              className="flex items-center gap-2 rounded-xl bg-teal-50 p-2.5 text-xs font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Briefcase className="h-4 w-4" />
              </span>
              <span>مسير الرواتب</span>
            </button>
          </div>

          {/* Categorized Lists */}
          <div className="space-y-5">
            {MEGA_MENU_COLUMNS.map((column, colIdx) => (
              <div key={colIdx} className="space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${column.iconBg}`} />
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {column.title}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {column.tools.map((toolId) => {
                    const tool = TOOLS_CONFIG[toolId];
                    if (!tool) return null;
                    const Icon = tool.icon;
                    return (
                      <button
                        key={toolId}
                        onClick={() => handleToolClick(toolId)}
                        className="flex items-center gap-2.5 rounded-xl p-2 text-start hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tool.colors.bg} text-white shadow-xs`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {getToolTitle(toolId)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Legal links */}
          {onNavigateLegalPage && (
            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateLegalPage('privacy');
                }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800"
              >
                سياسة الخصوصية
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateLegalPage('contact');
                }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800"
              >
                اتصل بنا
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateLegalPage('about');
                }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800"
              >
                من نحن
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
