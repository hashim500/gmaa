import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Download,
  Copy,
  Sparkles,
  CheckCircle2,
  Sliders,
  Maximize2,
  FileCheck,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload } from '../../utils/pdfUtils';

interface StampRemoverToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const StampRemoverTool: React.FC<StampRemoverToolProps> = ({
  t,
  onBack,
  onError,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState<number>(225);
  const [enhanceInk, setEnhanceInk] = useState<boolean>(true);
  const [autoCrop, setAutoCrop] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const img = new Image();
          img.onload = () => {
            loadedImageRef.current = img;
            processImage();
          };
          img.src = evt.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    const img = loadedImageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;
    let hasInk = false;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);

      // Brightness / lightness calculation
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      if (luminance >= threshold) {
        // Transparent
        data[i + 3] = 0;
      } else {
        // Ink detected
        hasInk = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);

        // Enhance ink contrast if requested
        if (enhanceInk) {
          const factor = (threshold - luminance) / threshold;
          data[i + 3] = Math.min(255, Math.round(data[i + 3] * Math.min(1.5, 0.6 + factor)));
        }
      }
    }

    // If auto-crop is enabled and we found ink
    if (autoCrop && hasInk && maxX > minX && maxY > minY) {
      const pad = 12;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(canvas.width - cropX, maxX - minX + pad * 2);
      const cropH = Math.min(canvas.height - cropY, maxY - minY + pad * 2);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imgData, 0, 0);

      canvas.width = cropW;
      canvas.height = cropH;
      ctx.clearRect(0, 0, cropW, cropH);
      ctx.drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    } else {
      ctx.putImageData(imgData, 0, 0);
    }

    canvas.toBlob((blob) => {
      setProcessedBlob(blob);
    }, 'image/png');
  };

  useEffect(() => {
    if (loadedImageRef.current) {
      processImage();
    }
  }, [threshold, enhanceInk, autoCrop]);

  const handleDownload = () => {
    if (!processedBlob) return;
    const originalName = imageFile?.name.replace(/\.[^/.]+$/, '') || 'signature';
    triggerFileDownload(processedBlob, `${originalName}_transparent.png`);
  };

  const handleCopy = async () => {
    if (!processedBlob) return;
    try {
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({
            'image/png': processedBlob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

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
          <FileCheck className="h-3.5 w-3.5" />
          <span>تفريغ محلي 100% عالي النقاء</span>
        </span>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                تفريغ خلفية التوقيعات والأختام
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحويل خلفية الورقة البيضاء أو الرمادية إلى شفافة تماماً (PNG) لإدراجها فوق عقود ومستندات PDF
              </p>
            </div>
          </div>

          {/* Upload Box */}
          {!imageFile ? (
            <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center transition hover:border-teal-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-teal-500">
              <Upload className="mb-2 h-8 w-8 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                اختر صورة التوقيع أو الختم من جهازك
              </span>
              <span className="mt-1 text-[11px] text-slate-400">
                يدعم صور الكاميرا وسكانر الورق (JPG, PNG, WebP)
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
              {/* Controls */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      حساسية إزالة الورقة البيضاء:
                    </label>
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                    {threshold}
                  </span>
                </div>

                <input
                  type="range"
                  min="130"
                  max="250"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={enhanceInk}
                      onChange={(e) => setEnhanceInk(e.target.checked)}
                      className="h-4 w-4 rounded accent-teal-600"
                    />
                    <span>تعزيز سواد ووضوح الحبر</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoCrop}
                      onChange={(e) => setAutoCrop(e.target.checked)}
                      className="h-4 w-4 rounded accent-teal-600"
                    />
                    <span>قص الحواف الشفافة تلقائياً</span>
                  </label>
                </div>
              </div>

              {/* Checkerboard Canvas Container */}
              <div className="flex min-h-[220px] max-h-[360px] items-center justify-center overflow-auto rounded-xl border border-slate-200 p-6 bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#ffffff_0%_50%)] bg-[length:16px_16px] dark:border-slate-700 dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)]">
                <canvas
                  ref={canvasRef}
                  className="max-h-[300px] max-w-full rounded object-contain shadow-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99]"
                >
                  <Download className="h-4 w-4" />
                  <span>تنزيل التوقيع بصيغة PNG شفافة</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>تم نسخ الصورة للحافظة!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>نسخ إلى الحافظة (لإلصاقها فوراً)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <label className="cursor-pointer text-xs font-bold text-slate-400 hover:text-teal-600 transition">
                  اختيار صورة أخرى للتفريغ
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
