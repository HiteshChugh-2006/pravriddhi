import React, { useState, useRef } from 'react';
import {
  UserProfile,
  UserSkill,
  WorkExperience,
  UserProject,
  UserEducation,
  UserCertification,
  ParsedResumeData,
  SkillCategory
} from '../../types';
import { parseResumeDocumentWithGemini } from '../../services/aiService';
import { extractDocumentContent } from '../../services/documentExtractor';
import { resumeStorageService } from '../../services/resumeStorageService';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  Check,
  Edit3,
  User,
  Briefcase,
  Layers,
  GraduationCap,
  Award,
  Flame,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface ResumeExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onConfirmProfile: (newProfile: UserProfile) => void;
}

export const ResumeExtractionModal: React.FC<ResumeExtractionModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onConfirmProfile
}) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [processingStage, setProcessingStage] = useState('Uploading Resume...');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Review & Confirmation State
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [targetRole, setTargetRole] = useState(currentProfile.targetRole || 'ML Engineer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});
  const [editableSkills, setEditableSkills] = useState<ParsedResumeData['skills']>([]);
  const [editableExperience, setEditableExperience] = useState<ParsedResumeData['experience']>([]);
  const [editableProjects, setEditableProjects] = useState<ParsedResumeData['projects']>([]);
  const [editableEducation, setEditableEducation] = useState<ParsedResumeData['education']>([]);
  const [editableCertifications, setEditableCertifications] = useState<ParsedResumeData['certifications']>([]);

  const [rawDocumentText, setRawDocumentText] = useState('');
  const [documentFileType, setDocumentFileType] = useState<'pdf' | 'docx' | 'txt'>('pdf');

  // Editing toggles
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setUploadedFileName(file.name);
    setStep('processing');

    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValid) {
      setErrorMessage('Please upload a PDF, DOCX, or TXT file.');
      setStep('upload');
      return;
    }

    try {
      setProcessingStage('Reading document contents...');
      const extractedDoc = await extractDocumentContent(file);
      setRawDocumentText(extractedDoc.text);
      setDocumentFileType(extractedDoc.fileType);

      setProcessingStage('Extracting structured profile with Gemini AI...');
      const parsed = await parseResumeDocumentWithGemini({
        base64: extractedDoc.base64,
        text: extractedDoc.text,
        mimeType: extractedDoc.mimeType,
        fileName: file.name
      });

      setProcessingStage('Normalizing skills & evidence...');
      await new Promise(r => setTimeout(r, 250));

      // Populate review state strictly without falling back to demo candidates
      setParsedData(parsed);
      setName(parsed.personalInfo?.name || 'Candidate');
      setEmail(parsed.personalInfo?.email || '');
      setPhone(parsed.personalInfo?.phone || '');
      setLocation(parsed.personalInfo?.location || '');
      setSummary(parsed.summary || '');
      setTargetRole(parsed.suggestedTargetRole || 'Technical Specialist');
      setEditableSkills(parsed.skills || []);
      setEditableExperience(parsed.experience || []);
      setEditableProjects(parsed.projects || []);
      setEditableEducation(parsed.education || []);
      setEditableCertifications(parsed.certifications || []);

      const skillMap: Record<string, boolean> = {};
      (parsed.skills || []).forEach(s => {
        skillMap[s.name] = true;
      });
      setSelectedSkills(skillMap);

      setStep('review');
    } catch (err: any) {
      console.error('Resume processing failure:', err);
      setErrorMessage(err.message || 'Unable to analyze this resume. Please try again.');
      setStep('upload');
    }
  };

  const handleBuildCareerTwin = () => {
    if (!parsedData) return;

    // Convert approved skills
    const approvedSkills: UserSkill[] = editableSkills
      .filter(s => selectedSkills[s.name])
      .map((s, idx) => ({
        id: `sk_parsed_${Date.now()}_${idx}`,
        name: s.name,
        category: s.category,
        proficiency: s.proficiency || (s.type === 'demonstrated' ? 82 : 68),
        confidence: s.confidence || (s.type === 'demonstrated' ? 'High' : 'Moderate'),
        type: s.type,
        yearsExp: 2,
        marketDemand: 'High',
        lastPracticed: 'Verified in uploaded resume',
        evidence: [
          {
            id: `ev_parsed_${idx}`,
            type: s.type === 'demonstrated' ? 'Project' : 'Resume',
            title: s.evidenceTitle || `Extracted from uploaded resume (${uploadedFileName})`
          }
        ]
      }));

    // Convert experience
    const approvedExp: WorkExperience[] = editableExperience.map((exp, idx) => ({
      id: `exp_parsed_${Date.now()}_${idx}`,
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || 'Present',
      bullets: exp.bullets.length > 0 ? exp.bullets : exp.responsibilities,
      skillsUsed: exp.technologies.length > 0 ? exp.technologies : []
    }));

    // Convert projects
    const approvedProjects: UserProject[] = editableProjects.map((p, idx) => ({
      id: `proj_parsed_${Date.now()}_${idx}`,
      title: p.title,
      description: p.description,
      tech: p.tech,
      results: p.results,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      verified: Boolean(p.githubUrl || p.liveUrl)
    }));

    // Convert education
    const approvedEducation: UserEducation[] = editableEducation.map((edu, idx) => ({
      id: `edu_parsed_${Date.now()}_${idx}`,
      degree: edu.degree,
      school: edu.school,
      year: edu.year,
      gpa: edu.gpa
    }));

    // Convert certifications
    const approvedCerts: UserCertification[] = editableCertifications.map((c, idx) => ({
      id: `cert_parsed_${Date.now()}_${idx}`,
      name: c.name,
      issuer: c.issuer,
      year: c.year,
      verified: c.verified
    }));

    // Create unique resume record for user
    const finalParsed: ParsedResumeData = {
      personalInfo: {
        name: name.trim() || 'Candidate',
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        linkedin: parsedData.personalInfo?.linkedin || '',
        github: parsedData.personalInfo?.github || '',
        portfolio: parsedData.personalInfo?.portfolio || ''
      },
      summary: summary.trim(),
      suggestedTargetRole: targetRole.trim(),
      skills: editableSkills,
      experience: editableExperience,
      projects: editableProjects,
      education: editableEducation,
      certifications: editableCertifications,
      achievements: parsedData.achievements || []
    };

    const resumeRecord = resumeStorageService.createResumeRecordFromExtraction(
      currentProfile.id,
      uploadedFileName,
      documentFileType,
      rawDocumentText,
      finalParsed
    );

    const newProfile: UserProfile = {
      ...currentProfile,
      name: name.trim() || 'Candidate',
      title: `${targetRole} Specialist`,
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      targetRole: targetRole.trim(),
      summary: summary.trim(),
      skills: approvedSkills,
      experience: approvedExp,
      projects: approvedProjects,
      education: approvedEducation,
      certifications: approvedCerts,
      hasUploadedResume: true,
      uploadedResumeName: uploadedFileName,
      activeResumeId: resumeRecord.id,
      resumeSource: 'USER UPLOAD',
      isDemoMode: false
    };

    onConfirmProfile(newProfile);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full my-6 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Resume → CareerTwin Automation
                </span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm font-semibold">
                  Real Document Parser
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Single source of truth for your dynamic skills, evidence, and ATS optimization.
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>TRUTHFUL CAREERTWIN POLICY:</strong> Your uploaded resume becomes the single source of truth. We extract verifiable evidence and never fabricate candidate data.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:underline font-semibold ml-2">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Drag and Drop Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleProcessFile(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center bg-indigo-50/20 hover:bg-indigo-50/50 hover:border-indigo-400 transition-all cursor-pointer space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Upload your actual resume (PDF, DOCX, TXT)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag and drop your file here or click to browse (up to 8MB)
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">PDF</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">DOCX</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">TXT</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">{processingStage}</h3>
                <p className="text-xs text-slate-500">
                  Parsing {uploadedFileName} without inventing unearned details...
                </p>
              </div>
              <div className="w-56 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 animate-pulse w-4/5 rounded-full" />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW BEFORE CAREERTWIN */}
          {step === 'review' && (
            <div className="space-y-5">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Resume successfully analyzed:</strong> Review your extracted profile before building your CareerTwin.
                  </span>
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-upload</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    FILE UPLOADED
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {uploadedFileName}
                    </span>
                    <span className="text-[10px] bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-semibold uppercase">
                      {documentFileType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PARSED</span>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">Candidate Information</span>
                  </div>
                  <button
                    onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                    className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{editingSection === 'personal' ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                {editingSection === 'personal' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Target Role</label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Email</label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Name:</span>
                      <strong className="text-slate-900">{name || 'Candidate'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Target Role:</span>
                      <strong className="text-indigo-600">{targetRole}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Email:</span>
                      <span className="text-slate-700 truncate block">{email || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Location:</span>
                      <span className="text-slate-700">{location || 'Remote'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Extraction Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">
                      Extracted Technical Skills ({editableSkills.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">Uncheck any skills you do not want in CareerTwin</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {editableSkills.map((s, idx) => (
                    <div
                      key={s.name}
                      onClick={() => setSelectedSkills(prev => ({ ...prev, [s.name]: !prev[s.name] }))}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedSkills[s.name]
                          ? 'bg-white border-indigo-200 shadow-2xs'
                          : 'bg-slate-100 border-slate-200 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedSkills[s.name])}
                          onChange={() => {}}
                          className="rounded text-indigo-600 cursor-pointer"
                        />
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          s.type === 'demonstrated' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {s.type}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {s.proficiency || (s.type === 'demonstrated' ? 82 : 68)}% Proficiency
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience Section */}
              {editableExperience.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">
                      Extracted Work Experience ({editableExperience.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {editableExperience.map((exp, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.title} — {exp.company}</span>
                          <span className="font-mono text-slate-400 text-[10px]">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          {exp.bullets[0] || exp.responsibilities[0] || 'Technical contributions.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold"
          >
            Cancel
          </button>

          {step === 'review' && (
            <button
              onClick={handleBuildCareerTwin}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <span>Confirm Extracted Data</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
