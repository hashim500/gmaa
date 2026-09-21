import React, { useState } from 'react';
import {
  X,
  Headphones,
  Send,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  Building,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [category, setCategory] = useState('شؤون القبول والتسجيل');
  const [message, setMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rand = Math.floor(10000 + Math.random() * 90000);
    setTicketId(`NSAC-TICK-${rand}`);
    setTicketSubmitted(true);
  };

  const handleReset = () => {
    setTicketSubmitted(false);
    setName('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <CollegeLogo size="md" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            مركز الدعم الأكاديمي والتواصل الطلابي
          </h3>
          <p className="text-xs text-slate-500">
            يسعدنا استقبال استفساراتك حول القبول، التسجيل، السداد البنكي، أو المشكلات التقنية
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-base">تم تسجيل استفسارك بنجاح!</h4>
            <p className="text-xs text-emerald-800">
              رقم التذكرة الأكاديمية للمتابعة: <strong className="font-mono text-sm">{ticketId}</strong>
            </p>
            <p className="text-[11px] text-slate-600">
              سيقوم المرشد الأكاديمي أو قسم الدعم الفني بالرد عليك عبر البريد الإلكتروني أو الهاتف في أقرب وقت.
            </p>
            <button
              onClick={handleReset}
              className="bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              تم، العودة للمنصة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                required
                placeholder="أدخل اسمك"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                البريد الإلكتروني أو رقم الهاتف (واتساب)
              </label>
              <input
                type="text"
                required
                placeholder="مثال: +249 912 345 678 أو email@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-left dir-ltr font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">قسم الدعم المطلوب</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              >
                <option value="شؤون القبول والتسجيل">شؤون القبول والتسجيل</option>
                <option value="الإدارة المالية واستفسارات بنكك">الإدارة المالية واستفسارات بنكك وسداد الرسوم</option>
                <option value="أمانة الشؤون العلمية والامتحانات">أمانة الشؤون العلمية والامتحانات</option>
                <option value="الدعم الفني لمنصة المحاضرات والفيديو">الدعم الفني لمنصة المحاضرات والفيديو</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">تفاصيل الاستفسار أو الرسالة</label>
              <textarea
                rows={3}
                required
                placeholder="اكتب رسالتك أو استفسارك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>إرسال التذكرة للأمانة الأكاديمية</span>
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-blue-700" /> info@nsac.edu.sd
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> +249 123 456 789
          </span>
        </div>
      </div>
    </div>
  );
};
