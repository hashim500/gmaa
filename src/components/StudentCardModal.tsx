import React from 'react';
import {
  IdCard,
  QrCode,
  Printer,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { User } from '../types';
import { CollegeLogo } from './CollegeLogo';

interface StudentCardModalProps {
  student: User;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank', 'width=650,height=750,menubar=no,toolbar=no');
    const content = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>البطاقة الجامعية الرقمية - ${student.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
          @page { size: portrait; margin: 10mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: 'Cairo', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
          .card-wrapper {
            width: 380px;
            height: 240px;
            border-radius: 16px;
            background: linear-gradient(135deg, #0b2545 0%, #133e68 70%, #06182c 100%);
            color: #ffffff;
            padding: 16px;
            border: 2px solid #c59b6d;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(197,155,109,0.4); padding-bottom: 8px; }
          .logo-img { width: 44px; height: 44px; object-fit: contain; }
          .title-box { text-align: right; }
          .title-ar { font-size: 11px; font-weight: 900; color: #fae588; }
          .title-en { font-size: 8px; color: #e2e8f0; letter-spacing: 0.5px; }
          .body { display: flex; gap: 12px; align-items: center; margin: 8px 0; }
          .photo-box {
            width: 65px;
            height: 75px;
            border-radius: 8px;
            background: #ffffff;
            border: 1.5px solid #c59b6d;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0b2545;
            font-weight: 900;
            font-size: 20px;
          }
          .info { font-size: 9.5px; line-height: 1.5; }
          .info-name { font-size: 12px; font-weight: 900; color: #ffffff; }
          .info-id { font-family: monospace; font-size: 11px; color: #fae588; font-weight: bold; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.15); pt: 6px; font-size: 8px; }
          .barcode { font-family: monospace; letter-spacing: 2px; font-size: 9px; color: #fae588; }
        </style>
      </head>
      <body>
        <div class="card-wrapper">
          <div class="header">
            <div class="title-box">
              <div class="title-ar">كلية السودان الجديد للمحاسبة</div>
              <div class="title-en">NEW SUDAN COLLEGE OF ACCOUNTANCY</div>
            </div>
            <img src="/college_logo.jpg" class="logo-img" alt="NSCA Crest" />
          </div>

          <div class="body">
            <div class="photo-box">
              ${student.name.charAt(0)}
            </div>
            <div class="info">
              <div class="info-name">${student.name}</div>
              <div class="info-id">الرقم الجامعي: ${student.studentId || 'NSAC-2023-104'}</div>
              <div>التخصص: المحاسبة ونظم المعلومات</div>
              <div>المستوى: ${student.level || 'المستوى الثالث - بكالوريوس'}</div>
            </div>
          </div>

          <div class="footer">
            <div class="barcode">|||| | | ||||| | |||| |||</div>
            <div>صالحة للعام الأكاديمي: 2025 / 2026</div>
          </div>
        </div>
        <script>
          window.onload = function() { setTimeout(function(){ window.print(); }, 350); };
        </script>
      </body>
      </html>
    `;
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <span className="bg-amber-100 text-amber-900 border border-amber-200 px-3 py-0.5 rounded-full text-xs font-black">
            الهوية الأكاديمية الإلكترونية الموحدة
          </span>
          <h3 className="text-xl font-black text-slate-900">
            البطاقة الجامعية الرقمية الذكية للطالب
          </h3>
          <p className="text-xs text-slate-500">
            بطاقة إثبات القيد الإلكتروني المعتمدة لدخول الامتحانات واستعارة المراجع الرقمية
          </p>
        </div>

        {/* The Digital ID Card Preview */}
        <div className="relative mx-auto w-full max-w-[420px] rounded-3xl bg-gradient-to-br from-[#0b2545] via-[#133e68] to-[#06182c] text-white p-6 shadow-xl border-2 border-[#c59b6d] overflow-hidden">
          {/* Watermark in Card */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img src="/college_logo.jpg" alt="" className="w-48 h-48 object-contain" />
          </div>

          <div className="relative z-10 space-y-4">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
              <div className="text-right">
                <h4 className="font-black text-sm tracking-tight text-amber-300">
                  كلية السودان الجديد للمحاسبة
                </h4>
                <span className="text-[10px] text-slate-300 font-mono tracking-wider">
                  NEW SUDAN COLLEGE OF ACCOUNTANCY
                </span>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl p-1 border border-amber-400/40">
                <img src="/college_logo.jpg" alt="NSCA" className="w-full h-full object-contain rounded-lg" />
              </div>
            </div>

            {/* Card Body */}
            <div className="flex gap-4 items-center">
              {/* Photo Box */}
              <div className="w-20 h-24 rounded-2xl bg-white border-2 border-[#c59b6d] flex flex-col items-center justify-center text-[#0b2545] shadow-inner flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#0b2545]/10 flex items-center justify-center font-black text-lg text-[#0b2545]">
                  {student.name.charAt(0)}
                </div>
                <span className="text-[9px] font-bold text-slate-500 mt-1">طالب منتظم</span>
              </div>

              {/* Student Details */}
              <div className="space-y-1 text-xs">
                <div className="font-black text-white text-sm sm:text-base leading-tight">
                  {student.name}
                </div>
                <div className="font-mono font-bold text-amber-300 text-xs">
                  الرقم الجامعي: {student.studentId || 'NSAC-2023-104'}
                </div>
                <div className="text-[11px] text-slate-300">
                  التخصص: {student.department || 'المحاسبة ونظم المعلومات المالية'}
                </div>
                <div className="text-[10px] text-slate-400">
                  المستوى: {student.level || 'المستوى الثالث - بكالوريوس'}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <div>
                <span className="text-amber-400 font-mono text-[9px] block">
                  ||||| | |||| ||||| | |||||
                </span>
                <span>سارية حتى: سبتمبر 2026</span>
              </div>
              <div className="w-9 h-9 bg-white p-0.5 rounded-lg">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            إغلاق
          </button>
          <button
            onClick={handlePrintCard}
            className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#133e68] text-white text-xs font-black rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-amber-400" /> طباعة البطاقة الذكية
          </button>
        </div>
      </div>
    </div>
  );
};
