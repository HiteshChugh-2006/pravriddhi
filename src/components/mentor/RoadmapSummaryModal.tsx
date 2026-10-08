import React from 'react';
import { UserProfile, SimulationResult } from '../../types';
import { calculateCareerSimulation } from '../../services/aiService';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Cpu,
  Calendar,
  FileText,
  Award,
  Sparkles
} from 'lucide-react';

interface RoadmapSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  simulationSkills?: string[];
}

export const RoadmapSummaryModal: React.FC<RoadmapSummaryModalProps> = ({
  isOpen,
  onClose,
  profile,
  simulationSkills = ['Docker & Containerization', 'MLOps (MLflow & CI/CD)']
}) => {
  if (!isOpen) return null;

  const simResult: SimulationResult = calculateCareerSimulation(profile, simulationSkills);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const documentId = `ST-ROADMAP-2026-${profile.id.slice(-4).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# PRAVRIDDHI — EXECUTIVE CAREERTWIN ROADMAP & GAP SUMMARY
Document ID: ${documentId}
Generated Date: ${currentDate}
Candidate: ${profile.name} (${profile.title})
Target Role: ${profile.targetRole}
Current Alignment: ${profile.targetRoleAlignment}%
Simulated Alignment: ${simResult.simulatedAlignment}% (+${simResult.delta}% Lift)

============================================================
1. CAREERTWIN CAPABILITY DIAGNOSIS & PRIORITY GAPS
============================================================
• DEMONSTRATED SKILLS (Backed by code repos & assessments):
${profile.skills
  .filter((s) => s.type === 'demonstrated')
  .map((s) => `  - ${s.name}: ${s.proficiency}% (${s.confidence} confidence, ${s.yearsExp} yrs exp)`)
  .join('\n')}

• CLAIMED SKILLS (Unverified - requires project evidence):
${profile.skills
  .filter((s) => s.type === 'claimed')
  .map((s) => `  - ${s.name}: ${s.proficiency}% (${s.evidence.map((e) => e.title).join(', ')})`)
  .join('\n')}

• CRITICAL MARKET GAPS (Priority gating criteria for ${profile.targetRole}):
  - Docker & Containerization (Missing isolated deployment artifacts)
  - MLOps Automated CI/CD Pipelines (Missing model registry & drift loops)
  - Distributed Cloud Orchestration (Kubernetes / Ray)

============================================================
2. WHAT-IF SIMULATION TELEMETRY
============================================================
Simulated Skill Additions: ${simResult.addedSkills.join(', ')}
Projected Alignment Shift: ${simResult.initialAlignment}% -> ${simResult.simulatedAlignment}% (+${simResult.delta}% Gain)
Newly Unlocked Opportunities: +${simResult.newJobsUnlocked} roles across JobRadar
Multi-Role Trajectory Impact:
${simResult.roleCompatibilities.map((rc) => `  - ${rc.role}: ${rc.before}% -> ${rc.after}% (+${rc.delta}%)`).join('\n')}

============================================================
3. RECOMMENDED 90-DAY LEARNING ROADMAP
============================================================
PHASE 1: DAYS 1 - 30 — CONTAINERIZED MICROSERVICE ARCHITECTURE
• Focus: Docker, Multi-stage builds, Container security, Local testing
• Target Deliverable: Dockerized PyTorch/FastAPI model inference repo with unit tests (<35ms latency)
• Verification Milestone: Zero-error multi-stage build, container registry push to GitHub Packages

PHASE 2: DAYS 31 - 60 — MLOPS & AUTOMATED CI/CD LIFECYCLE
• Focus: MLflow Model Registry, GitHub Actions, Automated drift validation
• Target Deliverable: End-to-end retraining & evaluation pipeline triggered on code commit
• Verification Milestone: Automated model evaluation and model card generation in CI

PHASE 3: DAYS 61 - 90 — CLOUD PRODUCTION & TELEMETRY
• Focus: AWS ECS / EKS, Prometheus metrics, Model serving at scale
• Target Deliverable: Live deployed inference endpoint with latency telemetry
• Verification Milestone: Documented zero-downtime canary rollout proof

============================================================
DISCLAIMER: Modeled against live 2026 workforce telemetry. Synthesized via Pravriddhi & Gemini 3.8 Flash. Not a guarantee of employment.
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pravriddhi_90Day_Roadmap_${profile.name.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full my-8 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar (Hidden in print) */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Executive CareerTwin Roadmap & Gap Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-6 sm:p-10 space-y-8 overflow-y-auto" id="printable-roadmap-summary">
          
          {/* Document Header Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold text-indigo-700 tracking-wider uppercase">
                  Pravriddhi Workforce Intelligence
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-[11px] text-slate-500">{documentId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                CareerTwin Strategic Roadmap
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Diagnostic Capability Gap Assessment & 90-Day Transition Telemetry
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 shrink-0">
              <span className="text-xs font-mono font-medium text-slate-500 block">
                Generated: {currentDate}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Telemetry</span>
              </span>
            </div>
          </div>

          {/* Profile & Score Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Candidate</span>
              <p className="text-sm font-bold text-slate-900">{profile.name}</p>
              <p className="text-xs text-slate-500 truncate">{profile.title}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Role</span>
              <p className="text-sm font-bold text-slate-900">{profile.targetRole}</p>
              <p className="text-xs text-indigo-600 font-medium">Applied Systems Track</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Baseline Alignment</span>
              <p className="text-xl font-bold font-mono text-slate-800">{profile.targetRoleAlignment}%</p>
              <p className="text-xs text-emerald-700 font-mono">+{profile.alignmentTrend}% Velocity</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Simulated Alignment</span>
              <p className="text-xl font-extrabold font-mono text-indigo-600">
                {simResult.simulatedAlignment}%
              </p>
              <p className="text-xs font-mono font-bold text-emerald-700">+{simResult.delta}% Projected Lift</p>
            </div>
          </div>

          {/* ============================================================
              SECTION 1: CareerTwin Gaps & Diagnosis
              ============================================================ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. CareerTwin Capability Diagnosis & Priority Gaps
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Demonstrated Strengths */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Demonstrated Strengths</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {profile.skills
                    .filter((s) => s.type === 'demonstrated')
                    .slice(0, 5)
                    .map((s) => (
                      <div key={s.id} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <span className="font-mono text-emerald-700 font-bold">{s.proficiency}%</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Claimed Familiarity */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Claimed (Unverified)</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {profile.skills
                    .filter((s) => s.type === 'claimed')
                    .map((s) => (
                      <div key={s.id} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none">
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <span className="font-mono text-amber-700 font-medium">{s.proficiency}%</span>
                      </div>
                    ))}
                </div>
                <p className="text-[11px] text-amber-800 italic pt-1">
                  Requires verifiable code artifact to satisfy interview benchmarks.
                </p>
              </div>

              {/* Critical Market Gaps */}
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Critical Market Gaps</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-white border border-rose-100">
                    <span className="font-bold text-slate-900 block">Docker & Containerization</span>
                    <span className="text-[11px] text-rose-700">Missing reproducible container artifacts</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-rose-100">
                    <span className="font-bold text-slate-900 block">MLOps Automated CI/CD</span>
                    <span className="text-[11px] text-rose-700">Missing automated registry & drift tests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              SECTION 2: What-If Simulation Telemetry
              ============================================================ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. What-If Simulation Telemetry
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">
                    Simulated Competency Additions:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {simResult.addedSkills.map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-md bg-white border border-indigo-200 text-xs font-semibold text-indigo-900">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs text-slate-500 block">Market Impact</span>
                  <span className="font-mono text-sm font-bold text-indigo-700">
                    +{simResult.newJobsUnlocked} High-Match Openings
                  </span>
                </div>
              </div>

              {/* Trajectory shifts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {simResult.roleCompatibilities.map((rc) => (
                  <div key={rc.role} className="p-2.5 rounded-xl bg-white border border-indigo-100 text-xs">
                    <span className="font-bold text-slate-900 block truncate">{rc.role}</span>
                    <div className="flex items-baseline justify-between mt-1 font-mono">
                      <span className="text-slate-500 text-[11px]">{rc.before}% &rarr; {rc.after}%</span>
                      <span className="text-emerald-700 font-bold text-xs">+{rc.delta}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================
              SECTION 3: 90-Day Learning Roadmap
              ============================================================ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Recommended 90-Day Learning Roadmap
              </span>
            </div>

            <div className="space-y-4">
              {/* Phase 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-700 uppercase">
                    Phase 1: Days 1 – 30 · Containerized Microservices
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Target: Docker & FastAPI</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Focus:</strong> Multi-stage Docker builds, non-root container security, latency profiling under load.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                  <p><strong>Target Deliverable:</strong> Dockerized PyTorch/FastAPI model inference repo with automated unit tests (&lt;35ms latency).</p>
                  <p><strong>Verification Milestone:</strong> Zero-error build, container registry image published with automated GitHub actions check.</p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-700 uppercase">
                    Phase 2: Days 31 – 60 · MLOps & Automated CI/CD
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Target: MLflow & GitHub Actions</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Focus:</strong> MLflow experiment tracking, model registry transitions, automated data and prediction drift detection.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                  <p><strong>Target Deliverable:</strong> End-to-end retraining & evaluation pipeline triggered on code commit.</p>
                  <p><strong>Verification Milestone:</strong> Automated model evaluation and model card generation in CI passing 100% test coverage.</p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-700 uppercase">
                    Phase 3: Days 61 – 90 · Cloud Production & Telemetry
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Target: AWS ECS / Prometheus</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Focus:</strong> Production container orchestrations, Prometheus observability metrics, GPU memory management.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                  <p><strong>Target Deliverable:</strong> Live deployed inference endpoint with p99 latency telemetry and health probes.</p>
                  <p><strong>Verification Milestone:</strong> Documented zero-downtime canary rollout proof attached to CareerTwin evidence.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Sign-off Footer */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800">Pravriddhi Workforce Intelligence Engine</p>
              <p className="text-[11px]">Grounded via Gemini 3.8 Flash & live 2026 workforce telemetry.</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-mono text-[10px] text-slate-400 block uppercase">
                AUTHENTICATED DOSSIER · CONFIDENTIAL
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                VERIFICATION CODE: PV-2026-{profile.id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
