import React, { useState, useEffect } from 'react';
import { UserProfile, JobOpportunity } from '../../types';
import {
  ResumeVersion,
  BulletImprovement,
  TargetJobAnalysis,
  ATSBreakdown,
  UserResumeRecord
} from '../../types/resume';
import {
  calculateATSAnalysis,
  analyzeTargetJobDescription,
  generateBulletImprovements
} from '../../services/resumeParserService';
import { resumeStorageService } from '../../services/resumeStorageService';
import { ResumeUploadZone } from './ResumeUploadZone';
import { TargetJobSelector } from './TargetJobSelector';
import { ATSScoreCard } from './ATSScoreCard';
import { ResumeContentEditor } from './ResumeContentEditor';
import { ResumePreviewPane } from './ResumePreviewPane';
import { ResumeVersionManager } from './ResumeVersionManager';
import { BulletImprovementModal } from './BulletImprovementModal';
import {
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react';

interface ResumeStudioViewProps {
  profile: UserProfile;
  jobs: JobOpportunity[];
  selectedTargetJob?: JobOpportunity | null;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ResumeStudioView: React.FC<ResumeStudioViewProps> = ({
  profile,
  jobs,
  selectedTargetJob,
  onUpdateProfile
}) => {
  // 1. Initial Target Job Analysis
  const initialJob = selectedTargetJob || jobs[0];
  const [targetAnalysis, setTargetAnalysis] = useState<TargetJobAnalysis>(() =>
    analyzeTargetJobDescription(initialJob)
  );

  // Helper to construct versions strictly from profile or active resume record
  const getInitialVersions = (): ResumeVersion[] => {
    const activeRecord = resumeStorageService.getActiveResumeRecord(profile.id);
    if (activeRecord && activeRecord.versions && activeRecord.versions.length > 0) {
      return activeRecord.versions;
    }

    if (profile.hasUploadedResume) {
      const masterVersion: ResumeVersion = {
        id: `version_master_${Date.now()}`,
        title: profile.uploadedResumeName || 'Uploaded Resume',
        targetRole: profile.targetRole || 'Professional',
        lastUpdated: 'Recently',
        isOriginalUpload: true,
        isAiOptimized: false,
        contact: {
          fullName: profile.name,
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location || '',
          linkedin: profile.linkedin || '',
          github: profile.github || '',
          portfolio: profile.portfolio || ''
        },
        summary: profile.summary || '',
        skills: [...profile.skills],
        experience: profile.experience.map((e) => ({
          ...e,
          role: e.title,
          period: `${e.startDate} - ${e.endDate}`,
          bullets: [...e.bullets]
        })),
        projects: profile.projects.map((p) => ({
          ...p,
          name: p.title
        })),
        education: profile.education.map((ed) => ({ ...ed })),
        certifications: profile.certifications.map((c) => ({ ...c })),
        achievements: [],
        leadership: [],
        links: [
          ...(profile.github ? [{ id: 'l1', label: 'GitHub', url: profile.github }] : []),
          ...(profile.linkedin ? [{ id: 'l2', label: 'LinkedIn', url: profile.linkedin }] : [])
        ],
        sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements']
      };
      return [masterVersion];
    }

    return [];
  };

  const [versions, setVersions] = useState<ResumeVersion[]>(getInitialVersions);
  const [activeVersionId, setActiveVersionId] = useState<string>(() => {
    const v = getInitialVersions();
    return v.length > 0 ? v[0].id : '';
  });

  // Keep versions in sync if profile changes
  useEffect(() => {
    const newV = getInitialVersions();
    if (newV.length > 0 && (!versions.length || !versions.some(v => v.contact.fullName === profile.name))) {
      setVersions(newV);
      setActiveVersionId(newV[0].id);
      setHistory([newV[0]]);
      setHistoryIndex(0);
    }
  }, [profile.hasUploadedResume, profile.name, profile.skills.length]);

  // Find active version
  const activeVersion =
    versions.find((v) => v.id === activeVersionId) ||
    versions[0] || {
      id: 'version_empty',
      title: 'Empty Draft',
      targetRole: profile.targetRole || 'Professional',
      lastUpdated: 'Now',
      contact: {
        fullName: profile.name,
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || ''
      },
      summary: profile.summary || '',
      skills: profile.skills || [],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
      achievements: [],
      leadership: [],
      links: [],
      sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education']
    };

  // Undo / Redo History Stack
  const [history, setHistory] = useState<ResumeVersion[]>([activeVersion]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Bullet Improvement Modal State
  const [isImproveModalOpen, setIsImproveModalOpen] = useState(false);
  const [currentImprovements, setCurrentImprovements] = useState<BulletImprovement[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync selectedTargetJob prop if it changes externally
  useEffect(() => {
    if (selectedTargetJob) {
      setTargetAnalysis(analyzeTargetJobDescription(selectedTargetJob));
    }
  }, [selectedTargetJob]);

  // Recalculate transparent ATS Analysis whenever active version or target analysis changes
  const atsBreakdown: ATSBreakdown = calculateATSAnalysis(activeVersion, targetAnalysis);

  // Handle active version update with history push & autosave
  const handleVersionChange = (updated: ResumeVersion) => {
    const newVersions = versions.map((v) => (v.id === updated.id ? updated : v));
    setVersions(newVersions);

    // Push to undo stack
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Autosave to storage
    const activeRecord = resumeStorageService.getActiveResumeRecord(profile.id);
    if (activeRecord) {
      resumeStorageService.updateResumeVersionInRecord(profile.id, activeRecord.id, updated);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setVersions((prevV) => prevV.map((v) => (v.id === prev.id ? prev : v)));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setVersions((prevV) => prevV.map((v) => (v.id === next.id ? next : v)));
    }
  };

  // Version Management Handlers
  const handleSelectVersion = (versionId: string) => {
    setActiveVersionId(versionId);
    const targetV = versions.find((v) => v.id === versionId);
    if (targetV) {
      setHistory([targetV]);
      setHistoryIndex(0);
    }
  };

  const handleDuplicateVersion = (versionId: string) => {
    const source = versions.find((v) => v.id === versionId);
    if (!source) return;

    const duplicated: ResumeVersion = {
      ...source,
      id: `version_${Date.now()}`,
      title: `${source.title} (Copy)`,
      lastUpdated: 'Just Now',
      isOriginalUpload: false
    };

    const newVersions = [...versions, duplicated];
    setVersions(newVersions);
    setActiveVersionId(duplicated.id);
    setHistory([duplicated]);
    setHistoryIndex(0);

    const activeRecord = resumeStorageService.getActiveResumeRecord(profile.id);
    if (activeRecord) {
      resumeStorageService.saveResumeRecord({
        ...activeRecord,
        versions: newVersions,
        activeVersionId: duplicated.id
      });
    }

    showToast(`Duplicated "${source.title}" as new resume version.`);
  };

  const handleRenameVersion = (versionId: string, newTitle: string) => {
    const updated = versions.map((v) => (v.id === versionId ? { ...v, title: newTitle } : v));
    setVersions(updated);

    const activeRecord = resumeStorageService.getActiveResumeRecord(profile.id);
    if (activeRecord) {
      resumeStorageService.saveResumeRecord({
        ...activeRecord,
        versions: updated
      });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (versions.length <= 1) return;
    const remaining = versions.filter((v) => v.id !== versionId);
    setVersions(remaining);
    setActiveVersionId(remaining[0].id);
    setHistory([remaining[0]]);
    setHistoryIndex(0);

    const activeRecord = resumeStorageService.getActiveResumeRecord(profile.id);
    if (activeRecord) {
      resumeStorageService.saveResumeRecord({
        ...activeRecord,
        versions: remaining,
        activeVersionId: remaining[0].id
      });
    }

    showToast('Resume version deleted.');
  };

  const handleCreateNewVersion = () => {
    const newV: ResumeVersion = {
      ...activeVersion,
      id: `version_${Date.now()}`,
      title: `Custom ${activeVersion.targetRole} Resume`,
      lastUpdated: 'Just Now',
      isOriginalUpload: false,
      isAiOptimized: false
    };
    const newVersions = [...versions, newV];
    setVersions(newVersions);
    setActiveVersionId(newV.id);
    setHistory([newV]);
    setHistoryIndex(0);

    const activeRecord = resumeStorageService.getActiveResumeRecord(profile.id);
    if (activeRecord) {
      resumeStorageService.saveResumeRecord({
        ...activeRecord,
        versions: newVersions,
        activeVersionId: newV.id
      });
    }

    showToast('Created new resume draft version.');
  };

  // Resume Upload Handler (Automated parsing -> CareerTwin update)
  const handleUploadSuccess = (
    parsedVersion: ResumeVersion,
    _rawText: string,
    newProfile?: UserProfile,
    record?: UserResumeRecord
  ) => {
    if (record) {
      setVersions(record.versions);
      setActiveVersionId(record.activeVersionId);
      setHistory([parsedVersion]);
      setHistoryIndex(0);
    } else {
      const newVersions = [parsedVersion, ...versions];
      setVersions(newVersions);
      setActiveVersionId(parsedVersion.id);
      setHistory([parsedVersion]);
      setHistoryIndex(0);
    }

    if (newProfile) {
      onUpdateProfile(newProfile);
    } else {
      // Sync extracted skills & summary into user's CareerTwin profile
      onUpdateProfile({
        ...profile,
        name: parsedVersion.contact.fullName || profile.name || 'Candidate',
        email: parsedVersion.contact.email || profile.email || '',
        phone: parsedVersion.contact.phone || profile.phone || '',
        location: parsedVersion.contact.location || profile.location || '',
        summary: parsedVersion.summary,
        skills: [...parsedVersion.skills],
        experience: parsedVersion.experience.map((e) => ({
          id: e.id,
          title: e.title,
          company: e.company,
          startDate: e.startDate || '',
          endDate: e.endDate || 'Present',
          location: e.location || '',
          bullets: [...e.bullets],
          skillsUsed: e.skillsUsed || []
        })),
        hasUploadedResume: true,
        uploadedResumeName: parsedVersion.title
      });
    }

    showToast('Your resume has been imported successfully.');
  };

  // Open AI Bullet Improvement Modal
  const handleOpenImproveModal = () => {
    const suggestions = generateBulletImprovements(activeVersion.experience, activeVersion.targetRole);
    setCurrentImprovements(suggestions);
    setIsImproveModalOpen(true);
  };

  // Apply accepted bullet improvements
  const handleApplyImprovements = (applied: BulletImprovement[]) => {
    const updatedExp = activeVersion.experience.map((exp) => {
      const matchForThisExp = applied.filter((a) => a.experienceId === exp.id);
      if (matchForThisExp.length === 0) return exp;

      const newBullets = [...exp.bullets];
      matchForThisExp.forEach((item) => {
        if (item.bulletIndex < newBullets.length) {
          newBullets[item.bulletIndex] = item.improved;
        }
      });

      return {
        ...exp,
        bullets: newBullets
      };
    });

    const updatedVersion: ResumeVersion = {
      ...activeVersion,
      experience: updatedExp,
      lastUpdated: 'Just Now'
    };

    handleVersionChange(updatedVersion);
    setIsImproveModalOpen(false);
    showToast(`Applied ${applied.length} STAR bullet improvements!`);
  };

  // Save manual modifications back into profile
  const handleSaveAndSyncCareerTwin = () => {
    onUpdateProfile({
      ...profile,
      name: activeVersion.contact.fullName || profile.name,
      email: activeVersion.contact.email || profile.email,
      phone: activeVersion.contact.phone || profile.phone,
      location: activeVersion.contact.location || profile.location,
      summary: activeVersion.summary,
      skills: [...activeVersion.skills],
      experience: activeVersion.experience.map((e) => ({
        id: e.id,
        title: e.title,
        company: e.company,
        startDate: e.startDate || '',
        endDate: e.endDate || 'Present',
        location: e.location || '',
        bullets: [...e.bullets],
        skillsUsed: e.skillsUsed || []
      }))
    });
    showToast('Resume version saved and synchronized to your CareerTwin!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Non-fabrication Truthful Policy Banner */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>AI RESUME TRUTH POLICY:</strong> Pravriddhi re-frames verified evidence using the STAR methodology. We never fabricate unearned roles, fake dates, or hallucinated claims.
          </span>
        </div>
        <span className="font-mono text-[10px] text-indigo-700 uppercase font-bold shrink-0">
          Verifiable Evidence Grounded
        </span>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>AI Resume Intelligence & Optimization Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Resume Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real Document Parsing &rarr; CareerTwin Evidence &rarr; Target Job Alignment &rarr; Transparent ATS Analysis.
          </p>
        </div>

        {profile.hasUploadedResume && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSaveAndSyncCareerTwin}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-200" />
              <span>Sync to CareerTwin</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. Resume Upload Zone (PDF, DOCX, TXT) */}
      <ResumeUploadZone
        userId={profile.id}
        onUploadSuccess={handleUploadSuccess}
        currentResumeName={profile.uploadedResumeName || activeVersion.title}
        lastUpdated={activeVersion.lastUpdated}
        hasUploadedResume={profile.hasUploadedResume}
      />

      {/* If No Resume Uploaded Yet, Display Prominent Call to Action */}
      {!profile.hasUploadedResume ? (
        <div className="bg-white rounded-3xl border border-dashed border-indigo-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Upload your resume to build your CareerTwin
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pravriddhi requires your actual resume (PDF, DOCX, or TXT) to establish your single source of truth. We extract only your verifiable skills, projects, and career history without mock data.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Resume Version Control */}
          <ResumeVersionManager
            versions={versions}
            activeVersionId={activeVersionId}
            onSelectVersion={handleSelectVersion}
            onDuplicateVersion={handleDuplicateVersion}
            onRenameVersion={handleRenameVersion}
            onDeleteVersion={handleDeleteVersion}
            onCreateNewVersion={handleCreateNewVersion}
          />

          {/* 3. Target Job Description Selector */}
          <TargetJobSelector
            jobs={jobs}
            currentAnalysis={targetAnalysis}
            onSelectTargetJob={(newTarget) => setTargetAnalysis(newTarget)}
          />

          {/* 4. Real ATS Score Card with Breakdown */}
          <ATSScoreCard breakdown={atsBreakdown} />

          {/* 5. Two-Column Workspace: Structured Content Editor (Left) & Live ATS Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Structured Content Editor (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <ResumeContentEditor
                version={activeVersion}
                onChange={handleVersionChange}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onOpenImproveModal={handleOpenImproveModal}
              />
            </div>

            {/* Right Column: Live ATS-Formatted Preview (7 Cols) */}
            <div className="lg:col-span-7">
              <ResumePreviewPane
                version={activeVersion}
                targetRole={targetAnalysis.role}
                matchedKeywords={atsBreakdown.matchedKeywords}
              />
            </div>
          </div>

          {/* 6. AI Bullet Point Improvement Modal */}
          <BulletImprovementModal
            isOpen={isImproveModalOpen}
            onClose={() => setIsImproveModalOpen(false)}
            improvements={currentImprovements}
            onApplyImprovements={handleApplyImprovements}
          />
        </>
      )}
    </div>
  );
};
