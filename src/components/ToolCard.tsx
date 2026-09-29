import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { ToolDefinition } from '../types';
import { TranslationDict } from '../i18n/translations';
import { TOOLS_CONFIG } from '../utils/toolsConfig';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (toolId: ToolDefinition['id']) => void;
  t: TranslationDict;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, t }) => {
  const toolData: { title?: string; desc?: string; badge?: string } =
    (t.tools as any)[tool.titleKey] || (t.tools as any)[tool.id] || {};

  const config = TOOLS_CONFIG[tool.id];
  const Icon = config?.icon || Layers;
  const badgeText = toolData.badge || config?.badgeText;

  return (
    <div
      id={`card-tool-${tool.id}`}
      onClick={() => onSelect(tool.id)}
      className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-black/50 cursor-pointer select-none"
    >
      {/* Top subtle highlight stripe matching tool color */}
      <div
        className={`absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
          config?.colors.bg || 'bg-rose-500'
        }`}
      />

      {/* Top Row: Icon + Badge */}
      <div className="flex items-start justify-between gap-2">
        {/* Colorful Icon Badge */}
        <div
          className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${
            config?.colors.bg || 'bg-rose-500'
          } text-white shadow-sm shadow-slate-300/40 transition-transform duration-200 group-hover:scale-105 dark:shadow-black/40`}
        >
          <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
        </div>

        {/* Small Tag / Badge */}
        {badgeText && (
          <span
            className={`truncate max-w-[85px] sm:max-w-[100px] rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
              config?.colors.lightBg || 'bg-slate-100 dark:bg-slate-800'
            } ${config?.colors.lightText || 'text-slate-700 dark:text-slate-300'}`}
            title={badgeText}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Center content: Title & Description */}
      <div className="my-auto py-1">
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-black text-slate-900 transition-colors group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400 line-clamp-2 leading-tight">
          {toolData.title || tool.id}
        </h3>

        {/* Description */}
        <p className="mt-1 text-[11px] leading-tight text-slate-500 dark:text-slate-400 line-clamp-2">
          {toolData.desc || ''}
        </p>
      </div>

      {/* Bottom Footer hint */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100/90 pt-2 text-[11px] font-bold text-slate-500 transition-all group-hover:text-rose-600 dark:border-slate-800/80 dark:text-slate-400 dark:group-hover:text-rose-400">
        <span>ابدأ</span>
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </div>
    </div>
  );
};
