import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Trash2, Copy, Undo2, Check, LayoutGrid } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';
import { getPdfPageCount, renderPageToDataUrl, organizePdf } from '../../utils/pdfUtils';

interface OrganizeToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

interface PageCardItem {
  id: string;
  originalIndex: number;
  previewUrl?: string;
  rotation: number;
  deleted?: boolean;
}

export const OrganizeTool: React.FC<OrganizeToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageCardItem[]>([]);

  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    const initPages = async () => {
      try {
        const count = await getPdfPageCount(file);
        const list: PageCardItem[] = [];
        for (let i = 0; i < count; i++) {
          list.push({
            id: `p-${i}-${Math.random()}`,
            originalIndex: i,
            rotation: 0,
            deleted: false,
          });
        }
        if (!isMounted) return;
        setPages(list);

        // Render thumbnails progressively
        for (let i = 0; i < Math.min(count, 35); i++) {
          if (!isMounted) return;
          try {
            const { dataUrl } = await renderPageToDataUrl(file, i + 1, 0.4);
            setPages((prev) =>
              prev.map((p) => (p.originalIndex === i ? { ...p, previewUrl: dataUrl } : p))
            );
          } catch (e) {
            console.warn(e);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    initPages();
    return () => {
      isMounted = false;
    };
  }, [file]);

  const movePage = (index: number, direction: 'left' | 'right') => {
    const newPages = [...pages];
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= newPages.length) return;
    const temp = newPages[index];
    newPages[index] = newPages[target];
    newPages[target] = temp;
    setPages(newPages);
  };

  const toggleDelete = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, deleted: !p.deleted } : p))
    );
  };

  const duplicatePage = (index: number) => {
    const item = pages[index];
    const newItem: PageCardItem = {
      ...item,
      id: `copy-${Date.now()}-${Math.random()}`,
    };
    const newPages = [...pages];
    newPages.splice(index + 1, 0, newItem);
    setPages(newPages);
  };

  const handleSaveOrganized = async () => {
    if (!file) return;

    try {
      const activePages = pages.filter((p) => !p.deleted);
      if (activePages.length === 0) {
        onError('يجب الإبقاء على صفحة واحدة على الأقل');
        return;
      }

      const configs = activePages.map((p) => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation,
      }));

      const bytes = await organizePdf(file, configs, (percent, msg) => {
        onProgress(percent, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_organized.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  const activeCount = pages.filter((p) => !p.deleted).length;

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t.tools.organize.title}
        </h2>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.organize.title}
          hint={t.tools.organize.desc}
        />
      ) : (
        <div className="space-y-5">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {file.name}
              </p>
              <p className="text-[11px] text-slate-400">
                الصفحات النشطة: {activeCount} من {pages.length}
              </p>
            </div>

            <button
              id="btn-save-organized"
              onClick={handleSaveOrganized}
              disabled={activeCount === 0}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-40"
            >
              <Check className="h-4 w-4" />
              <span>{t.tools.organize.organizeAction}</span>
            </button>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-2xl border p-3 transition-all ${
                  p.deleted
                    ? 'border-rose-200 bg-rose-50/50 opacity-60 dark:border-rose-950 dark:bg-rose-950/20'
                    : 'border-slate-200 bg-white shadow-sm hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {/* Header order pill */}
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    (أصل: {p.originalIndex + 1})
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  {p.previewUrl ? (
                    <img
                      src={p.previewUrl}
                      alt={`Page ${idx + 1}`}
                      className={`max-h-full max-w-full object-contain ${
                        p.deleted ? 'grayscale blur-[1px]' : ''
                      }`}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">صفحة {idx + 1}</span>
                  )}

                  {p.deleted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-rose-900/30 text-xs font-bold text-white backdrop-blur-[1px]">
                      محذوفة
                    </div>
                  )}
                </div>

                {/* Controls Bar */}
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-slate-500 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => movePage(idx, 'left')}
                      disabled={idx === 0}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100 disabled:opacity-25 dark:hover:bg-slate-800"
                      title={t.moveUp}
                    >
                      <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePage(idx, 'right')}
                      disabled={idx === pages.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100 disabled:opacity-25 dark:hover:bg-slate-800"
                      title={t.moveDown}
                    >
                      <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => duplicatePage(idx)}
                      className="flex h-6 w-6 items-center justify-center rounded text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40"
                      title={t.duplicatePage}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDelete(p.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded transition ${
                        p.deleted
                          ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400'
                          : 'text-rose-500 hover:bg-rose-50 dark:text-rose-400'
                      }`}
                      title={p.deleted ? t.restorePage : t.deletePage}
                    >
                      {p.deleted ? <Undo2 className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
