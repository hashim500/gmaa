import React, { useState } from 'react';
import {
  Grid,
  FileUp,
  Download,
  ArrowRight,
  Printer,
  CheckCircle2,
  FileText,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import { TranslationDict } from '../../i18n/translations';

interface NUpToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const NUpTool: React.FC<NUpToolProps> = ({ t, onBack, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesPerSheet, setPagesPerSheet] = useState<number>(4);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [drawBorder, setDrawBorder] = useState<boolean>(true);
  const [isRtl, setIsRtl] = useState<boolean>(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setSelectedFile(file);
      setFileBuffer(buffer);
      setPageCount(doc.getPageCount());
      setDownloadUrl(null);
    } catch (err: any) {
      onError('تعذر فتح ملف الـ PDF. قد يكون الملف تالفاً أو محمياً بكلمة مرور.');
    }
  };

  const handleGenerate = async () => {
    if (!fileBuffer || !selectedFile) {
      onError('يرجى اختيار ملف PDF أولاً.');
      return;
    }

    setIsGenerating(true);
    setDownloadUrl(null);

    try {
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const outDoc = await PDFDocument.create();

      const per = pagesPerSheet;
      const isLand = orientation === 'landscape';

      // Dimensions for A4 in points
      const W = isLand ? 841.89 : 595.28;
      const H = isLand ? 595.28 : 841.89;

      const layoutMap: Record<number, [number, number]> = {
        2: [2, 1],
        4: [2, 2],
        6: [3, 2],
        9: [3, 3],
      };

      const [mapCols, mapRows] = layoutMap[per] || [2, 2];
      const cols = isLand ? mapCols : mapRows;
      const rows = isLand ? mapRows : mapCols;

      const m = 20; // margin
      const g = 10; // gap

      const cellW = (W - 2 * m - (cols - 1) * g) / cols;
      const cellH = (H - 2 * m - (rows - 1) * g) / rows;

      const embeddedPages = await outDoc.embedPages(srcDoc.getPages());

      let currentPage: any = null;

      embeddedPages.forEach((emb, i) => {
        if (i % per === 0) {
          currentPage = outDoc.addPage([W, H]);
        }

        const k = i % per;
        const r = Math.floor(k / cols);
        let c = k % cols;
        if (isRtl) {
          c = cols - 1 - c;
        }

        const scale = Math.min(cellW / emb.width, cellH / emb.height);
        const w = emb.width * scale;
        const h = emb.height * scale;

        const x = m + c * (cellW + g) + (cellW - w) / 2;
        const y = H - m - r * (cellH + g) - cellH + (cellH - h) / 2;

        currentPage.drawPage(emb, {
          x,
          y,
          width: w,
          height: h,
        });

        if (drawBorder) {
          currentPage.drawRectangle({
            x,
            y,
            width: w,
            height: h,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 0.6,
          });
        }
      });

      const outPdfBytes = await outDoc.save();
      const blob = new Blob([outPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const baseName = selectedFile.name.replace(/\.pdf$/i, '');
      const outName = `${per}-صفحات-${baseName}.pdf`;

      setDownloadUrl(url);
      setDownloadName(outName);
    } catch (err: any) {
      onError(`حدث خطأ أثناء تجميع الصفحات: ${err.message || err}`);
    } finally {
      setIsGenerating(false);
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
              <Grid className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                عدة صفحات في ورقة واحدة (N-Up PDF)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                دمج 2 أو 4 أو 6 أو 9 صفحات في ورقة A4 واحدة لتوفير الورق وتسهيل الطباعة
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
              {selectedFile ? `${pageCount} صفحة في الملف الأصلي` : 'معالجة محلية آمنة 100%'}
            </span>
          </div>
        </label>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              عدد الصفحات في كل ورقة:
            </label>
            <select
              value={pagesPerSheet}
              onChange={(e) => setPagesPerSheet(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="2">2 صفحتان في الورقة</option>
              <option value="4">4 صفحات في الورقة (المثالي)</option>
              <option value="6">6 صفحات في الورقة</option>
              <option value="9">9 صفحات في الورقة</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              اتجاه الورقة الناتجة:
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="portrait">عمودي (Portrait)</option>
              <option value="landscape">أفقي (Landscape)</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={drawBorder}
              onChange={(e) => setDrawBorder(e.target.checked)}
              className="h-4 w-4 rounded accent-teal-600 text-teal-600"
            />
            <span>رسم إطار حدودي حول كل صفحة</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isRtl}
              onChange={(e) => setIsRtl(e.target.checked)}
              className="h-4 w-4 rounded accent-teal-600 text-teal-600"
            />
            <span>ترتيب القراءة من اليمين لليسار (مناسب للعربية)</span>
          </label>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!fileBuffer || isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition active:scale-98"
          >
            <Grid className="h-4 w-4" />
            <span>{isGenerating ? 'جارٍ تجميع الصفحات...' : 'إنشاء وحفظ ملف PDF'}</span>
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={downloadName}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>تحميل الملف المُجمّع الآن ({downloadName})</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
