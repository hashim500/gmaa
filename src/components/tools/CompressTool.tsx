import React, { useState } from 'react';
import { ArrowLeft, Check, Minimize2, CheckCircle2 } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';
import { compressPdf } from '../../utils/pdfUtils';

interface CompressToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const CompressTool: React.FC<CompressToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'low' | 'mid' | 'max'>('mid');

  const handleCompress = async () => {
    if (!file) return;

    try {
      const bytes = await compressPdf(file, level, (percent, msg) => {
        onProgress(percent, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_compressed.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  const OPTIONS = [
    {
      id: 'max',
      title: t.tools.compress.maxCompress,
      desc: t.tools.compress.maxCompressDesc,
    },
    {
      id: 'mid',
      title: t.tools.compress.midCompress,
      desc: t.tools.compress.midCompressDesc,
    },
    {
      id: 'low',
      title: t.tools.compress.lowCompress,
      desc: t.tools.compress.lowCompressDesc,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
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
          {t.tools.compress.title}
        </h2>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.compress.title}
          hint={t.tools.compress.desc}
        />
      ) : (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          {/* File info */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
              {file.name}
            </span>
            <span className="text-slate-400">PDF</span>
          </div>

          <div className="text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              مستوى الضغط
            </h3>
          </div>

          {/* 3 Compression Options (Matches user screenshot 3) */}
          <div className="space-y-3">
            {OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setLevel(opt.id as 'low' | 'mid' | 'max')}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  level === opt.id
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm dark:border-teal-400 dark:bg-teal-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {opt.desc}
                  </p>
                </div>

                <div className="shrink-0 ps-3">
                  {level === opt.id ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            id="btn-execute-compress"
            onClick={handleCompress}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 active:scale-[0.99]"
          >
            <Minimize2 className="h-5 w-5" />
            <span>{t.tools.compress.compressAction}</span>
          </button>
        </div>
      )}
    </div>
  );
};
