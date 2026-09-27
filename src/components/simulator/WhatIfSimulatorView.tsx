import React, { useState } from 'react';
import { UserProfile, SimulationResult } from '../../types';
import { calculateCareerSimulation } from '../../services/aiService';
import { simulationAvailableSkills } from '../../data/mockData';
import { GlassCard } from '../common/GlassCard';
import { ProgressRing } from '../common/ProgressRing';
import { TrendIndicator } from '../common/TrendIndicator';
import {
  Sparkles,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  RotateCcw,
  AlertTriangle,
  Layers,
  Briefcase,
  TrendingUp,
  Download,
  Info,
  FileCheck
} from 'lucide-react';
import { CareerTwinReportModal } from '../mentor/CareerTwinReportModal';

interface WhatIfSimulatorViewProps {
  profile: UserProfile;
  initialSkillToAdd?: string;
  onCommitToTwin: (skills: string[]) => void;
  onExploreRadar: () => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  profile,
  initialSkillToAdd,
  onCommitToTwin,
  onExploreRadar
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialSkillToAdd ? [initialSkillToAdd] : ['Docker & Containerization', 'MLOps (MLflow & CI/CD)']
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() =>
    calculateCareerSimulation(profile, ['Docker & Containerization', 'MLOps (MLflow & CI/CD)'])
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = calculateCareerSimulation(profile, selectedSkills);
      setSimulationResult(result);
      setIsSimulating(false);
      setHasSimulated(true);
    }, 600);
  };

  const handleReset = () => {
    setSelectedSkills([]);
    const result = calculateCareerSimulation(profile, []);
    setSimulationResult(result);
    setHasSimulated(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Simulation Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>SIMULATION TELEMETRY:</strong> Projections model live workforce data & employer criteria. Outcomes represent synthetic capacity estimates, not guaranteed employment.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-700 uppercase font-bold shrink-0 hidden sm:inline">
          Model v2.6.4
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Workforce Simulation Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            What-If Career Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Test candidate skills to project quantifiable alignment shifts across target roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasSimulated && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={runSimulation}
            disabled={isSimulating || selectedSkills.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSimulating ? 'Computing Telemetry...' : 'SIMULATE FUTURE'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Interface: Inputs & Baseline vs Simulation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Current Baseline & Candidate Skill Lab (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Baseline Twin Card */}
          <div className="glass-card rounded-2xl p-5 border border-white/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current CareerTwin
              </span>
              <span className="text-[11px] font-mono text-indigo-700 font-semibold">
                Baseline Benchmark
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{profile.targetRole}</h3>
                <p className="text-xs text-slate-500">Active benchmark target</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {profile.targetRoleAlignment}%
                </span>
                <span className="text-[10px] text-slate-400 block">Baseline Match</span>
              </div>
            </div>

            {/* Identified Skill Gaps in Current Twin */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block">
                Current Priority Gaps
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  ⚠ Docker & Containerization
                </span>
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  ⚠ MLOps (MLflow / CI/CD)
                </span>
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  ⚠ AWS SageMaker
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Skill Selector Lab */}
          <div className="glass-card rounded-2xl p-5 border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select Skills to Simulate
                </h3>
                <p className="text-xs text-slate-500">
                  Click to add capabilities to your synthetic twin
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700">
                {selectedSkills.length} selected
              </span>
            </div>

            <div className="space-y-2">
              {simulationAvailableSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.name);
                return (
                  <div
                    key={skill.id}
                    onClick={() => toggleSkill(skill.name)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="block text-slate-900">{skill.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {skill.category} · {skill.difficulty} effort
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-emerald-700 font-bold text-[11px] shrink-0">
                      +{skill.alignmentImpact}%
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating || selectedSkills.length === 0}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Simulate Selected Skills</span>
            </button>
          </div>
        </div>

        {/* Right Column: Projected Simulated Twin Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 space-y-6 relative overflow-hidden">
            {/* Simulation Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 rounded-sm">
                  SIMULATION
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Projected Twin Telemetry
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Delta Engine
              </span>
            </div>

            {/* Before -> After Alignment Hero */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 border border-slate-200/80">
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Baseline
                </span>
                <p className="text-3xl font-mono font-bold text-slate-500 tabular-nums">
                  {simulationResult.initialAlignment}%
                </p>
                <span className="text-xs text-slate-400 block">{profile.targetRole}</span>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-indigo-600" />
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                  +{simulationResult.delta}% Lift
                </span>
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Simulated Twin
                </span>
                <p className="text-4xl font-mono font-extrabold text-indigo-600 tabular-nums">
                  {simulationResult.simulatedAlignment}%
                </p>
                <span className="text-xs font-bold text-slate-900 block">
                  Top-Tier Candidate
                </span>
              </div>
            </div>

            {/* Strategic Advice Callout */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
              <p className="font-medium text-indigo-950 mb-1">
                Workforce Intelligence Forecast:
              </p>
              <p>{simulationResult.strategicAdvice}</p>
            </div>

            {/* Multi-Role Compatibility Impact Comparison */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Multi-Role Projected Compatibility Shifts
              </span>
              <div className="space-y-2.5">
                {simulationResult.roleCompatibilities.map((roleComp) => (
                  <div
                    key={roleComp.role}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{roleComp.role}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {roleComp.before}% &rarr; {roleComp.after}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 sm:w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${roleComp.after}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-xs w-12 text-right">
                        +{roleComp.delta}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocked Jobs & Remaining Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Estimated Unlocked Jobs
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-slate-900">
                    +{simulationResult.newJobsUnlocked}
                  </span>
                  <span className="text-xs text-indigo-600 font-medium">New Matches</span>
                </div>
                <button
                  onClick={onExploreRadar}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Browse JobRadar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Remaining Gaps to Target
                </span>
                <div className="space-y-1">
                  {simulationResult.remainingPriorityGaps.map((gap) => (
                    <span key={gap} className="text-xs text-slate-700 block truncate">
                      · {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export CareerTwin PDF Report</span>
              </button>

              <button
                onClick={() => onCommitToTwin(selectedSkills)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Commit to CareerTwin Target</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Database-Backed CareerTwin PDF Report Modal */}
      <CareerTwinReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        simulationSkills={selectedSkills}
        initialMode="preview"
      />
    </div>
  );
};
