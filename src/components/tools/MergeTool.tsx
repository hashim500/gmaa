import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Layers, ArrowLeft } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { UploadedFileItem, ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';
import { mergePdfs, formatBytes, getPdfPageCount } from '../../utils/pdfUtils';

interface MergeToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const MergeTool: React.FC<MergeToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  const handleFilesAdded = async (newFiles: File[]) => {
    const items: UploadedFileItem[] = [];
    for (const f of newFiles) {
      const pageCount = await getPdfPageCount(f).catch(() => 1);
      items.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
        pageCount,
      });
    }
    setFiles((prev) => [...prev, ...items]);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const removeItem = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    try {
      const rawFiles = files.map((f) => f.file);
      const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);

      const bytes = await mergePdfs(rawFiles, (percent, msg) => {
        onProgress(percent, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: 'merged_document.pdf',
        originalSize: totalOriginalSize,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t.tools.merge.title}
        </h2>
      </div>

      {files.length === 0 ? (
        <FileUploader
          multiple
          onFilesSelected={handleFilesAdded}
          t={t}
          label={t.tools.merge.title}
          hint={t.tools.merge.desc}
        />
      ) : (
        <div className="space-y-4">
          {/* File list */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                الملفات المحددة ({files.length})
              </span>
              <span className="text-[11px] text-slate-400">
                إجمالي الصفحات: {files.reduce((acc, f) => acc + (f.pageCount || 0), 0)}
              </span>
            </div>

            <div className="space-y-2">
              {files.map((fileItem, idx) => (
                <div
                  key={fileItem.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-slate-200 dark:border-slate-800/80 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-100 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {fileItem.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatBytes(fileItem.size)} • {fileItem.pageCount || 1} صفحة
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
                      title={t.moveUp}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === files.length - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
                      title={t.moveDown}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(fileItem.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title={t.removeFile}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add more button */}
            <div className="mt-4">
              <label
                htmlFor="merge-add-more"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 py-3 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-300"
              >
                <Plus className="h-4 w-4" />
                <span>{t.tools.merge.addMore}</span>
                <input
                  id="merge-add-more"
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) handleFilesAdded(Array.from(e.target.files));
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Merge Action Button */}
          <button
            id="btn-execute-merge"
            onClick={handleMerge}
            disabled={files.length < 2}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition-all hover:bg-teal-700 disabled:opacity-40"
          >
            <Layers className="h-5 w-5" />
            <span>{t.tools.merge.mergeAction}</span>
          </button>
        </div>
      )}
    </div>
  );
};
