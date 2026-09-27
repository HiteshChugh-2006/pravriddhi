import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { SkillBar } from '../common/SkillBar';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { UserProfile, UserSkill, SkillCategory, SkillType } from '../../types';
import { SkillDetailModal } from '../common/SkillDetailModal';
import { MatchExplainModal } from '../common/MatchExplainModal';
import { ResumeExtractionModal } from '../common/ResumeExtractionModal';
import {
  ShieldCheck,
  HelpCircle,
  Plus,
  FileText,
  FolderGit2,
  Award,
  CheckCircle2,
  Upload,
  Sparkles,
  ExternalLink,
  Filter
} from 'lucide-react';

interface CareerTwinViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToSimulator: () => void;
}

export const CareerTwinView: React.FC<CareerTwinViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToSimulator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'demonstrated' | 'claimed'>('all');
  const [activeTab, setActiveTab] = useState<'skills' | 'projects' | 'certifications' | 'experience'>('skills');

  // Inspection & automation modals
  const [inspectedSkill, setInspectedSkill] = useState<UserSkill | null>(null);
  const [isMatchExplainOpen, setIsMatchExplainOpen] = useState(false);
  const [isResumeExtractOpen, setIsResumeExtractOpen] = useState(false);

  // Modal for adding a new skill
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Core AI/ML');
  const [newSkillProficiency, setNewSkillProficiency] = useState(70);
  const [newSkillType, setNewSkillType] = useState<SkillType>('demonstrated');
  const [newSkillEvidenceTitle, setNewSkillEvidenceTitle] = useState('');

  // Counts
  const demonstratedSkills = profile.skills.filter(s => s.type === 'demonstrated');
  const claimedSkills = profile.skills.filter(s => s.type === 'claimed');

  const filteredSkills = profile.skills.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesType =
      filterType === 'all' ||
      (filterType === 'demonstrated' && skill.type === 'demonstrated') ||
      (filterType === 'claimed' && skill.type === 'claimed');
    return matchesCategory && matchesType;
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: UserSkill = {
      id: `sk_custom_${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: Number(newSkillProficiency),
      confidence: newSkillType === 'demonstrated' ? 'High' : 'Moderate',
      type: newSkillType,
      yearsExp: 2,
      marketDemand: 'High',
      lastPracticed: 'Recently',
      evidence: newSkillEvidenceTitle
        ? [
            {
              id: `ev_${Date.now()}`,
              type: newSkillType === 'demonstrated' ? 'Project' : 'Resume',
              title: newSkillEvidenceTitle
            }
          ]
        : []
    };

    onUpdateProfile({
      ...profile,
      skills: [newSkill, ...profile.skills]
    });

    setNewSkillName('');
    setNewSkillEvidenceTitle('');
    setShowAddModal(false);
  };

  const totalArtifacts =
    profile.skills.reduce((acc, s) => acc + (s.evidence?.length || 0), 0) +
    profile.projects.length +
    profile.certifications.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dynamic Digital Twin Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Career Digital Twin
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            A living, evidence-verified model of your capabilities, projects, and target role readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsResumeExtractOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>{profile.hasUploadedResume ? 'Sync Resume' : 'Upload Resume'}</span>
          </button>

          {profile.hasUploadedResume && (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill & Evidence</span>
              </button>

              <button
                onClick={onNavigateToSimulator}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulate Skill Uplift</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!profile.hasUploadedResume ? (
        <div className="bg-white rounded-3xl border border-dashed border-indigo-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Upload your resume to build your CareerTwin
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pravriddhi requires your actual resume to extract your verified skills, experience, and projects. We never substitute pre-generated candidate profiles.
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsResumeExtractOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume (PDF, DOCX, TXT)</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Twin Verification Overview Metric Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-600">TARGET ROLE</span>
                <button
                  onClick={() => setIsMatchExplainOpen(true)}
                  className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 text-[11px]"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Audit</span>
                </button>
              </div>
              <p className="text-xl font-bold text-slate-900">{profile.targetRole || 'Not specified'}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span
                  onClick={() => setIsMatchExplainOpen(true)}
                  className="font-mono font-bold text-indigo-600 cursor-pointer hover:underline"
                >
                  {profile.targetRoleAlignment}% Match
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-mono">+{profile.alignmentTrend}% 30d</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-emerald-800">DEMONSTRATED SKILLS</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {demonstratedSkills.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Backed by code repos, assessments & production jobs
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-amber-800">CLAIMED (UNVERIFIED)</span>
                <HelpCircle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {claimedSkills.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Mentioned on resume without verified code artifacts
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-600">EVIDENCE ARTIFACTS</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {totalArtifacts}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Extracted directly from {profile.uploadedResumeName || 'uploaded resume'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Main Evidence Philosophy Callout (Claimed vs Demonstrated) */}
      <div className="glass-card rounded-2xl p-5 border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              The Pravriddhi Verification Standard
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Employers disregard ungrounded resume bullet points. Pravriddhi separates <strong>Claimed Familiarity</strong> from <strong>Demonstrated Competence</strong>, proving your skills with repos, production metrics, and standardized assessments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demonstrated</span>
          </span>
          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-dashed border-amber-200 px-2.5 py-1 rounded-md font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Claimed</span>
          </span>
        </div>
      </div>

      {/* Navigation tabs for twin sub-sections */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'skills'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skills & Evidence ({profile.skills.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'projects'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Project Artifacts ({profile.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'experience'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Work Experience ({profile.experience.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'certifications'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Certifications ({profile.certifications.length})
          </button>
        </div>

        {/* Filter controls for skills tab */}
        {activeTab === 'skills' && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Filter by Demonstrated vs Claimed */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('demonstrated')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  filterType === 'demonstrated' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demonstrated
              </button>
              <button
                onClick={() => setFilterType('claimed')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  filterType === 'claimed' ? 'bg-white text-amber-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Claimed
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200/90 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-indigo-400"
            >
              <option value="All">All Categories</option>
              <option value="Core AI/ML">Core AI/ML</option>
              <option value="Software & Infrastructure">Software & Infrastructure</option>
              <option value="Data & Analytics">Data & Analytics</option>
              <option value="Cloud & Systems">Cloud & Systems</option>
              <option value="Emerging Tech">Emerging Tech</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'skills' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => (
              <SkillBar
                key={skill.id}
                skill={skill}
                showEvidence={true}
                onInspect={(s) => setInspectedSkill(s)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {profile.projects.map((proj) => (
            <div key={proj.id} className="glass-card rounded-2xl p-5 border border-white/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Project Artifact</span>
                  </div>
                </div>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.tech.map((t) => (
                  <span key={t} className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'experience' && (
        <div className="space-y-4">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="glass-card rounded-2xl p-6 border border-white/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{exp.title}</h3>
                  <p className="text-xs text-indigo-700 font-semibold">{exp.company} · {exp.location}</p>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600 leading-relaxed">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">Demonstrated Skills:</span>
                {exp.skillsUsed.map((s) => (
                  <span key={s} className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.certifications.map((cert) => (
            <div key={cert.id} className="glass-card rounded-2xl p-5 border border-white/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                <p className="text-xs text-slate-500">{cert.issuer} · Issued {cert.year}</p>
                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-slate-400">ID: {cert.credentialId}</p>
                )}
                <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Credential</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Skill to CareerTwin</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kubernetes, Ray, LangGraph"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="Core AI/ML">Core AI/ML</option>
                    <option value="Software & Infrastructure">Software & Infrastructure</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Emerging Tech">Emerging Tech</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Proficiency ({newSkillProficiency}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                    className="w-full mt-2 accent-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Skill Verification Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSkillType('demonstrated')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left ${
                      newSkillType === 'demonstrated'
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-semibold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                    <span>Demonstrated (Backed by code)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSkillType('claimed')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left ${
                      newSkillType === 'claimed'
                        ? 'border-amber-500 bg-amber-50/60 text-amber-900 font-semibold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500 mb-1" />
                    <span>Claimed (Resume mention)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Evidence Artifact / Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. GitHub repo link, production project description, or certification"
                  value={newSkillEvidenceTitle}
                  onChange={(e) => setNewSkillEvidenceTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Save to CareerTwin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transparent Match Calculation Modal */}
      <MatchExplainModal
        isOpen={isMatchExplainOpen}
        onClose={() => setIsMatchExplainOpen(false)}
        profile={profile}
        targetRoleTitle={profile.targetRole}
        onNavigateToSimulator={onNavigateToSimulator}
      />

      {/* Inspectable Skill Detail Modal */}
      <SkillDetailModal
        skill={inspectedSkill}
        isOpen={!!inspectedSkill}
        onClose={() => setInspectedSkill(null)}
        targetRoleTitle={profile.targetRole}
        onSimulateSkill={(_name) => onNavigateToSimulator()}
      />

      {/* Resume Extraction & Automation Modal */}
      <ResumeExtractionModal
        isOpen={isResumeExtractOpen}
        onClose={() => setIsResumeExtractOpen(false)}
        currentProfile={profile}
        onConfirmProfile={(updated) => onUpdateProfile(updated)}
      />
    </div>
  );
};
