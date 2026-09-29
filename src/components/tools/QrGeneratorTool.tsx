import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  QrCode,
  Globe,
  FileText,
  Phone,
  MessageCircle,
  Wifi,
  Contact,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';
import { TranslationDict } from '../../i18n/translations';
import { triggerFileDownload } from '../../utils/pdfUtils';

interface QrGeneratorToolProps {
  t: TranslationDict;
  onBack: () => void;
  onError: (msg: string) => void;
}

type QRType = 'url' | 'text' | 'phone' | 'whatsapp' | 'wifi' | 'vcard';

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({
  t,
  onBack,
  onError,
}) => {
  const [qrType, setQrType] = useState<QRType>('url');

  // Input states
  const [urlVal, setUrlVal] = useState<string>('https://example.com');
  const [textVal, setTextVal] = useState<string>('');
  const [phoneVal, setPhoneVal] = useState<string>('966500000000');
  const [waPhone, setWaPhone] = useState<string>('966500000000');
  const [waMsg, setWaMsg] = useState<string>('مرحباً، أود الاستفسار عن...');

  // WiFi states
  const [wifiSsid, setWifiSsid] = useState<string>('MyNetwork');
  const [wifiPass, setWifiPass] = useState<string>('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // vCard states
  const [vcardName, setVcardName] = useState<string>('محمد علي');
  const [vcardOrg, setVcardOrg] = useState<string>('شركة النخبة');
  const [vcardPhone, setVcardPhone] = useState<string>('0500000000');
  const [vcardEmail, setVcardEmail] = useState<string>('name@domain.com');

  // Design options
  const [darkColor, setDarkColor] = useState<string>('#0f172a');
  const [lightColor, setLightColor] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(400);

  // Output
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate QR payload string
  const getPayload = (): string => {
    switch (qrType) {
      case 'url':
        return urlVal.trim() || 'https://example.com';
      case 'text':
        return textVal.trim() || 'نص تجريبي';
      case 'phone':
        return phoneVal.trim() ? `tel:${phoneVal.trim()}` : '';
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        if (!cleanPhone) return '';
        const encodedMsg = encodeURIComponent(waMsg.trim());
        return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
      }
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'vcard':
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${vcardName}`,
          `ORG:${vcardOrg}`,
          `TEL:${vcardPhone}`,
          `EMAIL:${vcardEmail}`,
          'END:VCARD',
        ].join('\n');
      default:
        return '';
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload) return;

    QRCode.toDataURL(payload, {
      width: qrSize,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [
    qrType,
    urlVal,
    textVal,
    phoneVal,
    waPhone,
    waMsg,
    wifiSsid,
    wifiPass,
    wifiType,
    vcardName,
    vcardOrg,
    vcardPhone,
    vcardEmail,
    darkColor,
    lightColor,
    qrSize,
  ]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    fetch(qrDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        triggerFileDownload(blob, `QRCode_${qrType}.png`);
      })
      .catch((err) => onError(err?.message || 'فشل تحميل رمز الاستجابة'));
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    try {
      const blob = await fetch(qrDataUrl).then((r) => r.blob());
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

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

        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
          <QrCode className="h-3.5 w-3.5" />
          <span>توليد باركود أوفلاين فوري 100%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                مولد رموز الاستجابة السريعة (QR Code)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أنشئ باركودات موجهة للروابط، الهواتف، الواتساب، والواي فاي بدقة طباعة عالية
              </p>
            </div>
          </div>

          {/* Types Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: 'url', label: 'رابط موقع', icon: Globe },
              { id: 'text', label: 'نص عادي', icon: FileText },
              { id: 'phone', label: 'اتصال هاتف', icon: Phone },
              { id: 'whatsapp', label: 'واتساب', icon: MessageCircle },
              { id: 'wifi', label: 'واي فاي', icon: Wifi },
              { id: 'vcard', label: 'بطاقة عمل', icon: Contact },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQrType(tab.id as QRType)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 px-1 text-[11px] font-bold transition ${
                    qrType === tab.id
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Field Configuration */}
          <div className="space-y-3.5 pt-1">
            {qrType === 'url' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رابط الموقع الإلكتروني (URL):
                </label>
                <input
                  type="url"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  dir="ltr"
                />
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  النص المطلوب ترميزه:
                </label>
                <textarea
                  rows={4}
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  placeholder="اكتب أو ألصق أي نص أو رقم مرجعي هنا..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            )}

            {qrType === 'phone' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  رقم الهاتف (مع رمز الدولة):
                </label>
                <input
                  type="tel"
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="966500000000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  dir="ltr"
                />
              </div>
            )}

            {qrType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    رقم الواتساب (مع رمز الدولة بدون +):
                  </label>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="966500000000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    الرسالة التمهيدية التلقائية:
                  </label>
                  <input
                    type="text"
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    placeholder="مرحباً، أود الاستفسار عن..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    اسم الشبكة (SSID):
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="اسم شبكة الواي فاي"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    dir="ltr"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة مرور الشبكة:
                    </label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="كلمة السر"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      نوع التشفير:
                    </label>
                    <select
                      value={wifiType}
                      onChange={(e) => setWifiType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      <option value="WPA">WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">بدون حماية (مفتوحة)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {qrType === 'vcard' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      الاسم الكامل:
                    </label>
                    <input
                      type="text"
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      الجهة أو الشركة:
                    </label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      رقم الجوال:
                    </label>
                    <input
                      type="tel"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني:
                    </label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Colors & Resolution */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  لون الباركود:
                </span>
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  لون الخلفية:
                </span>
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            معاينة كود QR الحية
          </p>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="h-56 w-56 object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center text-slate-400">
                جاري التوليد...
              </div>
            )}

            <div className="mt-4 flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-[0.99]"
              >
                <Download className="h-4 w-4" />
                <span>تحميل كود QR بدقة عالية (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>تم النسخ للحافظة!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-500" />
                    <span>نسخ الصورة للحافظة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
