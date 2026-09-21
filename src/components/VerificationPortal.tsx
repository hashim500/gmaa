import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  QrCode,
  Printer,
  Calendar,
  Award,
  Hash,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { DEFAULT_VERIFICATION_RECORDS } from '../data/academicData';
import { DocumentVerificationRecord } from '../types';

export const VerificationPortal: React.FC = () => {
  const [searchSerial, setSearchSerial] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<DocumentVerificationRecord | null>(null);

  const handleVerify = (serialToSearch?: string) => {
    const query = (serialToSearch || searchSerial).trim().toUpperCase();
    if (!query) return;

    setSearched(true);
    const found = DEFAULT_VERIFICATION_RECORDS.find(
      (r) => r.serialNumber.toUpperCase() === query || r.studentId.toUpperCase() === query
    );
    setResult(found || null);
  };

  const handleSelectSample = (serial: string) => {
    setSearchSerial(serial);
    handleVerify(serial);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header with College Emblem */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <CollegeLogo size="xl" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-black">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          البوابة الوطنية الموحدة للتحقق من الشهادات والوثائق الأكاديمية
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          التحقق الإلكتروني الفوري من صحة وثائق الكلية
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          تتيح هذه الخدمة للوزارات، السفارات، أرباب العمل والمؤسسات التعليمية التحقق المباشر من مصداقية وصحة الشهادات وكشوفات الدرجات الصادرة عن كلية السودان الجديد للمحاسبة (NSCA).
        </p>
      </div>

      {/* Verification Search Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-black text-slate-800">
          أدخل الرقم التسلسلي المرجعي للوثيقة (المطبوع أسفل الوثيقة أو في الباركود):
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="مثال: NSCA-2024-8842 أو NSAC-2023-104"
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pr-11 pl-4 py-3.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition"
            />
          </div>
          <button
            onClick={() => handleVerify()}
            className="bg-[#0b2545] hover:bg-[#133e68] text-white font-black text-xs px-8 py-3.5 rounded-2xl transition shadow-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            التحقق من الوثيقة الآن
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">أرقام تسلسلية تجريبية للاختبار:</span>
          {DEFAULT_VERIFICATION_RECORDS.map((rec) => (
            <button
              key={rec.serialNumber}
              onClick={() => handleSelectSample(rec.serialNumber)}
              className="bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-slate-700 transition"
            >
              {rec.serialNumber} ({rec.documentType.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Display */}
      {searched && (
        <div>
          {result ? (
            <div className="bg-white rounded-3xl border-2 border-emerald-500/80 shadow-md p-6 sm:p-8 space-y-6 overflow-hidden relative">
              {/* Top Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-950 text-base">
                      وثيقة رسمية صحيحة ومعتمدة ومسجلة في قواعد بيانات الكلية
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      مطابقة لسجلات وزارة التعليم العالي والبحث العلمي - جمهورية السودان
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> معتمد رسمياً
                </span>
              </div>

              {/* Document Details Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h5 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600" /> بيانات صاحب الوثيقة
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">اسم الطالب الرباعي:</span>
                      <span className="font-black text-slate-900 text-sm">{result.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الرقم الجامعي:</span>
                      <span className="font-mono font-bold text-blue-900">{result.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الرقم الوطني السوداني:</span>
                      <span className="font-mono font-bold text-slate-800">{result.nationalId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الكلية والتخصص:</span>
                      <span className="font-bold text-slate-800">{result.faculty}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h5 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" /> بيانات التوثيق والاعتماد
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">نوع الوثيقة الصادرة:</span>
                      <span className="font-black text-slate-900">{result.documentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الرقم المرجعي:</span>
                      <span className="font-mono font-bold text-amber-800">{result.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">تاريخ الإصدار والتوثيق:</span>
                      <span className="font-bold text-slate-800">{result.issueDate}</span>
                    </div>
                    {result.gpa && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">المعدل التراكمي:</span>
                        <span className="font-black text-emerald-800">{result.gpa}</span>
                      </div>
                    )}
                    {result.honors && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">التقدير / المرتبة:</span>
                        <span className="font-bold text-amber-700">{result.honors}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">جهة الإصدار الرسمية:</span>
                      <span className="font-bold text-slate-700">{result.issuedBy}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof and Print Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span>البصمة الرقمية: {result.qrHash}</span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> طباعة تقرير التحقق المعتمد
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 sm:p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <XCircle className="w-7 h-7" />
              </div>
              <h4 className="font-black text-red-900 text-base">
                لم يتم العثور على أي وثيقة مسجلة بهذا الرقم التسلسلي ({searchSerial})
              </h4>
              <p className="text-xs text-red-700 max-w-lg mx-auto">
                يرجى التأكد من كتابة الرقم التسلسلي بدقة بدون فواصل إضافية، أو مراجعة أمانة الشؤون العلمية والمسجل العام للتأكد من حالة القيد والشهادة.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Additional Security & Accreditation Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Building className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">اعتماد وزارة التعليم العالي</h4>
          <p className="text-slate-600 leading-relaxed">
            جميع المؤهلات الأكاديمية والدرجات العلمية معتمدة ومرخصة رسمياً من الإدارة العامة للتعليم العالي الأهلي والأجنبي في السودان.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <QrCode className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">التوثيق بالبصمة الرقمية</h4>
          <p className="text-slate-600 leading-relaxed">
            تتضمن كل وثيقة صادرة رمز استجابة سريعة (QR) مشفراً يرتبط مباشرة بالسجل الأكاديمي الرقمي غير القابل للتعديل لمنع التزوير.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">الاعتراف المهني والدولي</h4>
          <p className="text-slate-600 leading-relaxed">
            مخرجات الكلية تؤهل الخريجين للقيد الفوري بجمعية المحاسبين القانونيين السودانية (SOCPA) والحصول على إعفاءات في شهادات ACCA وCPA الدولية.
          </p>
        </div>
      </div>
    </div>
  );
};
