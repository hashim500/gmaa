import React, { useRef, useState } from 'react';
import { UploadCloud, FilePlus, FileText, Sparkles } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

interface FileUploaderProps {
  multiple?: boolean;
  accept?: string;
  onFilesSelected?: (files: File[]) => void;
  onFileSelect?: (file: File) => void;
  file?: File | null;
  t: TranslationDict;
  label?: string;
  hint?: string;
  helperText?: string;
  isImages?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  multiple = false,
  accept = 'application/pdf',
  onFilesSelected,
  onFileSelect,
  t,
  label,
  hint,
  helperText,
  isImages = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatchSelected = (files: File[]) => {
    if (files.length === 0) return;
    if (onFilesSelected) {
      onFilesSelected(multiple ? files : [files[0]]);
    }
    if (onFileSelect) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles: File[] = Array.from(e.dataTransfer.files);
      const filtered = isImages
        ? droppedFiles.filter((f) => f.type.startsWith('image/'))
        : droppedFiles.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));

      if (filtered.length > 0) {
        dispatchSelected(filtered);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected: File[] = Array.from(e.target.files);
      dispatchSelected(selected);
      // reset value so re-uploading same file triggers change
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        id="hidden-file-input"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-teal-500 bg-teal-50/70 scale-[1.01] dark:border-teal-400 dark:bg-teal-950/40'
            : 'border-slate-300/90 bg-white/70 hover:border-teal-500/80 hover:bg-slate-50/80 dark:border-slate-700/80 dark:bg-slate-900/50 dark:hover:border-teal-400'
        }`}
      >
        {/* Decorative icon pill */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 text-teal-600 transition-transform duration-200 group-hover:scale-110 dark:text-teal-400">
          {multiple ? (
            <FilePlus className="h-10 w-10" />
          ) : (
            <UploadCloud className="h-10 w-10" />
          )}
        </div>

        {/* Action Button Label */}
        <h3 className="text-lg font-bold text-slate-800 sm:text-xl dark:text-slate-100">
          {label || (multiple ? t.selectFiles : t.selectFile)}
        </h3>

        <p className="mt-2 max-w-sm text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {hint || helperText || (multiple ? t.dragDropFiles : t.dragDropFile)}
        </p>

        {/* Mobile touch trigger button */}
        <button
          type="button"
          className="mt-6 flex h-12 items-center gap-2 rounded-xl bg-teal-600 px-6 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all group-hover:bg-teal-700 active:scale-95"
        >
          <FileText className="h-4 w-4" />
          <span>{multiple ? t.selectFiles : t.selectFile}</span>
        </button>

        {/* Privacy Note under button */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <Sparkles className="h-3 w-3 text-teal-500" />
          <span>{isImages ? t.supportsImages : t.supportsPdf}</span>
          <span>•</span>
          <span>{t.privacyBadgeShort}</span>
        </div>
      </div>
    </div>
  );
};
