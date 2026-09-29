import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Eraser,
  GitCompare,
  Calculator,
  Lock,
  Unlock,
  Copy,
  CheckCircle2,
  Sparkles,
  Download,
  FileText,
  Space,
  Type,
  WrapText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { diffWords, diffLines, Change } from 'diff';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload } from '../../utils/pdfUtils';

interface TextToolsProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

type TextTab = 'cleaner' | 'diff' | 'counter' | 'crypto';

export const TextTools: React.FC<TextToolsProps> = ({ t, onBack, onError }) => {
  const [activeTab, setActiveTab] = useState<TextTab>('cleaner');

  // 1. Text Cleaner State
  const [rawText, setRawText] = useState<string>('');
  const [cleanedText, setCleanedText] = useState<string>('');
  const [cleanerCopied, setCleanerCopied] = useState<boolean>(false);

  // 2. Diff Checker State
  const [oldText, setOldText] = useState<string>('مستند العقد الأصلي الصادر بتاريخ 2024.');
  const [newText, setNewText] = useState<string>('مستند العقد المعدل والمعتمد رسمياً الصادر بتاريخ 2025.');
  const [diffMode, setDiffMode] = useState<'words' | 'lines'>('words');

  // 3. Word Counter State
  const [counterInput, setCounterInput] = useState<string>('');

  // 4. Crypto State
  const [cryptoText, setCryptoText] = useState<string>('');
  const [cryptoPassword, setCryptoPassword] = useState<string>('');
  const [cryptoResult, setCryptoResult] = useState<string>('');
  const [cryptoCopied, setCryptoCopied] = useState<boolean>(false);

  // --- CLEANER LOGIC ---
  const applyCleaning = (
    mode: 'spaces' | 'tashkeel' | 'lines' | 'tatweel' | 'alef' | 'hindi' | 'western' | 'all'
  ) => {
    let txt = rawText;
    if (!txt) return;

    if (mode === 'spaces' || mode === 'all') {
      txt = txt.replace(/[ \t]+/g, ' ');
    }
    if (mode === 'tashkeel' || mode === 'all') {
      // Remove arabic vowels and harakat
      txt = txt.replace(/[\u064B-\u065F\u0670]/g, '');
    }
    if (mode === 'tatweel' || mode === 'all') {
      // Remove arabic tatweel / kashida (ـ)
      txt = txt.replace(/\u0640/g, '');
    }
    if (mode === 'alef' || mode === 'all') {
      // Normalize different forms of Alef (أ, إ, آ -> ا)
      txt = txt.replace(/[أإآ]/g, 'ا');
    }
    if (mode === 'hindi') {
      // Convert English/Western digits to Arabic-Indic (012 -> ٠١٢)
      txt = txt.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
    }
    if (mode === 'western') {
      // Convert Arabic/Eastern digits to Western (٠١٢ -> 012)
      txt = txt
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    }
    if (mode === 'lines' || mode === 'all') {
      txt = txt
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .join('\n');
    }

    setCleanedText(txt.trim());
  };

  const copyCleaned = async () => {
    if (!cleanedText) return;
    await navigator.clipboard.writeText(cleanedText);
    setCleanerCopied(true);
    setTimeout(() => setCleanerCopied(false), 2500);
  };

  // --- DIFF LOGIC ---
  const diffResult = useMemo(() => {
    if (diffMode === 'lines') {
      return diffLines(oldText, newText);
    }
    return diffWords(oldText, newText);
  }, [oldText, newText, diffMode]);

  const diffStats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    diffResult.forEach((part) => {
      const count = part.value.trim().split(/\s+/).filter(Boolean).length;
      if (part.added) added += count;
      else if (part.removed) removed += count;
      else unchanged += count;
    });

    return { added, removed, unchanged };
  }, [diffResult]);

  // --- COUNTER LOGIC ---
  const stats = useMemo(() => {
    const trimmed = counterInput.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const charsWithSpaces = counterInput.length;
    const charsNoSpaces = counterInput.replace(/\s+/g, '').length;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
    const lines = trimmed ? counterInput.split('\n').length : 0;

    // Average reading speed: 180 words/min
    const readMinutes = Math.ceil(words / 180);
    // Speaking speed: 130 words/min
    const speakMinutes = Math.ceil(words / 130);

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      paragraphs,
      lines,
      readMinutes,
      speakMinutes,
    };
  }, [counterInput]);

  // --- CRYPTO LOGIC (Web Crypto API AES-GCM) ---
  const getKeyMaterial = async (password: string): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
  };

  const deriveKey = async (keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> => {
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleEncrypt = async () => {
    if (!cryptoText || !cryptoPassword) {
      onError('يرجى إدخال النص المطلوب تشفيره وكلمة المرور.');
      return;
    }

    try {
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const keyMaterial = await getKeyMaterial(cryptoPassword);
      const key = await deriveKey(keyMaterial, salt);

      const enc = new TextEncoder();
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(cryptoText)
      );

      // Package into single base64: salt (16) + iv (12) + ciphertext
      const totalLen = salt.length + iv.length + encrypted.byteLength;
      const combined = new Uint8Array(totalLen);
      combined.set(salt, 0);
      combined.set(iv, 16);
      combined.set(new Uint8Array(encrypted), 28);

      const base64 = btoa(String.fromCharCode(...combined));
      setCryptoResult(base64);
    } catch (err: any) {
      onError(err?.message || 'فشل تشفير النص');
    }
  };

  const handleDecrypt = async () => {
    if (!cryptoText || !cryptoPassword) {
      onError('يرجى إدخال النص المشفر وكلمة المرور.');
      return;
    }

    try {
      const binary = atob(cryptoText.trim());
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      if (bytes.length < 28) {
        throw new Error('صيغة النص المشفر غير صالحة.');
      }

      const salt = bytes.slice(0, 16);
      const iv = bytes.slice(16, 28);
      const ciphertext = bytes.slice(28);

      const keyMaterial = await getKeyMaterial(cryptoPassword);
      const key = await deriveKey(keyMaterial, salt);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      setCryptoResult(dec.decode(decrypted));
    } catch (err: any) {
      onError('كلمة المرور غير صحيحة أو النص المدخل غير صالح لفك التشفير.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToTools}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>مجموعة أدوات المستندات والنصوص</span>
        </span>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
          {[
            { id: 'cleaner', label: 'منظف ومصحح النصوص', icon: Eraser },
            { id: 'diff', label: 'مقارنة الفروق (Diff)', icon: GitCompare },
            { id: 'counter', label: 'عداد الكلمات والوقت', icon: Calculator },
            { id: 'crypto', label: 'تشفير النصوص (AES)', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TextTab)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                  isActive
                    ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TEXT CLEANER */}
        {activeTab === 'cleaner' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Eraser className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  منظف ومنسق النصوص للطباعة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  إزالة المسافات المزدوجة، تشكيل الحركات، التطويل والأسطر الفارغة بضغطة واحدة
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                النص المدخل:
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="ألصق النص هنا للبدء بالتنظيف والتهيئة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Quick Clean Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyCleaning('spaces')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Space className="h-3.5 w-3.5" />
                <span>إزالة المسافات المزدوجة</span>
              </button>

              <button
                type="button"
                onClick={() => applyCleaning('tashkeel')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Type className="h-3.5 w-3.5" />
                <span>إزالة التشكيل</span>
              </button>

              <button
                type="button"
                onClick={() => applyCleaning('tatweel')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <WrapText className="h-3.5 w-3.5" />
                <span>إزالة التطويل (ـ)</span>
              </button>

              <button
                type="button"
                onClick={() => applyCleaning('lines')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <WrapText className="h-3.5 w-3.5" />
                <span>حذف الأسطر الفارغة</span>
              </button>

              <button
                type="button"
                onClick={() => applyCleaning('alef')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Type className="h-3.5 w-3.5" />
                <span>توحيد الألف (أ إ آ إلى ا)</span>
              </button>

              <button
                type="button"
                onClick={() => applyCleaning('hindi')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>أرقام عربية مشرقية (٠١٢)</span>
              </button>

              <button
                type="button"
                onClick={() => applyCleaning('western')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>أرقام إنجليزية (012)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => applyCleaning('all')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99]"
            >
              <Sparkles className="h-4 w-4" />
              <span>تنظيف شامل وتنسيق بضغطة زر واحدة</span>
            </button>

            {/* Cleaned Result Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  النص بعد التنظيف:
                </label>
                {cleanedText && (
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      {cleanedText.length} حرف | {cleanedText.split(/\s+/).filter(Boolean).length} كلمة
                    </span>
                    <button
                      type="button"
                      onClick={copyCleaned}
                      className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      {cleanerCopied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>نسخ النص</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <textarea
                readOnly
                rows={5}
                value={cleanedText}
                placeholder="ستظهر النتيجة المنظفة هنا..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {/* TAB 2: DIFF CHECKER */}
        {activeTab === 'diff' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <GitCompare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    مقارنة النصوص وتتبع الفروق
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    كشف الإضافات والتعديلات بين نسختين من العقود والمستندات
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setDiffMode('words')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    diffMode === 'words'
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  بالكلمات
                </button>
                <button
                  type="button"
                  onClick={() => setDiffMode('lines')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    diffMode === 'lines'
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  بالأسطر
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  النسخة الأصلية:
                </label>
                <textarea
                  rows={6}
                  value={oldText}
                  onChange={(e) => setOldText(e.target.value)}
                  placeholder="أدخل النص الأصلي..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  النسخة المعدلة:
                </label>
                <textarea
                  rows={6}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="أدخل النسخة المعدلة..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold dark:border-slate-800 dark:bg-slate-800/60">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>+ {diffStats.added} كلمة مضافة</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>- {diffStats.removed} كلمة محذوفة</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>= {diffStats.unchanged} كلمة مطابقة</span>
              </span>
            </div>

            {/* Output Visual Diff */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                تقرير الفروق المفصل (الأخضر: مضاف ، الأحمر: محذوف):
              </label>
              <div className="min-h-[140px] max-h-[300px] overflow-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100">
                {diffResult.map((part: Change, idx: number) => {
                  if (part.added) {
                    return (
                      <span
                        key={idx}
                        className="rounded bg-emerald-100 px-1 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  if (part.removed) {
                    return (
                      <span
                        key={idx}
                        className="rounded bg-rose-100 px-1 py-0.5 text-rose-800 line-through dark:bg-rose-950 dark:text-rose-300"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={idx}>{part.value}</span>;
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WORD COUNTER */}
        {activeTab === 'counter' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  عداد الكلمات والحروف وزمن القراءة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  إحصائيات فورية للأحرف، الكلمات، الفقرات، وزمن الإلقاء والقراءة
                </p>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="block text-[11px] font-bold text-slate-400">عدد الكلمات</span>
                <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
                  {stats.words.toLocaleString('ar')}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="block text-[11px] font-bold text-slate-400">عدد الحروف</span>
                <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
                  {stats.charsWithSpaces.toLocaleString('ar')}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  ({stats.charsNoSpaces} بدون مسافات)
                </span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="block text-[11px] font-bold text-slate-400">الفقرات / الأسطر</span>
                <span className="text-2xl font-black text-slate-700 dark:text-slate-200">
                  {stats.paragraphs}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  ({stats.lines} سطر)
                </span>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="block text-[11px] font-bold text-slate-400">وقت القراءة التقديري</span>
                <span className="text-2xl font-black text-slate-700 dark:text-slate-200">
                  {stats.readMinutes ? `${stats.readMinutes} د` : '0 د'}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  (إلقاء: {stats.speakMinutes} د)
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                النص المراد تحليله:
              </label>
              <textarea
                rows={8}
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                placeholder="ألصق أو اكتب النص هنا لعرض الإحصائيات الفورية..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {/* TAB 4: CRYPTO AES */}
        {activeTab === 'crypto' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  تشفير وفك تشفير النصوص (AES-256)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تشفير عالي الأمان محلياً داخل جهازك عبر معيار Web Crypto API دون اتصال بأي خادم
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                النص (المطلوب تشفيره أو فك تشفيره):
              </label>
              <textarea
                rows={3}
                value={cryptoText}
                onChange={(e) => setCryptoText(e.target.value)}
                placeholder="أدخل النص الأصلي للتشفير أو النص المشفر..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                كلمة المرور / المفتاح السري:
              </label>
              <input
                type="password"
                value={cryptoPassword}
                onChange={(e) => setCryptoPassword(e.target.value)}
                placeholder="أدخل كلمة مرور قوية لحماية النص..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleEncrypt}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99]"
              >
                <Lock className="h-4 w-4" />
                <span>تشفير النص</span>
              </button>

              <button
                type="button"
                onClick={handleDecrypt}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-900 active:scale-[0.99] dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <Unlock className="h-4 w-4" />
                <span>فك التشفير</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  النتيجة:
                </label>
                {cryptoResult && (
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(cryptoResult);
                      setCryptoCopied(true);
                      setTimeout(() => setCryptoCopied(false), 2500);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                  >
                    {cryptoCopied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>نسخ النتيجة</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                rows={3}
                value={cryptoResult}
                placeholder="ستظهر النتيجة المشفرة أو النص بعد فك التشفير هنا..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
