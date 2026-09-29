import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  ShieldCheck,
  Search,
  Printer,
  Copy,
  Check,
  Lock,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Sparkles,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { admissionService } from '../services/admissionService';
import { NewStudentApplication, RegistrationSettings } from '../types';
import { CollegeLogo } from './CollegeLogo';

interface NewStudentRegistrationViewProps {
  onBackToHome?: () => void;
  onGoToLogin?: () => void;
  onNavigate?: (view: string) => void;
  initialTab?: 'register' | 'track';
}

export const NewStudentRegistrationView: React.FC<NewStudentRegistrationViewProps> = ({
  onBackToHome,
  onGoToLogin,
  onNavigate,
  initialTab = 'register',
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'track'>(initialTab);
  const [settings, setSettings] = useState<RegistrationSettings>(admissionService.getSettings());

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Form State
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    idType: 'national' as 'national' | 'passport',
    idNumber: '',
    nationality: 'السودان',
    dob: '2005-01-15',
    age: 21,
    gender: 'male' as 'male' | 'female',
    residenceCountry: 'السودان',
    city: 'الخرطوم',
    email: '',
    dial: '+249',
    phone: '',
    address: '',
    level: 'bachelor' as 'diploma' | 'bachelor' | 'master' | 'doctorate',
    major: 'المحاسبة المالية',
    prevCert: 'الشهادة الثانوية السودانية',
    prevInstitution: '',
    gradeType: 'percent' as 'percent' | 'gpa4' | 'gpa5',
    gradeValue: '',
    gradYear: 2024,
  });

  // Files State with preview
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [certFileName, setCertFileName] = useState<string | null>(null);
  const [idDocPreview, setIdDocPreview] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [filesData, setFilesData] = useState<NewStudentApplication['files']>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<NewStudentApplication | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Tracking State
  const [trackRef, setTrackRef] = useState('');
  const [trackIdNumber, setTrackIdNumber] = useState('');
  const [trackedApp, setTrackedApp] = useState<NewStudentApplication | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Load settings on mount and listen to updates
  useEffect(() => {
    const handleUpdate = () => {
      setSettings(admissionService.getSettings());
    };
    window.addEventListener('nsac_registration_settings_updated', handleUpdate);
    return () => window.removeEventListener('nsac_registration_settings_updated', handleUpdate);
  }, []);

  // Calculate age automatically when DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobVal = e.target.value;
    const birthYear = new Date(dobVal).getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(16, currentYear - birthYear);
    setFormData((prev) => ({ ...prev, dob: dobVal, age: calculatedAge }));
  };

  // Handle Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhotoPreview(base64);
      setFilesData((prev) => ({
        ...prev,
        photo: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: base64,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Cert upload
  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFilesData((prev) => ({
        ...prev,
        cert: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: base64,
          pages: 2,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle ID Doc upload
  const handleIdDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setIdDocPreview(base64);
      setFilesData((prev) => ({
        ...prev,
        idDoc: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: base64,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle CV upload (for Master/Doctorate)
  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFilesData((prev) => ({
        ...prev,
        cv: {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: base64,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Registration Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.nameAr.trim() || !formData.nameEn.trim()) {
      setFormError('يرجى إدخال الاسم الرباعي كاملاً باللغتين العربية والإنجليزية.');
      return;
    }
    if (!formData.idNumber.trim()) {
      setFormError('يرجى إدخال الرقم القومي أو رقم جواز السفر بدقة.');
      return;
    }
    if (!formData.email.trim() || !formData.phone.trim()) {
      setFormError('يرجى إدخال البريد الإلكتروني ورقم الهاتف للتواصل.');
      return;
    }
    if (!formData.gradeValue) {
      setFormError('يرجى إدخال النسبة المئوية أو المعدل التراكمي للشهادة السابقة.');
      return;
    }
    if (!termsAgreed) {
      setFormError('يجب الموافقة على صحة البيانات والشروط الأكاديمية قبل إرسال الطلب.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = admissionService.createApplication(formData, filesData);
      setSubmittedApp(created);
      setIsSubmitting(false);
    }, 600);
  };

  // Handle Tracking Search
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackSearched(true);
    if (!trackRef.trim() || !trackIdNumber.trim()) {
      setTrackedApp(null);
      return;
    }
    const found = admissionService.findByRefAndId(trackRef, trackIdNumber);
    setTrackedApp(found || null);
  };

  const copyReferenceToClipboard = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Brand Header */}
      <div className="flex items-center justify-between">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </button>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> تقديم طلب التحاق جديد
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4" /> تتبع حالة الطلب السابق
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#133e68] to-[#0b2545] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border-2 border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-right flex-col md:flex-row">
            <CollegeLogo size="xl" />
            <div className="space-y-1.5">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black inline-block">
                بوابة القبول والتحاق الطلاب الجدد • العام الأكاديمي {settings.academicYear}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                عمادة القبول والتسجيل وشؤون الطلاب
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                مرحباً بكم في بوابة التقديم الإلكتروني الرسمية لكلية السودان الجديد للمحاسبة. يتيح النظام لجميع الطلاب السودانيين والدوليين تقديم طلبات الالتحاق بمختلف الدرجات العلمية وفق المعايير الأكاديمية العالمية.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION CLOSED NOTICE */}
      {!settings.isOpen && (
        <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full">
                  إشعار إداري رسمي من الكلية
                </span>
                <span className="text-xs font-bold text-slate-500">حالة التقديم: مغلق حالياً</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">باب التسجيل والقبول مغلق حالياً بأمر الإدارة</h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {settings.closedMessage}
              </p>
            </div>
          </div>

          {/* Reopen Date Countdown & Box */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-center sm:text-right">
              <Clock className="w-7 h-7 text-amber-200 flex-shrink-0" />
              <div>
                <span className="text-xs text-amber-100 font-bold block">الموعد المحدد لفتح باب التسجيل الجديد:</span>
                <span className="text-lg sm:text-xl font-black block">{settings.reopenDate}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('track')}
              className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-black text-xs transition shadow-xs whitespace-nowrap"
            >
              الاستعلام عن طلب سابق للمتقدمين
            </button>
          </div>

          {/* Contact Support */}
          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
            <span className="font-bold">للاستفسارات ومتابعة القبول:</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-semibold">
                <Mail className="w-4 h-4 text-amber-600" /> {settings.contactEmail}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <Phone className="w-4 h-4 text-amber-600" /> {settings.contactPhone}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TRACKING TAB VIEW */}
      {activeTab === 'track' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-600" /> الاستعلام وتتبع حالة طلب الالتحاق
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              أدخل الرقم المرجعي للطلب والرقم القومي أو رقم جواز السفر المسجل للاطلاع على قرار لجنة القبول وحسابك الأكاديمي
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                الرقم المرجعي للطلب (Reference No.) *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: NSCA-2026-1001"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                الرقم القومي أو رقم الجواز *
              </label>
              <input
                type="text"
                required
                placeholder="أدخل الرقم كما تم تسجيله بالطلب"
                value={trackIdNumber}
                onChange={(e) => setTrackIdNumber(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4" /> فحص حالة الطلب
              </button>
            </div>
          </form>

          {/* Tracking Search Result */}
          {trackSearched && !trackedApp && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <h4 className="text-sm font-black text-slate-900">لم يتم العثور على طلب مطابق للبيانات المدخلة</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                يرجى التأكد من صحة الرقم المرجعي (مثال: NSCA-2026-1001) ومطابقة رقم الهوية أو جواز السفر.
              </p>
            </div>
          )}

          {trackedApp && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">طلب التحاق رسمي</span>
                  <h4 className="text-lg font-black text-slate-900">{trackedApp.data.nameAr}</h4>
                  <span className="text-xs text-slate-500">{trackedApp.data.nameEn}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-500 block">الرقم المرجعي</span>
                  <span className="font-mono font-black text-amber-700 text-sm bg-amber-100/60 px-2.5 py-1 rounded-lg inline-block">
                    {trackedApp.ref}
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              {trackedApp.status === 'accepted' ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 text-base">
                        تهانينا! تم قبول طلب التحاقك بالكلية رسمياً
                      </h4>
                      <p className="text-xs text-emerald-800">
                        استوفيت كافة الشروط الأكاديمية وتم اعتماد مقعدك الدراسي في قسم{' '}
                        <strong>{trackedApp.data.major}</strong>.
                      </p>
                    </div>
                  </div>

                  {trackedApp.generatedAccount && (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-3">
                      <span className="text-xs font-black text-slate-800 block">
                        بيانات حسابك الأكاديمي للدخول على المنصة (Student Credentials):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">الرقم الجامعي (Student ID):</span>
                          <span className="font-mono font-black text-slate-900">
                            {trackedApp.generatedAccount.studentId}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">اسم المستخدم (Username):</span>
                          <span className="font-mono font-bold text-slate-900">
                            {trackedApp.generatedAccount.username}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block text-[10px]">كلمة المرور المؤقتة:</span>
                          <span className="font-mono font-black text-amber-700">
                            {trackedApp.generatedAccount.password}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        {onGoToLogin && (
                          <button
                            onClick={onGoToLogin}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4" /> الانتقال لتسجيل الدخول كطالب
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : trackedApp.status === 'rejected' ? (
                <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-black text-rose-950 text-base">نعتذر، لم يتم قبول الطلب</h4>
                      <p className="text-xs text-rose-800">
                        سبب الرفض: {trackedApp.decision?.reason || 'عدم استيفاء الحد الأدنى من شروط البرنامج.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-black text-amber-950 text-base">الطلب قيد المراجعة والتدقيق الأكاديمي</h4>
                      <p className="text-xs text-amber-800">
                        تجري أمانة الشؤون العلمية فحص المستندات المرفقة ومعادلة الشهادات. سيتم إخطاركم بالنتيجة خلال 48 ساعة عبر البريد الإلكتروني.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Applicant Details Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">الدرجة المطلوبة:</span>
                  <span className="font-bold text-slate-800">
                    {trackedApp.data.level === 'diploma'
                      ? 'دبلوم تقني'
                      : trackedApp.data.level === 'bachelor'
                      ? 'بكالوريوس'
                      : trackedApp.data.level === 'master'
                      ? 'ماجستير'
                      : 'دكتوراه'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">التخصص:</span>
                  <span className="font-bold text-slate-800">{trackedApp.data.major}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">المعدل / النسبة:</span>
                  <span className="font-bold text-slate-800">{trackedApp.data.gradeValue}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">تاريخ التقديم:</span>
                  <span className="font-bold text-slate-800">
                    {new Date(trackedApp.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* REGISTRATION FORM (When Open and in 'register' tab) */}
      {activeTab === 'register' && settings.isOpen && !submittedApp && (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          {formError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* SECTION 1: PERSONAL & DEMOGRAPHIC DATA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-base text-slate-900">
                1. البيانات الشخصية والديموغرافية (Personal & Demographic Data)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  الاسم الرباعي الكامل (باللغة العربية) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد أحمد عثمان إبراهيم"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  الاسم الرباعي الكامل (English Full Name) *
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  placeholder="e.g., Mohamed Ahmed Osman Ibrahim"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">نوع وثيقة الإثبات *</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={formData.idType === 'national'}
                      onChange={() => setFormData({ ...formData, idType: 'national' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    الرقم الوطني السوداني
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={formData.idType === 'passport'}
                      onChange={() => setFormData({ ...formData, idType: 'passport' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    جواز سفر دولي
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  رقم الوثيقة (الرقم الوطني أو رقم الجواز) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="أدخل الرقم بدقة"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">الجنسية *</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="السودان">جمهورية السودان</option>
                  <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                  <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                  <option value="مصر">جمهورية مصر العربية</option>
                  <option value="تشاد">تشاد</option>
                  <option value="إريتريا">إريتريا</option>
                  <option value="أخرى">جنسية أخرى</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">تاريخ الميلاد *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={handleDobChange}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">العمر المحسوب</label>
                  <input
                    type="text"
                    readOnly
                    value={`${formData.age} سنة`}
                    className="w-full text-xs font-black bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">النوع / الجنس *</label>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'male'}
                      onChange={() => setFormData({ ...formData, gender: 'male' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    ذكر
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'female'}
                      onChange={() => setFormData({ ...formData, gender: 'female' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    أنثى
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">بلد الإقامة الحالي *</label>
                  <input
                    type="text"
                    required
                    placeholder="السودان، السعودية، مصر..."
                    value={formData.residenceCountry}
                    onChange={(e) => setFormData({ ...formData, residenceCountry: e.target.value })}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">المدينة *</label>
                  <input
                    type="text"
                    required
                    placeholder="الخرطوم، بورتسودان، الرياض..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Mail className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-base text-slate-900">
                2. بيانات الاتصال والتواصل (Contact Information)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  البريد الإلكتروني الرسمي للطالب *
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  placeholder="example@student.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  رقم الهاتف المحمول والواتساب *
                </label>
                <div className="flex gap-2" dir="ltr">
                  <select
                    value={formData.dial}
                    onChange={(e) => setFormData({ ...formData, dial: e.target.value })}
                    className="w-24 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-center focus:bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="+249">+249 (SD)</option>
                    <option value="+966">+966 (SA)</option>
                    <option value="+971">+971 (AE)</option>
                    <option value="+20">+20 (EG)</option>
                    <option value="+974">+974 (QA)</option>
                    <option value="+1">+1 (US)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="912345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  العنوان السكني التفصيلي *
                </label>
                <input
                  type="text"
                  required
                  placeholder="اسم الحي، الشارع، رقم المبنى..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ACADEMIC DATA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-base text-slate-900">
                3. البيانات الأكاديمية والدرجة المستهدفة (Academic Application Data)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  الدرجة العلمية المُراد الالتحاق بها *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: e.target.value as 'diploma' | 'bachelor' | 'master' | 'doctorate',
                    })
                  }
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="bachelor">بكالوريوس المحاسبة (Bachelor Degree - 4 سنوات)</option>
                  <option value="diploma">دبلوم المحاسبة التقنية ونظم المعلومات (2 سنتان)</option>
                  <option value="master">ماجستير المحاسبة والتمويل (Master of Accounting)</option>
                  <option value="doctorate">دكتوراه في الفلسفة في المحاسبة (PhD)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  التخصص الأكاديمي المرغوب *
                </label>
                <select
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="المحاسبة المالية">المحاسبة المالية والمعايير الدولية (Financial Accounting & IFRS)</option>
                  <option value="نظم المعلومات المحاسبية">نظم المعلومات المحاسبية (Accounting Information Systems)</option>
                  <option value="المحاسبة الإدارية">المحاسبة الإدارية والتكاليف (Managerial Accounting)</option>
                  <option value="المراجعة والتدقيق المالي">المراجعة والتدقيق المالي (Auditing & Assurance)</option>
                  <option value="المحاسبة الضريبية وقوانين الزكاة">المحاسبة الضريبية وقوانين الزكاة (Tax & Zakat)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">الشهادة السابقة المؤهلة *</label>
                <select
                  value={formData.prevCert}
                  onChange={(e) => setFormData({ ...formData, prevCert: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="الشهادة الثانوية السودانية">الشهادة الثانوية السودانية (علمي / أدبي)</option>
                  <option value="ثانوية عامة دولية / عربية">شهادة ثانوية عامة دولية أو عربية معادلة</option>
                  <option value="دبلوم">دبلوم متوسط أو تقني</option>
                  <option value="بكالوريوس">شهادة بكالوريوس جامعية معتمدة</option>
                  <option value="ماجستير">شهادة ماجستير معتمدة</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  المؤسسة التعليمية السابقة (اسم المدرسة أو الجامعة) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مدرسة الخرطوم النموذجية / جامعة السودان..."
                  value={formData.prevInstitution}
                  onChange={(e) => setFormData({ ...formData, prevInstitution: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">نوع النتيجة *</label>
                  <select
                    value={formData.gradeType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gradeType: e.target.value as 'percent' | 'gpa4' | 'gpa5',
                      })
                    }
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 focus:bg-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="percent">نسبة مئوية (%)</option>
                    <option value="gpa4">معدل تراكمي (من 4.00)</option>
                    <option value="gpa5">معدل تراكمي (من 5.00)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">المعدل أو النسبة *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="مثال: 85.5 أو 3.75"
                    value={formData.gradeValue}
                    onChange={(e) => setFormData({ ...formData, gradeValue: e.target.value })}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">سنة التخرج *</label>
                <input
                  type="number"
                  required
                  min={1990}
                  max={2026}
                  value={formData.gradYear}
                  onChange={(e) => setFormData({ ...formData, gradYear: parseInt(e.target.value) || 2024 })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: DOCUMENT UPLOADS WITH LIVE PREVIEW */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Upload className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-base text-slate-900">
                4. رفع المستندات والمرفقات الرسمية (Required Documents & Attachments)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo 4x6 */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" /> صورة شخصية حديثة (4×6) *
                  </span>
                  <span className="text-[10px] text-slate-500">خلفية بيضاء أو رسمية</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center flex-shrink-0 relative shadow-xs">
                    {photoPreview ? (
                      <img src={photoPreview} alt="معاينة الصورة" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold text-center px-1">
                        لا توجد صورة
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" /> اختيار صورة 4×6
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-slate-500 block">
                      صيغ JPG / PNG بحجم أقل من 4 ميجابايت
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Certificate / Transcript */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> الشهادة الأكاديمية / سجل الدرجات *
                  </span>
                  <span className="text-[10px] text-slate-500">نسخة PDF أو صورة ممسوحة</span>
                </div>

                <div className="space-y-2">
                  <label className="bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition w-full shadow-xs">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>{certFileName ? certFileName : 'رفع ملف الشهادة (PDF / صورة)'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleCertUpload}
                      className="hidden"
                    />
                  </label>
                  {certFileName && (
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" /> تم إرفاق الشهادة بنجاح
                    </div>
                  )}
                </div>
              </div>

              {/* ID / Passport Document */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <IdCard className="w-4 h-4 text-emerald-600" /> صورة الرقم الوطني / جواز السفر *
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                    {idDocPreview ? (
                      <img src={idDocPreview} alt="معاينة الهوية" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold text-center">لا توجد معاينة</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" /> اختيار وثيقة الهوية
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleIdDocUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* CV for Master & Doctorate */}
              {(formData.level === 'master' || formData.level === 'doctorate') && (
                <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> السيرة الذاتية وخطاب النوايا (مطلوب للدراسات العليا)
                    </span>
                  </div>

                  <label className="bg-white border border-purple-300 text-purple-900 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition w-full shadow-xs">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span>{cvFileName ? cvFileName : 'رفع السيرة الذاتية (CV - PDF)'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: PLEDGE & SUBMISSION */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                أقر أنا المتقدم المذكور أعلاه بصحة ودقة كافة البيانات والمستندات المرفقة بطلب الالتحاق بكلية السودان الجديد للمحاسبة، وألتزم بتقديم الأصول الرسمية عند المطالبة بها، مع علمي بأن أي بيانات غير صحيحة تلغي قبولي نهائياً.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-500 font-semibold">
                * جميع الحقول المؤشر عليها مطلوبة لضمان معالجة الطلب في لجنة القبول
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black text-sm px-8 py-3.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" /> جاري إرسال الطلب واعتماد الرقم المرجعي...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> إرسال طلب الالتحاق واعتماد الرقم المرجعي
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* APPLICATION SUBMISSION CONFIRMATION RECEIPT */}
      {submittedApp && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-emerald-500 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full inline-block">
              تم استلام طلب الالتحاق بنجاح
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              إشعار استلام طلب القبول الأكاديمي الرسمي
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              تم تسجيل بياناتك بنجاح في قاعدة بيانات الطلاب المتقدمين لكلية السودان الجديد للمحاسبة. يرجى الاحتفاظ بالرقم المرجعي لمتابعة حالة القبول.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-400 font-bold block">الرقم المرجعي المعتمد للطلب (Reference ID)</span>
              <span className="font-mono text-2xl font-black tracking-wider text-white">
                {submittedApp.ref}
              </span>
            </div>
            <button
              onClick={() => copyReferenceToClipboard(submittedApp.ref)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedRef ? 'تم النسخ' : 'نسخ الرقم المرجعي'}
            </button>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">اسم المتقدم:</span>
              <span className="font-bold text-slate-900">{submittedApp.data.nameAr}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">الدرجة والتخصص:</span>
              <span className="font-bold text-slate-900">{submittedApp.data.major}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">البريد الإلكتروني:</span>
              <span className="font-bold text-slate-900">{submittedApp.data.email}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">حالة الطلب:</span>
              <span className="font-bold text-amber-700">قيد المراجعة والتدقيق</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> طباعة إيصال التقديم
            </button>
            <button
              onClick={() => {
                setSubmittedApp(null);
                setActiveTab('track');
                setTrackRef(submittedApp.ref);
                setTrackIdNumber(submittedApp.data.idNumber);
              }}
              className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" /> الانتقال لشاشة تتبع الطلب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
