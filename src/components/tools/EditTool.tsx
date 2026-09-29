import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Type,
  Image as ImageIcon,
  Upload,
  PenTool,
  Highlighter,
  Square,
  EyeOff,
  Undo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Move,
  Bold,
  Sparkles,
  Edit2,
  Save,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult, AnnotationItem } from '../../types';
import { FileUploader } from '../FileUploader';
import { LoadedFileBar } from '../LoadedFileBar';
import { getPdfPageCount, renderPageToDataUrl, applyEditorAnnotations } from '../../utils/pdfUtils';

interface EditToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

type EditorMode = 'text' | 'image' | 'draw' | 'highlight' | 'rectangle' | 'redact';

export const EditTool: React.FC<EditToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.2);
  const [pageRotation, setPageRotation] = useState<number>(0);

  // Editor modes & text properties
  const [activeMode, setActiveMode] = useState<EditorMode>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(20);
  const [selectedColor, setSelectedColor] = useState<string>('#0f172a');
  const [textBgColor, setTextBgColor] = useState<string>('transparent');
  const [isBold, setIsBold] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);

  // Selected annotation for editing or dragging
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  const [draggingAnnId, setDraggingAnnId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Stored annotations across pages
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [rectStart, setRectStart] = useState<{ x: number; y: number } | null>(null);

  // Page preview image
  const [pageDataUrl, setPageDataUrl] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const pageImageWrapperRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load page count
  useEffect(() => {
    if (file) {
      getPdfPageCount(file)
        .then((count) => {
          setTotalPages(count);
          setCurrentPage(1);
          setAnnotations([]);
          setSelectedAnnId(null);
        })
        .catch(() => {
          onError(t.errorProcessing);
        });
    } else {
      setTotalPages(1);
      setCurrentPage(1);
      setAnnotations([]);
      setPageDataUrl(null);
    }
  }, [file]);

  // Render current page background
  useEffect(() => {
    if (!file) return;
    let isMounted = true;

    renderPageToDataUrl(file, currentPage, zoomScale, pageRotation).then((res) => {
      if (isMounted) {
        setPageDataUrl(res.dataUrl);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [file, currentPage, zoomScale, pageRotation]);

  // Redraw canvas-based annotations (drawing, rectangle, highlight, redact)
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filter non-text annotations for this page (text is rendered as interactive draggable DOM nodes)
    const pageAnns = annotations.filter(
      (a) => a.pageIndex === currentPage - 1 && a.type !== 'text'
    );

    pageAnns.forEach((ann) => {
      const px = (ann.x / 100) * canvas.width;
      const py = (ann.y / 100) * canvas.height;

      if (ann.type === 'rectangle' || ann.type === 'highlight' || ann.type === 'redact') {
        const w = ((ann.width || 20) / 100) * canvas.width;
        const h = ((ann.height || 5) / 100) * canvas.height;

        if (ann.type === 'highlight') {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
          ctx.fillRect(px, py, w, h);
        } else if (ann.type === 'redact') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(px, py, w, h);
        } else {
          ctx.strokeStyle = ann.color || '#0d9488';
          ctx.lineWidth = 3;
          ctx.strokeRect(px, py, w, h);
        }
      } else if (ann.type === 'drawing' && ann.points && ann.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = ann.color || '#0f172a';
        ctx.lineWidth = ann.lineWidth || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ann.points.forEach((pt, idx) => {
          const ptX = (pt.x / 100) * canvas.width;
          const ptY = (pt.y / 100) * canvas.height;
          if (idx === 0) ctx.moveTo(ptX, ptY);
          else ctx.lineTo(ptX, ptY);
        });
        ctx.stroke();
      }
    });

    // Draw active live drawing path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      currentPath.forEach((pt, idx) => {
        const ptX = (pt.x / 100) * canvas.width;
        const ptY = (pt.y / 100) * canvas.height;
        if (idx === 0) ctx.moveTo(ptX, ptY);
        else ctx.lineTo(ptX, ptY);
      });
      ctx.stroke();
    }
  }, [annotations, currentPage, currentPath, selectedColor, strokeWidth]);

  // Pointer / Touch Handling for non-text drawing
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const wrapper = pageImageWrapperRef.current;
    if (!wrapper) return { x: 0, y: 0 };
    const rect = wrapper.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handleStagePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    // If clicking on existing text node, let the text node handler take precedence
    if ((e.target as HTMLElement).closest('.draggable-text-item')) {
      return;
    }

    const { x, y } = getCanvasCoords(e);

    if (activeMode === 'text') {
      if (textInput.trim()) {
        // Place text at exact clicked coordinate
        addNewTextAnnotation(x, y);
      } else {
        setSelectedAnnId(null);
      }
    } else if (activeMode === 'draw') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (activeMode === 'highlight' || activeMode === 'rectangle' || activeMode === 'redact') {
      setIsDrawing(true);
      setRectStart({ x, y });
    }
  };

  const handleStagePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);

    if (activeMode === 'draw') {
      setCurrentPath((prev) => [...prev, { x, y }]);
    }
  };

  const handleStagePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const { x, y } = getCanvasCoords(e);

    if (activeMode === 'draw' && currentPath.length > 1) {
      const newAnn: AnnotationItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'drawing',
        pageIndex: currentPage - 1,
        points: currentPath,
        color: selectedColor,
        lineWidth: strokeWidth,
        x: currentPath[0].x,
        y: currentPath[0].y,
      };
      setAnnotations([...annotations, newAnn]);
      setCurrentPath([]);
    } else if (
      (activeMode === 'highlight' || activeMode === 'rectangle' || activeMode === 'redact') &&
      rectStart
    ) {
      const left = Math.min(rectStart.x, x);
      const top = Math.min(rectStart.y, y);
      const width = Math.max(3, Math.abs(x - rectStart.x));
      const height = Math.max(2, Math.abs(y - rectStart.y));

      const newAnn: AnnotationItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: activeMode,
        pageIndex: currentPage - 1,
        x: left,
        y: top,
        width,
        height,
        color: selectedColor,
      };
      setAnnotations([...annotations, newAnn]);
      setRectStart(null);
    }
  };

  // Add new text item either via Click on Page or via "Add Text" Button
  const addNewTextAnnotation = (targetX?: number, targetY?: number) => {
    const textToInsert = textInput.trim() || 'نص جديد هنا';
    const posX = targetX !== undefined ? targetX : 40;
    const posY = targetY !== undefined ? targetY : 40;

    const newAnn: AnnotationItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'text',
      pageIndex: currentPage - 1,
      x: posX,
      y: posY,
      text: textToInsert,
      fontSize,
      color: selectedColor,
      backgroundColor: textBgColor,
      isBold,
    };

    setAnnotations([...annotations, newAnn]);
    setSelectedAnnId(newAnn.id);
    setTextInput('');
  };

  // Process image file to annotation with auto canvas PNG conversion and coordinate placement
  const processImageFileToAnnotation = (imgFile: File, dropCoords?: { x: number; y: number }) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        // Convert to standard clean PNG via offscreen canvas for 100% pdf-lib compatibility
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = c.toDataURL('image/png');
          const aspect = img.naturalWidth / img.naturalHeight;
          const widthPercent = 30;
          const heightPercent = widthPercent / aspect;

          const posX = dropCoords ? Math.max(0, Math.min(75, dropCoords.x - widthPercent / 2)) : 35;
          const posY = dropCoords ? Math.max(0, Math.min(75, dropCoords.y - heightPercent / 2)) : 35;

          const newAnn: AnnotationItem = {
            id: Math.random().toString(36).substring(2, 9),
            type: 'image',
            pageIndex: currentPage - 1,
            x: Math.round(posX * 10) / 10,
            y: Math.round(posY * 10) / 10,
            width: widthPercent,
            height: heightPercent,
            imageData: pngDataUrl,
            opacity: 1,
          };

          setAnnotations((prev) => [...prev, newAnn]);
          setSelectedAnnId(newAnn.id);
          setActiveMode('image');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(imgFile);
  };

  // Add new image annotation from file upload
  const handleAddImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    processImageFileToAnnotation(imgFile);
    e.target.value = '';
  };

  // Drop image directly on page
  const handleDropOnPage = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        const { x, y } = getCanvasCoords(e);
        processImageFileToAnnotation(droppedFile, { x, y });
      }
    }
  };

  const updateImageSize = (id: string, deltaPercent: number) => {
    setAnnotations((prev) =>
      prev.map((ann) => {
        if (ann.id !== id) return ann;
        const currentW = ann.width || 30;
        const newW = Math.max(6, Math.min(95, currentW + deltaPercent));
        const aspect = ann.height && ann.width ? ann.width / ann.height : 1;
        const newH = newW / aspect;
        return { ...ann, width: newW, height: newH };
      })
    );
  };

  // --- DRAGGABLE ANNOTATION HANDLERS (MOUSE & TOUCH FOR TEXT & IMAGES) ---
  const handleStartDragAnnotation = (
    e: React.MouseEvent | React.TouchEvent,
    ann: AnnotationItem
  ) => {
    e.stopPropagation();
    setSelectedAnnId(ann.id);
    setDraggingAnnId(ann.id);

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const wrapper = pageImageWrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();

    const currentPxX = (ann.x / 100) * rect.width;
    const currentPxY = (ann.y / 100) * rect.height;

    const mouseOffsetX = clientX - rect.left - currentPxX;
    const mouseOffsetY = clientY - rect.top - currentPxY;

    setDragOffset({ x: mouseOffsetX, y: mouseOffsetY });
  };

  const handleStartDragText = handleStartDragAnnotation;

  // Global window listeners for drag move & up to ensure smooth dragging even if pointer leaves element
  useEffect(() => {
    if (!draggingAnnId) return;

    const handlePointerMoveGlobal = (e: MouseEvent | TouchEvent) => {
      const wrapper = pageImageWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // Calculate new percentage position
      const newPxX = clientX - rect.left - dragOffset.x;
      const newPxY = clientY - rect.top - dragOffset.y;

      const newPercentX = Math.max(0, Math.min(95, (newPxX / rect.width) * 100));
      const newPercentY = Math.max(0, Math.min(95, (newPxY / rect.height) * 100));

      setAnnotations((prev) =>
        prev.map((a) =>
          a.id === draggingAnnId
            ? { ...a, x: Math.round(newPercentX * 10) / 10, y: Math.round(newPercentY * 10) / 10 }
            : a
        )
      );
    };

    const handlePointerUpGlobal = () => {
      setDraggingAnnId(null);
    };

    window.addEventListener('mousemove', handlePointerMoveGlobal);
    window.addEventListener('mouseup', handlePointerUpGlobal);
    window.addEventListener('touchmove', handlePointerMoveGlobal, { passive: false });
    window.addEventListener('touchend', handlePointerUpGlobal);

    return () => {
      window.removeEventListener('mousemove', handlePointerMoveGlobal);
      window.removeEventListener('mouseup', handlePointerUpGlobal);
      window.removeEventListener('touchmove', handlePointerMoveGlobal);
      window.removeEventListener('touchend', handlePointerUpGlobal);
    };
  }, [draggingAnnId, dragOffset]);

  const handleDeleteAnnotation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (selectedAnnId === id) setSelectedAnnId(null);
  };

  const handleUndo = () => {
    const pageAnns = annotations.filter((a) => a.pageIndex === currentPage - 1);
    if (pageAnns.length === 0) return;
    const lastId = pageAnns[pageAnns.length - 1].id;
    setAnnotations(annotations.filter((a) => a.id !== lastId));
    if (selectedAnnId === lastId) setSelectedAnnId(null);
  };

  const handleClearPage = () => {
    setAnnotations(annotations.filter((a) => a.pageIndex !== currentPage - 1));
    setSelectedAnnId(null);
  };

  // Save modified PDF with text & annotations embedded
  const handleSaveEditedPdf = async () => {
    if (!file) return;

    try {
      const bytes = await applyEditorAnnotations(file, annotations, (percent, msg) => {
        onProgress(percent, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_edited.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  const COLOR_OPTIONS = [
    { name: 'dark', hex: '#0f172a', bg: 'bg-slate-900' },
    { name: 'teal', hex: '#0d9488', bg: 'bg-teal-600' },
    { name: 'red', hex: '#ef4444', bg: 'bg-red-500' },
    { name: 'blue', hex: '#2563eb', bg: 'bg-blue-600' },
    { name: 'emerald', hex: '#059669', bg: 'bg-emerald-600' },
    { name: 'yellow', hex: '#eab308', bg: 'bg-yellow-500' },
  ];

  const BG_COLOR_OPTIONS = [
    { name: 'transparent', hex: 'transparent', label: 'شفاف' },
    { name: 'white', hex: '#ffffff', label: 'مستطيل أبيض' },
    { name: 'yellow', hex: '#fef08a', label: 'تظليل أصفر' },
    { name: 'teal', hex: '#ccfbf1', label: 'خلفية هادئة' },
  ];

  const currentPageTextAnnotations = annotations.filter(
    (a) => a.pageIndex === currentPage - 1 && a.type === 'text'
  );

  const currentPageImageAnnotations = annotations.filter(
    (a) => a.pageIndex === currentPage - 1 && a.type === 'image' && a.imageData
  );

  const selectedAnn = annotations.find((a) => a.id === selectedAnnId);

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t.tools.edit.title}
          </h2>
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            {t.tools.edit.badge}
          </span>
        </div>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.edit.title}
          hint={t.tools.edit.desc}
        />
      ) : (
        <div className="space-y-3">
          {/* Loaded File Bar with Replace and Delete file options */}
          <LoadedFileBar
            file={file}
            pageCount={totalPages}
            onReplaceFile={(newFile) => setFile(newFile)}
            onDeleteFile={() => setFile(null)}
            t={t}
          />

          {/* Primary Top Toolbar (Tools Selection & Colors) */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Right Side (in RTL): Tool Modes & Color Controls */}
            <div className="flex flex-col gap-2.5">
              {/* Primary Tool Mode Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  id="tool-mode-text"
                  onClick={() => setActiveMode('text')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeMode === 'text'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Type className="h-4 w-4" />
                  <span>إضافة نصوص حرة</span>
                </button>

                <button
                  type="button"
                  id="tool-mode-image"
                  onClick={() => {
                    setActiveMode('image');
                    imageInputRef.current?.click();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeMode === 'image'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                  title="إضافة صورة وسحبها بالموس أو اللمس لوضعها في المكان المناسب"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>إضافة صورة</span>
                </button>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageFile}
                  className="hidden"
                />

                <button
                  type="button"
                  id="tool-mode-draw"
                  onClick={() => setActiveMode('draw')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeMode === 'draw'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <PenTool className="h-4 w-4" />
                  <span>{t.tools.edit.draw}</span>
                </button>

                <button
                  type="button"
                  id="tool-mode-highlight"
                  onClick={() => setActiveMode('highlight')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeMode === 'highlight'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Highlighter className="h-4 w-4" />
                  <span>{t.tools.edit.highlight}</span>
                </button>

                <button
                  type="button"
                  id="tool-mode-rectangle"
                  onClick={() => setActiveMode('rectangle')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeMode === 'rectangle'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Square className="h-4 w-4" />
                  <span>{t.tools.edit.rectangle}</span>
                </button>

                <button
                  type="button"
                  id="tool-mode-redact"
                  onClick={() => setActiveMode('redact')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeMode === 'redact'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <EyeOff className="h-4 w-4" />
                  <span>{t.tools.edit.redact}</span>
                </button>
              </div>

              {/* Colors, Undo & Clear */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border-s border-slate-200 ps-2 dark:border-slate-800">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.hex);
                        if (selectedAnnId) {
                          setAnnotations((prev) =>
                            prev.map((a) => (a.id === selectedAnnId ? { ...a, color: c.hex } : a))
                          );
                        }
                      }}
                      className={`h-6 w-6 rounded-full ${c.bg} transition ${
                        selectedColor === c.hex
                          ? 'ring-2 ring-teal-500 ring-offset-2'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title={t.tools.edit.undo}
                >
                  <Undo2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClearPage}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title={t.tools.edit.clear}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Left Side (in RTL) - The exact circled location: BIG RED BUTTON (حفظ التعديل) */}
            <div className="flex items-center justify-center lg:justify-end self-center py-1">
              <button
                id="btn-save-edited-pdf"
                type="button"
                onClick={handleSaveEditedPdf}
                className="flex h-12 sm:h-14 items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 px-8 sm:px-10 text-base sm:text-lg font-black text-white shadow-xl shadow-red-600/35 transition-all hover:shadow-2xl hover:shadow-red-600/45 hover:scale-[1.02] active:scale-95 border-2 border-red-500 cursor-pointer"
                title="حفظ التعديل وتنزيل ملف PDF"
              >
                <Save className="h-6 w-6" />
                <span className="whitespace-nowrap">حفظ التعديل</span>
              </button>
            </div>
          </div>

          {/* DEDICATED TEXT EDITOR & INSERTION PANEL (Requirement 3 & 4) */}
          {activeMode === 'text' && (
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50/70 via-white to-teal-50/40 p-3.5 shadow-sm dark:border-teal-900/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-teal-950/20">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white">
                    <Type className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    لوحة تحرير وإدخال النصوص
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                  <Move className="h-3 w-3 text-teal-600" />
                  <span>اسحب أي نص بالماوس أو اللمس لوضعه في مكانه الدقيق</span>
                </div>
              </div>

              {/* Text input with quick insert button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="input-new-pdf-text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNewTextAnnotation();
                      }
                    }}
                    placeholder="اكتب هنا النص المراد إضافته على صفحة الـ PDF..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  id="btn-add-text-to-page"
                  onClick={() => addNewTextAnnotation()}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>إضافة النص إلى الصفحة</span>
                </button>
              </div>

              {/* Text formatting controls: Font Size, Background, Bold */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-teal-100 pt-2.5 text-xs dark:border-teal-900/40">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Font Size Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      حجم الخط:
                    </span>
                    <div className="flex items-center gap-1">
                      {[14, 18, 22, 28, 36].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setFontSize(size);
                            if (selectedAnnId) {
                              setAnnotations((prev) =>
                                prev.map((a) =>
                                  a.id === selectedAnnId ? { ...a, fontSize: size } : a
                                )
                              );
                            }
                          }}
                          className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition ${
                            fontSize === size
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bold toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsBold(!isBold);
                      if (selectedAnnId) {
                        setAnnotations((prev) =>
                          prev.map((a) =>
                            a.id === selectedAnnId ? { ...a, isBold: !a.isBold } : a
                          )
                        );
                      }
                    }}
                    className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-bold transition ${
                      isBold
                        ? 'border-teal-500 bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Bold className="h-3 w-3" />
                    <span>عريض</span>
                  </button>

                  {/* Text Background Box Style */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      خلفية النص:
                    </span>
                    <div className="flex items-center gap-1">
                      {BG_COLOR_OPTIONS.map((bg) => (
                        <button
                          key={bg.name}
                          type="button"
                          onClick={() => {
                            setTextBgColor(bg.hex);
                            if (selectedAnnId) {
                              setAnnotations((prev) =>
                                prev.map((a) =>
                                  a.id === selectedAnnId
                                    ? { ...a, backgroundColor: bg.hex }
                                    : a
                                )
                              );
                            }
                          }}
                          className={`rounded-lg px-2 py-0.5 text-[11px] font-medium transition ${
                            textBgColor === bg.hex
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Placed count */}
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {currentPageTextAnnotations.length > 0 ? (
                    <span className="text-teal-700 dark:text-teal-300">
                      يوجد {currentPageTextAnnotations.length} نصوص على هذه الصفحة
                    </span>
                  ) : (
                    <span>اضغط على الصفحة أو الزر لإدراج نص</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED IMAGE EDITOR & INSERTION PANEL */}
          {activeMode === 'image' && (
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50/70 via-white to-teal-50/40 p-3.5 shadow-sm dark:border-teal-900/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-teal-950/20">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white">
                    <ImageIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    لوحة إضافة والتحكم بالصور
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                  <Move className="h-3 w-3 text-teal-600" />
                  <span>اسحب أي صورة بالفأرة أو اللمس لتحديد موقعها بدقة على الصفحة</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>اختيار صورة لإدراجها بالصفحة</span>
                  </button>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    أو أسقط ملف الصورة مباشرة فوق الصفحة
                  </span>
                </div>

                {selectedAnn && selectedAnn.type === 'image' && (
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">حجم الصورة المحددة:</span>
                    <button
                      type="button"
                      onClick={() => updateImageSize(selectedAnn.id, -5)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 font-bold"
                    >
                      - تصغير
                    </button>
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                      {Math.round(selectedAnn.width || 30)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => updateImageSize(selectedAnn.id, 5)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 font-bold"
                    >
                      + تكبير
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnotation(selectedAnn.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 ms-1"
                      title="حذف الصورة"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub Navigation Bar: Page selector, Zoom, Rotation */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="rounded p-1 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>

              <span className="font-bold">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="rounded p-1 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>

            {/* Zoom & Page Rotate tools */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.min(2.0, z + 0.2))}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                title={t.zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.2))}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                title={t.zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setPageRotation((r) => (r - 90 + 360) % 360)}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                title={t.rotateLeft}
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setPageRotation((r) => (r + 90) % 360)}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                title={t.rotateRight}
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Document Stage */}
          <div
            ref={canvasContainerRef}
            className="flex min-h-[520px] w-full items-center justify-center overflow-auto rounded-2xl border border-slate-200 bg-slate-200/60 p-4 dark:border-slate-800 dark:bg-slate-950"
          >
            {pageDataUrl ? (
              <div
                ref={pageImageWrapperRef}
                className="relative cursor-crosshair rounded-lg bg-white shadow-2xl transition-all dark:bg-slate-900 select-none"
                onMouseDown={handleStagePointerDown}
                onMouseMove={handleStagePointerMove}
                onMouseUp={handleStagePointerUp}
                onTouchStart={handleStagePointerDown}
                onTouchMove={handleStagePointerMove}
                onTouchEnd={handleStagePointerUp}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropOnPage}
              >
                {/* PDF Page Background Image */}
                <img
                  src={pageDataUrl}
                  alt={`Page ${currentPage}`}
                  className="pointer-events-none block max-w-full select-none"
                  draggable={false}
                />

                {/* Overlay Annotation Canvas for drawings and shapes */}
                <canvas
                  ref={drawingCanvasRef}
                  width={800}
                  height={1100}
                  className="absolute inset-0 h-full w-full pointer-events-none"
                />

                {/* INTERACTIVE DRAGGABLE TEXT ANNOTATIONS OVERLAY (Requirement 4) */}
                {currentPageTextAnnotations.map((ann) => {
                  const isSelected = selectedAnnId === ann.id;
                  const isDragging = draggingAnnId === ann.id;

                  return (
                    <div
                      key={ann.id}
                      className={`draggable-text-item absolute z-30 flex flex-col group cursor-move select-none transition-shadow ${
                        isSelected
                          ? 'ring-2 ring-teal-500 rounded-md shadow-lg'
                          : 'hover:ring-1 hover:ring-teal-400/80 rounded-md'
                      } ${isDragging ? 'opacity-90 scale-[1.02] shadow-2xl' : ''}`}
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                        touchAction: 'none',
                      }}
                      onMouseDown={(e) => handleStartDragText(e, ann)}
                      onTouchStart={(e) => handleStartDragText(e, ann)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnnId(ann.id);
                      }}
                    >
                      {/* Floating Drag & Edit Toolbar when hovered or selected */}
                      <div
                        className={`absolute -top-7 start-0 flex items-center gap-1 rounded-md bg-slate-900/90 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm transition-opacity shadow-md ${
                          isSelected ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Move className="h-3 w-3 text-teal-400 shrink-0" />
                        <span className="font-mono text-[9px] text-slate-300">
                          {Math.round(ann.x)}%, {Math.round(ann.y)}%
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextInput(ann.text || '');
                            setFontSize(ann.fontSize || 20);
                            setSelectedColor(ann.color || '#0f172a');
                            setTextBgColor(ann.backgroundColor || 'transparent');
                          }}
                          className="p-0.5 hover:text-teal-300"
                          title="تعديل في اللوحة"
                        >
                          <Edit2 className="h-2.5 w-2.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteAnnotation(ann.id, e)}
                          className="p-0.5 text-rose-400 hover:text-rose-200"
                          title="حذف النص"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      {/* Rendered Text Element */}
                      <div
                        className="px-2 py-0.5 rounded leading-tight whitespace-pre-wrap"
                        style={{
                          fontSize: `${ann.fontSize || 18}px`,
                          color: ann.color || '#0f172a',
                          backgroundColor:
                            ann.backgroundColor && ann.backgroundColor !== 'transparent'
                              ? ann.backgroundColor
                              : 'transparent',
                          fontWeight: ann.isBold ? 'bold' : 'normal',
                          fontFamily: '"Cairo", "Plus Jakarta Sans", system-ui, sans-serif',
                          border:
                            ann.backgroundColor === '#ffffff'
                              ? '1px solid #cbd5e1'
                              : 'none',
                        }}
                      >
                        {ann.text}
                      </div>
                    </div>
                  );
                })}

                {/* INTERACTIVE DRAGGABLE IMAGE ANNOTATIONS OVERLAY */}
                {currentPageImageAnnotations.map((ann) => {
                  const isSelected = selectedAnnId === ann.id;
                  const isDragging = draggingAnnId === ann.id;

                  return (
                    <div
                      key={ann.id}
                      className={`draggable-image-item absolute z-30 flex flex-col group cursor-move select-none transition-shadow ${
                        isSelected
                          ? 'ring-2 ring-teal-500 rounded-md shadow-xl'
                          : 'hover:ring-1 hover:ring-teal-400/80 rounded-md'
                      } ${isDragging ? 'opacity-90 scale-[1.02] shadow-2xl' : ''}`}
                      style={{
                        left: `${ann.x}%`,
                        top: `${ann.y}%`,
                        width: `${ann.width || 30}%`,
                        touchAction: 'none',
                      }}
                      onMouseDown={(e) => handleStartDragAnnotation(e, ann)}
                      onTouchStart={(e) => handleStartDragAnnotation(e, ann)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnnId(ann.id);
                        setActiveMode('image');
                      }}
                    >
                      {/* Floating Toolbar for Image */}
                      <div
                        className={`absolute -top-8 start-0 flex items-center gap-1 rounded-md bg-slate-900/95 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm transition-opacity shadow-md ${
                          isSelected ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Move className="h-3 w-3 text-teal-400 shrink-0" />
                        <span className="font-mono text-[9px] text-slate-300">
                          {Math.round(ann.x)}%, {Math.round(ann.y)}%
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateImageSize(ann.id, -5);
                          }}
                          className="px-1 py-0.5 bg-slate-800 rounded hover:bg-slate-700 font-bold"
                          title="تصغير"
                        >
                          -
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateImageSize(ann.id, 5);
                          }}
                          className="px-1 py-0.5 bg-slate-800 rounded hover:bg-slate-700 font-bold"
                          title="تكبير"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteAnnotation(ann.id, e)}
                          className="p-0.5 text-rose-400 hover:text-rose-200"
                          title="حذف الصورة"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <img
                        src={ann.imageData}
                        alt="Annotated"
                        className="pointer-events-none block w-full h-auto rounded select-none shadow-sm"
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>جاري تحميل الصفحة للمحرر...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
