import React from 'react';
import { Loader2 } from 'lucide-react';
import { ProcessingState } from '../types';

interface ProcessingModalProps {
  state: ProcessingState;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({ state }) => {
  if (!state.isProcessing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="absolute text-[11px] font-bold">{Math.round(state.progress)}%</span>
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {state.statusMessage || 'جاري المعالجة...'}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            تتم المعالجة محلياً في متصفحك بسرعة وأمان
          </p>

          {/* Progress bar */}
          <div className="mt-5 w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300 ease-out"
                style={{ width: `${Math.max(5, state.progress)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
              <span>0%</span>
              <span>{Math.round(state.progress)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
