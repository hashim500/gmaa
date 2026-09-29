import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
  User,
  Cpu,
} from 'lucide-react';
import { PDFDocument, PDFName } from 'pdf-lib';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';

interface MetadataCleanerToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (progress: number, message: string) => void;
  onComplete: (result: ProcessedResult) => void;
  onError: (msg: string) => void;
}

interface PdfMetadataInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
}

export const MetadataCleanerTool: React.FC<MetadataCleanerToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadataInfo | null>(null);
  const [hasMetadata, setHasMetadata] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) {
      setMetadata(null);
      setHasMetadata(false);
      return;
    }

    let isCancelled = false;
    const readMetadata = async () => {
      setIsReading(true);
      try {
        const arrayBuf = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuf, { updateMetadata: false });

        const title = pdfDoc.getTitle() || undefined;
        const author = pdfDoc.getAuthor() || undefined;
        const subject = pdfDoc.getSubject() || undefined;
        const keywords = pdfDoc.getKeywords() || undefined;
        const creator = pdfDoc.getCreator() || undefined;
        const producer = pdfDoc.getProducer() || undefined;
        const creationDate = pdfDoc.getCreationDate()?.toLocaleString('ar-SA') || undefined;
        const modDate = pdfDoc.getModificationDate()?.toLocaleString('ar-SA') || undefined;

        const info: PdfMetadataInfo = {
          title,
          author,
          subject,
          keywords,
          creator,
          producer,
          creationDate,
          modDate,
        };

        if (!isCancelled) {
          setMetadata(info);
          const hasAny = Boolean(
            title || author || subject || keywords || creator || producer || creationDate || modDate
          );
          setHasMetadata(hasAny);
        }
      } catch (err: any) {
        if (!isCancelled) {
          onError('تعذّر قراءة بيانات الملف. قد يكون محمياً بكلمة مرور أو تالفاً.');
        }
      } finally {
        if (!isCancelled) setIsReading(false);
      }
    };

    readMetadata();
    return () => {
      isCancelled = true;
    };
  }, [file, onError]);

  const handleCleanMetadata = async () => {
    if (!file) return;

    try {
      onProgress(20, 'جاري فحص وتطهير بيانات الميتاداتا...');
      const arrayBuf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuf, { updateMetadata: false });

      onProgress(50, 'جاري حذف بيانات الكاتب والبرامج المنشئة وسجل التعديلات...');
      const ref = pdfDoc.context.trailerInfo.Info;
      const infoDict = ref && pdfDoc.context.lookup(ref);

      if (infoDict && typeof (infoDict as any).delete === 'function') {
        const keysToDelete = [
          'Title',
          'Author',
          'Subject',
          'Keywords',
          'Creator',
          'Producer',
          'CreationDate',
          'ModDate',
          'Trapped',
        ];
        keysToDelete.forEach((key) => {
          (infoDict as any).delete(PDFName.of(key));
        });
      }

      // Delete catalog Metadata XMP stream
      pdfDoc.catalog.delete(PDFName.of('Metadata'));

      onProgress(85, 'جاري حفظ النسخة المنظفة والآمنة...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const cleanFilename = `${originalName}_sanitized.pdf`;

      onProgress(100, 'تم تنظيف الملف بنجاح وحماية خصوصيتك!');
      onComplete({
        blob,
        filename: cleanFilename,
        type: 'pdf',
        originalSize: file.size,
      });
    } catch (err: any) {
      onError(`تعذّر تنظيف ملف الـ PDF: ${err.message || 'خطأ غير معروف'}`);
    }
  };

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
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                مسح بيانات ملف PDF وحماية الخصوصية
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                أمان تام
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              افحص واحذف البيانات المخفية (اسم المؤلف، البرامج المنشئة، تاريخ التعديل، الميتاداتا) قبل إرسال الملف.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {!file ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FileUploader
            t={t}
            file={file}
            onFilesSelected={(files) => setFile(files[0])}
            onFileSelect={setFile}
            accept=".pdf,application/pdf"
            helperText="اختر ملف الـ PDF لفحص بياناته المخفية وتنظيفها تماماً"
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
                <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {(file.size / 1024).toFixed(1)} كيلوبايت
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              تغيير الملف
            </button>
          </div>

          {/* Metadata Inspector Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h2 className="font-bold text-slate-900 dark:text-white">
                  البيانات والمعلومات المخفية الموجودة بالملف:
                </h2>
              </div>
              {hasMetadata ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  يحتوي على بيانات تتبع وهوية
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  الملف نظيف جزئياً
                </span>
              )}
            </div>

            {/* Fields Table */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">عنوان المستند (Title):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.title || 'غير محدد (فارغ)'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">اسم الكاتب / المؤلف (Author):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.author || 'غير محدد (فارغ)'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">موضوع المستند (Subject):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.subject || 'غير محدد'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">الكلمات الدلالية (Keywords):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.keywords || 'غير محدد'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">البرنامج المنشئ (Creator Software):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.creator || 'غير محدد'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">محوّل الـ PDF (Producer Engine):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.producer || 'غير محدد'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">تاريخ الإنشاء الأصلي (Created Date):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.creationDate || 'غير مسجل'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="text-xs text-slate-400">تاريخ آخر تعديل (Modified Date):</span>
                <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">
                  {metadata?.modDate || 'غير مسجل'}
                </p>
              </div>
            </div>

            {/* Cleaning Explanation */}
            <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/60 p-4 text-xs text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>ماذا يحدث عند مسح البيانات؟</span>
              </div>
              <p className="mt-1 leading-relaxed text-[11.5px]">
                سيتم حذف اسم المؤلف، واسم البرنامج، وتواريخ الإنشاء والتعديل، وجميع وسوم XMP الخفية من ملف الـ PDF تماماً، مع الحفاظ على النصوص والصفحات والتصميم كما هي دون أي مساس بالمحتوى المرئي.
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                id="btn-clean-metadata"
                onClick={handleCleanMetadata}
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-teal-600 px-8 font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 active:scale-98"
              >
                <Trash2 className="h-4 w-4" />
                <span>مسح البيانات وحفظ الملف النظيف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
