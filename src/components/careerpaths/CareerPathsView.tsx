import React, { useState } from 'react';
import { getMarketBenchmark } from '../../utils/salaryUtils';
import { CareerRoleNode, UserProfile } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { ProgressRing } from '../common/ProgressRing';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  ChevronRight,
  GitBranch
} from 'lucide-react';

interface CareerPathsViewProps {
  nodes: CareerRoleNode[];
  profile: UserProfile;
  onSetTargetRole: (roleTitle: string, alignment: number) => void;
  onNavigateToSimulator: (roleTitle: string) => void;
  onNavigateToRoadmap?: (roleTitle?: string) => void;
}

export const CareerPathsView: React.FC<CareerPathsViewProps> = ({
  nodes,
  profile,
  onSetTargetRole,
  onNavigateToSimulator,
  onNavigateToRoadmap
}) => {
  const [selectedNode, setSelectedNode] = useState<CareerRoleNode>(
    nodes.find((n) => n.title === profile.targetRole) || nodes[2]
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Interactive Trajectory Navigator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Career Pathways
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore sequential and branching career routes modeled against your CareerTwin profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
            Active Target: {profile.targetRole} ({profile.targetRoleAlignment}%)
          </div>
        </div>
      </div>

      {/* Main Visual Interactive Career Graph */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-3">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Path Architecture
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Applied Intelligence & Systems Engineering Track
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Achieved / Ready (&gt;85%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Target Focus</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Specialized Frontier</span>
            </span>
          </div>
        </div>

        {/* Tree Flow Representation (Desktop + Tablet Grid) */}
        <div className="relative py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            
            {/* Step 1: Foundational (Data Analyst) */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                01. Foundational
              </span>
              {nodes.filter((n) => n.id === 'role_da').map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{node.title}</h4>
                      <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        {node.userAlignment}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 font-mono">{getMarketBenchmark(node.title, profile.location)}</p>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Competency Achieved</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 2: Mid (Data Scientist) */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                02. Quantitative Mid
              </span>
              {nodes.filter((n) => n.id === 'role_ds').map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{node.title}</h4>
                      <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        {node.userAlignment}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 font-mono">{getMarketBenchmark(node.title, profile.location)}</p>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Immediate Fit</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 3: Target Branch (ML Engineer & AI Engineer) */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                03. Target Divergence
              </span>
              <div className="space-y-3">
                {nodes.filter((n) => n.id === 'role_mle' || n.id === 'role_aie').map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  const isTarget = profile.targetRole === node.title;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                          : isTarget
                          ? 'bg-indigo-50/40 border-indigo-200'
                          : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{node.title}</h4>
                          {isTarget && (
                            <span className="text-[10px] font-bold text-indigo-700 block">
                              Active Target
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                          {node.userAlignment}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 font-mono">{getMarketBenchmark(node.title, profile.location)}</p>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{node.timeToTransition} to bridge</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Specialized / Executive (MLOps & Staff AI Architect) */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                04. Advanced Horizons
              </span>
              <div className="space-y-3">
                {nodes.filter((n) => n.id === 'role_mlops' || n.id === 'role_staff_ai').map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-white/80 border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-900">{node.title}</h4>
                        <span className="text-[10px] font-bold font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                          {node.userAlignment}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 font-mono">{getMarketBenchmark(node.title, profile.location)}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <span>Demand: <strong>{node.industryDemand}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Role Node Deep Intelligence Card */}
      {selectedNode && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Role Deep-Dive Intelligence
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-600">{selectedNode.level} Tier</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedNode.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono font-bold text-slate-900">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{getMarketBenchmark(selectedNode.title, profile.location)} Median</span>
                </span>
                <span>·</span>
                <span className="font-mono text-slate-500">{selectedNode.openingsCount}</span>
                <span>·</span>
                <span className="font-semibold text-emerald-700">Demand: {selectedNode.industryDemand}</span>
              </div>
            </div>

            {/* User Alignment Ring */}
            <div className="flex items-center gap-4">
              <ProgressRing
                progress={selectedNode.userAlignment}
                size={80}
                strokeWidth={7}
                color={selectedNode.userAlignment >= 80 ? '#10b981' : '#4f46e5'}
                sublabel="Fit"
              />
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-slate-900 block">
                  {selectedNode.timeToTransition}
                </span>
                <span className="text-[11px] text-slate-500 block max-w-[140px]">
                  Estimated roadmap time to close verified gaps
                </span>
              </div>
            </div>
          </div>

          {/* 3 Key Columns: Required Skills, Skill Gaps, Roadmap Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Required Skills */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Required Technical Competencies
              </span>
              <div className="space-y-1.5">
                {selectedNode.requiredSkills.map((sk) => {
                  const hasIt = profile.skills.some((s) => s.name.toLowerCase().includes(sk.toLowerCase()));
                  return (
                    <div key={sk} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                      <span className="font-medium text-slate-800">{sk}</span>
                      {hasIt ? (
                        <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Matched</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 font-medium text-[11px]">
                          Gap
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                Priority Technical Gaps
              </span>
              {selectedNode.skillGaps.length === 0 ? (
                <div className="p-3 bg-white rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero structural gaps for this role!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedNode.skillGaps.map((gap) => (
                    <div key={gap} className="p-2.5 rounded-xl bg-white border border-rose-100 text-xs shadow-2xs">
                      <span className="font-semibold text-slate-900 block mb-0.5">{gap}</span>
                      <span className="text-[10px] text-rose-600">High priority gating criteria</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Transition Steps */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-3">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                Recommended Action Roadmap
              </span>
              <div className="space-y-2">
                {selectedNode.nextSteps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-indigo-100 text-xs shadow-2xs">
                    <span className="font-bold text-indigo-700 font-mono text-[10px] block mb-0.5">
                      STEP 0{idx + 1}
                    </span>
                    <span className="text-slate-700 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Select this role as your active CareerTwin benchmark to calibrate JobRadar matching.
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onSetTargetRole(selectedNode.title, selectedNode.userAlignment)}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  profile.targetRole === selectedNode.title
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-default'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
                disabled={profile.targetRole === selectedNode.title}
              >
                {profile.targetRole === selectedNode.title ? 'Current Target' : 'Set as Target Role'}
              </button>

              {onNavigateToRoadmap && (
                <button
                  onClick={() => onNavigateToRoadmap(selectedNode.title)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive Roadmap</span>
                </button>
              )}

              <button
                onClick={() => onNavigateToSimulator(selectedNode.title)}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate This Trajectory</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
