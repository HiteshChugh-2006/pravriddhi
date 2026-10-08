import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  type?: 'card' | 'table' | 'metric';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 3,
  className = '',
  type = 'card'
}) => {
  if (type === 'metric') {
    return (
      <div className={`p-5 rounded-2xl bg-white/70 border border-slate-200/80 animate-pulse ${className}`}>
        <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
        <div className="h-8 w-16 bg-slate-300 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-200 rounded" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3 animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-none">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/5" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl bg-white/70 border border-slate-200/80 space-y-4 animate-pulse ${className}`}>
      <div className="h-5 w-48 bg-slate-300 rounded" />
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded w-full" />
        <div className="h-3.5 bg-slate-200 rounded w-4/5" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-20 bg-slate-200 rounded" />
        <div className="h-6 w-20 bg-slate-200 rounded" />
        <div className="h-6 w-20 bg-slate-200 rounded" />
      </div>
    </div>
  );
};
