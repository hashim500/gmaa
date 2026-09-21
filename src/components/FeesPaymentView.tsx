import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Receipt,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Download,
  Printer,
  Smartphone,
  Copy,
} from 'lucide-react';
import { User, FeePayment } from '../types';
import { storage } from '../services/storage';
import { CollegeLogo } from './CollegeLogo';
import { printInvoiceDocument } from '../utils/printUtils';

interface FeesPaymentViewProps {
  currentUser: User | null;
}

export const FeesPaymentView: React.FC<FeesPaymentViewProps> = ({ currentUser }) => {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [studentId, setStudentId] = useState(currentUser?.studentId || 'NSAC-2023-104');
  const [studentName, setStudentName] = useState(currentUser?.name || 'محمد أحمد عثمان إدريس');
  const [amount, setAmount] = useState<number>(185000);
  const [term, setTerm] = useState('الفصل الدراسي الثاني 2026');
  const [paymentMethod, setPaymentMethod] = useState<'bankak' | 'fawry' | 'onb' | 'card'>('bankak');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<FeePayment | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const loadData = () => {
    setPayments(storage.getPayments());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('nsac_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('nsac_storage_updated', handleStorageUpdate);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber) {
      alert('يرجى إدخال رقم المعاملة المرجعي للتحويل المصرفي');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const payment = storage.addPayment({
        studentId,
        studentName,
        amount: Number(amount),
        term,
        paymentMethod,
        referenceNumber,
        notes: notes || 'تم سداد الرسوم الأكاديمية بنجاح عبر بوابة التحويل المصرفي الإلكتروني.',
        status: 'verified',
      });
      setIsProcessing(false);
      setLastReceipt(payment);
      setReferenceNumber('');
    }, 800);
  };

  const totalRequiredFees = 185000;
  const totalPaid = payments
    .filter((p) => p.studentId === studentId && p.status === 'verified')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const remainingFees = Math.max(0, totalRequiredFees - totalPaid);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-black">
          الإدارة المالية والمصرفية
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          بوابة سداد الرسوم الدراسية والتسجيل الأكاديمي
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          سدد رسومك الأكاديمية إلكترونياً وبأمان تام عبر تطبيقات البنوك السودانية المعتمدة مع التحديث الفوري لحالة القيد وسجل الطالب.
        </p>
      </div>

      {/* Financial Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs text-amber-300 font-bold">الحساب الأكاديمي للطالب</span>
            <h3 className="text-lg font-black">{studentName}</h3>
            <p className="text-xs text-slate-300 font-mono">{studentId}</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
            <span className="text-xs text-slate-300 block">إجمالي الرسوم المقررة (الفصل الثاني)</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block">
              {totalRequiredFees.toLocaleString()} ج.س
            </span>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
            <span className="text-xs text-slate-300 block">حالة السداد الحالية</span>
            {remainingFees === 0 ? (
              <span className="text-lg sm:text-xl font-black text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> مسدد بالكامل
              </span>
            ) : (
              <span className="text-lg sm:text-xl font-black text-amber-400 mt-1 block">
                متبقي: {remainingFees.toLocaleString()} ج.س
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Official College Bank Accounts Information */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-700" /> الحسابات المصرفية الرسمية لكلية السودان الجديد للمحاسبة
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Bank of Khartoum */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-900">بنك الخرطوم (Bankak)</span>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">بنكك</span>
            </div>
            <p className="font-mono text-sm font-black text-slate-900">1948201</p>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-slate-500">اسم الحساب: كلية السودان الجديد</span>
              <button
                onClick={() => handleCopy('1948201', 'bok')}
                className="text-blue-700 font-bold flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3 h-3" /> {copiedAccount === 'bok' ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>

          {/* Fawry (Faisal Islamic Bank) */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-900">بنك فيصل الإسلامي (فوري)</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">Fawry</span>
            </div>
            <p className="font-mono text-sm font-black text-slate-900">084210984</p>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-slate-500">اسم الحساب: كلية السودان الجديد</span>
              <button
                onClick={() => handleCopy('084210984', 'fawry')}
                className="text-amber-800 font-bold flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3 h-3" /> {copiedAccount === 'fawry' ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>

          {/* Omdurman National Bank */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-900">بنك أمدرمان الوطني</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">ONB</span>
            </div>
            <p className="font-mono text-sm font-black text-slate-900">33948120</p>
            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-slate-500">اسم الحساب: كلية السودان الجديد</span>
              <button
                onClick={() => handleCopy('33948120', 'onb')}
                className="text-emerald-800 font-bold flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3 h-3" /> {copiedAccount === 'onb' ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Simulation Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-5 h-5 text-emerald-600" /> نموذج تأكيد وسداد الرسوم الدراسية
        </h3>

        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">الرقم الجامعي للطالب</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">اسم الطالب</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">المبلغ المراد سداده (ج.س)</label>
              <input
                type="number"
                required
                min="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">اختر وسيلة الدفع البنكي</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <label
                onClick={() => setPaymentMethod('bankak')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition ${
                  paymentMethod === 'bankak'
                    ? 'bg-blue-50 border-blue-600 font-bold text-blue-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <span className="block text-xs">تطبيق بنكك (BOK)</span>
                  <span className="text-[10px] text-slate-500">تحويل فوري</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('fawry')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition ${
                  paymentMethod === 'fawry'
                    ? 'bg-amber-50 border-amber-600 font-bold text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="block text-xs">تطبيق فوري (Fawry)</span>
                  <span className="text-[10px] text-slate-500">بنك فيصل</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('onb')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition ${
                  paymentMethod === 'onb'
                    ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="block text-xs">بنك أمدرمان الوطني</span>
                  <span className="text-[10px] text-slate-500">أوكاش</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition ${
                  paymentMethod === 'card'
                    ? 'bg-purple-50 border-purple-600 font-bold text-purple-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div>
                  <span className="block text-xs">بطاقة الصراف الآلي</span>
                  <span className="text-[10px] text-slate-500">شبكة EBS</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                رقم إشعار التحويل / الرقم المرجعي (Transaction Reference ID)
              </label>
              <input
                type="text"
                required
                placeholder="مثال: BOK-98412039 أو 884729103"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 text-left dir-ltr"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                ملاحظات التحويل أو الفرع
              </label>
              <input
                type="text"
                placeholder="سداد القسط الثاني أو رسوم التسجيل..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>تأكيد السداد واستخراج سند القبض المالي الفوري</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Receipts History */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-700" /> سجل سندات القبض والمدفوعات المعتمدة
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">رقم السند</th>
                <th className="p-3.5 font-bold">المبلغ المسدد</th>
                <th className="p-3.5 font-bold">طريقة الدفع</th>
                <th className="p-3.5 font-bold">الرقم المرجعي</th>
                <th className="p-3.5 font-bold">تاريخ السداد</th>
                <th className="p-3.5 font-bold">الحالة</th>
                <th className="p-3.5 font-bold text-center">سند القبض</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-mono font-bold text-blue-900">{p.receiptNumber}</td>
                  <td className="p-3.5 font-black text-emerald-700 text-sm">
                    {p.amount.toLocaleString()} ج.س
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {p.paymentMethod === 'bankak'
                      ? 'بنك الخرطوم (بنكك)'
                      : p.paymentMethod === 'fawry'
                      ? 'تطبيق فوري'
                      : p.paymentMethod === 'onb'
                      ? 'بنك أمدرمان الوطني'
                      : 'بطاقة مصرفية'}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{p.referenceNumber}</td>
                  <td className="p-3.5 text-slate-500">{p.date}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> معتمد ومطابق
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setLastReceipt(p)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1 rounded-xl transition"
                    >
                      عرض السند
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL PAYMENT RECEIPT VOUCHER MODAL */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900 space-y-6 my-6">
            <div className="no-print flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">سند قبض مالي إلكتروني معتمد</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printInvoiceDocument(lastReceipt)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> فتح نافذة الطباعة
                </button>
                <button
                  onClick={() => setLastReceipt(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* RECEIPT BODY */}
            <div className="printable-area border-2 border-slate-800 p-6 rounded-2xl space-y-4 bg-slate-50/50">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="text-right space-y-0.5">
                  <h4 className="font-black text-sm text-slate-900">كلية السودان الجديد للمحاسبة</h4>
                  <p className="text-[11px] text-slate-500">الإدارة المالية والحسابات العامة</p>
                </div>
                <CollegeLogo size="sm" />
              </div>

              <div className="text-center py-1">
                <span className="bg-emerald-100 text-emerald-900 px-4 py-1 rounded-full text-xs font-black">
                  إيصال سداد رسوم دراسية إلكتروني
                </span>
                <p className="font-mono text-xs font-bold text-slate-600 mt-1">
                  رقم الإيصال: {lastReceipt.receiptNumber}
                </p>
              </div>

              <div className="space-y-2 text-xs border-y border-slate-200 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">اسم الطالب:</span>
                  <span className="font-black text-slate-900">{lastReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الرقم الجامعي:</span>
                  <span className="font-mono font-bold text-slate-900">{lastReceipt.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المبلغ المدفوع:</span>
                  <span className="font-black text-emerald-800 text-sm">
                    {lastReceipt.amount.toLocaleString()} ج.س
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">وسيلة التحويل:</span>
                  <span className="font-bold text-slate-800">
                    {lastReceipt.paymentMethod === 'bankak'
                      ? 'بنك الخرطوم (بنكك)'
                      : lastReceipt.paymentMethod === 'fawry'
                      ? 'تطبيق فوري'
                      : 'تحويل بنكي'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الرقم المرجعي للبنك:</span>
                  <span className="font-mono font-bold text-blue-900">{lastReceipt.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">تاريخ السداد:</span>
                  <span className="font-bold text-slate-700">{lastReceipt.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> معتمد رسمياً بنظام الكلية
                </span>
                <span>توقيع الإدارة المالية: أ. ياسر البشير</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
