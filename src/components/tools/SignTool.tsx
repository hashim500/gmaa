import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  PenTool,
  Upload,
  RotateCcw,
  CheckCircle2,
  Check,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Move,
  FileText,
} from 'lucide-react';
import { pdfjsLib } from '../../utils/pdfWorker';
import { PDFDocument } from 'pdf-lib';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';

interface SignToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (progress: number, message: string) => void;
  onComplete: (result: ProcessedResult) => void;
  onError: (msg: string) => void;
}

const PEN_COLORS = [
  { name: 'أسود', hex: '#111111', bg: 'bg-slate-900' },
  { name: 'أزرق داكن', hex: '#1a3fb5', bg: 'bg-blue-700' },
  { name: 'أزرق ملكي', hex: '#0284c7', bg: 'bg-sky-600' },
  { name: 'أحمر داكن', hex: '#b91c1c', bg: 'bg-red-700' },
  { name: 'أخضر زمردي', hex: '#047857', bg: 'bg-emerald-700' },
];

export const SignTool: React.FC<SignToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDocProxy, setPdfDocProxy] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageRendering, setPageRendering] = useState<boolean>(false);

  // Signature creation mode: 'draw' | 'upload'
  const [sigMode, setSigMode] = useState<'draw' | 'upload'>('draw');
  const [penColor, setPenColor] = useState<string>('#111111');
  const [penWidth, setPenWidth] = useState<number>(4);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [sigAspect, setSigAspect] = useState<number>(0.4);

  // Placement state (percentage of page width and height: 0 to 1)
  const [sigPos, setSigPos] = useState<{ x: number; y: number }>({ x: 0.7, y: 0.85 });
  const [sigScalePercent, setSigScalePercent] = useState<number>(25); // 5% to 60%
  const [applyToAllPages, setApplyToAllPages] = useState<boolean>(false);

  // Pad canvas ref
  const padRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Preview stage canvas ref
  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingOnStageRef = useRef<boolean>(false);

  // Load PDF when file changes
  useEffect(() => {
    if (!file) {
      setPdfDocProxy(null);
      setTotalPages(0);
      return;
    }

    let isCancelled = false;
    const loadPdf = async () => {
      try {
        const arrayBuf = await file.arrayBuffer();
        const proxy = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
        if (isCancelled) return;
        setPdfDocProxy(proxy);
        setTotalPages(proxy.numPages);
        setCurrentPage(1);
      } catch (err: any) {
        if (!isCancelled) {
          onError('تعذّر قراءة ملف PDF. قد يكون محمياً بكلمة مرور أو تالفاً.');
        }
      }
    };

    loadPdf();
    return () => {
      isCancelled = true;
    };
  }, [file, onError]);

  // Render current PDF page to preview canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocProxy || !pageCanvasRef.current) return;
    setPageRendering(true);

    try {
      const page = await pdfDocProxy.getPage(currentPage);
      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Compute scale to fit comfortably in preview container (max width ~800px)
      const containerWidth = stageContainerRef.current?.clientWidth || 750;
      const desiredWidth = Math.min(containerWidth - 32, 800);
      const scale = Math.max(1, desiredWidth / unscaledViewport.width);

      const viewport = page.getViewport({ scale });
      const canvas = pageCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await (page.render as any)({
        canvasContext: ctx,
        viewport,
        canvas,
      }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    } finally {
      setPageRendering(false);
    }
  }, [pdfDocProxy, currentPage]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Trim empty transparent pixels from canvas
  const trimCanvas = (c: HTMLCanvasElement): string | null => {
    const w = c.width;
    const h = c.height;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    const data = ctx.getImageData(0, 0, w, h).data;

    let x0 = w;
    let y0 = h;
    let x1 = -1;
    let y1 = -1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const alpha = data[(y * w + x) * 4 + 3];
        if (alpha > 15) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }

    if (x1 < 0) return null; // Blank

    const padMargin = 8;
    const outW = x1 - x0 + 1 + padMargin * 2;
    const outH = y1 - y0 + 1 + padMargin * 2;
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return null;

    outCtx.drawImage(c, x0, y0, x1 - x0 + 1, y1 - y0 + 1, padMargin, padMargin, x1 - x0 + 1, y1 - y0 + 1);
    return outCanvas.toDataURL('image/png');
  };

  // Drawing Pad handlers
  const getPadCoord = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = padRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
  };

  const handlePadPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = padRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth * 2; // high res canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const [x, y] = getPadCoord(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y);
    ctx.stroke();
  };

  const handlePadPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = padRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [x, y] = getPadCoord(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePadPointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = padRef.current;
    if (!canvas) return;
    const trimmed = trimCanvas(canvas);
    if (trimmed) {
      setSignatureDataUrl(trimmed);
      const img = new Image();
      img.onload = () => setSigAspect(img.naturalHeight / img.naturalWidth);
      img.src = trimmed;
    }
  };

  const clearPad = () => {
    const canvas = padRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // Upload image signature
  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const src = evt.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Render to temp canvas to remove white background if needed
        const tempC = document.createElement('canvas');
        tempC.width = img.naturalWidth;
        tempC.height = img.naturalHeight;
        const ctx = tempC.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, tempC.width, tempC.height);
          const d = imgData.data;
          // If pure white or near white, make transparent
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            if (r > 235 && g > 235 && b > 235) {
              d[i + 3] = 0; // Transparent
            }
          }
          ctx.putImageData(imgData, 0, 0);
          const trimmed = trimCanvas(tempC) || tempC.toDataURL('image/png');
          setSignatureDataUrl(trimmed);
          const loadBack = new Image();
          loadBack.onload = () => setSigAspect(loadBack.naturalHeight / loadBack.naturalWidth);
          loadBack.src = trimmed;
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(imgFile);
  };

  // Place signature on PDF stage
  const updateSigStageCoord = (clientX: number, clientY: number) => {
    const stage = stageContainerRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.min(0.95, Math.max(0.05, (clientX - rect.left) / rect.width));
    const y = Math.min(0.95, Math.max(0.05, (clientY - rect.top) / rect.height));
    setSigPos({ x, y });
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingOnStageRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateSigStageCoord(e.clientX, e.clientY);
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingOnStageRef.current) return;
    updateSigStageCoord(e.clientX, e.clientY);
  };

  const handleStagePointerUp = () => {
    isDraggingOnStageRef.current = false;
  };

  // Execute PDF Signing using pdf-lib
  const handleSignPdf = async () => {
    if (!file) {
      onError('يرجى اختيار ملف PDF أولاً.');
      return;
    }
    if (!signatureDataUrl) {
      onError('يرجى رسم أو رفع التوقيع أولاً.');
      return;
    }

    try {
      onProgress(15, 'جاري تحضير مستند PDF والتوقيع...');
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      onProgress(45, 'جاري معالجة ودمج التوقيع الإلكتروني...');
      const pngImage = await pdfDoc.embedPng(signatureDataUrl);
      const pages = pdfDoc.getPages();

      const targetPages = applyToAllPages
        ? pages
        : [pages[Math.min(currentPage - 1, pages.length - 1)]];

      targetPages.forEach((page) => {
        const { width: pageWidth, height: pageHeight } = page.getSize();
        const sigWidth = pageWidth * (sigScalePercent / 100);
        const sigHeight = sigWidth * sigAspect;

        // Position from top-left percentage to bottom-left coordinates for PDF
        const targetX = sigPos.x * pageWidth - sigWidth / 2;
        const targetY = pageHeight - (sigPos.y * pageHeight) - sigHeight / 2;

        page.drawImage(pngImage, {
          x: Math.max(0, targetX),
          y: Math.max(0, targetY),
          width: sigWidth,
          height: sigHeight,
        });
      });

      onProgress(85, 'جاري حفظ وتصدير المستند الموقّع...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const signedFilename = `${originalName}_signed.pdf`;

      onProgress(100, 'تم التوقيع بنجاح!');
      onComplete({
        blob,
        filename: signedFilename,
        type: 'pdf',
        originalSize: file.size,
      });
    } catch (err: any) {
      onError(`تعذّر توقيع ملف PDF: ${err.message || 'خطأ غير متوقع'}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* Header Bar */}
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
                <PenTool className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                توقيع ملف PDF إلكترونياً
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                خصوصية 100% محلية
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              ارسم توقيعك بيدك أو ارفعه كصورة شفافة، ثم حدد مكانه وحجمه بدقة على أي صفحة.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Choose PDF File */}
      {!file ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FileUploader
            t={t}
            file={file}
            onFilesSelected={(files) => setFile(files[0])}
            onFileSelect={setFile}
            accept=".pdf,application/pdf"
            helperText="اختر ملف الـ PDF الذي ترغب في وضع توقيعك عليه"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Selected Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900/50 dark:bg-teal-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
                  <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                    {totalPages} {totalPages === 1 ? 'صفحة' : 'صفحات'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {(file.size / 1024).toFixed(1)} كيلوبايت
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setSignatureDataUrl(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              تغيير الملف
            </button>
          </div>

          {/* 2. Create Signature Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  1
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  تجهيز التوقيع
                </h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setSigMode('draw')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                    sigMode === 'draw'
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>رسم التوقيع</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSigMode('upload')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                    sigMode === 'upload'
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>رفع صورة توقيع</span>
                </button>
              </div>
            </div>

            {sigMode === 'draw' ? (
              <div className="mt-4 space-y-3">
                {/* Pad Canvas */}
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-950/40">
                  <canvas
                    ref={padRef}
                    width={900}
                    height={260}
                    onPointerDown={handlePadPointerDown}
                    onPointerMove={handlePadPointerMove}
                    onPointerUp={handlePadPointerUp}
                    className="h-44 w-full touch-none cursor-crosshair bg-white dark:bg-slate-900"
                  />
                  {!signatureDataUrl && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-400">
                      ارسم توقيعك هنا بالماوس أو شاشة اللمس
                    </div>
                  )}
                </div>

                {/* Pad Toolbar: Colors & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">لون القلم:</span>
                    <div className="flex items-center gap-1.5">
                      {PEN_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setPenColor(c.hex)}
                          className={`h-7 w-7 rounded-full ${c.bg} transition ${
                            penColor === c.hex
                              ? 'ring-2 ring-teal-500 ring-offset-2'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>

                    <div className="ms-3 flex items-center gap-2 border-s border-slate-200 ps-3 dark:border-slate-800">
                      <span className="text-xs text-slate-500">سُمك الخط:</span>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        value={penWidth}
                        onChange={(e) => setPenWidth(Number(e.target.value))}
                        className="w-20 accent-teal-600"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={clearPad}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>مسح التوقيع</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Signature Mode */
              <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <input
                  type="file"
                  id="sig-file-input"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUploadSignature}
                  className="hidden"
                />
                <label
                  htmlFor="sig-file-input"
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    اضغط لرفع صورة التوقيع
                  </span>
                  <span className="text-xs text-slate-500">
                    يدعم PNG و JPG (يتم عزل الخلفية البيضاء تلقائياً)
                  </span>
                </label>
              </div>
            )}

            {/* Signature Ready Preview */}
            {signatureDataUrl && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>تم تجهيز التوقيع بنجاح! حدد موقعه على المستند بالأسفل:</span>
                </div>
                <div className="h-10 rounded border border-emerald-300 bg-white px-2 py-1 dark:border-emerald-800 dark:bg-slate-900">
                  <img src={signatureDataUrl} alt="Signature" className="h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* 3. Place Signature on Document */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  2
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  تحديد موضع التوقيع وحجمه
                </h3>
              </div>

              {/* Page Navigator */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1 || pageRendering}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages || pageRendering}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Controls Bar: Size slider & Apply all pages checkbox */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="h-4 w-4 text-teal-600" />
                    <span>حجم التوقيع:</span>
                  </span>
                  <span>{sigScalePercent}% من عرض الصفحة</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="60"
                  value={sigScalePercent}
                  onChange={(e) => setSigScalePercent(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>

              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={applyToAllPages}
                    onChange={(e) => setApplyToAllPages(e.target.checked)}
                    className="h-4 w-4 rounded text-teal-600 accent-teal-600"
                  />
                  <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>تطبيق هذا التوقيع على جميع صفحات المستند</span>
                </label>
              </div>
            </div>

            {/* Stage Preview with interactive signature placement */}
            <div className="mt-5 text-center">
              <div className="mb-2 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Move className="h-3.5 w-3.5 text-teal-600" />
                <span>اضغط أو اسحب بالماوس فوق المعاينة لوضع التوقيع في المكان المطلوب:</span>
              </div>

              <div
                ref={stageContainerRef}
                onPointerDown={handleStagePointerDown}
                onPointerMove={handleStagePointerMove}
                onPointerUp={handleStagePointerUp}
                className="relative mx-auto inline-block cursor-crosshair overflow-hidden rounded-lg border-2 border-slate-300 bg-white shadow-md dark:border-slate-700"
              >
                <canvas ref={pageCanvasRef} className="block max-w-full" />

                {/* Placed signature overlay */}
                {signatureDataUrl && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${sigPos.x * 100}%`,
                      top: `${sigPos.y * 100}%`,
                      width: `${sigScalePercent}%`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                    }}
                    className="rounded border border-teal-500/80 bg-teal-500/10 p-0.5 shadow-sm"
                  >
                    <img src={signatureDataUrl} alt="Placed Signature" className="w-full" />
                    <div className="absolute -top-5 right-0 rounded bg-teal-700 px-1 py-0.5 text-[9px] font-bold text-white shadow">
                      مكان التوقيع
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Execute Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                id="btn-execute-sign"
                onClick={handleSignPdf}
                disabled={!signatureDataUrl}
                className="flex h-13 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 text-base font-bold text-white shadow-lg shadow-teal-500/25 transition hover:opacity-95 disabled:opacity-50"
              >
                <Check className="h-5 w-5" />
                <span>تطبيق التوقيع وحفظ الـ PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
