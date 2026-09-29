import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  FileText,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  AlertCircle,
  Eye,
  Loader2,
  Filter,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult, SearchMatchItem } from '../../types';
import { FileUploader } from '../FileUploader';
import { LoadedFileBar } from '../LoadedFileBar';
import {
  getPdfPageCount,
  renderPageToDataUrl,
  searchPdfText,
  triggerFileDownload,
} from '../../utils/pdfUtils';
import { createFlexibleSearchRegex } from '../../utils/textSearchEngine';

interface SearchToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const SearchTool: React.FC<SearchToolProps> = ({
  t,
  onBack,
  onProgress: _onProgress,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  // Search States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [wholeWord, setWholeWord] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchProgress, setSearchProgress] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<SearchMatchItem[] | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [copiedPages, setCopiedPages] = useState<boolean>(false);

  // Previewing a specific matching page
  const [selectedPreviewPage, setSelectedPreviewPage] = useState<number>(1);
  const [pagePreviewUrl, setPagePreviewUrl] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1.2);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);

  // Load page count when file changes
  useEffect(() => {
    if (file) {
      getPdfPageCount(file)
        .then((count) => {
          setPageCount(count);
          setSelectedPreviewPage(1);
          setSearchResults(null);
          setHasSearched(false);
        })
        .catch(() => {
          onError(t.errorProcessing);
        });
    } else {
      setPageCount(0);
      setSearchResults(null);
      setHasSearched(false);
      setPagePreviewUrl(null);
    }
  }, [file]);

  // Render selected page preview
  useEffect(() => {
    if (!file || !selectedPreviewPage) return;
    let isMounted = true;
    setIsLoadingPreview(true);

    renderPageToDataUrl(file, selectedPreviewPage, previewZoom, 0)
      .then((res) => {
        if (isMounted) {
          setPagePreviewUrl(res.dataUrl);
          setIsLoadingPreview(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoadingPreview(false);
      });

    return () => {
      isMounted = false;
    };
  }, [file, selectedPreviewPage, previewZoom]);

  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!file || !searchTerm.trim()) return;

    try {
      setIsSearching(true);
      setSearchProgress(5);
      const matches = await searchPdfText(
        file,
        searchTerm,
        caseSensitive,
        (percent) => {
          setSearchProgress(percent);
        },
        { wholeWord }
      );

      setSearchResults(matches);
      setHasSearched(true);
      if (matches.length > 0) {
        setSelectedPreviewPage(matches[0].pageNumber);
      }
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper to copy matching page numbers
  const handleCopyPages = () => {
    if (!searchResults || searchResults.length === 0) return;
    const pagesList = searchResults.map((m) => m.pageNumber).join(', ');
    navigator.clipboard.writeText(pagesList);
    setCopiedPages(true);
    setTimeout(() => setCopiedPages(false), 2500);
  };

  // Download search report text file
  const handleDownloadReport = () => {
    if (!searchResults || !file) return;
    const totalMatches = searchResults.reduce((acc, m) => acc + m.matchCount, 0);
    const content = [
      `======================================================`,
      `تقرير نتائج البحث في ملف PDF: ${file.name}`,
      `الكلمة / العبارة المبحوث عنها: "${searchTerm}"`,
      `حساس لحالة الأحرف: ${caseSensitive ? 'نعم' : 'لا'}`,
      `تطابق الكلمة بالكامل: ${wholeWord ? 'نعم' : 'لا'}`,
      `إجمالي المطابقات: ${totalMatches} مطابقة عبر ${searchResults.length} صفحة`,
      `الصفحات المطابقة: ${searchResults.map((m) => m.pageNumber).join(', ')}`,
      `======================================================\n`,
      ...searchResults.map((m) => {
        return `[الصفحة ${m.pageNumber}] - (${m.matchCount} مطابقة)\n` +
          m.snippets.map((snip, i) => `  ${i + 1}. ${snip}`).join('\n') +
          '\n------------------------------------------------------';
      }),
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    triggerFileDownload(
      blob,
      `${file.name.replace(/\.[^/.]+$/, '')}_search_${searchTerm.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.txt`
    );
  };

  // Highlight search term in text snippet safely with bilingual flexible regex
  const renderHighlightedSnippet = (snippet: string, term: string) => {
    if (!term.trim()) return snippet;
    try {
      const regex = createFlexibleSearchRegex(term, caseSensitive);
      const parts = snippet.split(regex);
      const testRegex = new RegExp(`^(?:${regex.source})$`, caseSensitive ? '' : 'i');

      return parts.map((part, index) => {
        if (part && testRegex.test(part)) {
          return (
            <mark
              key={index}
              className="rounded bg-teal-200/90 px-1 py-0.5 font-bold text-teal-950 dark:bg-teal-500/30 dark:text-teal-200"
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      });
    } catch {
      return snippet;
    }
  };

  const totalMatchesCount = searchResults
    ? searchResults.reduce((acc, m) => acc + m.matchCount, 0)
    : 0;

  const currentMatchIndex = searchResults
    ? searchResults.findIndex((m) => m.pageNumber === selectedPreviewPage)
    : -1;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Top Header Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {(t.tools as any).searchText?.title || 'البحث في مستند PDF'}
          </h2>
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            {(t.tools as any).searchText?.badge || 'بحث فوري'}
          </span>
        </div>
      </div>

      {/* Upload State */}
      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={(t.tools as any).searchText?.title || 'البحث داخل ملف PDF'}
          hint={
            (t.tools as any).searchText?.desc ||
            'ابحث عن أي كلمة أو نص داخل صفحات المستند مع تحديد أرقام الصفحات بدقة'
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Loaded File Bar with Replace & Delete buttons */}
          <LoadedFileBar
            file={file}
            pageCount={pageCount}
            onReplaceFile={(newFile) => setFile(newFile)}
            onDeleteFile={() => setFile(null)}
            t={t}
          />

          {/* Search Input Box Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <form onSubmit={handleExecuteSearch} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      (t.tools as any).searchText?.searchPlaceholder ||
                      'اكتب الكلمة أو الجملة المراد البحث عنها في المستند...'
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 ps-9 pe-9 text-xs sm:text-sm font-medium text-slate-900 transition focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-teal-400"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 end-0 flex items-center pe-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!searchTerm.trim() || isSearching}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-xs sm:text-sm font-bold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-50 active:scale-95"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        {(t.tools as any).searchText?.searching || 'جاري البحث...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>
                        {(t.tools as any).searchText?.searchBtn || 'بحث في الملف'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Options & Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700"
                    />
                    <span>
                      {(t.tools as any).searchText?.caseSensitive ||
                        'حساس لحالة الأحرف بالإنجليزية (Aa/aa)'}
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={wholeWord}
                      onChange={(e) => setWholeWord(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700"
                    />
                    <span>
                      مطابقة الكلمة بالكامل (Whole word)
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-lg border border-teal-200/50 dark:border-teal-900/50">
                  <Filter className="h-3 w-3" />
                  <span>
                    بحث ذكي ثنائي اللغة: يتعرف على الكلمات العربية (مع وبدون تشكيل، توحيد الهمزات والتاء) والإنجليزية (تفكيك الروابط والرموز)
                  </span>
                </div>
              </div>

              {/* Searching Progress Indicator */}
              {isSearching && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-teal-700 dark:text-teal-300">
                    <span>
                      {(t.tools as any).searchText?.searching ||
                        'جاري استخراج وفحص النصوص...'}
                    </span>
                    <span>{searchProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-teal-600 transition-all duration-200"
                      style={{ width: `${searchProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Search Results Area */}
          {hasSearched && (
            <div className="space-y-4">
              {/* Summary Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-200/70 bg-teal-50/50 p-4 dark:border-teal-900/60 dark:bg-teal-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white dark:bg-teal-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    {totalMatchesCount > 0 ? (
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        <span>تم العثور على </span>
                        <span className="text-teal-700 dark:text-teal-300">
                          {totalMatchesCount} مطابقة
                        </span>
                        <span> في </span>
                        <span className="text-teal-700 dark:text-teal-300">
                          {searchResults?.length} صفحة
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {(t.tools as any).searchText?.noMatches ||
                          'لم يتم العثور على أي نتائج مطابقة.'}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      كلمة البحث: "{searchTerm}"
                    </p>
                  </div>
                </div>

                {searchResults && searchResults.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyPages}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      {copiedPages ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-300">
                            {(t.tools as any).searchText?.copied || 'تم النسخ!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                          <span>
                            {(t.tools as any).searchText?.copyPages ||
                              'نسخ أرقام الصفحات'}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700"
                      title="تحميل تقرير البحث بصيغة نصية"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">تقرير نصي</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Matching Pages Quick Jump Pills */}
              {searchResults && searchResults.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-semibold text-slate-500 me-1">
                    {(t.tools as any).searchText?.matchingPages ||
                      'الانتقال للصفحة:'}
                  </span>
                  {searchResults.map((match) => (
                    <button
                      key={match.pageNumber}
                      onClick={() => setSelectedPreviewPage(match.pageNumber)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        selectedPreviewPage === match.pageNumber
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-teal-950/60'
                      }`}
                    >
                      <span>صفحة {match.pageNumber}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                          selectedPreviewPage === match.pageNumber
                            ? 'bg-teal-700 text-teal-100'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {match.matchCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Main Two-Column View: Results List & Live Page Preview */}
              {searchResults && searchResults.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Column: Match Details Cards (5 cols) */}
                  <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pe-1">
                    {searchResults.map((match) => (
                      <div
                        key={match.pageNumber}
                        onClick={() => setSelectedPreviewPage(match.pageNumber)}
                        className={`cursor-pointer rounded-2xl border p-3.5 transition-all duration-150 ${
                          selectedPreviewPage === match.pageNumber
                            ? 'border-teal-500 bg-teal-50/60 shadow-md ring-1 ring-teal-500 dark:border-teal-400 dark:bg-teal-950/40'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-[11px] font-bold text-white">
                              {match.pageNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              الصفحة {match.pageNumber}
                            </span>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {match.matchCount} مطابقة
                          </span>
                        </div>

                        {/* Snippets with highlights */}
                        <div className="space-y-1.5">
                          {match.snippets.map((snip, sIdx) => (
                            <div
                              key={sIdx}
                              className="rounded-lg bg-slate-50 p-2 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                            >
                              {renderHighlightedSnippet(snip, searchTerm)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: High-Resolution Page Preview (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {/* Preview Top Bar */}
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          معاينة الصفحة {selectedPreviewPage} من {pageCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Prev / Next Match */}
                        <button
                          type="button"
                          onClick={() => {
                            if (currentMatchIndex > 0) {
                              setSelectedPreviewPage(
                                searchResults[currentMatchIndex - 1].pageNumber
                              );
                            }
                          }}
                          disabled={currentMatchIndex <= 0}
                          className="flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          title="المطابقة السابقة"
                        >
                          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                          <span>السابق</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (
                              currentMatchIndex >= 0 &&
                              currentMatchIndex < searchResults.length - 1
                            ) {
                              setSelectedPreviewPage(
                                searchResults[currentMatchIndex + 1].pageNumber
                              );
                            }
                          }}
                          disabled={
                            currentMatchIndex < 0 ||
                            currentMatchIndex >= searchResults.length - 1
                          }
                          className="flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          title="المطابقة التالية"
                        >
                          <span>التالي</span>
                          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                        </button>

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-1 border-s border-slate-300 ps-1.5 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewZoom((z) => Math.min(2.0, z + 0.2))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800"
                            title="تكبير"
                          >
                            <ZoomIn className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewZoom((z) => Math.max(0.6, z - 0.2))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800"
                            title="تصغير"
                          >
                            <ZoomOut className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview Viewport */}
                    <div className="flex min-h-[460px] flex-1 items-center justify-center overflow-auto rounded-xl bg-slate-200/70 p-4 dark:bg-slate-950">
                      {isLoadingPreview ? (
                        <div className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                          <span>جاري تحميل معاينة الصفحة...</span>
                        </div>
                      ) : pagePreviewUrl ? (
                        <div className="relative overflow-hidden rounded-lg shadow-xl ring-1 ring-slate-900/10">
                          <img
                            src={pagePreviewUrl}
                            alt={`معاينة الصفحة ${selectedPreviewPage}`}
                            className="block max-w-full select-none"
                            draggable={false}
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">
                          لا تتوفر معاينة
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* No matches state */}
              {searchResults && searchResults.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    لا توجد أي نتائج مطابقة لكلمة "{searchTerm}"
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    تأكد من صحة الكلمة أو حاول استخدام كلمات بحث أقصر أو إلغاء تفعيل خيار
                    حساسية حالة الأحرف.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
