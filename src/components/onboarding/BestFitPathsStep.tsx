import React from 'react';
import { Compass, ArrowRight, ArrowLeft, CheckCircle2, Check, Sparkles, TrendingUp } from 'lucide-react';
import { OnboardingSkill } from './SkillsStep';
import { GLOBAL_CAREER_ROLES, CareerRoleOption } from './CareerGoalStep';

interface BestFitPathsStepProps {
  skills: OnboardingSkill[];
  selectedRoleTitle: string;
  onSelectRole: (roleTitle: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BestFitPathsStep: React.FC<BestFitPathsStepProps> = ({
  skills,
  selectedRoleTitle,
  onSelectRole,
  onNext,
  onBack
}) => {
  // Calculate match scores for all roles based on user's real skills
  const scoredRoles = GLOBAL_CAREER_ROLES.map((role) => {
    const totalRequired = Math.max(1, role.requiredSkills.length);
    
    // Matched skills with user
    const matchedSkills = role.requiredSkills.filter((req) =>
      skills.some((s) => s.name.toLowerCase() === req.toLowerCase())
    );

    const strongMatches = role.requiredSkills.filter((req) =>
      skills.some((s) => s.name.toLowerCase() === req.toLowerCase() && (s.proficiency >= 70 || s.level === 'Advanced'))
    );

    const developingMatches = role.requiredSkills.filter((req) =>
      skills.some((s) => s.name.toLowerCase() === req.toLowerCase() && s.proficiency < 70 && s.level !== 'Advanced')
    );

    const missingSkills = role.requiredSkills.filter(
      (req) => !skills.some((s) => s.name.toLowerCase() === req.toLowerCase())
    );

    const score = Math.min(
      96,
      Math.max(
        25,
        Math.round(((strongMatches.length * 1.0 + developingMatches.length * 0.5) / totalRequired) * 100)
      )
    );

    return {
      ...role,
      matchScore: score,
      transferableSkills: matchedSkills,
      bridgeSkills: missingSkills
    };
  });

  // Sort by match score descending
  scoredRoles.sort((a, b) => b.matchScore - a.matchScore);

  // Ensure current target role is prominently displayed at top if not already highest
  const currentRoleScored = scoredRoles.find(
    (r) => r.title.toLowerCase() === selectedRoleTitle.toLowerCase()
  ) || scoredRoles[0];

  const alternativeRoles = scoredRoles
    .filter((r) => r.title.toLowerCase() !== currentRoleScored.title.toLowerCase())
    .slice(0, 2);

  const displayList = [currentRoleScored, ...alternativeRoles];

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Compass className="w-3.5 h-3.5" />
          <span>Step 6 of 8 · See Your Best-Fit Paths</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          See Your Best-Fit Paths
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Based on the skills you have today, here is how you align across key tech directions. You can keep your target or switch if an alternative fits better.
        </p>
      </div>

      {/* Pathways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayList.map((path, idx) => {
          const isSelected = path.title.toLowerCase() === selectedRoleTitle.toLowerCase();
          const isHighest = idx === 0 && path.matchScore >= 70;

          return (
            <div
              key={path.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/30 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                
                {/* Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {path.category}
                  </span>
                  <span className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-full ${
                    path.matchScore >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : path.matchScore >= 55
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {path.matchScore}% Match
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {path.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {path.whyMatch}
                  </p>
                </div>

                {/* Transferable Strengths */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Transferable Skills ({path.transferableSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {path.transferableSkills.length > 0 ? (
                      path.transferableSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          ✓ {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Starting fresh</span>
                    )}
                  </div>
                </div>

                {/* Bridge Skills Needed */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bridge Skills Needed ({path.bridgeSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {path.bridgeSkills.length > 0 ? (
                      path.bridgeSkills.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          + {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">Zero gaps!</span>
                    )}
                    {path.bridgeSkills.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{path.bridgeSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                {isSelected ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Your Active Target</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectRole(path.title)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Switch Target to {path.title}
                  </button>
                )}
              </div>

            </div>
          );
        })}
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
