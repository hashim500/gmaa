import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  EyeOff,
  Undo2,
  Trash2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Lock,
  Layers,
  HelpCircle,
  Tag,
  Highlighter,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Pipette,
  Palette,
  Crosshair,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { pdfjsLib } from '../../utils/pdfWorker';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult, RedactEffectType, RedactBoxItem } from '../../types';
import { FileUploader } from '../FileUploader';
import { LoadedFileBar } from '../LoadedFileBar';

interface RedactToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (percent: number, message: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const RedactTool: React.FC<RedactToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.25);

  // Redaction settings
  const [activeEffect, setActiveEffect] = useState<RedactEffectType>('black');
  const [customLabel, setCustomLabel] = useState<string>('[محجوب]');
  const [highlightColor, setHighlightColor] = useState<string>('yellow');
  const [customColor, setCustomColor] = useState<string>('#FFFFFF');
  const [customOpacity, setCustomOpacity] = useState<number>(1.0);

  // Eyedropper / Color Picker Mode
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);
  const [hoverLoupe, setHoverLoupe] = useState<{
    clientX: number;
    clientY: number;
    hex: string;
    r: number;
    g: number;
    b: number;
  } | null>(null);
  const [eyedropperSuccessToast, setEyedropperSuccessToast] = useState<string | null>(null);
  const [hasNativeEyeDropper, setHasNativeEyeDropper] = useState<boolean>(false);

  // Redaction storage by page: { [pageNum: number]: RedactBoxItem[] }
  const [redactions, setRedactions] = useState<Record<number, RedactBoxItem[]>>({});
  const [historyStack, setHistoryStack] = useState<Record<number, RedactBoxItem[]>[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const pageCanvasesRef = useRef<Record<number, HTMLCanvasElement>>({});

  // Clean state when file changes
  useEffect(() => {
    if (!file) {
      pdfDocRef.current = null;
      pageCanvasesRef.current = {};
      setTotalPages(1);
      setCurrentPage(1);
      setRedactions({});
      setHistoryStack([]);
      setHistoryIndex(-1);
      return;
    }

    let isMounted = true;
    setIsLoadingPdf(true);

    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        setRedactions({});
        setHistoryStack([{}]);
        setHistoryIndex(0);
        pageCanvasesRef.current = {};

        // Render page 1 immediately
        await renderPageToCache(pdf, 1, zoomScale);
        if (isMounted) {
          drawCurrentPage();
        }
      } catch (err) {
        console.error('Failed to load PDF:', err);
        onError('تعذر قراءة ملف الـ PDF. تأكد من أن الملف سليم وغير محمي بكلمة مرور.');
      } finally {
        if (isMounted) setIsLoadingPdf(false);
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Re-render when page, zoom, or redactions change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      setHasNativeEyeDropper(true);
    }
  }, []);

  useEffect(() => {
    if (eyedropperSuccessToast) {
      const timer = setTimeout(() => setEyedropperSuccessToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [eyedropperSuccessToast]);

  // Keyboard shortcuts (Escape to cancel eyedropper, Ctrl+Z to undo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEyedropperActive) {
          setIsEyedropperActive(false);
          setHoverLoupe(null);
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEyedropperActive, historyIndex, historyStack]);

  useEffect(() => {
    if (!pdfDocRef.current || isLoadingPdf) return;

    let isCancelled = false;
    const updateView = async () => {
      const pdf = pdfDocRef.current;
      await renderPageToCache(pdf, currentPage, zoomScale);
      if (!isCancelled) {
        drawCurrentPage();
      }
    };

    updateView();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, zoomScale, redactions, hoveredBoxId]);

  // Render a specific page from PDF to an off-screen canvas cache
  const renderPageToCache = async (pdf: any, pageNum: number, scale: number) => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = Math.max(1, Math.floor(viewport.width));
      tempCanvas.height = Math.max(1, Math.floor(viewport.height));
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return;

      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';

      await page.render({ canvasContext: tempCtx, viewport, canvas: tempCanvas } as any).promise;
      pageCanvasesRef.current[pageNum] = tempCanvas;
    } catch (e) {
      console.error('Error rendering page:', e);
    }
  };

  // Redraw the main canvas: Base PDF image + All saved redactions + Current dragging box preview
  const drawCurrentPage = (customDragBox?: { x: number; y: number; width: number; height: number }) => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const baseCanvas = pageCanvasesRef.current[currentPage];
    if (!baseCanvas) return;

    // Set canvas dimensions to match base canvas
    if (mainCanvas.width !== baseCanvas.width || mainCanvas.height !== baseCanvas.height) {
      mainCanvas.width = baseCanvas.width;
      mainCanvas.height = baseCanvas.height;
    }

    // 1. Draw base page
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.drawImage(baseCanvas, 0, 0);

    // 2. Draw all existing redactions on this page
    const pageReds = redactions[currentPage] || [];
    for (const item of pageReds) {
      drawRedactionBox(ctx, item.type, item.x, item.y, item.width, item.height, {
        labelText: item.labelText,
        highlightColor: item.highlightColor,
        customColor: item.customColor,
        isInteractivePreview: true,
        isHovered: hoveredBoxId === item.id,
      });
    }

    // 3. Draw live drag preview if active
    if (customDragBox) {
      drawRedactionBox(
        ctx,
        activeEffect,
        customDragBox.x,
        customDragBox.y,
        customDragBox.width,
        customDragBox.height,
        {
          labelText: customLabel,
          highlightColor,
          customColor,
          customOpacity,
          isInteractivePreview: true,
        }
      );
    }
  };

  // Draw an individual redaction effect on canvas
  const drawRedactionBox = (
    ctx: CanvasRenderingContext2D,
    type: RedactEffectType,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: {
      labelText?: string;
      highlightColor?: string;
      customColor?: string;
      customOpacity?: number;
      isInteractivePreview?: boolean;
      isHovered?: boolean;
    }
  ) => {
    ctx.save();
    const label = options?.labelText || '[محجوب]';

    if (type === 'black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, width, height);
    } else if (type === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, width, height);
      if (options?.isInteractivePreview) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x, y, width, height);
      }
    } else if (type === 'custom') {
      const color = options?.customColor || '#ffffff';
      const opacity = options?.customOpacity ?? 1.0;
      if (opacity < 1.0) {
        ctx.globalAlpha = opacity;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      if (options?.isInteractivePreview) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x, y, width, height);
      }
    } else if (type === 'blur') {
      // Pixelate / mosaic effect
      if (width > 4 && height > 4) {
        try {
          const blockSize = Math.max(6, Math.floor(Math.min(width, height) / 8));
          const imgData = ctx.getImageData(x, y, width, height);
          const data = imgData.data;
          const w = imgData.width;
          const h = imgData.height;

          for (let py = 0; py < h; py += blockSize) {
            for (let px = 0; px < w; px += blockSize) {
              const sampleX = Math.min(px + Math.floor(blockSize / 2), w - 1);
              const sampleY = Math.min(py + Math.floor(blockSize / 2), h - 1);
              const idx = (sampleY * w + sampleX) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];

              for (let by = 0; by < blockSize && py + by < h; by++) {
                for (let bx = 0; bx < blockSize && px + bx < w; bx++) {
                  const bIdx = ((py + by) * w + (px + bx)) * 4;
                  data[bIdx] = r;
                  data[bIdx + 1] = g;
                  data[bIdx + 2] = b;
                }
              }
            }
          }
          ctx.putImageData(imgData, x, y);
        } catch {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(x, y, width, height);
        }
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x, y, width, height);
      }
      if (options?.isInteractivePreview) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
      }
    } else if (type === 'label') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#ffffff';
      const textHeight = Math.max(11, Math.min(height * 0.65, 22));
      ctx.font = `bold ${textHeight}px 'Cairo', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + width / 2, y + height / 2, Math.max(10, width - 8));
    } else if (type === 'transparent') {
      const color = options?.highlightColor || 'yellow';
      let fill = 'rgba(253, 224, 71, 0.45)';
      let stroke = 'rgba(234, 179, 8, 0.65)';
      if (color === 'green') {
        fill = 'rgba(74, 222, 128, 0.45)';
        stroke = 'rgba(34, 197, 94, 0.65)';
      } else if (color === 'pink') {
        fill = 'rgba(244, 114, 182, 0.45)';
        stroke = 'rgba(236, 72, 153, 0.65)';
      } else if (color === 'blue') {
        fill = 'rgba(96, 165, 250, 0.45)';
        stroke = 'rgba(59, 130, 246, 0.65)';
      }
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
    } else if (type === 'strike') {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = Math.max(2.5, Math.min(height * 0.4, 6));
      ctx.beginPath();
      ctx.moveTo(x, y + height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.stroke();
    } else if (type === 'red') {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x, y, width, height);
    }

    // Highlight outline if hovered in list
    if (options?.isHovered) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    }

    ctx.restore();
  };

  // Convert mouse/touch event to canvas coordinates
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getTouchCoords = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return { x: 0, y: 0 };
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  // Mouse / Touch handlers for drawing
  const handleStartDraw = (x: number, y: number) => {
    setIsDrawing(true);
    setDragStart({ x, y });
    setDragCurrent({ x, y });
  };

  const handleMoveDraw = (x: number, y: number) => {
    if (!isDrawing || !dragStart) return;
    setDragCurrent({ x, y });

    const boxX = Math.min(dragStart.x, x);
    const boxY = Math.min(dragStart.y, y);
    const boxWidth = Math.abs(x - dragStart.x);
    const boxHeight = Math.abs(y - dragStart.y);

    drawCurrentPage({ x: boxX, y: boxY, width: boxWidth, height: boxHeight });
  };

  const handleEndDraw = (x: number, y: number) => {
    if (!isDrawing || !dragStart) return;
    setIsDrawing(false);

    const boxX = Math.min(dragStart.x, x);
    const boxY = Math.min(dragStart.y, y);
    const boxWidth = Math.abs(x - dragStart.x);
    const boxHeight = Math.abs(y - dragStart.y);

    setDragStart(null);
    setDragCurrent(null);

    // Minimum size to prevent accidental clicks
    if (boxWidth > 6 && boxHeight > 6) {
      const newItem: RedactBoxItem = {
        id: `red_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        pageNumber: currentPage,
        x: Math.round(boxX),
        y: Math.round(boxY),
        width: Math.round(boxWidth),
        height: Math.round(boxHeight),
        type: activeEffect,
        labelText: customLabel,
        highlightColor,
        customColor: activeEffect === 'custom' ? customColor : undefined,
      };

      const updated = {
        ...redactions,
        [currentPage]: [...(redactions[currentPage] || []), newItem],
      };
      setRedactions(updated);
      pushHistory(updated);
    } else {
      drawCurrentPage();
    }
  };

  // Eyedropper sampling functions
  const sampleColorAtCoords = (canvasX: number, canvasY: number): string | null => {
    const pageCanvas = pageCanvasesRef.current[currentPage];
    if (!pageCanvas) return null;
    const pCtx = pageCanvas.getContext('2d', { willReadFrequently: true });
    if (!pCtx) return null;
    const clampedX = Math.max(0, Math.min(Math.floor(canvasX), pageCanvas.width - 1));
    const clampedY = Math.max(0, Math.min(Math.floor(canvasY), pageCanvas.height - 1));
    const pixel = pCtx.getImageData(clampedX, clampedY, 1, 1).data;
    return (
      '#' +
      ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  };

  const handleNativeEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const res = await eyeDropper.open();
        if (res && res.sRGBHex) {
          const hex = res.sRGBHex.toUpperCase();
          setCustomColor(hex);
          setActiveEffect('custom');
          setEyedropperSuccessToast(hex);
        }
      } catch {
        // User cancelled or closed
      }
    } else {
      setIsEyedropperActive(true);
    }
  };

  const toggleEyedropper = () => {
    setIsEyedropperActive((prev) => !prev);
    setHoverLoupe(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (isEyedropperActive) {
      const hex = sampleColorAtCoords(x, y);
      if (hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        setHoverLoupe({
          clientX: e.clientX,
          clientY: e.clientY,
          hex,
          r,
          g,
          b,
        });
      }
      return;
    }

    handleMoveDraw(x, y);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (isEyedropperActive) {
      const hex = sampleColorAtCoords(x, y);
      if (hex) {
        setCustomColor(hex);
        setActiveEffect('custom');
        setIsEyedropperActive(false);
        setHoverLoupe(null);
        setEyedropperSuccessToast(hex);
      }
      return;
    }

    handleStartDraw(x, y);
  };

  // Undo / History Management
  const pushHistory = (newState: Record<number, RedactBoxItem[]>) => {
    const nextHistory = historyStack.slice(0, historyIndex + 1);
    nextHistory.push(newState);
    setHistoryStack(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setRedactions(historyStack[prevIndex]);
    }
  };

  // Delete individual redaction
  const handleDeleteRedaction = (id: string) => {
    const currentList = redactions[currentPage] || [];
    const updatedList = currentList.filter((item) => item.id !== id);
    const updated = {
      ...redactions,
      [currentPage]: updatedList,
    };
    setRedactions(updated);
    pushHistory(updated);
  };

  // Clear current page
  const handleClearCurrentPage = () => {
    const updated = {
      ...redactions,
      [currentPage]: [],
    };
    setRedactions(updated);
    pushHistory(updated);
  };

  // Clear all pages
  const handleClearAllPages = () => {
    setRedactions({});
    pushHistory({});
  };

  // Preset: Full width text line redaction
  const handleAddFullLinePreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = Math.round(canvas.width * 0.88);
    const height = Math.round(canvas.height * 0.035);
    const x = Math.round((canvas.width - width) / 2);
    const y = Math.round(canvas.height * 0.4);

    const newItem: RedactBoxItem = {
      id: `red_${Date.now()}`,
      pageNumber: currentPage,
      x,
      y,
      width,
      height,
      type: activeEffect,
      labelText: customLabel,
      highlightColor,
    };

    const updated = {
      ...redactions,
      [currentPage]: [...(redactions[currentPage] || []), newItem],
    };
    setRedactions(updated);
    pushHistory(updated);
  };

  // Preset: Signature block redaction
  const handleAddSignaturePreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = Math.round(canvas.width * 0.35);
    const height = Math.round(canvas.height * 0.09);
    const x = Math.round(canvas.width * 0.55);
    const y = Math.round(canvas.height * 0.75);

    const newItem: RedactBoxItem = {
      id: `red_${Date.now()}`,
      pageNumber: currentPage,
      x,
      y,
      width,
      height,
      type: activeEffect,
      labelText: customLabel,
      highlightColor,
    };

    const updated = {
      ...redactions,
      [currentPage]: [...(redactions[currentPage] || []), newItem],
    };
    setRedactions(updated);
    pushHistory(updated);
  };

  // Total redactions in entire document
  const totalDocRedactions: number = Object.values(redactions).reduce<number>(
    (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
    0
  );
  const currentPageRedactions = redactions[currentPage] || [];

  // Export redacted PDF
  const handleExportPdf = async () => {
    if (!file || !pdfDocRef.current) return;
    setIsExporting(true);
    setExportProgress(10);
    onProgress(10, 'جاري معالجة الصفحات وإخفاء البيانات الحساسة بدقة عالية...');

    try {
      const pdf = pdfDocRef.current;
      const newPdfDoc = await PDFDocument.create();
      const exportScale = 1.85; // High resolution ~140-160 DPI output

      for (let p = 1; p <= totalPages; p++) {
        const percent = Math.round(10 + (p / totalPages) * 78);
        setExportProgress(percent);
        onProgress(percent, `تطبيق الحجب وتشفير الصفحة ${p} من ${totalPages}...`);

        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: exportScale });

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = Math.max(1, Math.floor(viewport.width));
        exportCanvas.height = Math.max(1, Math.floor(viewport.height));
        const exportCtx = exportCanvas.getContext('2d', { willReadFrequently: true });
        if (!exportCtx) continue;

        // White background to prevent any dark transparent artifacts
        exportCtx.fillStyle = '#ffffff';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';

        await page.render({ canvasContext: exportCtx, viewport, canvas: exportCanvas } as any).promise;

        // Draw all redactions for this page
        const pageReds = redactions[p] || [];
        if (pageReds.length > 0) {
          const previewCanvas = pageCanvasesRef.current[p];
          const coordScaleX = previewCanvas ? exportCanvas.width / previewCanvas.width : 1;
          const coordScaleY = previewCanvas ? exportCanvas.height / previewCanvas.height : 1;

          for (const red of pageReds) {
            drawRedactionBox(
              exportCtx,
              red.type,
              red.x * coordScaleX,
              red.y * coordScaleY,
              red.width * coordScaleX,
              red.height * coordScaleY,
              {
                labelText: red.labelText,
                highlightColor: red.highlightColor,
                customColor: red.customColor,
                isInteractivePreview: false,
              }
            );
          }
        }

        const imgDataUrl = exportCanvas.toDataURL('image/jpeg', 0.94);
        const base64Data = imgDataUrl.split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const embeddedImg = await newPdfDoc.embedJpg(bytes);
        const originalWidth = viewport.width / exportScale;
        const originalHeight = viewport.height / exportScale;

        const newPage = newPdfDoc.addPage([originalWidth, originalHeight]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: originalWidth,
          height: originalHeight,
        });
      }

      onProgress(95, 'جاري تجميع وحفظ المستند النهائي...');
      const finalBytes = await newPdfDoc.save();
      const finalBlob = new Blob([finalBytes], { type: 'application/pdf' });
      const outputName = file.name.replace(/\.pdf$/i, '') + '-redacted.pdf';

      onProgress(100, 'تم إنشاء ملف PDF بنجاح!');
      onComplete({
        blob: finalBlob,
        filename: outputName,
        originalSize: file.size,
        newSize: finalBlob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error('Export error:', err);
      onError('حدث خطأ أثناء تصدير ملف الـ PDF. يرجى إعادة المحاولة.');
    } finally {
      setIsExporting(false);
    }
  };

  const tRedact = t.tools.redact || {
    title: 'طمس وحجب بيانات PDF',
    desc: 'إخفاء وطمس البيانات الحساسة أو تشويهها في صفحات الـ PDF بطمس أسود، أبيض، ضبابي، أو شطب وتظليل.',
    badge: 'أمان وخصوصية',
    blackout: 'طامس أسود معتم',
    whiteout: 'طامس أبيض',
    blur: 'طمس ضبابي (بيكسل)',
    labeled: 'شريط [محجوب]',
    highlight: 'تظليل شفاف',
    strike: 'شطب أحمر للنص',
    redAlert: 'طامس أحمر أمني',
    clearPage: 'مسح تعديلات الصفحة',
    clearAll: 'مسح جميع الصفحات',
    undo: 'تراجع',
    downloadRedacted: 'تنزيل PDF بعد الحجب',
    activeRedactions: 'العناصر المحجوبة بالصفحة',
    noRedactionsOnPage: 'لا توجد عناصر محجوبة في هذه الصفحة بعد',
    redactionsCount: 'عنصر محجوب',
    dragTip: 'اسحب بالمؤشر فوق النص أو الصورة لتطبيق الحجب المحدد.',
    linePreset: 'سطر كامل',
    signaturePreset: 'مربع توقيع',
    customLabelPlaceholder: 'النص المكتوب (مثال: [سري])',
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Header with Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="group mb-2 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>{t.backToTools}</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {tRedact.title}
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {tRedact.badge}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {tRedact.desc}
          </p>
        </div>

        {file && (
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            <span>{isExporting ? 'جاري التصدير...' : tRedact.downloadRedacted}</span>
          </button>
        )}
      </div>

      {/* 2. File Uploader or Loaded File Info */}
      {!file ? (
        <FileUploader
          accept=".pdf"
          multiple={false}
          onFilesSelected={(files) => {
            if (files.length > 0) setFile(files[0]);
          }}
          title="اختر ملف PDF لتطبيق الحجب وإخفاء البيانات"
          subtitle="يدعم جميع ملفات ومستندات الـ PDF مع معالجة محلية 100% بدون رفع للإنترنت"
          t={t}
        />
      ) : (
        <LoadedFileBar
          file={file}
          pageCount={totalPages}
          onReplace={() => setFile(null)}
          onDownload={() => handleExportPdf()}
          t={t}
          showDownloadBtn={true}
        />
      )}

      {/* 3. Editor Viewport */}
      {file && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Effect Types Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ms-1">
                  نوع الحجب:
                </span>

                {/* 1. Blackout */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('black')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'black'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className="h-3 w-3 rounded-xs bg-black border border-slate-400" />
                  <span>{tRedact.blackout}</span>
                </button>

                {/* 2. Whiteout */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('white')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'white'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className="h-3 w-3 rounded-xs bg-white border border-slate-400" />
                  <span>{tRedact.whiteout}</span>
                </button>

                {/* 3. Blur / Pixelate */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('blur')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'blur'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{tRedact.blur}</span>
                </button>

                {/* 4. Labeled Box */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('label')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'label'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Tag className="h-3.5 w-3.5 text-amber-500" />
                  <span>{tRedact.labeled}</span>
                </button>

                {/* 5. Highlight */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('transparent')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'transparent'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Highlighter className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{tRedact.highlight}</span>
                </button>

                {/* 6. Strike */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('strike')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'strike'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Minus className="h-3.5 w-3.5 text-red-500" />
                  <span>{tRedact.strike}</span>
                </button>

                {/* 7. Red Alert */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('red')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'red'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className="h-3 w-3 rounded-xs bg-red-600" />
                  <span>{tRedact.redAlert}</span>
                </button>

                {/* 8. Custom / Paper Match Color */}
                <button
                  type="button"
                  onClick={() => setActiveEffect('custom')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeEffect === 'custom'
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold ring-2 ring-emerald-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-slate-400 shadow-xs"
                    style={{ backgroundColor: customColor }}
                  />
                  <span>{tRedact.customColor || 'طامس بلون مخصص'}</span>
                </button>
              </div>

              {/* Action Buttons: Presets, Undo, Clear */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Presets */}
                <button
                  type="button"
                  onClick={handleAddFullLinePreset}
                  title="حجب سطر كامل في منتصف الصفحة"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tRedact.linePreset}
                </button>

                <button
                  type="button"
                  onClick={handleAddSignaturePreset}
                  title="حجب مربع توقيع"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tRedact.signaturePreset}
                </button>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

                {/* Undo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title={tRedact.undo}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  <span>{tRedact.undo}</span>
                </button>

                {/* Clear Page */}
                <button
                  type="button"
                  onClick={handleClearCurrentPage}
                  disabled={currentPageRedactions.length === 0}
                  title={tRedact.clearPage}
                  className="flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-40 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{tRedact.clearPage}</span>
                </button>
              </div>
            </div>

            {/* Context Sub-Bar (When label or highlight is active) */}
            {activeEffect === 'label' && (
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  نص الشريط المحجوب:
                </span>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder={tRedact.customLabelPlaceholder}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
                <div className="flex gap-1">
                  {['[محجوب]', '[سري للغاية]', '[CONFIDENTIAL]', '[مستند معتمد]'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomLabel(preset)}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeEffect === 'transparent' && (
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  لون التظليل:
                </span>
                {[
                  { id: 'yellow', label: 'أصفر', bg: 'bg-yellow-400' },
                  { id: 'green', label: 'أخضر', bg: 'bg-emerald-400' },
                  { id: 'pink', label: 'وردي', bg: 'bg-pink-400' },
                  { id: 'blue', label: 'أزرق', bg: 'bg-blue-400' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setHighlightColor(c.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition ${
                      highlightColor === c.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${c.bg}`} />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Context Sub-Bar (When custom effect is active) */}
            {activeEffect === 'custom' && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Eyedropper Trigger Button */}
                  <button
                    type="button"
                    onClick={toggleEyedropper}
                    title={tRedact.eyedropperTip || 'انقر على المستند لاقتباس لون الورقة أو الخلفية'}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                      isEyedropperActive
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 animate-pulse'
                        : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-300'
                    }`}
                  >
                    <Pipette
                      className={`h-3.5 w-3.5 ${
                        isEyedropperActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    />
                    <span>
                      {isEyedropperActive
                        ? tRedact.eyedropperActive || 'جاري التقاط اللون... (انقر على الورقة)'
                        : tRedact.eyedropper || 'قطارة الألوان (من المستند)'}
                    </span>
                  </button>

                  {/* Native Screen Eyedropper if browser supports it */}
                  {hasNativeEyeDropper && (
                    <button
                      type="button"
                      onClick={handleNativeEyeDropper}
                      title="التقاط لون من أي نافذة على الشاشة"
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Crosshair className="h-3.5 w-3.5 text-sky-500" />
                      <span>قطارة الشاشة</span>
                    </button>
                  )}

                  {/* Native HTML Color Input + Hex badge */}
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
                    <label
                      htmlFor="custom-redact-color"
                      className="cursor-pointer flex items-center gap-1.5"
                    >
                      <input
                        id="custom-redact-color"
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value.toUpperCase())}
                        className="h-5 w-5 cursor-pointer rounded-xs border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                        {customColor}
                      </span>
                    </label>
                  </div>

                  {/* Document Paper Color Presets */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">ورق جاهز:</span>
                    {[
                      { hex: '#FFFFFF', name: 'أبيض ناصع' },
                      { hex: '#FAF9F6', name: 'أوف وايت' },
                      { hex: '#FEFCE8', name: 'عاجي' },
                      { hex: '#FEF3C7', name: 'بيج فاتح' },
                      { hex: '#F1F5F9', name: 'رمادي مستند' },
                      { hex: '#F5F5F4', name: 'ورق صحف' },
                      { hex: '#0F172A', name: 'كحلي داكن' },
                      { hex: '#DC2626', name: 'أحمر' },
                    ].map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setCustomColor(preset.hex)}
                        title={`${preset.name} (${preset.hex})`}
                        className={`h-4.5 w-4.5 rounded-sm border transition ${
                          customColor.toUpperCase() === preset.hex
                            ? 'ring-2 ring-emerald-500 scale-110'
                            : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Opacity switch */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {tRedact.opacity || 'الكثافة'}:
                  </span>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setCustomOpacity(1.0)}
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold transition ${
                        customOpacity === 1.0
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      معتم 100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomOpacity(0.5)}
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold transition ${
                        customOpacity === 0.5
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                      }`}
                    >
                      تظليل 50%
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Viewport + Side Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Canvas Area (3 cols) */}
            <div className="lg:col-span-3 flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              {/* Top Viewport Nav */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                {/* Page Navigation */}
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ChevronRight className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>

                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.page} {currentPage} {t.of} {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>

                {/* Tip */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{tRedact.dragTip}</span>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setZoomScale((z) => Math.max(0.75, Number((z - 0.2).toFixed(2))))}
                    title="تصغير"
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>

                  <span className="min-w-[42px] text-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {Math.round(zoomScale * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setZoomScale((z) => Math.min(2.2, Number((z + 0.2).toFixed(2))))}
                    title="تكبير"
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoomScale(1.25)}
                    title="إعادة ضبط الحجم"
                    className="ms-1 flex h-6 px-1.5 items-center justify-center rounded text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* Eyedropper Active Alert Banner */}
              {isEyedropperActive && (
                <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-emerald-900 shadow-xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <Pipette className="h-4 w-4 text-emerald-600 animate-bounce" />
                    <span className="text-xs font-bold sm:text-sm">
                      {tRedact.eyedropperActiveTip ||
                        'وضع قطارة الألوان مفعّل: انقر على أي نقطة داخل صفحة الـ PDF لاقتباس لونها ومطابقة خلفية الورقة'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEyedropperActive(false);
                      setHoverLoupe(null);
                    }}
                    className="rounded-lg bg-emerald-200/80 px-2.5 py-1 text-xs font-bold text-emerald-900 hover:bg-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:hover:bg-emerald-800"
                  >
                    إلغاء (Esc)
                  </button>
                </div>
              )}

              {/* PDF Canvas Viewport with Crosshair cursor */}
              <div className="flex-1 flex justify-center items-center overflow-auto rounded-xl bg-slate-900/5 p-4 dark:bg-slate-950/40 min-h-[460px]">
                {isLoadingPdf ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-3" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      جاري فحص وتجهيز صفحات المستند...
                    </p>
                  </div>
                ) : (
                  <div className="relative inline-block shadow-lg rounded-sm overflow-hidden bg-white select-none">
                    <canvas
                      ref={canvasRef}
                      className="block cursor-crosshair touch-none"
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={(e) => {
                        const { x, y } = getCanvasCoords(e);
                        handleEndDraw(x, y);
                      }}
                      onMouseLeave={(e) => {
                        if (isEyedropperActive) {
                          setHoverLoupe(null);
                        }
                        if (isDrawing) {
                          const { x, y } = getCanvasCoords(e);
                          handleEndDraw(x, y);
                        }
                      }}
                      onTouchStart={(e) => {
                        const { x, y } = getTouchCoords(e);
                        if (isEyedropperActive) {
                          const hex = sampleColorAtCoords(x, y);
                          if (hex) {
                            setCustomColor(hex);
                            setActiveEffect('custom');
                            setIsEyedropperActive(false);
                            setHoverLoupe(null);
                            setEyedropperSuccessToast(hex);
                          }
                          return;
                        }
                        handleStartDraw(x, y);
                      }}
                      onTouchMove={(e) => {
                        const { x, y } = getTouchCoords(e);
                        handleMoveDraw(x, y);
                      }}
                      onTouchEnd={(e) => {
                        if (dragCurrent) {
                          handleEndDraw(dragCurrent.x, dragCurrent.y);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Floating Magnifier / Loupe when eyedropper is moving over canvas */}
              {isEyedropperActive && hoverLoupe && (
                <div
                  className="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-full flex-col items-center pb-3 transition-transform"
                  style={{ left: hoverLoupe.clientX, top: hoverLoupe.clientY }}
                >
                  <div className="flex items-center gap-2 rounded-full border-2 border-white bg-slate-900/95 px-3 py-1.5 text-white shadow-2xl backdrop-blur-md">
                    <span
                      className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-800"
                      style={{ backgroundColor: hoverLoupe.hex }}
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold leading-tight">
                        {hoverLoupe.hex}
                      </span>
                      <span className="text-[9px] text-slate-300 leading-none">انقر للاقتباس</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-white bg-slate-900/95 -mt-1.5" />
                </div>
              )}

              {/* Success Notification Toast when color is sampled */}
              {eyedropperSuccessToast && (
                <div className="fixed bottom-6 end-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-white/95 px-4 py-2.5 text-slate-800 shadow-xl backdrop-blur-md dark:border-emerald-700 dark:bg-slate-900/95 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
                  <span
                    className="h-4 w-4 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: eyedropperSuccessToast }}
                  />
                  <span className="text-xs font-semibold">
                    تم اقتباس اللون{' '}
                    <strong className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {eyedropperSuccessToast}
                    </strong>{' '}
                    من المستند بنجاح ومطابقة الطامس!
                  </span>
                </div>
              )}

              {/* Page Thumbnails Bar at Bottom */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0 px-1">
                    الصفحات:
                  </span>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                    const countOnPage = (redactions[pNum] || []).length;
                    const isCurrent = currentPage === pNum;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => setCurrentPage(pNum)}
                        className={`relative shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          isCurrent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <span>{pNum}</span>
                        {countOnPage > 0 && (
                          <span
                            className={`ms-1.5 rounded-full px-1.5 py-0.2 text-[9px] font-black ${
                              isCurrent
                                ? 'bg-white text-emerald-800'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {countOnPage}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Side Panel: Active Redactions & Statistics (1 col) */}
            <div className="flex flex-col gap-4">
              {/* Document Summary Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  إحصائيات الأمان والحجب
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>إجمالي العناصر المحجوبة:</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-bold text-slate-900 dark:bg-slate-800 dark:text-white">
                      {totalDocRedactions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>في الصفحة الحالية ({currentPage}):</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {currentPageRedactions.length}
                    </span>
                  </div>
                </div>

                {totalDocRedactions > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllPages}
                    className="mt-3 w-full rounded-xl border border-rose-200/80 bg-rose-50/50 py-1.5 text-center text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    {tRedact.clearAll}
                  </button>
                )}
              </div>

              {/* Active Redactions on Current Page */}
              <div className="flex-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{tRedact.activeRedactions}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">
                    ({currentPageRedactions.length})
                  </span>
                </div>

                {currentPageRedactions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-2 dark:bg-slate-800">
                      <EyeOff className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {tRedact.noRedactionsOnPage}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      اسحب بمؤشر الفأرة فوق أي نص أو صورة لإخفائها فوراً.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[380px] pe-1">
                    {currentPageRedactions.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredBoxId(item.id)}
                          onMouseLeave={() => setHoveredBoxId(null)}
                          className={`flex items-center justify-between gap-2 rounded-xl p-2.5 text-xs transition border ${
                            hoveredBoxId === item.id
                              ? 'border-cyan-400 bg-cyan-50/70 dark:border-cyan-700 dark:bg-cyan-950/40'
                              : 'border-slate-200/70 bg-slate-50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-black text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-800 dark:text-slate-200">
                                {item.type === 'black' && 'طامس أسود'}
                                {item.type === 'white' && 'طامس أبيض'}
                                {item.type === 'blur' && 'تشويش بيكسل'}
                                {item.type === 'label' && `شريط: ${item.labelText || '[محجوب]'}`}
                                {item.type === 'transparent' && 'تظليل ملون'}
                                {item.type === 'strike' && 'شطب أحمر'}
                                {item.type === 'red' && 'طامس أحمر'}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {item.width} × {item.height} بكسل
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteRedaction(item.id)}
                            title="حذف هذا العنصر"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Security Notice */}
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-3 text-[11px] font-medium text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>تشفير دائم لا يمكن التراجع عنه</span>
                </div>
                <p className="text-[10px] opacity-80 leading-relaxed">
                  يتم دمج التظليلات وطمس البكسلات داخل المستند بشكل نهائي لمنع استخراج أي نصوص أو بيانات حساسة تحتها.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
