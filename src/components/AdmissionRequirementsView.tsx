import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Clock,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  FileText,
  BadgeCheck,
  Globe,
  Award,
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';

interface AdmissionRequirementsViewProps {
  onBackToHome?: () => void;
  onNavigate?: (view: string) => void;
}

export const AdmissionRequirementsView: React.FC<AdmissionRequirementsViewProps> = ({
  onBackToHome,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="bg-[#0b2545] text-white border-b-4 border-[#c59b6d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#c59b6d_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#c59b6d]/20 border border-[#c59b6d]/40 text-[#fae588] text-xs font-black px-3.5 py-1 rounded-full">
                <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>إدارة القبول والتسجيل المعتمدة</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                شروط ونسب القبول المعتمدة للعام 2025 / 2026
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                الدليل الرسمي لمتطلبات الالتحاق بدرجات البكالوريوس والدبلوم العالي للشهادات السودانية والعربية والأجنبية.
              </p>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <span>العودة للرئيسية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {/* QUICK STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">بكالوريوس المحاسبة والتمويل</span>
              <span className="text-lg font-black text-slate-900 block">65% كحد أدنى</span>
              <span className="text-[10px] text-emerald-600 font-bold">الشهادة الثانوية العامة / التجارية</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">بكالوريوس نظم المعلومات المحاسبية</span>
              <span className="text-lg font-black text-slate-900 block">63% كحد أدنى</span>
              <span className="text-[10px] text-blue-600 font-bold">المساقات العلمية / الهندسية / التجارية</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">دبلوم المحاسبة والمراجعة الضريبية</span>
              <span className="text-lg font-black text-slate-900 block">55% كحد أدنى</span>
              <span className="text-[10px] text-purple-600 font-bold">كافة المساقات الثانوية والفنية</span>
            </div>
          </div>
        </div>

        {/* DETAILED REQUIREMENTS ACCORDION / SECTIONS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
          {/* SECTION 1: SUDANESE CERTIFICATE */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <BadgeCheck className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-black text-slate-900">أولاً: شروط القبول لحملة الشهادة الثانوية السودانية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>المواد المؤهلة للمساق العلمي والتجاري</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  يجب أن يكون الطالب قد نجح في 7 مواد أساسية مؤهلة تشمل: اللغة العربية، التربية الدينية، اللغة الإنجليزية، الرياضيات المتخصصة، إضافة إلى مادتين من مواد التخصص.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>سنة الحصول على الشهادة</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  يُقبل طلاب الشهادة الثانوية للعام الحالي 2025/2026، كما يُتاح القبول المباشر على النفقة الخاصة لحملة الشهادات للأعوام السابقة وفق الضوابط المعتمدة.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ARAB & INTERNATIONAL CERTIFICATES */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">ثانياً: معادلة الشهادات العربية والأجنبية</h2>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-3">
              <p className="text-slate-700 leading-relaxed font-semibold">
                يُشترط للطلاب الحاصلين على الشهادات الثانوية من الدول العربية (السعودية، الإمارات، قطر، سلطنة عمان، مصر، وغيرها) أو الشهادات الدولية (IGCSE / SAT / American Diploma) استيفاء ما يلي:
              </p>
              <ul className="space-y-2 text-slate-700 list-disc list-inside">
                <li>الحصول على إفادة المعادلة الرسمية من إدارة المعادلات بوزارة التعليم العالي والبحث العلمي السودانية.</li>
                <li>توثيق الشهادة الثانوية من وزارة التربية والتعليم ووزارة الخارجية في الدولة الصادرة منها وسفارة السودان.</li>
                <li>تطبيق النسبة المئوية المحتسبة والمعتمدة في استمارة المعادلة.</li>
              </ul>
            </div>
          </div>

          {/* SECTION 3: REQUIRED DOCUMENTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">ثالثاً: المستندات والأوراق الثبوتية المطلوبة للتسجيل</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold flex-shrink-0">1</span>
                <div>
                  <span className="font-black text-slate-900 block">أصل الشهادة الثانوية الموثقة</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">+ 3 صور طبق الأصل معتمدة</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div>
                  <span className="font-black text-slate-900 block">الرقم الوطني / جواز السفر</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">ساري المفعول مع إحضار الأصل للمطابقة</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div>
                  <span className="font-black text-slate-900 block">صور شخصية حديثة (عدد 4)</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">خلفية بيضاء مقاس 4×6 سم لإصدار البطاقة</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold flex-shrink-0">4</span>
                <div>
                  <span className="font-black text-slate-900 block">شهادة اللياقة الطبية</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">صادرة من مركز طبي حكومي أو معتمد</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold flex-shrink-0">5</span>
                <div>
                  <span className="font-black text-slate-900 block">إشعار سداد رسوم التسجيل</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">إشعار بنكك أو فوري أو إيصال التوريد</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold flex-shrink-0">6</span>
                <div>
                  <span className="font-black text-slate-900 block">إفادة المعادلة (للشهادات الأجنبية)</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">من وزارة التعليم العالي والبحث العلمي</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA BOTTOM */}
          {onNavigate && (
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-right">
                <h4 className="font-black text-sm text-slate-900">هل استوفيت الشروط المطلوبة؟</h4>
                <p className="text-xs text-slate-500">يمكنك الآن إكمال تقديم طلب الالتحاق عبر البوابة الإلكترونية بدقائق معدودة.</p>
              </div>
              <button
                onClick={() => onNavigate('registration')}
                className="bg-[#0b2545] hover:bg-[#133e68] text-white font-bold text-xs px-6 py-3 rounded-2xl transition flex items-center gap-2 shadow-md"
              >
                <span>الانتقال لنموذج التقديم الإلكتروني</span>
                <ArrowRight className="w-4 h-4 rotate-180 text-amber-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
