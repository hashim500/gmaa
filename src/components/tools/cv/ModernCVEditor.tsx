import React, { useState, useRef } from 'react';
import {
  Printer,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Download,
  Languages as LanguagesIcon,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import { triggerFileDownload } from '../../../utils/pdfUtils';
import { TranslationDict } from '../../../i18n/translations';

interface ModernCVEditorProps {
  t: TranslationDict;
  onBackToSelector: () => void;
  onBackToHome: () => void;
}

interface SkillItem {
  id: string;
  name: string;
  percent: number;
}

interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export const ModernCVEditor: React.FC<ModernCVEditorProps> = ({
  t,
  onBackToSelector,
  onBackToHome,
}) => {
  // Appearance
  const [primaryColor, setPrimaryColor] = useState('#1e293b');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [fontFamily, setFontFamily] = useState('Tajawal');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Profile Information
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState('عبدالعزيز الشمري');
  const [jobTitle, setJobTitle] = useState('كبير مصممي واجهات ومطور برمجيات');
  const [email, setEmail] = useState('a.alshammari@example.com');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [location, setLocation] = useState('الرياض، المملكة العربية السعودية');
  const [nationality, setNationality] = useState('سعودي');
  const [summary, setSummary] = useState(
    'مطور واجهات ومصمم تجربة مستخدم بخبرة تتجاوز 6 سنوات في بناء وتصميم التطبيقات والمواقع التفاعلية عالية الأداء. شغوف بتحويل المتطلبات المعقدة إلى واجهات رقمية سلسة، جذابة وسريعة التفاعل.'
  );

  // Sidebar Skills with Percentages
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: '1', name: 'تصميم واجهات المستخدم UI/UX', percent: 95 },
    { id: '2', name: 'React & TypeScript', percent: 90 },
    { id: '3', name: 'Next.js & Tailwind CSS', percent: 88 },
    { id: '4', name: 'Figma & Design Systems', percent: 85 },
    { id: '5', name: 'إدارة وتخطيط المشاريع الرقمية', percent: 78 },
  ]);

  // Sidebar Languages
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: '1', name: 'العربية', level: 'اللغة الأم' },
    { id: '2', name: 'الإنجليزية', level: 'متقدم وطلاقة مهنية (C1)' },
  ]);

  // Work Experiences
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: '1',
      title: 'كبير مصممي الواجهات ومطور ويب',
      company: 'شركة أبعاد التقنية المتقدمة',
      period: '2022 - حتى الآن',
      description:
        '• قيادة فريق تصميم الواجهات وتطوير منظومة الخدمات الرقمية للعملاء.\n• رفع معدلات إكمال الطلبات بنسبة 28% عبر تبسيط مسار المستخدم.\n• بناء مكتبة مكونات تفاعلية قابلة لإعادة الاستخدام في عدة منصات.',
    },
    {
      id: '2',
      title: 'مطور واجهات وتطبيقات تفاعلية',
      company: 'استوديو الإبداع الرقمي',
      period: '2019 - 2022',
      description:
        '• تطوير واجهات مواقع وتطبيقات تفاعلية متجاوبة مع مختلف الشاشات والأجهزة.\n• التنسيق مع فريق الواجهات الخلفية وقواعد البيانات لضمان تكامل وسرعة الاستجابة.',
    },
  ]);

  // Education
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: '1',
      degree: 'بكالوريوس علوم الحاسب والمعلومات',
      institution: 'جامعة الملك سعود - كلية علوم الحاسب',
      year: '2015 - 2019',
      details: 'مرتبة الشرف الثانية، مشروع التخرج: منصة تجربة مستخدم ذكية للخدمات اللوجستية.',
    },
    {
      id: '2',
      degree: 'شهادة الاعتماد المهني في تصميم تجربة المستخدم Google UX',
      institution: 'Google Career Certificates & Coursera',
      year: '2021',
      details: 'برنامج احترافي متقدم يغطي أبحاث المستخدم وتصميم النماذج الأولية المتقدمة.',
    },
  ]);

  // Certifications / Key Achievements
  const [certifications, setCertifications] = useState<string[]>([
    'شهادة PMP في إدارة المشاريع الاحترافية (2023)',
    'شهادة التميز في تصميم تجربة المستخدم من وزارة الاتصالات (2022)',
  ]);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const paperRef = useRef<HTMLDivElement>(null);

  // Avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Add / Remove Handlers
  const addSkill = () => {
    setSkills((prev) => [...prev, { id: `${Date.now()}`, name: 'مهارة جديدة', percent: 80 }]);
  };
  const removeSkill = (id: string) => setSkills((prev) => prev.filter((s) => s.id !== id));
  const updateSkill = (id: string, field: keyof SkillItem, val: any) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const addLanguage = () => {
    setLanguages((prev) => [...prev, { id: `${Date.now()}`, name: 'لغة جديدة', level: 'متوسط' }]);
  };
  const removeLanguage = (id: string) => setLanguages((prev) => prev.filter((l) => l.id !== id));

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        title: 'المسمى الوظيفي',
        company: 'اسم الشركة / الجهة',
        period: '2023 - الآن',
        description: '• اذكر مهامك وإنجازاتك الرئيسية هنا...',
      },
    ]);
  };
  const removeExperience = (id: string) => setExperiences((prev) => prev.filter((e) => e.id !== id));
  const updateExperience = (id: string, field: keyof ExperienceItem, val: string) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
  };

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        degree: 'المؤهل العلمي',
        institution: 'الجامعة أو المعهد',
        year: '2020',
        details: 'تفاصيل إضافية أو التقدير...',
      },
    ]);
  };
  const removeEducation = (id: string) => setEducations((prev) => prev.filter((ed) => ed.id !== id));
  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setEducations((prev) => prev.map((ed) => (ed.id === id ? { ...ed, [field]: val } : ed)));
  };

  const addCertification = () => {
    setCertifications((prev) => [...prev, 'شهادة أو إنجاز جديد']);
  };
  const removeCertification = (idx: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateCertification = (idx: number, val: string) => {
    setCertifications((prev) => prev.map((c, i) => (i === idx ? val : c)));
  };

  // Direct In-Page Print via @media print
  const handlePrint = () => {
    document.body.classList.add('printing-cv');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-cv');
    }, 1200);
  };

  // Direct High-Resolution PDF Download
  const handleDownloadPdf = async () => {
    const el = paperRef.current;
    if (!el) return;

    setIsExporting(true);
    setExportMessage('جاري تحويل السيرة الذاتية بدقة A4...');

    try {
      const canvas = await htmlToImage.toCanvas(el, {
        pixelRatio: 2.2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        cacheBust: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfDoc = await PDFDocument.create();
      // Standard A4: 595.28 x 841.89 points
      const page = pdfDoc.addPage([595.28, 841.89]);
      const imgBytes = Uint8Array.from(atob(imgData.split(',')[1]), (c) => c.charCodeAt(0));
      const embedded = await pdfDoc.embedJpg(imgBytes);

      page.drawImage(embedded, {
        x: 0,
        y: 0,
        width: 595.28,
        height: 841.89,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const safeName = fullName.trim().replace(/\s+/g, '_') || 'سيرة_ذاتية';
      triggerFileDownload(blob, `سيرة_ذاتية_عصرية_${safeName}.pdf`);
    } catch (err: any) {
      console.error(err);
      handlePrint();
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBackToSelector}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Layers className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                تعديل السيرة الذاتية العصرية (Two-Column Modern)
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                لوحة تحكم وحقول مخصصة للقالب العصري
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isExporting ? exportMessage : 'تحميل بصيغة PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Form Inputs (Left) and A4 Live Preview (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Specific Modern Control Panel */}
        <div className="space-y-5 lg:col-span-5 no-print">
          {/* Colors & Fonts Styling */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 pb-2 dark:border-slate-800">
              🎨 ألوان القالب ونوع الخط
            </span>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  لون الشريط الجانبي:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8 w-full cursor-pointer rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  لون التمييز والنسب:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-8 w-full cursor-pointer rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  نوع الخط:
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Tajawal">تجوال (Tajawal)</option>
                  <option value="Cairo">القاهرة (Cairo)</option>
                  <option value="Amiri">أميري (Amiri)</option>
                  <option value="Arial">Arial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Profile & Photo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 pb-2 dark:border-slate-800">
              👤 المعلومات الشخصية والصورة
            </span>

            <div className="flex items-center gap-3">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-indigo-400 bg-slate-50 dark:bg-slate-800">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <Upload className="h-3.5 w-3.5" />
                  <span>رفع صورة شخصية</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(null)}
                    className="text-[10px] text-rose-500 hover:underline text-start"
                  >
                    حذف الصورة
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">المسمى الوظيفي:</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">رقم الهاتف:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">المدينة والدولة:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">الجنسية:</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">النبذة الشخصية (الهدف المهني):</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Sidebar Skills with % Sliders */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                ⚡ مهارات الشريط الجانبي (مع نسب الإتقان)
              </span>
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة مهارة</span>
              </button>
            </div>

            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl dark:bg-slate-800/60">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <div className="flex items-center gap-1 w-28">
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={skill.percent}
                      onChange={(e) => updateSkill(skill.id, 'percent', parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600"
                    />
                    <span className="text-[10px] font-mono text-slate-500 w-7 text-center">
                      {skill.percent}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Languages */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🌐 اللغات ومستوى الإتقان
              </span>
              <button
                type="button"
                onClick={addLanguage}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة لغة</span>
              </button>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl dark:bg-slate-800/60">
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) =>
                      setLanguages((prev) =>
                        prev.map((l) => (l.id === lang.id ? { ...l, name: e.target.value } : l))
                      )
                    }
                    placeholder="اللغة"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    value={lang.level}
                    onChange={(e) =>
                      setLanguages((prev) =>
                        prev.map((l) => (l.id === lang.id ? { ...l, level: e.target.value } : l))
                      )
                    }
                    placeholder="المستوى (مثال: طلاقة)"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experiences */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                💼 الخبرات المهنية والوظائف
              </span>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة خبرة</span>
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="rounded-xl border border-slate-200 p-3 space-y-2 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="المسمى الوظيفي"
                      className="font-bold text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-500 ms-2 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="الشركة / المؤسسة"
                      className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      placeholder="الفترة (مثال: 2021 - الآن)"
                      className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="المهام والإنجازات..."
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🎓 التعليم والمؤهلات الأكاديمية
              </span>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة مؤهل</span>
              </button>
            </div>

            <div className="space-y-3">
              {educations.map((ed) => (
                <div key={ed.id} className="rounded-xl border border-slate-200 p-3 space-y-2 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={ed.degree}
                      onChange={(e) => updateEducation(ed.id, 'degree', e.target.value)}
                      placeholder="الدرجة العلمية"
                      className="font-bold text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeEducation(ed.id)}
                      className="text-slate-400 hover:text-rose-500 ms-2 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={ed.institution}
                      onChange={(e) => updateEducation(ed.id, 'institution', e.target.value)}
                      placeholder="الجامعة / الكلية"
                      className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      value={ed.year}
                      onChange={(e) => updateEducation(ed.id, 'year', e.target.value)}
                      placeholder="سنة التخرج"
                      className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <input
                    type="text"
                    value={ed.details}
                    onChange={(e) => updateEducation(ed.id, 'details', e.target.value)}
                    placeholder="التفاصيل / التقدير"
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🏆 الشهادات والاعتمادات
              </span>
              <button
                type="button"
                onClick={addCertification}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Plus className="h-3 w-3" />
                <span>إضافة اعتماد</span>
              </button>
            </div>

            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => updateCertification(i, e.target.value)}
                    className="flex-1 text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeCertification(i)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: A4 Live Preview specifically for Two-Column Modern */}
        <div className="space-y-3 lg:col-span-7 flex flex-col items-center">
          {/* Preview Controls Bar */}
          <div className="no-print flex w-full items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>معاينة حية للقالب العصري (A4)</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="rounded-lg border border-slate-200 bg-white p-1 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                title="تصغير"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[11px]">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="rounded-lg border border-slate-200 bg-white p-1 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                title="تكبير"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Paper Container */}
          <div
            className="cv-preview-container w-full overflow-x-auto pb-8 flex justify-center bg-slate-100/70 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
            style={{
              transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            {/* The Actual A4 Paper Document for Two-Column Modern */}
            <div
              ref={paperRef}
              className="cv-paper w-[210mm] min-h-[297mm] bg-white shadow-2xl flex text-slate-900 rounded-sm overflow-hidden select-none"
              style={{ fontFamily: fontFamily }}
            >
              {/* Colored Sidebar (34%) */}
              <div
                className="cv-sidebar w-[34%] text-white p-7 flex flex-col gap-6 shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {/* Photo / Avatar */}
                <div className="flex justify-center">
                  <div
                    className="h-28 w-28 rounded-full border-3 overflow-hidden shadow-lg flex items-center justify-center bg-white/10"
                    style={{ borderColor: accentColor }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold tracking-wider text-white/90">CV</span>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-xs">
                  <div className="border-b border-white/20 pb-1 text-xs font-bold uppercase tracking-wider text-white/80">
                    معلومات التواصل
                  </div>

                  {phone && (
                    <div>
                      <span className="block text-[10px] text-white/60 mb-0.5">الهاتف:</span>
                      <div className="font-semibold text-xs text-white/95" dir="ltr" style={{ textAlign: 'right' }}>
                        {phone}
                      </div>
                    </div>
                  )}

                  {email && (
                    <div>
                      <span className="block text-[10px] text-white/60 mb-0.5">البريد الإلكتروني:</span>
                      <div className="font-semibold text-xs text-white/95 break-all" dir="ltr" style={{ textAlign: 'right' }}>
                        {email}
                      </div>
                    </div>
                  )}

                  {location && (
                    <div>
                      <span className="block text-[10px] text-white/60 mb-0.5">العنوان:</span>
                      <div className="font-semibold text-xs text-white/95">{location}</div>
                    </div>
                  )}

                  {nationality && (
                    <div>
                      <span className="block text-[10px] text-white/60 mb-0.5">الجنسية:</span>
                      <div className="font-semibold text-xs text-white/95">{nationality}</div>
                    </div>
                  )}
                </div>

                {/* Skills with Progress Bars */}
                {skills.length > 0 && (
                  <div className="space-y-3">
                    <div className="border-b border-white/20 pb-1 text-xs font-bold uppercase tracking-wider text-white/80">
                      المهارات المهنية
                    </div>
                    <div className="space-y-2 text-xs">
                      {skills.map((skill) => (
                        <div key={skill.id} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-white/95">
                            <span>{skill.name}</span>
                            <span className="font-mono text-[10px] text-white/70">{skill.percent}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${skill.percent}%`, backgroundColor: accentColor }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {languages.length > 0 && (
                  <div className="space-y-2">
                    <div className="border-b border-white/20 pb-1 text-xs font-bold uppercase tracking-wider text-white/80">
                      اللغات
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {languages.map((lang) => (
                        <div key={lang.id} className="flex justify-between items-baseline text-[11px]">
                          <span className="font-bold text-white/95">{lang.name}</span>
                          <span className="text-[10px] text-white/70">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Column (66%) */}
              <div className="w-[66%] p-8 flex flex-col gap-6">
                {/* Header Name & Title */}
                <div className="border-b-2 pb-4" style={{ borderColor: accentColor }}>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{fullName}</h1>
                  <p className="mt-1 text-sm font-bold" style={{ color: accentColor }}>
                    {jobTitle}
                  </p>
                </div>

                {/* Professional Summary */}
                {summary && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      <User className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      <span>الملف التعريفي</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>
                )}

                {/* Work Experiences */}
                {experiences.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      <Briefcase className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      <span>الخبرات المهنية</span>
                    </div>

                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="space-y-1 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900">{exp.title}</span>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {exp.period}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold" style={{ color: accentColor }}>
                            {exp.company}
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap pt-0.5">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {educations.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      <GraduationCap className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      <span>المؤهلات العلمية</span>
                    </div>

                    <div className="space-y-3">
                      {educations.map((ed) => (
                        <div key={ed.id} className="space-y-0.5 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900">{ed.degree}</span>
                            <span className="text-[11px] text-slate-500">{ed.year}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-semibold">{ed.institution}</div>
                          {ed.details && <p className="text-[10px] text-slate-500">{ed.details}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications & Achievements */}
                {certifications.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      <Award className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      <span>الشهادات والاعتمادات</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {certifications.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-slate-400 mt-1">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
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
