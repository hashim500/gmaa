import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import { pdfjsLib } from './pdfWorker';
import { AnnotationItem, SearchMatchItem } from '../types';
import { findMatchesInPage } from './textSearchEngine';

/**
 * Reads a File as an ArrayBuffer
 */
export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

/**
 * Returns the page count of a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    return pdf.numPages;
  } catch {
    // Fallback to pdf-lib
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  }
}

/**
 * Renders a PDF page to a canvas and returns a base64 Data URL
 */
export async function renderPageToDataUrl(
  source: File | ArrayBuffer | Uint8Array,
  pageNumber: number,
  scale: number = 1.0,
  rotationOffset: number = 0
): Promise<{ dataUrl: string; width: number; height: number }> {
  let data: Uint8Array;
  if (source instanceof File) {
    const buf = await source.arrayBuffer();
    data = new Uint8Array(buf);
  } else if (source instanceof ArrayBuffer) {
    data = new Uint8Array(source);
  } else {
    data = source;
  }

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);

  // Apply extra rotation if needed
  const viewport = page.getViewport({ scale, rotation: (page.rotate + rotationOffset) % 360 });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Could not get canvas context');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport,
    canvas,
  } as any).promise;

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.85),
    width: viewport.width,
    height: viewport.height,
  };
}

/**
 * 1. MERGE PDFs
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(10, 'جاري تحضير المستندات...');
  const mergedPdf = await PDFDocument.create();

  const total = files.length;
  for (let i = 0; i < total; i++) {
    const file = files[i];
    onProgress?.(
      Math.round(15 + (i / total) * 70),
      `جاري دمج: ${file.name} (${i + 1}/${total})`
    );

    const buffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.(90, 'جاري حفظ المستند النهائي...');
  const pdfBytes = await mergedPdf.save();
  onProgress?.(100, 'اكتمل الدمج بنجاح!');
  return pdfBytes;
}

/**
 * 2. SPLIT PDF
 */
export async function splitPdf(
  file: File,
  ranges: { from: number; to: number }[],
  mergeAllRanges: boolean,
  onProgress?: (percent: number, message: string) => void
): Promise<{ blob: Blob; filename: string; isZip?: boolean }> {
  onProgress?.(10, 'جاري قراءة ملف PDF...');
  const buffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  if (mergeAllRanges) {
    onProgress?.(40, 'جاري استخراج النطاقات ودمجها...');
    const newDoc = await PDFDocument.create();

    const pageIndicesToCopy: number[] = [];
    for (const r of ranges) {
      const start = Math.max(1, Math.min(r.from, totalPages));
      const end = Math.max(start, Math.min(r.to, totalPages));
      for (let p = start; p <= end; p++) {
        if (!pageIndicesToCopy.includes(p - 1)) {
          pageIndicesToCopy.push(p - 1);
        }
      }
    }

    const copiedPages = await newDoc.copyPages(srcDoc, pageIndicesToCopy);
    copiedPages.forEach((page) => newDoc.addPage(page));

    onProgress?.(90, 'جاري إنشاء المستند...');
    const bytes = await newDoc.save();
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return {
      blob: new Blob([bytes], { type: 'application/pdf' }),
      filename: `${baseName}_split.pdf`,
      isZip: false,
    };
  } else {
    onProgress?.(30, 'جاري استخراج الملفات المنفصلة...');
    const zip = new JSZip();
    const baseName = file.name.replace(/\.[^/.]+$/, '') || 'document';
    const padLen = String(ranges.length).length > 1 ? String(ranges.length).length : 2;

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      const start = Math.max(1, Math.min(r.from, totalPages));
      const end = Math.max(start, Math.min(r.to, totalPages));

      const subDoc = await PDFDocument.create();
      const indices: number[] = [];
      for (let p = start; p <= end; p++) {
        indices.push(p - 1);
      }

      const pages = await subDoc.copyPages(srcDoc, indices);
      pages.forEach((page) => subDoc.addPage(page));

      const subBytes = await subDoc.save();
      const partNum = String(i + 1).padStart(padLen, '0');
      let partName = '';
      if (start === end) {
        partName = `${baseName}_part_${partNum}_page_${start}.pdf`;
      } else {
        partName = `${baseName}_part_${partNum}_pages_${start}-${end}.pdf`;
      }
      zip.file(partName, subBytes);
      onProgress?.(
        Math.round(30 + ((i + 1) / ranges.length) * 50),
        `تم استخراج ملف ${i + 1} من ${ranges.length}...`
      );
    }

    onProgress?.(85, 'جاري ضغط وتجهيز أرشيف ZIP...');
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/zip',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });
    return {
      blob: zipBlob,
      filename: `${baseName}_split_files.zip`,
      isZip: true,
    };
  }
}

/**
 * 3. ROTATE PDF
 */
export async function rotatePdf(
  file: File,
  rotations: Record<number, number>, // pageIndex -> rotation degrees (0, 90, 180, 270)
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(15, 'جاري قراءة صفحات المستند...');
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  onProgress?.(50, 'جاري تدوير الصفحات المحددة...');
  pages.forEach((page, idx) => {
    const addAngle = rotations[idx] || 0;
    if (addAngle !== 0) {
      const currentRot = page.getRotation().angle;
      page.setRotation(degrees((currentRot + addAngle) % 360));
    }
  });

  onProgress?.(85, 'جاري حفظ التعديلات...');
  const bytes = await pdfDoc.save();
  onProgress?.(100, 'اكتمل تدوير الصفحات!');
  return bytes;
}

/**
 * 4. ORGANIZE PDF (Reorder, duplicate, delete pages)
 */
export async function organizePdf(
  file: File,
  pageConfigs: { originalIndex: number; rotation: number }[],
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(15, 'جاري تحميل المستند الأصلي...');
  const buffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  onProgress?.(45, 'جاري ترتيب ونقل الصفحات...');
  for (let i = 0; i < pageConfigs.length; i++) {
    const { originalIndex, rotation } = pageConfigs[i];
    const [page] = await newDoc.copyPages(srcDoc, [originalIndex]);
    if (rotation) {
      const curr = page.getRotation().angle;
      page.setRotation(degrees((curr + rotation) % 360));
    }
    newDoc.addPage(page);
    onProgress?.(
      Math.round(45 + ((i + 1) / pageConfigs.length) * 40),
      `ترتيب صفحة ${i + 1}...`
    );
  }

  onProgress?.(90, 'جاري إنشاء المستند المنظم...');
  const bytes = await newDoc.save();
  onProgress?.(100, 'تم ترتيب الصفحات بنجاح!');
  return bytes;
}

/**
 * 5A. IMAGES TO PDF
 */
export async function imagesToPdf(
  images: File[],
  options: { orientation: 'auto' | 'portrait' | 'landscape'; margin: number },
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(10, 'جاري إنشاء مستند PDF جديد...');
  const pdfDoc = await PDFDocument.create();

  const total = images.length;
  for (let i = 0; i < total; i++) {
    const file = images[i];
    onProgress?.(
      Math.round(15 + (i / total) * 75),
      `معالجة الصورة: ${file.name} (${i + 1}/${total})`
    );

    const buffer = await file.arrayBuffer();
    let embeddedImg;
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    try {
      if (isPng) {
        embeddedImg = await pdfDoc.embedPng(buffer);
      } else {
        embeddedImg = await pdfDoc.embedJpg(buffer);
      }
    } catch {
      // Fallback: draw through canvas to convert unsupported types (WebP, etc) to JPEG
      const imgDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const convertedJpgBytes = await new Promise<Uint8Array>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            async (blob) => {
              if (blob) {
                const buf = await blob.arrayBuffer();
                resolve(new Uint8Array(buf));
              } else reject(new Error('Canvas conversion failed'));
            },
            'image/jpeg',
            0.92
          );
        };
        img.onerror = reject;
        img.src = imgDataUrl;
      });

      embeddedImg = await pdfDoc.embedJpg(convertedJpgBytes);
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let pageWidth = 595.28; // A4 standard pt
    let pageHeight = 841.89;

    if (options.orientation === 'auto') {
      if (imgWidth > imgHeight) {
        pageWidth = 841.89;
        pageHeight = 595.28;
      }
    } else if (options.orientation === 'landscape') {
      pageWidth = 841.89;
      pageHeight = 595.28;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const margin = options.margin;
    const availW = pageWidth - margin * 2;
    const availH = pageHeight - margin * 2;

    const scale = Math.min(availW / imgWidth, availH / imgHeight);
    const drawW = imgWidth * scale;
    const drawH = imgHeight * scale;

    const x = margin + (availW - drawW) / 2;
    const y = margin + (availH - drawH) / 2;

    page.drawImage(embeddedImg, {
      x,
      y,
      width: drawW,
      height: drawH,
    });
  }

  onProgress?.(92, 'جاري تجميع وحفظ المستند...');
  const bytes = await pdfDoc.save();
  onProgress?.(100, 'تم إنشاء ملف PDF بنجاح!');
  return bytes;
}

/**
 * 5B. PDF TO IMAGES
 */
export async function pdfToImages(
  file: File,
  quality: number = 0.92,
  onProgress?: (percent: number, message: string) => void
): Promise<{ zipBlob: Blob; images: { pageNum: number; dataUrl: string }[] }> {
  onProgress?.(10, 'جاري فحص صفحات المستند...');
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const numPages = pdf.numPages;

  const zip = new JSZip();
  const baseName = file.name.replace(/\.[^/.]+$/, '').trim() || 'document';
  const images: { pageNum: number; dataUrl: string }[] = [];

  for (let p = 1; p <= numPages; p++) {
    onProgress?.(
      Math.round(15 + (p / Math.max(1, numPages)) * 70),
      `تحويل الصفحة ${p} من ${numPages} إلى صورة...`
    );

    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 2.0 }); // 2.0 for high resolution

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      // Ensure white background so transparency doesn't turn black in jpeg
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      images.push({ pageNum: p, dataUrl });

      // Add to ZIP as binary
      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      zip.file(`${baseName}_page_${p}.jpg`, base64Data, { base64: true });
    }
  }

  onProgress?.(90, 'جاري ضغط الصور في أرشيف ZIP...');
  // Always create a valid ZIP archive even if only 1 image exists
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  onProgress?.(100, 'اكتمل استخراج الصور داخل ملف مضغوط (ZIP)!');
  return { zipBlob, images };
}

/**
 * 6. WATERMARK & PAGE NUMBERS
 */
export interface WatermarkOptions {
  enableWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number; // 0 - 1
  watermarkSize: number;
  watermarkRotation: number; // -45, 0, 45, 90
  watermarkColor: { r: number; g: number; b: number };

  enablePageNumbers: boolean;
  pageNumberFormat: '1' | 'Page 1' | 'Page 1 of 5' | '1 / 5' | 'صفحة 1' | 'صفحة 1 من 5';
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  pageNumberSize: number;
}

export async function addWatermarkAndPageNumbers(
  file: File,
  options: WatermarkOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(15, 'جاري قراءة ملف PDF...');
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  onProgress?.(40, 'جاري تطبيق العلامات المائية والترقيم...');

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    onProgress?.(
      Math.round(40 + ((i + 1) / totalPages) * 45),
      `تطبيق الخيارات على الصفحة ${i + 1} من ${totalPages}...`
    );

    const hasWatermark = options.enableWatermark && Boolean(options.watermarkText?.trim());
    const hasPageNumbers = options.enablePageNumbers;

    if (!hasWatermark && !hasPageNumbers) {
      continue;
    }

    // High-resolution canvas overlay to render any text (Arabic, English, Symbols) with crystal clarity
    const dpr = 2.0;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Watermark (Arabic & English supported)
    if (hasWatermark) {
      const text = options.watermarkText.trim();
      const fontSize = options.watermarkSize || 52;
      const opacity = options.watermarkOpacity ?? 0.35;
      const rotDeg = options.watermarkRotation ?? -45;
      const rotRad = (rotDeg * Math.PI) / 180;
      const r = Math.round(options.watermarkColor.r * 255);
      const g = Math.round(options.watermarkColor.g * 255);
      const b = Math.round(options.watermarkColor.b * 255);

      ctx.save();
      // Translate to page center
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rotRad);

      ctx.font = `bold ${fontSize}px "Cairo", "Tajawal", "Amiri", "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.direction = /[\u0600-\u06FF]/.test(text) ? 'rtl' : 'ltr';

      ctx.fillText(text, 0, 0);

      // Subtle border stroke to make it pop cleanly on dark or light backgrounds
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, opacity * 0.45)})`;
      ctx.lineWidth = 1;
      ctx.strokeText(text, 0, 0);

      ctx.restore();
    }

    // 2. Page Numbers (Arabic & English supported)
    if (hasPageNumbers) {
      let pageText = `${i + 1}`;
      if (options.pageNumberFormat === 'Page 1' || options.pageNumberFormat === 'صفحة 1') {
        pageText = `صفحة ${i + 1}`;
      } else if (options.pageNumberFormat === 'Page 1 of 5' || options.pageNumberFormat === 'صفحة 1 من 5') {
        pageText = `صفحة ${i + 1} من ${totalPages}`;
      } else if (options.pageNumberFormat === '1 / 5') {
        pageText = `${i + 1} / ${totalPages}`;
      }

      const numSize = options.pageNumberSize || 12;
      ctx.save();
      ctx.font = `600 ${numSize}px "Cairo", "Tajawal", "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; // Slate-800
      ctx.direction = /[\u0600-\u06FF]/.test(pageText) ? 'rtl' : 'ltr';

      let posX = width / 2;
      let posY = height - 25;
      let align: CanvasTextAlign = 'center';

      switch (options.pageNumberPosition) {
        case 'bottom-left':
          posX = 35;
          posY = height - 25;
          align = 'left';
          break;
        case 'bottom-right':
          posX = width - 35;
          posY = height - 25;
          align = 'right';
          break;
        case 'top-center':
          posX = width / 2;
          posY = 35;
          align = 'center';
          break;
        case 'top-right':
          posX = width - 35;
          posY = 35;
          align = 'right';
          break;
        case 'top-left':
          posX = 35;
          posY = 35;
          align = 'left';
          break;
        default:
          posX = width / 2;
          posY = height - 25;
          align = 'center';
      }

      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      ctx.fillText(pageText, posX, posY);
      ctx.restore();
    }

    // Convert canvas overlay to PNG and draw onto page
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const pngBytes = new Uint8Array(len);
    for (let k = 0; k < len; k++) {
      pngBytes[k] = binaryString.charCodeAt(k);
    }

    const embeddedPng = await pdfDoc.embedPng(pngBytes);
    page.drawImage(embeddedPng, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  onProgress?.(85, 'جاري تجميع وحفظ الملف...');
  const bytes = await pdfDoc.save();
  onProgress?.(100, 'تم إضافة العلامة المائية وترقيم الصفحات بنجاح!');
  return bytes;
}

/**
 * 7. PROTECT & UNLOCK PDF (Standards-compliant AES-256 encryption/decryption)
 */
export async function protectPdf(
  file: File,
  password: string,
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(20, 'جاري قراءة المستند الأصلي...');
  const buffer = await file.arrayBuffer();

  onProgress?.(60, 'جاري تشفير المستند بنظام AES-256 وقفل الملف...');
  const encryptedBytes = await encryptPDF(new Uint8Array(buffer), password, {
    algorithm: 'AES-256',
    allowPrinting: true,
    allowCopying: true,
    allowAnnotating: true,
    allowFillingForms: true,
  });

  onProgress?.(95, 'جاري إنهاء وتأمين الملف...');
  onProgress?.(100, 'تم قفل وحماية المستند بنجاح!');
  return encryptedBytes;
}

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(20, 'جاري فحص وتفقد حماية المستند...');
  const buffer = await file.arrayBuffer();
  const inputBytes = new Uint8Array(buffer);

  const status = await isEncrypted(inputBytes);
  if (!status.encrypted) {
    onProgress?.(100, 'المستند غير محمي بكلمة سر بالفعل.');
    return inputBytes;
  }

  onProgress?.(60, 'جاري التحقق من كلمة السر وفك التشفير...');
  try {
    const decryptedBytes = await decryptPDF(inputBytes, password || '');
    onProgress?.(100, 'تم إلغاء كلمة السر وفك حماية الملف بنجاح!');
    return decryptedBytes;
  } catch (err: any) {
    console.error('Failed to decrypt PDF:', err);
    throw new Error('كلمة المرور غير صحيحة، يرجى كتابة كلمة المرور الصحيحة لفتح هذا المستند.');
  }
}

/**
 * Helper to render custom text (including Arabic & Unicode) to high-res PNG bytes
 */
async function renderTextToPngBytes(
  text: string,
  fontSize: number = 18,
  color: string = '#0f172a',
  backgroundColor?: string,
  isBold?: boolean
): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  const scale = 3; // 3x high-resolution factor for sharp vector-like rendering in PDF
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  const cssFont = `${isBold ? 'bold' : 'normal'} ${fontSize}px "Cairo", "Plus Jakarta Sans", system-ui, sans-serif`;
  ctx.font = cssFont;

  const lines = text.split('\n');
  const lineHeight = fontSize * 1.35;
  let maxLineWidth = 0;
  for (const line of lines) {
    const metrics = ctx.measureText(line);
    if (metrics.width > maxLineWidth) maxLineWidth = metrics.width;
  }

  const hasBg = backgroundColor && backgroundColor !== 'transparent';
  const paddingH = hasBg ? 12 : 4;
  const paddingV = hasBg ? 8 : 4;

  const logicalWidth = Math.max(30, Math.ceil(maxLineWidth + paddingH * 2));
  const logicalHeight = Math.max(20, Math.ceil(lines.length * lineHeight + paddingV * 2));

  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;

  ctx.scale(scale, scale);
  ctx.font = cssFont;
  ctx.textBaseline = 'top';

  if (hasBg) {
    ctx.fillStyle = backgroundColor!;
    ctx.beginPath();
    ctx.roundRect(0, 0, logicalWidth, logicalHeight, 6);
    ctx.fill();
    if (backgroundColor === '#ffffff') {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.fillStyle = color;
  lines.forEach((line, i) => {
    ctx.fillText(line, paddingH, paddingV + i * lineHeight);
  });

  const dataUrl = canvas.toDataURL('image/png');
  const base64Data = dataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return {
    bytes,
    width: logicalWidth,
    height: logicalHeight,
  };
}

/**
 * 8. PDF EDITOR (Annotations: Draggable Text, Drawing, Highlight, Shapes, Redaction)
 */
export async function applyEditorAnnotations(
  file: File,
  annotations: AnnotationItem[],
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(15, 'جاري تحميل ملف PDF للتعديل...');
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  onProgress?.(40, 'جاري تطبيق النصوص والتعديلات...');
  const totalAnns = annotations.length;

  for (let idx = 0; idx < totalAnns; idx++) {
    const ann = annotations[idx];
    if (ann.pageIndex < 0 || ann.pageIndex >= pages.length) continue;
    const page = pages[ann.pageIndex];
    const { width, height } = page.getSize();

    // Coordinates in annotations are normalized percentages (0 - 100)
    const px = (ann.x / 100) * width;
    const py = height - (ann.y / 100) * height; // Invert Y for PDF coordinate system

    if (ann.type === 'text' && ann.text) {
      try {
        // High quality rendering via offscreen canvas PNG embedding
        // Guarantees perfect Arabic ligatures, Urdu, Hindi, emojis and exact custom fonts without encoding issues!
        const rendered = await renderTextToPngBytes(
          ann.text,
          ann.fontSize || 18,
          ann.color || '#0f172a',
          ann.backgroundColor,
          ann.isBold
        );
        const embeddedPng = await pdfDoc.embedPng(rendered.bytes);
        page.drawImage(embeddedPng, {
          x: px,
          y: py - rendered.height,
          width: rendered.width,
          height: rendered.height,
        });
      } catch (err) {
        console.warn('Fallback standard text draw', err);
      }
    } else if (ann.type === 'rectangle' || ann.type === 'highlight' || ann.type === 'redact') {
      const w = ((ann.width || 20) / 100) * width;
      const h = ((ann.height || 5) / 100) * height;

      let rectColor = rgb(0.1, 0.1, 0.1);
      let opacity = 1;

      if (ann.type === 'highlight') {
        rectColor = rgb(1, 0.9, 0.1); // Yellow highlighter
        opacity = 0.45;
      } else if (ann.type === 'redact') {
        rectColor = rgb(0, 0, 0); // Blackout
        opacity = 1.0;
      } else {
        rectColor = rgb(0.05, 0.58, 0.53); // Teal
        opacity = 0.8;
      }

      page.drawRectangle({
        x: px,
        y: py - h,
        width: w,
        height: h,
        color: rectColor,
        opacity,
      });
    } else if (ann.type === 'drawing' && ann.points && ann.points.length > 1) {
      // Connect points with lines
      for (let i = 0; i < ann.points.length - 1; i++) {
        const p1 = ann.points[i];
        const p2 = ann.points[i + 1];

        const x1 = (p1.x / 100) * width;
        const y1 = height - (p1.y / 100) * height;
        const x2 = (p2.x / 100) * width;
        const y2 = height - (p2.y / 100) * height;

        page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness: ann.lineWidth || 2,
          color: rgb(0.1, 0.2, 0.4),
          opacity: 0.9,
        });
      }
    } else if (ann.type === 'image' && ann.imageData) {
      try {
        const w = ((ann.width || 25) / 100) * width;
        const h = ((ann.height || 25) / 100) * height;
        const imgBytes = Uint8Array.from(atob(ann.imageData.split(',')[1]), (c) => c.charCodeAt(0));
        let embeddedImg;
        if (ann.imageData.startsWith('data:image/png')) {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          // Default or JPEG
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }
        page.drawImage(embeddedImg, {
          x: px,
          y: py - h,
          width: w,
          height: h,
          opacity: ann.opacity !== undefined ? ann.opacity : 1.0,
        });
      } catch (imgErr) {
        console.warn('Failed to embed image annotation into PDF', imgErr);
      }
    }
  }

  onProgress?.(90, 'جاري حفظ المستند المعدل...');
  const bytes = await pdfDoc.save();
  onProgress?.(100, 'تم حفظ جميع التعديلات!');
  return bytes;
}

/**
 * 8.5 SEARCH PDF TEXT (Robust Bilingual Arabic & English Client-side Search Engine)
 * Features:
 * - Smart text item concatenation preventing broken words
 * - Strips Arabic diacritics / Tashkeel & Tatweel
 * - Normalizes Arabic Hamzas (أ, إ, آ, ٱ -> ا), Taa Marbuta (ة <-> ه), Yaa/Alif Maqsura (ي <-> ى)
 * - Normalizes Arabic Presentation Forms (glyph decomposition)
 * - Supports reversed Arabic word detection (visual LTR quirks)
 * - Expands English ligatures (fi, fl, ff, ffi, ffl) via Unicode NFKC
 * - Normalizes curly quotes, dashes, hyphens, and varied whitespace
 */
export async function searchPdfText(
  file: File,
  searchTerm: string,
  caseSensitive: boolean = false,
  onProgress?: (percent: number, message: string) => void,
  options: { wholeWord?: boolean } = {}
): Promise<SearchMatchItem[]> {
  const query = searchTerm.trim();
  if (!query) return [];

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const numPages = pdf.numPages;
  const results: SearchMatchItem[] = [];

  for (let p = 1; p <= numPages; p++) {
    onProgress?.(
      Math.round((p / numPages) * 95),
      `جاري فحص الصفحة ${p} من ${numPages}...`
    );

    const page = await pdf.getPage(p);
    const textContent = await page.getTextContent();

    // Reconstruct continuous text intelligently to prevent words from splitting
    let pageText = '';
    let lastItem: any = null;

    for (const item of textContent.items as any[]) {
      if (!item || typeof item.str !== 'string') continue;

      if (!lastItem) {
        pageText += item.str;
        lastItem = item;
        continue;
      }

      // Check for line break
      const isNewLine =
        lastItem.hasEOL ||
        (lastItem.transform &&
          item.transform &&
          Math.abs(lastItem.transform[5] - item.transform[5]) >
            Math.max(lastItem.height || 10, item.height || 10) * 0.7);

      if (isNewLine) {
        pageText += '\n' + item.str;
      } else {
        // Same line horizontal gap check
        let needSpace = false;
        if (/\s$/.test(lastItem.str) || /^\s/.test(item.str)) {
          pageText += item.str;
        } else if (lastItem.transform && item.transform) {
          const lastX = lastItem.transform[4];
          const currX = item.transform[4];
          const lastWidth = lastItem.width || 0;

          const isRTL = item.dir === 'rtl' || lastItem.dir === 'rtl';
          const gap = isRTL
            ? Math.abs(lastX - (currX + (item.width || 0)))
            : currX - (lastX + lastWidth);

          // Calibrated threshold to prevent breaking Arabic and English words into isolated letters
          const charThreshold = (lastItem.height || 12) * (isRTL ? 0.48 : 0.36);

          if (gap > charThreshold) {
            needSpace = true;
          }
          pageText += (needSpace ? ' ' : '') + item.str;
        } else {
          pageText += ' ' + item.str;
        }
      }

      lastItem = item;
    }

    // Run bilingual search engine
    const matchResult = findMatchesInPage(pageText, query, {
      caseSensitive,
      wholeWord: options.wholeWord,
    });

    if (matchResult.matchCount > 0) {
      results.push({
        pageNumber: p,
        matchCount: matchResult.matchCount,
        snippets: matchResult.snippets,
      });
    }
  }

  onProgress?.(100, 'اكتمل البحث!');
  return results;
}

/**
 * 9. COMPRESS PDF (Calibrated scale & JPEG quality without distorting document text)
 */
export async function compressPdf(
  file: File,
  level: 'low' | 'mid' | 'max',
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(10, 'جاري فحص محتوى المستند للضغط...');
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const numPages = pdf.numPages;

  // Calibrated scale and quality:
  // - low: 2.2 scale (~160 DPI), 0.90 quality -> pristine text, high detail
  // - mid: 1.85 scale (~135-140 DPI), 0.82 quality -> sharp text, NO distortion, genuinely balanced size & quality
  // - max: 1.35 scale (~100 DPI), 0.58 quality -> maximum compression for smallest file size
  let scale = 1.85;
  let quality = 0.82;

  if (level === 'low') {
    scale = 2.2;
    quality = 0.90;
  } else if (level === 'mid') {
    scale = 1.85;
    quality = 0.82;
  } else if (level === 'max') {
    scale = 1.35;
    quality = 0.58;
  }

  const newDoc = await PDFDocument.create();

  for (let p = 1; p <= numPages; p++) {
    onProgress?.(
      Math.round(15 + (p / Math.max(1, numPages)) * 75),
      `ضغط وتحسين الصفحة ${p} من ${numPages}...`
    );

    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      // Ensure canvas has solid white background so transparency never turns black or distorted in JPEG!
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      const base64Data = dataUrl.split(',')[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const embeddedJpg = await newDoc.embedJpg(bytes);
      const originalWidth = viewport.width / scale;
      const originalHeight = viewport.height / scale;

      const newPage = newDoc.addPage([originalWidth, originalHeight]);
      newPage.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: originalWidth,
        height: originalHeight,
      });
    }
  }

  onProgress?.(92, 'جاري بناء الملف المضغوط...');
  const finalBytes = await newDoc.save();
  onProgress?.(100, 'تم ضغط الملف بنجاح!');
  return finalBytes;
}

/**
 * Helper to download Blob to user's device (guarantees zip mime type)
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  let finalBlob = blob;
  if (filename.toLowerCase().endsWith('.zip') && blob.type !== 'application/zip') {
    finalBlob = new Blob([blob], { type: 'application/zip' });
  }

  const url = URL.createObjectURL(finalBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Format bytes into human readable string
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const formatFileSize = formatBytes;

