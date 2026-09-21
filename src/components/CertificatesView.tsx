import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  FileCheck,
  Printer,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode,
  Download,
  AlertCircle,
  FileText,
  Building,
} from 'lucide-react';
import { CertificateRequest, User } from '../types';
import { storage } from '../services/storage';
import { CollegeLogo } from './CollegeLogo';
import { printCertificateDocument } from '../utils/printUtils';

interface CertificatesViewProps {
  currentUser: User | null;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ currentUser }) => {
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [studentName, setStudentName] = useState(currentUser?.name || 'محمد أحمد عثمان إدريس');
  const [studentId, setStudentId] = useState(currentUser?.studentId || 'NSAC-2023-104');
  const [certType, setCertType] = useState('كشف درجات معتمد (النتيجة الرقمية)');
  const [deliveryMethod, setDeliveryMethod] = useState<'digital' | 'in_person'>('digital');
  const [notes, setNotes] = useState('');
  const [requestedCert, setRequestedCert] = useState<CertificateRequest | null>(null);

  // Selected certificate for official document print/view modal
  const [viewingCertificate, setViewingCertificate] = useState<CertificateRequest | null>(null);

  const loadData = () => {
    setCertificates(storage.getCertificates());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, []);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert = storage.addCertificateRequest({
      studentName,
      studentId,
      certType,
      deliveryMethod,
      notes,
    });
    setRequestedCert(newCert);
    setViewingCertificate(newCert);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <CollegeLogo size="xl" />
        </div>
        <span className="bg-amber-100 text-amber-900 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-black">
          أمانة الشؤون العلمية والمسجل العام
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          خدمة إصدار وتوثيق الشهادات والإفادات الأكاديمية
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          يمكن لطلاب وخريجي "كلية السودان الجديد للمحاسبة" تقديم طلبات استخراج الشهادات المعتمدة، كشوفات الدرجات، وإفادات القيد والمطابقة الإلكترونية بالرقم التسلسلي الموثق.
        </p>
      </div>

      {/* Main Request Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-amber-600" /> تقديم طلب استخراج وثيقة رسمية
        </h3>

        <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                الاسم الرباعي للطالب (كما هو مدون في السجل المدني)
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أدخل اسمك الرباعي الكامل"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                الرقم الجامعي الأكاديمي
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="NSAC-2023-104"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                نوع الشهادة أو الوثيقة المطلوبة
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="كشف درجات معتمد (النتيجة الرقمية)">كشف درجات معتمد (النتيجة الرقمية)</option>
                <option value="إفادة تخرج باللغة العربية والإنجليزية">إفادة تخرج باللغة العربية والإنجليزية</option>
                <option value="شهادة بكالوريوس المحاسبة الإلكترونية">شهادة بكالوريوس المحاسبة الإلكترونية</option>
                <option value="إفادة قيد واستمرارية دراسة (للسفر والمنح)">إفادة قيد واستمرارية دراسة (للسفر والمنح)</option>
                <option value="شهادة حسن سير وسلوك وتزكية أكاديمية">شهادة حسن سير وسلوك وتزكية أكاديمية</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                طريقة استلام الوثيقة
              </label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value as 'digital' | 'in_person')}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="digital">نسخة رقمية رسمية موثقة (PDF بختم الكلية المشفر وكود QR)</option>
                <option value="in_person">استلام ورقي معتمد بختم أمانة الشؤون العلمية (مقر الكلية)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              ملاحظات إضافية أو الجهة الموجه إليها المستند
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يرجى التوجيه إلى إدارة التدريب ببنك الخرطوم أو السفارة..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>إرسال طلب الشهادة وإصدار وثيقة الاستعراض الفورية</span>
          </button>
        </form>
      </div>

      {/* Submitted Requests List & Verification */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" /> سجل الطلبات والشهادات الأكاديمية المصدرة
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">اسم الطالب</th>
                <th className="p-3.5 font-bold">الرقم الجامعي</th>
                <th className="p-3.5 font-bold">نوع الشهادة</th>
                <th className="p-3.5 font-bold">الرقم التسلسلي المعتمد</th>
                <th className="p-3.5 font-bold">حالة الاعتماد</th>
                <th className="p-3.5 font-bold text-center">الشهادة الرسمية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certificates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-900">{c.studentName}</td>
                  <td className="p-3.5 font-mono text-blue-800 font-semibold">{c.studentId}</td>
                  <td className="p-3.5 font-medium text-slate-700">{c.certType}</td>
                  <td className="p-3.5 font-mono text-xs text-amber-700 font-bold">{c.serialNumber}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> معتمد رسمياً
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setViewingCertificate(c)}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs inline-flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> استعراض وطباعة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL CERTIFICATE PREVIEW MODAL */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-300/80 relative text-slate-900 space-y-6 my-6">
            {/* Action Bar (Not printed) */}
            <div className="no-print flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-slate-500">
                معاينة الوثيقة الأكاديمية الرسمية المعتمدة
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printCertificateDocument(viewingCertificate)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> فتح نافذة الطباعة الرسمية
                </button>
                <button
                  onClick={() => setViewingCertificate(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* CERTIFICATE PRINTABLE CANVAS */}
            <div className="printable-area relative border-4 border-double border-amber-600/60 p-6 sm:p-10 rounded-2xl bg-amber-50/20 text-center space-y-6 overflow-hidden">
              {/* Watermark in Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <CollegeLogo size="2xl" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-800/20 pb-4">
                <div className="text-right text-[11px] font-bold text-slate-700 space-y-0.5">
                  <p>جمهورية السودان</p>
                  <p>وزارة التعليم العالي والبحث العلمي</p>
                  <p className="text-blue-900 font-black text-xs">كلية السودان الجديد للمحاسبة</p>
                </div>
                <CollegeLogo size="lg" />
                <div className="text-left text-[11px] font-bold text-slate-700 space-y-0.5 dir-ltr font-sans">
                  <p>Republic of the Sudan</p>
                  <p>Ministry of Higher Education</p>
                  <p className="text-blue-900 font-black text-xs">New Sudan College</p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {viewingCertificate.certType}
                </h3>
                <p className="text-xs font-mono font-bold text-amber-800">
                  الرقم التسلسلي الرسمي: {viewingCertificate.serialNumber}
                </p>
              </div>

              {/* Body Text */}
              <div className="max-w-xl mx-auto text-xs sm:text-sm text-slate-800 leading-loose text-justify font-medium">
                تشهد أمانة الشؤون العلمية والمسجل العام بكلية السودان الجديد للمحاسبة بأن الطالب:
                <div className="text-center my-2 text-base sm:text-xl font-black text-blue-900 bg-white/70 py-1.5 px-4 rounded-xl border border-amber-200">
                  {viewingCertificate.studentName}
                </div>
                والحامل للرقم الجامعي <span className="font-mono font-bold text-blue-800">({viewingCertificate.studentId})</span>، مقيد رسمياً في برنامج{' '}
                <strong>بكالوريوس المحاسبة الإلكترونية ونظم المعلومات المالية</strong>، وقد أتم جميع المتطلبات الأكاديمية المقررة بمعدل تراكمي ممتاز{' '}
                <span className="font-bold text-emerald-800">({viewingCertificate.gpa || '3.82 من 4.00'})</span>.
                <p className="mt-2 text-[11px] text-slate-600 text-center">
                  أُعطيت له هذه الإفادة الرسمية بناءً على طلبه لتقديمها إلى الجهات المختصة والمعنية.
                </p>
              </div>

              {/* Footer Signatures, Stamps and QR */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-xs font-bold text-slate-800">
                {/* QR Code Verification */}
                <div className="text-right flex flex-col items-start gap-1">
                  <div className="w-16 h-16 bg-white p-1 border border-slate-300 rounded-lg shadow-2xs flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">التحقق: verify.nsac.edu.sd</span>
                </div>

                {/* College Academic Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-600/80 flex items-center justify-center bg-amber-100/40 text-amber-900 text-[10px] font-black transform -rotate-12 shadow-xs">
                    ختم الاعتماد الأكاديمي
                  </div>
                  <span className="text-[10px] text-slate-600 mt-1">تاريخ الاعتماد: {viewingCertificate.requestedAt}</span>
                </div>

                {/* Dean Signature */}
                <div className="text-left space-y-1">
                  <p className="font-black text-slate-900">عميد الكلية</p>
                  <p className="text-[11px] text-blue-900 font-bold">أ. د. الصادق الطيب البدوي</p>
                  <div className="text-amber-800 font-serif italic text-base">Al-Sadiq Al-Tayeb</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
