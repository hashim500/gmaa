import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Cake,
  Sparkles,
  ArrowLeftRight,
  Plus,
  Minus,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface DateCalculatorToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const DateCalculatorTool: React.FC<DateCalculatorToolProps> = ({ t, onBack, onError }) => {
  const [activeTab, setActiveTab] = useState<'age' | 'diff' | 'addsub'>('age');

  // 1. Age state
  const [birthDate, setBirthDate] = useState('1998-05-15');

  // 2. Diff state
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));

  // 3. Add/Sub state
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [operation, setOperation] = useState<'add' | 'sub'>('add');
  const [durationAmount, setDurationAmount] = useState<number>(30);
  const [durationUnit, setDurationUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');

  const [copied, setCopied] = useState<boolean>(false);

  // Formatters
  const fHijri = (d: Date) => {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return '';
    }
  };

  const fGregorian = (d: Date) => {
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  };

  // --- AGE CALCULATION ---
  const calculateAge = () => {
    if (!birthDate) return null;
    const b = new Date(birthDate);
    const now = new Date();
    if (isNaN(b.getTime()) || b > now) return null;

    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = now.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // Next Birthday
    let nextBday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      dayOfWeek: new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(b),
      birthHijri: fHijri(b),
      daysToNextBday,
    };
  };

  // --- DIFFERENCE CALCULATION ---
  const calculateDiff = () => {
    if (!startDate || !endDate) return null;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const earlier = d1 < d2 ? d1 : d2;
    const later = d1 < d2 ? d2 : d1;

    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = later.getTime() - earlier.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
    };
  };

  // --- ADD / SUBTRACT CALCULATION ---
  const calculateAddSub = () => {
    if (!baseDate) return null;
    const base = new Date(baseDate);
    if (isNaN(base.getTime())) return null;

    const sign = operation === 'add' ? 1 : -1;
    const result = new Date(base.getTime());

    if (durationUnit === 'days') {
      result.setDate(result.getDate() + sign * durationAmount);
    } else if (durationUnit === 'weeks') {
      result.setDate(result.getDate() + sign * durationAmount * 7);
    } else if (durationUnit === 'months') {
      result.setMonth(result.getMonth() + sign * durationAmount);
    } else if (durationUnit === 'years') {
      result.setFullYear(result.getFullYear() + sign * durationAmount);
    }

    return {
      iso: result.toISOString().slice(0, 10),
      gregorian: fGregorian(result),
      hijri: fHijri(result),
    };
  };

  const ageData = calculateAge();
  const diffData = calculateDiff();
  const addSubData = calculateAddSub();

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
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                حاسبة العمر والتواريخ الشاملة
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حساب العمر الدقيق، الفرق بين تاريخين، وإضافة أو طرح مدة بالهجري والميلادي
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-slate-200 p-1 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('age')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'age'
              ? 'bg-white text-teal-900 shadow-sm dark:bg-slate-900 dark:text-teal-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Cake className="h-4 w-4" />
          <span>حساب العمر الدقيق</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diff')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'diff'
              ? 'bg-white text-teal-900 shadow-sm dark:bg-slate-900 dark:text-teal-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>الفرق بين تاريخين</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addsub')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'addsub'
              ? 'bg-white text-teal-900 shadow-sm dark:bg-slate-900 dark:text-teal-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>إضافة أو طرح مدة</span>
        </button>
      </div>

      {/* Tab 1: AGE */}
      {activeTab === 'age' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              أدخل تاريخ ميلادك (ميلادي):
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {ageData ? (
            <div className="space-y-4">
              {/* Highlight Big Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900 dark:bg-teal-950/30">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-200">
                    {ageData.years}
                  </div>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-400">سنة</span>
                </div>

                <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900 dark:bg-teal-950/30">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-200">
                    {ageData.months}
                  </div>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-400">شهر</span>
                </div>

                <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900 dark:bg-teal-950/30">
                  <div className="font-mono text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-200">
                    {ageData.days}
                  </div>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-400">يوم</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-500 block mb-0.5">يوم الأسبوع لمولدك:</span>
                  <b className="text-slate-800 dark:text-slate-200 text-sm">{ageData.dayOfWeek}</b>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-500 block mb-0.5">التاريخ الهجري المقابل:</span>
                  <b className="text-slate-800 dark:text-slate-200 text-sm">{ageData.birthHijri}</b>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-slate-500 block mb-0.5">إجمالي الأيام المعاشة:</span>
                  <b className="text-slate-800 dark:text-slate-200 text-sm font-mono">
                    {ageData.totalDays.toLocaleString('en-US')} يوماً ({ageData.totalWeeks.toLocaleString('en-US')} أسبوعاً)
                  </b>
                </div>

                <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-3 text-xs dark:border-teal-900 dark:from-teal-950/20 dark:to-cyan-950/10">
                  <span className="text-teal-700 dark:text-teal-300 block mb-0.5 font-bold">
                    عيد ميلادك القادم:
                  </span>
                  <b className="text-teal-950 dark:text-teal-100 text-sm font-mono">
                    متبقي عليه {ageData.daysToNextBday} يوماً
                  </b>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">يرجى تحديد تاريخ ميلاد صالح لمعاينة العمر.</p>
          )}
        </div>
      )}

      {/* Tab 2: DIFF */}
      {activeTab === 'diff' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                التاريخ الأول:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                التاريخ الثاني:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {diffData && (
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border-2 border-teal-600/30 bg-teal-50/50 p-6 text-center dark:border-teal-900 dark:bg-teal-950/20">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block mb-2">
                  الفرق الإجمالي بين التاريخين:
                </span>
                <div className="text-lg sm:text-xl font-black text-teal-950 dark:text-teal-100">
                  {diffData.years > 0 && `${diffData.years} سنة `}
                  {diffData.months > 0 && `و ${diffData.months} شهر `}
                  {`و ${diffData.days} يوم`}
                </div>
                <div className="mt-3 text-xs text-slate-500 font-mono">
                  أي ما يعادل {diffData.totalDays.toLocaleString('en-US')} يوماً ({diffData.totalWeeks.toLocaleString('en-US')} أسبوعاً)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: ADD / SUB */}
      {activeTab === 'addsub' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                تاريخ البداية:
              </label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                العملية:
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="add">+ إضافة مدة</option>
                <option value="sub">− طرح مدة</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                المقدار والوحدة:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={durationAmount}
                  onChange={(e) => setDurationAmount(parseInt(e.target.value, 10) || 1)}
                  className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs font-mono font-bold text-center dark:border-slate-700 dark:bg-slate-800"
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value as any)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="days">يوم</option>
                  <option value="weeks">أسبوع</option>
                  <option value="months">شهر</option>
                  <option value="years">سنة</option>
                </select>
              </div>
            </div>
          </div>

          {addSubData && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30 space-y-3">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block">
                التاريخ الناتج بعد {operation === 'add' ? 'إضافة' : 'طرح'} {durationAmount} {durationUnit === 'days' ? 'أيام' : durationUnit === 'weeks' ? 'أسابيع' : durationUnit === 'months' ? 'أشهر' : 'سنوات'}:
              </span>
              <div className="text-xl sm:text-2xl font-black text-teal-950 dark:text-teal-100">
                {addSubData.gregorian}
              </div>
              <div className="text-sm font-bold text-teal-800 dark:text-teal-300">
                الموافق بالهجري: {addSubData.hijri}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
