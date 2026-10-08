import React, { useState, useEffect } from 'react';
import { getMarketBenchmark } from '../../utils/salaryUtils';
import {
  UserProfile,
  UserSkill,
  SkillCategory,
  SkillType,
  ConfidenceLevel,
  AuthUser
} from '../../types';
import { authService } from '../../services/firebaseAuth';
import { resumeStorageService } from '../../services/resumeStorageService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  Target,
  Briefcase,
  Compass,
  Cpu,
  GraduationCap,
  Building,
  Layers,
  Award,
  TrendingUp,
  Zap,
  AlertCircle,
  X,
  ChevronRight,
  Star,
  User,
  Lock,
  Mail,
  FileText,
  Sliders,
  ExternalLink,
  Code2,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface CareerIntelligenceOnboardingProps {
  initialProfile: UserProfile;
  initialAuthUser?: AuthUser | null;
  onComplete: (updatedProfile: UserProfile) => void;
  onClose: () => void;
  onOpenSignIn?: () => void;
}

interface TargetRoleDef {
  title: string;
  category: string;
  medianComp: string;
  growth: string;
  requiredSkills: string[];
  description: string;
}

const TARGET_ROLES: TargetRoleDef[] = [
  {
    title: 'ML Engineer',
    category: 'Core AI/ML',
    medianComp: '$198,000',
    growth: '+42% YoY',
    requiredSkills: ['Python', 'Deep Learning (PyTorch)', 'Machine Learning', 'FastAPI', 'MLOps & CI/CD', 'Docker & Containers'],
    description: 'Design, train, and deploy production machine learning pipelines and real-time inference microservices.'
  },
  {
    title: 'AI / LLM Systems Engineer',
    category: 'Emerging Tech',
    medianComp: '$212,000',
    growth: '+142% YoY',
    requiredSkills: ['Python', 'Deep Learning (PyTorch)', 'RAG & Vector Retrieval', 'AI Agents (LangGraph)', 'LLM Fine-tuning (LoRA)', 'FastAPI'],
    description: 'Build enterprise frontier model systems, multi-agent swarms, vector retrieval pipelines, and evaluations.'
  },
  {
    title: 'Data Scientist',
    category: 'Data & Analytics',
    medianComp: '$168,000',
    growth: '+28% YoY',
    requiredSkills: ['Python', 'SQL & Data Warehousing', 'Machine Learning', 'Statistical Modeling', 'Data Visualization'],
    description: 'Transform complex enterprise data into predictive mathematical models and strategic decision intelligence.'
  },
  {
    title: 'MLOps Infrastructure Engineer',
    category: 'Software & Infrastructure',
    medianComp: '$208,000',
    growth: '+64% YoY',
    requiredSkills: ['Docker & Containers', 'Kubernetes', 'MLOps & CI/CD', 'Cloud (AWS/GCP)', 'FastAPI', 'Python'],
    description: 'Architect scalable Kubernetes clusters, automated model retraining pipelines, drift detection, and serving.'
  },
  {
    title: 'Data Analyst',
    category: 'Data & Analytics',
    medianComp: '$115,000',
    growth: '+18% YoY',
    requiredSkills: ['SQL & Data Warehousing', 'Data Visualization', 'Statistical Modeling', 'Python'],
    description: 'Build robust BI dashboards, optimize analytical data models, and conduct rigorous A/B experimentation.'
  },
  {
    title: 'Staff AI Systems Architect',
    category: 'Executive & Systems',
    medianComp: '$285,000',
    growth: '+52% YoY',
    requiredSkills: ['System Design at Scale', 'Distributed ML Training', 'Cloud (AWS/GCP)', 'MLOps & CI/CD', 'Docker & Containers', 'Python'],
    description: 'Oversee multi-million dollar compute budgets, GPU cluster topologies, and cross-organizational AI systems.'
  }
];

interface AvailableSkill {
  id: string;
  name: string;
  category: SkillCategory;
  growth: string;
  demand: 'Surging' | 'High' | 'Moderate';
  recommendedFor?: string[];
}

const PRESET_SKILLS: AvailableSkill[] = [
  // Core AI/ML
  { id: 'sk_py', name: 'Python', category: 'Core AI/ML', growth: '+24%', demand: 'High' },
  { id: 'sk_ml', name: 'Machine Learning', category: 'Core AI/ML', growth: '+34%', demand: 'High' },
  { id: 'sk_torch', name: 'Deep Learning (PyTorch)', category: 'Core AI/ML', growth: '+56%', demand: 'Surging' },
  { id: 'sk_stat', name: 'Statistical Modeling', category: 'Core AI/ML', growth: '+19%', demand: 'Moderate' },
  { id: 'sk_dist', name: 'Distributed ML Training', category: 'Core AI/ML', growth: '+72%', demand: 'Surging' },
  
  // Emerging Tech
  { id: 'sk_rag', name: 'RAG & Vector Retrieval', category: 'Emerging Tech', growth: '+118%', demand: 'Surging' },
  { id: 'sk_agents', name: 'AI Agents (LangGraph)', category: 'Emerging Tech', growth: '+89%', demand: 'Surging' },
  { id: 'sk_lora', name: 'LLM Fine-tuning (LoRA)', category: 'Emerging Tech', growth: '+94%', demand: 'Surging' },
  { id: 'sk_eval', name: 'Evaluation Benchmarks', category: 'Emerging Tech', growth: '+62%', demand: 'High' },

  // Software & Infrastructure
  { id: 'sk_api', name: 'FastAPI', category: 'Software & Infrastructure', growth: '+45%', demand: 'High' },
  { id: 'sk_dock', name: 'Docker & Containers', category: 'Software & Infrastructure', growth: '+38%', demand: 'High' },
  { id: 'sk_k8s', name: 'Kubernetes', category: 'Software & Infrastructure', growth: '+42%', demand: 'High' },
  { id: 'sk_mlops', name: 'MLOps & CI/CD', category: 'Software & Infrastructure', growth: '+84%', demand: 'Surging' },
  { id: 'sk_sys', name: 'System Design at Scale', category: 'Software & Infrastructure', growth: '+51%', demand: 'High' },

  // Data & Analytics
  { id: 'sk_sql', name: 'SQL & Data Warehousing', category: 'Data & Analytics', growth: '+15%', demand: 'High' },
  { id: 'sk_vis', name: 'Data Visualization', category: 'Data & Analytics', growth: '+12%', demand: 'Moderate' },
  { id: 'sk_snow', name: 'Snowflake / BigQuery', category: 'Data & Analytics', growth: '+38%', demand: 'High' },

  // Cloud & Systems
  { id: 'sk_cloud', name: 'Cloud (AWS/GCP)', category: 'Cloud & Systems', growth: '+32%', demand: 'High' }
];

export const CareerIntelligenceOnboarding: React.FC<CareerIntelligenceOnboardingProps> = ({
  initialProfile,
  initialAuthUser,
  onComplete,
  onClose,
  onOpenSignIn
}) => {
  // Navigation Steps:
  // 1: Welcome Screen
  // 2: Account Creation / Verification
  // 3: Build Career Profile (Identity & Education)
  // 4: Interactive Skills & Proficiency
  // 5: Career Goal & Skill Gap Analysis
  // 6: Experience & Projects
  // 7: "Your CareerTwin is Ready" Reveal
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Active Auth user
  const [authUser, setAuthUser] = useState<AuthUser | null>(
    initialAuthUser || authService.getCurrentUser()
  );

  // Account creation form states
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [authName, setAuthName] = useState(initialProfile.name || '');
  const [authEmail, setAuthEmail] = useState(initialProfile.email || '');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Step 3: Profile & Education
  const [name, setName] = useState(initialProfile.name || authUser?.displayName || '');
  const [title, setTitle] = useState(initialProfile.title || 'Aspiring Machine Learning Practitioner');
  const [location, setLocation] = useState(initialProfile.location || 'San Francisco Bay Area, CA');
  const [degree, setDegree] = useState(
    initialProfile.education[0]?.degree || 'B.S. in Computer Science & Data Science'
  );
  const [school, setSchool] = useState(
    initialProfile.education[0]?.school || 'University of California, Berkeley'
  );
  const [gradYear, setGradYear] = useState(
    initialProfile.education[0]?.year || '2026'
  );
  const [educationGpa, setEducationGpa] = useState(
    initialProfile.education[0]?.gpa || '3.8 / 4.0'
  );

  // Step 4: Skills & Proficiency
  interface SelectedSkillState {
    name: string;
    category: SkillCategory;
    proficiency: number; // 0 - 100
    type: SkillType;
    evidenceTitle?: string;
  }

  const [selectedSkills, setSelectedSkills] = useState<SelectedSkillState[]>(() => {
    if (initialProfile.skills && initialProfile.skills.length > 0) {
      return initialProfile.skills.map((s) => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        type: s.type,
        evidenceTitle: s.evidence[0]?.title
      }));
    }
    // Default starter skills
    return [
      { name: 'Python', category: 'Core AI/ML', proficiency: 85, type: 'demonstrated', evidenceTitle: 'Production ML pipeline in PyTorch' },
      { name: 'Machine Learning', category: 'Core AI/ML', proficiency: 75, type: 'demonstrated', evidenceTitle: 'Supervised classification benchmark' },
      { name: 'SQL & Data Warehousing', category: 'Data & Analytics', proficiency: 80, type: 'demonstrated', evidenceTitle: 'Query optimization on 10M rows' }
    ];
  });

  const [skillFilterCategory, setSkillFilterCategory] = useState<string>('All');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState<SkillCategory>('Core AI/ML');

  // Step 5: Target Role & Skill Gap
  const [targetRoleTitle, setTargetRoleTitle] = useState(
    initialProfile.targetRole || 'ML Engineer'
  );

  // Step 6: Experience & Projects
  const [experienceLevel, setExperienceLevel] = useState('1 – 2 years (Early Career)');
  const [projectTitle, setProjectTitle] = useState(
    initialProfile.projects[0]?.title || 'Real-Time Fraud Detection ML Microservice'
  );
  const [projectTech, setProjectTech] = useState(
    initialProfile.projects[0]?.tech.join(', ') || 'PyTorch, FastAPI, Docker, MLflow, Redis'
  );
  const [projectDesc, setProjectDesc] = useState(
    initialProfile.projects[0]?.description ||
      'Engineered an end-to-end inference service with millisecond latency scoring transaction anomaly patterns.'
  );
  const [careerInterests, setCareerInterests] = useState<string[]>([
    'Generative AI & LLM Systems',
    'High-Throughput Production MLOps',
    'Autonomous Multi-Agent Systems'
  ]);

  // Validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync auth display name to profile name
  useEffect(() => {
    if (authUser && !name) {
      setName(authUser.displayName || authUser.email.split('@')[0]);
    }
  }, [authUser]);

  // Compute skill gap analysis dynamically based on selected skills vs target role
  const activeTargetRole = TARGET_ROLES.find((r) => r.title === targetRoleTitle) || TARGET_ROLES[0];
  
  const strongMatches = activeTargetRole.requiredSkills.filter((req) =>
    selectedSkills.some(
      (s) => s.name.toLowerCase() === req.toLowerCase() && s.proficiency >= 65
    )
  );

  const developingSkills = activeTargetRole.requiredSkills.filter((req) =>
    selectedSkills.some(
      (s) => s.name.toLowerCase() === req.toLowerCase() && s.proficiency < 65
    )
  );

  const missingSkills = activeTargetRole.requiredSkills.filter(
    (req) => !selectedSkills.some((s) => s.name.toLowerCase() === req.toLowerCase())
  );

  const calculatedAlignment = Math.min(
    96,
    Math.round(
      ((strongMatches.length * 1.0 + developingSkills.length * 0.5) /
        Math.max(1, activeTargetRole.requiredSkills.length)) *
        100
    )
  );

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await authService.signInWithGoogle();
      setAuthUser(user);
      if (user.displayName && !name) setName(user.displayName);
      setCurrentStep(3); // Progress directly to Profile step!
    } catch (err: any) {
      setAuthError(err.message || 'Google Sign-In failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Email Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }
    if (authMode === 'signup' && authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      let user: AuthUser;
      if (authMode === 'signup') {
        user = await authService.signUpWithEmail(authName || name || 'Pravriddhi User', authEmail, authPassword);
      } else {
        user = await authService.signInWithEmail(authEmail, authPassword);
      }
      setAuthUser(user);
      if (user.displayName && !name) setName(user.displayName);
      setCurrentStep(3); // Advance to Profile Step
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Toggle skill in selection
  const toggleSkill = (skill: AvailableSkill) => {
    const existingIndex = selectedSkills.findIndex(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      setSelectedSkills(selectedSkills.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedSkills([
        ...selectedSkills,
        {
          name: skill.name,
          category: skill.category,
          proficiency: 75,
          type: 'demonstrated',
          evidenceTitle: `Demonstrated competency in ${skill.name}`
        }
      ]);
    }
  };

  // Update proficiency of a selected skill
  const updateProficiency = (skillName: string, level: number) => {
    setSelectedSkills(
      selectedSkills.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase()
          ? { ...s, proficiency: level }
          : s
      )
    );
  };

  // Add custom skill
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    if (
      selectedSkills.some(
        (s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase()
      )
    ) {
      setCustomSkillName('');
      return;
    }

    setSelectedSkills([
      ...selectedSkills,
      {
        name: customSkillName.trim(),
        category: customSkillCategory,
        proficiency: 75,
        type: 'demonstrated',
        evidenceTitle: `Verified work in ${customSkillName.trim()}`
      }
    ]);
    setCustomSkillName('');
  };

  // Step Navigation Validation
  const handleNext = () => {
    setValidationError(null);

    // Validation for Step 3: Profile & Education
    if (currentStep === 3) {
      if (!name.trim()) {
        setValidationError('Please enter your full name to generate your CareerTwin.');
        return;
      }
      if (!degree.trim() || !school.trim()) {
        setValidationError('Please provide your education details (degree and institution).');
        return;
      }
    }

    // Validation for Step 4: Skills
    if (currentStep === 4) {
      if (selectedSkills.length === 0) {
        setValidationError('Please select or add at least one core skill to construct your Twin.');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize and commit profile to Pravriddhi system
      handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Profile Assembly & Completion
  const handleCompleteOnboarding = () => {
    const formattedSkills: UserSkill[] = selectedSkills.map((s, idx) => ({
      id: `sk_onb_${Date.now()}_${idx}`,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      confidence: s.proficiency >= 80 ? 'High' : s.proficiency >= 60 ? 'Moderate' : 'Emerging',
      type: s.type,
      yearsExp: s.proficiency >= 80 ? 3 : s.proficiency >= 60 ? 2 : 1,
      marketDemand: s.proficiency >= 75 ? 'Surging' : 'High',
      lastPracticed: 'Recently',
      evidence: s.evidenceTitle
        ? [
            {
              id: `ev_onb_${Date.now()}_${idx}`,
              type: 'Project',
              title: s.evidenceTitle
            }
          ]
        : []
    }));

    const updatedProfile: UserProfile = {
      ...initialProfile,
      id: authUser?.uid || initialProfile.id || `usr_${Date.now()}`,
      name: name.trim() || 'Pravriddhi User',
      email: authUser?.email || initialProfile.email || authEmail,
      title: title.trim() || 'AI & Machine Learning Engineer',
      location: location.trim() || 'San Francisco Bay Area, CA',
      targetRole: targetRoleTitle,
      targetRoleAlignment: calculatedAlignment,
      alignmentTrend: 8,
      summary: `${name.trim()} is an ambitious ${title.trim()} focused on ${targetRoleTitle}. Their verified CareerTwin showcases demonstrated competencies in ${strongMatches.slice(0, 3).join(', ')} with high target role alignment.`,
      skills: formattedSkills,
      education: [
        {
          id: `edu_onb_${Date.now()}`,
          degree: degree.trim(),
          school: school.trim(),
          year: gradYear.trim(),
          gpa: educationGpa.trim()
        }
      ],
      projects: projectTitle.trim()
        ? [
            {
              id: `proj_onb_${Date.now()}`,
              title: projectTitle.trim(),
              description: projectDesc.trim(),
              tech: projectTech.split(',').map((t) => t.trim()).filter(Boolean),
              verified: true
            }
          ]
        : initialProfile.projects,
      experience: initialProfile.experience.length > 0 ? initialProfile.experience : [
        {
          id: `exp_onb_${Date.now()}`,
          title: title.trim() || 'Software & ML Engineering Intern',
          company: 'Emerging AI Technologies Lab',
          location: location.trim(),
          startDate: '2024',
          endDate: 'Present',
          bullets: [
            `Built scalable pipeline architectures using ${selectedSkills.slice(0, 3).map((s) => s.name).join(', ')}.`,
            'Benchmarked deep learning inference and deployed telemetry monitoring.'
          ],
          skillsUsed: selectedSkills.slice(0, 4).map((s) => s.name)
        }
      ]
    };

    onComplete(updatedProfile);
  };

  const stepTitles = [
    'Welcome',
    'Account Creation',
    'Career Identity & Education',
    'Core Skills & Evidence',
    'Career Target & Gap Analysis',
    'Projects & Trajectory',
    'Your CareerTwin is Ready'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white/95 rounded-3xl border border-white/80 shadow-2xl shadow-indigo-950/15 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header & Progress Indicator */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100/90 bg-gradient-to-r from-slate-50 via-white to-indigo-50/30">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-slate-900">Pravriddhi</span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    Career Intelligence Flow
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Step {currentStep} of {totalSteps}: <strong className="text-slate-800">{stepTitles[currentStep - 1]}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close Onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic Step Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* ======================================================== */}
          {/* STEP 1: WELCOME SCREEN                                   */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Deterministic Career Intelligence</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Understand where you are.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
                    Discover where you can go.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Pravriddhi constructs an evidence-verified Career Digital Twin of your capabilities, analyzes real workforce market demand, and models your exact path to top roles.
                </p>
              </div>

              {/* Animated CareerTwin / Skill Visualization Canvas */}
              <div className="relative max-w-lg mx-auto p-6 rounded-3xl bg-gradient-to-b from-indigo-50/60 via-white to-violet-50/40 border border-indigo-100/80 shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)] pointer-events-none" />
                
                {/* Central Identity Node */}
                <div className="relative flex flex-col items-center justify-center my-6 z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-8 ring-indigo-50 animate-pulse">
                      <Cpu className="w-10 h-10" />
                    </div>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                      Twin Engine
                    </span>
                  </div>

                  {/* Connected Orbiting Skill Badges */}
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-8">
                    {[
                      { name: 'Python & PyTorch', level: '92%', tag: 'Core AI' },
                      { name: 'FastAPI Microservices', level: '85%', tag: 'System' },
                      { name: 'RAG & Vector Retrieval', level: '88%', tag: 'Frontier' },
                      { name: 'MLOps & CI/CD', level: '68%', tag: 'Pipeline' },
                      { name: 'Docker & Containers', level: '74%', tag: 'Infra' },
                      { name: 'SQL & Data Warehousing', level: '82%', tag: 'Data' }
                    ].map((node, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col gap-1 text-left"
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                          <span>{node.tag}</span>
                          <span className="text-indigo-600 font-mono">{node.level}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate">{node.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs text-slate-500 mt-2 font-medium">
                  Verified competencies, live telemetry, and simulated trajectories.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(authUser ? 3 : 2)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{authUser ? 'Build Your CareerTwin Profile' : 'Get Started — Build Career Profile'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {!authUser && (
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setCurrentStep(2);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors text-center"
                  >
                    I already have an account
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: ACCOUNT CREATION                                 */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="max-w-md mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Authenticated Check */}
              {authUser && authUser.provider !== 'guest' ? (
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Already Authenticated
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Signed in as <strong>{authUser.displayName || authUser.email}</strong> ({authUser.email})
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Continue with this account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        await authService.signOut();
                        setAuthUser(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
                    >
                      Switch Account
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {authMode === 'signup' ? 'Create Your Pravriddhi Account' : 'Sign in to Pravriddhi'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your career profile and competencies will be securely isolated in your private vault.
                    </p>
                  </div>

                  {/* Google 1-Click Auth */}
                  <button
                    onClick={handleGoogleAuth}
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-2xs text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{authLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider relative">
                      or with email
                    </span>
                  </div>

                  {/* Error Notification */}
                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Email & Password Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-3.5">
                    {authMode === 'signup' && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={authName}
                            onChange={(e) => {
                              setAuthName(e.target.value);
                              setName(e.target.value);
                            }}
                            placeholder="e.g. Alex Morgan"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>
                        {authLoading
                          ? 'Creating Profile...'
                          : authMode === 'signup'
                          ? 'Create Account & Continue'
                          : 'Sign In & Continue'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Mode Switch */}
                  <div className="text-center text-xs text-slate-500">
                    {authMode === 'signup' ? (
                      <span>
                        Already registered?{' '}
                        <button
                          onClick={() => {
                            setAuthMode('signin');
                            setAuthError(null);
                          }}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          Sign In here
                        </button>
                      </span>
                    ) : (
                      <span>
                        Don't have an account?{' '}
                        <button
                          onClick={() => {
                            setAuthMode('signup');
                            setAuthError(null);
                          }}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          Create one now
                        </button>
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: BUILD CAREER PROFILE (Identity & Education)      */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">
                  Build Your Career Profile Identity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pravriddhi roots your CareerTwin in verified background facts, not generic resume summaries.
                </p>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Personal Identity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    <span>Identity & Headline</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Hitesh Chugh"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Current Headline / Professional Role *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Machine Learning Practitioner / CS Student"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco Bay Area, CA (or Remote)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                    />
                  </div>
                </div>

                {/* Right Column: Education Background */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Education & Academic Foundations</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Degree / Program *
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science & AI"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      University / Institution *
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="e.g. UC Berkeley, Stanford, Georgia Tech"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        placeholder="2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        GPA / Honors (Optional)
                      </label>
                      <input
                        type="text"
                        value={educationGpa}
                        onChange={(e) => setEducationGpa(e.target.value)}
                        placeholder="3.8 / 4.0"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Preview Pill */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {(name ? name[0] : 'P').toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{name || 'Your Name'}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        Twin Seed Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {title} · {school} ({gradYear})
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider block">
                    Telemetry Engine
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">Ready to Map Skills</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: INTERACTIVE SKILLS & PROFICIENCY                 */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Model Your Current Skills & Proficiency
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click to add skills. Adjust proficiency sliders to model your verified technical depth.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-800 font-bold text-xs">
                    {selectedSkills.length} Skills in CareerTwin
                  </span>
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['All', 'Core AI/ML', 'Emerging Tech', 'Software & Infrastructure', 'Data & Analytics', 'Cloud & Systems'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSkillFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                        skillFilterCategory === cat
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Interactive Skill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {PRESET_SKILLS.filter(
                  (s) => skillFilterCategory === 'All' || s.category === skillFilterCategory
                ).map((skill) => {
                  const isSelected = selectedSkills.some(
                    (s) => s.name.toLowerCase() === skill.name.toLowerCase()
                  );
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill)}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                          {skill.category}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-900">
                        {skill.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                        <span className="text-emerald-700 font-mono font-semibold">{skill.growth}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">{skill.demand}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill Form */}
              <form onSubmit={handleAddCustomSkill} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="Can't find a skill? Type custom skill (e.g. Rust, LangChain, BigQuery)..."
                  className="w-full flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs outline-hidden focus:border-indigo-500"
                />
                <select
                  value={customSkillCategory}
                  onChange={(e) => setCustomSkillCategory(e.target.value as SkillCategory)}
                  aria-label="Skill Category"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs outline-hidden text-slate-700"
                >
                  <option value="Core AI/ML">Core AI/ML</option>
                  <option value="Software & Infrastructure">Software & Infra</option>
                  <option value="Emerging Tech">Emerging Tech</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Cloud & Systems">Cloud & Systems</option>
                </select>
                <button
                  type="submit"
                  disabled={!customSkillName.trim()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </form>

              {/* Active Selected Skills with Proficiency Sliders */}
              {selectedSkills.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="uppercase tracking-wider text-[11px] text-slate-400">
                      Configure Skill Proficiencies ({selectedSkills.length})
                    </span>
                    <span className="text-slate-400 text-[11px] font-normal">
                      Adjust levels: Beginner (40%) → Expert (95%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {selectedSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {skill.name}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {skill.proficiency}% · {skill.proficiency >= 85 ? 'Advanced' : skill.proficiency >= 65 ? 'Practitioner' : 'Foundational'}
                          </span>
                        </div>

                        {/* Slider */}
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="35"
                            max="98"
                            value={skill.proficiency}
                            onChange={(e) => updateProficiency(skill.name, Number(e.target.value))}
                            aria-label={`Proficiency level for ${skill.name}`}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <button
                            onClick={() => setSelectedSkills(selectedSkills.filter((s) => s.name !== skill.name))}
                            className="text-slate-300 hover:text-red-500 p-0.5 rounded transition-colors"
                            aria-label={`Remove ${skill.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: CAREER GOAL & REAL-TIME SKILL GAP ANALYSIS       */}
          {/* ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">
                  Select Your Target Role & Inspect Real Skill Gaps
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pravriddhi benchmarks your profile against industry telemetry to isolate exact gaps.
                </p>
              </div>

              {/* Target Role Cards Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {TARGET_ROLES.map((role) => {
                  const isSelected = targetRoleTitle === role.title;
                  return (
                    <button
                      key={role.title}
                      onClick={() => setTargetRoleTitle(role.title)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                          <span>{role.category}</span>
                          <span className="text-emerald-700 font-mono">{role.growth}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{role.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-mono font-bold text-slate-800">{getMarketBenchmark(role.title, location)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isSelected ? 'Target Selected' : 'Select'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* The Live Skill Gap Analysis Engine Breakdown */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 border border-indigo-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Target Role Alignment Engine
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">{activeTargetRole.title}</span>
                      <span className="text-xs text-slate-500">({getMarketBenchmark(activeTargetRole.title, location)} avg)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium block">Computed Fit</span>
                      <span className="text-xl font-bold font-mono text-indigo-700">{calculatedAlignment}%</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {calculatedAlignment}%
                    </div>
                  </div>
                </div>

                {/* 3-Section Analysis: Strong, Developing, Missing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Strong Matches */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Strong Competencies ({strongMatches.length})</span>
                      </span>
                    </div>
                    {strongMatches.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {strongMatches.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-900 font-medium text-[11px] border border-emerald-100"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        None above 65% proficiency yet.
                      </p>
                    )}
                  </div>

                  {/* Developing Skills */}
                  <div className="p-3.5 rounded-2xl bg-white border border-sky-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-sky-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                        <span>Developing ({developingSkills.length})</span>
                      </span>
                    </div>
                    {developingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {developingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-1 rounded-md bg-sky-50 text-sky-900 font-medium text-[11px] border border-sky-100"
                          >
                            {s} (In Progress)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        No partial competencies.
                      </p>
                    )}
                  </div>

                  {/* Missing Skills (Skill Gap) */}
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-amber-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-600" />
                        <span>Skill Gaps to Bridge ({missingSkills.length})</span>
                      </span>
                    </div>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-1 rounded-md bg-amber-50 text-amber-900 font-medium text-[11px] border border-amber-200/70"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-emerald-600 font-medium pt-1">
                        All required competencies fulfilled!
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Closing your top {missingSkills.length} skill gap(s) in Simulator will raise your trajectory to 92%+.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 6: EXPERIENCE & PROJECTS                            */}
          {/* ======================================================== */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">
                  Projects, Evidence & Career Trajectory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evidence-backed artifacts differentiate your CareerTwin from unverified claimed bullet points.
                </p>
              </div>

              {/* Experience Tier Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Current Career Phase
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    'Student / New Grad',
                    '1 – 2 years (Early Career)',
                    '3 – 5 years (Mid-Level)',
                    '5+ years (Senior / Staff)'
                  ].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`p-3 rounded-xl border text-center font-medium transition-all ${
                        experienceLevel === level
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlight Project Form */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Highlight Technical Project (Verified Artifact)</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. End-to-End Real-Time Anomaly Scoring Service"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Technologies / Stack Used
                  </label>
                  <input
                    type="text"
                    value={projectTech}
                    onChange={(e) => setProjectTech(e.target.value)}
                    placeholder="e.g. PyTorch, FastAPI, Docker, MLflow, Redis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Description & Measurable Impact
                  </label>
                  <textarea
                    rows={2}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Engineered low-latency scoring pipeline with 99.4% precision and containerized CI/CD deployment..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Career Aspirations / Focus Areas */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Primary Focus Areas
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Generative AI & LLM Systems',
                    'High-Throughput Production MLOps',
                    'Autonomous Multi-Agent Systems',
                    'Distributed Infrastructure & GPU Clusters',
                    'Enterprise RAG & Hybrid Search',
                    'Model Safety & Alignment Benchmarks'
                  ].map((interest) => {
                    const active = careerInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setCareerInterests(careerInterests.filter((i) => i !== interest));
                          } else {
                            setCareerInterests([...careerInterests, interest]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border transition-all ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 7: "YOUR CAREERTWIN IS READY" REVEAL                 */}
          {/* ======================================================== */}
          {currentStep === 7 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              
              {/* Badge & Title */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital Twin Identity Compiled</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Your CareerTwin is Ready, {name.split(' ')[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                  Pravriddhi has constructed your dynamic competency profile and connected it to 240,000+ live market telemetry nodes.
                </p>
              </div>

              {/* Main Summary Hero Card */}
              <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 border border-indigo-100 shadow-xl text-left space-y-6">
                
                {/* Profile Identity Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-500/20 ring-4 ring-indigo-50">
                      {(name ? name[0] : 'P').toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{name}</h4>
                        <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                          Live Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{title} · {school}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Target Role
                    </span>
                    <span className="text-sm font-bold text-indigo-700">{targetRoleTitle}</span>
                    <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                      {calculatedAlignment}% Alignment
                    </div>
                  </div>
                </div>

                {/* 3 Metrics Row */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium block">Total Skills</span>
                    <span className="text-lg font-bold font-mono text-slate-900">{selectedSkills.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium block">Strong Matches</span>
                    <span className="text-lg font-bold font-mono text-emerald-600">{strongMatches.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium block">Target Skill Gaps</span>
                    <span className="text-lg font-bold font-mono text-amber-600">{missingSkills.length}</span>
                  </div>
                </div>

                {/* Skill Breakdown Lists */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Strong Demonstrable Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {strongMatches.length > 0 ? (
                        strongMatches.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200 flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{s}</span>
                          </span>
                        ))
                      ) : (
                        selectedSkills.slice(0, 3).map((s) => (
                          <span
                            key={s.name}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200"
                          >
                            {s.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {missingSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Identified Opportunities to Bridge:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-semibold border border-amber-200"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested First Action */}
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-slate-700">
                      <strong>Suggested Next Step:</strong> Run What-If Simulator on your missing skills to project career growth.
                    </span>
                  </div>
                  <span className="text-indigo-600 font-semibold whitespace-nowrap hidden sm:inline">
                    Simulate +14% →
                  </span>
                </div>
              </div>

              {/* Enter Dashboard CTA */}
              <div className="pt-2">
                <button
                  onClick={handleCompleteOnboarding}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 mx-auto group"
                >
                  <span>Launch My CareerTwin & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Stepper Footer Controls */}
        {currentStep > 1 && currentStep < 7 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                Skip / Later
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 group"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
