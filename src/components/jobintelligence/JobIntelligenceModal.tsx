import React from 'react';
import { JobOpportunity, UserProfile } from '../../types';
import { MatchScore } from '../common/MatchScore';
import { EvidenceBadge } from '../common/EvidenceBadge';
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Cpu,
  FileText,
  Building,
  MapPin,
  Briefcase,
  ArrowRight,
  Database,
  Calendar,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface JobIntelligenceModalProps {
  job: JobOpportunity | null;
  profile: UserProfile;
  onClose: () => void;
  onSimulateJobGaps: (job: JobOpportunity) => void;
  onTailorResume: (job: JobOpportunity) => void;
}

export const JobIntelligenceModal: React.FC<JobIntelligenceModalProps> = ({
  job,
  profile,
  onClose,
  onSimulateJobGaps,
  onTailorResume
}) => {
  if (!job) return null;

  // Find user evidence for the strong matches
  const getEvidenceForSkill = (skillName: string) => {
    const userSkill = profile.skills.find(
      (s) => s.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.name.toLowerCase())
    );
    return userSkill ? userSkill.evidence : [];
  };

  const isDemo = job.isVerified !== false;
  const sourceName = job.sourceName || `${(job.companyName || job.company)} Careers / Greenhouse Public Portal`;
  const retrievedAt = job.retrievedAt || 'Q1 2026 Verified Benchmark';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-3xl w-full my-6 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Job Intelligence & Compatibility Audit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
              <Database className="w-2.5 h-2.5 text-emerald-600" />
              <span>{job.isVerified || !isDemo ? 'REAL JOB' : 'Demo Benchmark Dataset'}</span>
            </span>
            {Boolean(job.sourceUrl || job.sourceUrl) && (
              <a
                href={job.sourceUrl || job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition-colors"
              >
                <span>View Original Job</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto text-xs">
          
          {/* Header & Large Compatibility Score */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {(job.companyName || job.company)}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-500 font-mono">ID: {job.id}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location} ({job.workplaceType})</span>
                </span>
                <span>·</span>
                <span>{job.employmentType}</span>
                <span>·</span>
                <span className="font-mono text-indigo-700 font-semibold">{job.salary}</span>
              </div>
            </div>

            {/* Large Compatibility Score Gauge */}
            <div className="shrink-0 flex items-center justify-center">
              <MatchScore score={job.matchScore} size="lg" />
            </div>
          </div>

          {/* Audit & Provenance Metadata Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Opportunity Source</span>
              <span className="font-semibold text-slate-800">{sourceName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Retrieval & Telemetry Date</span>
              <span className="font-mono text-slate-700">{retrievedAt}</span>
            </div>
          </div>

          {/* "Why This Match?" Transparent Explanation */}
          <div className="rounded-2xl p-5 border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Why This Match? (Profile Analysis)</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                PRAVRIDDHI ANALYSIS
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              "{job.aiExplanation}"
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-indigo-100 font-mono text-[11px] text-slate-600">
              Calculation: Match = ({job.matchedSkills.length} Verified Core × 1.0) + ({job.developingSkills.length} Claimed × 0.5) / {job.matchedSkills.length + job.developingSkills.length + job.missingSkills.length} Total Requirements = {job.matchScore}%
            </div>
          </div>

          {/* 3 Technical Columns: Strong Matches, Developing Skills, Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1: Strong Matches */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Strong Matches ({job.matchedSkills.length})</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Verified demonstrated capabilities in your Twin:
              </p>
              <div className="space-y-2">
                {job.matchedSkills.map((skillName) => {
                  const evidenceList = getEvidenceForSkill(skillName);
                  return (
                    <div key={skillName} className="p-2.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                      <span className="text-xs font-semibold text-slate-900 block mb-1">
                        {skillName}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {evidenceList.length > 0 ? (
                          evidenceList.map((ev) => (
                            <EvidenceBadge key={ev.id} type={ev.type} score={ev.score} title={ev.title} />
                          ))
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-medium">Demonstrated via Portfolio</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Developing Skills */}
            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Developing Skills ({job.developingSkills.length})</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Claimed / moderate familiarity (needs code proof):
              </p>
              <div className="space-y-2">
                {job.developingSkills.map((skillName) => (
                  <div key={skillName} className="p-2.5 rounded-xl bg-white border border-amber-100 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-900 block mb-0.5">
                      {skillName}
                    </span>
                    <span className="text-[10px] text-amber-800 font-medium">
                      Claimed Familiarity · Missing verifiable test suite
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Missing Skills (Critical Gaps) */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Critical Skill Gaps ({job.missingSkills.length})</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Primary filter risks required for this position:
              </p>
              <div className="space-y-2">
                {job.missingSkills.map((skillName) => (
                  <div key={skillName} className="p-2.5 rounded-xl bg-white border border-rose-100 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-900 block mb-0.5">
                      {skillName}
                    </span>
                    <span className="text-[10px] text-rose-700">
                      Not detected in active Twin profile
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Overview & Requirements */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              title Scope & Requirements
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.description}
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            <strong>Platform Notice:</strong> Job matches and telemetry are synthesized for career planning and skill gap guidance. Pravriddhi does not guarantee employment offers or contractual hiring outcomes.
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Target Job ID: <span className="font-mono">{job.id}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onTailorResume(job)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tailor Resume</span>
            </button>

            <button
              onClick={() => onSimulateJobGaps(job)}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Simulate Missing Skills</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
