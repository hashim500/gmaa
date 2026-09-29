import React, { useState } from 'react';
import { CheckCircle2, Download, RefreshCw, FileText, ArrowRight, Archive } from 'lucide-react';
import { ProcessedResult } from '../types';
import { TranslationDict } from '../i18n/translations';
import { formatBytes, triggerFileDownload } from '../utils/pdfUtils';
import { AdSenseBanner } from './AdSenseBanner';

interface DownloadModalProps {
  result: ProcessedResult;
  onReset: () => void;
  onBackToHome: () => void;
  t: TranslationDict;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  result,
  onReset,
  onBackToHome,
  t,
}) => {
  const [customName, setCustomName] = useState(result.filename);

  const handleDownload = () => {
    let finalName = customName.trim();
    if (!finalName) finalName = result.filename;
    // ensure proper extension
    const ext = result.type === 'zip' ? '.zip' : result.type === 'image' ? '.jpg' : '.pdf';
    if (!finalName.toLowerCase().endsWith(ext)) {
      finalName += ext;
    }
    triggerFileDownload(result.blob, finalName);
  };

  const newSize = result.newSize || result.blob.size;
  const originalSize = result.originalSize;
  const savingsPercent =
    originalSize && originalSize > newSize
      ? Math.round(((originalSize - newSize) / originalSize) * 100)
      : null;

  return (
    <div className="mx-auto w-full max-w-xl animate-in fade-in-50 zoom-in-95 duration-200">
      <div className="overflow-hidden rounded-2xl border border-teal-200/80 bg-white p-6 shadow-xl sm:p-8 dark:border-teal-900/60 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-8 ring-teal-50/50 dark:bg-teal-950/80 dark:text-teal-400 dark:ring-teal-950/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            {t.downloadReady}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t.privacyBadge}
          </p>

          {/* Stats Bar */}
          <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              {result.type === 'zip' ? (
                <Archive className="h-4 w-4 text-teal-500" />
              ) : (
                <FileText className="h-4 w-4 text-teal-500" />
              )}
              <span>{t.fileSize}:</span>
              <span className="font-semibold">{formatBytes(newSize)}</span>
            </div>

            {result.type === 'zip' && (
              <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 font-bold text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                <Archive className="h-3 w-3" />
                <span>أرشيف مضغوط (ZIP)</span>
              </div>
            )}

            {originalSize && (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span>(الأصلي: {formatBytes(originalSize)})</span>
              </div>
            )}

            {savingsPercent !== null && savingsPercent > 0 && (
              <div className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                {t.sizeReduction}: {savingsPercent}%-
              </div>
            )}
          </div>

          {/* Rename input */}
          <div className="mt-6 w-full text-start">
            <label
              htmlFor="download-filename"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t.newFileName}
            </label>
            <div className="relative">
              <input
                id="download-filename"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-400"
              />
            </div>
          </div>

          {/* Big Download Button */}
          <button
            id="btn-quick-download"
            onClick={handleDownload}
            className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 text-base font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:opacity-95 hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.99]"
          >
            {result.type === 'zip' ? (
              <Archive className="h-5 w-5" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span>
              {result.type === 'zip'
                ? 'تحميل الملفات المضغوطة (ZIP)'
                : t.downloadNow}
            </span>
          </button>

          {/* Secondary Actions */}
          <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
            <button
              id="btn-process-another"
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t.processAnother}</span>
            </button>

            <button
              id="btn-back-to-tools-from-download"
              onClick={onBackToHome}
              className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-medium text-teal-600 transition hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/50"
            >
              <span>{t.backToTools}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </div>
          {/* AdSense Placement on Completion/Download Screen */}
          <div className="mt-6 w-full">
            <AdSenseBanner slotId="download-ready-banner" format="auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
