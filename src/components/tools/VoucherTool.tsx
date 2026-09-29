import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  DollarSign,
  Calendar,
  CreditCard,
  Building,
  User,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { tafqeet, parseAmount, CURRENCIES } from '../../utils/tafqeet';

interface VoucherToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const VoucherTool: React.FC<VoucherToolProps> = ({ t, onBack, onError }) => {
  const [voucherType, setVoucherType] = useState<'receipt' | 'payment'>('receipt');
  const [voucherNo, setVoucherNo] = useState('00142');
  const [voucherDate, setVoucherDate] = useState(() => {
    const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 10);
  });
  const [amount, setAmount] = useState('2500.00');
  const [currency, setCurrency] = useState('SAR');
  const [paymentMethod, setPaymentMethod] = useState('تحويل بنكي');
  const [orgName, setOrgName] = useState('مؤسسة الصرح الشاملة للتجارة');
  const [recipientName, setRecipientName] = useState('سالم عبدالله القحطاني');
  const [reason, setReason] = useState('دفعة أولى من قيمة تصميم وتجهيز الموقع الإلكتروني');

  const [copied, setCopied] = useState(false);

  // Auto amount in words
  const words = tafqeet(amount, currency, true) || '—';

  const parsed = parseAmount(amount);
  const formattedAmount = parsed
    ? `${(parsed.int + parsed.frac / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${CURRENCIES[currency]?.name?.plur || currency}`
    : '—';

  const getPrintHtml = () => {
    const isReceipt = voucherType === 'receipt';
    const titleAr = isReceipt ? 'سند قـبـض' : 'سـنـد صـرف';
    const titleEn = isReceipt ? 'RECEIPT VOUCHER' : 'PAYMENT VOUCHER';
    const partyLabel = isReceipt ? 'استلمنا من المكرم/ة:' : 'صرفنا إلى المكرم/ة:';
    const sigLabel = isReceipt ? 'توقيع المستلم' : 'توقيع المستفيد';

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${titleAr} - ${voucherNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: 'Cairo', system-ui, sans-serif;
      color: #0f172a;
      direction: rtl;
    }
    .voucher-card {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      border: 3px double #0d9488;
      border-radius: 14px;
      padding: 30px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 16px;
    }
    .org-title {
      font-size: 16px;
      font-weight: 800;
      color: #115e59;
    }
    .org-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 3px;
    }
    .title-box {
      text-align: center;
    }
    .title-main {
      font-size: 26px;
      font-weight: 900;
      color: #115e59;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .title-sub {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      font-family: monospace;
      letter-spacing: 1px;
    }
    .meta-box {
      text-align: left;
      direction: ltr;
      font-size: 12px;
      font-family: monospace;
      line-height: 1.6;
    }
    .meta-row {
      direction: rtl;
      text-align: right;
    }
    .amount-box-wrap {
      display: flex;
      justify-content: center;
      margin: 24px 0;
    }
    .amount-box {
      border: 2px solid #0d9488;
      background: #f0fdfa;
      border-radius: 12px;
      padding: 10px 40px;
      text-align: center;
    }
    .amount-label {
      font-size: 11px;
      font-weight: 700;
      color: #0f766e;
    }
    .amount-value {
      font-size: 24px;
      font-weight: 900;
      color: #134e4a;
      letter-spacing: 1px;
      font-family: monospace;
      margin-top: 4px;
    }
    .details {
      margin: 20px 0;
      font-size: 14px;
      line-height: 2.1;
    }
    .row {
      display: flex;
      align-items: baseline;
      border-bottom: 1px dashed #cbd5e1;
      padding: 8px 0;
    }
    .label {
      font-weight: 800;
      color: #0f766e;
      min-width: 140px;
      flex-shrink: 0;
    }
    .val {
      font-weight: 700;
      color: #0f172a;
      flex: 1;
    }
    .val-tafqeet {
      color: #134e4a;
      font-weight: 800;
      background: #f8fafc;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .signatures {
      margin-top: 45px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      text-align: center;
    }
    .sig-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 90px;
    }
    .sig-title {
      font-size: 12px;
      font-weight: 800;
      color: #334155;
    }
    .sig-line {
      border-top: 1px solid #94a3b8;
      padding-top: 6px;
      font-size: 11px;
      color: #64748b;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="voucher-card">
    <div class="header">
      <div>
        <div class="org-title">${orgName || 'اسم المنشأة'}</div>
        <div class="org-sub">سجل مالي رسمي معتمد</div>
      </div>
      <div class="title-box">
        <h1 class="title-main">${titleAr}</h1>
        <div class="title-sub">${titleEn}</div>
      </div>
      <div class="meta-box">
        <div class="meta-row"><strong>رقم السند:</strong> <span style="color:#0f766e; font-weight:800;">${voucherNo}</span></div>
        <div class="meta-row"><strong>التاريخ:</strong> ${voucherDate}</div>
      </div>
    </div>

    <div class="amount-box-wrap">
      <div class="amount-box">
        <div class="amount-label">المبلغ المقبوض / المصروف</div>
        <div class="amount-value">${formattedAmount}</div>
      </div>
    </div>

    <div class="details">
      <div class="row">
        <span class="label">${partyLabel}</span>
        <span class="val">${recipientName || '………………………………………'}</span>
      </div>
      <div class="row">
        <span class="label">مبلغ وقدره بالحروف:</span>
        <span class="val val-tafqeet">${words}</span>
      </div>
      <div class="row">
        <span class="label">طريقة الدفع:</span>
        <span class="val">${paymentMethod}</span>
      </div>
      <div class="row">
        <span class="label">وذلك لقاء / عن:</span>
        <span class="val">${reason || '………………………………………'}</span>
      </div>
    </div>

    <div class="signatures">
      <div class="sig-col">
        <span class="sig-title">${sigLabel}</span>
        <div class="sig-line">التوقيع / الختم</div>
      </div>
      <div class="sig-col">
        <span class="sig-title">المحاسب المسؤول</span>
        <div class="sig-line">التوقيع</div>
      </div>
      <div class="sig-col">
        <span class="sig-title">المدير المالي / المعتمد</span>
        <div class="sig-line">الاعتماد والختم</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  <\/script>
</body>
</html>`;
  };

  const handlePrint = (openPopup: boolean = false) => {
    if (openPopup) {
      try {
        const html = getPrintHtml();
        const win = window.open('', '_blank', 'width=950,height=850');
        if (win) {
          win.document.open();
          win.document.write(html);
          win.document.close();
          return;
        }
      } catch (_) {}
    }

    // Direct in-page print (always works reliably in iframes and all browsers without popup blockers)
    document.body.classList.add('printing-voucher');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-voucher');
    }, 1200);
  };

  const handleCopy = () => {
    const text = `
=== ${voucherType === 'receipt' ? 'سند قبض' : 'سند صرف'} رقم: ${voucherNo} ===
التاريخ: ${voucherDate}
المبلغ: ${formattedAmount}
المبلغ بالحروف: ${words}
${voucherType === 'receipt' ? 'استلمنا من' : 'صرفنا إلى'}: ${recipientName}
طريقة الدفع: ${paymentMethod}
وذلك عن: ${reason}
اسم المنشأة: ${orgName}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            <span>العودة للأدوات</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                منشئ سندات القبض والصرف الرسمية
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                سند رسمي أنيق مع كتابة المبلغ بالحروف تلقائياً وخانات توقيع معتمدة
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>نسخ النص</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handlePrint(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 transition"
            title="فتح السند في نافذة منبثقة مستقلة للطباعة والحفظ كـ PDF"
          >
            <ExternalLink className="h-4 w-4" />
            <span>طباعة عبر نافذة منبثقة</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrint(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 active:scale-98 transition"
          >
            <Printer className="h-4 w-4" />
            <span>طباعة / حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs (Left) & Voucher Preview (Right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Form Controls */}
        <div className="no-print xl:col-span-5 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              بيانات وتفاصيل السند
            </h3>
            {/* Voucher Type Radio */}
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setVoucherType('receipt')}
                className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                  voucherType === 'receipt'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                سند قبض
              </button>
              <button
                type="button"
                onClick={() => setVoucherType('payment')}
                className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                  voucherType === 'payment'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                سند صرف
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                رقم السند
              </label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                dir="ltr"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                تاريخ السند
              </label>
              <input
                type="date"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                المبلغ بالأرقام
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="2500.00"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                العملة
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="KWD">دينار كويتي (KWD)</option>
                <option value="BHD">دينار بحريني (BHD)</option>
                <option value="OMR">ريال عماني (OMR)</option>
                <option value="QAR">ريال قطري (QAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                طريقة الدفع
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="نقداً (كاش)">نقداً (كاش)</option>
                <option value="شيك بنكي">شيك بنكي</option>
                <option value="تحويل بنكي / حوالة">تحويل بنكي / حوالة</option>
                <option value="بطاقة مدى / ائتمان">بطاقة مدى / ائتمان</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                اسم المنشأة أو المؤسسة المصدرة
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {voucherType === 'receipt' ? 'استلمنا من السيد/ة:' : 'صرفنا للسيد/ة:'}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                وذلك عن (السبب أو التفاصيل):
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="xl:col-span-7 flex flex-col items-center">
          <div
            id="voucher-printable-paper"
            className="w-full max-w-[760px] rounded-2xl border-2 border-teal-700 bg-white p-6 sm:p-10 text-slate-900 shadow-md print:border-none print:shadow-none print:m-0 print:p-0"
          >
            {/* Top Bar: Org Name, Title, Date & No */}
            <div className="flex items-start justify-between border-b-2 border-teal-700 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-800 block">
                  {orgName || 'اسم المنشأة'}
                </span>
                <span className="text-[10px] text-slate-500">سجل مالي معتمد</span>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-black text-teal-800">
                  {voucherType === 'receipt' ? 'سند قـبـض' : 'سـنـد صـرف'}
                </h1>
                <span className="text-[10px] text-slate-400 font-mono">
                  {voucherType === 'receipt' ? 'RECEIPT VOUCHER' : 'PAYMENT VOUCHER'}
                </span>
              </div>

              <div className="text-right text-xs font-mono space-y-1">
                <div>
                  <span className="font-bold text-slate-700">رقم السند:</span>{' '}
                  <span className="font-bold text-teal-900">{voucherNo}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">التاريخ:</span> {voucherDate}
                </div>
              </div>
            </div>

            {/* Prominent Amount Box */}
            <div className="my-6 flex justify-center">
              <div className="rounded-xl border-2 border-teal-700 bg-teal-50/70 px-8 py-3 text-center">
                <span className="text-[11px] font-bold text-teal-800 block mb-0.5">
                  المبلغ المقبوض / المصروف:
                </span>
                <div className="text-2xl font-black text-teal-950 font-mono tracking-wider">
                  {formattedAmount}
                </div>
              </div>
            </div>

            {/* Voucher Statement Rows */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800">
              <div className="flex flex-wrap items-baseline gap-2 border-b border-dashed border-slate-300 pb-2">
                <b className="text-teal-800 min-w-32">
                  {voucherType === 'receipt' ? 'استلمنا من المكرم/ة:' : 'صرفنا إلى المكرم/ة:'}
                </b>
                <span className="flex-1 font-bold text-slate-900">{recipientName || '…………………………'}</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 border-b border-dashed border-slate-300 pb-2">
                <b className="text-teal-800 min-w-32">مبلغ وقدره بالحروف:</b>
                <span className="flex-1 font-semibold text-teal-950">{words}</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 border-b border-dashed border-slate-300 pb-2">
                <b className="text-teal-800 min-w-32">طريقة الدفع:</b>
                <span className="flex-1 font-medium">{paymentMethod}</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 border-b border-dashed border-slate-300 pb-2">
                <b className="text-teal-800 min-w-32">وذلك لقاء / عن:</b>
                <span className="flex-1 font-medium text-slate-700">{reason || '…………………………'}</span>
              </div>
            </div>

            {/* Signatures Row */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-8">
                <span className="font-bold text-slate-700 block">
                  {voucherType === 'receipt' ? 'توقيع المستلم' : 'توقيع المستفيد'}
                </span>
                <div className="border-t border-slate-400 mx-4 pt-1 text-[11px] text-slate-500">
                  التوقيع / الختم
                </div>
              </div>

              <div className="space-y-8">
                <span className="font-bold text-slate-700 block">المحاسب المسؤول</span>
                <div className="border-t border-slate-400 mx-4 pt-1 text-[11px] text-slate-500">
                  التوقيع
                </div>
              </div>

              <div className="space-y-8">
                <span className="font-bold text-slate-700 block">المدير المالي / المعتمد</span>
                <div className="border-t border-slate-400 mx-4 pt-1 text-[11px] text-slate-500">
                  الاعتماد والختم
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
