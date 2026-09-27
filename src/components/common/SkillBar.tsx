import React from 'react';
import { UserSkill } from '../../types';
import { EvidenceBadge } from './EvidenceBadge';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface SkillBarProps {
  skill: UserSkill;
  showEvidence?: boolean;
  onInspect?: (skill: UserSkill) => void;
  className?: string;
}

export const SkillBar: React.FC<SkillBarProps> = ({
  skill,
  showEvidence = true,
  onInspect,
  className = ''
}) => {
  const isDemonstrated = skill.type === 'demonstrated';

  return (
    <div
      onClick={() => onInspect && onInspect(skill)}
      className={`p-3.5 rounded-xl transition-all ${
        isDemonstrated
          ? 'bg-white/80 border border-slate-200/90 hover:border-indigo-300'
          : 'bg-amber-50/40 border border-dashed border-amber-200/80 hover:border-amber-300'
      } ${onInspect ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-sm text-slate-900 truncate">
            {skill.name}
          </span>

          {isDemonstrated ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demonstrated</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Claimed</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">
            {skill.confidence} confidence
          </span>
          <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
            {skill.proficiency}%
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isDemonstrated
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 opacity-80'
          }`}
          style={{ width: `${skill.proficiency}%` }}
        />
      </div>

      {/* Evidence row */}
      {showEvidence && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Evidence:</span>
            {skill.evidence.length > 0 ? (
              skill.evidence.map(ev => (
                <EvidenceBadge key={ev.id} type={ev.type} score={ev.score} title={ev.title} />
              ))
            ) : (
              <span className="text-[11px] text-slate-400 italic">No verified artifacts yet</span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0 ml-2">
            {skill.yearsExp} yrs exp
          </span>
        </div>
      )}
    </div>
  );
};
