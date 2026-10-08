import React, { useState } from 'react';
import { Target, ArrowRight, ArrowLeft, CheckCircle2, Compass, Briefcase, Plus, Check } from 'lucide-react';
import { OnboardingSkill } from './SkillsStep';

export interface CareerRoleOption {
  id: string;
  title: string;
  category: string;
  commonSkills: string[];
  whyMatch: string;
  responsibilities: string[];
  requiredSkills: string[];
}

export const GLOBAL_CAREER_ROLES: CareerRoleOption[] = [
  {
    id: 'role_mle',
    title: 'Machine Learning Engineer',
    category: 'Core AI/ML',
    commonSkills: ['Python', 'Deep Learning (PyTorch)', 'Machine Learning', 'FastAPI', 'Docker & Containers'],
    whyMatch: 'Applies strong algorithmic thinking and python skills to deploy production prediction pipelines.',
    responsibilities: [
      'Design, train, and validate machine learning architectures on structured and unstructured datasets',
      'Package and serve low-latency inference APIs and monitor performance drift'
    ],
    requiredSkills: ['Python', 'Deep Learning (PyTorch)', 'Machine Learning', 'FastAPI', 'Docker & Containers', 'SQL']
  },
  {
    id: 'role_aie',
    title: 'AI Engineer',
    category: 'Emerging Tech',
    commonSkills: ['Python', 'Large Language Models (LLMs)', 'Deep Learning (PyTorch)', 'FastAPI', 'Docker & Containers'],
    whyMatch: 'Integrates foundation models, contextual embeddings, and agentic workflows into user-facing products.',
    responsibilities: [
      'Implement retrieval-augmented generation (RAG) and evaluate response accuracy',
      'Build autonomous workflow integrations and fine-tune models on domain knowledge'
    ],
    requiredSkills: ['Python', 'Large Language Models (LLMs)', 'Deep Learning (PyTorch)', 'FastAPI', 'Docker & Containers', 'SQL']
  },
  {
    id: 'role_ds',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    commonSkills: ['Python', 'SQL', 'Data Science', 'Machine Learning', 'Pandas & NumPy', 'Data Visualization'],
    whyMatch: 'Excels at statistical modeling, hypothesis testing, and turning complex data into business decisions.',
    responsibilities: [
      'Formulate predictive statistical models to answer strategic product and operational questions',
      'Design rigorous A/B experiments and present quantitative insights to stakeholders'
    ],
    requiredSkills: ['Python', 'SQL', 'Data Science', 'Machine Learning', 'Pandas & NumPy', 'Data Visualization']
  },
  {
    id: 'role_swe',
    title: 'Software Engineer',
    category: 'Software & Infrastructure',
    commonSkills: ['Java', 'C++', 'Python', 'SQL', 'Docker & Containers', 'Git & Version Control'],
    whyMatch: 'Strong architectural fundamentals, clean code practices, and distributed systems problem solving.',
    responsibilities: [
      'Architect backend services, database schemas, and microservice communication patterns',
      'Ensure high availability, test coverage, and performance under scale'
    ],
    requiredSkills: ['Java', 'C++', 'Python', 'SQL', 'Docker & Containers', 'Git & Version Control']
  },
  {
    id: 'role_fsd',
    title: 'Full Stack Developer',
    category: 'Full Stack & Web',
    commonSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'FastAPI', 'Git & Version Control'],
    whyMatch: 'Enjoys building complete user journeys from beautiful frontend UI to reliable backend data storage.',
    responsibilities: [
      'Build responsive client interfaces with modern component frameworks and state management',
      'Develop secure REST APIs and connect them to relational and document databases'
    ],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'SQL', 'FastAPI', 'Git & Version Control']
  },
  {
    id: 'role_da',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    commonSkills: ['SQL', 'Data Visualization', 'Pandas & NumPy', 'Python', 'Data Science'],
    whyMatch: 'Transforms raw database tables into executive clarity, interactive dashboards, and actionable metrics.',
    responsibilities: [
      'Query and clean multi-source databases to build live operational KPI dashboards',
      'Identify user trends, conversion funnels, and performance bottlenecks'
    ],
    requiredSkills: ['SQL', 'Data Visualization', 'Pandas & NumPy', 'Python', 'Data Science']
  },
  {
    id: 'role_cloud',
    title: 'Cloud & Infrastructure Engineer',
    category: 'Cloud & Systems',
    commonSkills: ['Cloud (AWS / GCP / Azure)', 'Docker & Containers', 'Kubernetes', 'Python', 'Git & Version Control'],
    whyMatch: 'Passionate about reliability, automation, cloud services, and scalable infrastructure.',
    responsibilities: [
      'Provision and maintain multi-region cloud infrastructure using code templates',
      'Configure automated CI/CD deployment pipelines, alerting, and log aggregations'
    ],
    requiredSkills: ['Cloud (AWS / GCP / Azure)', 'Docker & Containers', 'Kubernetes', 'Python', 'Git & Version Control', 'SQL']
  },
  {
    id: 'role_devops',
    title: 'DevOps Engineer',
    category: 'Cloud & Systems',
    commonSkills: ['Docker & Containers', 'Kubernetes', 'Git & Version Control', 'Python', 'Cloud (AWS / GCP / Azure)'],
    whyMatch: 'Bridges developer productivity with stable, automated deployment systems.',
    responsibilities: [
      'Accelerate deployment speed and reliability by automating build, test, and release verification',
      'Manage container orchestration, secrets rotation, and system uptime'
    ],
    requiredSkills: ['Docker & Containers', 'Kubernetes', 'Git & Version Control', 'Python', 'Cloud (AWS / GCP / Azure)']
  }
];

export const ONBOARDING_ROLES = GLOBAL_CAREER_ROLES;

interface CareerGoalStepProps {
  selectedRoleTitle: string;
  setSelectedRoleTitle: (title: string) => void;
  userSkills: OnboardingSkill[];
  onNext: () => void;
  onBack: () => void;
}

export const CareerGoalStep: React.FC<CareerGoalStepProps> = ({
  selectedRoleTitle,
  setSelectedRoleTitle,
  userSkills,
  onNext,
  onBack
}) => {
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedRole = GLOBAL_CAREER_ROLES.find(
    (r) => r.title.toLowerCase() === selectedRoleTitle.toLowerCase()
  ) || GLOBAL_CAREER_ROLES[0];

  const handleSelectRole = (title: string) => {
    setSelectedRoleTitle(title);
    setError(null);
  };

  const handleAddCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleInput.trim()) return;
    setSelectedRoleTitle(customRoleInput.trim());
    setCustomRoleInput('');
    setError(null);
  };

  const handleContinue = () => {
    if (!selectedRoleTitle.trim()) {
      setError('Please select a target career path.');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Target className="w-3.5 h-3.5" />
          <span>Step 4 of 8 · Choose Where You Want to Go</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Where Do You Want to Go?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Choose the direction you are targeting next. We will map your current skills directly against what employers look for in this role.
        </p>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Interactive Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GLOBAL_CAREER_ROLES.map((role) => {
          const isSelected = selectedRoleTitle.toLowerCase() === role.title.toLowerCase();

          // Calculate matching skills already held by user
          const matchingCount = role.commonSkills.filter((req) =>
            userSkills.some((s) => s.name.toLowerCase() === req.toLowerCase())
          ).length;

          return (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role.title)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between space-y-3.5 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      {role.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {role.title}
                    </h3>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Why this matches you */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Why this matches: </span>
                  {role.whyMatch}
                </p>

                {/* Common Skills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Common Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.commonSkills.map((sk) => {
                      const userHasIt = userSkills.some(
                        (s) => s.name.toLowerCase() === sk.toLowerCase()
                      );
                      return (
                        <span
                          key={sk}
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${
                            userHasIt
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {userHasIt ? `✓ ${sk}` : sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Typical Responsibilities */}
                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider block">
                    Typical Responsibilities:
                  </span>
                  {role.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] leading-snug">
                      <span className="text-slate-400">•</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matching indicator */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-indigo-600 font-semibold text-[11px]">
                  {matchingCount > 0 ? `${matchingCount} of ${role.commonSkills.length} skills match your profile` : 'Skills to develop'}
                </span>
                <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-400'}`}>
                  {isSelected ? 'Selected Target' : 'Click to Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Role Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          Targeting a different role? Type your custom path:
        </div>
        <form onSubmit={handleAddCustomRole} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={customRoleInput}
            onChange={(e) => setCustomRoleInput(e.target.value)}
            placeholder="e.g. Embedded Systems Engineer..."
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-60"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer"
          >
            Set Custom
          </button>
        </form>
      </div>

      {/* Selection Confirmation Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Selected: <strong className="font-bold">{selectedRole.title}</strong>. Your profile will now be compared with the skills commonly requested for this role.
          </span>
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
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
