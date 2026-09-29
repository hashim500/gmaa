import React, { useState } from 'react';
import {
  Type,
  Copy,
  CheckCircle2,
  ArrowRight,
  Coins,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { tafqeet, CURRENCIES, parseAmount } from '../../utils/tafqeet';

interface TafqeetToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const TafqeetTool: React.FC<TafqeetToolProps> = ({ t, onBack, onError }) => {
  const [amountStr, setAmountStr] = useState('1250.75');
  const [currencyCode, setCurrencyCode] = useState('SAR');
  const [useFraming, setUseFraming] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = tafqeet(amountStr, currencyCode, useFraming);
  const parsed = parseAmount(amountStr);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onError('تعذر نسخ النص تلقائياً، يرجى التحديد والنسخ يدوياً.');
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
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                كتابة المبلغ بالحروف (التفقيط المالي)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تحويل الأرقام والمبالغ إلى كلمات عربية فصحى معتمدة للشيكات والعقود والفواتير
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              المبلغ أو الرقم (حتى 15 رقماً وخانتين عشريتين)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="مثال: 15420.50"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              العملة المالية
            </label>
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="SAR">ريال سعودي (هللات)</option>
              <option value="AED">درهم إماراتي (فلس)</option>
              <option value="EGP">جنيه مصري (قروش)</option>
              <option value="KWD">دينار كويتي (فلس)</option>
              <option value="BHD">دينار بحريني (فلس)</option>
              <option value="OMR">ريال عماني (بيسة)</option>
              <option value="QAR">ريال قطري (درهم)</option>
              <option value="USD">دولار أمريكي (سنت)</option>
              <option value="EUR">يورو أوروبي (سنت)</option>
              <option value="">بدون عملة (أرقام مجردة)</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={useFraming}
              onChange={(e) => setUseFraming(e.target.checked)}
              className="h-4 w-4 rounded accent-teal-600 text-teal-600"
            />
            <span>إضافة عبارة التوثيق «فقط» و«لا غير» (تمنع التلاعب المالي)</span>
          </label>

          {/* Preset Samples */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">أمثلة:</span>
            {['100', '1500.50', '250000', '1000000'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAmountStr(s)}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Big Highlighted Output Box */}
        <div className="rounded-2xl border-2 border-teal-600/30 bg-teal-50/50 p-6 dark:border-teal-800/40 dark:bg-teal-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 text-xs font-bold">
              <Sparkles className="h-4 w-4" />
              <span>المبلغ كتابةً باللغة العربية:</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!result}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition active:scale-98"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ النص'}</span>
            </button>
          </div>

          <div
            className="min-h-20 rounded-xl bg-white p-4 text-base sm:text-lg font-black text-teal-950 shadow-inner dark:bg-slate-900 dark:text-teal-100 leading-relaxed"
            dir="rtl"
          >
            {result || (
              <span className="text-slate-400 font-normal text-sm">
                أدخل رقماً صحيحاً في الخانة بالأعلى لمعاينة النص هنا...
              </span>
            )}
          </div>

          {parsed && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
              <span>الجزء الصحيح: {parsed.int.toLocaleString('en-US')}</span>
              {parsed.frac > 0 && <span>الكسور / الهللات: {parsed.frac}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
