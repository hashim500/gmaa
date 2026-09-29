import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  ArrowRight,
  ArrowLeftRight,
  RotateCcw,
  Copy,
  Check,
  Printer,
  Upload,
  Layers,
  Columns,
  Filter,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface TextCompareToolProps {
  t: TranslationDict;
  onBack: () => void;
}

export const TextCompareTool: React.FC<TextCompareToolProps> = ({ t, onBack }) => {
  const [originalText, setOriginalText] = useState(
    'مستند العقد الأصلي الصادر بتاريخ 2024 والمتفق عليه بين الطرفين.'
  );
  const [modifiedText, setModifiedText] = useState(
    'مستند العقد المعدل والمعتمد رسمياً الصادر بتاريخ 2025 مع إضافة شروط جزائية جديدة والتزامات سداد موثقة.'
  );
  const [viewMode, setViewMode] = useState<'unified' | 'side'>('unified');
  const [filterMode, setFilterMode] = useState<'all' | 'added' | 'deleted'>('all');
  const [isCopied, setIsCopied] = useState(false);

  // File loading helper
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setter(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  // Swap texts
  const swapTexts = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  // Clear texts
  const clearAll = () => {
    setOriginalText('');
    setModifiedText('');
  };

  // Word-level diff calculation
  const diffResult = useMemo(() => {
    const origWords = originalText.split(/\s+/).filter(Boolean);
    const modWords = modifiedText.split(/\s+/).filter(Boolean);
    const linesCount = Math.max(
      originalText.split('\n').length,
      modifiedText.split('\n').length
    );

    let addedCount = 0;
    let deletedCount = 0;
    let matchCount = 0;

    interface DiffToken {
      type: 'match' | 'added' | 'deleted';
      text: string;
    }

    const unifiedTokens: DiffToken[] = [];
    const sideModTokens: DiffToken[] = [];
    const sideOrigTokens: DiffToken[] = [];

    let i = 0;
    let j = 0;

    while (i < modWords.length || j < origWords.length) {
      if (
        i < modWords.length &&
        j < origWords.length &&
        modWords[i] === origWords[j]
      ) {
        unifiedTokens.push({ type: 'match', text: modWords[i] });
        sideModTokens.push({ type: 'match', text: modWords[i] });
        sideOrigTokens.push({ type: 'match', text: origWords[j] });
        matchCount++;
        i++;
        j++;
      } else {
        let foundInOrig = -1;
        if (i < modWords.length) {
          foundInOrig = origWords.indexOf(modWords[i], j);
        }

        if (foundInOrig !== -1 && foundInOrig - j < 4) {
          while (j < foundInOrig) {
            unifiedTokens.push({ type: 'deleted', text: origWords[j] });
            sideOrigTokens.push({ type: 'deleted', text: origWords[j] });
            deletedCount++;
            j++;
          }
        } else {
          if (i < modWords.length) {
            unifiedTokens.push({ type: 'added', text: modWords[i] });
            sideModTokens.push({ type: 'added', text: modWords[i] });
            addedCount++;
            i++;
          }
          if (j < origWords.length) {
            unifiedTokens.push({ type: 'deleted', text: origWords[j] });
            sideOrigTokens.push({ type: 'deleted', text: origWords[j] });
            deletedCount++;
            j++;
          }
        }
      }
    }

    const totalWords = Math.max(origWords.length, modWords.length, 1);
    const matchPercentage = Math.round((matchCount / totalWords) * 100);

    return {
      unifiedTokens,
      sideModTokens,
      sideOrigTokens,
      addedCount,
      deletedCount,
      matchCount,
      linesCount,
      matchPercentage,
    };
  }, [originalText, modifiedText]);

  // Filtered tokens
  const displayedUnifiedTokens = useMemo(() => {
    if (filterMode === 'added') {
      return diffResult.unifiedTokens.filter((t) => t.type !== 'deleted');
    }
    if (filterMode === 'deleted') {
      return diffResult.unifiedTokens.filter((t) => t.type !== 'added');
    }
    return diffResult.unifiedTokens;
  }, [diffResult.unifiedTokens, filterMode]);

  const copyReport = () => {
    const plainText = displayedUnifiedTokens
      .map((t) => (t.type === 'deleted' ? `[-${t.text}-]` : t.type === 'added' ? `[+${t.text}+]` : t.text))
      .join(' ');

    navigator.clipboard.writeText(plainText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Header Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                أداة مقارنة وتتبع فروق العقود والمستندات
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  كشف التغييرات
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                كشف الإضافات، الحذف، والتعديلات بين النسخ بدقة عالية مع تقارير إحصائية متكاملة
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapTexts}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-sky-600" />
            <span>تبديل النسختين</span>
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>مسح الكل</span>
          </button>
        </div>
      </div>

      {/* 2 Inputs Grid: Original vs Modified */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Original Text */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>النسخة الأصلية (Original Document):</span>
            </span>
            <label className="cursor-pointer text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium">
              <Upload className="h-3.5 w-3.5" />
              <span>رفع ملف</span>
              <input
                type="file"
                accept=".txt,.doc,.docx,.md,.json"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setOriginalText)}
              />
            </label>
          </div>
          <textarea
            rows={5}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="الصق النسخة الأصلية هنا أو ارفع ملف النص..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 resize-y"
          />
        </div>

        {/* Modified Text */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>النسخة المعدلة (Modified Document):</span>
            </span>
            <label className="cursor-pointer text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium">
              <Upload className="h-3.5 w-3.5" />
              <span>رفع ملف</span>
              <input
                type="file"
                accept=".txt,.doc,.docx,.md,.json"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setModifiedText)}
              />
            </label>
          </div>
          <textarea
            rows={5}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            placeholder="الصق النسخة المعدلة هنا لاكتشاف الإضافات والتعديلات..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 resize-y"
          />
        </div>
      </div>

      {/* Advanced Statistical Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] text-slate-400 font-medium">نسبة التطابق</div>
          <div className="text-xl font-black text-sky-600 dark:text-sky-400 font-mono mt-0.5">
            {diffResult.matchPercentage}%
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center dark:border-emerald-950 dark:bg-emerald-950/20">
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            + كلمات مضافة
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
            {diffResult.addedCount}
          </div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center dark:border-rose-950 dark:bg-rose-950/20">
          <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
            - كلمات محذوفة
          </div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-300 font-mono mt-0.5">
            {diffResult.deletedCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] text-slate-400 font-medium">كلمات متطابقة</div>
          <div className="text-xl font-black text-slate-700 dark:text-slate-300 font-mono mt-0.5">
            {diffResult.matchCount}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-[11px] text-slate-400 font-medium">إجمالي الأسطر</div>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
            {diffResult.linesCount}
          </div>
        </div>
      </div>

      {/* Toolbar: View Mode & Filters */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">طريقة العرض:</span>
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === 'unified'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>تقرير مدمج</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === 'side'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>جنباً إلى جنب</span>
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">تصفية الفروق:</span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'added', label: 'الإضافات فقط (+)' },
            { id: 'deleted', label: 'المحذوفات فقط (-)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterMode(f.id as any)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                filterMode === f.id
                  ? 'bg-sky-100 text-sky-800 font-bold dark:bg-sky-950 dark:text-sky-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Copy & Print */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyReport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{isCopied ? 'تم النسخ' : 'نسخ التقرير'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Diff Result Viewport */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            تقرير الفروق المفصل:
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>نص مضاف</span>
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>نص محذوف</span>
            </span>
          </div>
        </div>

        {viewMode === 'unified' ? (
          /* Unified View */
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-5 leading-loose text-sm dark:border-slate-800 dark:bg-slate-950/60 min-h-[140px]">
            {displayedUnifiedTokens.length === 0 ? (
              <span className="text-slate-400">لا توجد فروق مطابقة للعرض</span>
            ) : (
              displayedUnifiedTokens.map((token, idx) => {
                if (token.type === 'added') {
                  return (
                    <span
                      key={idx}
                      className="mx-0.5 inline-block rounded bg-emerald-100 px-1 py-0.5 text-emerald-800 font-semibold dark:bg-emerald-950/80 dark:text-emerald-300"
                    >
                      {token.text}{' '}
                    </span>
                  );
                }
                if (token.type === 'deleted') {
                  return (
                    <span
                      key={idx}
                      className="mx-0.5 inline-block rounded bg-rose-100 px-1 py-0.5 text-rose-800 line-through dark:bg-rose-950/80 dark:text-rose-300"
                    >
                      {token.text}{' '}
                    </span>
                  );
                }
                return <span key={idx}>{token.text} </span>;
              })
            )}
          </div>
        ) : (
          /* Side-by-Side View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 leading-loose text-xs dark:border-slate-800 dark:bg-slate-950/60 min-h-[140px]">
              <div className="text-[11px] font-bold text-slate-400 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                النسخة المعدلة (مع تمييز الإضافات)
              </div>
              {diffResult.sideModTokens.map((token, idx) => (
                <span
                  key={idx}
                  className={
                    token.type === 'added'
                      ? 'mx-0.5 inline-block rounded bg-emerald-100 px-1 py-0.5 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                      : ''
                  }
                >
                  {token.text}{' '}
                </span>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 leading-loose text-xs dark:border-slate-800 dark:bg-slate-950/60 min-h-[140px]">
              <div className="text-[11px] font-bold text-slate-400 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                النسخة الأصلية (مع تمييز المحذوفات)
              </div>
              {diffResult.sideOrigTokens.map((token, idx) => (
                <span
                  key={idx}
                  className={
                    token.type === 'deleted'
                      ? 'mx-0.5 inline-block rounded bg-rose-100 px-1 py-0.5 text-rose-800 line-through font-semibold dark:bg-rose-950 dark:text-rose-300'
                      : ''
                  }
                >
                  {token.text}{' '}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
