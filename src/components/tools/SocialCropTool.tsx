import React, { useState, useRef, useEffect } from 'react';
import {
  Crop,
  Upload,
  Download,
  ArrowRight,
  Move,
  ZoomIn,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface SocialCropToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

interface SocialPreset {
  id: string;
  name: string;
  w: number;
  h: number;
}

const SOCIAL_PRESETS: SocialPreset[] = [
  { id: 'insta-sq', name: 'إنستغرام – منشور مربع (1080×1080)', w: 1080, h: 1080 },
  { id: 'insta-pt', name: 'إنستغرام – منشور طولي (1080×1350)', w: 1080, h: 1350 },
  { id: 'story', name: 'ستوري / ريلز / تيك توك / واتساب (1080×1920)', w: 1080, h: 1920 },
  { id: 'twitter', name: 'X (تويتر) – صورة المنشور (1600×900)', w: 1600, h: 900 },
  { id: 'fb-cover', name: 'فيسبوك – غلاف الصفحة (820×312)', w: 820, h: 312 },
  { id: 'linkedin', name: 'لينكدإن – غلاف الملف الشخصي (1584×396)', w: 1584, h: 396 },
  { id: 'yt-thumb', name: 'يوتيوب – صورة مصغرة Thumbnail (1280×720)', w: 1280, h: 720 },
  { id: 'yt-banner', name: 'يوتيوب – غلاف القناة (2560×1440)', w: 2560, h: 1440 },
  { id: 'avatar', name: 'صورة شخصية / شعار مربع (512×512)', w: 512, h: 512 },
  { id: 'custom', name: 'مقاس مخصص...', w: 1080, h: 1080 },
];

export const SocialCropTool: React.FC<SocialCropToolProps> = ({ t, onBack, onError }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('insta-sq');
  const [customW, setCustomW] = useState<number>(1080);
  const [customH, setCustomH] = useState<number>(1080);

  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [zoom, setZoom] = useState<number>(1.0);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const getTargetDims = () => {
    if (selectedPreset === 'custom') {
      return {
        w: Math.min(6000, Math.max(16, customW || 1080)),
        h: Math.min(6000, Math.max(16, customH || 1080)),
      };
    }
    const p = SOCIAL_PRESETS.find((x) => x.id === selectedPreset);
    return p ? { w: p.w, h: p.h } : { w: 1080, h: 1080 };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImageObj(img);
      setFileName(file.name);
      setPanOffset({ x: 0, y: 0 });
      setZoom(1.0);
    };
    img.onerror = () => {
      onError('تعذر قراءة الصورة.');
    };
  };

  // Render on Preview Canvas
  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { w: targetW, h: targetH } = getTargetDims();
    // Fit within preview box
    const maxPreviewDim = 460;
    const scale = maxPreviewDim / Math.max(targetW, targetH);
    const canvasW = Math.max(20, Math.round(targetW * scale));
    const canvasH = Math.max(20, Math.round(targetH * scale));

    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    if (!imageObj) return;

    const iw = imageObj.naturalWidth;
    const ih = imageObj.naturalHeight;

    const baseScale =
      fitMode === 'cover'
        ? Math.max(canvasW / iw, canvasH / ih)
        : Math.min(canvasW / iw, canvasH / ih);

    const s = baseScale * zoom;
    const drawW = iw * s;
    const drawH = ih * s;

    const drawX = (canvasW - drawW) / 2 + panOffset.x;
    const drawY = (canvasH - drawH) / 2 + panOffset.y;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);
  };

  useEffect(() => {
    drawPreview();
  }, [imageObj, selectedPreset, customW, customH, fitMode, bgColor, zoom, panOffset]);

  // Pointer drag for panning the image
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleDownload = () => {
    if (!imageObj) {
      onError('يرجى اختيار صورة أولاً.');
      return;
    }

    const { w: targetW, h: targetH } = getTargetDims();
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = targetW;
    exportCanvas.height = targetH;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);

    const iw = imageObj.naturalWidth;
    const ih = imageObj.naturalHeight;

    const baseScale =
      fitMode === 'cover'
        ? Math.max(targetW / iw, targetH / ih)
        : Math.min(targetW / iw, targetH / ih);

    const s = baseScale * zoom;
    const drawW = iw * s;
    const drawH = ih * s;

    // Scale preview panOffset up to full resolution
    const previewCanvas = canvasRef.current;
    const ratio = previewCanvas ? targetW / previewCanvas.width : 1;

    const drawX = (targetW - drawW) / 2 + panOffset.x * ratio;
    const drawY = (targetH - drawH) / 2 + panOffset.y * ratio;

    ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);

    const isJpeg = format === 'jpeg';
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const outBase = fileName ? fileName.replace(/\.[^.]+$/, '') : 'social-image';
        a.download = `${outBase}-${targetW}x${targetH}.${isJpeg ? 'jpg' : 'png'}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      isJpeg ? 'image/jpeg' : 'image/png',
      0.94
    );
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
              <Crop className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                مقاسات السوشيال ميديا وقص الصور
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                قص وضبط الصور بدقة للمنصات (إنستغرام، ستوري، فيسبوك، تويتر، يوتيوب، ولينكدإن)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              اختر الصورة:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-950 dark:file:text-teal-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              المقاس المطلوب:
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {SOCIAL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {selectedPreset === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  العرض (px)
                </label>
                <input
                  type="number"
                  min="16"
                  max="6000"
                  value={customW}
                  onChange={(e) => setCustomW(parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  الارتفاع (px)
                </label>
                <input
                  type="number"
                  min="16"
                  max="6000"
                  value={customH}
                  onChange={(e) => setCustomH(parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                طريقة التعبئة:
              </label>
              <select
                value={fitMode}
                onChange={(e) => setFitMode(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="cover">قص الحواف وتعبئة الإطار (Cover)</option>
                <option value="contain">احتواء كامل الصورة (Contain)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                لون الخلفية:
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>نسبة التكبير (Zoom):</span>
              <span className="font-mono text-teal-600">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                صيغة الحفظ:
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="png">PNG (جودة فائقة)</option>
                <option value="jpeg">JPG / JPEG (حجم أصغر)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setPanOffset({ x: 0, y: 0 });
                  setZoom(1.0);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                إعادة التوسيط
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!imageObj}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition active:scale-98"
            >
              <Download className="h-4 w-4" />
              <span>تحميل الصورة بالمقاس المطلوب</span>
            </button>
          </div>
        </div>

        {/* Live Canvas Preview with Drag Interaction */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 min-h-[400px]">
          {imageObj ? (
            <div className="space-y-3 text-center w-full flex flex-col items-center">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                <Move className="h-3.5 w-3.5" />
                <span>يمكنك سحب الصورة وتحريكها داخل الإطار لتحديد الجزء المناسب</span>
              </span>
              <div className="rounded-xl overflow-hidden border-2 border-slate-300 shadow-lg bg-white">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="cursor-grab active:cursor-grabbing block touch-none"
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 space-y-2">
              <Crop className="h-10 w-10 mx-auto stroke-1" />
              <p className="text-xs font-medium">اختر صورة لمعاينتها وتعديل موضعها مباشرة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
