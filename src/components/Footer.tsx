import React from 'react';
import {
  FileText,
  ShieldCheck,
  Lock,
  Mail,
  Scale,
  Info,
  Cookie,
  AlertTriangle,
  Heart,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { LegalPageId, ToolId } from '../types';
import { TranslationDict } from '../i18n/translations';
import { PdfDoerLogo } from './PdfDoerLogo';

interface FooterProps {
  onNavigatePage: (page: LegalPageId) => void;
  onSelectTool: (toolId: ToolId | null) => void;
  t: TranslationDict;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigatePage,
  onSelectTool,
  t,
}) => {
  return (
    <footer className="no-print mt-16 border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <PdfDoerLogo size="sm" showText={true} />
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Client-Side
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              منصة <strong>PdfDoer</strong> المتكاملة لأدوات ملفات الـ PDF والسير الذاتية الاحترافية. معالجة محلية 100% داخل متصفحك دون رفع أي مستند لأي خادم لضمان أقصى درجات السرية والخصوصية.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
              <span>خصوصية تامة بدون تخزين سحابي</span>
            </div>
          </div>

          {/* Col 2: Essential Legal & AdSense Pages */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              الشروط والسياسات الرسمية
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  id="footer-link-privacy"
                  onClick={() => onNavigatePage('privacy')}
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                  <span>سياسة الخصوصية (Privacy Policy)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-terms"
                  onClick={() => onNavigatePage('terms')}
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <Scale className="h-3.5 w-3.5 text-teal-600" />
                  <span>شروط الاستخدام (Terms of Service)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-cookies"
                  onClick={() => onNavigatePage('cookies')}
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <Cookie className="h-3.5 w-3.5 text-teal-600" />
                  <span>سياسة ملفات الكوكيز (Cookie Policy)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-disclaimer"
                  onClick={() => onNavigatePage('disclaimer')}
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span>إخلاء المسؤولية والإعلانات (Disclaimer)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              عن المنصة والمساعدة
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  id="footer-link-about"
                  onClick={() => onNavigatePage('about')}
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <Info className="h-3.5 w-3.5 text-teal-600" />
                  <span>من نحن ورؤيتنا (About Us)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  id="footer-link-contact"
                  onClick={() => onNavigatePage('contact')}
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-teal-600" />
                  <span>اتصل بنا وتواصل معنا (Contact Us)</span>
                </button>
              </li>
              <li>
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>إعدادات إعلانات Google</span>
                </a>
              </li>
              <li className="pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  البريد المباشر: <strong className="font-mono text-slate-800 dark:text-slate-200">support@pdftools.pro</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Popular Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              أبرز الأدوات والمحررات
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('cv-builder')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  • منشئ السيرة الذاتية الاحترافي (A4)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('merge')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  • دمج ودمج ملفات PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('split')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  • تقسيم وتفكيك المستندات
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('protect')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  • حماية وتشفير ملفات PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('badge-generator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  • تصميم بطاقات الهوية الرسمية
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* AdSense Compliance Disclosure Callout */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400 leading-relaxed">
          <span>
            💡 <strong>إفصاح إعلاني:</strong> هذا الموقع مدعوم بإعلانات رقمية موجهة بواسطة شبكة <strong>Google AdSense</strong>، بهدف تغطية تكاليف الخوادم والتطوير، مما يتيح تقديم كافة أدوات المستندات مجاناً بالكامل دون أي اشتراكات أو رسوم. لا يتم رفع أو مشاركة ملفاتك ومستنداتك مع أي طرف إعلاني.
          </span>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>© 2026 PdfDoer. جميع الحقوق محفوظة. تم التطوير بنظام الخصوصية المحلية الكاملة.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigatePage('privacy')}
              className="hover:underline"
            >
              الخصوصية
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigatePage('terms')}
              className="hover:underline"
            >
              الشروط
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigatePage('contact')}
              className="hover:underline"
            >
              اتصل بنا
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
