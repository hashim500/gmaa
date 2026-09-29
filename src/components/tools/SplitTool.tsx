import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Split, Archive, FileText, CheckCircle2 } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult, SplitRange } from '../../types';
import { FileUploader } from '../FileUploader';
import { getPdfPageCount, splitPdf } from '../../utils/pdfUtils';

interface SplitToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const SplitTool: React.FC<SplitToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [splitMode, setSplitMode] = useState<'custom' | 'fixed' | 'pages'>('custom');
  const [ranges, setRanges] = useState<SplitRange[]>([
    { id: '1', from: 1, to: 1 },
  ]);
  // Default to false so splitting produces separate files in ZIP rather than merging back into 1 PDF
  const [mergeAllRanges, setMergeAllRanges] = useState<boolean>(false);
  const [fixedInterval, setFixedInterval] = useState<number>(1);
  const [specificPagesInput, setSpecificPagesInput] = useState<string>('1');

  useEffect(() => {
    if (file) {
      getPdfPageCount(file).then((cnt) => {
        setTotalPages(cnt);
        setRanges([{ id: '1', from: 1, to: cnt > 1 ? 2 : 1 }]);
      });
    }
  }, [file]);

  const handleModeChange = (mode: 'custom' | 'fixed' | 'pages') => {
    setSplitMode(mode);
    if (mode === 'fixed') {
      // In fixed mode, user explicitly expects separate files packed into a ZIP
      setMergeAllRanges(false);
    }
  };

  const addRange = () => {
    const lastRange = ranges[ranges.length - 1];
    const newFrom = lastRange ? Math.min(lastRange.to + 1, totalPages) : 1;
    const newTo = Math.min(newFrom + 1, totalPages);
    setRanges([
      ...ranges,
      { id: Math.random().toString(36).substring(2, 9), from: newFrom, to: newTo },
    ]);
  };

  const removeRange = (id: string) => {
    if (ranges.length <= 1) return;
    setRanges(ranges.filter((r) => r.id !== id));
  };

  const updateRange = (id: string, field: 'from' | 'to', value: number) => {
    const val = Math.max(1, Math.min(value, totalPages));
    setRanges(
      ranges.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          [field]: val,
        };
      })
    );
  };

  const handleExecuteSplit = async () => {
    if (!file) return;

    try {
      let finalRanges: { from: number; to: number }[] = [];

      if (splitMode === 'custom') {
        finalRanges = ranges.map((r) => ({
          from: Math.min(r.from, r.to),
          to: Math.max(r.from, r.to),
        }));
      } else if (splitMode === 'fixed') {
        const interval = Math.max(1, fixedInterval);
        for (let i = 1; i <= totalPages; i += interval) {
          finalRanges.push({ from: i, to: Math.min(i + interval - 1, totalPages) });
        }
      } else if (splitMode === 'pages') {
        // Parse input like "1, 3, 5-8"
        const parts = specificPagesInput.split(',');
        for (const p of parts) {
          const trimmed = p.trim();
          if (trimmed.includes('-')) {
            const [startStr, endStr] = trimmed.split('-');
            const s = parseInt(startStr, 10);
            const e = parseInt(endStr, 10);
            if (!isNaN(s) && !isNaN(e)) {
              finalRanges.push({
                from: Math.max(1, Math.min(s, totalPages)),
                to: Math.max(1, Math.min(e, totalPages)),
              });
            }
          } else {
            const num = parseInt(trimmed, 10);
            if (!isNaN(num)) {
              const clamped = Math.max(1, Math.min(num, totalPages));
              finalRanges.push({ from: clamped, to: clamped });
            }
          }
        }
      }

      if (finalRanges.length === 0) {
        finalRanges = [{ from: 1, to: totalPages }];
      }

      const res = await splitPdf(file, finalRanges, mergeAllRanges, (percent, msg) => {
        onProgress(percent, msg);
      });

      onComplete({
        blob: res.blob,
        filename: res.filename,
        originalSize: file.size,
        newSize: res.blob.size,
        type: res.isZip ? 'zip' : 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
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
          {t.tools.split.title}
        </h2>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.split.title}
          hint={t.tools.split.desc}
        />
      ) : (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          {/* File summary pill */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
              {file.name}
            </span>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {totalPages} {t.pagesCount}
            </span>
          </div>

          {/* Mode Selector Tabs */}
          <div className="text-center">
            <span className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
              وضع النطاق:
            </span>
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => handleModeChange('custom')}
                className={`rounded-lg py-2 text-xs font-bold transition ${
                  splitMode === 'custom'
                    ? 'border border-red-500 bg-white text-red-600 shadow-sm dark:bg-slate-700 dark:text-red-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t.tools.split.modeRange}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('fixed')}
                className={`rounded-lg py-2 text-xs font-bold transition ${
                  splitMode === 'fixed'
                    ? 'border border-red-500 bg-white text-red-600 shadow-sm dark:bg-slate-700 dark:text-red-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t.tools.split.modeFixed}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('pages')}
                className={`rounded-lg py-2 text-xs font-bold transition ${
                  splitMode === 'pages'
                    ? 'border border-red-500 bg-white text-red-600 shadow-sm dark:bg-slate-700 dark:text-red-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t.tools.split.modePages}
              </button>
            </div>
          </div>

          {/* Mode 1: Custom Ranges */}
          {splitMode === 'custom' && (
            <div className="space-y-3">
              {ranges.map((r, index) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{t.tools.split.rangeTitle} {index + 1}</span>
                    {ranges.length > 1 && (
                      <button
                        onClick={() => removeRange(r.id)}
                        className="text-rose-500 hover:text-rose-600"
                        title={t.tools.split.removeRange}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-500">
                        {t.tools.split.fromPage}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={r.from}
                        onChange={(e) => updateRange(r.id, 'from', parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-slate-500">
                        {t.tools.split.toPage}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={r.to}
                        onChange={(e) => updateRange(r.id, 'to', parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addRange}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-red-400 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <Plus className="h-4 w-4" />
                <span>{t.tools.split.addRange}</span>
              </button>
            </div>
          )}

          {/* Mode 2: Fixed Interval */}
          {splitMode === 'fixed' && (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.tools.split.everyPages}
              </label>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'صفحة لكل ملف (فصل الكل)', count: 1 },
                  { label: 'صفحتين (2)', count: 2 },
                  { label: '5 صفحات', count: 5 },
                  { label: '10 صفحات', count: 10 },
                ].map((preset) => (
                  <button
                    key={preset.count}
                    type="button"
                    onClick={() => {
                      setFixedInterval(preset.count);
                      setMergeAllRanges(false);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      fixedInterval === preset.count
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={fixedInterval}
                  onChange={(e) => setFixedInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  صفحة لكل ملف (سينتج {Math.ceil(totalPages / Math.max(1, fixedInterval))} ملفات)
                </span>
              </div>

              {/* Live Info Notice */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3 text-xs text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>نتيجة التقسيم الثابت:</span>
                </div>
                <p className="mt-1 leading-relaxed text-[11.5px]">
                  {!mergeAllRanges ? (
                    <>
                      سيتم فصل المستند إلى <strong className="font-bold underline">{Math.ceil(totalPages / Math.max(1, fixedInterval))} ملفات PDF مستقلة</strong> (كل ملف يحتوي {fixedInterval} {fixedInterval === 1 ? 'صفحة' : 'صفحات'})، وتحميل جميع الملفات داخل <strong className="font-bold underline">ملف مضغوط واحد (ZIP)</strong>.
                    </>
                  ) : (
                    <>
                      سيتم استخراج الأجزاء ودمجها معاً في ملف PDF واحد جديد.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Mode 3: Specific Pages */}
          {splitMode === 'pages' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.tools.split.extractPagesDesc}
              </label>
              <input
                type="text"
                placeholder="مثال: 1, 3, 5-8"
                value={specificPagesInput}
                onChange={(e) => setSpecificPagesInput(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
          )}

          {/* Output Format Selector */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.tools.split.outputMethod || 'طريقة استخراج وحفظ الملفات:'}
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Option 1: Separate files in ZIP */}
              <button
                type="button"
                onClick={() => setMergeAllRanges(false)}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-start transition ${
                  !mergeAllRanges
                    ? 'border-red-500 bg-red-50/60 ring-1 ring-red-500 dark:border-red-600 dark:bg-red-950/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800'
                }`}
              >
                <Archive className={`h-5 w-5 mt-0.5 shrink-0 ${!mergeAllRanges ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                    <span>{t.tools.split.separateZip || 'ملفات منفصلة في أرشيف مضغوط (ZIP)'}</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      موصى به
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.tools.split.separateZipDesc || 'فصل المستند إلى ملفات PDF مستقلة كلٌ على حدة وتنزيلها معاً في ملف مضغوط (ZIP).'}
                  </p>
                </div>
              </button>

              {/* Option 2: Merge ranges into one PDF */}
              <button
                type="button"
                onClick={() => setMergeAllRanges(true)}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-start transition ${
                  mergeAllRanges
                    ? 'border-red-500 bg-red-50/60 ring-1 ring-red-500 dark:border-red-600 dark:bg-red-950/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className={`h-5 w-5 mt-0.5 shrink-0 ${mergeAllRanges ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`} />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {t.tools.split.mergePdfOption || 'دمج النطاقات في ملف PDF واحد'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.tools.split.mergePdfOptionDesc || 'استخراج النطاقات والصفحات المحددة ودمجها في مستند PDF واحد جديد.'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Big Action Button */}
          <button
            id="btn-execute-split"
            onClick={handleExecuteSplit}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-base font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 active:scale-[0.99]"
          >
            {!mergeAllRanges ? (
              <>
                <Archive className="h-5 w-5" />
                <span>
                  {splitMode === 'fixed'
                    ? `تقسيم وتنزيل كملف مضغوط (${Math.ceil(totalPages / Math.max(1, fixedInterval))} ملفات ZIP)`
                    : (t.tools.split.splitActionZip || 'تقسيم وتنزيل كملف مضغوط (ZIP)')}
                </span>
              </>
            ) : (
              <>
                <Split className="h-5 w-5" />
                <span>{t.tools.split.splitAction} (دمج في ملف واحد)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
