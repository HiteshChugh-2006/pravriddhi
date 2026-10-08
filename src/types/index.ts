export type SkillCategory = 
  | 'Core AI/ML'
  | 'Software & Infrastructure'
  | 'Data & Analytics'
  | 'Cloud & Systems'
  | 'Emerging Tech';

export type ConfidenceLevel = 'High' | 'Moderate' | 'Emerging';

export type SkillType = 'demonstrated' | 'claimed';

export type EvidenceType = 'Resume' | 'Project' | 'Assessment' | 'GitHub' | 'Certification';

export interface SkillEvidence {
  id: string;
  type: EvidenceType;
  title: string;
  date?: string;
  score?: string;
  url?: string;
  description?: string;
}

export type Evidence = SkillEvidence;

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0 - 100
  confidence: ConfidenceLevel | null;
  type: SkillType;
  evidence: SkillEvidence[];
  yearsExp: number;
  marketDemand: 'Surging' | 'High' | 'Moderate';
  lastPracticed: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  companyName?: string;
  company: string;
  companyNameSource?: 'adzuna' | 'structured' | 'description' | 'publisher' | 'unknown';
  location: string;
  startDate: string;
  endDate: string; // or 'Present'
  bullets: string[];
  skillsUsed: string[];
}

export interface UserProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  verified: boolean;
}

export interface UserCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  verified: boolean;
}

export interface UserEducation {
  id: string;
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  targetRole: string;
  targetRoleAlignment: number; // 0 - 100
  alignmentTrend: number; // e.g. +8
  summary: string;
  skills: UserSkill[];
  experience: WorkExperience[];
  projects: UserProject[];
  certifications: UserCertification[];
  education: UserEducation[];
  hasUploadedResume?: boolean;
  uploadedResumeName?: string;
  activeResumeId?: string;
  resumeSource?: string;
  isDemoMode?: boolean;
  onboardingCompleted?: boolean;
}

export interface JobOpportunity {
  id: string;
  title: string;
  companyName?: string;
  company: string;
  companyNameSource?: 'adzuna' | 'structured' | 'description' | 'publisher' | 'unknown';
  companyLogo?: string;
  location: string;
  country: string;
  workplaceType: string;
  employmentType: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary: string;
  currency: string;
  postedAt: string;
  updatedAt: string;
  sourceType: string;
  sourceName: string;
  sourceUrl: string;
  originalUrl: string;
  retrievedAt: string;
  isVerified: boolean;

  // Matching specific fields
  matchScore: number;
  matchedSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  evidenceStrength: string;
  roleAlignment: string;
  locationMatch: boolean;
  aiExplanation: string;
  
  saved?: boolean;
}

export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  suggestedTargetRole: string;
  skills: Array<{
    name: string;
    category: SkillCategory;
    proficiency: number;
    type: 'demonstrated' | 'claimed';
    confidence: ConfidenceLevel;
    evidenceTitle?: string;
    needsConfirmation?: boolean;
  }>;
  experience: Array<{
    title: string;
    companyName?: string;
  company: string;
  companyNameSource?: 'adzuna' | 'structured' | 'description' | 'publisher' | 'unknown';
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    bullets: string[];
    technologies: string[];
    needsConfirmation?: boolean;
  }>;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    results?: string;
    githubUrl?: string;
    liveUrl?: string;
    needsConfirmation?: boolean;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    gpa?: string;
    needsConfirmation?: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    verified: boolean;
    needsConfirmation?: boolean;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    year?: string;
    needsConfirmation?: boolean;
  }>;
  interests?: string[];
  languages?: string[];
  additionalInformation?: string[];
  _parserMethod?: 'ai' | 'heuristic';
}

export function createEmptyProfile(userId: string = 'usr_guest', name: string = '', email: string = ''): UserProfile {
  return {
    id: userId,
    name: name,
    email: email,
    title: '',
    location: '',
    targetRole: '',
    targetRoleAlignment: 0,
    alignmentTrend: 0,
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    certifications: [],
    education: [],
    hasUploadedResume: false,
    isDemoMode: false,
    onboardingCompleted: false
  };
}

export interface SkillTrend {
  id: string;
  name: string;
  category: SkillCategory;
  growthRate: string; // e.g. '+48%'
  growthScore: number; // 0-100
  trendLevel: 'Surging' | 'High Growth' | 'Stable' | 'Emerging';
  arrows: '↑↑↑' | '↑↑' | '↑' | '→';
  demandIndex: number; // 1-100
  activeJobCount: number;
  avgSalary: string;
  relatedRoles: string[];
  relatedSkills: string[];
  userProficiency: number | null; // null if not in user profile
  marketSummary: string;
}

export interface CareerRoleNode {
  id: string;
  title: string;
  level: 'Foundational' | 'Mid' | 'Target' | 'Specialized' | 'Executive';
  userAlignment: number;
  industryDemand: 'Very High' | 'High' | 'Growing' | 'Moderate';
  medianComp: string;
  openingsCount: string;
  timeToTransition: string;
  requiredSkills: string[];
  skillGaps: string[];
  nextSteps: string[];
  connections: string[]; // Connected node IDs
  coordinates: { x: number; y: number };
}

export interface SimulationResult {
  baseRole: string;
  initialAlignment: number;
  simulatedAlignment: number;
  delta: number;
  addedSkills: string[];
  roleCompatibilities: Array<{
    role: string;
    before: number;
    after: number;
    delta: number;
  }>;
  newJobsUnlocked: number;
  remainingPriorityGaps: string[];
  strategicAdvice: string;
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  isLiveWeb?: boolean;
  citations?: WorkforceSource[];
  structuredSkills?: {
    matched: string[];
    developing: string[];
    missing: string[];
  };
  actionLink?: {
    label: string;
    tab: string;
    params?: any;
  };
}

export interface MentorSession {
  id: string;
  title: string;
  lastUpdated: string;
  messages: MentorMessage[];
}

export interface WorkforceSource {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  publishDate?: string;
}


export interface MarketAnalytics {
  salaryDistribution: { range: string; percentage: number }[];
  topSkillsDemand: { skill: string; demandPercentage: number }[];
  hiringTrends: { timePeriod: string; demandIndex: number }[];
}

export interface WorkforceIntelligenceResult {
  query: string;
  summary: string;
  emergingSkills: string[];
  trendingRoles: string[];
  twinAlignment: {
    matched: string[];
    developing: string[];
    missing: string[];
    overallScore: number;
  };
  recommendedNextSteps: string[];
  sources: WorkforceSource[];
  analyticsData?: MarketAnalytics;
  isLiveWeb: boolean;
  timestamp: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAnonymous?: boolean;
  provider: 'google' | 'password' | 'guest';
  createdAt?: string;
}

export interface OnboardingData {
  name: string;
  title: string;
  targetRole: string;
  resumeFileName?: string;
  resumeText?: string;
  selectedSkills: string[];
}

