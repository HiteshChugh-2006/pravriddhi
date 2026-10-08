import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Target, Compass, Sparkles, MapPin, Briefcase, GraduationCap, Check } from 'lucide-react';
import { OnboardingSkill } from './SkillsStep';

interface PlanNextMoveStepProps {
  name: string;
  country: string;
  preferredLocation: string;
  degreeField: string;
  targetRoleTitle: string;
  workPreference: string;
  skills: OnboardingSkill[];
  onFinalize: () => void;
  onBack: () => void;
}

export const PlanNextMoveStep: React.FC<PlanNextMoveStepProps> = ({
  name,
  country,
  preferredLocation,
  degreeField,
  targetRoleTitle,
  workPreference,
  skills,
  onFinalize,
  onBack
}) => {
  const strengths = skills.filter((s) => s.proficiency >= 70 || s.level === 'Advanced');
  const loc = preferredLocation || country || 'Global';

  // Calculate readiness score
  const readinessScore = Math.min(
    95,
    Math.max(
      45,
      Math.round((strengths.length / Math.max(4, skills.length)) * 100)
    )
  );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Step 8 of 8 · Plan Your Next Move</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Your Career Roadmap is Ready
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Here is your personalized summary and 3 immediate steps to reach <strong>{targetRoleTitle}</strong>.
        </p>
      </div>

      {/* Summary Profile Showcase Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Candidate Profile
              </span>
              <h3 className="text-2xl font-bold text-white">
                {name || 'Alex Morgan'}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-200">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {degreeField}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {loc}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold">
                  {workPreference}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center shrink-0">
              <span className="text-3xl font-black font-mono text-emerald-400 block">
                {readinessScore}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">
                Target Alignment
              </span>
            </div>
          </div>

          {/* Verified Strengths List */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
              Verified Strengths ({strengths.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {strengths.map((sk) => (
                <span
                  key={sk.name}
                  className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sk.name}</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 3 Clear Action Steps */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Your 3 Immediate Action Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Build Missing Skills
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target containerization and production deployment tools to bridge your primary gap for {targetRoleTitle}.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Ship a Portfolio Project
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your verified Python and SQL skills into an end-to-end service with clean documentation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Apply to Matched Roles
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target companies in {country || 'your region'} with job requirements aligned to your strengths.
            </p>
          </div>

        </div>
      </div>

      {/* Final Action & CTA: Enter My Career Dashboard */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={onFinalize}
          className="w-full sm:flex-1 max-w-md py-4 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Enter My Career Dashboard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
