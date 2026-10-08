import React from 'react';
import { UserSkill, Evidence } from '../../types';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  FolderGit2,
  Award,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Target,
  ArrowRight,
  Info,
  Briefcase
} from 'lucide-react';

interface SkillDetailModalProps {
  skill: UserSkill | null;
  isOpen: boolean;
  onClose: () => void;
  targetRoleTitle?: string;
  onSimulateSkill?: (skillName: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  isOpen,
  onClose,
  targetRoleTitle = 'ML Engineer',
  onSimulateSkill
}) => {
  if (!isOpen || !skill) return null;

  const isDemonstrated = skill.type === 'demonstrated' && skill.evidence.length > 0;
  const targetProficiency = 85;
  const remainingGap = Math.max(0, targetProficiency - skill.proficiency);

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'Project':
        return <FolderGit2 className="w-4 h-4 text-indigo-600" />;
      case 'Assessment':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'Certification':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'Resume':
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-xl w-full my-6 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {skill.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {skill.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                CareerTwin Evidence & Capability Audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Status & Proficiency Gauge Lockup */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Proficiency</span>
              <span className="text-xl font-extrabold font-mono text-slate-900">{skill.proficiency}%</span>
              <span className="text-[11px] text-slate-500 block">Years: {skill.yearsExp || 1}+ yrs</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Validation Status</span>
              {isDemonstrated ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Demonstrated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-xs mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Claimed (Unverified)
                </span>
              )}
              <span className="text-[10px] text-slate-400 block font-mono">
                {isDemonstrated ? 'High Confidence (1.0×)' : 'Moderate Weight (0.5×)'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Remaining Gap</span>
              <span className={`text-xl font-bold font-mono ${remainingGap > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {remainingGap > 0 ? `-${remainingGap}%` : 'At Target'}
              </span>
              <span className="text-[10px] text-slate-400 block">Target: {targetProficiency}%</span>
            </div>
          </div>

          {/* Core Verification Principle Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-[11px] text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Evaluation Standard:</strong> A skill mentioned in a resume is recorded as <strong>Claimed</strong>. Demonstrating expert proficiency requires an accessible code repository, continuous production deployment, or accredited third-party benchmark test.
            </p>
          </div>

          {/* Evidence Artifacts List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Verifiable Evidence Artifacts ({skill.evidence.length})
              </span>
              <span className="text-[10px] text-slate-400">
                Audit Trail
              </span>
            </div>

            {skill.evidence.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-slate-500">
                No external verification artifacts attached yet. Add a GitHub repository or assessment to verify this skill.
              </div>
            ) : (
              <div className="space-y-2">
                {skill.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEvidenceIcon(ev.type)}
                        <span className="font-bold text-slate-900 text-xs">{ev.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {ev.type}
                      </span>
                    </div>

                    {ev.score && (
                      <p className="text-[11px] text-emerald-700 font-mono font-semibold pl-6">
                        Verified Score: {ev.score}
                      </p>
                    )}

                    {ev.url && (
                      <div className="pl-6 pt-0.5">
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-mono break-all"
                        >
                          <span>{ev.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Demand & Related Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Market Demand Telemetry</span>
              <span className="font-bold text-slate-800 text-xs">
                {skill.marketDemand || 'Surging'} Demand (2026 Index)
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">Source: Platform Benchmark Data</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Related Roles</span>
              <span className="font-medium text-slate-700 text-xs block">
                {targetRoleTitle}, AI Platform Engineer, Systems Architect
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            Close
          </button>

          {onSimulateSkill && (
            <button
              onClick={() => {
                onClose();
                onSimulateSkill(skill.name);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Simulate Skill in Trajectory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
