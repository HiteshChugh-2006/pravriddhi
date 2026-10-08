import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { WorkforceSource } from '../../types';

interface SourceCardProps {
  source: WorkforceSource;
  className?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, className = '' }) => {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className={`p-3 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between group ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1 font-mono font-medium text-slate-600 truncate">
            <Globe className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{source.domain}</span>
          </span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
        </div>

        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
          {source.title}
        </h4>
      </div>

      {source.snippet && (
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1.5 font-normal">
          {source.snippet}
        </p>
      )}

      {source.publishDate && (
        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
          {source.publishDate}
        </span>
      )}
    </a>
  );
};
