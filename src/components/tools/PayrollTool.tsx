import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Download,
  Building2,
  User,
  Calendar,
  DollarSign,
  CheckCircle2,
  Table as TableIcon,
  Home,
  Briefcase,
  Fingerprint,
  Stamp,
  PenTool,
  Users,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { tafqeet } from '../../utils/tafqeet';

interface PayrollToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError?: (msg: string) => void;
}

interface MonthRow {
  monthName: string;
  monthNum: number;
  basic: string;
  additions: string;
  deductions: string;
  notes: string;
  signatureReceived: boolean;
}

const GREGORIAN_MONTHS = [
  'يناير (1)',
  'فبراير (2)',
  'مارس (3)',
  'أبريل (4)',
  'مايو (5)',
  'يونيو (6)',
  'يوليو (7)',
  'أغسطس (8)',
  'سبتمبر (9)',
  'أكتوبر (10)',
  'نوفمبر (11)',
  'ديسمبر (12)',
];

const HIJRI_MONTHS = [
  'محرم (1)',
  'صفر (2)',
  'ربيع الأول (3)',
  'ربيع الآخر (4)',
  'جمادى الأولى (5)',
  'جمادى الآخرة (6)',
  'رجب (7)',
  'شعبان (8)',
  'رمضان (9)',
  'شوال (10)',
  'ذو القعدة (11)',
  'ذو الحجة (12)',
];

export const PayrollTool: React.FC<PayrollToolProps> = ({ onBack }) => {
  // 1. Worker & Category Type (Domestic vs Business)
  const [workerCategory, setWorkerCategory] = useState<'domestic' | 'business'>('business');

  // 2. Calendar system: Gregorian vs Hijri
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');

  // 3. Employer Type
  const [employerType, setEmployerType] = useState<'company' | 'establishment' | 'individual'>('company');

  // 4. Employee & Header info
  const [year, setYear] = useState('2026');
  const [employeeName, setEmployeeName] = useState('أحمد محمد علي');
  const [jobTitle, setJobTitle] = useState('محاسب مالي');
  const [nationality, setNationality] = useState('مصري');
  const [idNumber, setIdNumber] = useState('2518123217');
  const [employerName, setEmployerName] = useState('شركة أبعاد الريادة للتقنية');
  const [iban, setIban] = useState('SA0380000000608010167519');
  const [paymentMethod, setPaymentMethod] = useState('تحويل بنكي (مدد / حماية الأجور)');
  const [currency, setCurrency] = useState('SAR');

  // 5. Quick fill default values
  const [defaultSalary, setDefaultSalary] = useState('4500');

  // 6. 12 Months Data
  const [rows, setRows] = useState<MonthRow[]>(() =>
    GREGORIAN_MONTHS.map((name, idx) => ({
      monthName: name,
      monthNum: idx + 1,
      basic: '4500',
      additions: '',
      deductions: '',
      notes: '',
      signatureReceived: idx < 8,
    }))
  );

  // 7. Signatures & Parties Control
  const [signatoryMode, setSignatoryMode] = useState<'both' | 'employee_only' | 'employer_only' | 'custom'>('both');
  const [showEmployeeSignature, setShowEmployeeSignature] = useState(true);
  const [showEmployerSignature, setShowEmployerSignature] = useState(true);
  const [showAccountantSignature, setShowAccountantSignature] = useState(true);

  // 8. Stamp & Fingerprint Toggles
  const [showStamp, setShowStamp] = useState(true);
  const [showFingerprint, setShowFingerprint] = useState(false);

  // 9. Display Toggles
  const [showEmployerHeader, setShowEmployerHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showTotalsRow, setShowTotalsRow] = useState(true);
  const [tableSignColumnLabel, setTableSignColumnLabel] = useState<'both' | 'signature' | 'fingerprint'>('both');

  // 10. Styling & Print Margins
  const [titleFont, setTitleFont] = useState('Tahoma');
  const [textFont, setTextFont] = useState('Tahoma');
  const [textSize, setTextSize] = useState('15px');
  const [printMargin, setPrintMargin] = useState<'normal' | 'wide' | 'extra'>('wide');

  // Switch Calendar Type (Gregorian <-> Hijri)
  const handleCalendarChange = (newType: 'gregorian' | 'hijri') => {
    setCalendarType(newType);
    const monthsList = newType === 'hijri' ? HIJRI_MONTHS : GREGORIAN_MONTHS;
    setRows((prev) =>
      prev.map((r, idx) => ({
        ...r,
        monthName: monthsList[idx] || r.monthName,
      }))
    );
    if (newType === 'hijri' && year === '2026') {
      setYear('1447 هـ');
    } else if (newType === 'gregorian' && (year === '1447 هـ' || year === '1448 هـ')) {
      setYear('2026 م');
    }
  };

  // Switch Worker Category (Domestic vs Professional/Business)
  const handleWorkerCategoryChange = (cat: 'domestic' | 'business') => {
    setWorkerCategory(cat);
    if (cat === 'domestic') {
      setEmployerType('individual');
      setJobTitle('سائق خاص');
      setEmployerName('سعود بن عبدالله آل سعود');
      setEmployeeName('محمد إسلام مياه');
      setNationality('بنجلاديشي');
      setPaymentMethod('تحويل بنكي / بطاقة رواتب العمالة المنزلية (مدى)');
      setShowFingerprint(true);
      setShowStamp(false);
      setShowAccountantSignature(false);
      setShowEmployerSignature(true);
      setShowEmployeeSignature(true);
      setTableSignColumnLabel('fingerprint');
    } else {
      setEmployerType('company');
      setJobTitle('محاسب مالي');
      setEmployerName('شركة أبعاد الريادة للتقنية');
      setEmployeeName('أحمد محمد علي');
      setNationality('مصري');
      setPaymentMethod('تحويل بنكي (مدد / حماية الأجور)');
      setShowStamp(true);
      setShowFingerprint(false);
      setShowAccountantSignature(true);
      setShowEmployerSignature(true);
      setShowEmployeeSignature(true);
      setTableSignColumnLabel('both');
    }
  };

  // Handle signatory mode quick selection
  const handleSignatoryModeChange = (mode: 'both' | 'employee_only' | 'employer_only' | 'custom') => {
    setSignatoryMode(mode);
    if (mode === 'both') {
      setShowEmployeeSignature(true);
      setShowEmployerSignature(true);
    } else if (mode === 'employee_only') {
      setShowEmployeeSignature(true);
      setShowEmployerSignature(false);
    } else if (mode === 'employer_only') {
      setShowEmployeeSignature(false);
      setShowEmployerSignature(true);
    }
  };

  // Helper to calculate Net for a row: Basic + Additions - Deductions
  const calculateNet = (row: MonthRow): number => {
    const basic = parseFloat(row.basic) || 0;
    const additions = parseFloat(row.additions) || 0;
    const deductions = parseFloat(row.deductions) || 0;
    return Math.max(0, basic + additions - deductions);
  };

  // Row update helper
  const updateRow = (index: number, field: keyof MonthRow, value: any) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Quick fill all months with basic salary
  const handleQuickFill = () => {
    if (!defaultSalary) return;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        basic: defaultSalary,
      }))
    );
  };

  // Reset table
  const handleResetTable = () => {
    const monthsList = calendarType === 'hijri' ? HIJRI_MONTHS : GREGORIAN_MONTHS;
    setRows(
      monthsList.map((name, idx) => ({
        monthName: name,
        monthNum: idx + 1,
        basic: '',
        additions: '',
        deductions: '',
        notes: '',
        signatureReceived: false,
      }))
    );
  };

  // Calculations for totals
  const totalBasic = rows.reduce((sum, r) => sum + (parseFloat(r.basic) || 0), 0);
  const totalAdditions = rows.reduce((sum, r) => sum + (parseFloat(r.additions) || 0), 0);
  const totalDeductions = rows.reduce((sum, r) => sum + (parseFloat(r.deductions) || 0), 0);
  const totalNet = rows.reduce((sum, r) => sum + calculateNet(r), 0);
  const totalNetWords = tafqeet(totalNet.toString(), currency, true) || '—';

  // Dynamic Labels based on employerType & workerCategory
  const employerTypeLabel =
    employerType === 'company'
      ? 'الشركة'
      : employerType === 'establishment'
      ? 'المؤسسة'
      : 'صاحب العمل (الكفيل / رب الأسرة)';

  const workerCategoryTitle =
    workerCategory === 'domestic'
      ? `مسير واستلام رواتب العمالة المنزلية لسنة: ${year}`
      : `مسير رواتب وأجور لسنة: ${year}`;

  const workerCategorySubtitle =
    workerCategory === 'domestic'
      ? 'إثبات استلام أجور العمالة المنزلية (مساند / وزارة الموارد البشرية والتنمية الاجتماعية)'
      : 'نظام حماية الأجور / مدد وقوى';

  const tableSignatureColTitle =
    tableSignColumnLabel === 'fingerprint'
      ? 'بصمة العامل'
      : tableSignColumnLabel === 'signature'
      ? 'توقيع العامل'
      : 'البصمة / التوقيع';

  // 1. Direct in-window print (works 100% in iframes and all browsers without popups)
  const handleDirectPrint = () => {
    document.body.classList.add('printing-payroll');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-payroll');
    }, 1200);
  };

  // 2. Popup Window Print for separate tab preference
  const openPrintWindow = () => {
    const tableRowsHtml = rows
      .map((r) => {
        const net = calculateNet(r);
        return `
        <tr>
          <td style="font-weight: bold; background: #fafafa;">${r.monthName}</td>
          <td>${r.basic ? Number(r.basic).toLocaleString() : '-'}</td>
          <td>${r.additions ? Number(r.additions).toLocaleString() : '-'}</td>
          <td>${r.deductions ? Number(r.deductions).toLocaleString() : '-'}</td>
          <td style="font-weight: bold; background: #f0fdf4;">${net > 0 ? Number(net).toLocaleString() : '-'}</td>
          <td style="height: 38px;">${r.signatureReceived ? '✓ استلم' : ''}</td>
        </tr>
      `;
      })
      .join('');

    const totalsRowHtml = showTotalsRow
      ? `
        <tr style="background: #e2e8f0; font-weight: bold; border-top: 2px solid #000;">
          <td>الإجمالي السنوي</td>
          <td>${totalBasic > 0 ? Number(totalBasic).toLocaleString() : '-'}</td>
          <td>${totalAdditions > 0 ? Number(totalAdditions).toLocaleString() : '-'}</td>
          <td>${totalDeductions > 0 ? Number(totalDeductions).toLocaleString() : '-'}</td>
          <td style="background: #bbf7d0; font-size: 1.1em;">${totalNet > 0 ? Number(totalNet).toLocaleString() : '-'}</td>
          <td>-</td>
        </tr>
      `
      : '';

    const marginCss =
      printMargin === 'extra' ? '28mm 26mm' : printMargin === 'normal' ? '18mm 18mm' : '24mm 22mm';
    const bodyPadding =
      printMargin === 'extra' ? '30px 40px' : printMargin === 'normal' ? '18px 24px' : '24px 32px';

    const headerHtml = showEmployerHeader
      ? `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 18px;">
          <div>
            <div style="font-size: 13px; color: #444;">المملكة العربية السعودية</div>
            <div style="font-size: 17px; font-weight: bold; margin-top: 3px;">${employerName || employerTypeLabel}</div>
          </div>
          <div style="text-align: left; font-size: 12px; color: #444; line-height: 1.5;">
            <div>مسير أجور ورواتب لسنة: <strong>${year}</strong> (${calendarType === 'hijri' ? 'تقويم هجري' : 'تقويم ميلادي'})</div>
            <div>${workerCategorySubtitle}</div>
          </div>
        </div>
      `
      : '';

    const printContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>مسير رواتب ${year} - ${employeeName}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: ${marginCss};
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: ${bodyPadding};
            color: #000;
            background: #fff;
            font-family: '${textFont}', 'Tahoma', Arial, sans-serif;
            direction: rtl;
          }
          .print-container {
            max-width: 820px;
            margin: auto;
          }
          h2.title {
            text-align: center;
            margin: 0 0 16px 0;
            font-size: 23px;
            font-family: '${titleFont}', 'Tahoma', Arial, sans-serif;
            text-decoration: underline;
            letter-spacing: 0.5px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 18px;
            margin-bottom: 20px;
            font-size: ${textSize};
            border: 1px solid #333;
            padding: 12px 16px;
            border-radius: 4px;
            background: #fbfbfb;
          }
          .info-grid div {
            padding: 2px 0;
          }
          table.salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: ${textSize};
          }
          table.salary-table th, table.salary-table td {
            border: 1px solid #222;
            padding: 6px 5px;
            text-align: center;
          }
          table.salary-table th {
            background-color: #f1f3f5 !important;
            font-weight: bold;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .tafqeet-box {
            background: #f8fafc;
            border: 1px dashed #475569;
            padding: 8px 12px;
            font-size: 13px;
            text-align: center;
            margin-bottom: 22px;
            border-radius: 4px;
          }
          .footer-section {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            font-size: ${textSize};
            padding-top: 15px;
            border-top: 1px dashed #666;
          }
          .stamp-box {
            width: 130px;
            height: 85px;
            border: 2px dashed #999;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #777;
            font-size: 11px;
            margin-top: 8px;
            text-align: center;
          }
          .fingerprint-box {
            width: 90px;
            height: 95px;
            border: 2px dashed #0284c7;
            border-radius: 50% 50% 45% 45%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #0369a1;
            font-size: 10.5px;
            margin-top: 8px;
            text-align: center;
            background: #f0f9ff;
          }
          @media print {
            body {
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <!-- Header (conditional) -->
          ${headerHtml}

          <h2 class="title">${workerCategoryTitle}</h2>

          <div class="info-grid">
            <div><strong>اسم العامل / الموظف:</strong> ${employeeName}</div>
            <div><strong>المهنة / المسمى:</strong> ${jobTitle}</div>
            <div><strong>الجنسية:</strong> ${nationality}</div>
            <div><strong>رقم الإقامة / الهوية:</strong> ${idNumber}</div>
            <div><strong>${employerTypeLabel}:</strong> ${employerName}</div>
            <div><strong>طريقة الصرف:</strong> ${paymentMethod}</div>
            ${iban ? `<div style="grid-column: span 2;"><strong>الآيبان أو الحساب:</strong> ${iban}</div>` : ''}
          </div>

          <table class="salary-table">
            <thead>
              <tr>
                <th style="width: 18%;">الشهر (${calendarType === 'hijri' ? 'هجري' : 'ميلادي'})</th>
                <th style="width: 17%;">مقدار الراتب الأساسي</th>
                <th style="width: 15%;">إضافات / بدلات</th>
                <th style="width: 15%;">حسميات / خصم</th>
                <th style="width: 17%;">صافي المستحق</th>
                <th style="width: 18%;">${tableSignatureColTitle}</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
              ${totalsRowHtml}
            </tbody>
          </table>

          <div class="tafqeet-box">
            <strong>إجمالي صافي أجور السنة كتابةً:</strong> فقط ${totalNetWords} لا غير
          </div>

          ${
            showFooter
              ? `
            <div class="footer-section">
              <!-- Right Side: Employee Side & Fingerprint -->
              <div style="flex: 1;">
                ${
                  showEmployeeSignature
                    ? `
                  <div><strong>توقيع المستلم (${workerCategory === 'domestic' ? 'العامل/ة' : 'الموظف'}):</strong> ........................................</div>
                  <div style="margin-top: 6px; font-size: 11px; color: #555;">أقر أنا الموقع أعلاه باستلامي لكامل مستحقاتي الموضحة أعلاه.</div>
                `
                    : ''
                }
                ${
                  showFingerprint
                    ? `
                  <div style="margin-top: 8px;">
                    <div class="fingerprint-box">
                      <span>بصمة إبهام</span>
                      <span>العامل/ة</span>
                    </div>
                  </div>
                `
                    : ''
                }
                ${
                  showAccountantSignature
                    ? `
                  <div style="margin-top: 12px; font-size: 12px; color: #444;">
                    <strong>إعداد وتدقيق المحاسب:</strong> ........................................
                  </div>
                `
                    : ''
                }
              </div>

              <!-- Left Side: Employer Side & Stamp -->
              <div style="flex: 1; text-align: left; direction: ltr;">
                <div style="direction: rtl; text-align: right;">
                  ${
                    showEmployerSignature
                      ? `
                    <div><strong>اعتماد ${employerTypeLabel}:</strong> ${employerName}</div>
                    <div style="margin-top: 6px;"><strong>التوقيع والاعتماد:</strong> ........................................</div>
                  `
                      : ''
                  }
                  ${
                    showStamp
                      ? `
                    <div style="margin-top: 8px;">
                      <div class="stamp-box">
                        خاتم ${employerType === 'individual' ? 'صاحب العمل' : 'المنشأة'} الرسمي
                      </div>
                    </div>
                  `
                      : ''
                  }
                  <div style="margin-top: 8px; font-size: 11px; color: #666;">
                    التاريخ: ${new Date().toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>
            </div>
          `
              : ''
          }
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        <\/script>
      </body>
      </html>
    `;

    try {
      const printWindow = window.open('', '_blank', 'width=1050,height=850');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        return;
      }
    } catch (_) {}

    // Fallback to direct print if popup blocked
    handleDirectPrint();
  };

  // Export to CSV spreadsheet
  const handleExportCSV = () => {
    const headers = ['الشهر', 'الراتب الأساسي', 'الإضافات', 'الحسميات', 'الصافي'];
    const csvRows = [
      [`${workerCategoryTitle} - ${employeeName}`],
      [`${employerTypeLabel}: ${employerName}`, `الهوية: ${idNumber}`, `المهنة: ${jobTitle}`],
      [],
      headers,
    ];

    rows.forEach((r) => {
      csvRows.push([r.monthName, r.basic || '0', r.additions || '0', r.deductions || '0', calculateNet(r).toString()]);
    });

    csvRows.push(['الإجمالي', totalBasic.toString(), totalAdditions.toString(), totalDeductions.toString(), totalNet.toString()]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `مسير-رواتب-${year}-${employeeName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للأدوات</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  مسير الرواتب والأجور الشامل (عمالة منزلية ومهنية)
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {calendarType === 'hijri' ? '🌙 هجري' : '📅 ميلادي'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                يدعم العمالة المنزلية (مساند) والشركات (مدد) مع إمكانية التبديل بين الشهور الهجرية والميلادية والتحكم بالبصمة والأختام
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <Download className="h-4 w-4" />
            <span>تصدير Excel (CSV)</span>
          </button>

          <button
            type="button"
            onClick={openPrintWindow}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 transition"
            title="فتح المسير في نافذة مستقلة للطباعة والتنزيل"
          >
            <ExternalLink className="h-4 w-4" />
            <span>طباعة عبر نافذة منبثقة</span>
          </button>

          <button
            type="button"
            onClick={handleDirectPrint}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 active:scale-98 transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>طباعة فورية / حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Control Panel & Settings */}
        <div className="space-y-5 lg:col-span-4 no-print">
          {/* Preset Selector: Domestic vs Professional */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 p-4 shadow-sm dark:border-blue-900/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/20 space-y-3">
            <span className="text-xs font-black text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-600" />
              <span>اختر نوع المسير المستهدف:</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleWorkerCategoryChange('business')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  workerCategory === 'business'
                    ? 'border-blue-600 bg-blue-600 text-white font-black shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <Briefcase className="h-5 w-5 mb-1" />
                <span className="text-xs">عمالة مهنية وتجارية</span>
                <span className={`text-[10px] ${workerCategory === 'business' ? 'text-blue-100' : 'text-slate-400'}`}>
                  (شركات ومؤسسات / مدد)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleWorkerCategoryChange('domestic')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  workerCategory === 'domestic'
                    ? 'border-blue-600 bg-blue-600 text-white font-black shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <Home className="h-5 w-5 mb-1" />
                <span className="text-xs">عمالة منزلية</span>
                <span className={`text-[10px] ${workerCategory === 'domestic' ? 'text-blue-100' : 'text-slate-400'}`}>
                  (كفيل / أفراد / مساند)
                </span>
              </button>
            </div>
          </div>

          {/* Calendar System Switcher (Hijri vs Gregorian) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>نظام الأشهر والتقويم:</span>
              </span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {calendarType === 'hijri' ? 'الأشهر الهجرية' : 'الأشهر الميلادية'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCalendarChange('gregorian')}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition ${
                  calendarType === 'gregorian'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span>📅 ميلادي (يناير - ديسمبر)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCalendarChange('hijri')}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition ${
                  calendarType === 'hijri'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span>🌙 هجري (محرم - ذو الحجة)</span>
              </button>
            </div>
          </div>

          {/* Quick-Fill & Summary Box */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>التعبئة السريعة والحساب التلقائي</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={defaultSalary}
                onChange={(e) => setDefaultSalary(e.target.value)}
                placeholder="4500"
                className="w-full rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-blue-800 dark:bg-slate-900 dark:text-slate-100 font-mono"
              />
              <button
                type="button"
                onClick={handleQuickFill}
                className="whitespace-nowrap rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
              >
                تعبئة الـ 12 شهراً
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-blue-700 dark:text-blue-300">
                الصافي السنوي: <strong>{Number(totalNet).toLocaleString()} {currency}</strong>
              </span>
              <button
                type="button"
                onClick={handleResetTable}
                className="text-[11px] font-bold text-rose-600 hover:underline dark:text-rose-400"
              >
                تصفير الجدول
              </button>
            </div>
          </div>

          {/* Employer Type & Details (Required by user) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-extrabold text-blue-600 dark:border-slate-800 dark:text-blue-400">
              <Building2 className="h-4 w-4" />
              <span>بيانات صاحب العمل ونوع المنشأة</span>
            </div>

            {/* Employer Type Dropdown */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                نوع صاحب العمل (قائمة منسدلة):
              </label>
              <select
                value={employerType}
                onChange={(e) => setEmployerType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="company">🏢 شركة (شركة مساهمة / ذات مسؤولية محدودة)</option>
                <option value="establishment">🏪 مؤسسة (مؤسسة فردية / تجارية)</option>
                <option value="individual">👤 فرد / صاحب عمل (كفيل عمالة منزلية / رب أسرة)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم {employerTypeLabel}:
              </label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                placeholder={
                  employerType === 'individual'
                    ? 'مثال: خالد بن فهد السبيعي'
                    : employerType === 'establishment'
                    ? 'مثال: مؤسسة أفق التجارة للمقاولات'
                    : 'مثال: شركة أبعاد الريادة للتقنية'
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  طريقة الصرف:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="تحويل بنكي (مدد / حماية الأجور)">تحويل بنكي (مدد)</option>
                  <option value="بطاقة رواتب العمالة المنزلية (مدى)">بطاقة رواتب العمالة (مدى)</option>
                  <option value="تحويل بنكي مباشر">تحويل بنكي مباشر</option>
                  <option value="صرف نقدي مع التوقيع والبصمة">صرف نقدي مع التوقيع</option>
                  <option value="شيك مصرفي">شيك مصرفي</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  العملة:
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="KWD">دينار كويتي (KWD)</option>
                  <option value="BHD">دينار بحريني (BHD)</option>
                  <option value="OMR">ريال عماني (OMR)</option>
                  <option value="QAR">ريال قطري (QAR)</option>
                  <option value="USD">دولار (USD)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                الآيبان أو الحساب البنكي (اختياري):
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="SA0380000000..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Employee & Year Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-extrabold text-blue-600 dark:border-slate-800 dark:text-blue-400">
              <User className="h-4 w-4" />
              <span>بيانات {workerCategory === 'domestic' ? 'العامل / العاملة المنزلية' : 'الموظف'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  سنة المسير:
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder={calendarType === 'hijri' ? '1447 هـ' : '2026 م'}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  اسم {workerCategory === 'domestic' ? 'العامل/ة:' : 'الموظف:'}
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="مثال: أحمد محمد علي"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  المهنة / المسمى:
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={workerCategory === 'domestic' ? 'سائق خاص / عاملة منزلية' : 'محاسب / مهندس'}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الجنسية:
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="مثال: فلبينية / هندي / مصري"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                رقم الإقامة / الهوية الوطنية:
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="مثال: 2518123217"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Signatures, Stamp & Fingerprint Controls (Required by user) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="border-b border-slate-100 pb-2 text-xs font-extrabold text-blue-600 dark:border-slate-800 dark:text-blue-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PenTool className="h-4 w-4" />
                <span>التحكم في التوقيع والأختام والبصمة</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">تحكم مرن بالظهور</span>
            </div>

            {/* Signatory Mode Quick Selection */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                أطراف التوقيع المعتمدة:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSignatoryModeChange('both')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
                    signatoryMode === 'both'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  الطرفين (العامل والكفيل)
                </button>
                <button
                  type="button"
                  onClick={() => handleSignatoryModeChange('employee_only')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
                    signatoryMode === 'employee_only'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  العامل فقط
                </button>
                <button
                  type="button"
                  onClick={() => handleSignatoryModeChange('employer_only')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
                    signatoryMode === 'employer_only'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  صاحب العمل فقط
                </button>
              </div>
            </div>

            {/* Individual Signatures Checkboxes */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEmployeeSignature}
                  onChange={(e) => {
                    setShowEmployeeSignature(e.target.checked);
                    setSignatoryMode('custom');
                  }}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  إظهار توقيع {workerCategory === 'domestic' ? 'العامل / العاملة' : 'الموظف المستلم'}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEmployerSignature}
                  onChange={(e) => {
                    setShowEmployerSignature(e.target.checked);
                    setSignatoryMode('custom');
                  }}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  إظهار اعتماد وتوقيع {employerTypeLabel}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAccountantSignature}
                  onChange={(e) => setShowAccountantSignature(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  إظهار خانة تدقيق المحاسب / مسؤول الصرف
                </span>
              </label>
            </div>

            {/* Stamp vs Fingerprint Toggles (User explicit request) */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-500 mb-1">
                الأختام وبصمة الإبهام:
              </div>

              <label className="flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Stamp className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    إظهار خاتم المنشأة / الختم الرسمي
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showStamp}
                  onChange={(e) => setShowStamp(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl border border-blue-200 dark:border-blue-900 cursor-pointer bg-blue-50/50 dark:bg-blue-950/30">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900 dark:text-blue-200">
                    إظهار مربع بصمة إبهام العامل
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showFingerprint}
                  onChange={(e) => setShowFingerprint(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
              </label>
            </div>

            {/* Table Column Label for Sign/Fingerprint */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                عنوان خانة الاستلام بالجدول:
              </label>
              <select
                value={tableSignColumnLabel}
                onChange={(e) => setTableSignColumnLabel(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="both">البصمة / التوقيع</option>
                <option value="fingerprint">بصمة إبهام العامل</option>
                <option value="signature">توقيع المستلم</option>
              </select>
            </div>
          </div>

          {/* Display & Fonts Settings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="border-b border-slate-100 pb-2 text-xs font-extrabold text-blue-600 dark:border-slate-800 dark:text-blue-400">
              خيارات الترويسة والخطوط
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-900 dark:text-blue-200 bg-blue-50/60 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200/50 dark:border-blue-900/40">
                <input
                  type="checkbox"
                  checked={showEmployerHeader}
                  onChange={(e) => setShowEmployerHeader(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span>إظهار الترويسة العلوية (أطفئها للطباعة على ورق مروّس)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFooter}
                  onChange={(e) => setShowFooter(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">إظهار قسم التواقيع والتذييل بالكامل</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTotalsRow}
                  onChange={(e) => setShowTotalsRow(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">إظهار صف الإجمالي السنوي والتفقيط</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  خط العنوان:
                </label>
                <select
                  value={titleFont}
                  onChange={(e) => setTitleFont(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Tahoma">Tahoma</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  خط الجدول:
                </label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Tahoma">Tahoma</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Cairo">Cairo</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  حجم الخط:
                </label>
                <select
                  value={textSize}
                  onChange={(e) => setTextSize(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="13px">13px - صغير</option>
                  <option value="14px">14px - قياسي</option>
                  <option value="15px">15px - متوسط</option>
                  <option value="16px">16px - كبير</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  الهوامش:
                </label>
                <select
                  value={printMargin}
                  onChange={(e) => setPrintMargin(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="normal">متوازنة (18 مم)</option>
                  <option value="wide">واسعة (24 مم)</option>
                  <option value="extra">عريضة (28 مم)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Table & Live Preview */}
        <div className="space-y-4 lg:col-span-8">
          <div className="no-print flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-blue-600" />
              <span>معاينة مسير الرواتب المباشرة (تعديل الأرقام فوري بالجدول)</span>
            </h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              {workerCategory === 'domestic' ? '🏠 مساند / عمالة منزلية' : '🏢 مدد / عمالة تجارية'} • {calendarType === 'hijri' ? 'تقويم هجري' : 'تقويم ميلادي'}
            </span>
          </div>

          {/* Paper Styled Preview Container (Used for Direct Print via CSS) */}
          <div
            id="payroll-printable-paper"
            className="rounded-2xl border-2 border-slate-300 bg-white p-5 sm:p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-x-auto"
            style={{
              fontFamily: `${textFont}, Tahoma, sans-serif`,
              fontSize: textSize,
            }}
          >
            {/* Employer Header in Preview */}
            {showEmployerHeader && (
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6 dark:border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">المملكة العربية السعودية</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {employerName || employerTypeLabel}
                  </div>
                </div>
                <div className="text-left text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <div>مسير رواتب لسنة: <strong className="text-blue-600 dark:text-blue-400">{year}</strong></div>
                  <div>{workerCategorySubtitle}</div>
                </div>
              </div>
            )}

            {/* Document Header */}
            <div className="text-center mb-6">
              <h2
                className="text-xl sm:text-2xl font-black underline decoration-2 underline-offset-8 text-slate-900 dark:text-white"
                style={{ fontFamily: `${titleFont}, Tahoma, sans-serif` }}
              >
                {workerCategoryTitle}
              </h2>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <div>
                <span className="text-slate-500 dark:text-slate-400">اسم {workerCategory === 'domestic' ? 'العامل/ة: ' : 'الموظف: '}</span>
                <strong className="text-slate-900 dark:text-white">{employeeName}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">المهنة: </span>
                <strong>{jobTitle}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">الجنسية: </span>
                <strong>{nationality}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">رقم الإقامة: </span>
                <strong className="font-mono">{idNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{employerTypeLabel}: </span>
                <strong>{employerName}</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">طريقة الصرف: </span>
                <strong>{paymentMethod}</strong>
              </div>
              {iban && (
                <div className="col-span-2">
                  <span className="text-slate-500 dark:text-slate-400">الحساب / الآيبان: </span>
                  <strong className="font-mono">{iban}</strong>
                </div>
              )}
            </div>

            {/* Salary Interactive Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
              <table className="w-full text-center border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-2 border-b border-l border-slate-300 dark:border-slate-700">
                      الشهر ({calendarType === 'hijri' ? 'هجري' : 'ميلادي'})
                    </th>
                    <th className="p-2 border-b border-l border-slate-300 dark:border-slate-700">الراتب الأساسي</th>
                    <th className="p-2 border-b border-l border-slate-300 dark:border-slate-700">إضافات</th>
                    <th className="p-2 border-b border-l border-slate-300 dark:border-slate-700">حسميات</th>
                    <th className="p-2 border-b border-l border-slate-300 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      الصافي (تلقائي)
                    </th>
                    <th className="p-2 border-b border-slate-300 dark:border-slate-700">
                      {tableSignatureColTitle}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {rows.map((row, idx) => {
                    const net = calculateNet(row);
                    return (
                      <tr key={row.monthNum} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="p-2 border-l border-slate-300 dark:border-slate-700 font-bold bg-slate-50/50 dark:bg-slate-800/30 whitespace-nowrap">
                          {row.monthName}
                        </td>
                        <td className="p-1 border-l border-slate-300 dark:border-slate-700">
                          <input
                            type="text"
                            value={row.basic}
                            onChange={(e) => updateRow(idx, 'basic', e.target.value)}
                            placeholder="-"
                            className="w-full text-center bg-transparent py-1 font-mono focus:bg-white focus:outline-none dark:focus:bg-slate-800 rounded"
                          />
                        </td>
                        <td className="p-1 border-l border-slate-300 dark:border-slate-700">
                          <input
                            type="text"
                            value={row.additions}
                            onChange={(e) => updateRow(idx, 'additions', e.target.value)}
                            placeholder="-"
                            className="w-full text-center bg-transparent py-1 font-mono text-emerald-600 dark:text-emerald-400 focus:bg-white focus:outline-none dark:focus:bg-slate-800 rounded"
                          />
                        </td>
                        <td className="p-1 border-l border-slate-300 dark:border-slate-700">
                          <input
                            type="text"
                            value={row.deductions}
                            onChange={(e) => updateRow(idx, 'deductions', e.target.value)}
                            placeholder="-"
                            className="w-full text-center bg-transparent py-1 font-mono text-rose-600 dark:text-rose-400 focus:bg-white focus:outline-none dark:focus:bg-slate-800 rounded"
                          />
                        </td>
                        <td className="p-2 border-l border-slate-300 dark:border-slate-700 font-bold font-mono bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
                          {net > 0 ? Number(net).toLocaleString() : '-'}
                        </td>
                        <td className="p-1">
                          <label className="inline-flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.signatureReceived}
                              onChange={(e) => updateRow(idx, 'signatureReceived', e.target.checked)}
                              className="h-3.5 w-3.5 rounded accent-blue-600"
                            />
                            <span className="text-[11px] text-slate-500">تم الاستلام</span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Totals Row */}
                  {showTotalsRow && (
                    <tr className="bg-slate-100 dark:bg-slate-800 font-extrabold border-t-2 border-slate-400 dark:border-slate-600">
                      <td className="p-2.5 border-l border-slate-300 dark:border-slate-700">
                        الإجمالي السنوي
                      </td>
                      <td className="p-2.5 border-l border-slate-300 dark:border-slate-700 font-mono">
                        {totalBasic > 0 ? Number(totalBasic).toLocaleString() : '-'}
                      </td>
                      <td className="p-2.5 border-l border-slate-300 dark:border-slate-700 font-mono text-emerald-600 dark:text-emerald-400">
                        {totalAdditions > 0 ? Number(totalAdditions).toLocaleString() : '-'}
                      </td>
                      <td className="p-2.5 border-l border-slate-300 dark:border-slate-700 font-mono text-rose-600 dark:text-rose-400">
                        {totalDeductions > 0 ? Number(totalDeductions).toLocaleString() : '-'}
                      </td>
                      <td className="p-2.5 border-l border-slate-300 dark:border-slate-700 font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-sm">
                        {totalNet > 0 ? Number(totalNet).toLocaleString() : '-'}
                      </td>
                      <td className="p-2.5 text-slate-400">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tafqeet Sentence */}
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-3 text-center text-xs dark:border-slate-700 dark:bg-slate-800/50">
              <strong>إجمالي صافي أجور السنة كتابةً: </strong>
              <span>فقط {totalNetWords} لا غير</span>
            </div>

            {/* Footer with Signatures, Fingerprint, Stamp */}
            {showFooter && (
              <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-start justify-between gap-6 text-xs">
                {/* Employee Side (Right in RTL) */}
                <div className="space-y-3 flex-1 min-w-[240px]">
                  {showEmployeeSignature && (
                    <div>
                      <div>
                        <strong>توقيع المستلم ({workerCategory === 'domestic' ? 'العامل/ة' : 'الموظف'}): </strong>
                        <span>........................................</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        أقر باستلامي المبالغ والرواتب المذكورة أعلاه كاملة دون نقص.
                      </div>
                    </div>
                  )}

                  {showFingerprint && (
                    <div className="pt-1">
                      <div className="w-24 h-28 rounded-full border-2 border-dashed border-blue-400 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-300 text-center p-1">
                        <Fingerprint className="h-6 w-6 opacity-70 mb-1" />
                        <span className="text-[10px] font-bold">بصمة إبهام</span>
                        <span className="text-[9px]">العامل/ة</span>
                      </div>
                    </div>
                  )}

                  {showAccountantSignature && (
                    <div className="text-slate-600 dark:text-slate-400 pt-1">
                      <strong>إعداد وتدقيق المحاسب: </strong> ........................................
                    </div>
                  )}
                </div>

                {/* Employer Side (Left in RTL) */}
                <div className="space-y-3 flex-1 min-w-[240px] text-right">
                  {showEmployerSignature && (
                    <div>
                      <div>
                        <strong>اعتماد {employerTypeLabel}: </strong>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{employerName}</span>
                      </div>
                      <div className="mt-1">
                        <strong>التوقيع والاعتماد: </strong> ........................................
                      </div>
                    </div>
                  )}

                  {showStamp && (
                    <div className="pt-1">
                      <div className="h-20 w-32 rounded-xl border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-[10px] text-slate-500 font-bold text-center p-2 bg-slate-50/50 dark:bg-slate-800/40">
                        <Stamp className="h-5 w-5 opacity-50 mb-1 text-slate-400" />
                        <span>خاتم {employerType === 'individual' ? 'صاحب العمل' : 'المنشأة'}</span>
                        <span className="text-[9px] font-normal text-slate-400">الرسمي</span>
                      </div>
                    </div>
                  )}

                  <div className="text-slate-400 text-[11px] pt-1">
                    تاريخ الإصدار: {new Date().toISOString().slice(0, 10)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Print Button at Bottom */}
          <button
            type="button"
            onClick={handleDirectPrint}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-sm font-black text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-99 transition cursor-pointer"
          >
            <Printer className="h-5 w-5" />
            <span>طباعة مسير الرواتب فوراً أو حفظه كـ PDF (تنسيق A4 مجهز)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
