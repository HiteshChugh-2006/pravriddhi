import React, { useState, useRef } from 'react';
import {
  Upload,
  Search,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  FileText,
  Sparkles,
  HelpCircle,
  Edit2,
  Trash2,
  Briefcase,
  Layers,
  GraduationCap,
  FolderGit2,
  AlertCircle
} from 'lucide-react';
import { SkillCategory, SkillType, ConfidenceLevel, UserProject, WorkExperience, UserEducation } from '../../types';
import { extractDocumentContent } from '../../services/documentExtractor';
import { parseResumeRawText } from '../../services/resumeParserService';

export interface OnboardingSkill {
  name: string;
  category: SkillCategory;
  proficiency: number; // 0 - 100
  level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  confidence: ConfidenceLevel | null;
  type: SkillType;
  evidence: string[];
  confirmed?: boolean;
}

interface SkillsStepProps {
  userName: string;
  skills: OnboardingSkill[];
  setSkills: (skills: OnboardingSkill[]) => void;
  onExtractedProfileData?: (data: {
    projects: UserProject[];
    experience: WorkExperience[];
    education: UserEducation[];
    resumeFileName?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_GLOBAL_SKILLS: Array<{ name: string; category: SkillCategory; defaultLevel: 'Beginner' | 'Intermediate' | 'Advanced'; evidence: string[] }> = [
  // Programming & AI/ML
  { name: 'Python', category: 'Core AI/ML', defaultLevel: 'Intermediate', evidence: ['Scripting, data modeling & backend algorithms'] },
  { name: 'Machine Learning', category: 'Core AI/ML', defaultLevel: 'Intermediate', evidence: ['Supervised models, regression & classification pipelines'] },
  { name: 'Deep Learning (PyTorch)', category: 'Core AI/ML', defaultLevel: 'Intermediate', evidence: ['Neural network architectures and tensor operations'] },
  { name: 'SQL', category: 'Data & Analytics', defaultLevel: 'Intermediate', evidence: ['Complex queries, joins, aggregations & database schemas'] },
  { name: 'FastAPI', category: 'Software & Infrastructure', defaultLevel: 'Intermediate', evidence: ['RESTful microservices, asynchronous routing & OpenAPI'] },
  { name: 'Docker & Containers', category: 'Software & Infrastructure', defaultLevel: 'Beginner', evidence: ['Containerization, multi-stage builds & environment isolation'] },
  
  // Web & Full Stack
  { name: 'React', category: 'Software & Infrastructure', defaultLevel: 'Intermediate', evidence: ['Component architecture, hooks, state management & UI rendering'] },
  { name: 'TypeScript', category: 'Software & Infrastructure', defaultLevel: 'Intermediate', evidence: ['Static typing, interfaces & modern web applications'] },
  { name: 'Node.js', category: 'Software & Infrastructure', defaultLevel: 'Intermediate', evidence: ['Server runtime, backend APIs & package management'] },
  { name: 'Java', category: 'Software & Infrastructure', defaultLevel: 'Intermediate', evidence: ['Object-oriented design, enterprise services & data structures'] },
  { name: 'C++', category: 'Software & Infrastructure', defaultLevel: 'Beginner', evidence: ['Systems programming, memory management & algorithms'] },
  
  // Data Science & Analytics
  { name: 'Data Science', category: 'Data & Analytics', defaultLevel: 'Intermediate', evidence: ['Exploratory data analysis, statistical hypotheses & feature engineering'] },
  { name: 'Pandas & NumPy', category: 'Data & Analytics', defaultLevel: 'Intermediate', evidence: ['Vectorized operations, dataframes & data transformation'] },
  { name: 'Data Visualization', category: 'Data & Analytics', defaultLevel: 'Intermediate', evidence: ['Interactive charts, executive reporting & dashboard design'] },
  
  // Cloud & Emerging Tech
  { name: 'Cloud (AWS / GCP / Azure)', category: 'Cloud & Systems', defaultLevel: 'Beginner', evidence: ['Virtual machines, object storage & cloud deployment'] },
  { name: 'Git & Version Control', category: 'Software & Infrastructure', defaultLevel: 'Intermediate', evidence: ['Branch workflows, pull requests & code review collaboration'] },
  { name: 'Large Language Models (LLMs)', category: 'Emerging Tech', defaultLevel: 'Intermediate', evidence: ['Prompt engineering, embeddings & API integration'] },
  { name: 'Kubernetes', category: 'Software & Infrastructure', defaultLevel: 'Beginner', evidence: ['Pod orchestration, deployment manifests & cluster config'] }
];

import { analyzeSkill, assessSkillWithGemini, SkillIntelligence, SkillAssessmentResult } from '../../services/aiService';

const SkillCard: React.FC<{
  skill: OnboardingSkill;
  onRemove: () => void;
  onUpdateLevel: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
}> = ({ skill, onRemove, onUpdateLevel }) => {
  const [intel, setIntel] = React.useState<SkillIntelligence | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [loadingIntel, setLoadingIntel] = React.useState(false);
  const [assessing, setAssessing] = React.useState(false);
  const [assessmentResult, setAssessmentResult] = React.useState<SkillAssessmentResult | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const fetchIntel = async () => {
      setLoadingIntel(true);
      const res = await analyzeSkill(skill.name);
      if (mounted) {
        setIntel(res);
        setLoadingIntel(false);
      }
    };
    fetchIntel();
    return () => { mounted = false; };
  }, [skill.name]);

  const levelText = skill.level || 'Not set';
  const hasEvidence = skill.evidence && skill.evidence.length > 0;

  const handleAssess = async () => {
    if (!intel) return;
    if (!hasEvidence) {
      alert("No evidence provided yet. Please add evidence before assessing.");
      return;
    }
    setAssessing(true);
    const result = await assessSkillWithGemini(skill.name, skill.evidence, intel.levelGuidance);
    if (result) {
      setAssessmentResult(result);
      if (result.assessmentLevel) {
        onUpdateLevel(result.assessmentLevel);
      }
    }
    setAssessing(false);
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-200 transition-all flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-sm font-bold text-slate-900 block">
            {skill.name}
          </span>
          <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
            {intel ? intel.category : skill.category}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5 italic">Added by you</span>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            skill.level === 'Advanced' ? 'bg-emerald-100 text-emerald-800' :
            skill.level === 'Intermediate' ? 'bg-indigo-100 text-indigo-800' :
            skill.level === 'Beginner' ? 'bg-amber-100 text-amber-800' :
            'bg-slate-200 text-slate-600'
          }`}>
            {levelText}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Remove skill"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Evidence Section */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Evidence:
        </span>
        <div className="space-y-1">
          {hasEvidence ? (
            skill.evidence.map((ev, i) => (
              <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-snug">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{ev}</span>
              </div>
            ))
          ) : (
            <div className="text-[11px] text-slate-500 italic">
              No evidence provided yet.
            </div>
          )}
        </div>
      </div>

      {/* Add Evidence CTA (simulated) */}
      {!hasEvidence && (
        <button type="button" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 self-start cursor-pointer">
          + Add evidence
        </button>
      )}

      {/* Expandable Intelligence Section */}
      <div className="pt-2 border-t border-slate-200/60">
        <button 
          onClick={() => setExpanded(!expanded)}
          type="button"
          className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-700 w-full cursor-pointer"
        >
          {expanded ? 'Hide about this skill' : 'About this skill'}
        </button>
        
        {expanded && (
          <div className="mt-3 space-y-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
            {loadingIntel ? (
              <div className="text-[10px] text-slate-400 animate-pulse">Loading skill intelligence...</div>
            ) : intel ? (
              <>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">What it involves</span>
                  <p className="text-[11px] text-slate-600 leading-snug">{intel.shortDescription}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Often used with</span>
                  <p className="text-[11px] text-indigo-600 font-medium">{intel.relatedSkills.slice(0, 5).join(' · ')}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Evidence could include</span>
                  <ul className="text-[11px] text-slate-600 leading-snug list-disc pl-3">
                    {intel.evidenceExamples.slice(0, 2).map((ex, i) => <li key={i}>{ex}</li>)}
                  </ul>
                </div>
                {intel.marketTrend && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" /> Market Intelligence
                    </span>
                    <p className="text-[11px] text-slate-600 leading-snug bg-slate-50 p-2 rounded-lg border border-slate-100">{intel.marketTrend}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-[10px] text-slate-400">Skill information is temporarily unavailable.</div>
            )}
          </div>
        )}
      </div>

      {/* Assessment Result */}
      {assessmentResult && (
        <div className="mt-2 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-bold text-indigo-900">AI Assessment: {assessmentResult.assessmentLevel || 'Needs more evidence'}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-indigo-100 text-indigo-700 ml-auto">{assessmentResult.confidence} Confidence</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-snug">{assessmentResult.reasoningSummary}</p>
          <div className="text-[9px] text-indigo-600 font-medium">Missing: {assessmentResult.missingEvidence}</div>
        </div>
      )}

      {/* Confirm or Adjust Level */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400">Set Level:</span>
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onUpdateLevel(lvl)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                skill.level === lvl
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAssess}
          disabled={!hasEvidence || assessing || !intel}
          className={`text-[10px] font-semibold transition-colors cursor-pointer ${
            hasEvidence && intel && !assessing ? 'text-indigo-600 hover:text-indigo-800 hover:underline' : 'text-slate-400 cursor-not-allowed'
          }`}
        >
          {assessing ? 'Assessing...' : 'Assess this for me'}
        </button>
      </div>
    </div>
  );
};

export const SkillsStep: React.FC<SkillsStepProps> = ({
  userName,
  skills,
  setSkills,
  onExtractedProfileData,
  onNext,
  onBack
}) => {
  // Mode: 'resume' | 'manual' | 'both'
  const [activeMode, setActiveMode] = useState<'both' | 'resume' | 'manual'>('both');

  // Resume Upload & Extraction State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractedSummary, setExtractedSummary] = useState<{
    projectCount: number;
    experienceCount: number;
    skillsCount: number;
  } | null>(null);

  // Skill Editor & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customInput, setCustomInput] = useState('');
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);
  const [assessmentModalSkill, setAssessmentModalSkill] = useState<OnboardingSkill | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: string[] = [
    'All',
    'Core AI/ML',
    'Data & Analytics',
    'Software & Infrastructure',
    'Cloud & Systems',
    'Emerging Tech'
  ];

  // Helper to map level string to proficiency number
  const levelToProficiency = (level: 'Beginner' | 'Intermediate' | 'Advanced'): number => {
    switch (level) {
      case 'Beginner': return 50;
      case 'Intermediate': return 75;
      case 'Advanced': return 90;
    }
  };

  const proficiencyToLevel = (prof: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
    if (prof >= 85) return 'Advanced';
    if (prof >= 65) return 'Intermediate';
    return 'Beginner';
  };

  // Add / Toggle skill
  const togglePresetSkill = (preset: typeof PRESET_GLOBAL_SKILLS[0]) => {
    const existingIndex = skills.findIndex(
      (s) => s.name.toLowerCase() === preset.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      setSkills(skills.filter((_, i) => i !== existingIndex));
    } else {
      const newSkill: OnboardingSkill = {
        name: preset.name,
        category: preset.category,
        proficiency: 0,
        level: null,
        confidence: null,
        type: 'claimed',
        evidence: [],
        confirmed: true
      };
      setSkills([...skills, newSkill]);
    }
    setError(null);
  };

  // Add custom typed skill
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const exists = skills.some(
      (s) => s.name.toLowerCase() === customInput.trim().toLowerCase()
    );
    if (!exists) {
      const newSkill: OnboardingSkill = {
        name: customInput.trim(),
        category: 'Software & Infrastructure', // Default, might be updated by intelligence
        proficiency: 0,
        level: null,
        confidence: null,
        type: 'claimed',
        evidence: [],
        confirmed: true
      };
      setSkills([...skills, newSkill]);
    }
    setCustomInput('');
    setError(null);
  };

  // Update level for a specific skill
  const handleUpdateLevel = (skillName: string, newLevel: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setSkills(skills.map((s) => {
      if (s.name.toLowerCase() === skillName.toLowerCase()) {
        return {
          ...s,
          level: newLevel,
          proficiency: levelToProficiency(newLevel),
          confirmed: true
        };
      }
      return s;
    }));
  };



  // Process Document File (PDF, DOCX, TXT)
  const processUploadedFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const extractedDoc = await extractDocumentContent(file);
      setUploadedFileName(file.name);

      // Parse with resume parser service
      const parsedResume = parseResumeRawText(
        extractedDoc.text,
        file.name
      );

      // Map parsed skills to evidence-backed OnboardingSkills
      const newExtractedSkills: OnboardingSkill[] = (parsedResume.skills || []).map((s) => {
        const evidenceItems: string[] = [];
        if (s.evidence && s.evidence.length > 0) {
          s.evidence.forEach(e => evidenceItems.push(e.title));
        } else {
          evidenceItems.push(`Extracted from ${file.name}`);
        }

        const lvl = proficiencyToLevel(s.proficiency);

        return {
          name: s.name,
          category: s.category || 'Software & Infrastructure',
          proficiency: s.proficiency || levelToProficiency(lvl),
          level: lvl,
          confidence: s.confidence || 'High',
          type: s.type || 'demonstrated',
          evidence: evidenceItems,
          confirmed: false
        };
      });

      // Merge without duplicates
      const mergedMap = new Map<string, OnboardingSkill>();
      skills.forEach(s => mergedMap.set(s.name.toLowerCase(), s));
      newExtractedSkills.forEach(s => {
        if (!mergedMap.has(s.name.toLowerCase())) {
          mergedMap.set(s.name.toLowerCase(), s);
        }
      });

      const mergedList = Array.from(mergedMap.values());
      setSkills(mergedList);

      setExtractedSummary({
        projectCount: (parsedResume.projects || []).length,
        experienceCount: (parsedResume.experience || []).length,
        skillsCount: newExtractedSkills.length
      });

      if (onExtractedProfileData) {
        onExtractedProfileData({
          projects: (parsedResume.projects || []).map((p, idx) => ({
            id: `proj_ext_${Date.now()}_${idx}`,
            title: p.title,
            description: p.description,
            tech: p.tech || [],
            verified: true
          })),
          experience: (parsedResume.experience || []).map((exp, idx) => ({
            id: `exp_ext_${Date.now()}_${idx}`,
            title: exp.title,
            company: exp.company,
            location: exp.location || 'Remote',
            startDate: exp.startDate || '2023',
            endDate: exp.endDate || 'Present',
            bullets: exp.bullets || [],
            skillsUsed: exp.skillsUsed || []
          })),
          education: (parsedResume.education || []).map((edu, idx) => ({
            id: `edu_ext_${Date.now()}_${idx}`,
            degree: edu.degree,
            school: edu.school,
            year: edu.year || '2025'
          })),
          resumeFileName: file.name
        });
      }

    } catch (err: any) {
      console.error('Error processing resume:', err);
      setUploadError(err.message || 'Could not parse the document. Please try a TXT or PDF file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Sample Resume Quick-Loader for instant evaluation without external files
  const handleLoadSampleResume = () => {
    setIsUploading(true);
    setUploadError(null);

    setTimeout(() => {
      setUploadedFileName('Alex_Chen_Software_Resume.pdf');
      
      const sampleExtractedSkills: OnboardingSkill[] = [
        {
          name: 'Python',
          category: 'Core AI/ML',
          proficiency: 85,
          level: 'Advanced',
          confidence: 'High',
          type: 'demonstrated',
          evidence: ['Used in ML project', 'Listed in 1-year internship experience', 'Applied in production data pipeline'],
          confirmed: true
        },
        {
          name: 'SQL',
          category: 'Data & Analytics',
          proficiency: 80,
          level: 'Intermediate',
          confidence: 'High',
          type: 'demonstrated',
          evidence: ['Built relational schemas in database project', 'Optimized analytics queries'],
          confirmed: true
        },
        {
          name: 'React',
          category: 'Software & Infrastructure',
          proficiency: 75,
          level: 'Intermediate',
          confidence: 'High',
          type: 'demonstrated',
          evidence: ['Developed interactive web dashboard', 'Integrated with REST APIs'],
          confirmed: true
        },
        {
          name: 'FastAPI',
          category: 'Software & Infrastructure',
          proficiency: 70,
          level: 'Intermediate',
          confidence: 'Moderate',
          type: 'demonstrated',
          evidence: ['Built backend microservices for machine learning models'],
          confirmed: false
        },
        {
          name: 'Docker & Containers',
          category: 'Software & Infrastructure',
          proficiency: 50,
          level: 'Beginner',
          confidence: 'Moderate',
          type: 'demonstrated',
          evidence: ['Basic container configuration in student project'],
          confirmed: false
        }
      ];

      setSkills(sampleExtractedSkills);
      setExtractedSummary({
        projectCount: 3,
        experienceCount: 1,
        skillsCount: 5
      });

      if (onExtractedProfileData) {
        onExtractedProfileData({
          projects: [
            {
              id: `proj_sample_1`,
              title: 'Real-time Predictive Classifier Service',
              description: 'Developed an asynchronous inference API using FastAPI, Python, and Docker.',
              tech: ['Python', 'FastAPI', 'Docker', 'SQL'],
              verified: true
            },
            {
              id: `proj_sample_2`,
              title: 'Interactive Career Analytics Dashboard',
              description: 'Engineered responsive frontend with React, TypeScript, and Tailwind CSS.',
              tech: ['React', 'TypeScript', 'Tailwind CSS'],
              verified: true
            }
          ],
          experience: [
            {
              id: `exp_sample_1`,
              title: 'Software Development Intern',
              company: 'Global Tech Innovations',
              location: 'Remote',
              startDate: 'June 2024',
              endDate: 'August 2024',
              bullets: [
                'Designed and implemented SQL data transformation pipelines',
                'Built backend microservices using Python and FastAPI',
                'Collaborated with senior engineers using Git pull requests'
              ],
              skillsUsed: ['Python', 'SQL', 'FastAPI', 'Git']
            }
          ],
          education: [
            {
              id: `edu_sample_1`,
              degree: 'B.S. in Computer Science',
              school: 'University Institute of Technology',
              year: '2025'
            }
          ],
          resumeFileName: 'Alex_Chen_Software_Resume.pdf'
        });
      }

      setIsUploading(false);
    }, 600);
  };

  const handleContinue = () => {
    if (skills.length === 0) {
      setError('Please add at least 2 skills or upload a resume to proceed.');
      return;
    }
    setError(null);
    onNext();
  };

  const filteredPresets = PRESET_GLOBAL_SKILLS.filter((preset) => {
    const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Layers className="w-3.5 h-3.5" />
          <span>Step 3 of 8 · Show Us What You Know</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What are your practical skills?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Upload your resume, pick from key skills, or do both. We estimate your level only when there is supporting evidence from projects or work.
        </p>
      </div>

      {/* Mode Switcher: [ Upload My Resume ] [ Add My Skills ] [ Do Both ] */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 max-w-md mx-auto border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveMode('both')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'both'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Do Both
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('resume')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'resume'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upload Resume
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('manual')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'manual'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Add Skills
        </button>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Mode 1 & Mode 3: Resume Upload Card */}
      {(activeMode === 'resume' || activeMode === 'both') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Upload Your Resume</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                We'll extract skills, projects, and work experience with supporting evidence.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/60 transition-all cursor-pointer w-fit"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try with Sample Resume</span>
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isUploading
                ? 'border-indigo-400 bg-indigo-50/50'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processUploadedFile(file);
              }}
            />

            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                {isUploading ? 'Extracting evidence & skills...' : 'Drop your resume here, or browse files'}
              </span>
              <span className="text-xs text-slate-400">
                Supports PDF, DOCX, and TXT files
              </span>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadedFileName && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    {uploadedFileName}
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Extracted {extractedSummary?.skillsCount || 0} skills, {extractedSummary?.projectCount || 0} projects, and {extractedSummary?.experienceCount || 0} roles with evidence.
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-800 bg-white/80 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                Verified
              </span>
            </div>
          )}
        </div>
      )}

      {/* Selected Skills & Evidence Verification Section */}
      {skills.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your Identified Skills ({skills.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your estimated level and supporting evidence.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Does this look right?
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                onRemove={() => setSkills(skills.filter((s) => s.name !== skill.name))}
                onUpdateLevel={(lvl) => handleUpdateLevel(skill.name, lvl)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mode 2 & Mode 3: Add Skills from Library or Search */}
      {(activeMode === 'manual' || activeMode === 'both') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Search & Add Additional Skills</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any skill to add it with evidence from your work.
              </p>
            </div>

            {/* Custom Add Form */}
            <form onSubmit={handleAddCustom} className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Add custom skill..."
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Search bar & Category filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (e.g. Python, SQL, Docker, React)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
            {filteredPresets.map((preset) => {
              const isSelected = skills.some(
                (s) => s.name.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => togglePresetSkill(preset)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-2xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {preset.category}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    )}
                  </div>
                  <span className={`text-xs font-bold truncate ${
                    isSelected ? 'text-indigo-900' : 'text-slate-800'
                  }`}>
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
