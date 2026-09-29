import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Image as ImageIcon, Images, Download, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';
import { imagesToPdf, pdfToImages, triggerFileDownload, formatBytes } from '../../utils/pdfUtils';

interface ImageConvertToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
  initialMode?: 'image-to-pdf' | 'pdf-to-image';
}

export const ImageConvertTool: React.FC<ImageConvertToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
  initialMode = 'image-to-pdf',
}) => {
  const [activeTab, setActiveTab] = useState<'image-to-pdf' | 'pdf-to-image'>(initialMode);

  // State for Images to PDF
  const [images, setImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [marginSize, setMarginSize] = useState<number>(0);

  // State for PDF to Images
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedImages, setExtractedImages] = useState<{ pageNum: number; dataUrl: string }[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleImagesAdded = (files: File[]) => {
    const items = files.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...items]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImgs = [...images];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newImgs.length) return;
    const temp = newImgs[index];
    newImgs[index] = newImgs[target];
    newImgs[target] = temp;
    setImages(newImgs);
  };

  const handleCreatePdfFromImages = async () => {
    if (images.length === 0) return;

    try {
      const rawFiles = images.map((img) => img.file);
      const totalSize = rawFiles.reduce((acc, f) => acc + f.size, 0);

      const bytes = await imagesToPdf(
        rawFiles,
        { orientation, margin: marginSize },
        (percent, msg) => {
          onProgress(percent, msg);
        }
      );

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: 'images_document.pdf',
        originalSize: totalSize,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  const handleConvertPdfToImages = async (file: File) => {
    setPdfFile(file);
    try {
      const { zipBlob: generatedZip, images: renderedImages } = await pdfToImages(
        file,
        0.9,
        (percent, msg) => {
          onProgress(percent, msg);
        }
      );

      setZipBlob(generatedZip);
      setExtractedImages(renderedImages);

      onComplete({
        blob: generatedZip,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_images.zip`,
        originalSize: file.size,
        newSize: generatedZip.size,
        type: 'zip',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('image-to-pdf')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'image-to-pdf'
                ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>{t.tools.imageToPdf.title}</span>
          </button>
          <button
            onClick={() => setActiveTab('pdf-to-image')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'pdf-to-image'
                ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Images className="h-3.5 w-3.5" />
            <span>{t.tools.pdfToImage.title}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Images to PDF */}
      {activeTab === 'image-to-pdf' && (
        <div className="space-y-5">
          {images.length === 0 ? (
            <FileUploader
              multiple
              isImages
              accept="image/*"
              onFilesSelected={handleImagesAdded}
              t={t}
              label={t.tools.imageToPdf.title}
              hint={t.tools.imageToPdf.desc}
            />
          ) : (
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              {/* Settings Controls */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                {/* Orientation */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.tools.imageToPdf.orientation}
                  </label>
                  <div className="flex gap-1.5">
                    {(['auto', 'portrait', 'landscape'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setOrientation(mode)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition ${
                          orientation === mode
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {t.tools.imageToPdf[mode]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.tools.imageToPdf.margins}
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { label: t.tools.imageToPdf.noMargin, val: 0 },
                      { label: t.tools.imageToPdf.smallMargin, val: 15 },
                      { label: t.tools.imageToPdf.bigMargin, val: 30 },
                    ].map((m) => (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => setMarginSize(m.val)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                          marginSize === m.val
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Thumbnails Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white dark:bg-slate-900">
                      <img
                        src={img.preview}
                        alt={img.file.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute start-1 top-1 flex h-5 w-5 items-center justify-center rounded-md bg-slate-950/70 text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-slate-500">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'up')}
                          disabled={idx === 0}
                          className="rounded p-1 hover:bg-slate-200 disabled:opacity-20 dark:hover:bg-slate-700"
                        >
                          <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'down')}
                          disabled={idx === images.length - 1}
                          className="rounded p-1 hover:bg-slate-200 disabled:opacity-20 dark:hover:bg-slate-700"
                        >
                          <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="rounded p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add more tile */}
                <label
                  htmlFor="img-add-more"
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-teal-300 bg-teal-50/50 p-2 text-center text-xs font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-300"
                >
                  <Plus className="h-6 w-6 mb-1 text-teal-600" />
                  <span>إضافة صور</span>
                  <input
                    id="img-add-more"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleImagesAdded(Array.from(e.target.files));
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Convert Button */}
              <button
                id="btn-create-pdf-from-images"
                onClick={handleCreatePdfFromImages}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
              >
                <ImageIcon className="h-5 w-5" />
                <span>{t.tools.imageToPdf.convertAction}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PDF to Images */}
      {activeTab === 'pdf-to-image' && (
        <div className="space-y-5">
          <FileUploader
            onFilesSelected={(f) => handleConvertPdfToImages(f[0])}
            t={t}
            label={t.tools.pdfToImage.title}
            hint={t.tools.pdfToImage.desc}
          />
        </div>
      )}
    </div>
  );
};
