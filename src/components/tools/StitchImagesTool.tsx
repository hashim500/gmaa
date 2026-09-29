import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Upload,
  Download,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Columns,
  Rows,
  Move,
  Maximize2,
  RotateCw,
  Plus,
  Grid,
  FileImage,
  Check,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface StitchImagesToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

interface StitchItem {
  id: string;
  name: string;
  img: HTMLImageElement;
  // Freeform layout coordinates (percentage of canvas width/height 0-100)
  x?: number;
  y?: number;
  width?: number; // width in % of paper width
  height?: number; // height in % of paper height
  rotation?: number; // 0, 90, 180, 270
  zIndex?: number;
}

type StitchMode = 'vertical' | 'horizontal' | 'freeform';
type PaperPreset = 'a4-portrait' | 'a4-landscape' | 'square' | 'wide';

const PAPER_PRESETS: Record<PaperPreset, { label: string; width: number; height: number; aspect: string }> = {
  'a4-portrait': { label: 'ورقة A4 طولية', width: 1240, height: 1754, aspect: '1240/1754' },
  'a4-landscape': { label: 'ورقة A4 عرضية', width: 1754, height: 1240, aspect: '1754/1240' },
  'square': { label: 'مربعة 1:1 (سوشيال)', width: 1200, height: 1200, aspect: '1/1' },
  'wide': { label: 'عريضة 16:9 (شاشة)', width: 1600, height: 900, aspect: '16/9' },
};

export const StitchImagesTool: React.FC<StitchImagesToolProps> = ({ t, onBack, onError }) => {
  const [items, setItems] = useState<StitchItem[]>([]);
  const [mode, setMode] = useState<StitchMode>('freeform');
  const [paperPreset, setPaperPreset] = useState<PaperPreset>('a4-portrait');
  const [gap, setGap] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Selected item in freeform mode
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paperContainerRef = useRef<HTMLDivElement | null>(null);

  const handleFiles = async (filesList: FileList | null, dropPoint?: { xPercent: number; yPercent: number }) => {
    if (!filesList || filesList.length === 0) return;

    try {
      const loaded: StitchItem[] = [];
      const currentCount = items.length;

      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        if (!file.type.startsWith('image/')) continue;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`فشل تحميل ${file.name}`));
        });

        // Compute default width and height in percentage of paper
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let defaultWidth = 35; // 35% of paper
        let defaultHeight = defaultWidth / imgAspect;

        // Position staggered or at drop position
        const posX = dropPoint
          ? Math.max(0, Math.min(85, dropPoint.xPercent - defaultWidth / 2))
          : Math.min(70, 10 + ((currentCount + i) % 4) * 15);
        const posY = dropPoint
          ? Math.max(0, Math.min(85, dropPoint.yPercent - defaultHeight / 2))
          : Math.min(70, 10 + Math.floor((currentCount + i) / 4) * 18);

        loaded.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          img,
          x: posX,
          y: posY,
          width: defaultWidth,
          height: defaultHeight,
          rotation: 0,
          zIndex: currentCount + i + 1,
        });
      }

      if (loaded.length === 0) return;

      setItems((prev) => [...prev, ...loaded]);
      setSelectedItemId(loaded[loaded.length - 1].id);
    } catch (err: any) {
      onError(err.message || 'حدث خطأ أثناء تحميل الصور.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDropOnPaper = (e: React.DragEvent) => {
    e.preventDefault();
    const paper = paperContainerRef.current;
    if (!paper) return;

    const rect = paper.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, (dropX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (dropY / rect.height) * 100));

    handleFiles(e.dataTransfer.files, { xPercent, yPercent });
  };

  // Reordering for linear modes
  const moveItem = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  // Freeform Item Drag Handlers (Mouse & Touch)
  const startDragItem = (e: React.MouseEvent | React.TouchEvent, item: StitchItem) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
    setDraggingItemId(item.id);

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const paper = paperContainerRef.current;
    if (!paper) return;
    const rect = paper.getBoundingClientRect();

    const currentPxX = ((item.x || 0) / 100) * rect.width;
    const currentPxY = ((item.y || 0) / 100) * rect.height;

    setDragOffset({
      x: clientX - rect.left - currentPxX,
      y: clientY - rect.top - currentPxY,
    });
  };

  useEffect(() => {
    if (!draggingItemId) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const paper = paperContainerRef.current;
      if (!paper) return;
      const rect = paper.getBoundingClientRect();

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const pxX = clientX - rect.left - dragOffset.x;
      const pxY = clientY - rect.top - dragOffset.y;

      const newPercentX = Math.max(-10, Math.min(100, (pxX / rect.width) * 100));
      const newPercentY = Math.max(-10, Math.min(100, (pxY / rect.height) * 100));

      setItems((prev) =>
        prev.map((it) =>
          it.id === draggingItemId
            ? { ...it, x: Math.round(newPercentX * 10) / 10, y: Math.round(newPercentY * 10) / 10 }
            : it
        )
      );
    };

    const onUp = () => {
      setDraggingItemId(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [draggingItemId, dragOffset]);

  // Adjust scale / size of selected item
  const updateSelectedSize = (deltaPercent: number) => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== selectedItemId) return it;
        const currentW = it.width || 35;
        const newW = Math.max(10, Math.min(95, currentW + deltaPercent));
        const aspect = it.img.naturalWidth / it.img.naturalHeight;
        const newH = newW / aspect;
        return { ...it, width: newW, height: newH };
      })
    );
  };

  // Rotate selected item
  const rotateSelectedItem = () => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== selectedItemId) return it;
        const newRot = ((it.rotation || 0) + 90) % 360;
        return { ...it, rotation: newRot };
      })
    );
  };

  // Center selected item on paper
  const centerSelectedItem = () => {
    if (!selectedItemId) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== selectedItemId) return it;
        const w = it.width || 35;
        const h = it.height || 35;
        return {
          ...it,
          x: Math.max(0, (100 - w) / 2),
          y: Math.max(0, (100 - h) / 2),
        };
      })
    );
  };

  // Layer order
  const bringSelectedItemToFront = () => {
    if (!selectedItemId) return;
    const maxZ = Math.max(...items.map((i) => i.zIndex || 1), 1);
    setItems((prev) =>
      prev.map((it) => (it.id === selectedItemId ? { ...it, zIndex: maxZ + 1 } : it))
    );
  };

  // Draw on canvas for export or preview
  const drawOnTargetCanvas = (targetCanvas: HTMLCanvasElement, maxPreviewWidth?: number) => {
    if (items.length === 0) return;

    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    if (mode === 'freeform') {
      const preset = PAPER_PRESETS[paperPreset];
      const baseW = preset.width;
      const baseH = preset.height;

      let scale = 1;
      if (maxPreviewWidth) {
        scale = Math.min(1, maxPreviewWidth / baseW);
      }

      const W = Math.round(baseW * scale);
      const H = Math.round(baseH * scale);

      targetCanvas.width = W;
      targetCanvas.height = H;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Sort items by zIndex before drawing
      const sorted = [...items].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

      sorted.forEach((it) => {
        const itemX = (((it.x || 0) / 100) * baseW) * scale;
        const itemY = (((it.y || 0) / 100) * baseH) * scale;
        const itemW = (((it.width || 35) / 100) * baseW) * scale;
        const aspect = it.img.naturalWidth / it.img.naturalHeight;
        const itemH = itemW / aspect;

        ctx.save();
        ctx.translate(itemX + itemW / 2, itemY + itemH / 2);
        if (it.rotation) {
          ctx.rotate((it.rotation * Math.PI) / 180);
        }
        ctx.drawImage(it.img, -itemW / 2, -itemH / 2, itemW, itemH);
        ctx.restore();
      });
    } else {
      // Linear: Vertical or Horizontal
      const isVert = mode === 'vertical';

      let totalW = 0;
      let totalH = 0;

      if (isVert) {
        const baseW = Math.max(...items.map((it) => it.img.naturalWidth));
        totalW = baseW;
        totalH =
          items.reduce((acc, it) => {
            const scaledH = it.img.naturalHeight * (baseW / it.img.naturalWidth);
            return acc + scaledH;
          }, 0) +
          gap * (items.length - 1);
      } else {
        const baseH = Math.max(...items.map((it) => it.img.naturalHeight));
        totalH = baseH;
        totalW =
          items.reduce((acc, it) => {
            const scaledW = it.img.naturalWidth * (baseH / it.img.naturalHeight);
            return acc + scaledW;
          }, 0) +
          gap * (items.length - 1);
      }

      let renderScale = 1;
      if (maxPreviewWidth) {
        renderScale = Math.min(1, maxPreviewWidth / totalW);
      }

      const W = Math.round(totalW * renderScale);
      const H = Math.round(totalH * renderScale);

      targetCanvas.width = W;
      targetCanvas.height = H;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      let offset = 0;

      if (isVert) {
        const baseW = Math.max(...items.map((it) => it.img.naturalWidth));
        items.forEach((it) => {
          const scaledH = it.img.naturalHeight * (baseW / it.img.naturalWidth);
          ctx.drawImage(
            it.img,
            0,
            Math.round(offset * renderScale),
            W,
            Math.round(scaledH * renderScale)
          );
          offset += scaledH + gap;
        });
      } else {
        const baseH = Math.max(...items.map((it) => it.img.naturalHeight));
        items.forEach((it) => {
          const scaledW = it.img.naturalWidth * (baseH / it.img.naturalHeight);
          ctx.drawImage(
            it.img,
            Math.round(offset * renderScale),
            0,
            Math.round(scaledW * renderScale),
            H
          );
          offset += scaledW + gap;
        });
      }
    }
  };

  // Preview canvas for vertical / horizontal
  useEffect(() => {
    if (mode === 'freeform') return;
    if (!canvasRef.current) return;
    drawOnTargetCanvas(canvasRef.current, 520);
  }, [items, mode, gap, bgColor, paperPreset]);

  const handleDownload = () => {
    if (items.length === 0) {
      onError('يرجى إضافة صور أولاً للدمج.');
      return;
    }

    setIsProcessing(true);
    try {
      const exportCanvas = document.createElement('canvas');
      drawOnTargetCanvas(exportCanvas); // Full resolution without preview scaling

      const isJpeg = format === 'jpeg';
      exportCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `stitched-${mode}-${Date.now()}.${isJpeg ? 'jpg' : 'png'}`;
          a.click();
          URL.revokeObjectURL(url);
          setIsProcessing(false);
        },
        isJpeg ? 'image/jpeg' : 'image/png',
        0.95
      );
    } catch (err: any) {
      onError(`حدث خطأ أثناء حفظ الصورة المدمجة: ${err.message || err}`);
      setIsProcessing(false);
    }
  };

  const selectedItem = items.find((it) => it.id === selectedItemId);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            <span>العودة للأدوات</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                دمج عدة صور في صورة واحدة (حر / رأسي / أفقي)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                لوحة عمل تفاعلية تتيح لك ترتيب الصور وسحبها وإسقاطها بحرية على صفحة واحدة
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 transition">
            <Upload className="h-4 w-4" />
            <span>إضافة صور</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleDownload}
            disabled={items.length === 0 || isProcessing}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition active:scale-98"
          >
            <Download className="h-4 w-4" />
            <span>{isProcessing ? 'جارٍ التصدير...' : 'تصدير وحفظ الصورة'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('freeform')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === 'freeform'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>دمج حر (لوحة وورقة عمل)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('vertical')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === 'vertical'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Rows className="h-4 w-4" />
            <span>دمج رأسي</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('horizontal')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === 'horizontal'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Columns className="h-4 w-4" />
            <span>دمج أفقي</span>
          </button>
        </div>

        {/* Format & Background Quick Selectors */}
        <div className="flex items-center gap-3 pe-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">الخلفية:</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-7 w-7 rounded-lg border border-slate-200 cursor-pointer dark:border-slate-700"
              title="تغيير لون خلفية الصفحة"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">الصيغة:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="png">PNG (دقة عالية)</option>
              <option value="jpeg">JPG (حجم أقل)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {mode === 'freeform' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Freeform Paper Canvas (Left 8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Paper Toolbar */}
            <div className="mb-3 flex w-full items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">مقاس اللوحة:</span>
                <select
                  value={paperPreset}
                  onChange={(e) => setPaperPreset(e.target.value as PaperPreset)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {Object.entries(PAPER_PRESETS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-slate-500">
                💡 اسحب الصور بالفأرة أو اللمس لتغيير موقعها، أو أسقط ملفات إضافية على الورقة مباشرة
              </div>
            </div>

            {/* Interactive Paper Sheet Container */}
            <div
              className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-200/50 p-4 sm:p-6 shadow-inner dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center min-h-[500px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnPaper}
              onClick={() => setSelectedItemId(null)}
            >
              <div
                ref={paperContainerRef}
                className="relative select-none rounded-lg shadow-2xl transition-all"
                style={{
                  width: '100%',
                  maxWidth: paperPreset === 'a4-landscape' || paperPreset === 'wide' ? '780px' : '560px',
                  aspectRatio: PAPER_PRESETS[paperPreset].aspect,
                  backgroundColor: bgColor,
                }}
              >
                {/* Empty State Prompt */}
                {items.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg pointer-events-none">
                    <FileImage className="h-12 w-12 stroke-1 mb-2 text-slate-400" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      هذه ورقة العمل الحرة
                    </p>
                    <p className="text-xs mt-1 text-slate-400 max-w-xs">
                      اسحب وأفلت الصور هنا، أو اضغط زر "إضافة صور" لتوزيعها وترتيبها كما تشاء
                    </p>
                  </div>
                )}

                {/* Freeform Draggable Items */}
                {items.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  const isDragging = draggingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`group absolute cursor-move select-none rounded transition-shadow ${
                        isSelected
                          ? 'ring-2 ring-teal-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-xl'
                          : 'hover:ring-1 hover:ring-teal-400/80 shadow-md'
                      } ${isDragging ? 'opacity-90 scale-[1.02]' : ''}`}
                      style={{
                        left: `${item.x || 0}%`,
                        top: `${item.y || 0}%`,
                        width: `${item.width || 35}%`,
                        zIndex: item.zIndex || 1,
                        touchAction: 'none',
                        transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
                      }}
                      onMouseDown={(e) => startDragItem(e, item)}
                      onTouchStart={(e) => startDragItem(e, item)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                      }}
                    >
                      <img
                        src={item.img.src}
                        alt={item.name}
                        className="pointer-events-none block w-full h-auto rounded object-contain"
                        draggable={false}
                      />

                      {/* Corner Drag Handle Hint on Hover/Select */}
                      {isSelected && (
                        <div className="absolute -top-7 start-0 flex items-center gap-1 rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          <Move className="h-3 w-3" />
                          <span>تحريك</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Item & Tools Sidebar (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Selected item controls */}
            {selectedItem ? (
              <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 text-xs dark:border-teal-900/50 dark:bg-teal-950/20 space-y-3">
                <div className="flex items-center justify-between border-b border-teal-100 pb-2 dark:border-teal-900/60">
                  <span className="font-bold text-teal-900 dark:text-teal-200 truncate max-w-[200px]">
                    تحكم بالصورة المحددة
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(selectedItem.id)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>حذف</span>
                  </button>
                </div>

                {/* Sizing Controls */}
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    حجم الصورة على الورقة:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSelectedSize(-5)}
                      className="rounded-lg bg-white px-2.5 py-1 font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                    >
                      - تصغير
                    </button>
                    <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">
                      {Math.round(selectedItem.width || 35)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => updateSelectedSize(5)}
                      className="rounded-lg bg-white px-2.5 py-1 font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                    >
                      + تكبير
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={rotateSelectedItem}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>تدوير 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={centerSelectedItem}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>توسيط في الصفحة</span>
                  </button>

                  <button
                    type="button"
                    onClick={bringSelectedItemToFront}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>إلى المقدمة</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                انقر على أي صورة على الورقة لضبط حجمها أو تدويرها أو إرسالها للأمام.
              </div>
            )}

            {/* List of images */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  الصور على الورقة ({items.length})
                </span>
                <label className="cursor-pointer text-[11px] font-bold text-teal-600 hover:underline">
                  + صورة جديدة
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-slate-400">لم يتم إضافة أي صور بعد.</p>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {items.map((it, idx) => {
                    const isSelected = selectedItemId === it.id;
                    return (
                      <div
                        key={it.id}
                        onClick={() => setSelectedItemId(it.id)}
                        className={`flex items-center justify-between rounded-xl border p-2 text-xs cursor-pointer transition ${
                          isSelected
                            ? 'border-teal-400 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/40'
                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={it.img.src}
                            alt=""
                            className="h-8 w-8 rounded object-cover flex-none"
                          />
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {it.name}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(it.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Linear Mode (Vertical / Horizontal) */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>المسافة الفاصلة بين الصور (Gap):</span>
                <span className="font-mono text-teal-600">{gap}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={gap}
                onChange={(e) => setGap(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600"
              />
            </div>

            {/* Re-order items list */}
            <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                ترتيب الصور ({items.length}):
              </span>
              {items.length === 0 ? (
                <p className="text-xs text-slate-400">لم يتم اختيار أي صور بعد.</p>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {items.map((it, idx) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] text-slate-400 w-4">{idx + 1}</span>
                        <img
                          src={it.img.src}
                          alt=""
                          className="h-7 w-7 rounded object-cover flex-none"
                        />
                        <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                          {it.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-none">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="تحريك للأعلى"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 1)}
                          disabled={idx === items.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="تحريك للأسفل"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(it.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Canvas Live Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 min-h-[360px]">
            {items.length > 0 ? (
              <div className="space-y-2 text-center w-full flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-400">معاينة حية للدمج</span>
                <div className="max-h-[460px] max-w-full overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <canvas ref={canvasRef} className="block mx-auto rounded" />
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 space-y-2">
                <Layers className="h-10 w-10 mx-auto stroke-1" />
                <p className="text-xs font-medium">اختر صورتين أو أكثر لمعاينة دمجهما هنا</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
