import React, { useState } from 'react';
import {
  Layers,
  Split,
  RotateCw,
  LayoutGrid,
  Image,
  Images,
  Edit3,
  Stamp,
  Lock,
  Minimize2,
  Search,
  Home,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Briefcase,
  FileText,
  Award,
  FileSpreadsheet,
  Contact,
  FileCheck,
  FileImage,
  QrCode,
  EyeOff,
  Scale,
  Info,
  Mail,
  Cookie,
  AlertTriangle,
  PenTool,
  ScanText,
  User,
  Calendar,
  Receipt,
  FileCheck2,
  Percent,
  Type,
  Grid,
  Contrast,
  Crop,
  FileSignature,
  GitCompare,
  FileDigit,
  Eraser,
} from 'lucide-react';
import { ToolId, ToolDefinition, LegalPageId } from '../types';
import { TranslationDict } from '../i18n/translations';
import { TOOLS_CONFIG } from '../utils/toolsConfig';
import { PdfDoerLogo } from './PdfDoerLogo';

interface SidebarProps {
  tools: ToolDefinition[];
  activeTool: ToolId | null;
  onSelectTool: (toolId: ToolId | null) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  t: TranslationDict;
  activeLegalPage?: LegalPageId | null;
  onSelectLegalPage?: (page: LegalPageId) => void;
}

interface CvSubItem {
  id: ToolId;
  template: 'modern' | 'table' | 'classic';
  titleKey: 'cvModern' | 'cvTable' | 'cvClassic';
  fallbackBadge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CV_SUB_ITEMS: CvSubItem[] = [
  {
    id: 'cv-modern',
    template: 'modern',
    titleKey: 'cvModern',
    fallbackBadge: 'العصري',
    icon: Layers,
  },
  {
    id: 'cv-table',
    template: 'table',
    titleKey: 'cvTable',
    fallbackBadge: 'التفاعلي',
    icon: FileSpreadsheet,
  },
  {
    id: 'cv-classic',
    template: 'classic',
    titleKey: 'cvClassic',
    fallbackBadge: 'الكلاسيكي',
    icon: Award,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  tools,
  activeTool,
  onSelectTool,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  t,
  activeLegalPage = null,
  onSelectLegalPage,
}) => {
  // Always keep CV sub-menu open by default so user immediately sees the three CV variants
  const [isCvExpanded, setIsCvExpanded] = useState<boolean>(true);

  const legalItems: { id: LegalPageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'privacy', label: 'سياسة الخصوصية', icon: ShieldCheck },
    { id: 'terms', label: 'شروط الاستخدام', icon: Scale },
    { id: 'about', label: 'عن المنصة', icon: Info },
    { id: 'contact', label: 'اتصل بنا', icon: Mail },
  ];

  // Map icon names to Lucide icons
  const getToolIcon = (iconName: string, className: string = 'h-4 w-4') => {
    switch (iconName) {
      case 'Layers':
        return <Layers className={className} />;
      case 'Split':
        return <Split className={className} />;
      case 'RotateCw':
        return <RotateCw className={className} />;
      case 'LayoutGrid':
        return <LayoutGrid className={className} />;
      case 'Image':
        return <Image className={className} />;
      case 'Images':
        return <Images className={className} />;
      case 'Edit3':
        return <Edit3 className={className} />;
      case 'Stamp':
        return <Stamp className={className} />;
      case 'Lock':
        return <Lock className={className} />;
      case 'Minimize2':
        return <Minimize2 className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Contact':
        return <Contact className={className} />;
      case 'FileCheck':
        return <FileCheck className={className} />;
      case 'FileImage':
        return <FileImage className={className} />;
      case 'QrCode':
        return <QrCode className={className} />;
      case 'EyeOff':
        return <EyeOff className={className} />;
      case 'PenTool':
        return <PenTool className={className} />;
      case 'ScanText':
        return <ScanText className={className} />;
      case 'User':
        return <User className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Receipt':
        return <Receipt className={className} />;
      case 'FileCheck2':
        return <FileCheck2 className={className} />;
      case 'Percent':
        return <Percent className={className} />;
      case 'Type':
        return <Type className={className} />;
      case 'Grid':
        return <Grid className={className} />;
      case 'Contrast':
        return <Contrast className={className} />;
      case 'Crop':
        return <Crop className={className} />;
      case 'FileSignature':
        return <FileSignature className={className} />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className={className} />;
      case 'GitCompare':
        return <GitCompare className={className} />;
      case 'FileDigit':
        return <FileDigit className={className} />;
      case 'Eraser':
        return <Eraser className={className} />;
      default:
        return <Edit3 className={className} />;
    }
  };

  const renderToolItem = (tool: ToolDefinition, isMobile: boolean = false) => {
    const isCvParent = tool.id === 'cv-builder';
    const isCvActive =
      activeTool === 'cv-builder' ||
      activeTool === 'cv-modern' ||
      activeTool === 'cv-table' ||
      activeTool === 'cv-classic';

    const isActive = isCvParent ? isCvActive : activeTool === tool.id;
    const toolConfig = TOOLS_CONFIG[tool.id];
    const toolTitle = (t.tools as any)[tool.titleKey]?.title || tool.titleKey;
    const toolBadge = (t.tools as any)[tool.titleKey]?.badge || toolConfig?.badgeText;

    return (
      <div key={tool.id} className="w-full">
        <button
          id={`sidebar-tool-${tool.id}`}
          onClick={() => {
            if (isCvParent) {
              if (isCollapsedDesktop && !isMobile) {
                onToggleCollapseDesktop();
                onSelectTool('cv-builder');
              } else {
                setIsCvExpanded(!isCvExpanded);
                onSelectTool('cv-builder');
              }
            } else {
              onSelectTool(tool.id);
              if (isMobile) onCloseMobile();
            }
          }}
          title={isCollapsedDesktop && !isMobile ? toolTitle : undefined}
          className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-150 ${
            isActive
              ? 'bg-rose-50 text-rose-700 shadow-xs dark:bg-rose-950/60 dark:text-rose-300'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
          } ${isCollapsedDesktop && !isMobile ? 'justify-center px-2' : ''}`}
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-xs transition-transform group-hover:scale-110 ${
              toolConfig?.colors.bg || 'bg-rose-500'
            } text-white`}
          >
            {getToolIcon(tool.iconName, 'h-4 w-4')}
          </span>

          {(!isCollapsedDesktop || isMobile) && (
            <div className="flex flex-1 items-center justify-between min-w-0 text-start">
              <span className="truncate">{toolTitle}</span>
              <div className="flex items-center gap-1">
                {toolBadge && (
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300'
                    }`}
                  >
                    {toolBadge}
                  </span>
                )}
                {isCvParent && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isCvExpanded ? 'rotate-180' : ''
                    } ${isActive ? 'text-white' : 'text-slate-400'}`}
                  />
                )}
              </div>
            </div>
          )}
        </button>

        {/* Sub-menu for CV Builder (العصري - التفاعلي - الكلاسيكي) */}
        {isCvParent && isCvExpanded && (!isCollapsedDesktop || isMobile) && (
          <div className="ms-4 my-1.5 space-y-1 border-s-2 border-teal-500/40 ps-2.5 transition-all">
            {CV_SUB_ITEMS.map((sub) => {
              const isSubActive = activeTool === sub.id;
              const SubIcon = sub.icon;
              const subTitle =
                (t.tools as any)[sub.titleKey]?.title || sub.fallbackBadge;
              const subBadge =
                (t.tools as any)[sub.titleKey]?.badge || sub.fallbackBadge;

              return (
                <button
                  key={sub.id}
                  id={`sidebar-subtool-${sub.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTool(sub.id);
                    if (isMobile) onCloseMobile();
                  }}
                  title={subTitle}
                  className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                    isSubActive
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all ${
                        isSubActive
                          ? 'bg-white scale-125'
                          : 'bg-teal-500/60 group-hover:bg-teal-500'
                      }`}
                    />
                    <SubIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{subBadge}</span>
                  </div>
                  {isSubActive && (
                    <span className="ms-1 shrink-0 rounded-full bg-white/25 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      نشط
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 1. MOBILE SLIDE-OVER DRAWER (Mobile & Tablet < lg) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with smooth blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 start-0 z-50 flex w-full max-w-xs flex-col bg-white p-4 shadow-2xl transition-transform duration-200 dark:bg-slate-900">
            {/* Drawer Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <PdfDoerLogo size="sm" showText={true} />

              <button
                type="button"
                id="btn-close-mobile-sidebar"
                onClick={onCloseMobile}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                title="إغلاق القائمة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Home Link */}
            <button
              type="button"
              id="mobile-sidebar-home"
              onClick={() => {
                onSelectTool(null);
                onCloseMobile();
              }}
              className={`mb-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                activeTool === null
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <Home className="h-4 w-4" />
              </span>
              <span>{(t as any).homeOverview || 'الرئيسية (جميع الأدوات)'}</span>
            </button>

            {/* Tools List */}
            <div className="flex-1 space-y-1 overflow-y-auto pe-1">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                أدوات PDF المتاحة
              </span>
              <div className="mt-1 space-y-1">
                {tools.map((tool) => renderToolItem(tool, true))}
              </div>

              {/* Mobile Legal & AdSense Pages */}
              {onSelectLegalPage && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    السياسات والشروط
                  </span>
                  <div className="mt-1 space-y-1">
                    {legalItems.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeLegalPage === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectLegalPage(item.id);
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 font-bold'
                              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Local Security Notice */}
            <div className="mt-4 rounded-xl border border-teal-200/70 bg-teal-50/60 p-3 text-[11px] font-medium text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300">
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>{t.privacyBadgeShort}</span>
              </div>
              <p className="text-[10px] opacity-80 leading-normal">
                جميع الأدوات تعمل مباشرة في متصفحك دون رفع الملفات.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DESKTOP STICKY SIDEBAR (Hidden in favor of top iLovePDF-style menus) */}
      <aside className="hidden">
        <div className="sticky top-20 flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-2.5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
          {/* Top Title & Collapse Toggle */}
          <div
            className={`mb-2 flex items-center justify-between border-b border-slate-200/80 pb-2 dark:border-slate-800 ${
              isCollapsedDesktop ? 'justify-center' : 'px-1'
            }`}
          >
            {!isCollapsedDesktop && (
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {(t as any).sidebarTitle || 'الأدوات والميزات'}
              </span>
            )}

            <button
              type="button"
              id="btn-toggle-collapse-sidebar"
              onClick={onToggleCollapseDesktop}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title={isCollapsedDesktop ? 'توسيع القائمة' : 'تصغير القائمة'}
            >
              {isCollapsedDesktop ? (
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              ) : (
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              )}
            </button>
          </div>

          {/* Home Link */}
          <button
            type="button"
            id="desktop-sidebar-home"
            onClick={() => onSelectTool(null)}
            title={isCollapsedDesktop ? 'الرئيسية' : undefined}
            className={`mb-2 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold transition ${
              activeTool === null
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            } ${isCollapsedDesktop ? 'justify-center px-1.5' : ''}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              <Home className="h-4 w-4" />
            </span>
            {!isCollapsedDesktop && (
              <span className="truncate">{(t as any).homeOverview || 'الرئيسية'}</span>
            )}
          </button>

          {/* Tools List */}
          <div className="max-h-[calc(100vh-270px)] space-y-1 overflow-y-auto pe-0.5">
            {tools.map((tool) => renderToolItem(tool, false))}
          </div>

          {/* Desktop Legal & AdSense Pages */}
          {onSelectLegalPage && (
            <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              {!isCollapsedDesktop && (
                <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  السياسات والشروط
                </span>
              )}
              <div className="space-y-0.5">
                {legalItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeLegalPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectLegalPage(item.id)}
                      title={isCollapsedDesktop ? item.label : undefined}
                      className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 font-bold'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      } ${isCollapsedDesktop ? 'justify-center px-1' : ''}`}
                    >
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                      {!isCollapsedDesktop && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
