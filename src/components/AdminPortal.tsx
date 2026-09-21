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
} from 'lucide-react';
import { User, CertificateRequest, FeePayment, Announcement, Lecture } from '../types';
import { storage } from '../services/storage';

interface AdminPortalProps {
  adminUser: User;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ adminUser }) => {
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);

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
  });

  const loadData = () => {
    setCertificates(storage.getCertificates());
    setPayments(storage.getPayments());
    setAnnouncements(storage.getAnnouncements());
    setLectures(storage.getLectures());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, []);

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
      });
    }
    setShowLectureModal(false);
  };

  const totalFeeRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-3xl font-black">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                إدارة الكلية والشؤون الأكاديمية
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{adminUser.name}</h2>
              <p className="text-xs text-slate-400">{adminUser.department} • كلية السودان الجديد للمحاسبة</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">إجمالي طلاب الكلية المقيدين</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">1,248 طالباً</span>
          <span className="text-[10px] text-emerald-600 font-bold block">+14% زيادة في القبول الإلكتروني</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">المحاضرات الإلكترونية</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{lectures.length} محاضرات</span>
          <span className="text-[10px] text-blue-600 font-semibold block">روابط يوتيوب وبث مباشر</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">طلبات الشهادات المسجلة</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{certificates.length} طلبات</span>
          <span className="text-[10px] text-slate-500 block">توثيق بالرقم التسلسلي</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">إجمالي تحصيلات الرسوم</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {(totalFeeRevenue / 1000).toFixed(0)} ألف ج.س
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block">مطابقة مباشرة مع البنوك</span>
        </div>
      </div>

      {/* LECTURES MANAGEMENT SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-700" /> إدارة المحاضرات وروابط البث الرقمي (Lectures Management)
            </h3>
            <p className="text-xs text-slate-500">
              يمكن للإدارة تعديل روابط الفيديو أو معلومات المحاضرات وحذف المحاضرات القديمة
            </p>
          </div>
          <button
            onClick={handleOpenAddLecture}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> إضافة محاضرة جديدة
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">المقرر الدراسي</th>
                <th className="p-3.5 font-bold">عنوان المحاضرة</th>
                <th className="p-3.5 font-bold">المحاضر</th>
                <th className="p-3.5 font-bold">معرّف الفيديو / الرابط</th>
                <th className="p-3.5 font-bold">المدة / الحالة</th>
                <th className="p-3.5 font-bold text-center">إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lectures.map((lec) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Requests Approvals */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" /> اعتماد وتوثيق طلبات الشهادات الأكاديمية
        </h3>
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

      {/* Add / Edit Lecture Modal */}
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

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
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

      {/* Announcements Manager Modal */}
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
