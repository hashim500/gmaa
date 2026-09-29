/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SupportedLanguage,
  ToolId,
  ToolDefinition,
  ProcessingState,
  ProcessedResult,
  LegalPageId,
} from './types';
import { translations } from './i18n/translations';
import { Header } from './components/Header';
import { PrivacyBanner } from './components/PrivacyBanner';
import { ToolCard } from './components/ToolCard';
import { ProcessingModal } from './components/ProcessingModal';
import { DownloadModal } from './components/DownloadModal';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AdSenseBanner } from './components/AdSenseBanner';
import { HomeEducationalGuide } from './components/HomeEducationalGuide';

// Legal & Policy Pages (Google AdSense Compliance)
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { CookiePolicyPage } from './components/pages/CookiePolicyPage';
import { DisclaimerPage } from './components/pages/DisclaimerPage';
import {
  Grid,
  Briefcase,
  Layers,
  RefreshCw,
  Edit3,
  Search,
  Lock,
  User,
  Contact,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { TOOLS_CONFIG } from './utils/toolsConfig';

// Tools
import { SearchTool } from './components/tools/SearchTool';
import { CVBuilderTool } from './components/tools/CVBuilderTool';
import { MergeTool } from './components/tools/MergeTool';
import { SplitTool } from './components/tools/SplitTool';
import { RotateTool } from './components/tools/RotateTool';
import { OrganizeTool } from './components/tools/OrganizeTool';
import { ImageConvertTool } from './components/tools/ImageConvertTool';
import { WatermarkTool } from './components/tools/WatermarkTool';
import { ProtectTool } from './components/tools/ProtectTool';
import { EditTool } from './components/tools/EditTool';
import { CompressTool } from './components/tools/CompressTool';
import { BadgeGeneratorTool } from './components/tools/BadgeGeneratorTool';
import { StampRemoverTool } from './components/tools/StampRemoverTool';
import { ImageTools } from './components/tools/ImageTools';
import { TextTools } from './components/tools/TextTools';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { RedactTool } from './components/tools/RedactTool';
import { SignTool } from './components/tools/SignTool';
import { OcrTool } from './components/tools/OcrTool';
import { IdPhotoTool } from './components/tools/IdPhotoTool';
import { HijriConverterTool } from './components/tools/HijriConverterTool';
import { MetadataCleanerTool } from './components/tools/MetadataCleanerTool';
import { ClearanceTool } from './components/tools/ClearanceTool';
import { PayrollTool } from './components/tools/PayrollTool';
import { InvoiceTool } from './components/tools/InvoiceTool';
import { VoucherTool } from './components/tools/VoucherTool';
import { VatCalculatorTool } from './components/tools/VatCalculatorTool';
import { TafqeetTool } from './components/tools/TafqeetTool';
import { NUpTool } from './components/tools/NUpTool';
import { PdfGrayscaleTool } from './components/tools/PdfGrayscaleTool';
import { ImageWatermarkTool } from './components/tools/ImageWatermarkTool';
import { SocialCropTool } from './components/tools/SocialCropTool';
import { StitchImagesTool } from './components/tools/StitchImagesTool';
import { DateCalculatorTool } from './components/tools/DateCalculatorTool';
import { TextCryptoTool } from './components/tools/TextCryptoTool';
import { WordCounterTool } from './components/tools/WordCounterTool';
import { TextCompareTool } from './components/tools/TextCompareTool';
import { PageNumberingTool } from './components/tools/PageNumberingTool';
import { TextCleanerTool } from './components/tools/TextCleanerTool';

const ALL_TOOLS: ToolDefinition[] = [
  {
    id: 'merge',
    titleKey: 'merge',
    descriptionKey: 'merge',
    iconName: 'Layers',
    category: 'organize',
  },
  {
    id: 'split',
    titleKey: 'split',
    descriptionKey: 'split',
    iconName: 'Split',
    category: 'organize',
  },
  {
    id: 'redact',
    titleKey: 'redact',
    descriptionKey: 'redact',
    iconName: 'EyeOff',
    category: 'security',
  },
  {
    id: 'compress',
    titleKey: 'compress',
    descriptionKey: 'compress',
    iconName: 'Minimize2',
    category: 'edit',
  },
  {
    id: 'image-to-pdf',
    titleKey: 'imageToPdf',
    descriptionKey: 'imageToPdf',
    iconName: 'Image',
    category: 'convert',
  },
  {
    id: 'pdf-to-image',
    titleKey: 'pdfToImage',
    descriptionKey: 'pdfToImage',
    iconName: 'Images',
    category: 'convert',
  },
  {
    id: 'image-tools',
    titleKey: 'imageTools',
    descriptionKey: 'imageTools',
    iconName: 'FileImage',
    category: 'convert',
  },
  {
    id: 'search-text',
    titleKey: 'searchText',
    descriptionKey: 'searchText',
    iconName: 'Search',
    category: 'search',
  },
  {
    id: 'edit',
    titleKey: 'edit',
    descriptionKey: 'edit',
    iconName: 'Edit3',
    category: 'edit',
  },
  {
    id: 'organize',
    titleKey: 'organize',
    descriptionKey: 'organize',
    iconName: 'LayoutGrid',
    category: 'organize',
  },
  {
    id: 'rotate',
    titleKey: 'rotate',
    descriptionKey: 'rotate',
    iconName: 'RotateCw',
    category: 'organize',
  },
  {
    id: 'stamp-remover',
    titleKey: 'stampRemover',
    descriptionKey: 'stampRemover',
    iconName: 'FileCheck',
    category: 'edit',
  },
  {
    id: 'watermark',
    titleKey: 'watermark',
    descriptionKey: 'watermark',
    iconName: 'Stamp',
    category: 'edit',
  },
  {
    id: 'protect',
    titleKey: 'protect',
    descriptionKey: 'protect',
    iconName: 'Lock',
    category: 'security',
  },
  {
    id: 'cv-builder',
    titleKey: 'cvBuilder',
    descriptionKey: 'cvBuilder',
    iconName: 'Briefcase',
    category: 'cv',
  },
  {
    id: 'badge-generator',
    titleKey: 'badgeGenerator',
    descriptionKey: 'badgeGenerator',
    iconName: 'Contact',
    category: 'badge',
  },
  {
    id: 'text-tools',
    titleKey: 'textTools',
    descriptionKey: 'textTools',
    iconName: 'FileText',
    category: 'text',
  },
  {
    id: 'qr-generator',
    titleKey: 'qrGenerator',
    descriptionKey: 'qrGenerator',
    iconName: 'QrCode',
    category: 'text',
  },
  {
    id: 'sign',
    titleKey: 'sign',
    descriptionKey: 'sign',
    iconName: 'PenTool',
    category: 'edit',
  },
  {
    id: 'ocr',
    titleKey: 'ocr',
    descriptionKey: 'ocr',
    iconName: 'ScanText',
    category: 'convert',
  },
  {
    id: 'id-photo',
    titleKey: 'idPhoto',
    descriptionKey: 'idPhoto',
    iconName: 'User',
    category: 'convert',
  },
  {
    id: 'hijri',
    titleKey: 'hijri',
    descriptionKey: 'hijri',
    iconName: 'Calendar',
    category: 'text',
  },
  {
    id: 'metadata-cleaner',
    titleKey: 'metadataCleaner',
    descriptionKey: 'metadataCleaner',
    iconName: 'ShieldCheck',
    category: 'security',
  },
  {
    id: 'clearance',
    titleKey: 'clearance',
    descriptionKey: 'clearance',
    iconName: 'FileSignature',
    category: 'business',
  },
  {
    id: 'payroll',
    titleKey: 'payroll',
    descriptionKey: 'payroll',
    iconName: 'FileSpreadsheet',
    category: 'business',
  },
  {
    id: 'invoice',
    titleKey: 'invoice',
    descriptionKey: 'invoice',
    iconName: 'Receipt',
    category: 'business',
  },
  {
    id: 'voucher',
    titleKey: 'voucher',
    descriptionKey: 'voucher',
    iconName: 'FileCheck2',
    category: 'business',
  },
  {
    id: 'vat-calculator',
    titleKey: 'vatCalculator',
    descriptionKey: 'vatCalculator',
    iconName: 'Percent',
    category: 'business',
  },
  {
    id: 'tafqeet',
    titleKey: 'tafqeet',
    descriptionKey: 'tafqeet',
    iconName: 'Type',
    category: 'business',
  },
  {
    id: 'nup',
    titleKey: 'nup',
    descriptionKey: 'nup',
    iconName: 'Grid',
    category: 'organize',
  },
  {
    id: 'pdf-grayscale',
    titleKey: 'pdfGrayscale',
    descriptionKey: 'pdfGrayscale',
    iconName: 'Contrast',
    category: 'edit',
  },
  {
    id: 'image-watermark',
    titleKey: 'imageWatermark',
    descriptionKey: 'imageWatermark',
    iconName: 'Stamp',
    category: 'edit',
  },
  {
    id: 'social-crop',
    titleKey: 'socialCrop',
    descriptionKey: 'socialCrop',
    iconName: 'Crop',
    category: 'convert',
  },
  {
    id: 'stitch-images',
    titleKey: 'stitchImages',
    descriptionKey: 'stitchImages',
    iconName: 'Layers',
    category: 'convert',
  },
  {
    id: 'date-calculator',
    titleKey: 'dateCalculator',
    descriptionKey: 'dateCalculator',
    iconName: 'Calendar',
    category: 'text',
  },
  {
    id: 'text-crypto',
    titleKey: 'textCrypto',
    descriptionKey: 'textCrypto',
    iconName: 'Lock',
    category: 'security',
  },
  {
    id: 'word-counter',
    titleKey: 'wordCounter',
    descriptionKey: 'wordCounter',
    iconName: 'FileText',
    category: 'text',
  },
  {
    id: 'text-compare',
    titleKey: 'textCompare',
    descriptionKey: 'textCompare',
    iconName: 'GitCompare',
    category: 'text',
  },
  {
    id: 'page-numbering',
    titleKey: 'pageNumbering',
    descriptionKey: 'pageNumbering',
    iconName: 'FileDigit',
    category: 'edit',
  },
  {
    id: 'text-cleaner',
    titleKey: 'textCleaner',
    descriptionKey: 'textCleaner',
    iconName: 'Eraser',
    category: 'text',
  },
];

export default function App() {
  // 1. Language state (defaults to Arabic)
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('pdf_tools_lang');
    return (saved as SupportedLanguage) || 'ar';
  });

  // 2. Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pdf_tools_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Accessibility: Text Scale & Grayscale Mode
  const [textScale, setTextScale] = useState<number>(() => {
    const saved = localStorage.getItem('pdf_tools_text_scale');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [isGrayscale, setIsGrayscale] = useState<boolean>(() => {
    const saved = localStorage.getItem('pdf_tools_grayscale');
    return saved === 'true';
  });

  const handleIncreaseTextScale = () => {
    setTextScale((prev) => {
      const next = Math.min(prev + 10, 140);
      localStorage.setItem('pdf_tools_text_scale', next.toString());
      document.documentElement.style.fontSize = `${next}%`;
      return next;
    });
  };

  const handleDecreaseTextScale = () => {
    setTextScale((prev) => {
      const next = Math.max(prev - 10, 80);
      localStorage.setItem('pdf_tools_text_scale', next.toString());
      document.documentElement.style.fontSize = `${next}%`;
      return next;
    });
  };

  const handleResetTextScale = () => {
    setTextScale(100);
    localStorage.setItem('pdf_tools_text_scale', '100');
    document.documentElement.style.fontSize = '100%';
  };

  const handleToggleGrayscale = () => {
    setIsGrayscale((prev) => {
      const next = !prev;
      localStorage.setItem('pdf_tools_grayscale', next ? 'true' : 'false');
      document.documentElement.classList.toggle('site-grayscale', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale}%`;
  }, [textScale]);

  useEffect(() => {
    document.documentElement.classList.toggle('site-grayscale', isGrayscale);
  }, [isGrayscale]);

  // 3. Navigation & Tools state
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [activeLegalPage, setActiveLegalPage] = useState<LegalPageId | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);
  const [isCollapsedDesktopSidebar, setIsCollapsedDesktopSidebar] = useState<boolean>(false);

  // 4. Processing & Download states
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    statusMessage: '',
  });

  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Listen to URL Hash changes for AdSense crawlers and direct page linking
  useEffect(() => {
    const handleHashRouting = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages: LegalPageId[] = ['privacy', 'terms', 'about', 'contact', 'cookies', 'disclaimer'];
      if (validPages.includes(hash as LegalPageId)) {
        setActiveLegalPage(hash as LegalPageId);
        setActiveTool(null);
        setProcessedResult(null);
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, []);

  // Sync Language and Direction with DOM
  useEffect(() => {
    localStorage.setItem('pdf_tools_lang', lang);
    const isRtl = lang === 'ar' || lang === 'ur';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync Theme with DOM
  useEffect(() => {
    localStorage.setItem('pdf_tools_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const t = translations[lang] || translations.ar;

  // Handler helpers
  const handleStartProcessing = (progress: number, statusMessage: string) => {
    setProcessingState({
      isProcessing: true,
      progress,
      statusMessage,
    });
  };

  const handleCompleteProcessing = (result: ProcessedResult) => {
    setProcessingState({
      isProcessing: false,
      progress: 100,
      statusMessage: '',
    });
    setProcessedResult(result);
  };

  const handleError = (error: string) => {
    setProcessingState({
      isProcessing: false,
      progress: 0,
      statusMessage: '',
    });
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const resetCurrentTool = () => {
    setProcessedResult(null);
    setErrorMessage(null);
  };

  const navigateToLegalPage = (page: LegalPageId) => {
    setActiveTool(null);
    setProcessedResult(null);
    setErrorMessage(null);
    setActiveLegalPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectTool = (toolId: ToolId | null) => {
    setActiveLegalPage(null);
    setProcessedResult(null);
    setErrorMessage(null);
    setActiveTool(toolId);
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setActiveTool(null);
    setActiveLegalPage(null);
    setProcessedResult(null);
    setErrorMessage(null);
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tools by selected category
  const filteredTools = ALL_TOOLS.filter((tool) => {
    if (activeCategory === 'all') return true;
    return tool.category === activeCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Header */}
      <Header
        currentLang={lang}
        onLanguageChange={setLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        t={t}
        onGoHome={goHome}
        activeTool={activeTool}
        onSelectTool={selectTool}
        onToggleMobileSidebar={() => setIsOpenMobileSidebar(true)}
        onNavigateLegalPage={navigateToLegalPage}
        textScale={textScale}
        onIncreaseTextScale={handleIncreaseTextScale}
        onDecreaseTextScale={handleDecreaseTextScale}
        onResetTextScale={handleResetTextScale}
        isGrayscale={isGrayscale}
        onToggleGrayscale={handleToggleGrayscale}
      />

      {/* Error Alert Toast */}
      {errorMessage && (
        <div className="fixed top-20 z-50 mx-auto w-full max-w-md px-4 end-0 start-0">
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 shadow-lg dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 px-3 py-6 sm:px-6 lg:px-8">
        <div
          className={`mx-auto ${
            activeTool ? 'max-w-[1600px]' : 'max-w-7xl'
          } flex items-start justify-center gap-4 xl:gap-6`}
        >
          {/* Mobile Sidebar (Accessible when mobile hamburger is tapped) */}
          <Sidebar
            tools={ALL_TOOLS}
            activeTool={activeTool}
            activeLegalPage={activeLegalPage}
            onSelectTool={selectTool}
            onSelectLegalPage={navigateToLegalPage}
            isOpenMobile={isOpenMobileSidebar}
            onCloseMobile={() => setIsOpenMobileSidebar(false)}
            isCollapsedDesktop={true}
            onToggleCollapseDesktop={() =>
              setIsCollapsedDesktopSidebar(!isCollapsedDesktopSidebar)
            }
            t={t}
          />

          {/* Left Flank AdSense Skyscraper (الجانب الأيسر - يظهر فقط داخل الأدوات وليس في الصفحة الرئيسية) */}
          {activeTool && (
            <aside
              aria-label="مساحة إعلانية جانبية"
              className="no-print hidden xl:flex flex-col sticky top-24 shrink-0 w-[140px] 2xl:w-[160px] z-10"
            >
              <AdSenseBanner
                slotId="left-flank-skyscraper"
                format="vertical-flank"
                label="إعلان • AD"
              />
            </aside>
          )}

          {/* Primary View Area */}
          <div
            className={`min-w-0 flex-1 ${
              activeTool ? 'max-w-6xl' : 'max-w-7xl'
            } w-full`}
          >
            {/* 1. Legal / AdSense Policies View */}
            {activeLegalPage ? (
              <div className="animate-in fade-in duration-200">
                {activeLegalPage === 'privacy' && (
                  <PrivacyPolicyPage
                    onBackToHome={goHome}
                    onNavigatePage={navigateToLegalPage}
                  />
                )}
                {activeLegalPage === 'terms' && (
                  <TermsOfServicePage
                    onBackToHome={goHome}
                    onNavigatePage={navigateToLegalPage}
                  />
                )}
                {activeLegalPage === 'about' && (
                  <AboutUsPage
                    onBackToHome={goHome}
                    onNavigatePage={navigateToLegalPage}
                  />
                )}
                {activeLegalPage === 'contact' && (
                  <ContactUsPage
                    onBackToHome={goHome}
                    onNavigatePage={navigateToLegalPage}
                  />
                )}
                {activeLegalPage === 'cookies' && (
                  <CookiePolicyPage
                    onBackToHome={goHome}
                    onNavigatePage={navigateToLegalPage}
                  />
                )}
                {activeLegalPage === 'disclaimer' && (
                  <DisclaimerPage
                    onBackToHome={goHome}
                    onNavigatePage={navigateToLegalPage}
                  />
                )}
              </div>
            ) : processedResult ? (
              /* 2. Result / Download Screen */
              <DownloadModal
                result={processedResult}
                onReset={resetCurrentTool}
                onBackToHome={goHome}
                t={t}
              />
            ) : activeTool ? (
              /* 3. Active Tool Workspace */
              <div className="animate-in fade-in-50 duration-200">
                {(activeTool === 'cv-builder' ||
                  activeTool === 'cv-modern' ||
                  activeTool === 'cv-table' ||
                  activeTool === 'cv-classic') && (
                  <CVBuilderTool
                    t={t}
                    onBack={goHome}
                    initialTemplate={
                      activeTool === 'cv-table'
                        ? 'table'
                        : activeTool === 'cv-classic'
                        ? 'classic'
                        : activeTool === 'cv-modern'
                        ? 'modern'
                        : undefined
                    }
                    onTemplateChange={(tpl) => {
                      if (tpl === 'table') setActiveTool('cv-table');
                      else if (tpl === 'classic') setActiveTool('cv-classic');
                      else setActiveTool('cv-modern');
                    }}
                  />
                )}
                {activeTool === 'search-text' && (
                  <SearchTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'merge' && (
                  <MergeTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'split' && (
                  <SplitTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'rotate' && (
                  <RotateTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'organize' && (
                  <OrganizeTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {(activeTool === 'image-to-pdf' || activeTool === 'pdf-to-image') && (
                  <ImageConvertTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                    initialMode={activeTool}
                  />
                )}
                {activeTool === 'watermark' && (
                  <WatermarkTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'protect' && (
                  <ProtectTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'edit' && (
                  <EditTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'redact' && (
                  <RedactTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'compress' && (
                  <CompressTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'badge-generator' && (
                  <BadgeGeneratorTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'stamp-remover' && (
                  <StampRemoverTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'image-tools' && (
                  <ImageTools
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'text-tools' && (
                  <TextTools
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'qr-generator' && (
                  <QrGeneratorTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'sign' && (
                  <SignTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'ocr' && (
                  <OcrTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'id-photo' && (
                  <IdPhotoTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'hijri' && (
                  <HijriConverterTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'metadata-cleaner' && (
                  <MetadataCleanerTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'clearance' && (
                  <ClearanceTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'payroll' && (
                  <PayrollTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'invoice' && (
                  <InvoiceTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'voucher' && (
                  <VoucherTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'vat-calculator' && (
                  <VatCalculatorTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'tafqeet' && (
                  <TafqeetTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'nup' && (
                  <NUpTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'pdf-grayscale' && (
                  <PdfGrayscaleTool
                    t={t}
                    onBack={goHome}
                    onProgress={handleStartProcessing}
                    onComplete={handleCompleteProcessing}
                    onError={handleError}
                  />
                )}
                {activeTool === 'image-watermark' && (
                  <ImageWatermarkTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'social-crop' && (
                  <SocialCropTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'stitch-images' && (
                  <StitchImagesTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'date-calculator' && (
                  <DateCalculatorTool
                    t={t}
                    onBack={goHome}
                    onError={handleError}
                  />
                )}
                {activeTool === 'text-crypto' && (
                  <TextCryptoTool
                    t={t}
                    onBack={goHome}
                  />
                )}
                {activeTool === 'word-counter' && (
                  <WordCounterTool
                    t={t}
                    onBack={goHome}
                  />
                )}
                {activeTool === 'text-compare' && (
                  <TextCompareTool
                    t={t}
                    onBack={goHome}
                  />
                )}
                {activeTool === 'page-numbering' && (
                  <PageNumberingTool
                    t={t}
                    onBack={goHome}
                  />
                )}
                {activeTool === 'text-cleaner' && (
                  <TextCleanerTool
                    t={t}
                    onBack={goHome}
                  />
                )}

                {/* Direct In-Tool Bottom AdSense Placement (Simple, non-distracting) */}
                <div className="mt-8">
                  <AdSenseBanner slotId="tool-view-bottom" format="horizontal" />
                </div>
              </div>
            ) : (
              /* Home: Tool Selection Dashboard */
              <div>
                {/* Hero Headline */}
                <div className="mb-8 text-center">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    كل أدوات PDF التي تحتاجها في منصة واحدة
                  </h1>
                  <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    دمج، تقسيم، ضغط، تحويل، وتعديل ملفات PDF مع أدوات الأعمال والمالية المعتمدة (الرواتب، المخالصات، الفواتير) مجاناً 100% ومحلياً داخل جهازك.
                  </p>
                </div>

                {/* Category Filter Chips with Colorful Badges */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                  {[
                    {
                      id: 'all',
                      label: t.categories.all,
                      icon: Grid,
                      colorClass: 'bg-rose-500 text-white',
                      activeClass: 'bg-rose-600 text-white shadow-md shadow-rose-500/20 border-rose-600',
                    },
                    {
                      id: 'business',
                      label: t.categories.business || 'الأعمال والمالية والرواتب',
                      icon: Briefcase,
                      colorClass: 'bg-emerald-600 text-white',
                      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border-emerald-600',
                    },
                    {
                      id: 'organize',
                      label: t.categories.organize,
                      icon: Layers,
                      colorClass: 'bg-red-500 text-white',
                      activeClass: 'bg-red-500 text-white shadow-md shadow-red-500/20 border-red-500',
                    },
                    {
                      id: 'convert',
                      label: t.categories.convert,
                      icon: RefreshCw,
                      colorClass: 'bg-amber-500 text-white',
                      activeClass: 'bg-amber-500 text-white shadow-md shadow-amber-500/20 border-amber-500',
                    },
                    {
                      id: 'edit',
                      label: t.categories.edit,
                      icon: Edit3,
                      colorClass: 'bg-blue-600 text-white',
                      activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-600',
                    },
                    {
                      id: 'security',
                      label: t.categories.security,
                      icon: Lock,
                      colorClass: 'bg-purple-600 text-white',
                      activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-500/20 border-purple-600',
                    },
                    {
                      id: 'cv',
                      label: t.categories.cv,
                      icon: User,
                      colorClass: 'bg-indigo-600 text-white',
                      activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 border-indigo-600',
                    },
                    {
                      id: 'badge',
                      label: t.categories.badge || 'بطاقات الهوية',
                      icon: Contact,
                      colorClass: 'bg-pink-600 text-white',
                      activeClass: 'bg-pink-600 text-white shadow-md shadow-pink-500/20 border-pink-600',
                    },
                    {
                      id: 'text',
                      label: t.categories.text || 'النصوص والمعاملات',
                      icon: Calendar,
                      colorClass: 'bg-teal-600 text-white',
                      activeClass: 'bg-teal-600 text-white shadow-md shadow-teal-500/20 border-teal-600',
                    },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        id={`filter-${cat.id}`}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                          isSelected
                            ? cat.activeClass
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/90 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-md ${
                            isSelected ? 'bg-white/20 text-white' : cat.colorClass
                          } transition-transform group-hover:scale-110`}
                        >
                          <Icon className="h-3 w-3" />
                        </span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tools Grid: Square Compact Cards with 4-5 per row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onSelect={(id) => selectTool(id)}
                      t={t}
                    />
                  ))}
                </div>

                {/* Centered Bounded Moving Ticker Banner (تحت مجموعة أدوات PDF) */}
                <div className="mt-8 flex justify-center">
                  <PrivacyBanner t={t} />
                </div>

                {/* AdSense In-feed Responsive Ad Placement (Compliant) */}
                <div className="mt-8">
                  <AdSenseBanner slot="1234567890" format="auto" />
                </div>

                {/* Rich Educational Guide & AdSense Value-Added Content */}
                <HomeEducationalGuide onNavigatePage={navigateToLegalPage} />

                {/* Bottom Feature Callout */}
                <div className="mt-14 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50/60 to-cyan-50/40 p-6 text-center dark:border-teal-950/60 dark:from-teal-950/20 dark:to-cyan-950/10">
                  <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">
                    {t.privacyBadge}
                  </h3>
                  <p className="mx-auto mt-1 max-w-2xl text-xs text-slate-600 dark:text-slate-400">
                    {t.privacyDetail}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Flank AdSense Skyscraper (الجانب الأيمن - يظهر فقط داخل الأدوات وليس في الصفحة الرئيسية) */}
          {activeTool && (
            <aside
              aria-label="مساحة إعلانية جانبية"
              className="no-print hidden xl:flex flex-col sticky top-24 shrink-0 w-[140px] 2xl:w-[160px] z-10"
            >
              <AdSenseBanner
                slotId="right-flank-skyscraper"
                format="vertical-flank"
                label="إعلان • AD"
              />
            </aside>
          )}
        </div>
      </main>

      {/* Comprehensive AdSense Compliant Footer */}
      <Footer
        onNavigatePage={navigateToLegalPage}
        onSelectTool={selectTool}
        t={t}
      />

      {/* Cookie & Privacy Consent Banner (GDPR / Google AdSense Compliant) */}
      <CookieConsentBanner
        onOpenCookiePolicy={() => navigateToLegalPage('cookies')}
      />

      {/* Local Processing Modal */}
      <ProcessingModal state={processingState} />
    </div>
  );
}
