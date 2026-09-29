import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  ArrowRight,
  Copy,
  CheckCircle2,
  TrendingUp,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { tafqeet, parseAmount } from '../../utils/tafqeet';

interface VatCalculatorToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const VatCalculatorTool: React.FC<VatCalculatorToolProps> = ({ t, onBack, onError }) => {
  const [amountStr, setAmountStr] = useState('1000');
  const [vatRate, setVatRate] = useState<number>(15);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [currency, setCurrency] = useState('SAR');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const num = parseFloat(
    amountStr
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/[,،\s]/g, '')
      .replace('٫', '.')
  );

  let net = 0;
  let vat = 0;
  let total = 0;

  if (!isNaN(num) && num >= 0) {
    if (mode === 'add') {
      net = num;
      vat = Math.round(num * (vatRate / 100) * 100) / 100;
      total = Math.round((net + vat) * 100) / 100;
    } else {
      total = num;
      net = Math.round((num / (1 + vatRate / 100)) * 100) / 100;
      vat = Math.round((total - net) * 100) / 100;
    }
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  const tafqeetTotal = tafqeet(total, currency, true) || '';
  const tafqeetVat = tafqeet(vat, currency, true) || '';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                حاسبة ضريبة القيمة المضافة (VAT)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                حساب دقيق لإضافة الضريبة إلى المبلغ أو استخراجها منه بالتفقيط الكامل
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {/* Mode Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            طريقة الحساب:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('add')}
              className={`flex items-center gap-3 rounded-xl border p-3 text-right transition ${
                mode === 'add'
                  ? 'border-teal-600 bg-teal-50/70 dark:border-teal-500 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white flex-none">
                +
              </div>
              <div>
                <b className="block text-xs font-bold">المبلغ قبل الضريبة (إضافة الضريبة)</b>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  حساب قيمة الضريبة وإضافتها للإجمالي
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('remove')}
              className={`flex items-center gap-3 rounded-xl border p-3 text-right transition ${
                mode === 'remove'
                  ? 'border-teal-600 bg-teal-50/70 dark:border-teal-500 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white flex-none">
                −
              </div>
              <div>
                <b className="block text-xs font-bold">المبلغ شامل الضريبة (استخراج الضريبة)</b>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  فصل أصل المبلغ عن مبلغ الضريبة
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              المبلغ المالي
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="1000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              نسبة الضريبة %
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={vatRate}
                onChange={(e) => setVatRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Quick Rate Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">نسب شائعة:</span>
          {[
            { label: '15% (المملكة العربية السعودية)', rate: 15 },
            { label: '5% (الإمارات / البحرين / عُمان)', rate: 5 },
            { label: '14% (مصر)', rate: 14 },
            { label: '10% (نسبة مخصصة)', rate: 10 },
          ].map((item) => (
            <button
              key={item.rate}
              type="button"
              onClick={() => setVatRate(item.rate)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                vatRate === item.rate
                  ? 'bg-teal-600 text-white'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Result Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">المبلغ قبل الضريبة</span>
              <button
                type="button"
                onClick={() => copyToClipboard(net.toFixed(2), 'net')}
                className="text-slate-400 hover:text-teal-600 transition"
                title="نسخ"
              >
                {copiedField === 'net' ? <CheckCircle2 className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-2 font-mono text-xl font-black text-slate-900 dark:text-white">
              {net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-900 dark:bg-teal-950/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300">قيمة الضريبة ({vatRate}%)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(vat.toFixed(2), 'vat')}
                className="text-teal-600 hover:text-teal-800 transition"
                title="نسخ"
              >
                {copiedField === 'vat' ? <CheckCircle2 className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-2 font-mono text-xl font-black text-teal-900 dark:text-teal-200">
              {vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">الإجمالي شامل الضريبة</span>
              <button
                type="button"
                onClick={() => copyToClipboard(total.toFixed(2), 'total')}
                className="text-slate-400 hover:text-teal-600 transition"
                title="نسخ"
              >
                {copiedField === 'total' ? <CheckCircle2 className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-2 font-mono text-xl font-black text-slate-900 dark:text-white">
              {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Tafqeet Section */}
        {tafqeetTotal && (
          <div className="rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/40 to-cyan-50/30 p-4 dark:border-teal-950 dark:from-teal-950/20 dark:to-cyan-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                المبلغ الإجمالي كتابةً بالحروف:
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(tafqeetTotal, 'tafqeet')}
                className="inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 text-xs font-bold text-teal-800 shadow-xs hover:bg-white dark:bg-slate-800 dark:text-teal-300"
              >
                {copiedField === 'tafqeet' ? <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedField === 'tafqeet' ? 'تم النسخ' : 'نسخ النص'}</span>
              </button>
            </div>
            <p className="text-sm font-bold text-teal-950 dark:text-teal-100 leading-relaxed">
              {tafqeetTotal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
