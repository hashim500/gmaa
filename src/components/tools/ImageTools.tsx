import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  FileArchive,
  RefreshCw,
  Sparkles,
  FileImage,
  ShieldCheck,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload, formatFileSize } from '../../utils/pdfUtils';

interface ImageToolsProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const ImageTools: React.FC<ImageToolsProps> = ({ t, onBack, onError }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(80);

  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [processedDataUrl, setProcessedDataUrl] = useState<string>('');

  const loadedImgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setOriginalSize(file.size);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);

      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const img = new Image();
          img.onload = () => {
            loadedImgRef.current = img;
            renderImage();
          };
          img.src = evt.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderImage = () => {
    const img = loadedImgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isPerpendicular = rotation % 180 !== 0;
    canvas.width = isPerpendicular ? img.height : img.width;
    canvas.height = isPerpendicular ? img.width : img.height;

    // Solid white background for JPEGs
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    const q = targetFormat === 'image/png' ? undefined : quality / 100;
    const dataUrl = canvas.toDataURL(targetFormat, q);
    setProcessedDataUrl(dataUrl);

    // Approximate size in bytes from base64
    const head = `data:${targetFormat};base64,`;
    const bytesCount = Math.round(((dataUrl.length - head.length) * 3) / 4);
    setCompressedSize(bytesCount);
  };

  useEffect(() => {
    if (loadedImgRef.current) {
      renderImage();
    }
  }, [rotation, flipH, flipV, targetFormat, quality]);

  const handleRotate = (deg: number) => {
    setRotation((prev) => (prev + deg + 360) % 360);
  };

  const handleDownload = () => {
    if (!processedDataUrl) return;
    const ext = targetFormat.split('/')[1];
    const baseName = imageFile?.name.replace(/\.[^/.]+$/, '') || 'processed_image';
    fetch(processedDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        triggerFileDownload(blob, `${baseName}_edited.${ext === 'jpeg' ? 'jpg' : ext}`);
      })
      .catch((err) => onError(err?.message || 'فشل تحميل الصورة المعدلة'));
  };

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToTools}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>معالجة محلية سريعة 100% بدون خادم</span>
        </span>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <FileImage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                معالجة وتدوير وتحويل صيغ الصور
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تدوير بزوايا قائمة، انعكاس، تحويل فوري بين (PNG, JPG, WebP) مع تقليل وضغط الحجم
              </p>
            </div>
          </div>

          {!imageFile ? (
            <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center transition hover:border-teal-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-teal-500">
              <Upload className="mb-2 h-8 w-8 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                اختر صورة المستند أو المعاملة من جهازك
              </span>
              <span className="mt-1 text-[11px] text-slate-400">
                يدعم JPG, PNG, WebP
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview Canvas */}
              <div className="flex min-h-[220px] max-h-[360px] items-center justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                {processedDataUrl && (
                  <img
                    src={processedDataUrl}
                    alt="Processed Preview"
                    className="max-h-[320px] max-w-full rounded-lg object-contain shadow-sm"
                  />
                )}
              </div>

              {/* Transformations: Rotate & Flip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleRotate(-90)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>تدوير لليسار 90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRotate(90)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>تدوير لليمين 90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition ${
                    flipH
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  <span>قلب أفقي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition ${
                    flipV
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <FlipVertical className="h-3.5 w-3.5" />
                  <span>قلب رأسي</span>
                </button>
              </div>

              {/* Format & Compression Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    الصيغة المطلوبة:
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="image/jpeg">JPG / JPEG (للمستندات والصور العادية)</option>
                    <option value="image/png">PNG (جودة فائقة وخلفيات شفافة)</option>
                    <option value="image/webp">WebP (أحدث صيغة بأصغر حجم)</option>
                  </select>
                </div>

                {targetFormat !== 'image/png' && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        مستوى جودة الضغط:
                      </label>
                      <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                        {quality}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                  </div>
                )}
              </div>

              {/* Size Comparison Card */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400">
                    الحجم الأصلي
                  </span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                    {formatFileSize(originalSize)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                    الحجم بعد التعديل والضغط
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-black text-teal-700 dark:text-teal-400">
                      {formatFileSize(compressedSize)}
                    </span>
                    {savingsPercent > 0 && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        -{savingsPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Download Action */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99]"
              >
                <Download className="h-4 w-4" />
                <span>تحميل الصورة المعدلة والمضغوطة</span>
              </button>

              <div className="text-center pt-1">
                <label className="cursor-pointer text-xs font-bold text-slate-400 hover:text-teal-600 transition">
                  اختيار صورة أخرى
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
