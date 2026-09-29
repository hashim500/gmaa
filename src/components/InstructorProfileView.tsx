import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Building,
  Edit,
  Save,
  CheckCircle2,
  Camera,
  X,
  FileText,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface InstructorProfileViewProps {
  instructor?: User;
  currentUser?: User | null;
  onClose?: () => void;
  onNavigate?: (view: string) => void;
  onInstructorUpdated?: (updatedInstructor: User) => void;
}

export const InstructorProfileView: React.FC<InstructorProfileViewProps> = ({
  instructor: initialInstructor,
  currentUser,
  onClose,
  onNavigate,
  onInstructorUpdated,
}) => {
  const fallbackInstructor: User = {
    id: 'inst-default',
    name: 'د. عثمان الطيب الزبير',
    email: 'othman.alzobair@nsac.edu.sd',
    role: 'instructor',
    department: 'نظم المعلومات المحاسبية والتجارة الإلكترونية',
    academicTitle: 'أستاذ مشارك ورئيس قسم نظم المعلومات المحاسبية',
    phone: '+249 911 223 344',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  };

  const instructor = initialInstructor || currentUser || storage.getCurrentUser() || fallbackInstructor;

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(instructor.name);
  const [phone, setPhone] = useState(instructor.phone || '+249 911 223 344');
  const [email, setEmail] = useState(instructor.email);
  const [academicTitle, setAcademicTitle] = useState(
    instructor.academicTitle || 'أستاذ مشارك في نظم المعلومات المحاسبية والتجارة الإلكترونية'
  );
  const [department, setDepartment] = useState(
    instructor.department || 'قسم نظم المعلومات المحاسبية والتجارة الإلكترونية'
  );
  const [officeLocation, setOfficeLocation] = useState(
    instructor.officeLocation || 'المبنى الأكاديمي الرئيسي - الطابق الثاني - قاعة أعضاء هيئة التدريس (مكتب 204)'
  );
  const [officeHours, setOfficeHours] = useState(
    instructor.officeHours || 'الأحد والثلاثاء: 10:00 صباحاً - 01:00 ظهراً | الخميس: 12:00 ظهراً - 02:00 ظهراً'
  );
  const [bio, setBio] = useState(
    instructor.bio ||
      'أستاذ مشارك في المحاسبة ونظم المعلومات، خبير معتمد في معايير IFRS والتحول الرقمي المالي، باحث وناشر لأكثر من 15 ورقة علمية محكمة في مجلات النشر الدولية.'
  );
  const [coursesTaught, setCoursesTaught] = useState<string[]>(
    instructor.coursesTaught || [
      'المحاسبة في بيئة التجارة الإلكترونية',
      'نظم المعلومات المحاسبية (AIS)',
      'المراجعة والتدقيق المالي الرقمي',
    ]
  );
  const [researchPapers, setResearchPapers] = useState<string[]>(
    instructor.researchPapers || [
      'أثر التجارة الإلكترونية على دقة ونزاهة القيود المحاسبية في المصارف السودانية (2025)',
      'حوكمة نظم المعلومات المحاسبية السحابية في ظل معايير الأمان السيبراني (2024)',
      'تحديات تطبيق معيار IFRS 15 في عقود الاتصالات وتكنولوجيا المعلومات (2023)',
    ]
  );
  const [memberships, setMemberships] = useState<string[]>(
    instructor.professionalMemberships || [
      'عضو جمعية المحاسبين القانونيين السودانية (SCPA)',
      'زميل الهيئة السعودية للمحاسبين والمراجعين (SOCPA)',
      'عضو جمعية المحاسبة الأمريكية (AAA)',
    ]
  );
  const [avatarUrl, setAvatarUrl] = useState(
    instructor.avatarUrl ||
      instructor.photoUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateUserProfile({
      name,
      phone,
      email,
      academicTitle,
      department,
      officeLocation,
      officeHours,
      bio,
      coursesTaught,
      researchPapers,
      professionalMemberships: memberships,
      avatarUrl,
      photoUrl: avatarUrl,
    });
    if (onInstructorUpdated) onInstructorUpdated(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden max-w-4xl mx-auto">
      {/* Faculty Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md bg-slate-800">
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            </div>
            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-xl cursor-pointer shadow-md transition">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-1 text-center sm:text-right space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-bold">
                عضو هيئة التدريس الأكاديمية (Faculty Profile)
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {instructor.status || 'أستاذ مشارك معتمد'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{name}</h2>
            <p className="text-xs text-amber-300 font-bold">{academicTitle}</p>
            <p className="text-xs text-slate-400">{department} • كلية السودان الجديد للمحاسبة</p>
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Edit className="w-4 h-4" /> تعديل الملف الأكاديمي
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition"
              >
                إلغاء التعديل
              </button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> تم تحديث الملف الأكاديمي لعضو هيئة التدريس بنجاح
        </div>
      )}

      {/* Main Profile Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل واللقب *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الدرجة واللقب الأكاديمي *</label>
                <input
                  type="text"
                  required
                  value={academicTitle}
                  onChange={(e) => setAcademicTitle(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني الجامعي *</label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف والتواصل *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">مقر المكتب الأكاديمي *</label>
                <input
                  type="text"
                  required
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  الساعات المكتبية والإرشاد الأكاديمي للطلاب *
                </label>
                <input
                  type="text"
                  required
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  السيرة العلمية والمهنية المختصرة (Biography)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" /> حفظ التعديلات الأكاديمية
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <span className="text-xs font-black text-slate-900 block mb-1">السيرة الأكاديمية والمهنية</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {bio}
              </p>
            </div>

            {/* Office & Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-blue-700" /> مقر المكتب الأكاديمي
                </span>
                <span className="text-xs font-bold text-slate-800 block">{officeLocation}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> الساعات المكتبية للطلاب
                </span>
                <span className="text-xs font-bold text-slate-800 block">{officeHours}</span>
              </div>
            </div>

            {/* Courses Taught */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-700" /> المقررات الدراسية المسندة حالياً
              </span>
              <div className="flex flex-wrap gap-2">
                {coursesTaught.map((course, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200/60"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Research Papers & Publications */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" /> الأبحاث والأوراق العلمية المنشورة
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700 font-medium">
                {researchPapers.map((paper, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {paper}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Memberships */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> الزمالات والجمعيات المهنية المعتمدة
              </span>
              <div className="flex flex-wrap gap-2">
                {memberships.map((m, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1 rounded-xl border border-amber-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
