import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  User,
  Upload,
  Download,
  Printer,
  Sparkles,
  RotateCw,
  ZoomIn,
  Move,
  CheckCircle2,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload } from '../../utils/pdfUtils';

interface IdPhotoToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

interface PhotoSizePreset {
  id: string;
  name: string;
  desc: string;
  widthMm: number;
  heightMm: number;
}

const PHOTO_SIZES: PhotoSizePreset[] = [
  {
    id: '4x6',
    name: '4 × 6 سم',
    desc: 'جواز السفر السعودي، بطاقة الهوية الوطنية، الإقامة، ودول الخليج',
    widthMm: 40,
    heightMm: 60,
  },
  {
    id: '3.5x4.5',
    name: '3.5 × 4.5 سم',
    desc: 'تأشيرات الاتحاد الأوروبي (شنغن) والمملكة المتحدة (UK)',
    widthMm: 35,
    heightMm: 45,
  },
  {
    id: '5.1x5.1',
    name: '2 × 2 إنش (5.1 × 5.1 سم)',
    desc: 'تأشيرات الولايات المتحدة الأمريكية (US Visa) والهند',
    widthMm: 51,
    heightMm: 51,
  },
  {
    id: '3x4',
    name: '3 × 4 سم',
    desc: 'المعاملات الحكومية العادية، والجامعات، ورخص القيادة',
    widthMm: 30,
    heightMm: 40,
  },
  {
    id: '5x5',
    name: '5 × 5 سم',
    desc: 'مقاس مربّع رسمي لبعض المعاملات القنصلية',
    widthMm: 50,
    heightMm: 50,
  },
];

export const IdPhotoTool: React.FC<IdPhotoToolProps> = ({ onBack, onError }) => {
  const [selectedSize, setSelectedSize] = useState<PhotoSizePreset>(PHOTO_SIZES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  // Transformations
  const [zoom, setZoom] = useState<number>(1.1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showBiometricGuide, setShowBiometricGuide] = useState<boolean>(true);

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Preview canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImg(img);
        setPanOffset({ x: 0, y: 0 });
        setZoom(1.1);
      };
      img.onerror = () => onError('تعذّر قراءة الصورة. تأكد من سلامة الملف.');
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Draw image on canvas
  const drawCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      targetW: number,
      targetH: number,
      renderGuide: boolean = false
    ) => {
      // 1. Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      if (!loadedImg) return;

      // 2. Compute cover scale
      const scaleCover = Math.max(targetW / loadedImg.naturalWidth, targetH / loadedImg.naturalHeight) * zoom;
      const drawW = loadedImg.naturalWidth * scaleCover;
      const drawH = loadedImg.naturalHeight * scaleCover;

      const scaleRatio = targetW / (canvasRef.current?.width || targetW);
      const drawX = (targetW - drawW) / 2 + panOffset.x * scaleRatio;
      const drawY = (targetH - drawH) / 2 + panOffset.y * scaleRatio;

      ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);

      // 3. Optional Biometric Guidelines (Oval face mask)
      if (renderGuide && showBiometricGuide) {
        ctx.save();
        ctx.strokeStyle = 'rgba(13, 148, 136, 0.85)'; // teal-600
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);

        // Draw face oval
        const centerX = targetW / 2;
        const centerY = targetH * 0.44;
        const radiusX = targetW * 0.32;
        const radiusY = targetH * 0.32;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Eye line
        ctx.strokeStyle = 'rgba(13, 148, 136, 0.5)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX - radiusX * 0.8, centerY - radiusY * 0.15);
        ctx.lineTo(centerX + radiusX * 0.8, centerY - radiusY * 0.15);
        ctx.stroke();

        ctx.restore();
      }
    },
    [loadedImg, zoom, panOffset, showBiometricGuide]
  );

  // Render on preview canvas whenever params change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Viewport width ~340px
    const previewWidth = 340;
    const aspect = selectedSize.heightMm / selectedSize.widthMm;
    const previewHeight = Math.round(previewWidth * aspect);

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawCanvas(ctx, previewWidth, previewHeight, true);
    }
  }, [selectedSize, drawCanvas]);

  // Pointer drag events for canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setPanOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // High resolution render (300 DPI)
  const renderHighResCanvas = (): HTMLCanvasElement => {
    // 300 DPI calculation: mm / 25.4 * 300
    const w = Math.round((selectedSize.widthMm / 25.4) * 300);
    const h = Math.round((selectedSize.heightMm / 25.4) * 300);

    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (ctx) {
      drawCanvas(ctx, w, h, false);
    }
    return c;
  };

  // Download single photo
  const handleDownloadSingle = () => {
    if (!loadedImg) return;
    const canvas = renderHighResCanvas();
    canvas.toBlob(
      (blob) => {
        if (blob) {
          triggerFileDownload(blob, `id_photo_${selectedSize.id}.jpg`);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  // Download 10x15 cm print sheet (4x6 inch)
  const handleDownloadSheet = () => {
    if (!loadedImg) return;

    // Standard 4x6 inch paper at 300 DPI: 1200 x 1800 px
    const sheetW = 1200;
    const sheetH = 1800;
    const gap = 26;

    const single = renderHighResCanvas();

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = sheetW;
    sheetCanvas.height = sheetH;
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    // Fill white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetW, sheetH);

    // Calculate maximum photos that fit
    const cols = Math.floor((sheetW + gap) / (single.width + gap));
    const rows = Math.floor((sheetH + gap) / (single.height + gap));

    if (cols < 1 || rows < 1) {
      onError('حجم هذه الصورة يتجاوز مساحة ورقة الطباعة 10×15 سم.');
      return;
    }

    const startX = (sheetW - (cols * single.width + (cols - 1) * gap)) / 2;
    const startY = (sheetH - (rows * single.height + (rows - 1) * gap)) / 2;

    // Cutting mark styling
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = startX + c * (single.width + gap);
        const py = startY + r * (single.height + gap);

        // Draw photo
        ctx.drawImage(single, px, py);

        // Draw subtle border around photo for clean cutting
        ctx.strokeRect(px + 0.5, py + 0.5, single.width - 1, single.height - 1);
      }
    }

    sheetCanvas.toBlob(
      (blob) => {
        if (blob) {
          triggerFileDownload(blob, `photo_sheet_10x15_${cols * rows}_photos.jpg`);
        }
      },
      'image/jpeg',
      0.96
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title="العودة"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
                <User className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                تجهيز صورة المعاملات والجواز (ID Photo)
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                مقاسات معتمدة رسمياً
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              قص وتجهيز صورتك الشخصية بالمقاسات المعتمدة للجوازات والبطاقات، مع ورقة طباعة 10×15 سم جاهزة.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {!loadedImg ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 text-center transition hover:border-teal-500 dark:border-slate-700 dark:bg-slate-800/30">
            <input
              type="file"
              id="id-photo-input"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="id-photo-input"
              className="flex cursor-pointer flex-col items-center gap-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                  اسحب صورتك الشخصية هنا، أو اضغط للاختيار من جهازك
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  اختر صورة واضحة للوجه بإضاءة جيدة وخلفية موحدة إن أمكن
                </p>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Column (7 cols) */}
          <div className="space-y-5 lg:col-span-7">
            {/* 1. Size Preset Selection */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <label className="mb-3 block text-xs font-bold text-slate-700 dark:text-slate-300">
                اختر المقاس المطلوب ونوع المعاملة:
              </label>
              <div className="space-y-2">
                {PHOTO_SIZES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedSize(preset)}
                    className={`flex w-full items-start justify-between rounded-xl border p-3 text-start transition ${
                      selectedSize.id === preset.id
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600 dark:border-teal-500 dark:bg-teal-950/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {preset.name}
                        </span>
                        {selectedSize.id === preset.id && (
                          <span className="rounded bg-teal-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            محدد
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {preset.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Adjustment Sliders */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ضبط الحجم والموضع
                </h3>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
                  <input
                    type="checkbox"
                    checked={showBiometricGuide}
                    onChange={(e) => setShowBiometricGuide(e.target.checked)}
                    className="h-4 w-4 rounded accent-teal-600"
                  />
                  <span>إظهار إطار الوجه الإرشادي</span>
                </label>
              </div>

              {/* Zoom Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="h-4 w-4 text-teal-600" />
                    <span>درجة تكبير الصورة:</span>
                  </span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>

              {/* Reset pan button */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  💡 اسحب الصورة بالماوس داخل المربع لضبط مركز الوجه بدقة.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPanOffset({ x: 0, y: 0 });
                    setZoom(1.1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  إعادة ضبط الموضع
                </button>
              </div>
            </div>

            {/* 3. Export Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                id="btn-download-single-photo"
                onClick={handleDownloadSingle}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-98"
              >
                <Download className="h-4 w-4" />
                <span>تحميل الصورة الفردية</span>
              </button>

              <button
                type="button"
                id="btn-download-sheet-photo"
                onClick={handleDownloadSheet}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-teal-600 bg-white px-4 font-bold text-teal-700 transition hover:bg-teal-50 dark:bg-slate-900 dark:text-teal-400 dark:hover:bg-slate-800 active:scale-98"
              >
                <Printer className="h-4 w-4" />
                <span>ورقة طباعة 10×15 سم جاهزة</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas Preview Column (5 cols) */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 lg:col-span-5">
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <Move className="h-3 w-3" />
                <span>معاينة حية للمقاس ({selectedSize.name})</span>
              </span>
              <p className="mt-1 text-[11px] text-slate-500">
                اسحب وحرّك لتوسيط الوجه داخل الإطار البيضاوي المنقط
              </p>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-slate-300 bg-white shadow-lg dark:border-slate-700">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="block max-w-full touch-none cursor-grab active:cursor-grabbing"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setLoadedImg(null);
                setImageFile(null);
              }}
              className="mt-4 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
            >
              استبدال بصورة أخرى
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
