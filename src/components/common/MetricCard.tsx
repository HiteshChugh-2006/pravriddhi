import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string | number;
    positive?: boolean;
    neutral?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon,
  className = ''
}) => {
  return (
    <div className={`glass-card rounded-2xl p-5 border border-white/70 ${className}`}>
      <div className="flex items-center justify-between gap-3 text-slate-500 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium font-mono tabular-nums ${
              trend.neutral
                ? 'text-slate-500'
                : trend.positive !== false
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {typeof trend.value === 'number' && trend.value > 0 ? `+${trend.value}%` : trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-500 font-normal leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
