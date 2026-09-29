import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  Mic,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Layers,
  AlignLeft,
  Type,
  BookOpen,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface WordCounterToolProps {
  t: TranslationDict;
  onBack: () => void;
}

export const WordCounterTool: React.FC<WordCounterToolProps> = ({ t, onBack }) => {
  const [text, setText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Real-time statistics calculation
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed === '' ? [] : trimmed.split(/\s+/);
    const wordCount = words.length;

    const charCount = text.length;
    const charNoSpaceCount = text.replace(/\s/g, '').length;

    const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== '').length;
    const lines = text === '' ? 0 : text.split('\n').length;

    // Reading time: ~200 words per minute
    const readMinutes = Math.ceil(wordCount / 200);
    // Speaking / Speech time: ~130 words per minute
    const speechMinutes = Math.ceil(wordCount / 130);

    // Unique words
    const cleanWords = words.map((w) =>
      w.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, '')
    ).filter(Boolean);
    const uniqueWordsCount = new Set(cleanWords).size;

    return {
      wordCount,
      charCount,
      charNoSpaceCount,
      paragraphs,
      lines,
      readMinutes,
      speechMinutes,
      uniqueWordsCount,
    };
  }, [text]);

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const loadSample = () => {
    setText(
      'تعتبر القراءة والاطلاع من أهم وسائل اكتساب المعرفة وتنمية التفكير النقدي لدى الإنسان. من خلال القراءة المستمرة، يستطيع الفرد توسيع مداركه والتعرف على ثقافات وتجارب متعددة، مما يساهم في صقل مهارات التواصل وبناء محتوى كتابي رصين ومميز.'
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in-50 duration-300">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                عداد الكلمات والحروف وزمن القراءة
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  إحصاء فوري
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إحصائيات دقيقة ومباشرة لعدد الكلمات، الأحرف، الفقرات، الأسطر، وزمن الإلقاء والقراءة
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>نص تجريبي</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Words */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold">عدد الكلمات</span>
            <Type className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {stats.wordCount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            {stats.uniqueWordsCount} كلمة فريدة
          </div>
        </div>

        {/* Card 2: Characters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold">عدد الحروف</span>
            <AlignLeft className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {stats.charCount.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            ({stats.charNoSpaceCount.toLocaleString()} بدون مسافات)
          </div>
        </div>

        {/* Card 3: Paragraphs & Lines */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold">الفقرات / الأسطر</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium">
            ({stats.lines.toLocaleString()} سطر)
          </div>
        </div>

        {/* Card 4: Estimated Time */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-bold">وقت القراءة والإلقاء</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
            <span>{stats.readMinutes}</span>
            <span className="text-xs font-bold text-slate-500">دقيقة قراءة</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Mic className="h-3 w-3" />
            <span>إلقاء: {stats.speechMinutes} دقيقة</span>
          </div>
        </div>
      </div>

      {/* Main Text Editor Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            النص المراد تحليله:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyText}
              disabled={!text}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-40 transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>نسخ النص</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              disabled={!text}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 disabled:opacity-40 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>مسح</span>
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ألصق أو اكتب النص هنا لعرض الإحصائيات الفورية لعدد الكلمات، الحروف، الفقرات، وزمن القراءة..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800 resize-y"
        />

        {/* Extra Benchmark References */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>متوسط سرعة القراءة المعتمد عالمياً: <strong>200 كلمة / دقيقة</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>متوسط سرعة الخطابة والإلقاء: <strong>130 كلمة / دقيقة</strong></span>
          </div>
          <div className="font-mono text-slate-500">
            النسبة المئوية للكلمات الفريدة:{' '}
            <strong>
              {stats.wordCount > 0
                ? `${Math.round((stats.uniqueWordsCount / stats.wordCount) * 100)}%`
                : '0%'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
