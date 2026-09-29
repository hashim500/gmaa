import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Award,
  CreditCard,
  Bell,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  TrendingUp,
  FileCheck,
  Video,
  Edit,
  Play,
  Clock,
  ExternalLink,
  X,
  Eye,
  EyeOff,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Save,
  Check,
  UserCheck,
  UserX,
  FileText,
  Search,
  Key,
  Upload,
  ArrowRight,
  BookOpen,
  Download,
  Layers,
  Sparkles,
  ShieldCheck,
  Database,
  BarChart3,
} from 'lucide-react';
import {
  User,
  CertificateRequest,
  FeePayment,
  Announcement,
  Lecture,
  NewStudentApplication,
  RegistrationSettings,
} from '../types';
import { storage } from '../services/storage';
import { admissionService } from '../services/admissionService';
import { AdminPdfManager } from './AdminPdfManager';

export type AdminTab =
  | 'hub'
  | 'admissions'
  | 'certificates'
  | 'finances'
  | 'lectures'
  | 'pdfs'
  | 'announcements'
  | 'instructors'
  | 'reports';

interface AdminPortalProps {
  adminUser: User;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ adminUser }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('hub');
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [applications, setApplications] = useState<NewStudentApplication[]>([]);
  const [registrationSettings, setRegistrationSettings] = useState<RegistrationSettings>(
    admissionService.getSettings()
  );

  // Settings form
  const [regIsOpen, setRegIsOpen] = useState(registrationSettings.isOpen);
  const [regReopenDate, setRegReopenDate] = useState(registrationSettings.reopenDate);
  const [regClosedMsg, setRegClosedMsg] = useState(registrationSettings.closedMessage);
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  // Application view & decision modal
  const [selectedApp, setSelectedApp] = useState<NewStudentApplication | null>(null);
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Lecture visibility filter
  const [lectureVisibilityFilter, setLectureVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  // Add Announcement state
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annDept, setAnnDept] = useState('أمانة الشؤون العلمية');
  const [annUrgent, setAnnUrgent] = useState(false);

  // Lecture Edit & Add Modal State
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [lectureForm, setLectureForm] = useState({
    title: '',
    course: 'المحاسبة في بيئة التجارة الإلكترونية',
    instructor: 'د. عبد الله النور',
    duration: '52 دقيقة',
    youtubeId: '3u3jG4g7D-M',
    description: '',
    isLive: false,
    isVisibleToStudents: true,
  });

  const loadData = () => {
    setCertificates(storage.getCertificates());
    setPayments(storage.getPayments());
    setAnnouncements(storage.getAnnouncements());
    setLectures(storage.getLectures());
    setApplications(admissionService.getAll());
    const currentSettings = admissionService.getSettings();
    setRegistrationSettings(currentSettings);
    setRegIsOpen(currentSettings.isOpen);
    setRegReopenDate(currentSettings.reopenDate);
    setRegClosedMsg(currentSettings.closedMessage);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    window.addEventListener('nsac_registration_settings_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
      window.removeEventListener('nsac_registration_settings_updated', handleStorageUpdate);
    };
  }, []);

  // Save Registration Settings
  const handleSaveRegistrationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = admissionService.updateSettings({
      isOpen: regIsOpen,
      reopenDate: regReopenDate,
      closedMessage: regClosedMsg,
    });
    setRegistrationSettings(updated);
    setSettingsSavedFeedback(true);
    setTimeout(() => setSettingsSavedFeedback(false), 2500);
  };

  // Applications Actions
  const handleAcceptApp = (app: NewStudentApplication) => {
    const updated = admissionService.updateStatus(app.ref || app.id || '', 'accepted', adminUser.name);
    if (updated) {
      setApplications(admissionService.getAll());
      setSelectedApp(updated);
    }
  };

  const handleRejectApp = () => {
    if (!selectedApp) return;
    const updated = admissionService.updateStatus(
      selectedApp.ref || selectedApp.id || '',
      'rejected',
      adminUser.name,
      rejectReason || 'عدم استيفاء الشروط الأكاديمية أو نقص في المستندات'
    );
    if (updated) {
      setApplications(admissionService.getAll());
      setSelectedApp(updated);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  // Toggle Lecture Visibility
  const handleToggleLectureVisibility = (id: string) => {
    storage.toggleLectureVisibility(id);
    setLectures(storage.getLectures());
  };

  const handleApproveCert = (id: string) => {
    storage.approveCertificate(id);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addAnnouncement({
      title: annTitle,
      content: annContent,
      department: annDept,
      isUrgent: annUrgent,
      category: 'academic',
    });
    setShowAddAnnModal(false);
    setAnnTitle('');
    setAnnContent('');
  };

  // Open modal to add lecture
  const handleOpenAddLecture = () => {
    setEditingLecture(null);
    setLectureForm({
      title: '',
      course: 'المحاسبة في بيئة التجارة الإلكترونية',
      instructor: adminUser.name || 'د. عبد الله النور',
      duration: '45 دقيقة',
      youtubeId: '3u3jG4g7D-M',
      description: '',
      isLive: false,
      isVisibleToStudents: true,
    });
    setShowLectureModal(true);
  };

  // Open modal to edit existing lecture
  const handleOpenEditLecture = (lec: Lecture) => {
    setEditingLecture(lec);
    setLectureForm({
      title: lec.title,
      course: lec.course,
      instructor: lec.instructor,
      duration: lec.duration,
      youtubeId: lec.youtubeId || lec.videoId || '',
      description: lec.description,
      isLive: lec.isLive || false,
      isVisibleToStudents: lec.isVisibleToStudents !== false,
    });
    setShowLectureModal(true);
  };

  // Delete lecture with confirmation
  const handleDeleteLecture = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف محاضرة "${title}"؟ لن يتمكن الطلاب من مشاهدتها لاحقاً.`)) {
      storage.deleteLecture(id);
    }
  };

  // Save (create or update) lecture
  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLecture) {
      storage.updateLecture(editingLecture.id, {
        title: lectureForm.title,
        course: lectureForm.course,
        instructor: lectureForm.instructor,
        duration: lectureForm.duration,
        youtubeId: lectureForm.youtubeId,
        description: lectureForm.description,
        isLive: lectureForm.isLive,
        isVisibleToStudents: lectureForm.isVisibleToStudents,
      });
    } else {
      storage.addLecture({
        title: lectureForm.title,
        course: lectureForm.course,
        instructor: lectureForm.instructor,
        duration: lectureForm.duration,
        youtubeId: lectureForm.youtubeId,
        description: lectureForm.description,
        isLive: lectureForm.isLive,
        isVisibleToStudents: lectureForm.isVisibleToStudents,
      });
    }
    setShowLectureModal(false);
  };

  const filteredLectures = lectures.filter((l) => {
    if (lectureVisibilityFilter === 'visible') return l.isVisibleToStudents !== false;
    if (lectureVisibilityFilter === 'hidden') return l.isVisibleToStudents === false;
    return true;
  });

  const filteredApplications = applications.filter((app) => {
    if (appFilter === 'all') return true;
    return app.status === appFilter;
  });

  const totalFeeRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl font-black">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                لوحة تحكم إدارة الكلية والشؤون الأكاديمية
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{adminUser.name}</h2>
              <p className="text-xs text-slate-400">{adminUser.department} • كلية السودان الجديد للمحاسبة</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('pdfs')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" /> رفع وإدارة ملفات الـ PDF
            </button>
            <button
              onClick={handleOpenAddLecture}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <Video className="w-4 h-4" /> إضافة رابط محاضرة
            </button>
            <button
              onClick={() => setShowAddAnnModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" /> نشر إعلان جامعي
            </button>
          </div>
        </div>
      </div>

      {/* 1. WHEN IN 'HUB' (MAIN EXECUTIVE DASHBOARD OF ALL SERVICES CARDS) */}
      {activeTab === 'hub' && (
        <div className="space-y-8">
          {/* Executive KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('admissions')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 cursor-pointer transition"
            >
              <span className="text-xs font-bold text-slate-500 block">طلبات الالتحاق الجديدة</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {applications.length} طلبات
              </span>
              <span className="text-[10px] text-amber-700 font-bold block">
                {applications.filter((a) => a.status === 'pending').length} بانتظار قرار القبول
              </span>
            </div>
            <div
              onClick={() => setActiveTab('lectures')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition"
            >
              <span className="text-xs font-bold text-slate-500 block">المحاضرات المرئية</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">{lectures.length} محاضرات</span>
              <span className="text-[10px] text-blue-600 font-semibold block">
                {lectures.filter((l) => l.isVisibleToStudents !== false).length} ظاهرة للطلاب
              </span>
            </div>
            <div
              onClick={() => setActiveTab('admissions')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition"
            >
              <span className="text-xs font-bold text-slate-500 block">حالة بوابة التسجيل</span>
              <span className={`text-xl font-black mt-1 block ${registrationSettings.isOpen ? 'text-emerald-600' : 'text-rose-600'}`}>
                {registrationSettings.isOpen ? 'مفتوح للتقديم' : 'مغلق حالياً'}
              </span>
              <span className="text-[10px] text-slate-500 block">العام {registrationSettings.academicYear}</span>
            </div>
            <div
              onClick={() => setActiveTab('finances')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition"
            >
              <span className="text-xs font-bold text-slate-500 block">إجمالي تحصيلات الرسوم</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {(totalFeeRevenue / 1000).toFixed(0)} ألف ج.س
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">مطابقة مباشرة مع البنوك</span>
            </div>
          </div>

          {/* 8 INTERACTIVE ADMINISTRATIVE SERVICE CARDS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  منظومة الخدمات الإدارية المستقلة (بطاقات الانتقال والتحكم)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  انقر على أي بطاقة للدخول مباشرة إلى الصفحة التنفيذية المخصصة لتلك الخدمة الإدارية
                </p>
              </div>
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                8 خدمات إدارية مستقلة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Admissions */}
              <div
                onClick={() => setActiveTab('admissions')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {applications.length} طلبات
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-amber-700 transition">
                    إدارة القبول والتسجيل للطلاب الجدد
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    فرز طلبات الالتحاق، فحص المرفقات والشهادات، فتح وإغلاق التسجيل، واعتماد القبول وتوليد الأرقام الجامعية.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-amber-700 flex items-center justify-between">
                  <span>الدخول لصفحة القبول والتسجيل</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 2: Certificates */}
              <div
                onClick={() => setActiveTab('certificates')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {certificates.length} طلبات
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition">
                    شؤون الطلاب والشهادات والإفادات
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    مراجعة واعتماد طلبات الشهادات الأكاديمية وكشوفات الدرجات وإفادات القيد وتوثيق الأختام والباركود الرسمي.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-emerald-700 flex items-center justify-between">
                  <span>الدخول لصفحة الشهادات والوثائق</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 3: Finances */}
              <div
                onClick={() => setActiveTab('finances')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {(totalFeeRevenue / 1000).toFixed(0)} ألف ج.س
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-blue-700 transition">
                    الشؤون المالية والرسوم وسندات القبض
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    متابعة وتدقيق إيصالات سداد الرسوم عبر بنكك وتطبيق فوري، وإصدار سندات القبض المالية المختومة.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-blue-700 flex items-center justify-between">
                  <span>الدخول لصفحة الشؤون المالية</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 4: Lectures */}
              <div
                onClick={() => setActiveTab('lectures')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <Video className="w-6 h-6" />
                    </div>
                    <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {lectures.length} محاضرات
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-indigo-700 transition">
                    أمانة الشؤون العلمية وإدارة المحاضرات
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    جدولة المحاضرات والدروس الرقمية، إضافة الروابط والمواد، والتحكم الفوري في إظهار أو إخفاء المحاضرات للطلاب.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-indigo-700 flex items-center justify-between">
                  <span>الدخول لإدارة المحاضرات</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 5: PDFs */}
              <div
                onClick={() => setActiveTab('pdfs')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-rose-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="bg-rose-100 text-rose-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      المستودع الرقمي
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-rose-700 transition">
                    المستودع المحاسبي الرقمي والـ PDF
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    رفع وتصنيف الكتب والمقررات المحاسبية، مذكرات المقررات، واللوائح بصيغة PDF مع إتاحة المعاينة والتحميل المباشر.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-rose-700 flex items-center justify-between">
                  <span>الدخول لإدارة ملفات الـ PDF</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 6: Announcements */}
              <div
                onClick={() => setActiveTab('announcements')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <Bell className="w-6 h-6" />
                    </div>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {announcements.length} إعلانات
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-amber-700 transition">
                    المركز الإعلامي والتعاميم الرسمية
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    نشر وتعديل الأخبار الرسمية للكلية، وتفعيل التعاميم الإدارية والشريط الإخباري العاجل للطلاب والأساتذة.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-amber-700 flex items-center justify-between">
                  <span>الدخول لإدارة الإعلانات والتعاميم</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 7: Instructors */}
              <div
                onClick={() => setActiveTab('instructors')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-teal-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="bg-teal-100 text-teal-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      الهيئة التدريسية
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-teal-700 transition">
                    إدارة أعضاء هيئة التدريس والمحاضرين
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    قاعدة بيانات الأساتذة، المقررات المسندة، الساعات التدريسية المعتمدة، والساعات المكتبية وتقييم التدريس.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-teal-700 flex items-center justify-between">
                  <span>الدخول لإدارة هيئة التدريس</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 8: Reports */}
              <div
                onClick={() => setActiveTab('reports')}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-purple-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-xs">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      لوحة المؤشرات
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-purple-700 transition">
                    التقارير الإحصائية والنسخ الاحتياطي
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    استعراض الإحصائيات الشاملة لأعداد الطلاب والبرامج، نسب التحصيل، وتصدير نسخة احتياطية من بيانات المنظومة.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-black text-purple-700 flex items-center justify-between">
                  <span>الدخول لصفحة التقارير والنظام</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WHEN IN DEDICATED SERVICE SUBPAGE: RENDER SERVICE HEADER WITH RETURN TO HUB BUTTON */}
      {activeTab !== 'hub' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('hub')}
              className="bg-[#0b2545] hover:bg-[#133e68] text-white px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition" />
              <span>العودة لبطاقات الخدمات الإدارية</span>
            </button>
            <div className="text-xs text-slate-500">
              <span>لوحة الإدارة</span> /{' '}
              <span className="font-bold text-slate-900">
                {activeTab === 'admissions' && 'إدارة القبول والتسجيل للطلاب الجدد'}
                {activeTab === 'certificates' && 'شؤون الطلاب والشهادات والإفادات'}
                {activeTab === 'finances' && 'الشؤون المالية والرسوم وسندات القبض'}
                {activeTab === 'lectures' && 'إدارة المحاضرات وضبط الرؤية'}
                {activeTab === 'pdfs' && 'المستودع الرقمي وإدارة ملفات الـ PDF'}
                {activeTab === 'announcements' && 'المركز الإعلامي والتعاميم الرسمية'}
                {activeTab === 'instructors' && 'إدارة هيئة التدريس والأساتذة'}
                {activeTab === 'reports' && 'التقارير الأكاديمية والنسخ الاحتياطي'}
              </span>
            </div>
          </div>

          {/* Quick Subpage Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold custom-scrollbar">
            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'admissions'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              القبول والتسجيل
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الشهادات
            </button>
            <button
              onClick={() => setActiveTab('finances')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'finances'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المالية والرسوم
            </button>
            <button
              onClick={() => setActiveTab('lectures')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'lectures'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المحاضرات
            </button>
            <button
              onClick={() => setActiveTab('pdfs')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'pdfs'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              المستودع الرقمي
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'bg-yellow-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الإعلانات
            </button>
            <button
              onClick={() => setActiveTab('instructors')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'instructors'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              هيئة التدريس
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              التقارير
            </button>
          </div>
        </div>
      )}

      {/* 3. DEDICATED SUBPAGES RENDERING */}
      {/* SUBPAGE 1: PDF MANAGEMENT */}
      {activeTab === 'pdfs' && (
        <AdminPdfManager onRefresh={loadData} />
      )}

      {/* SUBPAGE 2: ADMISSIONS & REGISTRATION */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                صلاحية الإدارة العليا
              </span>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600" /> التحكم في فتح وإغلاق تسجيل الطلاب الجدد ومواعيد القبول
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              يمكن للإدارة تفعيل أو تعليق استقبال طلبات الالتحاق وتحديد تاريخ وموعد فتح باب التسجيل القادم مع رسالة رسمية تظهر للمتقدمين
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRegIsOpen(!regIsOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                regIsOpen
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-rose-600 text-white shadow-xs'
              }`}
            >
              {regIsOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {regIsOpen ? 'التسجيل مفتوح الآن' : 'التسجيل مغلق حالياً'}
            </button>
          </div>
        </div>

        {settingsSavedFeedback && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> تم حفظ إعدادات فتح وإغلاق التسجيل وتحديث شاشة الطلاب فورياً
          </div>
        )}

        <form onSubmit={handleSaveRegistrationSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                تاريخ وموعد فتح باب التسجيل القادم (يظهر للمتقدمين عند إغلاق التسجيل) *
              </label>
              <input
                type="text"
                required
                value={regReopenDate}
                onChange={(e) => setRegReopenDate(e.target.value)}
                placeholder="مثال: 15 أكتوبر 2026 الساعة 09:00 صباحاً"
                className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                سيظهر هذا النص في شريط بارز بصفحة التسجيل للطلاب عند الإغلاق.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                رسالة الإشعار الإدارية للمتقدمين عند إغلاق التسجيل *
              </label>
              <textarea
                rows={2}
                required
                value={regClosedMsg}
                onChange={(e) => setRegClosedMsg(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" /> تطبيق وحفظ إعدادات القبول والتسجيل
            </button>
          </div>
        </form>
      </div>

      {/* 2. NEW STUDENT APPLICATIONS MANAGEMENT (إدارة طلبات المتقدمين الجدد) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" /> مراجعة واعتماد طلبات المتقدمين الجدد (Admissions Review)
            </h3>
            <p className="text-xs text-slate-500">
              فحص البيانات الديموغرافية والأكاديمية والمستندات المرفقة، والموافقة على القبول مع توليد حساب جامعي تلقائي
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setAppFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                appFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({applications.length})
            </button>
            <button
              onClick={() => setAppFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                appFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              قيد المراجعة ({applications.filter((a) => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setAppFilter('accepted')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                appFilter === 'accepted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              المقبولين ({applications.filter((a) => a.status === 'accepted').length})
            </button>
            <button
              onClick={() => setAppFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                appFilter === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              المرفوضين ({applications.filter((a) => a.status === 'rejected').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">الرقم المرجعي</th>
                <th className="p-3.5 font-bold">اسم المتقدم (عربي / إنجليزي)</th>
                <th className="p-3.5 font-bold">رقم الهوية / الجواز</th>
                <th className="p-3.5 font-bold">الدرجة والتخصص</th>
                <th className="p-3.5 font-bold">النسبة / المعدل</th>
                <th className="p-3.5 font-bold">تاريخ التقديم</th>
                <th className="p-3.5 font-bold">حالة الطلب</th>
                <th className="p-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                    لا توجد طلبات في هذا التصنيف حالياً.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.ref || app.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono font-bold text-amber-800 whitespace-nowrap">
                      {app.ref}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{app.data.nameAr}</span>
                      <span className="text-[10px] text-slate-500 block">{app.data.nameEn}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{app.data.idNumber}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{app.data.major}</span>
                      <span className="text-[10px] text-slate-500">
                        {app.data.level === 'diploma'
                          ? 'دبلوم'
                          : app.data.level === 'bachelor'
                          ? 'بكالوريوس'
                          : app.data.level === 'master'
                          ? 'ماجستير'
                          : 'دكتوراه'}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-blue-900">{app.data.gradeValue}</td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {app.status === 'accepted' ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> مقبول ومعتمد
                        </span>
                      ) : app.status === 'rejected' ? (
                        <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full text-[11px] font-black">
                          مرفوض
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-black">
                          قيد المراجعة
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> فحص المستندات والقرار
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      )}

      {/* SUBPAGE 3: LECTURES MANAGEMENT & VISIBILITY CONTROLS */}
      {activeTab === 'lectures' && (
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                إدارة المحتوى المرئي
              </span>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-700" /> إدارة المحاضرات والتحكم في إظهار / إخفاء الفيديو للطلاب
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              للإدارة الحق الكامل في إظهار المحتوى المرئي أو إخفائه عن الطلاب نهائياً بضغطة زر واحدة
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs">
              <button
                onClick={() => setLectureVisibilityFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  lectureVisibilityFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                الكل ({lectures.length})
              </button>
              <button
                onClick={() => setLectureVisibilityFilter('visible')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  lectureVisibilityFilter === 'visible'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                مرئية للطلاب ({lectures.filter((l) => l.isVisibleToStudents !== false).length})
              </button>
              <button
                onClick={() => setLectureVisibilityFilter('hidden')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  lectureVisibilityFilter === 'hidden' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                مخفية ({lectures.filter((l) => l.isVisibleToStudents === false).length})
              </button>
            </div>

            <button
              onClick={handleOpenAddLecture}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> إضافة محاضرة جديدة
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">المقرر الدراسي</th>
                <th className="p-3.5 font-bold">عنوان المحاضرة</th>
                <th className="p-3.5 font-bold">المحاضر</th>
                <th className="p-3.5 font-bold">معرّف الفيديو / الرابط</th>
                <th className="p-3.5 font-bold">حالة الرؤية للطلاب</th>
                <th className="p-3.5 font-bold">المدة / البث</th>
                <th className="p-3.5 font-bold text-center">إجراءات الرؤية والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLectures.map((lec) => {
                const isVisible = lec.isVisibleToStudents !== false;
                return (
                  <tr key={lec.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-blue-900">{lec.course}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{lec.title}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{lec.description}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700 whitespace-nowrap">{lec.instructor}</td>
                    <td className="p-3.5 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">
                          {lec.youtubeId || lec.videoId || 'معرّف غير متوفر'}
                        </span>
                        <a
                          href={`https://www.youtube.com/watch?v=${lec.youtubeId || lec.videoId || ''}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-600 hover:text-red-700"
                          title="فتح في يوتيوب"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    {/* VISIBILITY BADGE */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isVisible ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-emerald-600" /> مرئي للطلاب
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" /> مخفي عن الطلاب
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {lec.isLive ? (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          بث مباشر
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {lec.duration}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* TOGGLE VISIBILITY BUTTON */}
                        <button
                          onClick={() => handleToggleLectureVisibility(lec.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            isVisible
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={isVisible ? 'إخفاء هذه المحاضرة عن الطلاب' : 'إظهار هذه المحاضرة للطلاب'}
                        >
                          {isVisible ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> إخفاء عن الطلاب
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" /> إظهار للطلاب
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEditLecture(lec)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-1.5 rounded-lg transition"
                          title="تعديل المحاضرة"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLecture(lec.id, lec.title)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded-lg transition"
                          title="حذف المحاضرة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* SUBPAGE 4: CERTIFICATES REQUESTS APPROVALS */}
      {activeTab === 'certificates' && (
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
              شؤون الطلاب والوثائق
            </span>
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mt-1">
              <Award className="w-5 h-5 text-emerald-600" /> اعتماد وتوثيق طلبات الشهادات الأكاديمية والإفادات
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            {certificates.filter((c) => c.status !== 'approved').length} طلبات قيد الانتظار
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">اسم الطالب</th>
                <th className="p-3.5 font-bold">الرقم الجامعي</th>
                <th className="p-3.5 font-bold">نوع الشهادة</th>
                <th className="p-3.5 font-bold">الرقم التسلسلي</th>
                <th className="p-3.5 font-bold">تاريخ الطلب</th>
                <th className="p-3.5 font-bold">الحالة</th>
                <th className="p-3.5 font-bold text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-900">{cert.studentName}</td>
                  <td className="p-3.5 font-mono text-blue-700 font-semibold">{cert.studentId}</td>
                  <td className="p-3.5 font-medium">{cert.certType}</td>
                  <td className="p-3.5 font-mono text-amber-700 font-bold">{cert.serialNumber}</td>
                  <td className="p-3.5 text-slate-500">{cert.requestedAt}</td>
                  <td className="p-3.5">
                    {cert.status === 'approved' ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> معتمد ومختوم
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        بانتظار الاعتماد
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {cert.status !== 'approved' ? (
                      <button
                        onClick={() => handleApproveCert(cert.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs"
                      >
                        اعتماد وختم الوثيقة
                      </button>
                    ) : (
                      <span className="text-slate-400 font-bold text-xs">تم الاعتماد</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* SUBPAGE 5: FINANCIAL AFFAIRS & FEES */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">إجمالي المقبوضات المعتمدة</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {totalFeeRevenue.toLocaleString()} ج.س
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                {payments.length} عمليات سداد موثقة
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">مدفوعات تطبيق بنكك (Bankak)</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">
                {payments.filter((p) => p.paymentMethod === 'bankak').length} عمليات
              </span>
              <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">
                تحويل مباشر لحساب الكلية
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">مدفوعات تطبيق فوري (Fawry) والمحافظ</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                {payments.filter((p) => p.paymentMethod === 'fawry' || p.paymentMethod === 'card').length} عمليات
              </span>
              <span className="text-[11px] text-amber-600 font-semibold block mt-0.5">
                سداد إلكتروني فوري
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  الإدارة المالية
                </span>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mt-1">
                  <CreditCard className="w-5 h-5 text-blue-700" /> سجلات سداد الرسوم الدراسية وسندات القبض
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 font-bold">اسم الطالب</th>
                    <th className="p-3.5 font-bold">الرقم الجامعي</th>
                    <th className="p-3.5 font-bold">رقم السند المالي</th>
                    <th className="p-3.5 font-bold">المبلغ المسدد</th>
                    <th className="p-3.5 font-bold">الفصل الدراسي</th>
                    <th className="p-3.5 font-bold">وسيلة الدفع</th>
                    <th className="p-3.5 font-bold">رقم المرجع المصرفي</th>
                    <th className="p-3.5 font-bold">التاريخ</th>
                    <th className="p-3.5 font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{pay.studentName}</td>
                      <td className="p-3.5 font-mono text-blue-700 font-semibold">{pay.studentId}</td>
                      <td className="p-3.5 font-mono text-amber-700 font-bold">{pay.receiptNumber}</td>
                      <td className="p-3.5 font-black text-emerald-700">{pay.amount.toLocaleString()} ج.س</td>
                      <td className="p-3.5 text-slate-600">{pay.term}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          {pay.paymentMethod === 'bankak'
                            ? 'تطبيق بنكك'
                            : pay.paymentMethod === 'fawry'
                            ? 'تطبيق فوري'
                            : 'بطاقة مصرفية'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">{pay.referenceNumber}</td>
                      <td className="p-3.5 text-slate-500">{pay.date}</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> معتمد ومسدد
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBPAGE 6: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                المركز الإعلامي الرسمي
              </span>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mt-1">
                <Bell className="w-5 h-5 text-amber-600" /> إدارة الأخبار والتعاميم والإعلانات الأكاديمية
              </h3>
            </div>
            <button
              onClick={() => setShowAddAnnModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" /> نشر إعلان جامعي جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-5 rounded-2xl border ${
                  ann.isUrgent ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-slate-50/50'
                } space-y-3 flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800">{ann.department}</span>
                    <div className="flex items-center gap-2">
                      {ann.isUrgent && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          عاجل
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">{ann.date}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">{ann.content}</p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>منشور لكافة الطلاب والزوار</span>
                  <button
                    onClick={() => {
                      storage.deleteAnnouncement(ann.id);
                      setAnnouncements(storage.getAnnouncements());
                    }}
                    className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBPAGE 7: INSTRUCTORS & FACULTY MANAGEMENT */}
      {activeTab === 'instructors' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="bg-teal-100 text-teal-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                أمانة الشؤون العلمية
              </span>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mt-1">
                <Users className="w-5 h-5 text-teal-700" /> دليل أعضاء هيئة التدريس والمقررات المسندة
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              5 أعضاء هيئة تدريس معتمدين
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'د. عبد الله النور',
                title: 'أستاذ مشارك - رئيس قسم المحاسبة والتمويل',
                degree: 'دكتوراه في المحاسبة المالية (جامعة الخرطوم)',
                courses: ['المحاسبة في بيئة التجارة الإلكترونية', 'معايير المحاسبة الدولية IFRS'],
                email: 'a.alnoor@nsac.edu.sd',
              },
              {
                name: 'د. إبراهيم فضل المولى',
                title: 'أستاذ مساعد - نظم المعلومات المحاسبية',
                degree: 'دكتوراه في نظم المعلومات المحاسبية السحابية (AIS)',
                courses: ['نظم المعلومات المحاسبية (AIS)', 'التدقيق المحوسب'],
                email: 'i.fadl@nsac.edu.sd',
              },
              {
                name: 'د. سارة عبد الرحمن',
                title: 'أستاذ مشارك - المراجعة والتدقيق المالي',
                degree: 'دكتوراه في التدقيق المالي وحوكمة الشركات',
                courses: ['المراجعة والتدقيق المالي الإلكتروني'],
                email: 's.abdelrahman@nsac.edu.sd',
              },
              {
                name: 'أ. طارق كمال الدين',
                title: 'محاضر أول - المحاسبة الضريبية',
                degree: 'ماجستير في الضرائب والتشريعات المالية السودانية',
                courses: ['التشريعات الضريبية والزكاة بالسودان'],
                email: 't.kamal@nsac.edu.sd',
              },
              {
                name: 'أ. عثمان الطيب',
                title: 'محاضر - محاسبة التكاليف والإدارية',
                degree: 'ماجستير محاسبة إدارية وتخطيط مالي',
                courses: ['محاسبة التكاليف والمحاسبة الإدارية'],
                email: 'o.tayeb@nsac.edu.sd',
              },
            ].map((inst, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-teal-400 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-lg">
                    {inst.name.charAt(3)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{inst.name}</h4>
                    <span className="text-[11px] text-teal-800 font-bold block">{inst.title}</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                  <p className="text-[11px] text-slate-500 font-medium">{inst.degree}</p>
                  <div>
                    <span className="font-bold text-slate-700 block">المقررات المسندة:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600">
                      {inst.courses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-[11px] font-mono text-blue-700 block pt-1">{inst.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBPAGE 8: REPORTS & SYSTEM BACKUP */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                التقارير التنفيذية
              </span>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mt-1">
                <BarChart3 className="w-5 h-5 text-purple-700" /> التقارير الأكاديمية والنسخ الاحتياطي للنظام
              </h3>
            </div>
            <button
              onClick={() => {
                const data = {
                  timestamp: new Date().toISOString(),
                  admin: adminUser.name,
                  applications,
                  payments,
                  certificates,
                  lectures,
                  announcements,
                  registrationSettings,
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `NSAC_System_Backup_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" /> تحميل نسخة احتياطية من البيانات (JSON)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-purple-50/60 border border-purple-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-purple-900">توزيع الطلاب حسب التخصص</span>
              <div className="space-y-1.5 text-xs pt-2">
                <div className="flex justify-between font-medium">
                  <span>بكالوريوس المحاسبة والتمويل</span>
                  <span className="font-bold">62%</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-700 h-full w-[62%]"></div>
                </div>

                <div className="flex justify-between font-medium pt-1">
                  <span>نظم المعلومات المحاسبية (AIS)</span>
                  <span className="font-bold">26%</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full w-[26%]"></div>
                </div>

                <div className="flex justify-between font-medium pt-1">
                  <span>دبلوم المحاسبة والضرائب</span>
                  <span className="font-bold">12%</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[12%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-900">معدل التحصيل والمعدلات الأكاديمية</span>
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between">
                  <span>الطلاب بتقدير ممتاز (GPA 3.5 - 4.0):</span>
                  <span className="font-bold text-emerald-800">48%</span>
                </div>
                <div className="flex justify-between">
                  <span>الطلاب بتقدير جيد جداً (3.0 - 3.49):</span>
                  <span className="font-bold text-emerald-800">36%</span>
                </div>
                <div className="flex justify-between">
                  <span>الطلاب بتقدير جيد (2.5 - 2.99):</span>
                  <span className="font-bold text-emerald-800">14%</span>
                </div>
                <div className="flex justify-between">
                  <span>نسبة النجاح العامة:</span>
                  <span className="font-black text-emerald-900">96.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-900">حالة الخوادم والمنظومة الإلكترونية</span>
              <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center justify-between">
                  <span>حالة المنصة الإلكترونية:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> متصلة 100%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>تخزين ملفات الـ PDF والوثائق:</span>
                  <span className="text-blue-800 font-bold">جاهزية كاملة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>التحقق من الشهادات برمز QR:</span>
                  <span className="text-emerald-700 font-bold">مفعل</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الربط مع بنكك وفوري:</span>
                  <span className="text-emerald-700 font-bold">نشط ومعتمد</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLICANT DETAILS & DECISION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  الرقم المرجعي: {selectedApp.ref}
                </span>
                <h3 className="font-black text-xl text-slate-900 mt-1">{selectedApp.data.nameAr}</h3>
                <span className="text-xs text-slate-500 font-sans">{selectedApp.data.nameEn}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[10px] block">حالة الطلب الحالية:</span>
                <span className="font-black text-sm text-slate-900">
                  {selectedApp.status === 'accepted'
                    ? 'تم القبول والاعتماد الأكاديمي'
                    : selectedApp.status === 'rejected'
                    ? 'تم رفض الطلب'
                    : 'قيد الدراسة والمراجعة'}
                </span>
              </div>

              {selectedApp.generatedAccount && (
                <div className="text-left font-mono text-xs bg-emerald-100 text-emerald-900 p-2 rounded-xl">
                  <span>الرقم الجامعي: <strong>{selectedApp.generatedAccount.studentId}</strong></span>
                </div>
              )}
            </div>

            {/* Personal & Academic Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">نوع ورقم الهوية:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.idNumber}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">الجنسية:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.nationality}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">العمر / تاريخ الميلاد:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.dob} ({selectedApp.data.age} سنة)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">الدرجة المطلوبة:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.level}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">التخصص المرغوب:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.major}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">المعدل / النسبة:</span>
                <span className="font-black text-amber-700">{selectedApp.data.gradeValue}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">المؤسسة السابقة:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.prevInstitution}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">البريد الإلكتروني:</span>
                <span className="font-bold text-slate-800">{selectedApp.data.email}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">الهاتف / الواتساب:</span>
                <span className="font-bold text-slate-800" dir="ltr">{selectedApp.data.dial} {selectedApp.data.phone}</span>
              </div>
            </div>

            {/* Attached Documents Preview */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-900 block">المستندات المرفقة بالطلب:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Photo */}
                <div className="border border-slate-200 rounded-xl p-2 text-center bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">الصورة الشخصية</span>
                  {selectedApp.files?.photo?.dataUrl ? (
                    <img
                      src={selectedApp.files.photo.dataUrl}
                      alt="الصورة"
                      className="w-16 h-20 object-cover rounded-lg mx-auto border border-slate-300 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-slate-200 rounded-lg mx-auto flex items-center justify-center text-[10px] text-slate-400">
                      افتراضية
                    </div>
                  )}
                </div>

                {/* Cert */}
                <div className="border border-slate-200 rounded-xl p-2 text-center bg-slate-50 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">الشهادة الأكاديمية</span>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <FileText className="w-6 h-6 text-blue-600 mx-auto" />
                    <span className="text-[9px] text-slate-500 block truncate mt-1">
                      {selectedApp.files?.cert?.name || 'شهادة_معتمدة.pdf'}
                    </span>
                  </div>
                </div>

                {/* ID Doc */}
                <div className="border border-slate-200 rounded-xl p-2 text-center bg-slate-50 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">وثيقة الهوية</span>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <FileCheck className="w-6 h-6 text-emerald-600 mx-auto" />
                    <span className="text-[9px] text-slate-500 block truncate mt-1">
                      {selectedApp.files?.idDoc?.name || 'وثيقة_الهوية.jpg'}
                    </span>
                  </div>
                </div>

                {/* CV */}
                <div className="border border-slate-200 rounded-xl p-2 text-center bg-slate-50 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">السيرة الذاتية</span>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <FileText className="w-6 h-6 text-purple-600 mx-auto" />
                    <span className="text-[9px] text-slate-500 block truncate mt-1">
                      {selectedApp.files?.cv?.name || 'السيرة_الذاتية.pdf'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Actions */}
            {selectedApp.status !== 'accepted' && (
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
                >
                  <UserX className="w-4 h-4" /> رفض طلب المتقدم
                </button>

                <button
                  onClick={() => handleAcceptApp(selectedApp)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" /> اعتماد القبول النهائي وتوليد الحساب الجامعي
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-black text-base text-slate-900">سبب رفض طلب الالتحاق</h4>
            <p className="text-xs text-slate-500">
              يرجى توضيح سبب الرفض ليظهر للمتقدم في شاشة تتبع الطلب (مثال: عدم استيفاء النسبة المئوية المطلوبة، نقص المستندات...).
            </p>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="اكتب سبب الرفض هنا..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleRejectApp}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT LECTURE MODAL WITH VISIBILITY TOGGLE */}
      {showLectureModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-700" />
                {editingLecture ? 'تعديل بيانات ورابط المحاضرة' : 'إضافة محاضرة جديدة'}
              </h3>
              <button
                onClick={() => setShowLectureModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان المحاضرة الأكاديمية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: المعالجة المحاسبية لضريبة القيمة المضافة"
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المقرر الدراسي</label>
                  <select
                    value={lectureForm.course}
                    onChange={(e) => setLectureForm({ ...lectureForm, course: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  >
                    <option value="المحاسبة في بيئة التجارة الإلكترونية">المحاسبة في بيئة التجارة الإلكترونية</option>
                    <option value="نظم المعلومات المحاسبية (AIS)">نظم المعلومات المحاسبية (AIS)</option>
                    <option value="المعايير الدولية لإعداد التقارير المالية (IFRS)">المعايير الدولية (IFRS)</option>
                    <option value="المراجعة والتدقيق المالي الإلكتروني">المراجعة والتدقيق المالي الإلكتروني</option>
                    <option value="محاسبة التكاليف والمحاسبة الإدارية">محاسبة التكاليف والمحاسبة الإدارية</option>
                    <option value="التشريعات الضريبية والزكاة بالسودان">التشريعات الضريبية والزكاة بالسودان</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">أستاذ المادة</label>
                  <input
                    type="text"
                    required
                    value={lectureForm.instructor}
                    onChange={(e) => setLectureForm({ ...lectureForm, instructor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">معرّف يوتيوب (YouTube Video ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 3u3jG4g7D-M"
                    value={lectureForm.youtubeId}
                    onChange={(e) => setLectureForm({ ...lectureForm, youtubeId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono dir-ltr text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدة التقريبية</label>
                  <input
                    type="text"
                    placeholder="مثال: 45 دقيقة"
                    value={lectureForm.duration}
                    onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملخص محتوى المحاضرة</label>
                <textarea
                  rows={2}
                  placeholder="وصف موجز للمحاور المحاسبية التي تغطيها المحاضرة..."
                  value={lectureForm.description}
                  onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                ></textarea>
              </div>

              {/* VISIBILITY CHECKBOX */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <input
                  type="checkbox"
                  id="visible_chk"
                  checked={lectureForm.isVisibleToStudents}
                  onChange={(e) =>
                    setLectureForm({ ...lectureForm, isVisibleToStudents: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="visible_chk" className="font-bold cursor-pointer text-xs text-emerald-950">
                  إظهار هذه المحاضرة للطلاب في جدول المحاضرات فوراً (Visible to Students)
                </label>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="live_chk"
                  checked={lectureForm.isLive}
                  onChange={(e) => setLectureForm({ ...lectureForm, isLive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="live_chk" className="font-bold cursor-pointer text-xs text-slate-800">
                  تصنيف المحاضرة كـ "بث مباشر تفاعلي" (Live Stream)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLectureModal(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl shadow-md transition"
                >
                  {editingLecture ? 'حفظ التعديلات' : 'إضافة المحاضرة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS MANAGER MODAL */}
      {showAddAnnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-lg text-slate-900">نشر تعميم أو إعلان جامعي جديد</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الإعلان</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: بدء التسجيل للامتحانات البديلة والتكميلية"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الجهة المصدرة للإعلان</label>
                <input
                  type="text"
                  required
                  value={annDept}
                  onChange={(e) => setAnnDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نص التعميم الجامعي</label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب تفاصيل الإعلان والتعليمات للطلاب..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl border border-red-200 text-red-900">
                <input
                  type="checkbox"
                  id="ann_urgent_chk"
                  checked={annUrgent}
                  onChange={(e) => setAnnUrgent(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="ann_urgent_chk" className="font-bold cursor-pointer text-xs">
                  تمييز الإعلان كـ "عاجل وهام" بشريط التنبيهات
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnnModal(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl shadow-md transition"
                >
                  نشر الإعلان فورياً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
