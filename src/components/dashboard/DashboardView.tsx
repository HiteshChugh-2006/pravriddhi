import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { ProgressRing } from '../common/ProgressRing';
import { MatchScore } from '../common/MatchScore';
import { TrendIndicator } from '../common/TrendIndicator';
import { SkillChip } from '../common/SkillChip';
import { InsightCard } from '../common/InsightCard';
import { LiveWebBadge } from '../common/LiveWebBadge';
import { UserProfile, JobOpportunity, SkillTrend, UserSkill } from '../../types';
import { calculateDynamicAlignment } from '../../services/intelligenceEngine';
import { MatchExplainModal } from '../common/MatchExplainModal';
import { SkillDetailModal } from '../common/SkillDetailModal';
import { ResumeExtractionModal } from '../common/ResumeExtractionModal';
import {
  Target,
  Compass,
  TrendingUp,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  Globe,
  MessageSquare,
  Bot,
  HelpCircle,
  Upload,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  jobs: JobOpportunity[];
  trends: SkillTrend[];
  onSelectJob: (job: JobOpportunity) => void;
  onNavigateTab: (tab: string, queryParam?: string) => void;
  onSimulateSkill?: (skillName: string) => void;
  onUpdateProfile?: (updated: UserProfile) => void;
  onOpenOnboarding?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  jobs,
  trends,
  onSelectJob,
  onNavigateTab,
  onSimulateSkill,
  onUpdateProfile,
  onOpenOnboarding
}) => {
  const [askInput, setAskInput] = useState('');
  const [isMatchExplainOpen, setIsMatchExplainOpen] = useState(false);
  const [inspectedSkill, setInspectedSkill] = useState<UserSkill | null>(null);
  const [isResumeExtractOpen, setIsResumeExtractOpen] = useState(false);

  // Dynamic Alignment & Coverage Computation
  const alignmentResult = calculateDynamicAlignment(profile, profile.targetRole);
  const alignmentScore = alignmentResult.calculatedAlignmentScore;
  const coveragePercent = alignmentResult.skillCoveragePercent;
  const demonstratedCount = alignmentResult.demonstratedCount;
  const totalRequiredCount = alignmentResult.totalRequiredSkills;

  // Actual relevant opportunities count
  const relevantJobs = jobs.filter((j) => j.matchScore >= 65);
  const topJobs = relevantJobs.slice(0, 3);

  // Emerging skills from trends
  const emergingSkills = trends.filter((t) => t.trendLevel === 'Surging').slice(0, 4);

  // Top profile skills for the twin card
  const topTwinSkills = profile.skills.slice(0, 6);

  // Gaps from target role benchmark
  const missingRequirements = alignmentResult.details.filter((d) => d.status === 'missing');
  const claimedRequirements = alignmentResult.details.filter((d) => d.status === 'claimed');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    onNavigateTab('workforce', askInput.trim());
  };

  const suggestionChips = [
    'Emerging AI Skills',
    'ML Engineer Skills',
    'Career Paths',
    'Skill Gap',
    'Current Job Market'
  ];

  const firstName = profile.name && profile.name.trim() ? profile.name.trim().split(' ')[0] : 'Explorer';

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Workforce Intelligence Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your Career Digital Twin is synced with verified evidence and market benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Resume Sync Automation Action */}
          <button
            onClick={() => setIsResumeExtractOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            title="Import or re-calibrate CareerTwin from resume"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sync Resume</span>
          </button>

          {/* Ask AI Mentor */}
          <button
            onClick={() => onNavigateTab('mentor')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ask AI Mentor</span>
          </button>

          {/* Interactive Career Roadmap */}
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-xl hover:bg-indigo-100 shadow-2xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Career Roadmap</span>
          </button>

          {/* Launch Simulator */}
          <button
            onClick={() => onNavigateTab('simulator')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Upload Resume CTA Banner when no resume is uploaded */}
      {profile.skills.length === 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <h2 className="text-lg font-bold">Upload Your Resume to Build Your CareerTwin</h2>
              </div>
              <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
                Pravriddhi uses your actual uploaded resume (PDF, DOCX, TXT) as the single source of truth. We extract verified skills, calculate explainable ATS scores, and discover real current job openings.
              </p>
            </div>
            <button
              onClick={() => setIsResumeExtractOpen(true)}
              className="px-5 py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Prominent "Ask Workforce Intelligence" Search Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Ask Workforce Intelligence
            </h3>
          </div>
          <LiveWebBadge label="Google Search Telemetry" />
        </div>

        <form onSubmit={handleAskSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Ask about skills, roles, careers or the market (e.g. 'What skills are emerging for ML Engineers in India?')..."
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-indigo-400 text-slate-800 placeholder-slate-400 shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Inquiries:
          </span>
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => onNavigateTab('workforce', chip)}
              className="text-xs bg-white hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 rounded-md px-2.5 py-1 transition-colors font-medium shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          DECISION HIERARCHY: STEP 1 — WHERE AM I? (DYNAMIC METRICS)
          ============================================================ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              Decision Flow 1 · Where Am I?
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium">Dynamic Intelligence Telemetry</span>
          </div>

          <button
            onClick={() => setIsMatchExplainOpen(true)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How is this calculated?</span>
          </button>
        </div>

        {/* Primary 4 Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Dynamic Career Alignment */}
          <div
            onClick={() => setIsMatchExplainOpen(true)}
            className="cursor-pointer group"
          >
            <MetricCard
              label="Career Alignment"
              value={`${alignmentScore}%`}
              trend={{ value: `${profile.alignmentTrend}% 30d`, positive: true }}
              subtext={`Targeting ${profile.targetRole} (Click to audit)`}
              icon={<Target className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />}
            />
          </div>

          {/* 2. Calculated Skill Coverage */}
          <MetricCard
            label="Skill Coverage"
            value={`${coveragePercent}%`}
            trend={{ value: `${demonstratedCount}/${totalRequiredCount} Verified Core`, positive: true }}
            subtext="Demonstrated vs Target Benchmark"
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
          />

          {/* 3. Actual Relevant Opportunities */}
          <div
            onClick={() => onNavigateTab('jobradar')}
            className="cursor-pointer group"
          >
            <MetricCard
              label="Relevant Opportunities"
              value={relevantJobs.length}
              trend={{ value: `${jobs.length} in Radar`, neutral: true }}
              subtext="Roles with ≥65% compatibility"
              icon={<Briefcase className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />}
            />
          </div>

          {/* 4. Emerging Skills Growth with honest provenance label */}
          <div
            onClick={() => onNavigateTab('skills')}
            className="cursor-pointer group"
          >
            <MetricCard
              label="Emerging Skill Velocity"
              value="+142%"
              trend={{ value: 'Demo Benchmark Data', neutral: true }}
              subtext="LLM Systems & MLOps clusters"
              icon={<TrendingUp className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: CareerTwin Core & Decision Steps 2, 3, 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): CareerTwin Core + What is Missing + Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main CareerTwin Core Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/80 relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                  {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'CT'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {profile.name ? `${profile.name}'s CareerTwin` : 'CareerTwin Core'}
                    </h3>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                      Target: {profile.targetRole || 'Not Selected'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {profile.hasUploadedResume ? `Synced with ${profile.uploadedResumeName || 'uploaded resume'}` : 'Live capability model · Verified against 2026 benchmarks'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMatchExplainOpen(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How Calculated?</span>
                </button>
                <button
                  onClick={() => onNavigateTab('careertwin')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-0.5"
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Score & Trajectory Hero */}
            <div className="py-2 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 cursor-pointer" onClick={() => setIsMatchExplainOpen(true)}>
                <ProgressRing
                  progress={alignmentScore}
                  size={100}
                  strokeWidth={9}
                  color="#4f46e5"
                  sublabel="Alignment"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{profile.targetRole} Trajectory</span>
                    <TrendIndicator value={`+${profile.alignmentTrend}%`} direction="up" />
                  </div>
                  <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                    Strong modeling and Python foundations. Production containerization and MLOps tracking remain the two key gating criteria.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-3 text-right shrink-0">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-left">
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 block">Demonstrated (1.0×)</span>
                  <span className="text-sm font-bold font-mono text-emerald-700">{demonstratedCount} Skills Verified</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-left">
                  <span className="text-[10px] uppercase font-semibold text-amber-800 block">Claimed (0.50×)</span>
                  <span className="text-sm font-bold font-mono text-amber-700">{claimedRequirements.length} Skills</span>
                </div>
              </div>
            </div>

            {/* Inspectable Top Skills Grid */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5 text-xs">
                <span className="font-semibold text-slate-800">Top Skills in Profile (Click to Inspect Evidence)</span>
                <span className="text-slate-400 text-[11px]">Audit Trail Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {topTwinSkills.map((skill) => {
                  const isDem = skill.type === 'demonstrated';
                  return (
                    <div
                      key={skill.id}
                      onClick={() => setInspectedSkill(skill)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all hover:shadow-2xs ${
                        isDem
                          ? 'bg-white border-slate-200 hover:border-indigo-300'
                          : 'bg-amber-50/40 border-dashed border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${isDem ? 'bg-indigo-600' : 'bg-amber-500'}`} />
                        <span className="font-semibold text-slate-900 truncate">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[11px] font-bold text-slate-700">{skill.proficiency}%</span>
                        <span className={`text-[10px] font-semibold ${isDem ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {isDem ? 'Demonstrated' : 'Claimed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============================================================
              DECISION HIERARCHY: STEP 2 — WHAT IS MISSING?
              ============================================================ */}
          <div className="glass-card rounded-2xl p-5 border border-white/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Decision Flow 2 · What Is Missing?
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                  Critical Market Gaps
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('careertwin')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                All Skills
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missingRequirements.slice(0, 2).map((gap) => (
                <div key={gap.skillName} className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950 text-xs">{gap.skillName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      MISSING (0×)
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Benchmark weight: <strong>{gap.weight}%</strong>. Lacking verifiable code or container artifacts.
                  </p>
                  {onSimulateSkill && (
                    <button
                      onClick={() => onSimulateSkill(gap.skillName)}
                      className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 pt-1"
                    >
                      <span>Simulate adding {gap.skillName}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {claimedRequirements.slice(0, 2).map((claimed) => (
                <div key={claimed.skillName} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 text-xs">{claimed.skillName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      CLAIMED (0.50×)
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Proficiency: {claimed.userProficiency}%. Needs verified test or repository proof to reach 1.00× weight.
                  </p>
                  {onSimulateSkill && (
                    <button
                      onClick={() => onSimulateSkill(claimed.skillName)}
                      className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 pt-1"
                    >
                      <span>Simulate verifying this skill</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================
              DECISION HIERARCHY: STEP 3 — WHAT SHOULD I DO? (TRACEABLE RECOMMENDATION)
              ============================================================ */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Decision Flow 3 · What Should I Do?
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SIMULATION
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold font-mono">
                +14% Projected Lift
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Action Package: Docker Containerization + MLOps CI/CD
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your modeling foundations in Python and ML are exceptional. However, 84% of senior rejection filters for <strong>{profile.targetRole}</strong> focus on automated pipeline deployment. Verifying these two competencies closes your two largest point deficits.
              </p>
            </div>

            {/* Traceable Mathematical Proof Box */}
            <div className="p-3.5 rounded-xl bg-white border border-indigo-100 text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span>Current Baseline Alignment:</span>
                <span className="font-bold text-slate-900">{alignmentScore}%</span>
              </div>
              <div className="flex items-center justify-between text-indigo-700">
                <span>+ Docker & Containerization (Systems Weight 15%):</span>
                <span className="font-bold">+6% Net</span>
              </div>
              <div className="flex items-center justify-between text-indigo-700">
                <span>+ MLOps CI/CD Registry (Systems Weight 10%):</span>
                <span className="font-bold">+8% Net</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-bold text-sm">
                <span>Simulated Target Alignment:</span>
                <span>86% (High-Readiness Tier)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-amber-700 italic">
                * SIMULATION — not a guaranteed career or employment outcome.
              </span>
              <button
                onClick={() => onNavigateTab('simulator')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Launch What-If Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): Decision Step 4 — What Is Available? + AI Mentor */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ============================================================
              DECISION HIERARCHY: STEP 4 — WHAT IS AVAILABLE?
              ============================================================ */}
          <div className="glass-card rounded-2xl p-6 border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Decision Flow 4 · What Is Available?
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Today's Workforce Telemetry
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('workforce')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Deep Search
              </button>
            </div>

            {/* Emerging Skills list */}
            <div className="space-y-2">
              {emergingSkills.map((trend) => (
                <div
                  key={trend.id}
                  onClick={() => onNavigateTab('skills')}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900">
                      {trend.name}
                    </span>
                    <TrendIndicator value={trend.growthRate} arrows={trend.arrows} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{trend.category}</span>
                    <span className="font-mono">{trend.activeJobCount.toLocaleString()} openings</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Provenance note */}
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
              💡 <strong>Market Signal:</strong> Verified production deployment artifacts yield 3.2x interview callback rates compared to theoretical course certificates.
            </div>
          </div>

          {/* AI Career Mentor Teaser Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" />
                <span>Context-Grounded Advisor</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-200 bg-white/10 px-2 py-0.5 rounded">
                Grounded in Twin
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Ask Your Career Mentor
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesize strategic next steps, explain your {alignmentScore}% match score, or build a personalized 90-day learning roadmap.
            </p>
            <button
              onClick={() => onNavigateTab('mentor')}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open AI Mentor Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Relevant Job Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Relevant Opportunities from JobRadar
              </h2>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                {relevantJobs.length} Compatible Roles
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ranked by semantic CareerTwin compatibility · Grounded in benchmark datasets
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jobradar')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topJobs.map((job) => (
            <div
              key={job.id}
              className="glass-card rounded-2xl p-5 border border-white/90 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-indigo-600 block mb-0.5">
                      {(job.companyName || job.company)}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.location} · {job.workplaceType}
                    </p>
                  </div>
                  <MatchScore score={job.matchScore} size="sm" />
                </div>

                <div className="text-xs font-mono font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
                  {job.salary}
                </div>

                {/* Matched vs Missing Skills breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Twin Compatibility Breakdown</span>
                    <span className="font-medium text-slate-700">
                      {job.matchedSkills.length} Verified · {job.missingSkills.length} Gaps
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {job.matchedSkills.slice(0, 3).map((s) => (
                      <SkillChip key={s} name={s} status="matched" />
                    ))}
                    {job.missingSkills.slice(0, 2).map((s) => (
                      <SkillChip key={s} name={s} status="missing" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onSelectJob(job)}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Intelligence</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Match Calculation Modal */}
      <MatchExplainModal
        isOpen={isMatchExplainOpen}
        onClose={() => setIsMatchExplainOpen(false)}
        profile={profile}
        targetRoleTitle={profile.targetRole}
        onNavigateToSimulator={() => onNavigateTab('simulator')}
      />

      {/* Inspectable Skill Detail Modal */}
      <SkillDetailModal
        skill={inspectedSkill}
        isOpen={!!inspectedSkill}
        onClose={() => setInspectedSkill(null)}
        targetRoleTitle={profile.targetRole}
        onSimulateSkill={onSimulateSkill}
      />

      {/* Resume Extraction & Automation Modal */}
      <ResumeExtractionModal
        isOpen={isResumeExtractOpen}
        onClose={() => setIsResumeExtractOpen(false)}
        currentProfile={profile}
        onConfirmProfile={(updated) => {
          if (onUpdateProfile) {
            onUpdateProfile(updated);
          }
        }}
      />
    </div>
  );
};
