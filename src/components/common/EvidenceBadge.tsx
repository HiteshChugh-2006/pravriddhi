import React from 'react';
import { FileText, FolderGit2, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { EvidenceType } from '../../types';

interface EvidenceBadgeProps {
  type: EvidenceType;
  title?: string;
  score?: string;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  type,
  title,
  score,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'Resume':
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
      case 'Project':
        return <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Assessment':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'GitHub':
        return <FolderGit2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'Certification':
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      title={title || type}
      className={`inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white/90 border border-slate-200/90 rounded-md px-2 py-1 shadow-2xs ${className}`}
    >
      {getIcon()}
      <span className="font-medium text-[11px] text-slate-800">{type}</span>
      {score && (
        <>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-[10px] text-emerald-600 font-semibold">{score}</span>
        </>
      )}
    </div>
  );
};
