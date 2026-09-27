import {
  UserSkill,
  SkillEvidence,
  WorkExperience,
  UserProject,
  UserEducation,
  UserCertification
} from './index';

export interface ResumeContact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ResumeExperienceItem extends WorkExperience {
  role?: string;
  period?: string;
  achievements?: string[];
  technologies?: string[];
  needsConfirmation?: boolean;
}

export interface ResumeProjectItem extends UserProject {
  name?: string;
  highlights?: string[];
  needsConfirmation?: boolean;
}

export interface ResumeEducationItem extends UserEducation {
  relevantCourses?: string[];
  needsConfirmation?: boolean;
}

export interface ResumeCertificationItem extends UserCertification {
  url?: string;
  needsConfirmation?: boolean;
}

export interface ResumeAchievementItem {
  id: string;
  title: string;
  description: string;
  year?: string;
  needsConfirmation?: boolean;
}

export interface ResumeLeadershipItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface ResumeCustomLink {
  id: string;
  label: string;
  url: string;
}

export interface BulletImprovement {
  id: string;
  experienceId: string;
  bulletIndex: number;
  original: string;
  improved: string;
  whyBetter: string;
  actionVerb: string;
  methodology: 'STAR' | 'Technical Precision' | 'Action-Oriented' | 'Keyword Alignment';
  accepted?: boolean;
}

export interface TargetJobAnalysis {
  role: string;
  company: string;
  source: 'jobradar' | 'pasted' | 'uploaded';
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  toolsAndTech: string[];
  domainKeywords: string[];
  rawDescription?: string;
}

export interface ATSBreakdown {
  overallScore: number;
  keywordCoverage: number;       // e.g. 78%
  skillCoverage: number;         // e.g. 82%
  experienceRelevance: number;   // e.g. 80%
  projectRelevance: number;      // e.g. 85%
  roleAlignment: number;         // e.g. 88%
  resumeStructure: number;       // e.g. 96%
  achievementQuality: number;    // e.g. 75%
  
  matchedKeywords: string[];
  missingKeywords: string[];
  weakEvidenceKeywords: string[];
  formattingChecks: {
    label: string;
    passed: boolean;
    note: string;
  }[];
  calculationExplanation: string;
}

export interface ResumeVersion {
  id: string;
  title: string;                 // e.g. "Master Resume", "ML Engineer Resume", "Data Scientist Resume"
  targetRole: string;
  lastUpdated: string;
  isOriginalUpload?: boolean;
  isAiOptimized?: boolean;
  
  contact: ResumeContact;
  summary: string;
  skills: UserSkill[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  education: ResumeEducationItem[];
  certifications: ResumeCertificationItem[];
  achievements: ResumeAchievementItem[];
  leadership: ResumeLeadershipItem[];
  links: ResumeCustomLink[];
  
  sectionOrder: string[];        // ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements', 'leadership']
}

export interface UserResumeRecord {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  uploadedAt: string;
  rawText: string;
  status: 'uploaded' | 'parsing' | 'parsed' | 'confirmed';
  source: 'USER UPLOAD';
  structuredData: any; // ParsedResumeData
  activeVersionId: string;
  versions: ResumeVersion[];
  debugInfo?: {
    extractionTimestamp: string;
    extractedSkillsCount: number;
    extractedExperienceCount: number;
  };
}
