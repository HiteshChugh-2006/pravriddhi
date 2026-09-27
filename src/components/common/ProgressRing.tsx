import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 9,
  color = '#4f46e5', // indigo-600
  trackColor = '#e2e8f0', // slate-200
  label,
  sublabel,
  showPercent = true
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {showPercent && (
            <span className="text-xl md:text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
              {clampedProgress}%
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs font-medium text-slate-600">
          {label}
        </span>
      )}
    </div>
  );
};
