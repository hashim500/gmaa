import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock, KeyRound, ShieldAlert } from 'lucide-react';
import { TranslationDict } from '../../i18n/translations';
import { ProcessedResult } from '../../types';
import { FileUploader } from '../FileUploader';
import { protectPdf, unlockPdf } from '../../utils/pdfUtils';

interface ProtectToolProps {
  t: TranslationDict;
  onBack: () => void;
  onProgress: (p: number, msg: string) => void;
  onComplete: (res: ProcessedResult) => void;
  onError: (err: string) => void;
}

export const ProtectTool: React.FC<ProtectToolProps> = ({
  t,
  onBack,
  onProgress,
  onComplete,
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'protect' | 'unlock'>('protect');

  // Protect fields
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Unlock fields
  const [unlockPassword, setUnlockPassword] = useState<string>('');

  const handleProtect = async () => {
    if (!file || !password) return;
    if (password !== confirmPassword) {
      onError(t.tools.protect.passwordsMismatch);
      return;
    }

    try {
      const bytes = await protectPdf(file, password, (p, msg) => {
        onProgress(p, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_protected.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err) {
      console.error(err);
      onError(t.errorProcessing);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;

    try {
      const bytes = await unlockPdf(file, unlockPassword, (p, msg) => {
        onProgress(p, msg);
      });

      const blob = new Blob([bytes], { type: 'application/pdf' });
      onComplete({
        blob,
        filename: `${file.name.replace(/\.[^/.]+$/, '')}_unlocked.pdf`,
        originalSize: file.size,
        newSize: blob.size,
        type: 'pdf',
      });
    } catch (err: any) {
      console.error(err);
      onError(err?.message || 'تعذر فك حماية المستند. تأكد من صحة كلمة المرور إن كانت مطلوبة.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t.backToTools}</span>
        </button>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t.tools.protect.title}
        </h2>
      </div>

      {!file ? (
        <FileUploader
          onFilesSelected={(f) => setFile(f[0])}
          t={t}
          label={t.tools.protect.title}
          hint={t.tools.protect.desc}
        />
      ) : (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          {/* File summary */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
              {file.name}
            </span>
            <span className="text-slate-400">PDF</span>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('protect')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
                activeTab === 'protect'
                  ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{t.tools.protect.tabProtect}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('unlock')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition ${
                activeTab === 'unlock'
                  ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>{t.tools.protect.tabUnlock}</span>
            </button>
          </div>

          {/* TAB 1: Protect */}
          {activeTab === 'protect' && (
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.tools.protect.passwordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.tools.protect.passwordPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.tools.protect.confirmPasswordLabel}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.tools.protect.passwordPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <KeyRound className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                <span>يتم تشفير الملف مباشرة في متصفحك دون إرسال كلمة السر لأي جهة.</span>
              </div>

              <button
                id="btn-execute-protect"
                onClick={handleProtect}
                disabled={!password || password !== confirmPassword}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 disabled:opacity-40"
              >
                <Lock className="h-5 w-5" />
                <span>{t.tools.protect.protectAction}</span>
              </button>
            </div>
          )}

          {/* TAB 2: Unlock */}
          {activeTab === 'unlock' && (
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.tools.protect.passwordLabel} (اختياري إن كان الملف مقيداً بتصاريح)
                </label>
                <input
                  type="password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder={t.tools.protect.unlockPasswordPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldAlert className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                <span>سيتم إزالة قيود التعديل والطباعة وإنشاء نسخة حرة من المستند.</span>
              </div>

              <button
                id="btn-execute-unlock"
                onClick={handleUnlock}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-base font-bold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
              >
                <Unlock className="h-5 w-5" />
                <span>{t.tools.protect.unlockAction}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
