import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

interface LiveWebBadgeProps {
  label?: string;
  sourceCount?: number;
  className?: string;
}

export const LiveWebBadge: React.FC<LiveWebBadgeProps> = ({
  label = 'Google Search Grounding',
  sourceCount,
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50/80 border border-indigo-200/80 text-indigo-800 shadow-2xs ${className}`}
      title="Synthesized using real-time Google Search data grounded via Gemini"
    >
      <Globe className="w-3 h-3 text-indigo-600 animate-spin-slow" />
      <span>{label}</span>
      {sourceCount !== undefined && sourceCount > 0 && (
        <>
          <span className="text-indigo-300">·</span>
          <span className="font-mono text-indigo-700 font-bold">{sourceCount} sources</span>
        </>
      )}
    </span>
  );
};
