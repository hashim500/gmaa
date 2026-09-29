import React, { useState } from 'react';
import {
  Contrast,
  FileUp,
  Download,
  ArrowRight,
  Printer,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { pdfjsLib } from '../../utils/pdfWorker';
import { TranslationDict } from '../../i18n/translations';

interface PdfGrayscaleToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const PdfGrayscaleTool: React.FC<PdfGrayscaleToolProps> = ({ t, onBack, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [mode, setMode] = useState<'gray' | 'bw'>('gray');
  const [qualityDpi, setQualityDpi] = useState<number>(2.0); // 1.4 = ~100dpi, 2.0 = ~150dpi, 2.8 = ~200dpi
  const [threshold, setThreshold] = useState<number>(165);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Read array buffer and pass a clone so buffer doesn't get detached
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
      setSelectedFile(file);
      setPageCount(pdf.numPages);
      setDownloadUrl(null);
      try {
        (pdf as any).destroy?.();
      } catch (_) {}
    } catch (err: any) {
      onError('تعذر قراءة ملف PDF. تأكد من سلامة الملف وأنه غير محمي بكلمة مرور.');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      onError('يرجى اختيار ملف PDF أولاً.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(0);
    setProgressMsg('بدء تحويل الألوان...');
    setDownloadUrl(null);

    let pdfDocInstance: any = null;
    try {
      // Always get a fresh ArrayBuffer from the selected file so it can never be detached
      const freshBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(freshBuffer) }).promise;
      pdfDocInstance = pdf;
      const totalPages = pdf.numPages;
      const outDoc = await PDFDocument.create();

      const isBw = mode === 'bw';

      for (let p = 1; p <= totalPages; p++) {
        setProgressMsg(`معالجة الصفحة ${p} من ${totalPages}...`);
        setProgressPercent(Math.round(((p - 0.5) / totalPages) * 100));

        const page = await pdf.getPage(p);
        const originalViewport = page.getViewport({ scale: 1 });
        const renderViewport = page.getViewport({ scale: qualityDpi });

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(renderViewport.width);
        canvas.height = Math.round(renderViewport.height);

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('فشل تهيئة محرك المعالجة الرسومية');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await (page as any).render({
          canvasContext: ctx as any,
          viewport: renderViewport,
          canvas: canvas as any,
        }).promise;

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          // Standard luminous grayscale calculation
          let g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          if (isBw) {
            g = g > threshold ? 255 : 0;
          }
          d[i] = g;
          d[i + 1] = g;
          d[i + 2] = g;
        }

        ctx.putImageData(imgData, 0, 0);

        const jpegBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.85);
        });

        if (!jpegBlob) throw new Error('فشل ضغط صورة الصفحة');

        const jpgBytes = await jpegBlob.arrayBuffer();
        const embeddedJpg = await outDoc.embedJpg(jpgBytes);

        const newPage = outDoc.addPage([originalViewport.width, originalViewport.height]);
        newPage.drawImage(embeddedJpg, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        });

        setProgressPercent(Math.round((p / totalPages) * 100));
      }

      setProgressMsg('حفظ وتجهيز المستند النهائي...');
      const outPdfBytes = await outDoc.save();
      const finalBlob = new Blob([outPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(finalBlob);

      const base = selectedFile.name.replace(/\.pdf$/i, '');
      const outName = `${isBw ? 'ابيض-واسود-' : 'رمادي-'}${base}.pdf`;

      setDownloadUrl(url);
      setDownloadName(outName);
      setProgressMsg('اكتملت المعالجة بنجاح!');
    } catch (err: any) {
      onError(`حدث خطأ أثناء معالجة الملف: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
      try {
        (pdfDocInstance as any)?.destroy?.();
      } catch (_) {}
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
              <Contrast className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                تحويل PDF إلى تدرج رمادي أو أبيض وأسود (Grayscale)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تجهيز المستند للطباعة الاقتصادية وتوفير الحبر وتحسين التباين للمسح الضوئي
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/40 transition dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-teal-400">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <FileUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
              {selectedFile ? selectedFile.name : 'اسحب ملف PDF هنا أو اضغط للاختيار'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              {selectedFile ? `${pageCount} صفحة جاهزة للتحويل` : 'معالجة محلية داخل المتصفح 100%'}
            </span>
          </div>
        </label>

        {/* Conversion Controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              نمط التحويل:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="gray">تدرّج رمادي ناعم (Grayscale)</option>
              <option value="bw">أبيض وأسود ثنائي حاد (Monochrome B&W)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              جودة ودقة العرض:
            </label>
            <select
              value={qualityDpi}
              onChange={(e) => setQualityDpi(parseFloat(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="1.4">سريعة وحجم أصغر (~100 DPI)</option>
              <option value="2.0">متوازنة ومثالية للطباعة (~150 DPI)</option>
              <option value="2.8">فائقة الدقة للوثائق الحساسة (~200 DPI)</option>
            </select>
          </div>

          {mode === 'bw' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  عتبة التباين (Threshold):
                </label>
                <span className="font-mono text-xs text-teal-600 font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="50"
                max="220"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600 mt-2"
              />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{progressMsg}</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-teal-600 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleConvert}
            disabled={!selectedFile || isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition active:scale-98"
          >
            <Contrast className="h-4 w-4" />
            <span>{isProcessing ? 'جارٍ التحويل...' : 'تحويل وتحميل PDF'}</span>
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={downloadName}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>تحميل الملف المحوّل ({downloadName})</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
