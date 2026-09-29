import React, { useState } from 'react';
import {
  Eraser,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Clock,
  Trash2,
  Sparkles,
  AlignLeft,
  CheckCircle2,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface TextCleanerToolProps {
  t: TranslationDict;
  onBack: () => void;
}

interface LogItem {
  id: string;
  action: string;
  time: string;
  changed: boolean;
}

export const TextCleanerTool: React.FC<TextCleanerToolProps> = ({ t, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  const addLog = (actionName: string, changed: boolean) => {
    const time = new Date().toLocaleTimeString('ar-SA');
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        action: changed ? actionName : `${actionName} (لم يتم العثور على عناصر)`,
        time,
        changed,
      },
      ...prev,
    ]);
  };

  const clearLog = () => {
    setLogs([]);
  };

  const executeClean = (
    actionType:
      | 'removeDots'
      | 'removeCommas'
      | 'removeColons'
      | 'removeTashkeel'
      | 'removeTatweel'
      | 'removeSpaces'
      | 'removeNumbers'
      | 'removeBrackets'
      | 'removeEmptyLines'
      | 'normalizeAlef'
      | 'extremeClean',
    actionName: string
  ) => {
    const currentText = inputText;
    if (!currentText.trim()) return;

    let modified = currentText;

    switch (actionType) {
      case 'removeDots':
        modified = currentText.replace(/[.؁۔]/g, '');
        break;
      case 'removeCommas':
        modified = currentText.replace(/[،,]/g, '');
        break;
      case 'removeColons':
        modified = currentText.replace(/:/g, '');
        break;
      case 'removeTashkeel':
        modified = currentText.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');
        break;
      case 'removeTatweel':
        modified = currentText.replace(/ـ/g, '');
        break;
      case 'removeSpaces':
        modified = currentText.replace(/[ \t]+/g, ' ').replace(/\n +/g, '\n');
        break;
      case 'removeNumbers':
        modified = currentText.replace(/[0-9٠-٩]/g, '');
        break;
      case 'removeBrackets':
        modified = currentText.replace(/[\(\)\[\]\{\}<>«»""''""]/g, '');
        break;
      case 'removeEmptyLines':
        modified = currentText.replace(/^\s*[\r\n]/gm, '');
        break;
      case 'normalizeAlef':
        modified = currentText.replace(/[أإآ]/g, 'ا');
        break;
      case 'extremeClean':
        modified = currentText
          .replace(/[\u0617-\u061A\u064B-\u0652]/g, '')
          .replace(/ـ/g, '')
          .replace(/[.؁۔،,:\-_\(\)\[\]\{\}<>«»""''""!?;\/\\|~#@$%^&*+=]/g, '')
          .replace(/[0-9٠-٩]/g, '')
          .replace(/[أإآ]/g, 'ا')
          .replace(/[ \t]+/g, ' ')
          .trim();
        break;
    }

    const changed = modified !== currentText;
    setInputText(modified);
    setOutputText(modified);
    addLog(actionName, changed);
  };

  const copyResult = () => {
    const textToCopy = outputText || inputText;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const loadSample = () => {
    const sample =
      'هَـٰذَا نَصٌّ مِثَالِيٌّ... يَحْتَوِي عَلَى تَدْقِيقٍ، فواصل، ونقاط: 12345، مع [أقواس] وأرقام ١٢٣٤٥ وتطويـــل وحركات تشكيلية متعددة.';
    setInputText(sample);
    setOutputText(sample);
  };

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white shadow-md">
              <Eraser className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                منظف النصوص الفوري وسجل الحذف
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  تعديل فوري
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إزالة النقاط، الفواصل، التشكيل، التطويل، المسافات، الأرقام والأقواس مع سجل تدقيق مباشر
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>نص تجريبي</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Tools & Text (Left) and Deletion Log Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Text Inputs & Cleaning Buttons */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Input Text Area */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                النص (يتم التعديل عليه مباشرة):
              </label>
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setOutputText('');
                }}
                disabled={!inputText}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 disabled:opacity-40"
              >
                <RotateCcw className="h-3 w-3" />
                <span>مسح النص</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText(e.target.value);
              }}
              placeholder="ألصق النص هنا للبدء بالحذف والتنظيف الفوري..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 resize-y"
            />
          </div>

          {/* Quick Cleaning Tool Buttons Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              أدوات الحذف والتنظيف السريع (انقر لتنفيذ الإجراء فوراً):
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              <button
                type="button"
                onClick={() => executeClean('removeDots', 'حذف النقاط (.)')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                حذف النقاط (.)
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeCommas', 'حذف الفواصل (، ,)')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                حذف الفواصل (، ,)
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeColons', 'حذف النقطتين (:)')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                حذف النقطتين (:)
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeTashkeel', 'إزالة التشكيل والحركات')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                إزالة التشكيل
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeTatweel', 'إزالة التطويل والمد (ـ)')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                إزالة التطويل (ـ)
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeSpaces', 'إزالة المسافات المزدوجة')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                إزالة المسافات الزائدة
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeNumbers', 'حذف الأرقام (0-9 / ٠-٩)')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                حذف الأرقام
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeBrackets', 'حذف الأقواس والرموز')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                حذف الأقواس والرموز
              </button>

              <button
                type="button"
                onClick={() => executeClean('removeEmptyLines', 'حذف الأسطر الفارغة')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                حذف الأسطر الفارغة
              </button>

              <button
                type="button"
                onClick={() => executeClean('normalizeAlef', 'توحيد الألف (أ إ آ إلى ا)')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                توحيد الألف (أ إ آ)
              </button>
            </div>

            {/* Extreme Clean Master Button */}
            <button
              type="button"
              onClick={() => executeClean('extremeClean', 'تنظيف شامل ومجرد لكافة العناصر غير النصية')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 text-xs shadow-md shadow-teal-600/20 active:scale-98 transition cursor-pointer"
            >
              <Eraser className="h-4 w-4" />
              <span>تنظيف شامل وتجريد النص بالكامل (حذف الحركات، الأرقام والرموز معاً)</span>
            </button>
          </div>

          {/* Output Cleaned Text Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                النص النهائي المُنقح:
              </label>
              <button
                type="button"
                onClick={copyResult}
                disabled={!outputText && !inputText}
                className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300 disabled:opacity-40 transition cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>نسخ النص المنقح</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={5}
              value={outputText || inputText}
              readOnly
              placeholder="ستظهر النتيجة المنقحة هنا بعد إجراء أي عملية تنظيف..."
              className="w-full rounded-xl border border-slate-200 bg-slate-100/70 p-3.5 text-xs leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 resize-y focus:outline-none"
            />
          </div>
        </div>

        {/* Right Side: Real-time Deletion Log Sidebar */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between max-h-[620px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>سجل العمليات والتعديلات ({logs.length})</span>
              </span>
              {logs.length > 0 && (
                <button
                  type="button"
                  onClick={clearLog}
                  className="text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                >
                  مسح السجل
                </button>
              )}
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto max-h-[480px] pe-1">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  لم يتم تنفيذ أي عملية تنظيف بعد. انقر على أي زر لتسجيل التعديل هنا.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`rounded-xl border p-2.5 text-xs transition ${
                      log.changed
                        ? 'border-teal-200 bg-teal-50/60 text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{log.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">{log.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {logs.length > 0 && (
            <button
              type="button"
              onClick={clearLog}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>إفراغ سجل الحذف</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
