import React, { useState } from 'react';
import { ParsedResumeData, UserProfile } from '../../types';
import { UserResumeRecord } from '../../types/resume';
import { resumeStorageService } from '../../services/resumeStorageService';
import {
  FileText,
  CheckCircle2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Layers,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ResumeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  rawText: string;
  fileType: 'pdf' | 'docx' | 'txt';
  userId: string;
  initialParsed: ParsedResumeData;
  onConfirmSuccess: (newProfile: UserProfile, record: UserResumeRecord) => void;
}

export const ResumeVerificationModal: React.FC<ResumeVerificationModalProps> = ({
  isOpen,
  onClose,
  fileName,
  rawText,
  fileType,
  userId,
  initialParsed,
  onConfirmSuccess
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialParsed.personalInfo?.name || '');
  const [email, setEmail] = useState(initialParsed.personalInfo?.email || '');
  const [phone, setPhone] = useState(initialParsed.personalInfo?.phone || '');
  const [location, setLocation] = useState(initialParsed.personalInfo?.location || '');
  const [summary, setSummary] = useState(initialParsed.summary || '');
  const [targetRole, setTargetRole] = useState(initialParsed.suggestedTargetRole || 'Professional');

  const [skills, setSkills] = useState(initialParsed.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [experience, setExperience] = useState(initialParsed.experience || []);
  const [projects, setProjects] = useState(initialParsed.projects || []);
  const [education, setEducation] = useState(initialParsed.education || []);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setSkills([
      ...skills,
      {
        name: newSkillInput.trim(),
        category: 'Core AI/ML',
        proficiency: 80,
        type: 'demonstrated',
        confidence: 'High',
        evidenceTitle: `Added during extraction review (${fileName})`
      }
    ]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const handleConfirm = () => {
    const finalParsed: ParsedResumeData = {
      personalInfo: {
        name: name.trim() || 'Candidate',
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        linkedin: initialParsed.personalInfo?.linkedin || '',
        github: initialParsed.personalInfo?.github || '',
        portfolio: initialParsed.personalInfo?.portfolio || ''
      },
      summary: summary.trim(),
      suggestedTargetRole: targetRole.trim(),
      skills,
      experience,
      projects,
      education,
      certifications: initialParsed.certifications || [],
      achievements: initialParsed.achievements || []
    };

    // 1. Create unique resume record for user
    const resumeRecord = resumeStorageService.createResumeRecordFromExtraction(
      userId,
      fileName,
      fileType,
      rawText,
      finalParsed
    );

    // 2. Build updated profile
    const newProfile = resumeStorageService.buildProfileFromResume(resumeRecord);

    onConfirmSuccess(newProfile, resumeRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full my-6 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Truthful Resume Verification
              </span>
              <p className="text-[11px] text-slate-500">
                Verify actual content extracted from your document before syncing to CareerTwin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* FILE UPLOADED CARD */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                FILE UPLOADED
              </span>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {fileName}
                </span>
                <span className="text-[10px] bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-semibold uppercase">
                  {fileType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Parsed</span>
            </div>
          </div>

          {/* EXTRACTED FROM YOUR RESUME HEADER & ACTION */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              EXTRACTED FROM YOUR RESUME
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'View Summary' : 'Edit Extraction'}</span>
            </button>
          </div>

          {/* FIELD REVIEW BOXES */}
          {isEditing ? (
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Target Role"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Professional Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              {/* Skills edit */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add custom extracted skill..."
                    className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <button
                    onClick={handleAddSkill}
                    type="button"
                    className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1 text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg"
                    >
                      <span>{s.name}</span>
                      <button
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Name & Contact */}
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Name</span>
                  <span className="text-[10px] text-slate-400">Email</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {name || <em className="text-amber-600 font-normal">Needs confirmation</em>}
                  </span>
                  <span className="text-xs font-mono text-slate-700">
                    {email || <em className="text-slate-400">Not specified</em>}
                  </span>
                </div>
              </div>

              {/* Education */}
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Education</span>
                {education.length > 0 ? (
                  <div className="space-y-1">
                    {education.map((edu, i) => (
                      <div key={i} className="text-xs text-slate-800">
                        <strong>{edu.degree}</strong> {edu.school ? `— ${edu.school}` : ''} {edu.year ? `(${edu.year})` : ''}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None explicitly extracted from document</span>
                )}
              </div>

              {/* Experience */}
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Experience</span>
                {experience.length > 0 ? (
                  <div className="space-y-2">
                    {experience.slice(0, 3).map((exp, i) => (
                      <div key={i} className="text-xs text-slate-800 border-l-2 border-indigo-400 pl-2">
                        <div className="font-bold">{exp.title} — {exp.company}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {exp.startDate} – {exp.endDate || 'Present'}
                        </div>
                      </div>
                    ))}
                    {experience.length > 3 && (
                      <div className="text-[11px] text-slate-500">
                        + {experience.length - 3} additional experience entries
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None explicitly extracted from document</span>
                )}
              </div>

              {/* Projects */}
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Projects</span>
                {projects.length > 0 ? (
                  <div className="space-y-1.5">
                    {projects.slice(0, 3).map((p, i) => (
                      <div key={i} className="text-xs text-slate-800">
                        <span className="font-bold">{p.title}</span>: {p.description || 'Verified project artifact'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None explicitly extracted from document</span>
                )}
              </div>

              {/* Skills */}
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Skills ({skills.length} Extracted)
                  </span>
                </div>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {skills.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded-md shadow-2xs"
                      >
                        <Flame className="w-3 h-3 text-indigo-600" />
                        <span>{s.name}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None explicitly extracted from document</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            {isEditing ? 'Preview Summary' : 'Edit Extraction'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Extracted Data</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
