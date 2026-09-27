import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InsightCardProps {
  title: string;
  category?: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  badge?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  category = 'Workforce Intelligence',
  children,
  actionText,
  onAction,
  className = '',
  badge
}) => {
  return (
    <div className={`glass-card rounded-2xl p-5 border border-indigo-100/80 bg-gradient-to-br from-white/90 via-white/80 to-indigo-50/30 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{category}</span>
        </div>
        {badge && (
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      <h4 className="text-base font-semibold text-slate-900 tracking-tight mb-2">
        {title}
      </h4>

      <div className="text-sm text-slate-600 leading-relaxed space-y-2">
        {children}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
