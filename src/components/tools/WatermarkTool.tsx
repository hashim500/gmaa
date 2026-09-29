import React, { useState } from 'react';
import { ArrowLeft, Stamp, Hash, Check, Sparkles } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';
import { addWatermarkAndPageNumbers, WatermarkOptions } from '../../utils/pdfUtils';

interface WatermarkToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const WatermarkTool: React.FC<WatermarkToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'watermark' | 'page-numbers'>('watermark');

  // Watermark options
  const [enableWatermark, setEnableWatermark] = useState<boolean>(true);
  const [watermarkText, setWatermarkText] = useState<string>('سري للغاية');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.35);
  const [watermarkSize, setWatermarkSize] = useState<number>(52);
  const [watermarkRotation, setWatermarkRotation] = useState<number>(-45);
  const [selectedColor, setSelectedColor] = useState<{ r: number; g: number; b: number; name: string }>({
    r: 0.85,
    g: 0.15,
    b: 0.15,
    name: 'red',
  });

  // Page numbering options
  const [enablePageNumbers, setEnablePageNumbers] = useState<boolean>(false);
  const [pageNumberFormat, setPageNumberFormat] = useState<'1' | 'Page 1' | 'Page 1 of 5' | '1 / 5' | 'صفحة 1' | 'صفحة 1 من 5'>('صفحة 1 من 5');
  const [pageNumberPosition, setPageNumberPosition] = useState<
    'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left'
  >('bottom-center');

  const WATERMARK_PRESETS = [
    'سري للغاية',
    'مسودة',
    'نسخة أصلية',
    'معتمد',
    'CONFIDENTIAL',
    'DRAFT',
  ];

  const COLOR_PALETTE = [
    { name: 'red', r: 0.85, g: 0.15, b: 0.15, bg: 'bg-red-500' },
    { name: 'teal', r: 0.05, g: 0.55, b: 0.55, bg: 'bg-teal-600' },
    { name: 'blue', r: 0.1, g: 0.4, b: 0.8, bg: 'bg-blue-600' },
    { name: 'gray', r: 0.4, g: 0.4, b: 0.4, bg: 'bg-slate-500' },
    { name: 'black', r: 0.05, g: 0.05, b: 0.05, bg: 'bg-slate-900' },
  ];

  const handleApply = async () => {
    if (!file) return;

    if (!enableWatermark && !enablePageNumbers) {
      onError('يرجى تفعيل العلامة المائية أو أرقام الصفحات (أو كليهما) للمتابعة.');
      return;
    }

    if (enableWatermark && !watermarkText.trim()) {
      onError('يرجى إدخال نص العلامة المائية.');
      return;
    }

    try {
      const options: WatermarkOptions = {
        enableWatermark,
        watermarkText: watermarkText.trim(),
        watermarkOpacity,
        watermarkSize,
        watermarkRotation,
        watermarkColor: { r: selectedColor.r, g: selectedColor.g, b: selectedColor.b },
        enablePageNumbers,
        pageNumberFormat,
        pageNumberPosition,
        pageNumberSize: 12,
      };

      const bytes = await addWatermarkAndPageNumbers(file, options, (percent, msg) => {
        onProgress(percent, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_watermarked.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err: any) {
      console.error(err);
      onError(t.errorProcessing || err?.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
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
          {t.tools.watermark.title}
        </h2>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.watermark.title}
          hint={t.tools.watermark.desc}
        />
      ) : (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          {/* File summary */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
              {file.name}
            </span>
            <span className="text-slate-400">PDF جاهز للتوثيق</span>
          </div>

          {/* Service Switches (Both can be active!) */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => {
                setEnableWatermark(!enableWatermark);
                setActiveTab('watermark');
              }}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                enableWatermark
                  ? 'border-teal-500 bg-teal-50/60 dark:border-teal-500/80 dark:bg-teal-950/40'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Stamp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.tools.watermark.tabWatermark}
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableWatermark}
                onChange={() => {}}
                className="h-4 w-4 rounded accent-teal-600"
              />
            </div>

            <div
              onClick={() => {
                setEnablePageNumbers(!enablePageNumbers);
                setActiveTab('page-numbers');
              }}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                enablePageNumbers
                  ? 'border-teal-500 bg-teal-50/60 dark:border-teal-500/80 dark:bg-teal-950/40'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t.tools.watermark.tabPageNumbers}
                </span>
              </div>
              <input
                type="checkbox"
                checked={enablePageNumbers}
                onChange={() => {}}
                className="h-4 w-4 rounded accent-teal-600"
              />
            </div>
          </div>

          {/* Sub-tab selection */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('watermark')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
                activeTab === 'watermark'
                  ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Stamp className="h-3.5 w-3.5" />
              <span>إعدادات العلامة المائية</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('page-numbers')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
                activeTab === 'page-numbers'
                  ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span>إعدادات أرقام الصفحات</span>
            </button>
          </div>

          {/* TAB 1: Watermark Options */}
          {activeTab === 'watermark' && (
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.tools.watermark.watermarkText}
                  </label>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400">
                    يدعم العربية والإنجليزية
                  </span>
                </div>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder={t.tools.watermark.watermarkPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                {/* Quick Presets */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {WATERMARK_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWatermarkText(preset)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Opacity & Size */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                    <span>{t.tools.watermark.opacity}</span>
                    <span>{Math.round(watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                    <span>{t.tools.watermark.fontSize}</span>
                    <span>{watermarkSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="90"
                    value={watermarkSize}
                    onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>

              {/* Rotation Angle & Color Palette */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.tools.watermark.rotation}
                  </label>
                  <div className="flex gap-2">
                    {[-45, 0, 45, 90].map((ang) => (
                      <button
                        key={ang}
                        type="button"
                        onClick={() => setWatermarkRotation(ang)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                          watermarkRotation === ang
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {ang}°
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.tools.watermark.color}
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`h-7 w-7 rounded-full ${c.bg} transition ${
                          selectedColor.name === c.name
                            ? 'ring-2 ring-teal-500 ring-offset-2'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Page Numbers Options */}
          {activeTab === 'page-numbers' && (
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.tools.watermark.pageNumberFormat}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'صفحة 1 من 5', label: 'صفحة 1 من 5' },
                    { id: 'صفحة 1', label: 'صفحة 1' },
                    { id: '1 / 5', label: '1 / 5' },
                    { id: '1', label: '1' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setPageNumberFormat(fmt.id as any)}
                      className={`rounded-lg py-2 text-xs font-semibold transition ${
                        pageNumberFormat === fmt.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.tools.watermark.position}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bottom-center', label: t.tools.watermark.bottomCenter },
                    { id: 'bottom-right', label: t.tools.watermark.bottomRight },
                    { id: 'bottom-left', label: t.tools.watermark.bottomLeft },
                    { id: 'top-center', label: t.tools.watermark.topCenter },
                    { id: 'top-right', label: t.tools.watermark.topRight },
                    { id: 'top-left', label: 'أعلى اليسار' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPageNumberPosition(pos.id as any)}
                      className={`rounded-lg py-2 text-xs font-semibold transition ${
                        pageNumberPosition === pos.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            id="btn-apply-watermark"
            onClick={handleApply}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 active:scale-[0.99]"
          >
            <Check className="h-5 w-5" />
            <span>تطبيق التعديلات وحفظ PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
