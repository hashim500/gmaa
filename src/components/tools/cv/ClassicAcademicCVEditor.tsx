import React, { useState, useRef } from 'react';
import {
  Printer,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  ExternalLink,
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
  FileText,
  UserCheck,
  Globe,
  Sparkles,
  Link2,
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import { triggerFileDownload } from '../../../utils/pdfUtils';
import { TranslationDict } from '../../../i18n/translations';

interface ClassicAcademicCVEditorProps {
  t: TranslationDict;
  onBackToSelector: () => void;
  onBackToHome: () => void;
}

export interface DegreeItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
  thesisTitle?: string;
  supervisor?: string;
  honors?: string;
}

export interface AppointmentItem {
  id: string;
  title: string;
  department: string;
  institution: string;
  period: string;
  details?: string;
}

export interface PublicationItem {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: string;
  volumeIssue?: string;
  doi?: string;
}

export interface TeachingItem {
  id: string;
  courseName: string;
  courseCode: string;
  level: string; // بكالوريوس / ماجستير / دكتوراه
  institution: string;
}

export interface GrantItem {
  id: string;
  title: string;
  funder: string;
  role: string; // الباحث الرئيسي PI / باحث مشارك
  amountYear: string;
}

export interface RefereeItem {
  id: string;
  name: string;
  title: string;
  institution: string;
  email: string;
  phone: string;
}

export const ClassicAcademicCVEditor: React.FC<ClassicAcademicCVEditorProps> = ({
  t,
  onBackToSelector,
  onBackToHome,
}) => {
  // Appearance
  const [accentColor, setAccentColor] = useState('#1e293b'); // Academic Slate / Charcoal
  const [fontFamily, setFontFamily] = useState('Amiri'); // Classic Arabic Serif
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Academic Profile
  const [academicTitle, setAcademicTitle] = useState('أ.د.');
  const [fullName, setFullName] = useState('عبدالرحمن بن خالد السليمان');
  const [academicRank, setAcademicRank] = useState('أستاذ دكتور في علوم وهندسة الحاسب');
  const [department, setDepartment] = useState('قسم علوم الحاسب والمعلومات، كلية علوم الحاسب');
  const [institution, setInstitution] = useState('جامعة الملك سعود - الرياض');
  const [email, setEmail] = useState('a.alsulaiman@ksu.edu.sa');
  const [phone, setPhone] = useState('+966 11 467 0000');
  const [officeLocation, setOfficeLocation] = useState('مبنى 31، مكتب 2A-14، الدرعية، الرياض');
  
  // Academic Identifiers
  const [orcid, setOrcid] = useState('0000-0002-1825-0097');
  const [googleScholar, setGoogleScholar] = useState('scholar.google.com/citations?user=sample');
  const [researchGate, setResearchGate] = useState('researchgate.net/profile/A-Alsulaiman');

  // Academic Biography / Research Statement
  const [researchStatement, setResearchStatement] = useState(
    'أستاذ دكتور وباحث في مجال الذكاء الاصطناعي ومعالجة اللغات الطبيعية (NLP) للغة العربية والتعلم العميق. تشمل اهتماماتي البحثية تطوير النماذج اللغوية الضخمة، استرجاع المعلومات الدلالية، والأنظمة الموزعة عالية الأداء. نشرت أكثر من 45 بحثاً علمياً محكّماً في مجلات مصنفة ضمن Web of Science و Scopus، وأشرفت على العديد من رسائل الماجستير والدكتوراه.'
  );

  // Degrees
  const [degrees, setDegrees] = useState<DegreeItem[]>([
    {
      id: '1',
      degree: 'دكتوراه الفلسفة (Ph.D.)',
      field: 'علوم وهندسة الحاسب',
      institution: 'جامعة تورونتو - كندا (University of Toronto)',
      year: '2014',
      thesisTitle: 'نماذج التعلم العميق المتقدمة لمعالجة النصوص العربية غير المشكولة',
      supervisor: 'أ.د. مايكل براون',
      honors: 'جائزة أفضل أطروحة دكتوراه في هندسة الحاسب للعام 2014',
    },
    {
      id: '2',
      degree: 'ماجستير العلوم (M.Sc.)',
      field: 'علوم الحاسب',
      institution: 'جامعة الملك فهد للبترول والمعادن (KFUPM)',
      year: '2010',
      thesisTitle: 'خوارزميات تصنيف الوثائق العربية باستخدام الشبكات العصبية',
      honors: 'مرتبة الشرف الأولى',
    },
    {
      id: '3',
      degree: 'بكالوريوس العلوم (B.Sc.)',
      field: 'علوم الحاسب والمعلومات',
      institution: 'جامعة الملك سعود',
      year: '2007',
      honors: 'ممتاز مع مرتبة الشرف الأولى وجائزة التفوق العلمي',
    },
  ]);

  // Academic & Administrative Appointments
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: '1',
      title: 'أستاذ دكتور (Professor)',
      department: 'قسم علوم الحاسب',
      institution: 'جامعة الملك سعود',
      period: '2022 - الآن',
    },
    {
      id: '2',
      title: 'وكيل الكلية للتطوير والجودة ورئيس اللجنة العلمية',
      department: 'كلية علوم الحاسب والمعلومات',
      institution: 'جامعة الملك سعود',
      period: '2019 - 2022',
    },
    {
      id: '3',
      title: 'أستاذ مشارك (Associate Professor)',
      department: 'قسم علوم الحاسب',
      institution: 'جامعة الملك سعود',
      period: '2018 - 2022',
    },
    {
      id: '4',
      title: 'أستاذ مساعد (Assistant Professor)',
      department: 'قسم علوم الحاسب',
      institution: 'جامعة الملك سعود',
      period: '2014 - 2018',
    },
  ]);

  // Peer-Reviewed Publications
  const [publications, setPublications] = useState<PublicationItem[]>([
    {
      id: '1',
      authors: 'السليمان، عبدالرحمن، والغامدي، فهد، وموريس، روبرت',
      title: 'بناء النماذج التوليدية الدلالية للنصوص الطبية العربية: دراسة تقييمية للأداء والامتثال',
      journal: 'IEEE Transactions on Knowledge and Data Engineering (TKDE)',
      year: '2023',
      volumeIssue: 'Vol. 35, Issue 8, pp. 7820-7835',
      doi: '10.1109/TKDE.2023.3289110',
    },
    {
      id: '2',
      authors: 'Alsulaiman, A. K., & Al-Zahrani, S.',
      title: 'Cross-Lingual Information Retrieval for Specialized Domain Corpora Using Deep Attention Networks',
      journal: 'ACM Transactions on Information Systems (TOIS)',
      year: '2021',
      volumeIssue: 'Vol. 39, No. 3, Article 31',
      doi: '10.1145/3451120',
    },
    {
      id: '3',
      authors: 'السليمان، عبدالرحمن، والشهراني، محمد',
      title: 'تطبيق خوارزميات التعلم المعزز في تحسين كفاءة استرجاع الأسئلة والأجوبة العربية',
      journal: 'مجلة جامعة الملك سعود - علوم الحاسب والمعلومات',
      year: '2020',
      volumeIssue: 'المجلد 32، العدد 2، ص 180-194',
      doi: '10.1016/j.jksuci.2019.04.005',
    },
  ]);

  // Teaching Experience
  const [teachings, setTeachings] = useState<TeachingItem[]>([
    {
      id: '1',
      courseName: 'معالجة اللغات الطبيعية المتقدمة (Advanced NLP)',
      courseCode: 'عال 635 (CSC 635)',
      level: 'دكتوراه وماجستير',
      institution: 'جامعة الملك سعود',
    },
    {
      id: '2',
      courseName: 'مقدمة في الذكاء الاصطناعي وتعلم الآلة',
      courseCode: 'عال 480 (CSC 480)',
      level: 'بكالوريوس (السنة الرابعة)',
      institution: 'جامعة الملك سعود',
    },
  ]);

  // Research Grants
  const [grants, setGrants] = useState<GrantItem[]>([
    {
      id: '1',
      title: 'النمذجة اللغوية التوليدية المتقدمة للوثائق الحكومية والقانونية بالمملكة',
      funder: 'مدينة الملك عبدالعزيز للعلوم والتقنية (KACST) - برنامج البحوث الوطنية',
      role: 'الباحث الرئيسي (Principal Investigator)',
      amountYear: '1,200,000 ريال (2022 - 2024)',
    },
    {
      id: '2',
      title: 'تطوير أدوات التعرف الصوتي الآلي للهجات العربية المعاصرة',
      funder: 'هيئة تنمية البحث والتطوير والابتكار (RDIA)',
      role: 'باحث مشارك (Co-PI)',
      amountYear: '750,000 ريال (2020 - 2022)',
    },
  ]);

  // Referees
  const [referees, setReferees] = useState<RefereeItem[]>([
    {
      id: '1',
      name: 'أ.د. عبدالله بن عبدالعزيز الناصر',
      title: 'عميد كلية علوم الحاسب والمعلومات سابقاً وأستاذ الذكاء الاصطناعي',
      institution: 'جامعة الملك سعود',
      email: 'alnasser@ksu.edu.sa',
      phone: '+966 11 467 1111',
    },
    {
      id: '2',
      name: 'Prof. Michael Brown',
      title: 'Professor & Chair of Computer Science',
      institution: 'Department of Computer Science, University of Toronto',
      email: 'mbrown@cs.toronto.edu',
      phone: '+1 416 978 0000',
    },
  ]);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const paperRef = useRef<HTMLDivElement>(null);

  // Print & PDF
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
    setExportMessage('جاري تحويل السيرة الأكاديمية بدقة A4...');

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
      const safeName = (fullName || 'السيرة_الذاتية_الأكاديمية').trim().replace(/[\/\\:*?"<>|]/g, '_');
      triggerFileDownload(blob, `${safeName}_Academic_CV.pdf`);
    } catch (err) {
      console.error('Academic PDF export error:', err);
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
            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 transition"
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
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
              <Award className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                تعديل السيرة الذاتية الكلاسيكية الأكاديمية (Classic Academic)
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                لوحة تحكم رصينة مخصصة للأساتذة، الباحثين، الأطباء، والمستشارين
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
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-700 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isExporting ? exportMessage : 'تحميل بصيغة PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Form Inputs (Left) and A4 Live Preview (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Academic Control Panel */}
        <div className="space-y-5 lg:col-span-5 no-print max-h-[85vh] overflow-y-auto pr-1">
          {/* Styling & Typography */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 pb-2 dark:border-slate-800">
              🎨 تخصيص الطابع الكلاسيكي والخطوط
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  لون العناوين والخطوط الفاصلة:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-8 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-500">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  نوع الخط العربي الأكاديمي:
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Amiri">الأميري (Amiri - خط عربي كلاسيكي)</option>
                  <option value="Tajawal">تجوال (Tajawal - حديث ورصين)</option>
                  <option value="Cairo">القاهرة (Cairo - هندسي وواضح)</option>
                  <option value="Lateef">لطيف (Lateef)</option>
                </select>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500">طرز كلاسيكية:</span>
              {[
                { name: 'فحمي أكاديمي', col: '#1e293b' },
                { name: 'عنابي جامعي', col: '#881337' },
                { name: 'كحلي ملكي', col: '#1e3a8a' },
                { name: 'أخضر بريطاني', col: '#14532d' },
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAccentColor(p.col)}
                  className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Academic Identity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-slate-800">
              <GraduationCap className="h-4 w-4 text-amber-600" />
              <span>الهوية الأكاديمية والارتباط المؤسسي</span>
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  اللقب العلمي:
                </label>
                <select
                  value={academicTitle}
                  onChange={(e) => setAcademicTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="أ.د.">أ.د. (بروفيسور)</option>
                  <option value="د.">د. (دكتور)</option>
                  <option value="أستاذ مشارك">أستاذ مشارك</option>
                  <option value="أستاذ مساعد">أستاذ مساعد</option>
                  <option value="استشاري">استشاري</option>
                  <option value="الباحث">الباحث</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
                />
              </div>

              <div className="col-span-3">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  الرتبة والتخصص الدقيق:
                </label>
                <input
                  type="text"
                  value={academicRank}
                  onChange={(e) => setAcademicRank(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-3">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  القسم والكلية:
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-3">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  الجامعة أو المؤسسة البحثية:
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  البريد الجامعي:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  هاتف المكتب / التحويلة:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  المكتب / الحرم الجامعي:
                </label>
                <input
                  type="text"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Academic Identifiers (ORCID / Google Scholar) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-500 block">
                المعرفات البحثية (ORCID / Scholar):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">ORCID:</span>
                  <input
                    type="text"
                    value={orcid}
                    onChange={(e) => setOrcid(e.target.value)}
                    placeholder="0000-0000-0000-0000"
                    className="flex-1 rounded-lg border border-slate-200 p-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-blue-600 font-bold">Scholar:</span>
                  <input
                    type="text"
                    value={googleScholar}
                    onChange={(e) => setGoogleScholar(e.target.value)}
                    placeholder="google scholar link..."
                    className="flex-1 rounded-lg border border-slate-200 p-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Research Statement */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-100 pb-2 dark:border-slate-800">
              🔬 الاهتمامات البحثية والبيان الأكاديمي
            </span>
            <textarea
              rows={4}
              value={researchStatement}
              onChange={(e) => setResearchStatement(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Section 3: Degrees & Dissertations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-amber-600" />
                <span>الدرجات العلمية والشهادات العليا ({degrees.length})</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setDegrees((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      degree: 'درجة علمية جديدة',
                      field: 'التخصص',
                      institution: 'الجامعة',
                      year: '2023',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة درجة</span>
              </button>
            </div>

            <div className="space-y-3">
              {degrees.map((d, i) => (
                <div key={d.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">درجة #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setDegrees((prev) => prev.filter((item) => item.id !== d.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="الدرجة (دكتوراه / ماجستير / بكالوريوس)"
                      value={d.degree}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((item) => (item.id === d.id ? { ...item, degree: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="التخصص الدقيق"
                      value={d.field}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((item) => (item.id === d.id ? { ...item, field: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الجامعة والدولة"
                      value={d.institution}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((item) => (item.id === d.id ? { ...item, institution: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="سنة المنح"
                      value={d.year}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((item) => (item.id === d.id ? { ...item, year: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="عنوان الأطروحة أو الرسالة (اختياري)"
                      value={d.thesisTitle || ''}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((item) => (item.id === d.id ? { ...item, thesisTitle: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="المشرف الأكاديمي أو التقدير (اختياري)"
                      value={d.supervisor || ''}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((item) => (item.id === d.id ? { ...item, supervisor: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Academic Appointments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-amber-600" />
                <span>المناصب والرتب الأكاديمية ({appointments.length})</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setAppointments((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      title: 'الرتبة / المنصب',
                      department: 'القسم',
                      institution: 'الجامعة',
                      period: '2023 - الآن',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة منصب</span>
              </button>
            </div>

            <div className="space-y-3">
              {appointments.map((a, i) => (
                <div key={a.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">منصب #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setAppointments((prev) => prev.filter((item) => item.id !== a.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="الرتبة الأكاديمية / المنصب"
                      value={a.title}
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((item) => (item.id === a.id ? { ...item, title: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="الكلية / القسم"
                      value={a.department}
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((item) => (item.id === a.id ? { ...item, department: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الجامعة"
                      value={a.institution}
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((item) => (item.id === a.id ? { ...item, institution: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الفترة (من - إلى)"
                      value={a.period}
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((item) => (item.id === a.id ? { ...item, period: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Peer-Reviewed Publications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-600" />
                <span>الأبحاث والأوراق العلمية المنشورة ({publications.length})</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setPublications((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      authors: fullName,
                      title: 'عنوان البحث العلمي المنشور',
                      journal: 'اسم المجلة العلمية أو المؤتمر',
                      year: '2023',
                      volumeIssue: 'Vol. 1, pp. 1-10',
                      doi: '10.1000/example',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة بحث</span>
              </button>
            </div>

            <div className="space-y-3">
              {publications.map((p, i) => (
                <div key={p.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">بحث محكم #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setPublications((prev) => prev.filter((item) => item.id !== p.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="الباحثون (المؤلفون)"
                      value={p.authors}
                      onChange={(e) =>
                        setPublications((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, authors: e.target.value } : item))
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="عنوان البحث"
                      value={p.title}
                      onChange={(e) =>
                        setPublications((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, title: e.target.value } : item))
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white font-semibold"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="المجلة العلمية"
                        value={p.journal}
                        onChange={(e) =>
                          setPublications((prev) =>
                            prev.map((item) => (item.id === p.id ? { ...item, journal: e.target.value } : item))
                          )
                        }
                        className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="السنة"
                        value={p.year}
                        onChange={(e) =>
                          setPublications((prev) =>
                            prev.map((item) => (item.id === p.id ? { ...item, year: e.target.value } : item))
                          )
                        }
                        className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white text-center"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="المجلد والصفحات"
                        value={p.volumeIssue || ''}
                        onChange={(e) =>
                          setPublications((prev) =>
                            prev.map((item) => (item.id === p.id ? { ...item, volumeIssue: e.target.value } : item))
                          )
                        }
                        className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="DOI أو الرابط"
                        value={p.doi || ''}
                        onChange={(e) =>
                          setPublications((prev) =>
                            prev.map((item) => (item.id === p.id ? { ...item, doi: e.target.value } : item))
                          )
                        }
                        className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Research Grants */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-amber-600" />
                <span>المنح والمشاريع البحثية الممولة ({grants.length})</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setGrants((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      title: 'مشروع بحثي جديد',
                      funder: 'الجهة المانحة',
                      role: 'الباحث الرئيسي',
                      amountYear: '2023',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة منحة</span>
              </button>
            </div>

            <div className="space-y-3">
              {grants.map((g, i) => (
                <div key={g.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">منحة #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setGrants((prev) => prev.filter((item) => item.id !== g.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="عنوان المشروع البحثي"
                    value={g.title}
                    onChange={(e) =>
                      setGrants((prev) =>
                        prev.map((item) => (item.id === g.id ? { ...item, title: e.target.value } : item))
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="الجهة المانحة"
                      value={g.funder}
                      onChange={(e) =>
                        setGrants((prev) =>
                          prev.map((item) => (item.id === g.id ? { ...item, funder: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الصفة / الميزانية والسنة"
                      value={g.amountYear}
                      onChange={(e) =>
                        setGrants((prev) =>
                          prev.map((item) => (item.id === g.id ? { ...item, amountYear: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Academic Referees */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-amber-600" />
                <span>المعرفون الأكاديميون والتوصيات ({referees.length})</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setReferees((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      name: 'اسم المعرّف الأكاديمي',
                      title: 'الرتبة والمنصب',
                      institution: 'الجامعة',
                      email: 'email@univ.edu',
                      phone: '+966 ...',
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>إضافة معرّف</span>
              </button>
            </div>

            <div className="space-y-3">
              {referees.map((r, i) => (
                <div key={r.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">معرّف #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setReferees((prev) => prev.filter((item) => item.id !== r.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="الاسم واللقب العلمي"
                    value={r.name}
                    onChange={(e) =>
                      setReferees((prev) =>
                        prev.map((item) => (item.id === r.id ? { ...item, name: e.target.value } : item))
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="المنصب الأكاديمي"
                      value={r.title}
                      onChange={(e) =>
                        setReferees((prev) =>
                          prev.map((item) => (item.id === r.id ? { ...item, title: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الجامعة أو الكلية"
                      value={r.institution}
                      onChange={(e) =>
                        setReferees((prev) =>
                          prev.map((item) => (item.id === r.id ? { ...item, institution: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={r.email}
                      onChange={(e) =>
                        setReferees((prev) =>
                          prev.map((item) => (item.id === r.id ? { ...item, email: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="الهاتف"
                      value={r.phone}
                      onChange={(e) =>
                        setReferees((prev) =>
                          prev.map((item) => (item.id === r.id ? { ...item, phone: e.target.value } : item))
                        )
                      }
                      className="rounded-lg border border-slate-200 p-1.5 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
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
              معاينة حية بمقاس A4 القياسي (Classic Academic Preview)
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
                id="academic-cv-paper"
                className="cv-paper w-[210mm] min-h-[297mm] bg-white shadow-2xl p-10 text-slate-900 rounded-xs flex flex-col gap-5"
                style={{ fontFamily: fontFamily }}
              >
                {/* Academic Centered Header */}
                <div className="text-center border-b-2 pb-5" style={{ borderColor: accentColor }}>
                  <h1 className="text-3xl font-black text-slate-950 tracking-tight leading-snug">
                    {academicTitle} {fullName || 'الاسم الكامل'}
                  </h1>

                  <div className="text-sm font-bold text-slate-700 mt-1">
                    {academicRank}
                  </div>

                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    {department} • {institution}
                  </div>

                  {/* Contact Links */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{email}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span dir="ltr">{phone}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{officeLocation}</span>
                    </span>
                  </div>

                  {/* Identifiers (ORCID / Scholar) */}
                  {(orcid || googleScholar) && (
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                      {orcid && (
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <strong className="text-emerald-700 font-sans font-bold">ORCID:</strong>
                          <span>{orcid}</span>
                        </span>
                      )}
                      {googleScholar && (
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <strong className="text-blue-700 font-sans font-bold">Google Scholar</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Section 1: Research Statement / Summary */}
                {researchStatement && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      الاهتمامات البحثية والبيان الأكاديمي (Research Statement)
                    </h2>
                    <p className="text-xs text-slate-800 leading-relaxed text-justify">
                      {researchStatement}
                    </p>
                  </div>
                )}

                {/* Section 2: Higher Education & Degrees */}
                <div>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2.5"
                    style={{ borderColor: accentColor, color: accentColor }}
                  >
                    الدرجات العلمية والشهادات العليا (Education)
                  </h2>
                  <div className="space-y-3">
                    {degrees.map((d) => (
                      <div key={d.id} className="text-xs space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-slate-950">
                          <span>
                            {d.degree} - {d.field}
                          </span>
                          <span className="font-mono text-[11px] text-slate-600">{d.year}</span>
                        </div>
                        <div className="text-slate-700 font-medium">{d.institution}</div>
                        {d.thesisTitle && (
                          <div className="text-[11px] text-slate-600 italic ps-2">
                            • الأطروحة: &quot;{d.thesisTitle}&quot;
                            {d.supervisor ? ` (إشراف: ${d.supervisor})` : ''}
                          </div>
                        )}
                        {d.honors && (
                          <div className="text-[11px] text-slate-600 ps-2">
                            • {d.honors}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Academic Appointments */}
                <div>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2.5"
                    style={{ borderColor: accentColor, color: accentColor }}
                  >
                    المناصب والرتب الأكاديمية (Academic Appointments)
                  </h2>
                  <div className="space-y-2.5">
                    {appointments.map((a) => (
                      <div key={a.id} className="text-xs flex items-baseline justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{a.title}</div>
                          <div className="text-slate-600 text-[11px]">{a.department}، {a.institution}</div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">{a.period}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Peer-Reviewed Publications */}
                {publications.length > 0 && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2.5"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      الأبحاث والأوراق العلمية المنشورة (Publications)
                    </h2>
                    <div className="space-y-2 text-xs">
                      {publications.map((p, i) => (
                        <div key={p.id} className="text-slate-800 leading-relaxed ps-4 relative">
                          <span className="absolute start-0 top-0 font-bold text-slate-400 font-mono text-[11px]">
                            [{i + 1}]
                          </span>
                          <span className="font-medium text-slate-900">{p.authors}</span> ({p.year}).{' '}
                          <span className="font-bold text-slate-950">&quot;{p.title}&quot;</span>.{' '}
                          <span className="italic text-slate-700">{p.journal}</span>
                          {p.volumeIssue ? `، ${p.volumeIssue}` : ''}.
                          {p.doi && (
                            <span className="text-[10px] text-slate-500 font-mono ms-1">
                              DOI: {p.doi}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 5: Funded Research Grants */}
                {grants.length > 0 && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      المشاريع والمنح البحثية (Research Grants & Projects)
                    </h2>
                    <div className="space-y-2 text-xs">
                      {grants.map((g) => (
                        <div key={g.id} className="flex items-baseline justify-between">
                          <div>
                            <span className="font-bold text-slate-900">• {g.title}</span>
                            <div className="text-[11px] text-slate-600 ps-3">
                              {g.funder} — <span className="font-semibold">{g.role}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] text-slate-500">{g.amountYear}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 6: Academic Referees */}
                {referees.length > 0 && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      المعرفون الأكاديميون (References)
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {referees.map((r) => (
                        <div key={r.id} className="rounded-lg border border-slate-200 p-2.5 bg-slate-50/50 space-y-0.5">
                          <div className="font-bold text-slate-900">{r.name}</div>
                          <div className="text-[11px] text-slate-700">{r.title}</div>
                          <div className="text-[11px] text-slate-600">{r.institution}</div>
                          <div className="text-[11px] font-mono text-slate-500 pt-1 flex flex-col gap-0.5">
                            <span>البريد: {r.email}</span>
                            <span>الهاتف: {r.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
