import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Moon,
  Sun,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowLeftRight,
  Info,
  Clock,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface HijriConverterToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

const HIJRI_MONTHS = [
  'المحرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const HijriConverterTool: React.FC<HijriConverterToolProps> = ({ onBack }) => {
  // Formatters
  const fHijriFull = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const fGregFull = new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const pHijriParts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const getHijriOfDate = (d: Date) => {
    const o: Record<string, number> = {};
    pHijriParts.formatToParts(d).forEach((p) => {
      if (['day', 'month', 'year'].includes(p.type)) o[p.type] = +p.value;
    });
    return { day: o.day || 1, month: o.month || 1, year: o.year || 1446 };
  };

  // Algorithmic reverse conversion: Hijri to Gregorian
  const hijriToGregorian = (y: number, m: number, d: number): Date | null => {
    const est = Date.UTC(622, 6, 19) + ((y - 1) * 354.367 + (m - 1) * 29.53 + (d - 1)) * 864e5;
    const base = Math.floor(est / 864e5) * 864e5 + 432e5;
    for (let k = -40; k <= 40; k++) {
      const t = new Date(base + k * 864e5);
      const h = getHijriOfDate(t);
      if (h.year === y && h.month === m && h.day === d) return t;
    }
    return null;
  };

  // States
  const [todayHijriText, setTodayHijriText] = useState<string>('');
  const [todayGregText, setTodayGregText] = useState<string>('');

  // 1. Greg to Hijri
  const [gregInput, setGregInput] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [gregToHijriResult, setGregToHijriResult] = useState<string>('');
  const [copiedG2H, setCopiedG2H] = useState<boolean>(false);

  // 2. Hijri to Greg
  const [hijriDay, setHijriDay] = useState<number>(1);
  const [hijriMonth, setHijriMonth] = useState<number>(1);
  const [hijriYear, setHijriYear] = useState<number>(1446);
  const [hijriToGregResult, setHijriToGregResult] = useState<string>('');
  const [copiedH2G, setCopiedH2G] = useState<boolean>(false);

  // Initialize Today
  useEffect(() => {
    const now = new Date();
    const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12));
    setTodayHijriText(fHijriFull.format(utcDate) + ' هـ');
    setTodayGregText(fGregFull.format(utcDate) + ' م');

    const h = getHijriOfDate(utcDate);
    setHijriDay(h.day);
    setHijriMonth(h.month);
    setHijriYear(h.year);
  }, []);

  // Update Greg -> Hijri
  useEffect(() => {
    if (!gregInput) {
      setGregToHijriResult('');
      return;
    }
    const [y, m, d] = gregInput.split('-').map(Number);
    if (!y || !m || !d) return;

    const utcDate = new Date(Date.UTC(y, m - 1, d, 12));
    const result = fHijriFull.format(utcDate) + ' هـ';
    setGregToHijriResult(result);
  }, [gregInput]);

  // Update Hijri -> Greg
  useEffect(() => {
    if (!hijriDay || !hijriMonth || !hijriYear) {
      setHijriToGregResult('');
      return;
    }
    const gDate = hijriToGregorian(hijriYear, hijriMonth, hijriDay);
    if (gDate) {
      setHijriToGregResult(fGregFull.format(gDate) + ' م');
    } else {
      setHijriToGregResult('تاريخ هجري غير صالح لهذا الشهر أو السنة.');
    }
  }, [hijriDay, hijriMonth, hijriYear]);

  const handleCopy = async (text: string, isH2G: boolean) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (isH2G) {
        setCopiedH2G(true);
        setTimeout(() => setCopiedH2G(false), 2000);
      } else {
        setCopiedG2H(true);
        setTimeout(() => setCopiedG2H(false), 2000);
      }
    } catch (e) {
      console.error(e);
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
                <Calendar className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                محوّل التاريخ الهجري والميلادي
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                تقويم أم القرى
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              تحويل فوري ودقيق بين التقويمين الهجري والميلادي مع عرض تاريخ اليوم الرسمي.
            </p>
          </div>
        </div>
      </div>

      {/* Today Banner */}
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-cyan-50/80 p-5 shadow-sm dark:border-teal-900/50 dark:from-teal-950/40 dark:to-cyan-950/30">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300">
          <Clock className="h-4 w-4 text-teal-600" />
          <span>تاريخ اليوم الرسمي:</span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-3 text-base sm:text-lg font-black text-slate-900 dark:text-white">
          <span className="text-teal-700 dark:text-teal-300">{todayHijriText}</span>
          <span className="text-slate-400 font-normal">يوافقه</span>
          <span className="text-slate-700 dark:text-slate-200">{todayGregText}</span>
        </div>
      </div>

      {/* Two Conversion Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 1. Gregorian to Hijri */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Sun className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                من ميلادي إلى هجري
              </h3>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                اختر التاريخ الميلادي:
              </label>
              <input
                type="date"
                value={gregInput}
                onChange={(e) => setGregInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Output Result */}
            <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/50 p-4 dark:border-teal-900/50 dark:bg-teal-950/30">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                التاريخ الهجري المقابل (أم القرى):
              </span>
              <div className="mt-1 text-base font-black text-teal-800 dark:text-teal-200">
                {gregToHijriResult || '—'}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => handleCopy(gregToHijriResult, false)}
              disabled={!gregToHijriResult}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
            >
              {copiedG2H ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>نسخ التاريخ الهجري</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Hijri to Gregorian */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Moon className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                من هجري إلى ميلادي
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  اليوم:
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={hijriDay}
                  onChange={(e) => setHijriDay(Math.max(1, Math.min(30, Number(e.target.value))))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-center text-sm font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الشهر:
                </label>
                <select
                  value={hijriMonth}
                  onChange={(e) => setHijriMonth(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {HIJRI_MONTHS.map((mName, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {mName} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  السنة:
                </label>
                <input
                  type="number"
                  min="1300"
                  max="1600"
                  value={hijriYear}
                  onChange={(e) => setHijriYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-center text-sm font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Output Result */}
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                التاريخ الميلادي المقابل:
              </span>
              <div className="mt-1 text-base font-black text-indigo-900 dark:text-indigo-200">
                {hijriToGregResult || '—'}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => handleCopy(hijriToGregResult, true)}
              disabled={!hijriToGregResult || hijriToGregResult.includes('غير صالح')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {copiedH2G ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>نسخ التاريخ الميلادي</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notice / Hint */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-teal-600" />
        <p className="leading-relaxed">
          التقويم المعتمد هو تقويم أم القرى الفلكي الرسمي في المملكة العربية السعودية. قد يختلف التاريخ يوماً واحداً وفقاً لرؤية الهلال الشرعية لبدايات الأشهر القمرية.
        </p>
      </div>
    </div>
  );
};
