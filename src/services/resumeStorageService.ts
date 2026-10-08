import { UserProfile, ParsedResumeData, UserSkill, WorkExperience, UserProject, UserEducation, UserCertification } from '../types';
import { UserResumeRecord, ResumeVersion } from '../types/resume';
import { firebaseService } from './firebaseService';

const STORAGE_PREFIX_RESUMES = 'pravriddhi_resumes_';
const LEGACY_STORAGE_PREFIX_RESUMES = 'skilltwin_resumes_';
const STORAGE_PREFIX_ACTIVE = 'pravriddhi_active_resume_';
const LEGACY_STORAGE_PREFIX_ACTIVE = 'skilltwin_active_resume_';

class ResumeStorageService {
  /**
   * Get all resumes belonging to a specific authenticated user
   */
  public getUserResumes(userId: string): UserResumeRecord[] {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX_RESUMES}${userId}`) || 
                   localStorage.getItem(`${LEGACY_STORAGE_PREFIX_RESUMES}${userId}`);
      if (!data) return [];
      return JSON.parse(data) as UserResumeRecord[];
    } catch (e) {
      console.warn('Error reading resumes from localStorage:', e);
      return [];
    }
  }

  /**
   * Get the active resume record for a user
   */
  public getActiveResumeRecord(userId: string): UserResumeRecord | null {
    if (!userId) return null;
    const resumes = this.getUserResumes(userId);
    if (resumes.length === 0) return null;

    const activeId = localStorage.getItem(`${STORAGE_PREFIX_ACTIVE}${userId}`) ||
                     localStorage.getItem(`${LEGACY_STORAGE_PREFIX_ACTIVE}${userId}`);
    if (activeId) {
      const found = resumes.find((r) => r.id === activeId);
      if (found) return found;
    }

    return resumes[0];
  }

  /**
   * Set active resume ID for a user
   */
  public setActiveResumeId(userId: string, resumeId: string): void {
    if (!userId) return;
    localStorage.setItem(`${STORAGE_PREFIX_ACTIVE}${userId}`, resumeId);
  }

  /**
   * Save or update a resume record in storage
   */
  public saveResumeRecord(record: UserResumeRecord): void {
    if (!record.userId) return;
    const current = this.getUserResumes(record.userId);
    const index = current.findIndex((r) => r.id === record.id);
    let updated: UserResumeRecord[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = record;
    } else {
      // Put latest upload at top
      updated = [record, ...current];
    }

    try {
      localStorage.setItem(`${STORAGE_PREFIX_RESUMES}${record.userId}`, JSON.stringify(updated));
      localStorage.setItem(`${STORAGE_PREFIX_ACTIVE}${record.userId}`, record.id);
    } catch (e) {
      console.error('Failed to save resume record to localStorage:', e);
    }

    // Optional firestore sync
    try {
      firebaseService.saveUserProfile({
        id: record.userId,
        hasUploadedResume: true,
        uploadedResumeName: record.fileName,
        activeResumeId: record.id
      } as any);
    } catch {}
  }

  /**
   * Create a new UserResumeRecord from parsed data and original document content
   */
  public createResumeRecordFromExtraction(
    userId: string,
    fileName: string,
    fileType: 'pdf' | 'docx' | 'txt',
    rawText: string,
    parsed: ParsedResumeData
  ): UserResumeRecord {
    const resumeId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    // Convert parsed skills into UserSkills with full integrity
    const userSkills: UserSkill[] = (parsed.skills || []).map((s, idx) => ({
      id: `sk_ext_${idx}_${Date.now()}`,
      name: s.name,
      category: s.category || 'Core AI/ML',
      proficiency: s.proficiency || (s.type === 'demonstrated' ? 82 : 68),
      confidence: s.confidence || (s.type === 'demonstrated' ? 'High' : 'Moderate'),
      type: s.type || 'demonstrated',
      yearsExp: 2,
      marketDemand: 'High',
      lastPracticed: 'Recently',
      evidence: s.evidenceTitle
        ? [
            {
              id: `ev_${idx}_${Date.now()}`,
              type: s.type === 'demonstrated' ? 'Project' : 'Resume',
              title: s.evidenceTitle
            }
          ]
        : [
            {
              id: `ev_${idx}_${Date.now()}`,
              type: 'Resume',
              title: `Directly extracted from ${fileName}`
            }
          ]
    }));

    // Master version strictly adhering to uploaded document
    const masterVersion: ResumeVersion = {
      id: `ver_master_${Date.now()}`,
      title: 'Original Uploaded Resume',
      targetRole: parsed.suggestedTargetRole || 'Professional',
      lastUpdated: 'Just now',
      isOriginalUpload: true,
      isAiOptimized: false,
      contact: {
        fullName: parsed.personalInfo?.name || '',
        email: parsed.personalInfo?.email || '',
        phone: parsed.personalInfo?.phone || '',
        location: parsed.personalInfo?.location || '',
        linkedin: parsed.personalInfo?.linkedin || '',
        github: parsed.personalInfo?.github || '',
        portfolio: parsed.personalInfo?.portfolio || ''
      },
      summary: parsed.summary || '',
      skills: userSkills,
      experience: (parsed.experience || []).map((exp, idx) => ({
        id: `exp_rec_${idx}_${Date.now()}`,
        role: exp.title,
        title: exp.title,
        company: exp.company,
        period: `${exp.startDate || ''} - ${exp.endDate || ''}`.trim(),
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        location: exp.location || '',
        bullets: exp.bullets && exp.bullets.length > 0 ? exp.bullets : (exp.responsibilities || []),
        skillsUsed: exp.technologies || []
      })),
      projects: (parsed.projects || []).map((p, idx) => ({
        id: `proj_rec_${idx}_${Date.now()}`,
        title: p.title,
        name: p.title,
        description: p.description,
        tech: p.tech || [],
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        verified: true,
        highlights: p.results ? [p.results] : []
      })),
      education: (parsed.education || []).map((ed, idx) => ({
        id: `edu_rec_${idx}_${Date.now()}`,
        degree: ed.degree,
        school: ed.school,
        year: ed.year,
        gpa: ed.gpa
      })),
      certifications: (parsed.certifications || []).map((c, idx) => ({
        id: `cert_rec_${idx}_${Date.now()}`,
        name: c.name,
        issuer: c.issuer,
        year: c.year,
        verified: c.verified
      })),
      achievements: (parsed.achievements || []).map((a, idx) => ({
        id: `ach_rec_${idx}_${Date.now()}`,
        title: a.title,
        description: a.description,
        year: a.year
      })),
      leadership: [],
      links: [
        ...(parsed.personalInfo?.github
          ? [{ id: `link_gh_${Date.now()}`, label: 'GitHub', url: parsed.personalInfo.github }]
          : []),
        ...(parsed.personalInfo?.linkedin
          ? [{ id: `link_li_${Date.now()}`, label: 'LinkedIn', url: parsed.personalInfo.linkedin }]
          : [])
      ],
      sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements']
    };

    const record: UserResumeRecord = {
      id: resumeId,
      userId,
      fileName,
      fileType,
      uploadedAt: nowIso,
      rawText,
      status: 'confirmed',
      source: 'USER UPLOAD',
      structuredData: parsed,
      activeVersionId: masterVersion.id,
      versions: [masterVersion],
      debugInfo: {
        extractionTimestamp: nowIso,
        extractedSkillsCount: userSkills.length,
        extractedExperienceCount: (parsed.experience || []).length
      }
    };

    this.saveResumeRecord(record);
    return record;
  }

  /**
   * Convert an active resume record into a UserProfile for CareerTwin
   */
  public buildProfileFromResume(record: UserResumeRecord, currentProfile?: UserProfile): UserProfile {
    const activeVersion =
      record.versions.find((v) => v.id === record.activeVersionId) || record.versions[0];
    const parsed = record.structuredData;

    const baseName =
      activeVersion.contact.fullName ||
      parsed?.personalInfo?.name ||
      currentProfile?.name ||
      'Candidate';

    const baseRole =
      activeVersion.targetRole ||
      parsed?.suggestedTargetRole ||
      currentProfile?.targetRole ||
      'Technical Specialist';

    return {
      id: record.userId,
      name: baseName,
      title: `${baseRole}`,
      email: activeVersion.contact.email || parsed?.personalInfo?.email || '',
      phone: activeVersion.contact.phone || parsed?.personalInfo?.phone || '',
      location: activeVersion.contact.location || parsed?.personalInfo?.location || '',
      linkedin: activeVersion.contact.linkedin || parsed?.personalInfo?.linkedin || '',
      github: activeVersion.contact.github || parsed?.personalInfo?.github || '',
      portfolio: activeVersion.contact.portfolio || parsed?.personalInfo?.portfolio || '',
      targetRole: baseRole,
      targetRoleAlignment: 75,
      alignmentTrend: 4,
      summary: activeVersion.summary || parsed?.summary || '',
      skills: activeVersion.skills,
      experience: activeVersion.experience.map((e) => ({
        id: e.id,
        title: e.title,
        company: e.company,
        location: e.location || '',
        startDate: e.startDate || '',
        endDate: e.endDate || 'Present',
        bullets: [...e.bullets],
        skillsUsed: e.skillsUsed || []
      })),
      projects: activeVersion.projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tech: p.tech || [],
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        verified: true
      })),
      education: activeVersion.education.map((ed) => ({
        id: ed.id,
        degree: ed.degree,
        school: ed.school,
        year: ed.year,
        gpa: ed.gpa
      })),
      certifications: activeVersion.certifications.map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        year: c.year,
        credentialId: c.credentialId,
        verified: c.verified
      })),
      hasUploadedResume: true,
      uploadedResumeName: record.fileName,
      activeResumeId: record.id,
      resumeSource: 'USER UPLOAD',
      isDemoMode: false
    };
  }

  public createProfileFromResumeRecord(record: UserResumeRecord, currentProfile?: UserProfile): UserProfile {
    return this.buildProfileFromResume(record, currentProfile);
  }

  /**
   * Update a specific resume version in storage
   */
  public updateResumeVersionInRecord(userId: string, resumeId: string, updatedVersion: ResumeVersion): void {
    const resumes = this.getUserResumes(userId);
    const resume = resumes.find((r) => r.id === resumeId);
    if (!resume) return;

    const vIdx = resume.versions.findIndex((v) => v.id === updatedVersion.id);
    if (vIdx >= 0) {
      resume.versions[vIdx] = updatedVersion;
    } else {
      resume.versions.push(updatedVersion);
    }
    resume.activeVersionId = updatedVersion.id;
    this.saveResumeRecord(resume);
  }

  /**
   * Delete a resume record
   */
  public deleteResumeRecord(userId: string, resumeId: string): void {
    const resumes = this.getUserResumes(userId).filter((r) => r.id !== resumeId);
    try {
      localStorage.setItem(`${STORAGE_PREFIX_RESUMES}${userId}`, JSON.stringify(resumes));
      if (resumes.length > 0) {
        localStorage.setItem(`${STORAGE_PREFIX_ACTIVE}${userId}`, resumes[0].id);
      } else {
        localStorage.removeItem(`${STORAGE_PREFIX_ACTIVE}${userId}`);
      }
    } catch {}
  }
}

export const resumeStorageService = new ResumeStorageService();
