import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ScanText,
  Upload,
  Copy,
  Download,
  CheckCircle2,
  FileText,
  Sparkles,
  RefreshCw,
  Eye,
  Languages,
  Layers,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { pdfjsLib } from '../../utils/pdfWorker';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload } from '../../utils/pdfUtils';

interface OcrToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const OcrTool: React.FC<OcrToolProps> = ({ t, onBack, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(false);

  const [ocrLang, setOcrLang] = useState<string>('ara+eng');
  const [maxPages, setMaxPages] = useState<number>(5);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setExtractedText('');
    setProgress(0);
    setStatusMessage('');

    const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setIsPdf(isPdfType);

    if (!isPdfType) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      onError('يرجى اختيار صورة أو ملف PDF أولاً.');
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setStatusMessage('جاري تهيئة محرك القراءة الضوئية (OCR)...');

    let worker: any = null;

    try {
      // 1. Prepare canvases for OCR
      const canvases: HTMLCanvasElement[] = [];

      if (isPdf) {
        setStatusMessage('جاري قراءة صفحات مستند الـ PDF...');
        const arrayBuf = await selectedFile.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
        const pageLimit = Math.min(doc.numPages, maxPages);

        for (let i = 1; i <= pageLimit; i++) {
          setStatusMessage(`جاري تحضير وتصيير الصفحة ${i} من ${pageLimit}...`);
          setProgress(10 + Math.round((i / pageLimit) * 20));

          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // High scale for clear OCR
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await (page.render as any)({ canvasContext: ctx, viewport, canvas }).promise;
            canvases.push(canvas);
          }
        }
      } else {
        setStatusMessage('جاري معالجة الصورة...');
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objectUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvases.push(canvas);
        }
        URL.revokeObjectURL(objectUrl);
      }

      if (canvases.length === 0) {
        throw new Error('تعذّر تصيير المستند للاستخراج.');
      }

      // 2. Initialize Tesseract Worker
      setStatusMessage('جاري تحميل بيانات اللغة المختارة (قد يستغرق بضع ثوانٍ أول مرة)...');
      worker = await createWorker(ocrLang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round(m.progress * 100);
            setProgress(30 + Math.round(pct * 0.65));
            setStatusMessage(`جاري استخراج النصوص بالذكاء الاصطناعي... (${pct}%)`);
          }
        },
      });

      // 3. Recognize all pages
      const results: string[] = [];
      for (let idx = 0; idx < canvases.length; idx++) {
        setStatusMessage(`جاري قراءة الصفحة ${idx + 1} من ${canvases.length}...`);
        const { data } = await worker.recognize(canvases[idx]);
        const clean = data.text.trim();
        if (canvases.length > 1) {
          results.push(`--- [صفحة ${idx + 1}] ---\n${clean}`);
        } else {
          results.push(clean);
        }
      }

      const combinedText = results.join('\n\n');
      setExtractedText(combinedText);
      setProgress(100);
      setStatusMessage('اكتمل استخراج النص بنجاح!');
    } catch (err: any) {
      console.error('OCR Error:', err);
      onError(`حدث خطأ أثناء استخراج النص: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onError('تعذّر النسخ المباشر. يمكنك تحديد النص ونسخه يدوياً.');
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob(['\ufeff' + extractedText], { type: 'text/plain;charset=utf-8' });
    const name = (selectedFile?.name.replace(/\.[^/.]+$/, '') || 'document') + '_extracted.txt';
    triggerFileDownload(blob, name);
  };

  const wordCount = extractedText ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText ? extractedText.length : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
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
                <ScanText className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                استخراج النص من PDF والصور (OCR)
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                عربي + إنجليزي
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              حوّل الصور والمستندات الممسوحة ضوئياً إلى نصوص رقمية قابلة للنسخ والبحث والتعديل محلياً.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* 1. Upload Dropzone */}
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition hover:border-teal-500 dark:border-slate-700 dark:bg-slate-800/30">
            <input
              type="file"
              id="ocr-file-upload"
              accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="ocr-file-upload"
              className="flex cursor-pointer flex-col items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Upload className="h-7 w-7" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                  اسحب ملف PDF أو صورة هنا، أو اضغط للاختيار
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  يدعم ملفات PDF الممسوحة ضوئياً وصور JPG و PNG و WebP بدقة عالية
                </p>
              </div>
            </label>
          </div>
        ) : (
          /* File Selected Info & Options */
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50/50 p-3.5 dark:border-teal-900/50 dark:bg-teal-950/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} كيلوبايت —{' '}
                    {isPdf ? 'مستند PDF' : 'صورة'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setExtractedText('');
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                تغيير الملف
              </button>
            </div>

            {/* OCR Language & Settings */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Languages className="h-4 w-4 text-teal-600" />
                  <span>لغة النصوص في المستند:</span>
                </label>
                <select
                  value={ocrLang}
                  onChange={(e) => setOcrLang(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="ara+eng">عربي + إنجليزي (موصى به للمستندات المختلطة)</option>
                  <option value="ara">لغة عربية فقط (Arabic)</option>
                  <option value="eng">لغة إنجليزية فقط (English)</option>
                </select>
              </div>

              {isPdf && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Layers className="h-4 w-4 text-teal-600" />
                    <span>أقصى عدد صفحات للاستخراج:</span>
                  </label>
                  <select
                    value={maxPages}
                    onChange={(e) => setMaxPages(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value={1}>الصفحة الأولى فقط (سريع جداً)</option>
                    <option value={3}>أول 3 صفحات</option>
                    <option value={5}>أول 5 صفحات (موصى به)</option>
                    <option value={10}>أول 10 صفحات</option>
                    <option value={20}>أول 20 صفحة</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Button & Live Progress */}
            <div>
              <button
                type="button"
                id="btn-start-ocr"
                onClick={handleExtractText}
                disabled={isProcessing}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>جاري استخراج النص...</span>
                  </>
                ) : (
                  <>
                    <ScanText className="h-5 w-5" />
                    <span>بدء استخراج النص الآن</span>
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{statusMessage}</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Output Result Area */}
            {extractedText && (
              <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/20 p-4 dark:border-emerald-900/40 dark:bg-slate-950/40">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>النص المستخرج:</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {wordCount} كلمة | {charCount} حرف
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>نسخ النص</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>تحميل ملف TXT</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  dir="auto"
                  rows={12}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="سيظهر النص المستخرج هنا..."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
