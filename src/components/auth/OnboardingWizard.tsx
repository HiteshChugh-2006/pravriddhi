import React, { useState } from 'react';
import { UserProfile, UserSkill } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  FileText,
  ShieldCheck,
  Target,
  Briefcase,
  Compass,
  Cpu
} from 'lucide-react';

interface OnboardingWizardProps {
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  onComplete,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form states
  const [name, setName] = useState(initialProfile.name);
  const [title, setTitle] = useState(initialProfile.title);
  const [location, setLocation] = useState(initialProfile.location);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeName, setResumeName] = useState('Hitesh_Chugh_ML_Resume_2026.pdf');
  const [targetRole, setTargetRole] = useState(initialProfile.targetRole);
  const [selectedCoreSkills, setSelectedCoreSkills] = useState<string[]>([
    'Python',
    'Machine Learning',
    'SQL',
    'Deep Learning (PyTorch)'
  ]);

  const candidateSkills = [
    'Python',
    'Machine Learning',
    'Deep Learning (PyTorch)',
    'SQL & Data Warehousing',
    'Docker & Containerization',
    'MLOps & CI/CD',
    'RAG & Vector Embeddings',
    'FastAPI & REST APIs',
    'Kubernetes',
    'Cloud (AWS/GCP)',
    'AI Agents (LangGraph)'
  ];

  const targetRoleOptions = [
    { title: 'ML Engineer', comp: '$198,000', baseline: 72 },
    { title: 'AI / LLM Systems Engineer', comp: '$212,000', baseline: 68 },
    { title: 'Data Scientist', comp: '$168,000', baseline: 89 },
    { title: 'MLOps Infrastructure Engineer', comp: '$208,000', baseline: 54 }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finalize and complete
      const updatedProfile: UserProfile = {
        ...initialProfile,
        name,
        title,
        location,
        targetRole,
        targetRoleAlignment:
          targetRoleOptions.find((r) => r.title === targetRole)?.baseline || 72
      };
      onComplete(updatedProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedCoreSkills.includes(skill)) {
      setSelectedCoreSkills(selectedCoreSkills.filter((s) => s !== skill));
    } else {
      setSelectedCoreSkills([...selectedCoreSkills, skill]);
    }
  };

  const stepTitles = [
    'Create your CareerTwin',
    'Upload Resume',
    'Add Skills & Projects',
    'Choose Target Role',
    'Generate CareerTwin',
    'Explore Opportunities'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card rounded-3xl border border-white/90 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Stepper Header */}
        <div className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-700 uppercase tracking-wider">
              Step {step} of {totalSteps}: {stepTitles[step - 1]}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-medium"
            >
              Skip / Close
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Create your CareerTwin */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Create Your Digital Twin Identity
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your CareerTwin models verified competencies, not aspirational keywords.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  placeholder="e.g. Hitesh Chugh"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Professional Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  placeholder="e.g. Data & Machine Learning Specialist"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location / Preferred Work Style
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  placeholder="e.g. San Francisco, CA (Open to Remote)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Resume */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Upload Resume or Technical Profile
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We parse your production experience and identify demonstrated vs claimed skills.
              </p>
            </div>

            <div
              onClick={() => setResumeUploaded(true)}
              className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                resumeUploaded
                  ? 'border-emerald-400 bg-emerald-50/40 text-emerald-900'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mx-auto mb-3 text-indigo-600">
                {resumeUploaded ? <FileText className="w-6 h-6 text-emerald-600" /> : <Upload className="w-6 h-6" />}
              </div>

              {resumeUploaded ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-800">
                    {resumeName}
                  </p>
                  <p className="text-xs text-emerald-600">
                    ✓ Parsed 2 roles, 2 verified projects, and 9 technical capabilities.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Click to attach PDF / DOCX resume
                  </p>
                  <p className="text-xs text-slate-400">
                    Or click here to use your active verified sample resume
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Add Skills & Projects */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Select Core Technical Skills
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose the technologies you actively build with in production or personal repos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
              {candidateSkills.map((sk) => {
                const isSelected = selectedCoreSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{sk}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
              <span>Pravriddhi will automatically link your GitHub repositories as verifiable proof.</span>
            </div>
          </div>
        )}

        {/* Step 4: Choose Target Role */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Choose Your Target Career Role
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select the role you are preparing for to benchmark current alignment and gaps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {targetRoleOptions.map((opt) => {
                const isSelected = targetRole === opt.title;
                return (
                  <div
                    key={opt.title}
                    onClick={() => setTargetRole(opt.title)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{opt.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-xs text-indigo-700 font-mono font-semibold">{opt.comp} Median</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Baseline Compatibility: <strong>{opt.baseline}%</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Generate CareerTwin */}
        {step === 5 && (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Synthesizing Your CareerTwin
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Calibrating your verified demonstrated skills ({selectedCoreSkills.length}) against live 2026 hiring criteria for <strong>{targetRole}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Target Role:</span>
                <span className="font-bold text-slate-900">{targetRole}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Calculated Alignment:</span>
                <span className="font-mono font-bold text-indigo-600">72% Strong Fit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Priority Bridges:</span>
                <span className="font-medium text-amber-700">Docker & MLOps</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Explore Opportunities */}
        {step === 6 && (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Your CareerTwin is Live & Synced
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You are ready to explore your personalized dashboard, discover matching jobs on JobRadar, and query live market intelligence.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <span className="font-mono font-bold text-indigo-600 text-lg block">6</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Opportunities</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <span className="font-mono font-bold text-emerald-600 text-lg block">72%</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Alignment</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <span className="font-mono font-bold text-violet-600 text-lg block">17</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Evidence Proofs</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>{step === totalSteps ? 'Launch Workspace' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
