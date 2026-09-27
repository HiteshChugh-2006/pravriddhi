import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  TrendingUp,
  Layers,
  FileCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { ATSBreakdown } from '../../types/resume';

interface ATSScoreCardProps {
  breakdown: ATSBreakdown;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ breakdown }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <span className="font-mono text-xl font-extrabold text-indigo-700">
              {breakdown.overallScore}%
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                ATS Alignment Score
              </h2>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getScoreColor(breakdown.overallScore)}`}>
                {breakdown.overallScore >= 80 ? 'Competitive' : 'Developing'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Deterministic scoring based on target role keywords and verified evidence.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold transition-colors shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Sub-Metrics Progress Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Keyword Coverage
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-slate-900">{breakdown.keywordCoverage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.keywordCoverage}%` }} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Skill Coverage
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-slate-900">{breakdown.skillCoverage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.skillCoverage}%` }} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Exp Relevance
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-slate-900">{breakdown.experienceRelevance}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.experienceRelevance}%` }} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Project Relevance
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-slate-900">{breakdown.projectRelevance}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.projectRelevance}%` }} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Role Alignment
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-slate-900">{breakdown.roleAlignment}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${breakdown.roleAlignment}%` }} />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Structure (ATS)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-slate-900">{breakdown.resumeStructure}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${breakdown.resumeStructure}%` }} />
          </div>
        </div>
      </div>

      {/* Keywords Breakdown Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
        {/* Matched Keywords */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Matched Keywords ({breakdown.matchedKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {breakdown.matchedKeywords.map((kw) => (
              <span key={kw} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-medium">
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Missing Keywords ({breakdown.missingKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {breakdown.missingKeywords.length > 0 ? (
              breakdown.missingKeywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 text-[10px] font-medium">
                  ○ {kw}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400">All target keywords covered!</span>
            )}
          </div>
        </div>

        {/* Weak Evidence */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Weak Evidence (Only in skills list)</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {breakdown.weakEvidenceKeywords.length > 0 ? (
              breakdown.weakEvidenceKeywords.map((kw) => (
                <span key={kw} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-medium">
                  △ {kw}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400">Evidence verified in projects or experience!</span>
            )}
          </div>
        </div>
      </div>

      {/* "How is this calculated?" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Transparent ATS Calculation Model
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {breakdown.calculationExplanation}
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Scoring Weight Distribution
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Keyword Coverage (30%)</span>
                  <span className="text-slate-600">Density & placement of role technologies across document</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Required Skill Match (25%)</span>
                  <span className="text-slate-600">Explicit overlap with core mandatory role requirements</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Experience Relevance (15%)</span>
                  <span className="text-slate-600">Evidence demonstrated in actual production work history</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Role Alignment (10%)</span>
                  <span className="text-slate-600">Target role title reflected in professional executive summary</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">ATS Parsing Structure (10%)</span>
                  <span className="text-slate-600">Linear layout, standard headers, no non-parsable columns</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-800">Achievement Quality (10%)</span>
                  <span className="text-slate-600">Action verbs and demonstrable engineering outcomes</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
