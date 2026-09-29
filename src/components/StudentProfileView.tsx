import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  IdCard,
  Edit,
  Save,
  CheckCircle2,
  Camera,
  X,
  Building,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface StudentProfileViewProps {
  user?: User;
  currentUser?: User | null;
  onClose?: () => void;
  onNavigate?: (view: string) => void;
  onOpenIdCard?: () => void;
  onUserUpdated?: (updatedUser: User) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  user: initialUser,
  currentUser,
  onClose,
  onNavigate,
  onOpenIdCard,
  onUserUpdated,
}) => {
  const fallbackUser: User = {
    id: 'std-default',
    name: 'محمد عبد الله النور',
    email: 'mohammed.alnoor@nsac.edu.sd',
    role: 'student',
    studentId: 'NSCA-2026-4409',
    department: 'المحاسبة والتمويل والمصارف',
    level: 'المستوى الثالث - بكالوريوس',
    phone: '+249 912 345 678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    nationalId: '10293847561',
    gpa: '3.88',
    academicYear: '2026/2027',
  };

  const user = initialUser || currentUser || storage.getCurrentUser() || fallbackUser;

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '+249 912 345 678');
  const [bio, setBio] = useState(
    user.bio ||
      'طالب محاسبة مجتهد مهتم بأنظمة تخطيط الموارد (ERP)، والمراجعة الرقمية والمعايير الدولية للتقارير المالية IFRS.'
  );
  const [skills, setSkills] = useState(
    user.skills || 'تحليل مالي، إكسل مالي متقدم، معايير IFRS، QuickBooks، تدقيق الحسابات'
  );
  const [coursesCompleted, setCoursesCompleted] = useState(
    user.coursesCompleted || 'أصول المحاسبة 1 و2، التكاليف، مبادئ الإدارة المالية، القانون التجاري'
  );
  const [projects, setProjects] = useState(
    user.projects ||
      'مشروع دراسة تطبيق المعيار IFRS 16 على البنوك التجارية السودانية، نموذج تحليل التدفقات النقدية بالاكسل'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatarUrl ||
      user.photoUrl ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
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
      bio,
      skills,
      coursesCompleted,
      projects,
      avatarUrl,
      photoUrl: avatarUrl,
    });
    if (onUserUpdated) onUserUpdated(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white p-6 sm:p-8 relative">
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
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md bg-slate-800">
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
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-0.5 rounded-full text-xs font-bold">
                ملف الطالب الأكاديمي (Student Profile)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {user.status || 'طالب مقيد'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{name}</h2>
            <p className="text-xs text-slate-300">
              {user.department} • {user.level || 'بكالوريوس المحاسبة'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-300 font-mono">
              <span>الرقم الجامعي: <strong>{user.studentId}</strong></span>
              <span>المعدل التراكمي (GPA): <strong className="text-amber-300">{user.gpa || '3.88'}</strong></span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Edit className="w-4 h-4" /> تعديل الملف
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                إلغاء التعديل
              </button>
            )}

            {onOpenIdCard && (
              <button
                onClick={onOpenIdCard}
                className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <IdCard className="w-4 h-4" /> عرض البطاقة الجامعية
              </button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> تم حفظ بيانات الملف الشخصي بنجاح
        </div>
      )}

      {/* Main Profile Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  النبذة التعريفية الأكاديمية (Bio)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  المهارات المحاسبية والتقنية (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  المقررات والشهادات المكتملة
                </label>
                <input
                  type="text"
                  value={coursesCompleted}
                  onChange={(e) => setCoursesCompleted(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  المشاريع وحالات التدريب العملية
                </label>
                <textarea
                  rows={2}
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
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
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" /> حفظ التعديلات
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <span className="text-xs font-black text-slate-900 block mb-1">نبذة عن الطالب</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {bio}
              </p>
            </div>

            {/* Academic Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold block">البريد الإلكتروني الجامعي</span>
                <span className="text-xs font-bold text-slate-800 block mt-1">{user.email}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold block">رقم الهاتف</span>
                <span className="text-xs font-bold text-slate-800 block mt-1" dir="ltr">{phone}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold block">فصيلة الدم</span>
                <span className="text-xs font-bold text-slate-800 block mt-1">{user.bloodGroup || 'O+'}</span>
              </div>
            </div>

            {/* Skills & Courses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-2">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> المهارات المحاسبية المكتسبة
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.split('،').map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-200/60"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-2">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" /> المقررات والمساقات المنجزة
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{coursesCompleted}</p>
              </div>
            </div>

            {/* Practical Projects */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-1.5">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" /> الأنشطة والمشاريع الأكاديمية التطبيقية
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{projects}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
