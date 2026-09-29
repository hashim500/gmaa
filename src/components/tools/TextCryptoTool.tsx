import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';

interface TextCryptoToolProps {
  t: TranslationDict;
  onBack: () => void;
}

export const TextCryptoTool: React.FC<TextCryptoToolProps> = ({ t, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple UTF-8 safe Base64 encoding without password
  const encryptWithoutPassword = (text: string): string => {
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  };

  // Simple UTF-8 safe Base64 decoding without password
  const decryptWithoutPassword = (base64Text: string): string => {
    const binString = atob(base64Text.trim());
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
    return decodeURIComponent(
      Array.from(bytes)
        .map((byte) => '%' + byte.toString(16).padStart(2, '0'))
        .join('')
    );
  };

  // Derive AES-GCM 256-bit key from user password using PBKDF2
  const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  // Handle Encrypt
  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setStatusMessage({ type: 'error', text: 'الرجاء إدخال النص المطلوب تشفيره أولاً' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      if (!secretKey) {
        const encrypted = encryptWithoutPassword(inputText);
        setOutputText(encrypted);
        setStatusMessage({
          type: 'success',
          text: 'تم التشفير البسيط بنجاح (بدون كلمة مرور). يمكنك فك تشفيره مباشرة.',
        });
      } else {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(secretKey, salt);

        const enc = new TextEncoder();
        const encryptedBuffer = await window.crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          enc.encode(inputText)
        );

        const combined = new Uint8Array(salt.byteLength + iv.byteLength + encryptedBuffer.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.byteLength);
        combined.set(new Uint8Array(encryptedBuffer), salt.byteLength + iv.byteLength);

        let binary = '';
        const len = combined.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(combined[i]);
        }

        setOutputText(btoa(binary));
        setStatusMessage({
          type: 'success',
          text: 'تم التشفير العسكري الآمن AES-256 بنجاح محلياً داخل جهازك!',
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'حدث خطأ أثناء عملية التشفير: ' + (err?.message || '') });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Decrypt
  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      setStatusMessage({ type: 'error', text: 'الرجاء إدخال النص المراد فك تشفيره أولاً' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      if (!secretKey) {
        const decrypted = decryptWithoutPassword(inputText.trim());
        setOutputText(decrypted);
        setStatusMessage({ type: 'success', text: 'تم فك التشفير البسيط بنجاح!' });
      } else {
        const cleanB64 = inputText.trim();
        const binary = atob(cleanB64);
        const combined = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          combined[i] = binary.charCodeAt(i);
        }

        if (combined.byteLength < 28) {
          throw new Error('النص المشفر غير صالح أو غير مكتمل');
        }

        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);

        const key = await deriveKey(secretKey, salt);
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          data
        );

        const dec = new TextDecoder();
        setOutputText(dec.decode(decryptedBuffer));
        setStatusMessage({
          type: 'success',
          text: 'تم فك تشفير النص المشفر بكلمة المرور بنجاح!',
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'فشل فك التشفير! تأكد من صحة كلمة المرور أو صحة النص المشفر المُدخل.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <ArrowRight className="h-4 w-4" />
            <span>{t.backToTools}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                تشفير وفك تشفير النصوص (مع/بدون كلمة مرور)
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  AES-256 محلي
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تشفير عالي الأمان محلياً داخل جهازك عبر Web Crypto API بدون إرسال أي حرف لخوادم خارجية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
        {/* Security Banner */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="leading-relaxed">
            <strong>أمان كامل ومحلي 100%: </strong>
            تتم عمليات التشفير والاشتقاق الرياضي (PBKDF2 + AES-GCM 256) بالكامل في ذاكرة متصفحك. لا يمكن لأي طرف فك النص المحمي بكلمة مرور بدون معرفة الرمز السري.
          </div>
        </div>

        {/* Input Text Box */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              النص المطلوب تشفيره أو فك تشفيره:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputText('هذه رسالة سرية للغاية موثقة ومحمية.')}
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="h-3 w-3" />
                <span>تجربة نص نموذجي</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setOutputText('');
                  setStatusMessage(null);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>مسح</span>
              </button>
            </div>
          </div>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="أدخل النص الأصلي للتشفير، أو الصق النص المشفر لفك تشفيره..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800 resize-none font-mono"
          />
        </div>

        {/* Password / Secret Key Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            كلمة المرور / المفتاح السري{' '}
            <span className="font-normal text-slate-400">
              (اختياري - اتركه فارغاً للتشفير البسيط دون رقم سري):
            </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="اتركه فارغاً، أو أدخل كلمة مرور لحماية وتشفير النص بأعلى معيار..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 pe-10 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDecrypt}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-98 transition dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
          >
            <Unlock className="h-4 w-4 text-emerald-400" />
            <span>فك تشفير النص (Decrypt)</span>
          </button>

          <button
            type="button"
            onClick={handleEncrypt}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>تشفير النص (Encrypt)</span>
          </button>
        </div>

        {/* Status / Alert Message */}
        {statusMessage && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Output Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              النتيجة:
            </label>
            {outputText && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>نسخ النتيجة</span>
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            rows={4}
            value={outputText}
            readOnly
            placeholder="ستظهر النتيجة المشفرة أو النص بعد فك التشفير هنا..."
            className="w-full rounded-xl border border-slate-200 bg-slate-100/70 p-3.5 text-xs leading-relaxed text-slate-800 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:placeholder-slate-600 resize-none font-mono focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
