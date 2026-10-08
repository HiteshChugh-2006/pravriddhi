import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Zap, Target, Cpu, TrendingUp } from 'lucide-react';
import { UserProfile } from '../../types';

interface LandingViewProps {
  profile: UserProfile;
  onLaunchTwin: () => void;
  onExploreRadar: () => void;
  onTrySimulator: () => void;
  onGetStarted?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  profile,
  onLaunchTwin,
  onExploreRadar,
  onTrySimulator,
  onGetStarted
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        {/* Ambient subtle light glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/30 via-violet-200/20 to-cyan-200/30 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-xs font-semibold text-indigo-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Workforce Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
            Understand Skills. Predict Demand.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
              Simulate Careers.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
            Pravriddhi builds an evidence-verified Career Digital Twin of your capabilities, tracks live market telemetry, and models your exact trajectory to high-impact roles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            {onGetStarted && (
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>Get Started — Build Career Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            <button
              onClick={onLaunchTwin}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <span>Explore My Career Twin</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </button>

            <button
              onClick={onTrySimulator}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white/90 border border-slate-200/90 rounded-xl hover:bg-white hover:border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Run What-If Simulator</span>
            </button>
          </div>

          {/* Trust proof points */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Evidence-Verified Skills</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>240k+ Active Market Telemetry Nodes</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-violet-600" />
              <span>Deterministic Career Pathways</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Twin Preview Banner */}
        <div className="max-w-5xl mx-auto mt-12 px-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg shadow-slate-200/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl ring-4 ring-indigo-50 shrink-0">
                  HC
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
                      Twin Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{profile.title} · SF Bay Area</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Target Role</span>
                  <span className="text-base font-bold text-slate-900">{profile.targetRole}</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Live Alignment</span>
                  <span className="text-xl font-extrabold text-indigo-600 font-mono tabular-nums">
                    {profile.targetRoleAlignment}%
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Verified Evidence</span>
                  <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
                    17 Artifacts
                  </span>
                </div>
              </div>
            </div>

            {/* Quick visual preview of Demonstrated vs Claimed */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                  Core Demonstration
                </span>
                <p className="text-sm font-semibold text-slate-900">Python & PyTorch</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>3 Repositories + 98th %tile Exam</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/40 border border-dashed border-amber-200">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 block mb-1">
                  Priority Gap
                </span>
                <p className="text-sm font-semibold text-slate-900">MLOps & Docker</p>
                <div className="mt-2 text-xs text-amber-800">
                  <span>Claimed only · Missing CI/CD evidence</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                  Immediate Impact
                </span>
                <p className="text-sm font-semibold text-slate-900">+10% Match Lift</p>
                <div className="mt-2 text-xs text-indigo-700">
                  <span>Simulating MLOps opens 26 new roles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
            Workforce Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Engineered for Modern Technical Careers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Evidence-Backed Twin</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Resumes claim skills; Pravriddhi validates them. Our twin separates claimed knowledge from demonstrated production evidence across repos, projects, and benchmarks.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Real-Time Market Radar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track shifting technology demands. Understand which skills command 2026 salary premiums (e.g. LLM fine-tuning, RAG, AI agents) and which are commoditizing.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. What-If Trajectory Simulation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test skill acquisition before spending months studying. Simulate learning Docker, Kubernetes, or Ray to project role compatibility gains across top tech companies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
