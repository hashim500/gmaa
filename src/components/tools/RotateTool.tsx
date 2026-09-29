import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, RotateCcw, RefreshCw, Check } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult, PDFPageInfo } from '../../types';
import { FileUploader } from '../FileUploader';
import { getPdfPageCount, renderPageToDataUrl, rotatePdf } from '../../utils/pdfUtils';

interface RotateToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const RotateTool: React.FC<RotateToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFPageInfo[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);

  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    setLoadingThumbnails(true);

    const loadPages = async () => {
      try {
        const count = await getPdfPageCount(file);
        const pageList: PDFPageInfo[] = [];

        for (let i = 0; i < count; i++) {
          pageList.push({
            pageIndex: i,
            pageNumber: i + 1,
            rotation: 0,
          });
        }

        if (!isMounted) return;
        setPages(pageList);

        // Load thumbnails progressively
        for (let i = 0; i < Math.min(count, 30); i++) {
          if (!isMounted) return;
          try {
            const { dataUrl } = await renderPageToDataUrl(file, i + 1, 0.4);
            setPages((prev) =>
              prev.map((p) => (p.pageIndex === i ? { ...p, previewUrl: dataUrl } : p))
            );
          } catch (e) {
            console.warn('Thumbnail render error', e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingThumbnails(false);
      }
    };

    loadPages();
    return () => {
      isMounted = false;
    };
  }, [file]);

  const rotateSinglePage = (pageIndex: number, delta: number) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.pageIndex !== pageIndex) return p;
        const newRot = (p.rotation + delta + 360) % 360;
        return { ...p, rotation: newRot };
      })
    );
  };

  const rotateAllPages = (delta: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + delta + 360) % 360,
      }))
    );
  };

  const resetAllRotations = () => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: 0 })));
  };

  const handleSaveRotated = async () => {
    if (!file) return;

    try {
      const rotations: Record<number, number> = {};
      pages.forEach((p) => {
        if (p.rotation !== 0) {
          rotations[p.pageIndex] = p.rotation;
        }
      });

      const bytes = await rotatePdf(file, rotations, (percent, msg) => {
        onProgress(percent, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_rotated.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t.tools.rotate.title}
        </h2>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.rotate.title}
          hint={t.tools.rotate.desc}
        />
      ) : (
        <div className="space-y-5">
          {/* Global Rotation Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => rotateAllPages(-90)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t.tools.rotate.rotateAllLeft}</span>
              </button>

              <button
                type="button"
                onClick={() => rotateAllPages(90)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>{t.tools.rotate.rotateAllRight}</span>
              </button>

              <button
                type="button"
                onClick={() => rotateAllPages(180)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t.tools.rotate.rotateAll180}</span>
              </button>

              <button
                type="button"
                onClick={resetAllRotations}
                className="rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {t.tools.rotate.resetRotation}
              </button>
            </div>

            <button
              onClick={handleSaveRotated}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
            >
              <Check className="h-4 w-4" />
              <span>{t.tools.rotate.rotateAction}</span>
            </button>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pages.map((p) => (
              <div
                key={p.pageIndex}
                className="group relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Thumbnail Box */}
                <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  {p.previewUrl ? (
                    <img
                      src={p.previewUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-300"
                      style={{ transform: `rotate(${p.rotation}deg)` }}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">صفحة {p.pageNumber}</span>
                  )}

                  {/* Individual Rotate Buttons overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => rotateSinglePage(p.pageIndex, -90)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:scale-110 active:scale-95"
                      title="تدوير 90° يساراً"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateSinglePage(p.pageIndex, 90)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:scale-110 active:scale-95"
                      title="تدوير 90° يميناً"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Rotation Indicator Badge */}
                  {p.rotation !== 0 && (
                    <span className="absolute bottom-2 end-2 rounded-md bg-teal-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {p.rotation}°
                    </span>
                  )}
                </div>

                {/* Page Number & Label */}
                <div className="mt-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {t.page} {p.pageNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
