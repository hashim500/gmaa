import React, { useState, useRef, useEffect } from 'react';
import {
  Stamp,
  Upload,
  Download,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  Archive,
} from 'lucide-react';
import JSZip from 'jszip';
import { TranslationDict } from '../../i18n/translations';

interface ImageWatermarkToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

interface LoadedImageItem {
  file: File;
  name: string;
  img: HTMLImageElement;
}

export const ImageWatermarkTool: React.FC<ImageWatermarkToolProps> = ({ t, onBack, onError }) => {
  const [items, setItems] = useState<LoadedImageItem[]>([]);
  const [watermarkText, setWatermarkText] = useState('اسم المؤسسة أو الموقع');
  const [placement, setPlacement] = useState<'tile' | 'center' | 'corner'>('tile');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [fontSizePercent, setFontSizePercent] = useState<number>(6); // % of image width
  const [opacity, setOpacity] = useState<number>(45); // 0-100

  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load images
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const loaded: LoadedImageItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`تعذر قراءة الصورة ${file.name}`));
        });
        loaded.push({ file, name: file.name, img });
      }
      setItems(loaded);
    } catch (err: any) {
      onError(err.message || 'حدث خطأ أثناء تحميل الصور.');
    }
  };

  // Draw watermark on a canvas context
  const drawWatermark = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const text = watermarkText.trim();
    if (!text) return;

    const size = Math.max(10, Math.round((W * fontSizePercent) / 100));
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = watermarkColor;
    ctx.font = `bold ${size}px Tajawal, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.direction = /[\u0600-\u06FF]/.test(text) ? 'rtl' : 'ltr';

    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = size * 0.1;

    if (placement === 'corner') {
      ctx.textAlign = 'right';
      ctx.fillText(text, W - size * 0.8, H - size * 0.9);
    } else {
      ctx.translate(W / 2, H / 2);
      ctx.rotate((-30 * Math.PI) / 180);
      ctx.textAlign = 'center';

      if (placement === 'center') {
        ctx.fillText(text, 0, 0);
      } else {
        // Tile repeat pattern
        const textWidth = ctx.measureText(text).width + size * 2;
        const textHeight = size * 3;
        const radius = Math.hypot(W, H);

        let row = 0;
        for (let y = -radius; y <= radius; y += textHeight, row++) {
          for (let x = -radius; x <= radius; x += textWidth) {
            ctx.fillText(text, x + (row % 2 ? textWidth / 2 : 0), y);
          }
        }
      }
    }
    ctx.restore();
  };

  // Update Canvas Preview
  useEffect(() => {
    if (!canvasRef.current || items.length === 0) return;
    const canvas = canvasRef.current;
    const firstImg = items[0].img;

    const scale = Math.min(1, 480 / firstImg.naturalWidth);
    const W = Math.round(firstImg.naturalWidth * scale);
    const H = Math.round(firstImg.naturalHeight * scale);

    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(firstImg, 0, 0, W, H);
    drawWatermark(ctx, W, H);
  }, [items, watermarkText, placement, watermarkColor, fontSizePercent, opacity]);

  const handleDownloadAll = async () => {
    if (items.length === 0) {
      onError('يرجى اختيار صور أولاً.');
      return;
    }
    if (!watermarkText.trim()) {
      onError('يرجى كتابة نص العلامة المائية.');
      return;
    }

    setIsProcessing(true);

    try {
      if (items.length === 1) {
        const it = items[0];
        const canvas = document.createElement('canvas');
        canvas.width = it.img.naturalWidth;
        canvas.height = it.img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('فشل معالجة الصورة');

        ctx.drawImage(it.img, 0, 0);
        drawWatermark(ctx, canvas.width, canvas.height);

        const isPng = it.file.type === 'image/png';
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `watermark-${it.name.replace(/\.[^.]+$/, '')}.${isPng ? 'png' : 'jpg'}`;
            a.click();
            URL.revokeObjectURL(url);
          },
          isPng ? 'image/png' : 'image/jpeg',
          0.92
        );
      } else {
        // Multi images -> ZIP
        const zip = new JSZip();
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const canvas = document.createElement('canvas');
          canvas.width = it.img.naturalWidth;
          canvas.height = it.img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.drawImage(it.img, 0, 0);
          drawWatermark(ctx, canvas.width, canvas.height);

          const isPng = it.file.type === 'image/png';
          const blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, isPng ? 'image/png' : 'image/jpeg', 0.92)
          );
          if (blob) {
            zip.file(`wm-${it.name.replace(/\.[^.]+$/, '')}.${isPng ? 'png' : 'jpg'}`, blob);
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'watermarked-images.zip';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      onError(`حدث خطأ أثناء تنزيل الصور: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للأدوات</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
              <Stamp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                إضافة علامة مائية على الصور
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حماية الملكية بإضافة اسمك أو موقعك على صورة مفردة أو صور متعددة وتنزيلها كملف ZIP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings (Left) + Live Canvas Preview (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              اختر الصور (يمكن تحديد عدة صور معاً)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-950 dark:file:text-teal-300"
            />
            {items.length > 0 && (
              <span className="mt-1 text-xs text-teal-600 font-bold block">
                تم اختيار {items.length} صورة جاهزة للمعالجة
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              نص العلامة المائية:
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="اكتب النص هنا"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                شكل التموضع:
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="tile">مكرر على كامل الصورة (نمط مائل)</option>
                <option value="center">في وسط الصورة مائل</option>
                <option value="corner">في الزاوية السفلية</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                لون العلامة:
              </label>
              <input
                type="color"
                value={watermarkColor}
                onChange={(e) => setWatermarkColor(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>حجم الخط النسبي:</span>
              <span className="font-mono text-teal-600">{fontSizePercent}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              value={fontSizePercent}
              onChange={(e) => setFontSizePercent(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>الشفافية (Opacity):</span>
              <span className="font-mono text-teal-600">{opacity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={items.length === 0 || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition active:scale-98"
            >
              {items.length > 1 ? <Archive className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              <span>
                {isProcessing
                  ? 'جارٍ تجهيز الصور...'
                  : items.length > 1
                  ? `تحميل جميع الصور (${items.length}) في ملف ZIP`
                  : 'تطبيق وتحميل الصورة'}
              </span>
            </button>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 min-h-[360px]">
          {items.length > 0 ? (
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-bold text-slate-400">معاينة حية للصورة الأولى</span>
              <canvas
                ref={canvasRef}
                className="max-h-[380px] max-w-full rounded-xl border border-slate-200 bg-white shadow-md"
              />
            </div>
          ) : (
            <div className="text-center text-slate-400 space-y-2">
              <Eye className="h-10 w-10 mx-auto stroke-1" />
              <p className="text-xs font-medium">اختر صورة لمعاينة العلامة المائية هنا مباشرة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
