import React, { useState } from 'react';
import { UserProfile, UserSkill, AuthUser, UserProject, WorkExperience, UserEducation } from '../../types';
import { WelcomeStep } from './WelcomeStep';
import { ProfileStep } from './ProfileStep';
import { SkillsStep, OnboardingSkill } from './SkillsStep';
import { CareerGoalStep, GLOBAL_CAREER_ROLES } from './CareerGoalStep';
import { SkillGapStep } from './SkillGapStep';
import { BestFitPathsStep } from './BestFitPathsStep';
import { MatchedJobsStep } from './MatchedJobsStep';
import { PlanNextMoveStep } from './PlanNextMoveStep';
import { Sparkles, Globe2, LogIn, CheckCircle2 } from 'lucide-react';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  authUser: AuthUser | null;
  onComplete: (updatedProfile: UserProfile) => void;
  onOpenSignIn?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  authUser,
  onComplete,
  onOpenSignIn
}) => {
  // Step state: 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Profile data gathered through the journey
  const [name, setName] = useState<string>(
    initialProfile.name || authUser?.displayName || ''
  );
  const [country, setCountry] = useState<string>('India');
  const [preferredLocation, setPreferredLocation] = useState<string>(
    initialProfile.location || 'Bengaluru, India'
  );
  const [educationLevel, setEducationLevel] = useState<string>("Bachelor's Degree");
  const [degreeField, setDegreeField] = useState<string>(
    initialProfile.education[0]?.degree || 'Computer Science & Engineering'
  );
  const [schoolName, setSchoolName] = useState<string>(
    initialProfile.education[0]?.school || ''
  );
  const [currentYear, setCurrentYear] = useState<string>('Final Year Student');
  const [experienceLevel, setExperienceLevel] = useState<string>('Early Career (0–2 yrs)');
  const [workPreference, setWorkPreference] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');

  // Extracted documents / projects / experience
  const [extractedProjects, setExtractedProjects] = useState<UserProject[]>(
    initialProfile.projects || []
  );
  const [extractedExperience, setExtractedExperience] = useState<WorkExperience[]>(
    initialProfile.experience || []
  );
  const [extractedEducation, setExtractedEducation] = useState<UserEducation[]>(
    initialProfile.education || []
  );
  const [uploadedResumeName, setUploadedResumeName] = useState<string>(
    initialProfile.uploadedResumeName || ''
  );

  // Skills state
  const [skills, setSkills] = useState<OnboardingSkill[]>(() => {
    if (initialProfile.skills && initialProfile.skills.length > 0) {
      return initialProfile.skills.map((s) => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        level: s.proficiency >= 85 ? 'Advanced' : s.proficiency >= 65 ? 'Intermediate' : 'Beginner',
        confidence: s.confidence || 'High',
        type: s.type || 'demonstrated',
        evidence: (s.evidence || []).map(e => e.title),
        confirmed: true
      }));
    }
    return [
      {
        name: 'Python',
        category: 'Core AI/ML',
        proficiency: 80,
        level: 'Intermediate',
        confidence: 'High',
        type: 'demonstrated',
        evidence: ['Used for data modeling & scripting in coursework'],
        confirmed: true
      },
      {
        name: 'SQL',
        category: 'Data & Analytics',
        proficiency: 75,
        level: 'Intermediate',
        confidence: 'High',
        type: 'demonstrated',
        evidence: ['Database query optimization in course projects'],
        confirmed: true
      },
      {
        name: 'Machine Learning',
        category: 'Core AI/ML',
        proficiency: 70,
        level: 'Intermediate',
        confidence: 'Moderate',
        type: 'demonstrated',
        evidence: ['Implemented predictive classification algorithms'],
        confirmed: true
      }
    ];
  });

  // Target Career Goal
  const [targetRoleTitle, setTargetRoleTitle] = useState<string>(
    initialProfile.targetRole || 'Machine Learning Engineer'
  );

  const stepLabels = [
    'Welcome',
    'Tell Us About You',
    'Show Us What You Know',
    'Choose Where You Want to Go',
    'Discover What You Are Missing',
    'See Your Best-Fit Paths',
    'Find Jobs That Match',
    'Plan Your Next Move'
  ];

  // Callback when resume parser returns parsed structure
  const handleExtractedProfileData = (data: {
    projects: UserProject[];
    experience: WorkExperience[];
    education: UserEducation[];
    resumeFileName?: string;
  }) => {
    if (data.projects && data.projects.length > 0) {
      setExtractedProjects(data.projects);
    }
    if (data.experience && data.experience.length > 0) {
      setExtractedExperience(data.experience);
    }
    if (data.education && data.education.length > 0) {
      setExtractedEducation(data.education);
      if (data.education[0].school) setSchoolName(data.education[0].school);
      if (data.education[0].degree) setDegreeField(data.education[0].degree);
    }
    if (data.resumeFileName) {
      setUploadedResumeName(data.resumeFileName);
    }
  };

  // Final submission into existing profile system
  const handleFinalizeAndEnterDashboard = () => {
    const targetRoleObj = GLOBAL_CAREER_ROLES.find(
      (r) => r.title.toLowerCase() === targetRoleTitle.toLowerCase()
    ) || GLOBAL_CAREER_ROLES[0];

    const strongCount = targetRoleObj.requiredSkills.filter((req) =>
      skills.some((s) => s.name.toLowerCase() === req.toLowerCase() && (s.proficiency >= 70 || s.level === 'Advanced'))
    ).length;

    const developingCount = targetRoleObj.requiredSkills.filter((req) =>
      skills.some((s) => s.name.toLowerCase() === req.toLowerCase() && s.proficiency < 70 && s.level !== 'Advanced')
    ).length;

    const alignment = Math.min(
      96,
      Math.max(
        30,
        Math.round(((strongCount * 1.0 + developingCount * 0.5) / Math.max(1, targetRoleObj.requiredSkills.length)) * 100)
      )
    );

    const formattedSkills: UserSkill[] = skills.map((s, idx) => ({
      id: `sk_onb_${Date.now()}_${idx}`,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      confidence: s.confidence,
      type: s.type,
      yearsExp: s.level === 'Advanced' ? 3 : s.level === 'Intermediate' ? 2 : 1,
      marketDemand: s.proficiency >= 75 ? 'Surging' : 'High',
      lastPracticed: 'Recently',
      evidence: s.evidence && s.evidence.length > 0
        ? s.evidence.map((ev, i) => ({
            id: `ev_onb_${Date.now()}_${idx}_${i}`,
            type: 'Project',
            title: ev
          }))
        : []
    }));

    const finalLocation = preferredLocation || country || 'Bengaluru, India';

    const updatedProfile: UserProfile = {
      ...initialProfile,
      id: authUser?.uid || initialProfile.id || `usr_${Date.now()}`,
      name: name.trim() || 'Alex Morgan',
      email: authUser?.email || initialProfile.email || '',
      title: `${degreeField.trim() || 'Engineer'} · Targeting ${targetRoleTitle}`,
      location: finalLocation,
      targetRole: targetRoleTitle,
      targetRoleAlignment: alignment,
      alignmentTrend: 8,
      summary: `${name.trim() || 'Candidate'} is a driven technologist targeting ${targetRoleTitle} in ${finalLocation}. Verified strengths include ${skills.slice(0, 3).map((s) => s.name).join(', ')}.`,
      skills: formattedSkills,
      education: extractedEducation.length > 0 ? extractedEducation : [
        {
          id: `edu_onb_${Date.now()}`,
          degree: degreeField.trim(),
          school: schoolName.trim() || 'University Institute',
          year: currentYear.includes('202') ? currentYear : '2025',
          gpa: '3.8'
        }
      ],
      projects: extractedProjects.length > 0 ? extractedProjects : [
        {
          id: `proj_onb_${Date.now()}`,
          title: `${targetRoleTitle} Implementation Project`,
          description: `Built and deployed full-cycle pipeline utilizing ${skills.slice(0, 3).map((s) => s.name).join(', ')}.`,
          tech: skills.slice(0, 4).map((s) => s.name),
          verified: true
        }
      ],
      experience: extractedExperience.length > 0 ? extractedExperience : [
        {
          id: `exp_onb_${Date.now()}`,
          title: `${targetRoleTitle} Trainee / Apprentice`,
          company: 'Applied Innovation Lab',
          location: finalLocation,
          startDate: '2024',
          endDate: 'Present',
          bullets: [
            `Built workflows utilizing ${skills.slice(0, 2).map((s) => s.name).join(' and ')}`,
            'Collaborated with engineering team on technical specifications and testing'
          ],
          skillsUsed: skills.slice(0, 3).map((s) => s.name)
        }
      ],
      hasUploadedResume: Boolean(uploadedResumeName),
      uploadedResumeName: uploadedResumeName,
      onboardingCompleted: true
    };

    onComplete(updatedProfile);
  };

  return (
    <div className="min-h-screen ambient-bg flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation & Progress Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/20">
            P
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 tracking-tight block leading-none">
              Pravriddhi
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Global Career Intelligence
            </span>
          </div>
        </div>

        {/* Step Counter Indicator */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-800">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-[11px] text-slate-500 font-medium hidden md:block">
            {stepLabels[currentStep - 1]}
          </span>
        </div>

        {/* Auth / Account indicator */}
        <div className="flex items-center gap-2">
          {authUser ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[120px]">{authUser.email || authUser.displayName}</span>
            </div>
          ) : (
            onOpenSignIn && (
              <button
                type="button"
                onClick={onOpenSignIn}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>
            )
          )}
        </div>

      </header>

      {/* Progress Track */}
      <div className="w-full h-1 bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Interactive Screen Content */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
        
        {currentStep === 1 && (
          <WelcomeStep
            onNext={() => setCurrentStep(2)}
            authUser={authUser}
          />
        )}

        {/* Step 2: Tell Us About You */}
        {currentStep === 2 && (
          <ProfileStep
            name={name}
            setName={setName}
            country={country}
            setCountry={setCountry}
            educationLevel={educationLevel}
            setEducationLevel={setEducationLevel}
            degreeField={degreeField}
            setDegreeField={setDegreeField}
            schoolName={schoolName}
            setSchoolName={setSchoolName}
            currentYear={currentYear}
            setCurrentYear={setCurrentYear}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            preferredLocation={preferredLocation}
            setPreferredLocation={setPreferredLocation}
            workPreference={workPreference}
            setWorkPreference={setWorkPreference}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3: Show Us What You Know */}
        {currentStep === 3 && (
          <SkillsStep
            userName={name}
            skills={skills}
            setSkills={setSkills}
            onExtractedProfileData={handleExtractedProfileData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Choose Where You Want to Go */}
        {currentStep === 4 && (
          <CareerGoalStep
            selectedRoleTitle={targetRoleTitle}
            setSelectedRoleTitle={setTargetRoleTitle}
            userSkills={skills}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {/* Step 5: Discover What You're Missing */}
        {currentStep === 5 && (
          <SkillGapStep
            skills={skills}
            targetRoleTitle={targetRoleTitle}
            onNext={() => setCurrentStep(6)}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {/* Step 6: See Your Best-Fit Paths */}
        {currentStep === 6 && (
          <BestFitPathsStep
            skills={skills}
            selectedRoleTitle={targetRoleTitle}
            onSelectRole={(newRole) => setTargetRoleTitle(newRole)}
            onNext={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {/* Step 7: Find Jobs That Match */}
        {currentStep === 7 && (
          <MatchedJobsStep
            country={country}
            preferredLocation={preferredLocation}
            workPreference={workPreference}
            targetRoleTitle={targetRoleTitle}
            skills={skills}
            onNext={() => setCurrentStep(8)}
            onBack={() => setCurrentStep(6)}
          />
        )}

        {/* Step 8: Plan Your Next Move */}
        {currentStep === 8 && (
          <PlanNextMoveStep
            name={name}
            country={country}
            preferredLocation={preferredLocation}
            degreeField={degreeField}
            targetRoleTitle={targetRoleTitle}
            workPreference={workPreference}
            skills={skills}
            onFinalize={handleFinalizeAndEnterDashboard}
            onBack={() => setCurrentStep(7)}
          />
        )}

      </main>

    </div>
  );
};
