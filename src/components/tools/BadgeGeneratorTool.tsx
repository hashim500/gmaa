import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Download,
  Upload,
  User,
  Building2,
  Phone,
  Mail,
  QrCode,
  Palette,
  FileBadge,
  Sparkles,
  Printer,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Shield,
  Layers,
} from 'lucide-react';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload } from '../../utils/pdfUtils';
import {
  AVATAR_HIJAB_DATA_URL,
  AVATAR_SUIT_DATA_URL,
  AVATAR_NEUTRAL_DATA_URL,
} from './badgeAvatars';

interface BadgeGeneratorToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

export type BadgeStyleMode =
  | 'modern'
  | 'geometric'
  | 'minimal'
  | 'executive'
  | 'curved'
  | 'tech'
  | 'corporate';

export type BadgeAvatarType = 'upload' | 'suit' | 'hijab' | 'neutral' | 'none';

export const BadgeGeneratorTool: React.FC<BadgeGeneratorToolProps> = ({
  t,
  onBack,
  onError,
}) => {
  // Form State
  const [employeeName, setEmployeeName] = useState<string>('مها الأمين فيصل');
  const [jobRole, setJobRole] = useState<string>('مهندس طباعة وتصميم');
  const [employeeId, setEmployeeId] = useState<string>('EMP-2458978');
  const [companyName, setCompanyName] = useState<string>('مكتبة فواصل العربية');
  const [phone, setPhone] = useState<string>('0500341791');
  const [email, setEmail] = useState<string>('info@tech.com');

  // Display & Visibility Toggles
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [showPhone, setShowPhone] = useState<boolean>(true);
  const [showEmail, setShowEmail] = useState<boolean>(true);

  // Avatar Selection Mode: 'upload' (real photo) | 'suit' | 'hijab' | 'neutral' | 'none'
  const [avatarType, setAvatarType] = useState<BadgeAvatarType>('upload');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // Styling & Templates
  const [styleMode, setStyleMode] = useState<BadgeStyleMode>('modern');
  const [primaryColor, setPrimaryColor] = useState<string>('#1e40af'); // blue-800
  const [accentColor, setAccentColor] = useState<string>('#0d9488'); // teal-600

  // QR Code Data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Card reference for canvas rendering
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate QR Code on data change (Standard vCard format)
  useEffect(() => {
    const name = employeeName.trim() || 'Employee';
    const role = jobRole.trim() || 'Role';
    const company = companyName.trim() || 'Company';
    const id = employeeId.trim() || '000000';
    const tel = showPhone && phone.trim() ? phone.trim() : '';
    const mail = showEmail && email.trim() ? email.trim() : '';

    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${name}`,
      `ORG:${company}`,
      `TITLE:${role}`,
      tel ? `TEL:${tel}` : '',
      mail ? `EMAIL:${mail}` : '',
      `NOTE:ID:${id}`,
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    QRCode.toDataURL(vCard, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [employeeName, jobRole, employeeId, companyName, phone, email, showPhone, showEmail]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setAvatarUrl(evt.target.result as string);
          setAvatarType('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setLogoUrl(evt.target.result as string);
          setShowLogo(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to determine the active avatar image source
  const getActiveAvatarSrc = (): string | null => {
    if (avatarType === 'none') return null;
    if (avatarType === 'suit') return AVATAR_SUIT_DATA_URL;
    if (avatarType === 'hijab') return AVATAR_HIJAB_DATA_URL;
    if (avatarType === 'neutral') return AVATAR_NEUTRAL_DATA_URL;
    if (avatarType === 'upload' && avatarUrl) return avatarUrl;
    return null;
  };

  // High resolution render onto Canvas
  const renderCardToCanvas = async (scale: number = 3): Promise<HTMLCanvasElement> => {
    const width = 320 * scale;
    const height = 508 * scale;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    ctx.save();
    ctx.scale(scale, scale);

    // 1. Base card background with rounded corners
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0, 0, 320, 508, 16);
    ctx.fill();

    // 2. Header pattern based on styleMode
    ctx.save();
    ctx.beginPath();

    if (styleMode === 'modern') {
      ctx.moveTo(0, 0);
      ctx.lineTo(320, 0);
      ctx.lineTo(320, 140);
      ctx.lineTo(0, 175);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 320, 175);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, accentColor);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (styleMode === 'geometric') {
      ctx.moveTo(0, 0);
      ctx.lineTo(320, 0);
      ctx.lineTo(320, 130);
      ctx.quadraticCurveTo(160, 185, 0, 130);
      ctx.closePath();
      const grad = ctx.createLinearGradient(160, 0, 160, 185);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, accentColor);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (styleMode === 'executive') {
      // Luxury Executive Header
      ctx.rect(0, 0, 320, 145);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      // Gold / Accent metallic divider ribbon
      const goldGrad = ctx.createLinearGradient(0, 140, 320, 145);
      goldGrad.addColorStop(0, accentColor);
      goldGrad.addColorStop(0.5, '#fef08a');
      goldGrad.addColorStop(1, accentColor);
      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 140, 320, 5);
    } else if (styleMode === 'curved') {
      // Smooth double waves
      ctx.moveTo(0, 0);
      ctx.lineTo(320, 0);
      ctx.lineTo(320, 155);
      ctx.bezierCurveTo(240, 180, 160, 120, 0, 165);
      ctx.closePath();
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(320, 0);
      ctx.lineTo(320, 135);
      ctx.bezierCurveTo(220, 175, 100, 110, 0, 145);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 320, 145);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, accentColor);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (styleMode === 'tech') {
      // Tech Edge with geometric cut and side accent
      ctx.moveTo(0, 0);
      ctx.lineTo(320, 0);
      ctx.lineTo(320, 120);
      ctx.lineTo(260, 145);
      ctx.lineTo(60, 145);
      ctx.lineTo(0, 120);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 320, 145);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, accentColor);
      ctx.fillStyle = grad;
      ctx.fill();

      // Side tech border strip
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, 6, 508);
    } else if (styleMode === 'corporate') {
      // Corporate Classic: Top band + Accent line + Bottom matching strip
      ctx.rect(0, 0, 320, 125);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 125, 320, 6);

      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 502, 320, 6);
    } else {
      // Minimal
      ctx.rect(0, 0, 320, 120);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 120, 320, 4);
    }
    ctx.restore();

    // 3. Lanyard slot hole at top center
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(160 - 24, 8, 48, 10, 5);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Logo / Company Name
    if (showLogo) {
      if (logoUrl) {
        try {
          const logoImg = await loadImage(logoUrl);
          ctx.save();
          ctx.beginPath();
          ctx.arc(160, 50, 18, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
          ctx.clip();
          ctx.drawImage(logoImg, 160 - 18, 50 - 18, 36, 36);
          ctx.restore();
        } catch {
          // fallback
        }
      } else {
        // Default small LOGO badge
        ctx.save();
        ctx.beginPath();
        ctx.arc(160, 50, 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LOGO', 160, 50);
        ctx.restore();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(companyName || 'اسم الجهة', 160, 84);
    } else {
      // When logo is hidden, company name occupies the header with graceful center balance
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(companyName || 'اسم الجهة', 160, 62);
    }

    // 5. Employee Avatar / Photo / Monogram
    const hasPhoto = avatarType !== 'none';
    const avatarSrc = getActiveAvatarSrc();
    const avatarCenterX = 160;
    const avatarCenterY = 175;
    const avatarRadius = 42;

    if (hasPhoto) {
      // Outer border circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Clip image circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
      ctx.clip();

      if (avatarSrc) {
        try {
          const avatarImg = await loadImage(avatarSrc);
          ctx.drawImage(
            avatarImg,
            avatarCenterX - avatarRadius,
            avatarCenterY - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );
        } catch {
          drawDefaultAvatar(ctx, avatarCenterX, avatarCenterY, avatarRadius);
        }
      } else {
        drawDefaultAvatar(ctx, avatarCenterX, avatarCenterY, avatarRadius);
      }
      ctx.restore();
    }

    // 6. Name and Role
    // Dynamic Y positions depending on whether photo is displayed or hidden
    const nameY = hasPhoto ? 246 : 190;
    const roleY = hasPhoto ? 268 : 216;
    const idPillY = hasPhoto ? 282 : 234;
    const contactStartY = hasPhoto ? 318 : 275;

    ctx.fillStyle = '#0f172a';
    ctx.font = hasPhoto
      ? '800 16px "Cairo", "Tajawal", sans-serif'
      : '800 20px "Cairo", "Tajawal", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(employeeName || 'اسم الموظف', 160, nameY);

    ctx.fillStyle = accentColor;
    ctx.font = hasPhoto
      ? 'bold 12px "Cairo", "Tajawal", sans-serif'
      : 'bold 13px "Cairo", "Tajawal", sans-serif';
    ctx.fillText(jobRole || 'المسمى الوظيفي', 160, roleY);

    // 7. Badge ID Pill
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(160 - 65, idPillY, 130, 22, 11);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`ID: ${employeeId || 'EMP-0000'}`, 160, idPillY + 15);

    // 8. Contact Info (Phone & Email) - Only if enabled!
    const hasAnyContact = (showPhone && phone) || (showEmail && email);
    if (hasAnyContact) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(25, contactStartY);
      ctx.lineTo(295, contactStartY);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '500 11px sans-serif';

      let currentContactY = contactStartY + 18;
      if (showPhone && phone) {
        ctx.fillText(`📞  ${phone}`, 160, currentContactY);
        currentContactY += 18;
      }
      if (showEmail && email) {
        ctx.fillText(`✉️  ${email}`, 160, currentContactY);
      }
    }

    // 9. Bottom QR Code Container
    const qrBoxTop = hasPhoto ? 375 : 355;
    const qrBoxHeight = 508 - qrBoxTop;

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.rect(0, qrBoxTop, 320, qrBoxHeight);
    ctx.fill();

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, qrBoxTop);
    ctx.lineTo(320, qrBoxTop);
    ctx.stroke();

    if (qrDataUrl) {
      try {
        const qrImg = await loadImage(qrDataUrl);
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(160 - 45, qrBoxTop + 14, 90, 90, 8);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();
        ctx.drawImage(qrImg, 160 - 40, qrBoxTop + 19, 80, 80);
        ctx.restore();
      } catch (err) {
        console.error(err);
      }
    }

    // Outer card border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0, 0, 320, 508, 16);
    ctx.stroke();

    ctx.restore();
    return canvas;
  };

  const drawDefaultAvatar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(x, y - 8, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + 36, 28, 0, Math.PI * 2);
    ctx.fill();
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Download high-res PNG
  const handleDownloadImage = async () => {
    try {
      setIsExporting(true);
      const canvas = await renderCardToCanvas(3);
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('فشل تصدير الصورة');
        triggerFileDownload(blob, `ID_Badge_${employeeId || 'CR80'}.png`);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
        setIsExporting(false);
      }, 'image/png');
    } catch (err: any) {
      setIsExporting(false);
      onError(err?.message || 'حدث خطأ أثناء تصدير البطاقة');
    }
  };

  // Download ready-to-print PDF card
  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      const canvas = await renderCardToCanvas(3);
      const pngDataUrl = canvas.toDataURL('image/png');
      const pngBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.create();
      // CR80 dimension in points (1 pt = 1/72 inch): 54mm = 153.07pt, 85.6mm = 242.64pt
      const cardWidthPt = 153.07;
      const cardHeightPt = 242.64;

      const page = pdfDoc.addPage([cardWidthPt, cardHeightPt]);
      const embeddedImage = await pdfDoc.embedPng(pngBytes);

      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: cardWidthPt,
        height: cardHeightPt,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      triggerFileDownload(pdfBlob, `ID_Badge_${employeeId || 'CR80'}.pdf`);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      setIsExporting(false);
    } catch (err: any) {
      setIsExporting(false);
      onError(err?.message || 'حدث خطأ أثناء إنشاء ملف PDF للبطاقة');
    }
  };

  // 12 Expanded Corporate & Luxury Color Presets
  const COLOR_PRESETS = [
    { primary: '#1e40af', accent: '#0d9488', name: 'أزرق تنفيذي وتيلي' },
    { primary: '#0f766e', accent: '#059669', name: 'زمردي وأخضر راقٍ' },
    { primary: '#0f172a', accent: '#d97706', name: 'كحلي وذهبي ملكي' },
    { primary: '#581c87', accent: '#ec4899', name: 'بنفسجي ووردي عصري' },
    { primary: '#18181b', accent: '#71717a', name: 'أسود وفضي أنيق' },
    { primary: '#881337', accent: '#f59e0b', name: 'عنابي وبرغندي فاخر' },
    { primary: '#0e7490', accent: '#06b6d4', name: 'تركواز ومحيطي هادئ' },
    { primary: '#312e81', accent: '#38bdf8', name: 'ملكي ونيلي عصري' },
    { primary: '#78350f', accent: '#d97706', name: 'برونزي وذهبي دافئ' },
    { primary: '#334155', accent: '#e11d48', name: 'رمادي وقرمزي رسمي' },
    { primary: '#14532d', accent: '#10b981', name: 'أخضر غابات ونحاسي' },
    { primary: '#09090b', accent: '#2563eb', name: 'تيتانيوم وأزرق نيون' },
  ];

  const activeAvatarSrc = getActiveAvatarSrc();
  const hasContact = (showPhone && phone) || (showEmail && email);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
            <FileBadge className="h-3.5 w-3.5" />
            <span>المقاس القياسي الموحد CR80</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Control Panel + Live Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Controls */}
        <div className="lg:col-span-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                بيانات وتصميم بطاقة الهوية
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مولد بطاقات الموظفين بمواصفات الطباعة العالمية والباركود الذكي
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Employee Basic Info */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم الموظف
              </label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="أدخل اسم الموظف..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  المسمى الوظيفي
                </label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="مثال: مهندس برمجيات"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رقم الهوية / الموظف
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP-000000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                اسم الشركة أو المنشأة
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="اسم الجهة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رقم الهاتف / الجوال
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Visibility Toggles (Logo, Phone, Email) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200/60 pb-1.5 dark:border-slate-700/60">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  خيارات إظهار وإخفاء عناصر البطاقة
                </span>
                <span className="text-[11px] font-normal text-slate-500">تحكم فوري بالمعاينة والطباعة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Logo Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none rounded-lg p-1.5 transition hover:bg-white dark:hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                  />
                  <span className={showLogo ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>
                    شعار المنشأة (Logo)
                  </span>
                </label>

                {/* Phone Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none rounded-lg p-1.5 transition hover:bg-white dark:hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                  />
                  <span className={showPhone ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>
                    رقم الجوال
                  </span>
                </label>

                {/* Email Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none rounded-lg p-1.5 transition hover:bg-white dark:hover:bg-slate-700/50">
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                  />
                  <span className={showEmail ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>
                    البريد الإلكتروني
                  </span>
                </label>
              </div>
            </div>

            {/* Avatar & Photo Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  صورة البطاقة والأيقونات الرمزية
                </label>
                <span className="text-[11px] text-slate-500">اختر صورة أو أيقونة أو إخفاء</span>
              </div>

              {/* Avatar Type Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {/* 1. Real Photo Upload */}
                <button
                  type="button"
                  onClick={() => setAvatarType('upload')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center text-xs font-bold border transition ${
                    avatarType === 'upload'
                      ? 'border-teal-500 bg-teal-50/70 text-teal-800 shadow-sm dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    <Upload className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] leading-tight">صورة شخصية (رفع)</span>
                </button>

                {/* 2. Businessman Suit Icon */}
                <button
                  type="button"
                  onClick={() => setAvatarType('suit')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center text-xs font-bold border transition ${
                    avatarType === 'suit'
                      ? 'border-teal-500 bg-teal-50/70 text-teal-800 shadow-sm dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400'
                  }`}
                >
                  <img
                    src={AVATAR_SUIT_DATA_URL}
                    alt="موظف بدلة"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <span className="text-[11px] leading-tight">أيقونة موظف (بدلة)</span>
                </button>

                {/* 3. Hijab Icon */}
                <button
                  type="button"
                  onClick={() => setAvatarType('hijab')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center text-xs font-bold border transition ${
                    avatarType === 'hijab'
                      ? 'border-teal-500 bg-teal-50/70 text-teal-800 shadow-sm dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400'
                  }`}
                >
                  <img
                    src={AVATAR_HIJAB_DATA_URL}
                    alt="موظفة حجاب"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <span className="text-[11px] leading-tight">أيقونة موظفة (حجاب)</span>
                </button>

                {/* 4. Neutral User Icon */}
                <button
                  type="button"
                  onClick={() => setAvatarType('neutral')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center text-xs font-bold border transition ${
                    avatarType === 'neutral'
                      ? 'border-teal-500 bg-teal-50/70 text-teal-800 shadow-sm dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400'
                  }`}
                >
                  <img
                    src={AVATAR_NEUTRAL_DATA_URL}
                    alt="أيقونة عامة"
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <span className="text-[11px] leading-tight">أيقونة رمزية عامة</span>
                </button>

                {/* 5. Hide Avatar (None) */}
                <button
                  type="button"
                  onClick={() => setAvatarType('none')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center text-xs font-bold border transition ${
                    avatarType === 'none'
                      ? 'border-teal-500 bg-teal-50/70 text-teal-800 shadow-sm dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700">
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] leading-tight">بدون صورة (إخفاء)</span>
                </button>
              </div>

              {/* Show file upload inputs if selected */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {avatarType === 'upload' && (
                  <div>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-teal-400 bg-teal-50/40 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:bg-teal-950/30 dark:text-teal-300">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{avatarUrl ? 'استبدال الصورة الشخصية' : 'رفع صورة شخصية للموظف'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {showLogo && (
                  <div className={avatarType !== 'upload' ? 'sm:col-span-2' : ''}>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-2 text-xs font-bold text-slate-600 hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{logoUrl ? 'تغيير شعار المنشأة' : 'رفع شعار المنشأة (اختياري)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Styles & Templates (7 styles) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  نمط وقالب البطاقة (Card Templates)
                </label>
                <span className="text-[11px] text-slate-500">7 قوالب هندسية وطباعية</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'modern', label: 'حديث ومائل' },
                  { id: 'geometric', label: 'هندسي وأقواس' },
                  { id: 'minimal', label: 'بسيط وراقي' },
                  { id: 'executive', label: 'تنفيذي فاخر' },
                  { id: 'curved', label: 'أمواج عصرية' },
                  { id: 'tech', label: 'تقني عصري' },
                  { id: 'corporate', label: 'مؤسسي كلاسيك' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyleMode(s.id as BadgeStyleMode)}
                    className={`rounded-xl py-2 px-2.5 text-xs font-bold transition text-center ${
                      styleMode === s.id
                        ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette & Gradients (12 presets + pickers) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الألوان والتدرجات اللونية (12 تدرجاً مخصصاً)
                </label>
                <span className="text-[11px] text-slate-400">تدرجات ألوان الطباعة القياسية</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(p.primary);
                      setAccentColor(p.accent);
                    }}
                    title={p.name}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm transition hover:scale-110 ${
                      primaryColor === p.primary && accentColor === p.accent
                        ? 'border-teal-500 scale-110 ring-2 ring-teal-500/40'
                        : 'border-white dark:border-slate-800'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%)`,
                    }}
                  />
                ))}

                <div className="flex items-center gap-2 ms-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">الرئيسي:</span>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-7 w-7 cursor-pointer rounded-lg border border-slate-300"
                      title="اللون الرئيسي"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">الثانوي:</span>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-7 w-7 cursor-pointer rounded-lg border border-slate-300"
                      title="اللون الثانوي"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99] disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'جاري التصدير...' : 'تنزيل كصورة عالية الدقة'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-900 active:scale-[0.99] disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <Printer className="h-4 w-4" />
                <span>تصدير كـ PDF للطباعة</span>
              </button>
            </div>

            {exportSuccess && (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>تم تجهيز وتنزيل البطاقة بنجاح!</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/70 p-6 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="mb-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            المعاينة الحية الفورية (القياس الموحد CR80: 54mm × 85.6mm)
          </p>

          {/* CR80 Badge Frame */}
          <div
            ref={cardRef}
            style={{ width: '320px', height: '508px' }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl transition-all duration-200 select-none dark:border-slate-700"
          >
            {/* Tech Mode side border strip if active */}
            {styleMode === 'tech' && (
              <div
                className="absolute top-0 right-0 z-30 h-full w-1.5 transition-colors"
                style={{ backgroundColor: accentColor }}
              />
            )}

            {/* Corporate Mode bottom border strip if active */}
            {styleMode === 'corporate' && (
              <div
                className="absolute bottom-0 left-0 z-30 h-1.5 w-full transition-colors"
                style={{ backgroundColor: primaryColor }}
              />
            )}

            {/* Lanyard Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-2.5 w-12 rounded-full border border-slate-400 bg-slate-300" />

            {/* Header with Pattern depending on styleMode */}
            <div
              className={`relative z-10 px-4 text-center transition-all duration-300 ${
                showLogo ? 'pt-6 pb-12' : 'pt-7 pb-10'
              }`}
            >
              {/* Header Background layer */}
              <div
                className="absolute inset-0 z-0 transition-all duration-300"
                style={{
                  background:
                    styleMode === 'minimal'
                      ? primaryColor
                      : styleMode === 'executive'
                      ? primaryColor
                      : `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                  clipPath:
                    styleMode === 'modern'
                      ? 'polygon(0 0, 100% 0, 100% 82%, 0 100%)'
                      : styleMode === 'geometric'
                      ? 'ellipse(120% 100% at 50% 0%)'
                      : styleMode === 'curved'
                      ? 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
                      : styleMode === 'tech'
                      ? 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 15% 100%, 0 85%)'
                      : 'none',
                }}
              />

              {/* Executive mode metallic ribbon */}
              {styleMode === 'executive' && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 z-10"
                  style={{
                    background: `linear-gradient(90deg, ${accentColor}, #fef08a, ${accentColor})`,
                  }}
                />
              )}

              {/* Corporate mode ribbon */}
              {styleMode === 'corporate' && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5 z-10"
                  style={{ backgroundColor: accentColor }}
                />
              )}

              {/* Minimal mode accent line */}
              {styleMode === 'minimal' && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 z-10"
                  style={{ backgroundColor: accentColor }}
                />
              )}

              {/* Curved mode wave overlay */}
              {styleMode === 'curved' && (
                <div
                  className="absolute inset-0 z-0 opacity-40"
                  style={{
                    background: accentColor,
                    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 82%)',
                  }}
                />
              )}

              {/* Logo & Company Name */}
              <div className="relative z-10 flex flex-col items-center">
                {showLogo && (
                  <div className="mb-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/20 p-1 shadow-inner">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-black text-white">LOGO</span>
                    )}
                  </div>
                )}
                <h3
                  className={`px-2 font-extrabold text-white leading-snug transition-all ${
                    showLogo ? 'text-xs' : 'text-sm mt-1'
                  }`}
                >
                  {companyName || 'اسم المنشأة'}
                </h3>
              </div>
            </div>

            {/* Avatar & Employee Details */}
            <div
              className={`relative z-20 flex flex-grow flex-col items-center justify-start px-4 text-center transition-all ${
                avatarType !== 'none' ? '-mt-8' : 'mt-2'
              }`}
            >
              {/* Avatar Circle - Only if avatarType !== 'none' */}
              {avatarType !== 'none' && (
                <div className="mb-1.5 flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md">
                  {activeAvatarSrc ? (
                    <img
                      src={activeAvatarSrc}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-slate-400" />
                  )}
                </div>
              )}

              {/* Employee Name */}
              <h1
                className={`mt-1 font-black text-slate-800 leading-snug ${
                  avatarType === 'none' ? 'text-lg mt-2' : 'text-base'
                }`}
              >
                {employeeName || 'اسم الموظف'}
              </h1>

              {/* Job Role */}
              <p
                className={`my-0.5 font-bold leading-normal ${
                  avatarType === 'none' ? 'text-sm' : 'text-xs'
                }`}
                style={{ color: accentColor }}
              >
                {jobRole || 'المسمى الوظيفي'}
              </p>

              {/* Employee ID Pill */}
              <div className="my-1.5 inline-block rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 shadow-sm">
                <p className="font-mono text-[10px] font-bold text-slate-600">
                  ID: {employeeId || 'EMP-00000'}
                </p>
              </div>

              {/* Contact Information (Phone & Email) - Only if enabled & has content */}
              {hasContact && (
                <div className="mt-auto w-full border-y border-slate-100 py-1.5 text-[11px] text-slate-600 space-y-1">
                  {showPhone && phone && (
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap" dir="ltr">
                      <span>📞</span>
                      <span className="font-sans font-medium">{phone}</span>
                    </div>
                  )}
                  {showEmail && email && (
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap" dir="ltr">
                      <span>✉️</span>
                      <span className="font-sans font-medium">{email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom QR Code Container */}
            <div className="relative z-20 flex items-center justify-center border-t border-slate-100 bg-slate-50 p-2.5">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="vCard QR" className="h-full w-full object-contain" />
                ) : (
                  <QrCode className="h-10 w-10 text-slate-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

