import * as pdfjsLib from 'pdfjs-dist';

// In modern Vite environments, use the built-in worker bundled with pdfjs-dist
// or fallback to reliable jsdelivr/cdnjs modern .min.mjs module worker.
if (typeof window !== 'undefined' && 'GlobalWorkerOptions' in pdfjsLib) {
  try {
    // Attempt local Vite worker URL resolution
    const localWorkerUrl = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
    pdfjsLib.GlobalWorkerOptions.workerSrc = localWorkerUrl;
  } catch {
    const version = pdfjsLib.version || '6.3.289';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  }
}

export { pdfjsLib };
