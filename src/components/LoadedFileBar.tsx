import React, { useRef } from 'react';
import { FileText, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../utils/pdfUtils';
import { TranslationDict } from '../i18n/translations';

interface LoadedFileBarProps {
  file: File;
  pageCount?: number;
  onReplaceFile: (newFile: File) => void;
  onDeleteFile: () => void;
  t: TranslationDict;
  label?: string;
  accept?: string;
}

export const LoadedFileBar: React.FC<LoadedFileBarProps> = ({
  file,
  pageCount,
  onReplaceFile,
  onDeleteFile,
  t,
  label,
  accept = 'application/pdf',
}) => {
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onReplaceFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/70 via-white to-slate-50/80 p-3.5 shadow-sm dark:border-teal-900/50 dark:from-teal-950/30 dark:via-slate-900 dark:to-slate-900/80">
      {/* Hidden File Input for Replace */}
      <input
        ref={replaceInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        id="input-replace-file"
      />

      {/* File Info */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm dark:bg-teal-500">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className="truncate text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
              title={file.name}
            >
              {file.name}
            </h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>{label || (t as any).fileLoaded || 'ملف جاهز'}</span>
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{formatBytes(file.size)}</span>
            {pageCount !== undefined && pageCount > 0 && (
              <>
                <span>•</span>
                <span>
                  {pageCount} {t.pagesCount}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Replace & Delete */}
      <div className="flex items-center gap-2 ms-auto">
        <button
          type="button"
          id="btn-replace-loaded-file"
          onClick={() => replaceInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-teal-500 hover:bg-slate-50 hover:text-teal-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
          title={(t as any).replaceFile || 'استبدال الملف'}
        >
          <RefreshCw className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>{(t as any).replaceFile || 'استبدال الملف'}</span>
        </button>

        <button
          type="button"
          id="btn-delete-loaded-file"
          onClick={onDeleteFile}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 hover:text-rose-800 active:scale-95 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-900/50"
          title={(t as any).deleteFile || 'حذف الملف'}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{(t as any).deleteFile || 'حذف الملف'}</span>
        </button>
      </div>
    </div>
  );
};
