import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

interface SkillChipProps {
  name: string;
  status?: 'matched' | 'developing' | 'missing' | 'neutral' | 'active';
  onClick?: () => void;
  className?: string;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  status = 'neutral',
  onClick,
  className = ''
}) => {
  const getStyle = () => {
    switch (status) {
      case 'matched':
        return {
          wrapper: 'text-emerald-800 bg-emerald-50/70 border-emerald-200/80',
          icon: <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
        };
      case 'developing':
        return {
          wrapper: 'text-amber-800 bg-amber-50/70 border-amber-200/80',
          icon: <AlertTriangle className="w-3 h-3 text-amber-600 stroke-[2.2]" />
        };
      case 'missing':
        return {
          wrapper: 'text-rose-800 bg-rose-50/70 border-rose-200/80',
          icon: <X className="w-3 h-3 text-rose-600 stroke-[2.5]" />
        };
      case 'active':
        return {
          wrapper: 'text-indigo-900 bg-indigo-50 border-indigo-300 font-semibold',
          icon: null
        };
      default:
        return {
          wrapper: 'text-slate-700 bg-slate-100/80 border-slate-200',
          icon: null
        };
    }
  };

  const style = getStyle();

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
        style.wrapper
      } ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
    >
      {style.icon}
      <span>{name}</span>
    </span>
  );
};
