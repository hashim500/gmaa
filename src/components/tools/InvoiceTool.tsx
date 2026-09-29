import React, { useState, useEffect, useRef } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Upload,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import QRCode from 'qrcode';
import { TranslationDict } from '../../i18n/translations';
import { tafqeet } from '../../utils/tafqeet';

interface InvoiceToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const InvoiceTool: React.FC<InvoiceToolProps> = ({ t, onBack, onError }) => {
  // Seller info
  const [sellerName, setSellerName] = useState('شركة الأفق للحلول الرقمية');
  const [sellerVat, setSellerVat] = useState('310123456700003');
  const [sellerAddress, setSellerAddress] = useState('طريق الملك فهد، حي الصحافة، الرياض');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // Invoice & Customer info
  const [invoiceNo, setInvoiceNo] = useState('INV-2026-0042');
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 16);
  });
  const [buyerName, setBuyerName] = useState('مؤسسة الصرح للتجارة');
  const [buyerVat, setBuyerVat] = useState('300987654300003');
  const [vatRate, setVatRate] = useState<number>(15);
  const [currency, setCurrency] = useState('ريال');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'تطوير وتصميم منصة أعمال متكاملة', quantity: 1, unitPrice: 3500 },
    { id: '2', description: 'اشتراك واستضافة سنوية سحابية', quantity: 1, unitPrice: 900 },
    { id: '3', description: 'دعم فني وصيانة برمجية (3 أشهر)', quantity: 3, unitPrice: 250 },
  ]);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedTafqeet, setCopiedTafqeet] = useState(false);

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.quantity || 0) * (it.unitPrice || 0), 0);
  const vatAmount = Math.round(subtotal * (vatRate / 100) * 100) / 100;
  const grandTotal = Math.round((subtotal + vatAmount) * 100) / 100;

  // ZATCA TLV Base64 Generator
  const generateZatcaTlv = (
    seller: string,
    vat: string,
    timestampIso: string,
    totalStr: string,
    taxStr: string
  ): string => {
    const enc = new TextEncoder();
    const bytes: number[] = [];
    const fields = [
      [1, seller],
      [2, vat],
      [3, timestampIso],
      [4, totalStr],
      [5, taxStr],
    ] as const;

    for (const [tag, val] of fields) {
      const b = enc.encode(val);
      bytes.push(tag, b.length, ...b);
    }

    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Update QR code whenever critical fields change
  useEffect(() => {
    const updateQr = async () => {
      if (!sellerName || !sellerVat) {
        setQrCodeDataUrl('');
        return;
      }
      try {
        const isoTs = new Date(invoiceDate || Date.now()).toISOString().replace(/\.\d+Z$/, 'Z');
        const tlv = generateZatcaTlv(
          sellerName.trim(),
          sellerVat.trim(),
          isoTs,
          grandTotal.toFixed(2),
          vatAmount.toFixed(2)
        );

        const url = await QRCode.toDataURL(tlv, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 160,
          color: {
            dark: '#16302d',
            light: '#ffffff',
          },
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('QR code generation error:', err);
      }
    };

    updateQr();
  }, [sellerName, sellerVat, invoiceDate, grandTotal, vatAmount]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0 }]);
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const [copiedInvoiceText, setCopiedInvoiceText] = useState(false);

  const getPrintHtml = () => {
    const itemsHtml = items
      .map((it, idx) => {
        const itemSubtotal = (it.quantity || 0) * (it.unitPrice || 0);
        const itemVat = itemSubtotal * (vatRate / 100);
        const itemTotal = itemSubtotal + itemVat;
        return `
          <tr>
            <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
            <td style="font-weight: 700;">${it.description || '—'}</td>
            <td style="text-align: center; font-family: monospace;">${Number(it.unitPrice || 0).toLocaleString()} ${currency}</td>
            <td style="text-align: center; font-family: monospace;">${it.quantity || 0}</td>
            <td style="text-align: center; font-family: monospace;">${itemSubtotal.toLocaleString()} ${currency}</td>
            <td style="text-align: center; font-family: monospace;">${vatRate}%</td>
            <td style="text-align: center; font-weight: 800; font-family: monospace; background: #f8fafc;">${itemTotal.toLocaleString()} ${currency}</td>
          </tr>
        `;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>فاتورة ضريبية - ${invoiceNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
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
    .invoice-card {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 24px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .seller-title {
      font-size: 22px;
      font-weight: 900;
      color: #115e59;
      margin: 0 0 4px 0;
    }
    .badge {
      display: inline-block;
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .meta-table {
      font-size: 11.5px;
      line-height: 1.6;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .party-box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      background: #f8fafc;
      font-size: 12px;
      line-height: 1.7;
    }
    .party-heading {
      font-size: 12px;
      font-weight: 800;
      color: #0f766e;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 20px;
    }
    table.items-table th, table.items-table td {
      border: 1px solid #cbd5e1;
      padding: 8px;
    }
    table.items-table th {
      background: #f1f5f9;
      font-weight: 800;
      color: #1e293b;
      text-align: center;
    }
    .totals-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-top: 15px;
    }
    .qr-side {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border: 1px solid #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      background: #f8fafc;
    }
    .qr-side img {
      width: 120px;
      height: 120px;
    }
    .totals-table {
      width: 320px;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .totals-table td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
    }
    .grand-total-row {
      background: #0d9488 !important;
      color: #ffffff !important;
      font-weight: 900;
      font-size: 14px;
    }
    .grand-total-row td {
      border-color: #0d9488 !important;
    }
    .tafqeet-box {
      margin-top: 14px;
      background: #f0fdfa;
      border: 1px dashed #0d9488;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      color: #115e59;
      text-align: center;
    }
    .footer-stamp {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11.5px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 12px;
      color: #64748b;
    }
    .stamp-box {
      width: 140px;
      height: 80px;
      border: 2px dashed #94a3b8;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <span class="badge">فاتورة ضريبية مبسطة (ZATCA)</span>
        <h1 class="seller-title">${sellerName || 'اسم المنشأة البائعة'}</h1>
        <div style="font-size: 11.5px; color: #475569;">${sellerAddress || 'المقر والعنوان'}</div>
        <div style="font-size: 11.5px; color: #475569; margin-top: 2px;">
          الرقم الضريبي: <strong style="font-family: monospace; color:#0f766e;">${sellerVat || '—'}</strong>
        </div>
      </div>
      <div style="text-align: left; direction: ltr;">
        ${logoUrl ? `<img src="${logoUrl}" style="height: 55px; max-width: 140px; object-fit: contain; margin-bottom: 8px;" />` : ''}
        <div class="meta-table" style="direction: rtl; text-align: right;">
          <div><strong>رقم الفاتورة:</strong> <span style="font-family: monospace; color: #0d9488; font-weight:800;">${invoiceNo}</span></div>
          <div><strong>تاريخ الإصدار:</strong> ${invoiceDate.replace('T', ' ')}</div>
        </div>
      </div>
    </div>

    <div class="parties-grid">
      <div class="party-box">
        <div class="party-heading">بيانات المورد (البائع)</div>
        <div><strong>الاسم:</strong> ${sellerName}</div>
        <div><strong>الرقم الضريبي:</strong> ${sellerVat}</div>
        <div><strong>العنوان:</strong> ${sellerAddress}</div>
      </div>
      <div class="party-box">
        <div class="party-heading">بيانات العميل (المشتري)</div>
        <div><strong>الاسم:</strong> ${buyerName || 'عميل نقدي'}</div>
        <div><strong>الرقم الضريبي:</strong> ${buyerVat || 'غير مسجل'}</div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 35px;">#</th>
          <th>بيان السلعة أو الخدمة</th>
          <th style="width: 100px;">سعر الوحدة</th>
          <th style="width: 55px;">الكمية</th>
          <th style="width: 100px;">المجموع</th>
          <th style="width: 60px;">الضريبة</th>
          <th style="width: 110px;">الإجمالي شاملاً الضريبة</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals-area">
      <div class="qr-side">
        ${qrCodeDataUrl ? `<img src="${qrCodeDataUrl}" alt="ZATCA QR" />` : '<div style="width:120px;height:120px;background:#eee;border-radius:4px;"></div>'}
        <span style="font-size: 10px; color: #64748b; margin-top: 6px; font-weight: bold;">
          رمز الاستجابة السريع المشفر (ZATCA)
        </span>
      </div>

      <div>
        <table class="totals-table">
          <tr>
            <td style="font-weight: 700; background: #f8fafc;">الإجمالي الخاضع للضريبة (غير شامل):</td>
            <td style="text-align: center; font-weight: 700; font-family: monospace;">${subtotal.toLocaleString()} ${currency}</td>
          </tr>
          <tr>
            <td style="font-weight: 700; background: #f8fafc;">ضريبة القيمة المضافة (${vatRate}%):</td>
            <td style="text-align: center; font-weight: 700; font-family: monospace; color: #dc2626;">${vatAmount.toLocaleString()} ${currency}</td>
          </tr>
          <tr class="grand-total-row">
            <td>إجمالي الفاتورة المستحق:</td>
            <td style="text-align: center; font-family: monospace;">${grandTotal.toLocaleString()} ${currency}</td>
          </tr>
        </table>

        <div class="tafqeet-box">
          <strong>المبلغ كتابةً:</strong> فقط ${tafqeetText} لا غير
        </div>
      </div>
    </div>

    <div class="footer-stamp">
      <div>
        <div>نشكركم على تعاملكم معنا.</div>
        <div style="margin-top: 4px; font-size: 10px;">حررت هذه الفاتورة إلكترونياً وتعتبر مستنداً ضريبياً رسمياً.</div>
      </div>
      <div class="stamp-box">
        الختم والتوقيع
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
    document.body.classList.add('printing-invoice');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-invoice');
    }, 1200);
  };

  const handleCopyInvoice = () => {
    const text = `
=== فاتورة ضريبية رقم: ${invoiceNo} ===
البائع: ${sellerName} (الرقم الضريبي: ${sellerVat})
المشتري: ${buyerName} (الرقم الضريبي: ${buyerVat})
التاريخ: ${invoiceDate.replace('T', ' ')}
الإجمالي قبل الضريبة: ${subtotal.toLocaleString()} ${currency}
ضريبة القيمة المضافة (${vatRate}%): ${vatAmount.toLocaleString()} ${currency}
إجمالي الفاتورة المستحق: ${grandTotal.toLocaleString()} ${currency}
المبلغ كتابةً: فقط ${tafqeetText} لا غير
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedInvoiceText(true);
    setTimeout(() => setCopiedInvoiceText(false), 2000);
  };

  const tafqeetText = tafqeet(grandTotal, 'SAR', true) || '';

  const isValidVat = /^\d{15}$/.test(sellerVat.trim());

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
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
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                مولّد فاتورة ضريبية بضريبة القيمة المضافة
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                فاتورة معتمدة متوافقة مع متطلبات الزكاة والضريبة (المرحلة الأولى) مع رمز QR
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyInvoice}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            {copiedInvoiceText ? (
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
            title="فتح الفاتورة في نافذة مستقلة للطباعة والتنزيل كـ PDF"
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
            <span>طباعة / حفظ كملف PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) and Paper Preview (Right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Editor Form (Col 1-5 on xl) */}
        <div className="no-print xl:col-span-5 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>بيانات المنشأة والفاتورة</span>
            </h3>
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              حساب فوري
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                اسم المنشأة البائعة
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="اسم المؤسسة أو الشركة"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                الرقم الضريبي للبائع (15 رقماً)
              </label>
              <input
                type="text"
                value={sellerVat}
                onChange={(e) => setSellerVat(e.target.value.replace(/[^\d]/g, ''))}
                maxLength={15}
                dir="ltr"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-white ${
                  sellerVat && !isValidVat
                    ? 'border-rose-400 bg-rose-50 dark:border-rose-800'
                    : 'border-slate-200 bg-slate-50 focus:border-teal-500 focus:bg-white dark:border-slate-700'
                }`}
                placeholder="300000000000003"
              />
              {sellerVat && !isValidVat && (
                <span className="text-[10px] text-rose-500">يجب أن يتكون الرقم الضريبي من 15 رقماً</span>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                رقم الفاتورة
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                dir="ltr"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                عنوان ومقر المنشأة
              </label>
              <input
                type="text"
                value={sellerAddress}
                onChange={(e) => setSellerAddress(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="المدينة، الشارع، الحي"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                التاريخ والوقت
              </label>
              <input
                type="datetime-local"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                شعار المنشأة (اختياري)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-1 w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-teal-50 file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-950 dark:file:text-teal-300"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">بيانات العميل</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="اسم العميل أو الجهة"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={buyerVat}
                  onChange={(e) => setBuyerVat(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="الرقم الضريبي للعميل (اختياري)"
                  dir="ltr"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Tax Rate & Currency */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">نسبة الضريبة %</label>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">العملة</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Line Items Editor */}
          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                بنود الفاتورة ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة بند جديد</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <span className="w-5 text-center font-mono text-[10px] text-slate-400">{idx + 1}</span>
                  <input
                    type="text"
                    value={it.description}
                    onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                    placeholder="وصف البند أو الخدمة"
                    className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={it.quantity}
                    onChange={(e) => handleUpdateItem(it.id, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="الكمية"
                    className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-center focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={it.unitPrice}
                    onChange={(e) => handleUpdateItem(it.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="السعر"
                    className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-center focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(it.id)}
                    className="text-slate-400 hover:text-rose-600 transition"
                    title="حذف البند"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Paper Preview (Col 6-12 on xl) */}
        <div className="xl:col-span-7 flex flex-col items-center">
          <div
            id="invoice-printable-paper"
            className="w-full max-w-[800px] rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-md print:border-none print:shadow-none print:m-0 print:p-0 print:w-full"
            style={{ minHeight: '800px' }}
          >
            {/* Header: Title, Meta, Logo */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-teal-600 pb-4">
              <div>
                <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800">
                  فاتورة ضريبية مبسطة
                </span>
                <h1 className="mt-1 text-2xl font-black text-teal-900">
                  {sellerName || 'اسم المنشأة البائعة'}
                </h1>
                <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">
                  {sellerAddress || 'العنوان والمقر الرئيسي'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="شعار المنشأة"
                    className="h-16 max-w-[160px] object-contain rounded-md"
                  />
                ) : (
                  <div className="flex h-14 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[10px] font-medium text-slate-400">
                    شعار المنشأة
                  </div>
                )}
                <div className="text-right text-[11px] text-slate-600 font-mono space-y-0.5">
                  <div>
                    <span className="font-bold text-slate-800">رقم الفاتورة:</span> {invoiceNo}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">التاريخ:</span>{' '}
                    {invoiceDate.replace('T', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Seller & Customer Boxes */}
            <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs">
                <span className="font-bold text-teal-700 block mb-1">بيانات البائع المعتمد:</span>
                <div className="font-bold text-slate-800">{sellerName || '—'}</div>
                <div className="mt-1 font-mono text-[11px] text-slate-600">
                  الرقم الضريبي: {sellerVat || '—'}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs">
                <span className="font-bold text-teal-700 block mb-1">بيانات العميل:</span>
                <div className="font-bold text-slate-800">{buyerName || 'عميل نقدي'}</div>
                {buyerVat && (
                  <div className="mt-1 font-mono text-[11px] text-slate-600">
                    الرقم الضريبي: {buyerVat}
                  </div>
                )}
              </div>
            </div>

            {/* Table of Items */}
            <div className="overflow-x-auto my-4">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-teal-50/80 text-teal-950 font-bold border-b border-teal-200">
                    <th className="py-2.5 px-3 w-10">#</th>
                    <th className="py-2.5 px-3">الوصف والخدمة</th>
                    <th className="py-2.5 px-3 w-20 text-center">الكمية</th>
                    <th className="py-2.5 px-3 w-28 text-left">سعر الوحدة</th>
                    <th className="py-2.5 px-3 w-32 text-left">المجموع ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it, i) => {
                    const rowTotal = (it.quantity || 0) * (it.unitPrice || 0);
                    return (
                      <tr key={it.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{i + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {it.description || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-left font-mono">
                          {it.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-left font-bold font-mono">
                          {rowTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary & QR code */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-4">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center text-center">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="رمز الاستجابة السريعة لهيئة الزكاة والضريبة ZATCA"
                    className="h-28 w-28 rounded-lg border border-slate-200 p-1"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[10px] text-slate-400 p-2">
                    أدخل اسم المنشأة والرقم الضريبي
                  </div>
                )}
                <span className="mt-1 text-[10px] font-semibold text-slate-500">
                  رمز التحقق الضريبي ZATCA QR
                </span>
              </div>

              {/* Totals Calculation Card */}
              <div className="w-full sm:w-80 space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>المجموع الخاضع للضريبة:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>ضريبة القيمة المضافة ({vatRate}%):</span>
                  <span className="font-mono font-bold text-slate-800">
                    {vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-teal-600 font-extrabold text-sm text-teal-950">
                  <span>الإجمالي شامل الضريبة:</span>
                  <span className="font-mono text-base text-teal-700">
                    {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>

                {/* Arabic Tafqeet in Invoice Paper */}
                {tafqeetText && (
                  <div className="rounded-lg bg-teal-50/50 p-2 text-[11px] text-teal-900 leading-relaxed font-semibold">
                    <span className="text-[10px] text-teal-700 block font-normal">المبلغ كتابة:</span>
                    {tafqeetText}
                  </div>
                )}
              </div>
            </div>

            {/* Paper Footer */}
            <div className="mt-8 border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400">
              شكراً لتعاملكم معنا • صدرت هذه الفاتورة إلكترونياً وهي متوافقة مع متطلبات الفاتورة الإلكترونية
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
