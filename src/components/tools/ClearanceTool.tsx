import React, { useState } from 'react';
import {
  FileSignature,
  Printer,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle2,
  Building2,
  UserCheck,
  Calendar,
  DollarSign,
  Fingerprint,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { tafqeet } from '../../utils/tafqeet';

interface ClearanceToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError?: (msg: string) => void;
}

export type ClearanceTemplate = 'final' | 'custody' | 'vacation' | 'domestic' | 'custom';

export const ClearanceTool: React.FC<ClearanceToolProps> = ({ onBack }) => {
  // 1. Template
  const [template, setTemplate] = useState<ClearanceTemplate>('final');

  // 2. Worker Information
  const [workerName, setWorkerName] = useState('عبد الرحمن محمد حسن');
  const [nationality, setNationality] = useState('مصري');
  const [idType, setIdType] = useState('الإقامة');
  const [idNumber, setIdNumber] = useState('2254545111');
  const [jobTitle, setJobTitle] = useState('محاسب عام');

  // 3. Entity Information
  const [entityType, setEntityType] = useState('شركة');
  const [entityName, setEntityName] = useState('شركة نسيج الأعمال للتقنية');
  const [entityCR, setEntityCR] = useState('1010895421');

  // 4. Dates & Period
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [clearanceDate, setClearanceDate] = useState(() => new Date().toISOString().slice(0, 10));

  // 5. Financial & Settlement
  const [includeAmount, setIncludeAmount] = useState(true);
  const [amount, setAmount] = useState('28500');
  const [currency, setCurrency] = useState('SAR');
  const [endOfServiceGratuity, setEndOfServiceGratuity] = useState('18000');
  const [vacationAllowance, setVacationAllowance] = useState('6500');
  const [lastMonthSalary, setLastMonthSalary] = useState('4000');
  const [showBreakdown, setShowBreakdown] = useState(true);

  // 6. Display Toggles
  const [showCompanyHeader, setShowCompanyHeader] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showFingerprint, setShowFingerprint] = useState(true);
  const [showEmployerSignature, setShowEmployerSignature] = useState(true);
  const [showStampBox, setShowStampBox] = useState(true);

  // 7. Styling & Print Margins
  const [titleFont, setTitleFont] = useState('Tahoma');
  const [textFont, setTextFont] = useState('Tahoma');
  const [textSize, setTextSize] = useState('18px');
  const [printMargin, setPrintMargin] = useState<'normal' | 'wide' | 'extra'>('wide');
  const [borderStyle, setBorderStyle] = useState<'solid' | 'double' | 'dashed'>('double');
  const [themeColor, setThemeColor] = useState<'slate' | 'navy' | 'emerald' | 'teal'>('teal');

  // 8. Custom text override if selected
  const [customText, setCustomText] = useState(
    'أقر أنا الموقع أدناه بكامل قواي العقلية وبصفتي النظامية، بأنني استلمت كافة مستحقاتي المالية والنظامية عن فترة عملي بالكامل، وليس لي أي مطالبات حالية أو مستقبلية، وهذا إخلاء طرف نهائي مني.'
  );

  const [copied, setCopied] = useState(false);

  // Words representation
  const amountWords = tafqeet(amount, currency, true) || '—';

  // Template pre-fill helper
  const handleTemplateChange = (tpl: ClearanceTemplate) => {
    setTemplate(tpl);
    if (tpl === 'final') {
      setIncludeAmount(true);
      setShowBreakdown(true);
    } else if (tpl === 'custody') {
      setIncludeAmount(false);
      setShowBreakdown(false);
    } else if (tpl === 'vacation') {
      setIncludeAmount(true);
      setShowBreakdown(false);
    } else if (tpl === 'domestic') {
      setIncludeAmount(true);
      setShowBreakdown(false);
    }
  };

  // Generate legal paragraph based on current template and includeAmount state
  const getClearanceParagraph = () => {
    if (template === 'custom') {
      return customText;
    }

    if (template === 'custody') {
      return `أقر أنا الموقع أدناه ${workerName || '[اسم الموظف]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الوثيقة]'})، وأعمل بمهنة (${jobTitle || '[المسمى الوظيفي]'}) لدى (${entityType} ${entityName || '[اسم المنشأة]'}) - بأنني قمت بتسليم كامل العُهد المسلّمة لي بحكم عملي، من أجهزة ومعدات وسيارات ووثائق وبطاقات عمل ومفاتيح وبيانات، بحالة سليمة وجيدة، ولا ذمة لي في أي عهدة أو مستندات، وأصبحت ذمتي بريئة وخالصة من أية عهد أو متعلقات عينية تخص (${entityType} ${entityName || '[اسم المنشأة]'}).`;
    }

    if (template === 'vacation') {
      if (includeAmount) {
        return `أقر أنا الموقع أدناه ${workerName || '[اسم الموظف]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الوثيقة]'})، بأنني استلمت كافة رواتبي ومستحقاتي الشهرية وبدل الإجازة السنوية المستحقة لي والمقدرة بمبلغ وقدره (${Number(amount || 0).toLocaleString()} ${currency === 'SAR' ? 'ريال سعودي' : currency}) [فقط ${amountWords}] حتى تاريخ ${clearanceDate} قبل قيامي بالإجازة النظامية، وأقر بأن طرف (${entityType} ${entityName || '[اسم المنشأة]'}) بريء وخالص من أي مبالغ أو استحقاقات سابقة لهذا التاريخ.`;
      } else {
        return `أقر أنا الموقع أدناه ${workerName || '[اسم الموظف]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الوثيقة]'})، بأنني استلمت كافة رواتبي ومستحقاتي الشهرية وبدل الإجازة السنوية المستحقة لي كاملة حتى تاريخ ${clearanceDate} قبل قيامي بالإجازة النظامية، وأقر بأن طرف (${entityType} ${entityName || '[اسم المنشأة]'}) بريء وخالص من أي مبالغ أو استحقاقات سابقة لهذا التاريخ.`;
      }
    }

    if (template === 'domestic') {
      if (includeAmount) {
        return `أقر أنا العامل / العاملة ${workerName || '[اسم العامل]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الإقامة/الجواز]'})، بأنني استلمت كامل رواتبي الشهرية وجميع مستحقاتي وبدلاتي وتذكرة السفر من صاحب العمل المكرم / (${entityName || '[اسم صاحب العمل]'}) منذ بداية عملي وحتى تاريخ انتهاء خدمتي، وأنني استلمت مبلغ وقدره (${Number(amount || 0).toLocaleString()} ${currency === 'SAR' ? 'ريال سعودي' : currency}) [فقط ${amountWords}]، وأبرئ ذمة صاحب العمل إبراءً تاماً شاملاً لا رجعة فيه، وليس لي أي حق أو مطالبة لديه.`;
      } else {
        return `أقر أنا العامل / العاملة ${workerName || '[اسم العامل]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الإقامة/الجواز]'})، بأنني استلمت كامل رواتبي الشهرية وجميع مستحقاتي وبدلاتي وتذكرة السفر من صاحب العمل المكرم / (${entityName || '[اسم صاحب العمل]'}) منذ بداية عملي وحتى تاريخ انتهاء خدمتي كاملة غير منقوصة، وأبرئ ذمة صاحب العمل إبراءً تاماً شاملاً لا رجعة فيه، وليس لي أي حق أو مطالبة لديه.`;
      }
    }

    // Default 'final'
    if (includeAmount) {
      return `أقر أنا الموقع أدناه ${workerName || '[اسم الموقع]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الوثيقة]'}) - بأنني استلمت كافة مستحقاتي النظامية من الأجور والأجور الإضافية وبدلات الإجازة ومكافأة نهاية الخدمة حسب نظام العمل والعمال السعودي من (${entityType} ${entityName || '[اسم المنشأة]'}) عن فترة عملي الممتدة من تاريخ ${startDate || '---'} وحتى تاريخ ترك العمل في ${endDate || '---'}، وأنني استلمت إجمالي مبالغي المستحقة وقدرها (${Number(amount || 0).toLocaleString()} ${currency === 'SAR' ? 'ريال سعودي' : currency}) [فقط ${amountWords}]، وبالتوقيع على هذا الإقرار أخلي طرف (${entityType} ${entityName || '[اسم المنشأة]'}) إخلاء طرف نهائياً وباتاً وتاماً من أي مستحقات أو حقوق أو مطالبات تتعلق بي، كما أتعهد بعدم المنازعة أمام أية جهة كانت مستقبلاً فيما يتعلق بانتهاء عملي أو الحصول على رواتبي ومستحقاتي، وأقر بأنني وقعت على هذا الإقرار بمحض إرادتي واختياري دون ضغط أو إكراه من أحد، وأصبح طرف (${entityType} ${entityName || '[اسم المنشأة]'}) خالصاً وليس لي أي حقوق لديها.`;
    } else {
      return `أقر أنا الموقع أدناه ${workerName || '[اسم الموقع]'}، ${nationality || '[الجنسية]'} الجنسية، بموجب ${idType} رقم (${idNumber || '[رقم الوثيقة]'}) - بأنني استلمت كافة مستحقاتي النظامية من الأجور والأجور الإضافية وبدلات الإجازة ومكافأة نهاية الخدمة وسائر حقوقي العمالية كاملة غير منقوصة حسب نظام العمل والعمال السعودي من (${entityType} ${entityName || '[اسم المنشأة]'}) عن فترة عملي الممتدة من تاريخ ${startDate || '---'} وحتى تاريخ ترك العمل في ${endDate || '---'}، وبالتوقيع على هذا الإقرار أخلي طرف (${entityType} ${entityName || '[اسم المنشأة]'}) إخلاء طرف نهائياً وباتاً وتاماً من أي مستحقات أو حقوق أو مطالبات تتعلق بي، كما أتعهد بعدم المنازعة أمام أية جهة كانت مستقبلاً فيما يتعلق بانتهاء عملي أو الحصول على رواتبي ومستحقاتي، وأقر بأنني وقعت على هذا الإقرار بمحض إرادتي واختياري دون ضغط أو إكراه من أحد، وأصبح طرف (${entityType} ${entityName || '[اسم المنشأة]'}) خالصاً وبراءة ذمته تامة وليس لي أي حقوق لديها.`;
    }
  };

  // 1. Popup Window Print (preserving and perfecting the exact requested popup printing flow!)
  const openPrintWindow = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=850');
    if (!printWindow) {
      window.print();
      return;
    }

    const title =
      template === 'custody'
        ? 'إخلاء طرف وتسليم عهدة'
        : template === 'vacation'
        ? 'مخالصة إجازة واستلام مستحقات'
        : template === 'domestic'
        ? 'مخالصة نهائية للعمالة'
        : 'مخالصة نهائية وإخلاء طرف';

    const pText = getClearanceParagraph();

    const breakdownHtml =
      includeAmount && showBreakdown && template === 'final'
        ? `
        <div style="margin: 20px 0; border: 1px solid #111; border-radius: 4px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 13px;">
            <thead>
              <tr style="background: #f0f0f0; border-bottom: 1px solid #111;">
                <th style="padding: 7px; border-left: 1px solid #111;">بيان المستحق</th>
                <th style="padding: 7px; border-left: 1px solid #111;">مكافأة نهاية الخدمة</th>
                <th style="padding: 7px; border-left: 1px solid #111;">بدل رصيد الإجازات</th>
                <th style="padding: 7px; border-left: 1px solid #111;">أجر آخر شهر ومستحقات أخرى</th>
                <th style="padding: 7px; font-weight: bold; background: #e5e7eb;">الإجمالي المستلم</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 7px; border-left: 1px solid #111;">المبلغ المستحق</td>
                <td style="padding: 7px; border-left: 1px solid #111;">${Number(endOfServiceGratuity || 0).toLocaleString()} ${currency}</td>
                <td style="padding: 7px; border-left: 1px solid #111;">${Number(vacationAllowance || 0).toLocaleString()} ${currency}</td>
                <td style="padding: 7px; border-left: 1px solid #111;">${Number(lastMonthSalary || 0).toLocaleString()} ${currency}</td>
                <td style="padding: 7px; font-weight: bold; background: #f9fafb;">${Number(amount || 0).toLocaleString()} ${currency}</td>
              </tr>
            </tbody>
          </table>
          <div style="background: #fafafa; padding: 6px 12px; font-size: 12px; border-top: 1px solid #ccc; text-align: center;">
            <strong>المبلغ الإجمالي كتابةً:</strong> فقط ${amountWords} لا غير
          </div>
        </div>
      `
        : '';

    // Print margin calculations: comfortably larger margins as explicitly requested
    const marginCss =
      printMargin === 'extra' ? '28mm 26mm' : printMargin === 'normal' ? '18mm 18mm' : '25mm 25mm';
    const bodyPadding =
      printMargin === 'extra' ? '30px 40px' : printMargin === 'normal' ? '18px 24px' : '25px 35px';

    const headerHtml = showCompanyHeader
      ? `
        <div class="header-box">
          <div class="entity-info">
            <div>المملكة العربية السعودية</div>
            <div>${entityType}: <strong>${entityName}</strong></div>
            ${entityCR ? `<div>سجل تجاري / ترخيص: ${entityCR}</div>` : ''}
          </div>
          <div class="meta-info">
            ${showDate ? `<div>التاريخ: <strong>${clearanceDate}</strong></div>` : ''}
            <div>الرقم المرجعي: <strong>CLR-${Date.now().toString().slice(-6)}</strong></div>
          </div>
        </div>
      `
      : '';

    const printContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${title} - ${workerName}</title>
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
            color: #111;
            background: #fff;
            font-family: '${textFont}', 'Tahoma', 'Cairo', Arial, sans-serif;
            direction: rtl;
            line-height: 1.85;
          }
          .doc-border {
            border: ${showBorder ? `3px ${borderStyle} #222` : 'none'};
            padding: ${showBorder ? '28px 32px' : '0'};
            border-radius: 6px;
            min-height: 92vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #222;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .entity-info {
            font-size: 14px;
            font-weight: bold;
            line-height: 1.6;
          }
          .meta-info {
            font-size: 13px;
            text-align: left;
            line-height: 1.6;
          }
          h1.doc-title {
            text-align: center;
            margin: 10px 0 20px 0;
            font-size: 24px;
            font-family: '${titleFont}', 'Tahoma', Arial, sans-serif;
            text-decoration: underline;
            letter-spacing: 0.5px;
          }
          p.main-p {
            line-height: 2.3;
            font-size: ${textSize};
            text-align: justify;
            margin-bottom: 18px;
            text-justify: inter-word;
          }
          p.main-p strong {
            color: #000;
          }
          p.centered-declaration {
            text-align: center;
            font-weight: bold;
            margin: 20px 0;
            font-size: ${textSize};
            letter-spacing: 0.5px;
          }
          .signatures-area {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px dashed #666;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            font-size: ${textSize};
          }
          .sign-col {
            flex: 1;
            line-height: 2.2;
          }
          .stamp-box {
            width: 140px;
            height: 110px;
            border: 2px dashed #999;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 13px;
            text-align: center;
            margin-top: 8px;
          }
          .fingerprint-box {
            width: 100px;
            height: 85px;
            border: 1px solid #777;
            border-radius: 4px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            text-align: center;
            font-size: 11px;
            line-height: 85px;
            color: #777;
          }
          @media print {
            body {
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .doc-border {
              border-color: #000;
              min-height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="doc-border">
          <div>
            <!-- Header (conditional) -->
            ${headerHtml}

            <!-- Title -->
            <h1 class="doc-title">${title}</h1>

            <!-- Paragraph -->
            <p class="main-p">
              ${pText}
            </p>

            ${breakdownHtml}

            <p class="centered-declaration">
              « وهذا إقرار وتنازل وتعهد صريح مني بما ورد في أعلاه،،، »
            </p>
          </div>

          <!-- Signatures Section -->
          <div class="signatures-area">
            <!-- Employee/Signee -->
            <div class="sign-col">
              <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 8px;">
                المُقِر بما فيه (الطرف الأول):
              </div>
              <div>الاسم: <strong>${workerName}</strong></div>
              <div>رقم ${idType}: <strong>${idNumber}</strong></div>
              ${showSignature ? '<div>التوقيع: ........................................</div>' : ''}
              ${showDate ? `<div>تاريخ التوقيع: ${clearanceDate}</div>` : ''}
              ${
                showFingerprint
                  ? `
                <div style="margin-top: 6px;">
                  البصمة: <div class="fingerprint-box">مكان البصمة</div>
                </div>
              `
                  : ''
              }
            </div>

            <!-- Employer -->
            ${
              showEmployerSignature
                ? `
              <div class="sign-col" style="text-align: left; direction: ltr;">
                <div style="direction: rtl; text-align: right;">
                  <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 8px;">
                    اعتماد ${entityType} (الطرف الثاني):
                  </div>
                  <div>المسؤول المعتمد: ..............................</div>
                  <div>الصفة / الإدارة: إدارة الموارد البشرية</div>
                  <div>التوقيع: ........................................</div>
                  ${showStampBox ? '<div class="stamp-box">خاتم المنشأة الرسمي</div>' : ''}
                </div>
              </div>
            `
                : ''
            }
          </div>
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

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Copy text helper
  const handleCopyText = async () => {
    const text = `${
      template === 'custody'
        ? 'إخلاء طرف وتسليم عهدة'
        : template === 'vacation'
        ? 'مخالصة إجازة واستلام مستحقات'
        : 'مخالصة نهائية وإخلاء طرف'
    }\n\n${getClearanceParagraph()}\n\nالمقر بما فيه:\nالاسم: ${workerName}\nرقم ${idType}: ${idNumber}\nالتاريخ: ${clearanceDate}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleInPagePrint = () => {
    window.print();
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400">
              <FileSignature className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  نموذج تعبئة وطباعة المخالصة الإلكترونية
                </h2>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  نظام العمل و PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إعداد مخالصات نهائية، إخلاء طرف، وتسليم عُهد مع المعاينة والطباعة الفورية عبر نافذة منبثقة
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600">تم نسخ النص!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>نسخ النص</span>
              </>
            )}
          </button>

          <button
            onClick={handleInPagePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <Printer className="h-4 w-4" />
            <span>طباعة الصفحة</span>
          </button>

          <button
            onClick={openPrintWindow}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:from-teal-700 hover:to-emerald-700 active:scale-98 transition"
          >
            <ExternalLink className="h-4 w-4" />
            <span>طباعة المخالصة عبر نافذة منبثقة</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Form Control Panel (Right) & Live Preview (Left) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left/Right Order: Controls */}
        <div className="space-y-5 lg:col-span-5">
          {/* Template Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
              اختر نوع المخالصة / الصيغة القانونية:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTemplateChange('final')}
                className={`rounded-xl border px-3 py-2 text-xs font-bold text-right transition ${
                  template === 'final'
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-300'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <div>مخالصة نهاية خدمة</div>
                <span className="text-[10px] font-normal text-slate-500">نظام العمل واستلام المستحقات</span>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateChange('custody')}
                className={`rounded-xl border px-3 py-2 text-xs font-bold text-right transition ${
                  template === 'custody'
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-300'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <div>إخلاء طرف وتسليم عُهدة</div>
                <span className="text-[10px] font-normal text-slate-500">أجهزة ومعدات وبراءة ذمة</span>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateChange('vacation')}
                className={`rounded-xl border px-3 py-2 text-xs font-bold text-right transition ${
                  template === 'vacation'
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-300'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <div>مخالصة إجازة سنوية</div>
                <span className="text-[10px] font-normal text-slate-500">رواتب وبدل إجازة مستحقة</span>
              </button>

              <button
                type="button"
                onClick={() => handleTemplateChange('domestic')}
                className={`rounded-xl border px-3 py-2 text-xs font-bold text-right transition ${
                  template === 'domestic'
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-950 dark:text-teal-300'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <div>عمالة وسائق خاص</div>
                <span className="text-[10px] font-normal text-slate-500">رواتب وبراءة ذمة الكفيل</span>
              </button>
            </div>
          </div>

          {/* Section 1: Signee / Worker Data */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-extrabold text-teal-600 dark:border-slate-800 dark:text-teal-400">
              <UserCheck className="h-4 w-4" />
              <span>بيانات الطرف الأول (الشخص الموقع)</span>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم الشخص الموقع (المقر):
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="مثال: عبد الرحمن محمد"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  الجنسية:
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="مثال: مصري"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  نوع وثيقة الهوية:
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="الإقامة">الإقامة</option>
                  <option value="الهوية الوطنية">الهوية الوطنية</option>
                  <option value="جواز السفر">جواز السفر</option>
                  <option value="رقم الحدود">رقم الحدود</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رقم الوثيقة / الإقامة:
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="مثال: 2254545111"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  المسمى الوظيفي:
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="مثال: محاسب عام"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Entity Data */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-extrabold text-teal-600 dark:border-slate-800 dark:text-teal-400">
              <Building2 className="h-4 w-4" />
              <span>بيانات الطرف الثاني (المنشأة / صاحب العمل)</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  نوع المنشأة:
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="شركة">شركة</option>
                  <option value="مؤسسة">مؤسسة</option>
                  <option value="صاحب العمل">صاحب العمل</option>
                  <option value="جهة العمل">جهة العمل</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  اسم المنشأة / صاحب العمل:
                </label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="مثال: شركة المسل"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رقم السجل التجاري / الترخيص:
                </label>
                <input
                  type="text"
                  value={entityCR}
                  onChange={(e) => setEntityCR(e.target.value)}
                  placeholder="مثال: 1010895421"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  تاريخ المخالصة:
                </label>
                <input
                  type="date"
                  value={clearanceDate}
                  onChange={(e) => setClearanceDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {template === 'final' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    تاريخ بداية العمل:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    تاريخ انتهاء العمل:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Financial Settlements & Amount Toggle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-extrabold text-teal-600 dark:border-slate-800 dark:text-teal-400">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>المستحقات المالية والتفقيط</span>
              </div>
              <span className="text-[11px] font-normal text-slate-400">إظهار أو إخفاء المبالغ</span>
            </div>

            {/* Master Amount Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  إظهار المبالغ المالية في المخالصة
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {includeAmount
                    ? 'المبالغ والتفقيط ظاهرة في نص المخالصة والجدول والطباعة'
                    : 'تم إخفاء المبالغ (مخالصة عامة خالية من أي مبالغ أو أرقام)'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAmount}
                  onChange={(e) => setIncludeAmount(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
              </label>
            </div>

            {includeAmount ? (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      إجمالي المبلغ المستلم:
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="28500"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      العملة:
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      <option value="SAR">ريال سعودي</option>
                      <option value="AED">درهم إماراتي</option>
                      <option value="EGP">جنيه مصري</option>
                      <option value="KWD">دينار كويتي</option>
                      <option value="USD">دولار أمريكي</option>
                    </select>
                  </div>
                </div>

                {/* Tafqeet result banner */}
                <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-2.5 text-xs text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300">
                  <span className="font-bold">المبلغ كتابةً: </span>
                  <span>فقط {amountWords} لا غير</span>
                </div>

                {template === 'final' && (
                  <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        تفصيل البنود (جدول مصغر في المستند):
                      </label>
                      <input
                        type="checkbox"
                        checked={showBreakdown}
                        onChange={(e) => setShowBreakdown(e.target.checked)}
                        className="h-4 w-4 rounded accent-teal-600"
                      />
                    </div>

                    {showBreakdown && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div>
                          <label className="mb-1 block text-[11px] text-slate-600 dark:text-slate-400">
                            مكافأة نهاية الخدمة:
                          </label>
                          <input
                            type="number"
                            value={endOfServiceGratuity}
                            onChange={(e) => setEndOfServiceGratuity(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-mono dark:border-slate-700 dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-slate-600 dark:text-slate-400">
                            بدل الإجازة:
                          </label>
                          <input
                            type="number"
                            value={vacationAllowance}
                            onChange={(e) => setVacationAllowance(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-mono dark:border-slate-700 dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-slate-600 dark:text-slate-400">
                            آخر راتب / أخرى:
                          </label>
                          <input
                            type="number"
                            value={lastMonthSalary}
                            onChange={(e) => setLastMonthSalary(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-mono dark:border-slate-700 dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                تم إخفاء مبالغ المستحقات من المخالصة. ستُطبع المخالصة بصيغة إبراء ذمة عامة وشاملة دون إيراد أي أرقام أو جداول مالية.
              </div>
            )}
          </div>

          {/* Section 4: Display Options & Toggles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="border-b border-slate-100 pb-2 text-xs font-extrabold text-teal-600 dark:border-slate-800 dark:text-teal-400">
              خيارات إظهار وإخفاء الأقسام والترويسة
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-900 dark:text-teal-200 col-span-2 bg-teal-50/60 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-200/50 dark:border-teal-900/40">
                <input
                  type="checkbox"
                  checked={showCompanyHeader}
                  onChange={(e) => setShowCompanyHeader(e.target.checked)}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                <span>إظهار ترويسة المنشأة في الأعلى (أطفئها للطباعة على ورق مروّس مسبقاً)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBorder}
                  onChange={(e) => setShowBorder(e.target.checked)}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                <span className="text-slate-700 dark:text-slate-300">إظهار الإطار الخارجي</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDate}
                  onChange={(e) => setShowDate(e.target.checked)}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                <span className="text-slate-700 dark:text-slate-300">إظهار حقل التاريخ</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSignature}
                  onChange={(e) => setShowSignature(e.target.checked)}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                <span className="text-slate-700 dark:text-slate-300">إظهار خانة التوقيع</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFingerprint}
                  onChange={(e) => setShowFingerprint(e.target.checked)}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                <span className="text-slate-700 dark:text-slate-300">إظهار مربع البصمة</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEmployerSignature}
                  onChange={(e) => setShowEmployerSignature(e.target.checked)}
                  className="h-4 w-4 rounded accent-teal-600"
                />
                <span className="text-slate-700 dark:text-slate-300">اعتماد المنشأة والخاتم</span>
              </label>
            </div>
          </div>

          {/* Section 5: Fonts, Styles & Margins */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="border-b border-slate-100 pb-2 text-xs font-extrabold text-teal-600 dark:border-slate-800 dark:text-teal-400">
              إعدادات الخطوط وهامش الطباعة
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  نوع الخط:
                </label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Tahoma">Tahoma (الرسمي)</option>
                  <option value="Arial">Arial</option>
                  <option value="Cairo">Cairo (عصري)</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  حجم الخط للطباعة:
                </label>
                <select
                  value={textSize}
                  onChange={(e) => setTextSize(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="15px">15px - عادي</option>
                  <option value="17px">17px - متوسط مريح</option>
                  <option value="18px">18px - كبير وواضح</option>
                  <option value="20px">20px - كبير جداً</option>
                  <option value="22px">22px - بارز وضخم</option>
                  <option value="24px">24px - فائق الوضوح</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  هوامش الطباعة:
                </label>
                <select
                  value={printMargin}
                  onChange={(e) => setPrintMargin(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="normal">متوازنة (18 مم)</option>
                  <option value="wide">واسعة مريحة (25 مم)</option>
                  <option value="extra">عريضة جداً (28 مم)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  نمط الإطار:
                </label>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="double">مزدوج رسمي</option>
                  <option value="solid">مفرد مستمر</option>
                  <option value="dashed">منقط / متقطع</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right/Left Order: Live Preview Container */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>المعاينة الحية للمستند الرسمي (A4)</span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                مباشر
              </span>
            </h3>
            <span className="text-xs text-slate-400">تحديث فوري مع كل تعديل</span>
          </div>

          {/* Document Preview Box (Paper styled) */}
          <div
            id="clearance-paper"
            className="rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-10 shadow-lg dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all"
            style={{
              fontFamily: `${textFont}, Tahoma, sans-serif`,
              fontSize: textSize,
              borderStyle: showBorder ? borderStyle : 'none',
              borderWidth: showBorder ? '3px' : '0px',
            }}
          >
            {/* Header in Preview */}
            {showCompanyHeader && (
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-6 dark:border-slate-100">
                <div className="text-xs font-bold leading-relaxed">
                  <div>المملكة العربية السعودية</div>
                  <div>
                    {entityType}: <span className="text-teal-700 dark:text-teal-300 font-extrabold">{entityName || '[اسم المنشأة]'}</span>
                  </div>
                  {entityCR && <div className="text-slate-500 dark:text-slate-400">س.ت / ترخيص: {entityCR}</div>}
                </div>

                <div className="text-left text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {showDate && <div>التاريخ: <strong className="text-slate-900 dark:text-white">{clearanceDate}</strong></div>}
                  <div>الرقم: <strong>CLR-2026</strong></div>
                </div>
              </div>
            )}

            {/* Document Title */}
            <div className="text-center my-5">
              <h2
                className="text-xl sm:text-2xl font-black underline decoration-2 underline-offset-8 text-slate-900 dark:text-white"
                style={{ fontFamily: `${titleFont}, Tahoma, sans-serif` }}
              >
                {template === 'custody'
                  ? 'إخلاء طرف وتسليم عُهدة'
                  : template === 'vacation'
                  ? 'مخالصة إجازة سنوية واستلام مستحقات'
                  : template === 'domestic'
                  ? 'مخالصة نهائية للعمالة المنزلية'
                  : 'مخالصة نهائية وإخلاء طرف'}
              </h2>
            </div>

            {/* Body Paragraph */}
            <div className="my-6 leading-loose text-justify space-y-4">
              <p className="leading-relaxed">
                {template === 'custom' ? (
                  customText
                ) : (
                  <>
                    أقر أنا الموقع أدناه{' '}
                    <span className="font-extrabold text-teal-700 dark:text-teal-300 underline">
                      {workerName || '[اسم الموقع]'}
                    </span>
                    ،{' '}
                    <span className="font-extrabold text-teal-700 dark:text-teal-300">
                      {nationality || '[الجنسية]'}
                    </span>{' '}
                    الجنسية، بموجب {idType} رقم{' '}
                    <span className="font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                      {idNumber || '[رقم الوثيقة]'}
                    </span>
                    {template === 'custody' && (
                      <>
                        ، وبمهنة <span className="font-extrabold">{jobTitle || '[المسمى الوظيفي]'}</span> لدى (
                        {entityType} <span className="font-extrabold">{entityName || '[اسم المنشأة]'}</span>) بأنني قمت
                        بتسليم كامل العُهد المسلّمة لي بحكم عملي من أجهزة ومعدات وسيارات ووثائق، بحالة سليمة وجيدة، ولا
                        ذمة لي في أي عهدة أو متعلقات، وأصبحت ذمتي بريئة وخالصة من أية عهد تخص المنشأة.
                      </>
                    )}
                    {template === 'vacation' && (
                      <>
                        ، بأنني استلمت كافة رواتبي ومستحقاتي الشهرية وبدل الإجازة السنوية {includeAmount ? (
                          <>
                            المستحقة لي والمقدرة بمبلغ وقدره (
                            <span className="font-extrabold font-mono">{Number(amount || 0).toLocaleString()} {currency}</span>
                            ) [فقط {amountWords}]
                          </>
                        ) : 'النظامية المستحقة لي كاملة'} حتى تاريخ {clearanceDate} قبل قيامي بالإجازة النظامية، وأقر بأن طرف ({entityType}{' '}
                        {entityName}) بريء وخالص من أي مبالغ أو استحقاقات سابقة لهذا التاريخ.
                      </>
                    )}
                    {template === 'domestic' && (
                      <>
                        ، بأنني استلمت كامل رواتبي الشهرية وجميع مستحقاتي وبدلاتي وتذكرة السفر من صاحب العمل المكرم / ({entityName || '[اسم صاحب العمل]'}) منذ بداية عملي وحتى تاريخ انتهاء خدمتي{includeAmount ? (
                          <>
                            ، وأنني استلمت مبلغ وقدره (
                            <span className="font-extrabold font-mono">{Number(amount || 0).toLocaleString()} {currency}</span>
                            ) [فقط {amountWords}]
                          </>
                        ) : ' كاملة غير منقوصة'}، وأبرئ ذمة صاحب العمل إبراءً تاماً شاملاً لا رجعة فيه، وليس لي أي حق أو مطالبة لديه.
                      </>
                    )}
                    {template === 'final' && (
                      <>
                        {' '}
                        - بأنني استلمت كافة مستحقاتي النظامية من الأجور والأجور الإضافية وبدلات الإجازة ومكافأة نهاية الخدمة
                        {includeAmount ? (
                          <>
                            حسب نظام العمل والعمال السعودي من ({entityType}{' '}
                            <span className="font-extrabold text-teal-700 dark:text-teal-300">{entityName || '[اسم المنشأة]'}</span>
                            ) منذ بداية عملي لديهم في {startDate || '---'} وحتى ترك العمل في {endDate || '---'}، وأنني استلمت
                            إجمالي مستحقاتي وقدرها (
                            <span className="font-extrabold font-mono text-teal-700 dark:text-teal-300">
                              {Number(amount || 0).toLocaleString()} {currency}
                            </span>
                            ) [فقط {amountWords}]،
                          </>
                        ) : (
                          <>
                            {' '}وسائر حقوقي العمالية كاملة غير منقوصة حسب نظام العمل والعمال السعودي من ({entityType}{' '}
                            <span className="font-extrabold text-teal-700 dark:text-teal-300">{entityName || '[اسم المنشأة]'}</span>
                            ) منذ بداية عملي لديهم في {startDate || '---'} وحتى ترك العمل في {endDate || '---'}،
                          </>
                        )}
                        {' '}وبالتوقيع على هذا الإقرار أخلي طرف ({entityType}{' '}
                        <span className="font-extrabold">{entityName || '[اسم المنشأة]'}</span>) إخلاء طرف نهائياً وباتاً وتاماً من
                        أي مستحقات أو حقوق أو مطالبات تتعلق بي، كما أتعهد بعدم المنازعة أمام أية جهة كانت مستقبلاً فيما يتعلق بانتهاء عملي أو
                        الحصول على رواتبي ومستحقاتي، وأقر بأنني وقعت على هذا الإقرار بمحض إرادتي واختياري دون ضغط أو إكراه من أحد، وأن
                        يصبح طرف ({entityType} {entityName || '[اسم المنشأة]'}) خالصاً وبراءة ذمته تامة وليس لي أي حقوق لديه.
                      </>
                    )}
                  </>
                )}
              </p>

              {/* Dues Breakdown Table in Preview */}
              {includeAmount && showBreakdown && template === 'final' && (
                <div className="overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 my-4 text-xs">
                  <table className="w-full text-center">
                    <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="p-2 border-l border-slate-300 dark:border-slate-700">مكافأة نهاية الخدمة</th>
                        <th className="p-2 border-l border-slate-300 dark:border-slate-700">بدل الإجازات</th>
                        <th className="p-2 border-l border-slate-300 dark:border-slate-700">آخر راتب / أخرى</th>
                        <th className="p-2 bg-teal-50 dark:bg-teal-950 font-black text-teal-800 dark:text-teal-300">الإجمالي المستلم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="p-2 border-l border-slate-300 dark:border-slate-700 font-mono">
                          {Number(endOfServiceGratuity || 0).toLocaleString()} {currency}
                        </td>
                        <td className="p-2 border-l border-slate-300 dark:border-slate-700 font-mono">
                          {Number(vacationAllowance || 0).toLocaleString()} {currency}
                        </td>
                        <td className="p-2 border-l border-slate-300 dark:border-slate-700 font-mono">
                          {Number(lastMonthSalary || 0).toLocaleString()} {currency}
                        </td>
                        <td className="p-2 font-bold font-mono bg-teal-50/50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300">
                          {Number(amount || 0).toLocaleString()} {currency}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-slate-50 p-2 text-center text-[11px] text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                    <strong>المبلغ بالحروف:</strong> فقط {amountWords} لا غير
                  </div>
                </div>
              )}

              {/* Declaration Statement */}
              <p className="text-center font-bold text-slate-800 dark:text-slate-200 pt-2">
                « وهذا إقرار وتعهد مني بما ورد في أعلاه،،، »
              </p>
            </div>

            {/* Footer / Signatures in Preview */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-start justify-between gap-6 text-xs">
              {/* Employee/Signer Block */}
              <div className="space-y-2">
                <div className="font-extrabold text-slate-900 dark:text-white border-b pb-1">
                  المُقِر بما فيه (الطرف الأول):
                </div>
                <div>الاسم: <strong className="text-teal-700 dark:text-teal-300">{workerName}</strong></div>
                <div>رقم {idType}: <strong className="font-mono">{idNumber}</strong></div>
                {showSignature && <div>التوقيع: ........................................</div>}
                {showDate && <div>التاريخ: {clearanceDate}</div>}
                {showFingerprint && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-slate-500">البصمة:</span>
                    <div className="h-16 w-20 rounded border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400">
                      مكان البصمة
                    </div>
                  </div>
                )}
              </div>

              {/* Employer / Company Block */}
              {showEmployerSignature && (
                <div className="space-y-2 text-right">
                  <div className="font-extrabold text-slate-900 dark:text-white border-b pb-1">
                    اعتماد {entityType} (الطرف الثاني):
                  </div>
                  <div>المسؤول المعتمد: ..............................</div>
                  <div>الصفة: إدارة الموارد البشرية</div>
                  <div>التوقيع: ........................................</div>
                  {showStampBox && (
                    <div className="pt-2">
                      <div className="h-16 w-28 rounded-lg border-2 border-dashed border-slate-400 flex items-center justify-center text-[11px] text-slate-400 font-bold text-center p-1">
                        خاتم المنشأة
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Primary Print Button at Bottom of Preview */}
          <button
            onClick={openPrintWindow}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-4 text-sm font-black text-white shadow-lg hover:from-teal-700 hover:to-emerald-700 active:scale-99 transition"
          >
            <ExternalLink className="h-5 w-5" />
            <span>طباعة المخالصة عبر نافذة منبسطة (جاهزة للطباعة فوراً)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
