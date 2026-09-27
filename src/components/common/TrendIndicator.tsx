import React from 'react';
import { ArrowUpRight, ArrowRight, ArrowDownRight } from 'lucide-react';

interface TrendIndicatorProps {
  value: string | number;
  direction?: 'up' | 'down' | 'neutral';
  arrows?: '↑↑↑' | '↑↑' | '↑' | '→';
  className?: string;
  showIcon?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  direction = 'up',
  arrows,
  className = '',
  showIcon = true
}) => {
  const isUp = direction === 'up' || (typeof value === 'number' && value > 0) || (typeof value === 'string' && value.startsWith('+'));
  const isDown = direction === 'down' || (typeof value === 'number' && value < 0) || (typeof value === 'string' && value.startsWith('-'));

  const colorClass = isUp
    ? 'text-emerald-700 font-medium'
    : isDown
    ? 'text-rose-700 font-medium'
    : 'text-slate-600 font-medium';

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs tabular-nums ${colorClass} ${className}`}>
      {arrows ? (
        <span className="tracking-tighter font-bold">{arrows}</span>
      ) : showIcon ? (
        isUp ? (
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        ) : isDown ? (
          <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        )
      ) : null}
      <span>{value}</span>
    </span>
  );
};
