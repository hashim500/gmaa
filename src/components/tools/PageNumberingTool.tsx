import React, { useState } from 'react';
import {
  FileText,
  Upload,
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  Sliders,
  Type,
  Eye,
  Check,
  RotateCcw,
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { triggerFileDownload } from '../../utils/pdfUtils';
import { TranslationDict } from '../../i18n/translations';

interface PageNumberingToolProps {
  t: TranslationDict;
  onBack: () => void;
}

type NumberingPattern = '1' | '5/1' | 'صفحة 1' | 'صفحة 1 من 5';
type NumberingPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

export const PageNumberingTool: React.FC<PageNumberingToolProps> = ({ t, onBack }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('مستند_نموذجي.pdf');
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState<number>(5);

  // Settings
  const [pattern, setPattern] = useState<NumberingPattern>('صفحة 1 من 5');
  const [position, setPosition] = useState<NumberingPosition>('bottom-center');
  const [colorHex, setColorHex] = useState<string>('#0d9488');
  const [fontSize, setFontSize] = useState<number>(10);
  const [hasBackground, setHasBackground] = useState<boolean>(false);
  const [startFromPage, setStartFromPage] = useState<number>(1);
  const [skipFirstPage, setSkipFirstPage] = useState<boolean>(false);

  // Process & Export state
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    try {
      setSelectedFile(file);
      setFileName(file.name);
      const buf = await file.arrayBuffer();
      setFileBytes(buf);

      const pdf = await PDFDocument.load(buf);
      setTotalPages(pdf.getPageCount());
      setStatusMessage(null);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('تعذر قراءة ملف الـ PDF. تأكد من أن الملف سليم وغير محمي بكلمة سر.');
    }
  };

  // Convert HEX to RGB [0-1]
  const hexToPdfRgb = (hex: string) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const bigint = parseInt(cleanHex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return rgb(r, g, b);
  };

  const handleApplyAndDownload = async () => {
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      let pdfDoc: PDFDocument;
      if (fileBytes) {
        pdfDoc = await PDFDocument.load(fileBytes);
      } else {
        // Create demo 3-page document if no file was uploaded
        pdfDoc = await PDFDocument.create();
        for (let i = 0; i < 3; i++) {
          const page = pdfDoc.addPage([595.28, 841.89]);
          page.drawText(`صفحة نموذجية رقم ${i + 1}`, {
            x: 200,
            y: 700,
            size: 20,
            color: rgb(0.2, 0.2, 0.2),
          });
        }
      }

      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const count = pages.length;
      const pdfColor = hexToPdfRgb(colorHex);

      pages.forEach((page, idx) => {
        const pageNum = idx + 1;
        if (skipFirstPage && pageNum === 1) return;
        if (pageNum < startFromPage) return;

        const { width, height } = page.getSize();

        // Format label
        let label = '';
        if (pattern === '1') {
          label = `${pageNum}`;
        } else if (pattern === '5/1') {
          label = `${count} / ${pageNum}`;
        } else if (pattern === 'صفحة 1') {
          label = `Page ${pageNum}`;
        } else {
          label = `Page ${pageNum} of ${count}`;
        }

        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x = width / 2 - textWidth / 2;
        let y = 30;

        if (position.startsWith('top')) {
          y = height - 35;
        }

        if (position.endsWith('right')) {
          x = width - textWidth - 40;
        } else if (position.endsWith('left')) {
          x = 40;
        }

        // Draw light background if enabled
        if (hasBackground) {
          page.drawRectangle({
            x: x - 6,
            y: y - 3,
            width: textWidth + 12,
            height: textHeight + 6,
            color: rgb(0.94, 0.95, 0.96),
            borderColor: rgb(0.85, 0.88, 0.9),
            borderWidth: 0.5,
          });
        }

        // Draw text
        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: pdfColor,
        });
      });

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const safeName = (fileName || 'numbered_document.pdf').replace(/\.pdf$/i, '');
      triggerFileDownload(blob, `${safeName}_ترقيم.pdf`);

      setStatusMessage('تم ترقيم صفحات الملف بنجاح وتنزيله!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('حدث خطأ أثناء ترقيم الملف: ' + (err?.message || ''));
    } finally {
      setIsProcessing(false);
    }
  };

  // Live preview text generator
  const previewLabel = pattern
    .replace('1', '1')
    .replace('5', totalPages.toString());

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4" />
            <span>{t.backToTools}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                أداة ترقيم الصفحات المتقدمة لملفات PDF
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  pdf-lib
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إضافة أرقام الصفحات بأنماط مرنة، ألوان ومواضع متعددة مع معاينة فورية بدقة A4
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Controls & Options */}
        <div className="lg:col-span-6 space-y-5">
          {/* File Upload Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              1. رفع ملف الـ PDF:
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center transition hover:border-teal-500 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40">
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 cursor-pointer opacity-0 w-full h-full"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                }}
              />
              <Upload className="mx-auto h-8 w-8 text-teal-600 mb-1" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                اسحب ملف الـ PDF هنا أو <span className="text-teal-600">اختر من جهازك</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedFile
                  ? `${fileName} (${totalPages} صفحة)`
                  : 'لم يتم اختيار ملف بعد (سيتم تطبيق الترقيم على ملف نموذجي افتراضياً)'}
              </p>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between rounded-xl bg-teal-50 p-2.5 text-xs text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                <span className="font-semibold truncate max-w-[220px]">{fileName}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold shadow-xs dark:bg-slate-800">
                  {totalPages} صفحة جاهزة
                </span>
              </div>
            )}
          </div>

          {/* Numbering Pattern */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              2. نمط وشكل الترقيم:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {(['1', '5/1', 'صفحة 1', 'صفحة 1 من 5'] as NumberingPattern[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPattern(p)}
                  className={`p-3 rounded-xl border font-bold transition ${
                    pattern === p
                      ? 'border-teal-600 bg-teal-600 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Numbering Position */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              3. موضع الترقيم على الصفحة:
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { id: 'top-right', label: 'أعلى اليمين' },
                { id: 'top-center', label: 'أعلى الوسط' },
                { id: 'top-left', label: 'أعلى اليسار' },
                { id: 'bottom-right', label: 'أسفل اليمين' },
                { id: 'bottom-center', label: 'أسفل الوسط' },
                { id: 'bottom-left', label: 'أسفل اليسار' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPosition(pos.id as NumberingPosition)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                    position === pos.id
                      ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Styling Options: Color, Font Size, Background */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block border-b border-slate-100 pb-2 dark:border-slate-800">
              4. تخصيص المظهر واللون:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  لون الخط:
                </span>
                <div className="flex items-center gap-2">
                  {['#0d9488', '#000000', '#2563eb', '#dc2626'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorHex(c)}
                      style={{ backgroundColor: c }}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        colorHex === c ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent'
                      }`}
                    />
                  ))}
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="h-7 w-8 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  حجم الخط:
                </span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value={8}>صغير جداً (8)</option>
                  <option value={10}>عادي (10)</option>
                  <option value={12}>متوسط (12)</option>
                  <option value={14}>كبير (14)</option>
                  <option value={16}>كبير جداً (16)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  خلفية الترقيم:
                </span>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={hasBackground}
                    onChange={(e) => setHasBackground(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    خلفية خفيفة بارزة
                  </span>
                </label>
              </div>
            </div>

            {/* Advanced: Skip first page */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipFirstPage}
                  onChange={(e) => setSkipFirstPage(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  تخطي الصفحة الأولى (الغلاف)
                </span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleApplyAndDownload}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 px-4 text-xs font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>
              {isProcessing
                ? 'جاري ترقيم وحفظ الملف...'
                : 'تطبيق الترقيم وتنزيل ملف PDF'}
            </span>
          </button>

          {statusMessage && (
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-3 text-xs font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Right Side: Live Page Preview */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-100/70 p-6 flex flex-col items-center justify-center min-h-[460px] dark:border-slate-800 dark:bg-slate-950/40 relative">
          <div className="absolute top-4 right-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 shadow-xs dark:bg-slate-800 dark:text-slate-300">
            معاينة فورية مباشرة
          </div>

          {/* Simulated A4 Page */}
          <div className="relative w-full max-w-[320px] h-[430px] rounded-lg bg-white shadow-xl p-6 flex flex-col justify-between border border-slate-200 dark:bg-white text-slate-800">
            {/* Page Header Dummy */}
            <div className="border-b pb-2 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-800 truncate">
                {fileName}
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                PDF
              </span>
            </div>

            {/* Page Body Dummy */}
            <div className="space-y-3 opacity-40 flex-1 pt-2">
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-2.5 bg-slate-200 rounded w-full"></div>
              <div className="h-2.5 bg-slate-200 rounded w-5/6"></div>
              <div className="h-2.5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-2.5 bg-slate-200 rounded w-4/5"></div>
            </div>

            {/* Dynamically Positioned Page Number Badge */}
            <div
              style={{
                color: colorHex,
                fontSize: `${fontSize}px`,
              }}
              className={`font-bold transition-all duration-150 absolute px-2.5 py-0.5 rounded ${
                hasBackground
                  ? 'bg-slate-100 border border-slate-200 shadow-xs'
                  : ''
              } ${
                position === 'top-right'
                  ? 'top-4 right-4'
                  : position === 'top-center'
                  ? 'top-4 left-1/2 -translate-x-1/2'
                  : position === 'top-left'
                  ? 'top-4 left-4'
                  : position === 'bottom-right'
                  ? 'bottom-4 right-4'
                  : position === 'bottom-center'
                  ? 'bottom-4 left-1/2 -translate-x-1/2'
                  : 'bottom-4 left-4'
              }`}
            >
              {previewLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
