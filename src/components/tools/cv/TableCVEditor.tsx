import React, { useState, useRef } from 'react';
import {
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Download,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Loader2,
  Calendar,
  CreditCard,
  Building,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import { triggerFileDownload } from '../../../utils/pdfUtils';
import { TranslationDict } from '../../../i18n/translations';

interface TableCVEditorProps {
  t: TranslationDict;
  onBackToSelector: () => void;
  onBackToHome: () => void;
}

export interface TableRowItem {
  id: string;
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
}

export interface CustomTableSection {
  id: string;
  title: string;
  headers: string[];
  rows: TableRowItem[];
}

export const TableCVEditor: React.FC<TableCVEditorProps> = ({
  t,
  onBackToSelector,
  onBackToHome,
}) => {
  // Appearance
  const [headerBgColor, setHeaderBgColor] = useState('#1e3a8a'); // Navy Blue
  const [tableBorderColor, setTableBorderColor] = useState('#cbd5e1'); // Slate border
  const [fontFamily, setFontFamily] = useState('Tajawal');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Personal Info (Government / Corporate standard)
  const [fullName, setFullName] = useState('أحمد محمد الشهري');
  const [jobTitle, setJobTitle] = useState('محاسب أول ومدير رقابة مالية');
  const [email, setEmail] = useState('ahmed.alshahri@example.com');
  const [phoneNumber, setPhoneNumber] = useState('50 123 4567');
  const [countryCode, setCountryCode] = useState('+966');
  const [location, setLocation] = useState('الرياض، المملكة العربية السعودية');
  const [nationality, setNationality] = useState('سعودي');
  const [nationalityCode, setNationalityCode] = useState('sa');
  const [idType, setIdType] = useState('الهوية الوطنية');
  const [idNumber, setIdNumber] = useState('1098765432');
  const [dobCalendarType, setDobCalendarType] = useState<'م' | 'هـ'>('هـ');
  const [dobDay, setDobDay] = useState('15');
  const [dobMonth, setDobMonth] = useState('06');
  const [dobYear, setDobYear] = useState('1415');
  const [maritalStatus, setMaritalStatus] = useState('متزوج');
  const [drivingLicense, setDrivingLicense] = useState('سارية المفعول (خصوصي)');

  // Career Objective / Summary
  const [objective, setObjective] = useState(
    'محاسب مالي بخبرة تزيد عن 7 سنوات في إعداد القوائم المالية، المراجعة والتدقيق المحاسبي، ورفع الإقرارات الضريبية والزكوية. أسعى لتوظيف مهاراتي في ضبط الحسابات وتطوير الأنظمة الرقابية الداخلية والمساهمة في تحقيق الكفاءة المالية للمنظمة.'
  );

  // Education Qualifications Table
  const [educationRows, setEducationRows] = useState<TableRowItem[]>([
    {
      id: '1',
      col1: 'بكالوريوس المحاسبة المالية',
      col2: 'جامعة الملك سعود - كلية إدارة الأعمال',
      col3: '1439 هـ / 2018 م',
      col4: 'ممتاز مع مرتبة الشرف الثانية',
    },
    {
      id: '2',
      col1: 'شهادة زمالة الهيئة السعودية للمراجعين والمحاسبين (SOCPA)',
      col2: 'الهيئة السعودية للمراجعين والمحاسبين',
      col3: '1442 هـ / 2020 م',
      col4: 'معتمد مهنياً',
    },
  ]);

  // Professional Experience Table
  const [experienceRows, setExperienceRows] = useState<TableRowItem[]>([
    {
      id: '1',
      col1: 'محاسب أول ورئيس قسم التدقيق الداخلي',
      col2: 'شركة الأفق القابضة للاستثمار',
      col3: '1443 هـ - حتى الآن',
      col4: 'إعداد التقارير المالية الربعية، مراجعة قيود اليومية، والإشراف على إقفال الفترات المحاسبية.',
    },
    {
      id: '2',
      col1: 'محاسب عام ومسؤول إقرارات ضريبية',
      col2: 'مؤسسة الرياض التجارية والصناعية',
      col3: '1439 - 1443 هـ',
      col4: 'إدارة حسابات الموردين والعملاء، ومطابقة الحسابات البنكية، ورفع إقرارات ضريبة القيمة المضافة.',
    },
  ]);

  // Training Courses Table
  const [courseRows, setCourseRows] = useState<TableRowItem[]>([
    {
      id: '1',
      col1: 'المعايير الدولية لإعداد التقارير المالية (IFRS)',
      col2: 'أكاديمية المالية',
      col3: '40 ساعة تدريبية',
      col4: '1443 هـ / 2021 م',
    },
    {
      id: '2',
      col1: 'التحليل المالي المتقدم والنمذجة عبر MS Excel',
      col2: 'معهد الإدارة العامة',
      col3: '30 ساعة تدريبية',
      col4: '1441 هـ / 2020 م',
    },
    {
      id: '3',
      col1: 'مكافحة غسل الأموال والامتثال الرقابي',
      col2: 'معهد البنك المركزي السعودي',
      col3: '20 ساعة تدريبية',
      col4: '1444 هـ / 2022 م',
    },
  ]);

  // Skills & Software Table
  const [skillRows, setSkillRows] = useState<TableRowItem[]>([
    { id: '1', col1: 'برامج تخطيط الموارد ERP (SAP / Oracle / Odoo)', col2: 'مستوى متقدم وخبير', col3: '95%' },
    { id: '2', col1: 'إعداد القوائم المالية والتحليل المالي بالنسب', col2: 'مستوى متقدم', col3: '92%' },
    { id: '3', col1: 'إقرارات ضريبة القيمة المضافة والفاتورة الإلكترونية', col2: 'خبير ومعتمد', col3: '96%' },
    { id: '4', col1: 'إكسل المتقدم والمعادلات المالية (Financial Modeling)', col2: 'مستوى احترافي', col3: '90%' },
  ]);

  // Custom Tables
  const [customSections, setCustomSections] = useState<CustomTableSection[]>([]);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const paperRef = useRef<HTMLDivElement>(null);

  // Print Handlers
  const handlePrint = () => {
    document.body.classList.add('printing-cv');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-cv');
    }, 1200);
  };

  const handleDownloadPdf = async () => {
    const el = paperRef.current;
    if (!el) return;

    setIsExporting(true);
    setExportMessage('جاري تحويل سيرة الجدول التفاعلي بدقة A4...');

    try {
      const canvas = await htmlToImage.toCanvas(el, {
        pixelRatio: 2.2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        cacheBust: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);
      const imgBytes = Uint8Array.from(atob(imgData.split(',')[1]), (c) => c.charCodeAt(0));
      const embedded = await pdfDoc.embedJpg(imgBytes);

      const margin = 0;
      page.drawImage(embedded, {
        x: margin,
        y: margin,
        width: 595.28,
        height: 841.89,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const safeName = (fullName || 'السيرة_الذاتية_الجدولية').trim().replace(/[\/\\:*?"<>|]/g, '_');
      triggerFileDownload(blob, `${safeName}_Tabular_CV.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  // Row Helpers
  const addEduRow = () => {
    setEducationRows((prev) => [
      ...prev,
      { id: `${Date.now()}`, col1: 'مؤهل جديد', col2: 'الجهة / الجامعة', col3: 'السنة', col4: 'التقدير' },
    ]);
  };
  const removeEduRow = (id: string) => setEducationRows((prev) => prev.filter((r) => r.id !== id));
  const updateEduRow = (id: string, col: 'col1' | 'col2' | 'col3' | 'col4', val: string) => {
    setEducationRows((prev) => prev.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const addExpRow = () => {
    setExperienceRows((prev) => [
      ...prev,
      { id: `${Date.now()}`, col1: 'المسمى الوظيفي', col2: 'جهة العمل', col3: 'الفترة', col4: 'أبرز المهام والمسؤوليات' },
    ]);
  };
  const removeExpRow = (id: string) => setExperienceRows((prev) => prev.filter((r) => r.id !== id));
  const updateExpRow = (id: string, col: 'col1' | 'col2' | 'col3' | 'col4', val: string) => {
    setExperienceRows((prev) => prev.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const addCourseRow = () => {
    setCourseRows((prev) => [
      ...prev,
      { id: `${Date.now()}`, col1: 'اسم الدورة / البرنامج', col2: 'الجهة المنظمة', col3: 'المدة', col4: 'التاريخ' },
    ]);
  };
  const removeCourseRow = (id: string) => setCourseRows((prev) => prev.filter((r) => r.id !== id));
  const updateCourseRow = (id: string, col: 'col1' | 'col2' | 'col3' | 'col4', val: string) => {
    setCourseRows((prev) => prev.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const addSkillRow = () => {
    setSkillRows((prev) => [
      ...prev,
      { id: `${Date.now()}`, col1: 'مهارة أو تقنية جديدة', col2: 'متقدم', col3: '85%' },
    ]);
  };
  const removeSkillRow = (id: string) => setSkillRows((prev) => prev.filter((r) => r.id !== id));
  const updateSkillRow = (id: string, col: 'col1' | 'col2' | 'col3', val: string) => {
    setSkillRows((prev) => prev.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const addCustomSection = () => {
    setCustomSections((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        title: 'قسم جدولي إضافي',
        headers: ['البند / النشاط', 'الجهة / التفاصيل', 'التاريخ'],
        rows: [{ id: `${Date.now()}-1`, col1: 'بيان 1', col2: 'تفاصيل 1', col3: '2024' }],
      },
    ]);
  };
  const removeCustomSection = (id: string) => setCustomSections((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBackToSelector}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
          >
            <ChevronRight className="h-4 w-4" />
            <span>← اختيار قالب آخر (الـ 3 بطاقات)</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4" />
            <span>العودة للأدوات</span>
          </button>

          <div className="ms-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <FileSpreadsheet className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                تعديل سيرة الجدول التفاعلي (Interactive Tabular)
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                لوحة تحكم وجداول بيانات معتمدة للمسابقات والقطاع الحكومي والمالي
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
          >
            <Printer className="h-4 w-4" />
            <span>طباعة فورية</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isExporting ? exportMessage : 'تحميل بصيغة PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Form Inputs (Left) and A4 Live Preview (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Specialized Tabular Control Panel */}
        <div className="space-y-5 lg:col-span-5 no-print max-h-[85vh] overflow-y-auto pr-1">
          {/* Colors & Fonts Styling */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 pb-2 dark:border-slate-800">
              🎨 تخصيص مظهر وتنسيق الجداول
            </span>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  لون رؤوس الجداول:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={headerBgColor}
                    onChange={(e) => setHeaderBgColor(e.target.value)}
                    className="h-8 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-500">{headerBgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  لون خطوط الحدود:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tableBorderColor}
                    onChange={(e) => setTableBorderColor(e.target.value)}
                    className="h-8 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-500">{tableBorderColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  نوع الخط العربي:
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Tajawal">تجوال (Tajawal)</option>
                  <option value="Cairo">القاهرة (Cairo)</option>
                  <option value="Amiri">الأميري (Amiri)</option>
                  <option value="Lateef">لطيف (Lateef)</option>
                </select>
              </div>
            </div>

            {/* Quick Palette presets */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500">أنماط سريعة:</span>
              {[
                { name: 'كحلي رسمي', head: '#1e3a8a', border: '#cbd5e1' },
                { name: 'زمردي معتمد', head: '#065f46', border: '#a7f3d0' },
                { name: 'فحمي حكومي', head: '#1e293b', border: '#cbd5e1' },
                { name: 'عنابي تنفيذي', head: '#881337', border: '#fecdd3' },
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setHeaderBgColor(p.head);
                    setTableBorderColor(p.border);
                  }}
                  className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Personal Info Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-slate-800">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <span>جدول البيانات الشخصية والرسمية</span>
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  المسمى الوظيفي / الكادر:
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  رقم الهاتف:
                </label>
                <div className="flex gap-1" dir="ltr">
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-16 rounded-lg border border-slate-200 p-2 text-center text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  نوع الهوية ورقمها:
                </label>
                <div className="flex gap-1">
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-28 rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="الهوية الوطنية">الهوية الوطنية</option>
                    <option value="الإقامة">الإقامة</option>
                    <option value="جواز السفر">جواز السفر</option>
                  </select>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 p-2 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  الجنسية:
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  العنوان / المدينة:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  تاريخ الميلاد:
                </label>
                <div className="flex gap-1">
                  <select
                    value={dobCalendarType}
                    onChange={(e) => setDobCalendarType(e.target.value as any)}
                    className="w-14 rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="هـ">هـ</option>
                    <option value="م">م</option>
                  </select>
                  <input
                    type="text"
                    placeholder="يوم"
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="w-12 text-center rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="شهر"
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    className="w-12 text-center rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="سنة"
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    className="flex-1 text-center rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  الحالة الاجتماعية:
                </label>
                <input
                  type="text"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  رخصة القيادة:
                </label>
                <input
                  type="text"
                  value={drivingLicense}
                  onChange={(e) => setDrivingLicense(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Career Objective */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 pb-2 dark:border-slate-800">
              📌 الهدف الوظيفي / الملخص المهني
            </span>
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Section 3: Education Qualifications Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                <span>جدول المؤهلات العلمية ({educationRows.length})</span>
              </span>
              <button
                type="button"
                onClick={addEduRow}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة صف مؤهل</span>
              </button>
            </div>

            <div className="space-y-3">
              {educationRows.map((r, i) => (
                <div key={r.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">مؤهل #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEduRow(r.id)}
                      className="text-red-500 hover:text-red-700"
                      title="حذف هذا الصف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="الشهادة / التخصص"
                      value={r.col1}
                      onChange={(e) => updateEduRow(r.id, 'col1', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الجامعة / الكلية"
                      value={r.col2}
                      onChange={(e) => updateEduRow(r.id, 'col2', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="سنة التخرج (مثال: 1440 هـ / 2019 م)"
                      value={r.col3}
                      onChange={(e) => updateEduRow(r.id, 'col3', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="التقدير / المعدل (اختياري)"
                      value={r.col4 || ''}
                      onChange={(e) => updateEduRow(r.id, 'col4', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Work Experience Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                <span>جدول الخبرات العملية ({experienceRows.length})</span>
              </span>
              <button
                type="button"
                onClick={addExpRow}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة صف خبرة</span>
              </button>
            </div>

            <div className="space-y-3">
              {experienceRows.map((r, i) => (
                <div key={r.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">خبرة #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExpRow(r.id)}
                      className="text-red-500 hover:text-red-700"
                      title="حذف هذا الصف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="المسمى الوظيفي"
                      value={r.col1}
                      onChange={(e) => updateExpRow(r.id, 'col1', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="جهة العمل / الشركة"
                      value={r.col2}
                      onChange={(e) => updateExpRow(r.id, 'col2', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الفترة (من - إلى)"
                      value={r.col3}
                      onChange={(e) => updateExpRow(r.id, 'col3', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                    <textarea
                      rows={2}
                      placeholder="أبرز المهام والإنجازات..."
                      value={r.col4 || ''}
                      onChange={(e) => updateExpRow(r.id, 'col4', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Training Courses Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>جدول الدورات التدريبية ({courseRows.length})</span>
              </span>
              <button
                type="button"
                onClick={addCourseRow}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة دورة</span>
              </button>
            </div>

            <div className="space-y-3">
              {courseRows.map((r, i) => (
                <div key={r.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">دورة #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCourseRow(r.id)}
                      className="text-red-500 hover:text-red-700"
                      title="حذف هذا الصف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="اسم البرنامج التدريبي"
                      value={r.col1}
                      onChange={(e) => updateCourseRow(r.id, 'col1', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="الجهة المنظمة / المعهد"
                      value={r.col2}
                      onChange={(e) => updateCourseRow(r.id, 'col2', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="المدة والساعات"
                      value={r.col3}
                      onChange={(e) => updateCourseRow(r.id, 'col3', e.target.value)}
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Skills Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>جدول المهارات والقدرات ({skillRows.length})</span>
              </span>
              <button
                type="button"
                onClick={addSkillRow}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة مهارة</span>
              </button>
            </div>

            <div className="space-y-2">
              {skillRows.map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="المهارة"
                    value={r.col1}
                    onChange={(e) => updateSkillRow(r.id, 'col1', e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 p-1.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="المستوى"
                    value={r.col2}
                    onChange={(e) => updateSkillRow(r.id, 'col2', e.target.value)}
                    className="w-28 rounded-lg border border-slate-200 p-1.5 text-center dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="النسبة"
                    value={r.col3}
                    onChange={(e) => updateSkillRow(r.id, 'col3', e.target.value)}
                    className="w-16 rounded-lg border border-slate-200 p-1.5 text-center font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkillRow(r.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: A4 Live Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Zoom & View Controls */}
          <div className="no-print flex items-center justify-between w-full max-w-[210mm] mb-3 px-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              معاينة حية بمقاس A4 القياسي (Interactive Tabular Preview)
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
                className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                title="تصغير"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 font-bold text-slate-700 dark:text-slate-300">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                title="تكبير"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white font-bold text-slate-600 shadow-xs dark:bg-slate-700 dark:text-slate-200"
              >
                100%
              </button>
            </div>
          </div>

          {/* Printable A4 Paper Container */}
          <div className="w-full flex justify-center overflow-x-auto pb-8">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                ref={paperRef}
                id="tabular-cv-paper"
                className="cv-paper w-[210mm] min-h-[297mm] bg-white shadow-2xl p-8 text-slate-900 rounded-xs flex flex-col gap-4.5"
                style={{ fontFamily: fontFamily }}
              >
                {/* Official Tabular Header */}
                <div className="border-b-2 pb-3" style={{ borderColor: headerBgColor }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                        {fullName || 'الاسم الكامل'}
                      </h1>
                      <div className="text-xs font-bold mt-1 text-slate-600">
                        {jobTitle || 'المسمى الوظيفي'}
                      </div>
                    </div>
                    <div className="text-start text-xs font-semibold text-slate-500 border-s-2 ps-4" style={{ borderColor: tableBorderColor }}>
                      <div className="font-bold text-slate-800">السيرة الذاتية الرسمية</div>
                      <div className="text-[11px] text-slate-500">Curriculum Vitae (Tabular)</div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Personal Info Table */}
                <div className="cv-section">
                  <table
                    className="w-full border-collapse text-xs"
                    style={{ borderColor: tableBorderColor }}
                  >
                    <thead>
                      <tr>
                        <th
                          colSpan={4}
                          className="p-2 text-start font-bold text-white text-xs border"
                          style={{
                            backgroundColor: headerBgColor,
                            borderColor: tableBorderColor,
                          }}
                        >
                          المعلومات الشخصية والبيانات العامة
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="bg-slate-100 font-bold p-2 w-[18%] border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          البريد الإلكتروني:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {email}
                        </td>
                        <td
                          className="bg-slate-100 font-bold p-2 w-[18%] border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          رقم الهاتف:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          <span
                            className="inline-flex items-center gap-1 font-mono font-medium text-xs whitespace-nowrap"
                            style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                          >
                            <span>{countryCode}</span>
                            <span>{phoneNumber}</span>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="bg-slate-100 font-bold p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          الجنسية:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          <span>{nationality}</span>
                        </td>
                        <td
                          className="bg-slate-100 font-bold p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {idType}:
                        </td>
                        <td
                          className="p-2 border font-mono font-medium"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {idNumber}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="bg-slate-100 font-bold p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          العنوان / الإقامة:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {location}
                        </td>
                        <td
                          className="bg-slate-100 font-bold p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          تاريخ الميلاد:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {dobDay} / {dobMonth} / {dobYear} ({dobCalendarType})
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="bg-slate-100 font-bold p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          الحالة الاجتماعية:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {maritalStatus}
                        </td>
                        <td
                          className="bg-slate-100 font-bold p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          رخصة القيادة:
                        </td>
                        <td
                          className="p-2 border"
                          style={{ borderColor: tableBorderColor }}
                        >
                          {drivingLicense}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2: Career Objective */}
                {objective && (
                  <div className="cv-section">
                    <table
                      className="w-full border-collapse text-xs"
                      style={{ borderColor: tableBorderColor }}
                    >
                      <thead>
                        <tr>
                          <th
                            className="p-2 text-start font-bold text-white text-xs border"
                            style={{
                              backgroundColor: headerBgColor,
                              borderColor: tableBorderColor,
                            }}
                          >
                            الهدف الوظيفي / الملخص المهني
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            className="p-2.5 border leading-relaxed text-slate-700 bg-white"
                            style={{ borderColor: tableBorderColor }}
                          >
                            {objective}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section 3: Education Qualifications Table */}
                <div className="cv-section">
                  <table
                    className="w-full border-collapse text-xs"
                    style={{ borderColor: tableBorderColor }}
                  >
                    <thead>
                      <tr>
                        <th
                          colSpan={4}
                          className="p-2 text-start font-bold text-white text-xs border"
                          style={{
                            backgroundColor: headerBgColor,
                            borderColor: tableBorderColor,
                          }}
                        >
                          المؤهلات العلمية والشهادات
                        </th>
                      </tr>
                      <tr className="bg-slate-100 font-bold text-slate-800">
                        <td className="p-2 border w-[32%]" style={{ borderColor: tableBorderColor }}>
                          الشهادة / التخصص
                        </td>
                        <td className="p-2 border w-[36%]" style={{ borderColor: tableBorderColor }}>
                          الجامعة / الكلية
                        </td>
                        <td className="p-2 border w-[18%]" style={{ borderColor: tableBorderColor }}>
                          سنة التخرج
                        </td>
                        <td className="p-2 border w-[14%]" style={{ borderColor: tableBorderColor }}>
                          التقدير
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {educationRows.map((r) => (
                        <tr key={r.id}>
                          <td className="p-2 border font-semibold text-slate-900" style={{ borderColor: tableBorderColor }}>
                            {r.col1}
                          </td>
                          <td className="p-2 border text-slate-700" style={{ borderColor: tableBorderColor }}>
                            {r.col2}
                          </td>
                          <td className="p-2 border text-slate-600 font-mono text-[11px]" style={{ borderColor: tableBorderColor }}>
                            {r.col3}
                          </td>
                          <td className="p-2 border text-slate-700" style={{ borderColor: tableBorderColor }}>
                            {r.col4 || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section 4: Work Experience Table */}
                <div className="cv-section">
                  <table
                    className="w-full border-collapse text-xs"
                    style={{ borderColor: tableBorderColor }}
                  >
                    <thead>
                      <tr>
                        <th
                          colSpan={3}
                          className="p-2 text-start font-bold text-white text-xs border"
                          style={{
                            backgroundColor: headerBgColor,
                            borderColor: tableBorderColor,
                          }}
                        >
                          الخبرات العملية والوظيفية
                        </th>
                      </tr>
                      <tr className="bg-slate-100 font-bold text-slate-800">
                        <td className="p-2 border w-[30%]" style={{ borderColor: tableBorderColor }}>
                          المسمى الوظيفي
                        </td>
                        <td className="p-2 border w-[35%]" style={{ borderColor: tableBorderColor }}>
                          جهة العمل / الفترة
                        </td>
                        <td className="p-2 border w-[35%]" style={{ borderColor: tableBorderColor }}>
                          أبرز المهام والمسؤوليات
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {experienceRows.map((r) => (
                        <tr key={r.id}>
                          <td className="p-2 border font-bold text-slate-900 align-top" style={{ borderColor: tableBorderColor }}>
                            {r.col1}
                          </td>
                          <td className="p-2 border text-slate-700 align-top" style={{ borderColor: tableBorderColor }}>
                            <div className="font-semibold">{r.col2}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{r.col3}</div>
                          </td>
                          <td className="p-2 border text-slate-700 leading-relaxed align-top" style={{ borderColor: tableBorderColor }}>
                            {r.col4 || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section 5: Training Courses Table */}
                {courseRows.length > 0 && (
                  <div className="cv-section">
                    <table
                      className="w-full border-collapse text-xs"
                      style={{ borderColor: tableBorderColor }}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={3}
                            className="p-2 text-start font-bold text-white text-xs border"
                            style={{
                              backgroundColor: headerBgColor,
                              borderColor: tableBorderColor,
                            }}
                          >
                            الدورات التدريبية والشهادات المهنية
                          </th>
                        </tr>
                        <tr className="bg-slate-100 font-bold text-slate-800">
                          <td className="p-2 border w-[45%]" style={{ borderColor: tableBorderColor }}>
                            اسم البرنامج / الدورة
                          </td>
                          <td className="p-2 border w-[35%]" style={{ borderColor: tableBorderColor }}>
                            الجهة المنظمة
                          </td>
                          <td className="p-2 border w-[20%]" style={{ borderColor: tableBorderColor }}>
                            المدة / التاريخ
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {courseRows.map((r) => (
                          <tr key={r.id}>
                            <td className="p-2 border font-medium text-slate-900" style={{ borderColor: tableBorderColor }}>
                              {r.col1}
                            </td>
                            <td className="p-2 border text-slate-700" style={{ borderColor: tableBorderColor }}>
                              {r.col2}
                            </td>
                            <td className="p-2 border text-slate-600 font-mono text-[11px]" style={{ borderColor: tableBorderColor }}>
                              {r.col3}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section 6: Skills Table */}
                {skillRows.length > 0 && (
                  <div className="cv-section">
                    <table
                      className="w-full border-collapse text-xs"
                      style={{ borderColor: tableBorderColor }}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={2}
                            className="p-2 text-start font-bold text-white text-xs border"
                            style={{
                              backgroundColor: headerBgColor,
                              borderColor: tableBorderColor,
                            }}
                          >
                            المهارات الفنية والقدرات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {skillRows.map((r) => (
                          <tr key={r.id}>
                            <td className="bg-slate-100 font-bold p-2 w-[35%] border" style={{ borderColor: tableBorderColor }}>
                              {r.col1}
                            </td>
                            <td className="p-2 border" style={{ borderColor: tableBorderColor }}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">{r.col2}</span>
                                {r.col3 && (
                                  <div className="flex items-center gap-1 ms-auto">
                                    <div className="h-1.5 w-24 rounded bg-slate-200 overflow-hidden">
                                      <div
                                        className="h-full rounded"
                                        style={{
                                          width: r.col3,
                                          backgroundColor: headerBgColor,
                                        }}
                                      />
                                    </div>
                                    <span className="font-mono text-[10px] text-slate-500">{r.col3}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
