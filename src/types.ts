export type SupportedLanguage = 'ar' | 'en' | 'es' | 'hi' | 'ur';

export type LegalPageId =
  | 'privacy'
  | 'terms'
  | 'about'
  | 'contact'
  | 'cookies'
  | 'disclaimer';

export type ToolId =
  | 'merge'
  | 'split'
  | 'rotate'
  | 'organize'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'watermark'
  | 'protect'
  | 'edit'
  | 'compress'
  | 'search-text'
  | 'cv-builder'
  | 'cv-modern'
  | 'cv-table'
  | 'cv-classic'
  | 'badge-generator'
  | 'stamp-remover'
  | 'image-tools'
  | 'text-tools'
  | 'qr-generator'
  | 'redact'
  | 'sign'
  | 'ocr'
  | 'id-photo'
  | 'hijri'
  | 'metadata-cleaner'
  | 'invoice'
  | 'voucher'
  | 'vat-calculator'
  | 'tafqeet'
  | 'nup'
  | 'pdf-grayscale'
  | 'image-watermark'
  | 'social-crop'
  | 'stitch-images'
  | 'date-calculator'
  | 'clearance'
  | 'payroll'
  | 'text-crypto'
  | 'word-counter'
  | 'text-compare'
  | 'page-numbering'
  | 'text-cleaner';

export interface ToolDefinition {
  id: ToolId;
  titleKey: string;
  descriptionKey: string;
  badgeKey?: string;
  iconName: string;
  category: 'organize' | 'convert' | 'security' | 'edit' | 'search' | 'cv' | 'badge' | 'text' | 'utility' | 'business';
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
}

export interface PDFPageInfo {
  pageIndex: number; // 0-based
  pageNumber: number; // 1-based
  rotation: number; // 0, 90, 180, 270
  previewUrl?: string;
  deleted?: boolean;
}

export interface SplitRange {
  id: string;
  from: number;
  to: number;
}

export interface AnnotationItem {
  id: string;
  type: 'text' | 'drawing' | 'highlight' | 'rectangle' | 'redact' | 'image';
  pageIndex: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  isBold?: boolean;
  points?: { x: number; y: number }[];
  lineWidth?: number;
  opacity?: number;
  imageData?: string;
}

export interface SearchMatchItem {
  pageNumber: number; // 1-based
  matchCount: number;
  snippets: string[];
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number; // 0 - 100
  statusMessage: string;
}

export interface ProcessedResult {
  blob: Blob;
  filename: string;
  originalSize?: number;
  newSize?: number;
  type: 'pdf' | 'zip' | 'image' | 'text';
}

export type RedactEffectType =
  | 'black'
  | 'white'
  | 'blur'
  | 'label'
  | 'transparent'
  | 'strike'
  | 'red'
  | 'custom';

export interface RedactBoxItem {
  id: string;
  pageNumber: number; // 1-based
  x: number; // in canvas coordinate space
  y: number;
  width: number;
  height: number;
  type: RedactEffectType;
  labelText?: string;
  highlightColor?: string;
  customColor?: string;
}

