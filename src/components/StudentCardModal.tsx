import React, { useState, useEffect } from 'react';
import { X, Printer, ShieldCheck, Check, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { User } from '../types';

interface StudentCardModalProps {
  student: User;
  onClose: () => void;
  onOpenProfile?: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  const [name, setName] = useState(student.name || 'محمد أحمد عثمان إدريس');
  const [studentId, setStudentId] = useState(student.studentId || 'NSAC-2023-104');
  const [major, setMajor] = useState(student.department || 'المحاسبة الإلكترونية ونظم المعلومات');
  const [level, setLevel] = useState(student.level || 'الثالث - بكالوريوس');
  const [year, setYear] = useState('2025 / 2026');
  const [exp, setExp] = useState('30/09/2026');
  const [photo, setPhoto] = useState(
    student.avatarUrl ||
      student.photoUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  );

  const [showPrintConfirm, setShowPrintConfirm] = useState(false);

  // Dynamic QR Code encoded data
  const qrDataText = `كلية السودان الجديد للمحاسبة\nالرقم الجامعي: ${studentId}\nالاسم: ${name}\nالتخصص: ${major}\nالمستوى: ${level}\nالعام الأكاديمي: ${year}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrDataText
  )}`;

  const handlePrint = () => {
    setShowPrintConfirm(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <style>{`
        :root {
          --primary: #0f2b4c;
          --secondary: #1a3c66;
          --gold: #d4af37;
          --light-gold: #f4e9c9;
        }

        .nsca-id-card {
          width: 85.6mm;
          height: 53.98mm;
          background: white;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
          direction: rtl;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
          padding: 3mm;
          box-sizing: border-box;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .art-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 0;
          pointer-events: none;
        }
        .wave-top {
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, #f4e9c9 0%, transparent 70%);
          opacity: 0.7;
        }
        .wave-bottom {
          position: absolute;
          bottom: -60px; left: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, #f4e9c9 0%, transparent 70%);
          opacity: 0.7;
        }
        .side-accent-front {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 6px;
          background: linear-gradient(to bottom, #0f2b4c, #d4af37);
        }
        .side-accent-back {
          position: absolute;
          right: 0; left: auto; top: 0; bottom: 0;
          width: 6px;
          background: linear-gradient(to bottom, #0f2b4c, #d4af37);
        }

        .watermark-img {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          width: 55%;
          opacity: 0.06;
          z-index: 0;
          pointer-events: none;
        }

        .card-content-box {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-header-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #d4af37;
          padding-bottom: 4px;
        }
        .logo-sm-box { width: 35px; height: 35px; object-fit: contain; }
        .uni-titles-box h1 { margin: 0; font-size: 8pt; color: #0f2b4c; font-weight: 800; line-height: 1.2; }
        .uni-titles-box p { margin: 0; font-size: 4.5pt; color: #666; letter-spacing: 0.5px; }

        .card-body-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-grow: 1;
        }
        .student-info-box { text-align: right; color: #0f2b4c; }
        .s-name-box { font-size: 9.5pt; font-weight: 800; margin-bottom: 2px; color: #000; }
        .s-detail-box { font-size: 6pt; margin-bottom: 1px; line-height: 1.3; }
        .lbl-box { color: #64748b; font-weight: 400; }
        .val-box { color: #000; font-weight: 700; }

        .photo-frame-box {
          width: 58px; height: 72px;
          border: 2px solid #d4af37;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .photo-frame-box img { width: 100%; height: 100%; object-fit: cover; }

        .card-footer-box {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 1px;
        }
        .dates-box { font-size: 5.5pt; color: #444; line-height: 1.4; }

        .qr-box-inner {
          width: 44px;
          height: 44px;
          background: white;
          padding: 2px;
          border: 1px solid #eee;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .qr-box-inner img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
        }

        .back-content-box {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
          position: relative;
          z-index: 2;
        }
        .back-logo-img { width: 45px; height: 45px; object-fit: contain; margin: 0 auto 6px; opacity: 0.85; }
        .back-title-txt { font-size: 8.5pt; color: #0f2b4c; font-weight: 800; margin-bottom: 6px; }
        .instructions-box {
          font-size: 5.5pt; color: #444; line-height: 1.6;
          text-align: right; border-right: 2px solid #d4af37;
          padding-right: 8px; margin-bottom: 6px;
        }
        .contact-info-box { font-size: 5pt; color: #666; margin-top: auto; border-top: 1px solid #eee; padding-top: 5px; }

        @media print {
          body * {
            visibility: hidden;
          }
          #print-area-wrapper, #print-area-wrapper * {
            visibility: visible;
          }
          #print-area-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 20px;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 20px !important;
            justify-content: center !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-100 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Header */}
        <div className="bg-[#0f2b4c] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#d4af37] no-print">
          <div className="flex items-center gap-3">
            <img
              src="https://up6.cc/2026/09/179017546171821.png"
              alt="Logo"
              className="w-9 h-9 object-contain"
            />
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] text-[#fae588] font-bold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>نظام بطاقات كلية السودان الجديد للمحاسبة - الإصدار النهائي</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                البطاقة الجامعية الذكية المشفرة (CR80)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintConfirm(true)}
              className="bg-[#d4af37] hover:bg-[#c59b6d] text-[#0f2b4c] font-black text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوجهين</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* CARDS PREVIEW SECTION (FRONT & BACK) */}
            <div className="w-full lg:w-auto flex flex-col items-center gap-4 order-1 lg:order-1" id="print-area-wrapper">
              {/* FRONT CARD */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-1.5 no-print">
                  الوجه الأمامي (Front View)
                </span>
                <div className="nsca-id-card" id="frontCard">
                  <div className="art-bg">
                    <div className="wave-top"></div>
                    <div className="wave-bottom"></div>
                    <div className="side-accent-front"></div>
                  </div>
                  {/* Watermark */}
                  <img
                    src="https://up6.cc/2026/09/179017546171821.png"
                    className="watermark-img"
                    alt="Watermark"
                  />

                  <div className="card-content-box">
                    <div className="card-header-box">
                      <img
                        src="/college_logo.png"
                        className="logo-sm-box"
                        alt="Logo"
                      />
                      <div className="uni-titles-box">
                        <h1>كلية السودان الجديد للمحاسبة</h1>
                        <p>NEW SUDAN COLLEGE OF ACCOUNTANCY</p>
                      </div>
                    </div>

                    <div className="card-body-box">
                      <div className="student-info-box">
                        <div className="s-name-box">{name}</div>
                        <div className="s-detail-box">
                          <span className="lbl-box">الرقم الجامعي: </span>
                          <span className="val-box">{studentId}</span>
                        </div>
                        <div className="s-detail-box">
                          <span className="lbl-box">التخصص: </span>
                          <span className="val-box">{major}</span>
                        </div>
                        <div className="s-detail-box">
                          <span className="lbl-box">المستوى: </span>
                          <span className="val-box">{level}</span>
                        </div>
                      </div>
                      <div className="photo-frame-box">
                        <img
                          src={photo}
                          alt={name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                          }}
                        />
                      </div>
                    </div>

                    <div className="card-footer-box">
                      <div className="dates-box">
                        <div>
                          العام الأكاديمي: <strong>{year}</strong>
                        </div>
                        <div>
                          تاريخ الانتهاء: <strong>{exp}</strong>
                        </div>
                      </div>
                      {/* Real Dynamic QR Code */}
                      <div className="qr-box-inner" title="رمز استجابة سريعة حقيقي مشفر ببيانات الطالب">
                        <img src={qrCodeUrl} alt="QR Code" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK CARD */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-1.5 no-print">
                  الوجه الخلفي (Back View)
                </span>
                <div className="nsca-id-card" id="backCard">
                  <div className="art-bg">
                    <div className="side-accent-back"></div>
                  </div>
                  <div className="back-content-box">
                    <img
                      src="/college_logo.png"
                      className="back-logo-img"
                      alt="Logo"
                    />
                    <div className="back-title-txt">تعليمات وشروط استخدام البطاقة</div>

                    <div className="instructions-box">
                      1. هذه البطاقة ملك لكلية السودان الجديد للمحاسبة ويجب إبرازها عند طلب أي خدمة.
                      <br />
                      2. البطاقة شخصية وغير قابلة للتحويل أو الإعارة لغير صاحبها.
                      <br />
                      3. في حال فقدان البطاقة، يرجى إبلاغ إدارة القبول والتسجيل فوراً.
                      <br />
                      4. البطاقة سارية المفعول حتى نهاية العام الأكاديمي المذكور.
                      <br />
                      5. يجب الحفاظ على البطاقة من التلف لضمان صحة البيانات والباركود.
                    </div>

                    <div className="contact-info-box">
                      الخرطوم - السودان | info@nsca.edu.sd
                      <br />
                      www.nsca.edu.sd | CR80 SECURE ID SYSTEM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROL PANEL (INPUT EDITING & BARCODE SYNC) */}
            <div className="w-full lg:max-w-md bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm order-2 lg:order-2 no-print">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-4">
                <h3 className="font-black text-sm text-[#0f2b4c] flex items-center gap-2">
                  <span>⚙️ تعديل بيانات الطالب والباركود المباشر</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  تزامن لحظي
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الطالب الرباعي</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الرقم الجامعي</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المستوى الدراسي</label>
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">التخصص الأكاديمي</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">العام الأكاديمي</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تاريخ الانتهاء</label>
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => setExp(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رابط الصورة الشخصية</label>
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-[#d4af37] outline-none text-slate-600 text-[11px]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowPrintConfirm(true)}
                    className="w-full bg-gradient-to-r from-[#0f2b4c] to-[#1a3c66] hover:from-[#1a3c66] hover:to-[#0f2b4c] text-white font-black py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>🖨️ طباعة البطاقة (الأمام والخلف)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT CONFIRMATION MODAL */}
      {showPrintConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl border border-slate-200 animate-fade-in">
            <div className="text-4xl mb-3">🖨️</div>
            <h3 className="text-base font-black text-[#0f2b4c] mb-2">تأكيد طباعة البطاقة الجامعية</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              هل أنت مستعد لطباعة البطاقة؟<br />
              يرجى التأكد من تفعيل خيار <strong className="text-slate-900">"Background Graphics"</strong> في إعدادات الطابعة لظهور الألوان والتموجات وشعار الكلية بدقة عالية.<br />
              سيتم طباعة الوجهين الأمامي والخلفي وفق مقاس بطاقات الهوية الرسمية (CR80).
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handlePrint}
                className="bg-[#0f2b4c] hover:bg-[#1a3c66] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                نعم، اطبع الآن
              </button>
              <button
                onClick={() => setShowPrintConfirm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
