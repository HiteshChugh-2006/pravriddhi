import React, { useState } from 'react';
import { Layers, ArrowRight, ArrowLeft, CheckCircle2, HelpCircle, Check, Info, X } from 'lucide-react';
import { OnboardingSkill } from './SkillsStep';
import { GLOBAL_CAREER_ROLES } from './CareerGoalStep';

interface SkillGapStepProps {
  skills: OnboardingSkill[];
  targetRoleTitle: string;
  onNext: () => void;
  onBack: () => void;
}

export const SkillGapStep: React.FC<SkillGapStepProps> = ({
  skills,
  targetRoleTitle,
  onNext,
  onBack
}) => {
  // Active reasoning modal or drawer
  const [selectedReasonSkill, setSelectedReasonSkill] = useState<{
    name: string;
    type: 'strength' | 'progress' | 'build';
    reason: string;
  } | null>(null);

  // Find target role definition
  const targetRole = GLOBAL_CAREER_ROLES.find(
    (r) => r.title.toLowerCase() === targetRoleTitle.toLowerCase()
  ) || GLOBAL_CAREER_ROLES[0];

  // 1. YOUR STRENGTHS: in user skills with proficiency >= 70 or Advanced
  const strengths = skills.filter((s) => s.proficiency >= 70 || s.level === 'Advanced');

  // 2. SKILLS IN PROGRESS: in user skills with proficiency < 70 or Beginner
  const inProgress = skills.filter((s) => s.proficiency < 70 && s.level !== 'Advanced');

  // 3. SKILLS TO BUILD: required by target role but missing from user's skills
  const skillsToBuild = targetRole.requiredSkills.filter(
    (req) => !skills.some((s) => s.name.toLowerCase() === req.toLowerCase())
  );

  // Computed alignment percentage
  const totalRequired = Math.max(1, targetRole.requiredSkills.length);
  const matchingStrengthsCount = targetRole.requiredSkills.filter((req) =>
    strengths.some((s) => s.name.toLowerCase() === req.toLowerCase())
  ).length;
  const matchingProgressCount = targetRole.requiredSkills.filter((req) =>
    inProgress.some((s) => s.name.toLowerCase() === req.toLowerCase())
  ).length;

  const matchScore = Math.min(
    95,
    Math.max(
      25,
      Math.round(((matchingStrengthsCount * 1.0 + matchingProgressCount * 0.5) / totalRequired) * 100)
    )
  );

  const getReasonForSkill = (name: string, type: 'strength' | 'progress' | 'build'): string => {
    const userSk = skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (type === 'strength') {
      const evString = userSk?.evidence && userSk.evidence.length > 0
        ? userSk.evidence.join('; ')
        : 'Demonstrated proficiency from your profile inputs';
      return `Classified as a core strength because you have verified experience: ${evString}. This is actively valued in ${targetRole.title} positions.`;
    }
    if (type === 'progress') {
      return `Classified as in-progress because you have foundational knowledge (${userSk?.level || 'Beginner'} level). Building a hands-on project using ${name} will elevate this to an advanced strength.`;
    }
    return `${name} is commonly requested by employers hiring for ${targetRole.title}. Adding practical proficiency in ${name} will directly improve your hiring readiness for this position.`;
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Layers className="w-3.5 h-3.5" />
          <span>Step 5 of 8 · Discover What You're Missing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          See What You Already Have
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          We compared your skills with requirements for <strong>{targetRole.title}</strong>. Here is your honest breakdown based on real evidence.
        </p>
      </div>

      {/* Visual Workflow: YOUR SKILLS → CAREER REQUIREMENTS → SKILL GAP */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-50/90 border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
        
        <div className="flex-1 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs w-full">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Your Skills</span>
          <span className="text-sm font-bold text-slate-900">{skills.length} Recorded Skills</span>
          <span className="text-[11px] text-slate-500 block truncate mt-0.5">
            {skills.slice(0, 3).map((s) => s.name).join(', ')}
          </span>
        </div>

        <div className="text-indigo-400 font-bold hidden md:block">→</div>
        <div className="text-indigo-400 font-bold md:hidden">↓</div>

        <div className="flex-1 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs w-full">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Role Requirements</span>
          <span className="text-sm font-bold text-indigo-700">{targetRole.title}</span>
          <span className="text-[11px] text-slate-500 block truncate mt-0.5">
            {targetRole.requiredSkills.length} Core Competencies
          </span>
        </div>

        <div className="text-indigo-400 font-bold hidden md:block">→</div>
        <div className="text-indigo-400 font-bold md:hidden">↓</div>

        <div className="flex-1 p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20 w-full">
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">3. Skill Match Fit</span>
          <span className="text-sm font-black font-mono">{matchScore}% Match Score</span>
          <span className="text-[11px] text-indigo-100 block mt-0.5">
            {skillsToBuild.length} skills to build
          </span>
        </div>

      </div>

      {/* Three Clear Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Category 1: YOUR STRENGTHS */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Your Strengths ({strengths.length})
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Skills you've demonstrated with solid project or work experience.
            </p>

            <div className="space-y-2">
              {strengths.length > 0 ? (
                strengths.map((sk) => (
                  <div
                    key={sk.name}
                    className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/90 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                      <span className="text-xs font-bold text-slate-800 truncate">{sk.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center">
                  Add more skills to populate your strengths.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category 2: SKILLS IN PROGRESS */}
        <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  ◐
                </div>
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Skills In Progress ({inProgress.length})
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Skills you know basically that need more project depth.
            </p>

            <div className="space-y-2">
              {inProgress.length > 0 ? (
                inProgress.map((sk) => (
                  <div
                    key={sk.name}
                    className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/90 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-amber-600 font-bold text-sm">◐</span>
                      <span className="text-xs font-bold text-slate-800 truncate">{sk.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center">
                  All current skills are at advanced strength.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category 3: SKILLS TO BUILD */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                  ○
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Skills To Build ({skillsToBuild.length})
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Key requirements for {targetRole.title} not yet in your profile.
            </p>

            <div className="space-y-2">
              {skillsToBuild.length > 0 ? (
                skillsToBuild.map((name) => (
                  <div
                    key={name}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-400 font-bold text-sm">○</span>
                      <span className="text-xs font-bold text-slate-800 truncate">{name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-emerald-600 font-semibold p-3 text-center">
                  Zero skill gaps! You meet all common requirements.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
