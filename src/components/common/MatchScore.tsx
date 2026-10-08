import React from 'react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const getBadgeStyle = () => {
    if (score >= 80) {
      return {
        bg: 'bg-emerald-50/80 border-emerald-200/90 text-emerald-800',
        ring: 'text-emerald-600',
        text: 'High Match'
      };
    }
    if (score >= 65) {
      return {
        bg: 'bg-indigo-50/80 border-indigo-200/90 text-indigo-800',
        ring: 'text-indigo-600',
        text: 'Good Match'
      };
    }
    return {
      bg: 'bg-amber-50/80 border-amber-200/90 text-amber-800',
      ring: 'text-amber-600',
      text: 'Developing'
    };
  };

  const style = getBadgeStyle();

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${style.bg} ${className}`}>
        <span className="font-mono text-5xl font-extrabold tracking-tight tabular-nums">
          {score}%
        </span>
        <span className="mt-1 text-xs font-semibold tracking-wider uppercase opacity-90">
          Match Compatibility
        </span>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-mono font-semibold tabular-nums ${style.bg} ${className}`}>
        <span>{score}%</span>
        {showLabel && <span className="text-[10px] font-sans font-medium uppercase">Match</span>}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-mono font-bold tabular-nums ${style.bg} ${className}`}>
      <span className="text-base">{score}%</span>
      {showLabel && <span className="text-xs font-sans font-semibold tracking-wide uppercase">Match</span>}
    </div>
  );
};
