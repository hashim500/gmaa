import React, { useState, useRef } from 'react';
import {
  X,
  User as UserIcon,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  IdCard,
  ShieldCheck,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  Save,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { User } from '../types';
import { storage, PRESET_AVATARS } from '../services/storage';

interface UserProfileModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
  onOpenStudentCard?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUserUpdated,
  onOpenStudentCard,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+249 912 345 678');
  const [selectedPhoto, setSelectedPhoto] = useState(
    currentUser?.avatarUrl || currentUser?.photoUrl || PRESET_AVATARS[0].url
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync with currentUser when opening
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '+249 912 345 678');
      setSelectedPhoto(currentUser.avatarUrl || currentUser.photoUrl || PRESET_AVATARS[0].url);
      setSavedSuccess(false);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedPhoto(base64);
      setIsUploading(false);
      setShowAvatarPicker(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('حدث خطأ أثناء قراءة الصورة');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateUserProfile({
      name: name.trim() || currentUser.name,
      phone: phone.trim() || currentUser.phone,
      avatarUrl: selectedPhoto,
      photoUrl: selectedPhoto,
    });
    onUserUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const roleLabel =
    currentUser.role === 'student'
      ? 'طالب جامعي'
      : currentUser.role === 'instructor'
      ? 'عضو هيئة تدريس'
      : 'الإدارة الأكاديمية';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#c59b6d]/40 overflow-hidden my-6 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white p-6 sm:p-7 relative border-b-2 border-[#c59b6d]">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c59b6d]/20 border border-[#c59b6d]/50 flex items-center justify-center text-amber-300">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">الملف التعريفي والصورة الجامعية</h3>
                <span className="bg-[#c59b6d] text-[#0b2545] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {roleLabel}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                تحديث الصورة الرسمية وبيانات الاتصال لتظهر تلقائياً بالبطاقة الجامعية وكافة السجلات
              </p>
            </div>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* PHOTO SECTION */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#c59b6d]" /> الصورة الشخصية الرسمية (تظهر في البطاقة الجامعية)
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Preview */}
              <div className="relative group">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-slate-200 border-3 border-[#c59b6d] shadow-md flex items-center justify-center">
                  {selectedPhoto ? (
                    <img
                      src={selectedPhoto}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-2xl text-[#0b2545] bg-amber-100">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -left-2 bg-[#0b2545] text-amber-300 p-2 rounded-xl border border-amber-300/40 shadow-md hover:bg-[#133e68] transition"
                  title="رفع صورة من الجهاز"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Options */}
              <div className="space-y-2.5 text-center sm:text-right flex-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                  يمكنك رفع صورة شخصية واضحة بخلفية محايدة، أو الاختيار من النماذج المعتمدة بالكلية.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isUploading ? 'جاري التحميل...' : 'رفع صورة من جهازك'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="bg-[#0b2545]/10 hover:bg-[#0b2545]/20 text-[#0b2545] border border-[#0b2545]/20 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#0b2545]" />
                    <span>{showAvatarPicker ? 'إخفاء النماذج' : 'اختيار نموذج رسمي'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Picker Gallery */}
            {showAvatarPicker && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  اختر من النماذج الأكاديمية المصرح بها:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedPhoto(av.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition aspect-square ${
                        selectedPhoto === av.url
                          ? 'border-[#c59b6d] ring-2 ring-[#c59b6d]/50 scale-105 shadow-md'
                          : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                      {selectedPhoto === av.url && (
                        <div className="absolute inset-0 bg-[#0b2545]/40 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-amber-300" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* EDITABLE FORM */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">الاسم الكامل المعتمد</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute top-3 right-3 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c59b6d] font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">رقم الهاتف وتواصل واتساب</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute top-3 right-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full pr-9 pl-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c59b6d] font-mono text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* STATIC ACADEMIC DETAILS GRID */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">الرقم الجامعي</span>
                <span className="font-mono font-black text-slate-800 text-xs">
                  {currentUser.studentId || 'NSAC-2023-104'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">الرقم الوطني</span>
                <span className="font-mono font-bold text-slate-700 text-xs">
                  {currentUser.nationalId || '10928374652'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">الحالة الأكاديمية</span>
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {currentUser.status || 'مقيد - ساري المفعول'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">القسم والتخصص</span>
                <span className="font-bold text-slate-800 text-[11px]">
                  {currentUser.department || 'المحاسبة ونظم المعلومات'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">العام الدراسي</span>
                <span className="font-bold text-slate-700 text-[11px]">2025 / 2026م</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">المعدل التراكمي (GPA)</span>
                <span className="font-black text-amber-700 text-xs">3.88 / 4.00</span>
              </div>
            </div>

            {/* SUCCESS BANNER */}
            {savedSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم تحديث صورتك الشخصية وبيانات ملفك بنجاح! ستظهر فوراً في بطاقتك الجامعية.</span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {currentUser.role === 'student' && onOpenStudentCard && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStudentCard();
                  }}
                  className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 text-[#8a6135] border border-amber-300 px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                >
                  <IdCard className="w-4 h-4 text-amber-600" />
                  <span>معاينة البطاقة الجامعية الذكية بالصورة المحدثة</span>
                </button>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  إغلاق
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#133e68] text-white text-xs font-black rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
