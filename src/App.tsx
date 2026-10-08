/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import {
  initialUserProfile,
  mockJobs,
  mockSkillTrends,
  mockCareerNodes
} from './data/mockData';
import { UserProfile, JobOpportunity, UserSkill, AuthUser } from './types';
import { authService } from './services/firebaseAuth';
import { Header } from './components/common/Header';
import { LandingView } from './components/landing/LandingView';
import { PravriddhiLandingPage } from './components/landing/PravriddhiLandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { CareerTwinView } from './components/careertwin/CareerTwinView';
import { JobRadarView } from './components/jobradar/JobRadarView';
import { JobIntelligenceModal } from './components/jobintelligence/JobIntelligenceModal';
import { SkillIntelligenceView } from './components/skillintelligence/SkillIntelligenceView';
import { CareerPathsView } from './components/careerpaths/CareerPathsView';
import { CareerRoadmapView } from './components/roadmap/CareerRoadmapView';
import { WhatIfSimulatorView } from './components/simulator/WhatIfSimulatorView';
import { ResumeStudioView } from './components/resumestudio/ResumeStudioView';
import { AIMentorView } from './components/mentor/AIMentorView';
import { WorkforceIntelligenceView } from './components/workforce/WorkforceIntelligenceView';
import { AuthModal } from './components/auth/AuthModal';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DebugResumePanel } from './components/common/DebugResumePanel';
import { resumeStorageService } from './services/resumeStorageService';

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(authService.getCurrentUser());
  const [profile, setProfile] = useState<UserProfile>(() => {
    const user = authService.getCurrentUser();
    if (user) {
      return authService.loadProfileFromDatabase(
        user.uid,
        authService.createEmptyProfileForUser(user)
      );
    }
    return initialUserProfile;
  });

  // Routing: unauthenticated → landing; new user → onboarding; returning → dashboard
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const user = authService.getCurrentUser();
    if (!user) return 'landing';
    const prof = authService.loadProfileFromDatabase(user.uid, authService.createEmptyProfileForUser(user));
    
    // Resume Route Handling
    const pathName = window.location.pathname.toLowerCase().replace(/^\/+/, '');
    const validTabs = ['dashboard', 'careertwin', 'jobradar', 'skills', 'careerpaths', 'roadmap', 'simulator', 'resumestudio', 'mentor', 'workforce'];
    let initialTab = 'dashboard';
    
    if (pathName === 'resume') initialTab = 'resumestudio';
    else if (validTabs.includes(pathName)) initialTab = pathName;
    
    return prof.onboardingCompleted ? initialTab : 'onboarding';
  });
  const prevUidRef = useRef<string | null>(authService.getCurrentUser()?.uid ?? null);
  const [jobs, setJobs] = useState<JobOpportunity[]>(mockJobs);
  const [trends, setTrends] = useState(mockSkillTrends);
  const [careerNodes, setCareerNodes] = useState(mockCareerNodes);

  // Authentication & Onboarding States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authModalInitialEmail, setAuthModalInitialEmail] = useState<string>('');
  const [resetAuthParams, setResetAuthParams] = useState<{
    mode: string | null;
    oobCode: string | null;
    apiKey: string | null;
  } | null>(null);

  // Modal & Cross-Tab Navigation States
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobOpportunity | null>(null);
  const [simulatorPreselectedSkill, setSimulatorPreselectedSkill] = useState<string | undefined>(undefined);
  const [resumeTargetJob, setResumeTargetJob] = useState<JobOpportunity | null>(null);
  const [workforceQuery, setWorkforceQuery] = useState<string>('What skills are becoming important for ML Engineers?');
  const [mentorInitialPrompt, setMentorInitialPrompt] = useState<string | undefined>(undefined);

  // Check URL parameters and pathname on mount for Firebase password reset or action handler
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get('oobCode') || urlParams.get('code');
      let mode = urlParams.get('mode');
      let apiKey = urlParams.get('apiKey');

      // Also check hash in case it's in hash params e.g. #mode=resetPassword&oobCode=...
      if (window.location.hash) {
        const hash = window.location.hash.startsWith('#')
          ? window.location.hash.substring(1)
          : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        if (!code) code = hashParams.get('oobCode') || hashParams.get('code');
        if (!mode) mode = hashParams.get('mode');
        if (!apiKey) apiKey = hashParams.get('apiKey');
      }

      const pathname = window.location.pathname.toLowerCase();
      const isActionPath = pathname === '/__/auth/action' || pathname === '/reset-password' || pathname === '/auth/action';

      // If user arrives via email action link or action path or has oobCode/mode
      if (isActionPath || code || mode) {
        setResetAuthParams({
          mode: mode || (isActionPath && !code ? null : 'resetPassword'),
          oobCode: code,
          apiKey: apiKey
        });
      }
    } catch (e) {
      console.warn('Could not parse auth parameters from URL:', e);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      const prevUid = prevUidRef.current;
      prevUidRef.current = user?.uid ?? null;
      
      setAuthUser(user);
      if (user) {
        const loaded = authService.loadProfileFromDatabase(
          user.uid,
          authService.createEmptyProfileForUser(user)
        );
        setProfile(loaded);
        // Only auto-route on login (uid changed from null or different uid)
        if (prevUid !== user.uid) {
          if (loaded.onboardingCompleted) {
            setCurrentTab('dashboard');
          } else {
            setCurrentTab('onboarding');
          }
        }
      } else {
        setProfile(initialUserProfile);
        setCurrentTab('landing');
      }
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setProfile(initialUserProfile);
    setCurrentTab('landing');
  };

  // Sync profile updates to persistence database
  const updateProfileAndPersist = (updated: UserProfile) => {
    setProfile(updated);
    authService.saveProfileToDatabase(updated);
  };

  // Toggle Save / Bookmark on job
  const handleToggleSaveJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, saved: !job.saved } : job))
    );
  };

  // Add custom analyzed job
  const handleAddCustomJob = (newJob: JobOpportunity) => {
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJobForModal(newJob);
  };

  // Set target role from Career Paths
  const handleSetTargetRole = (roleTitle: string, alignment: number) => {
    updateProfileAndPersist({
      ...profile,
      targetRole: roleTitle,
      targetRoleAlignment: alignment
    });
  };

  // Smart Navigation Handler with optional query payload
  const handleNavigateTab = (tab: string, payload?: string) => {
    if (tab === 'workforce' && payload) {
      setWorkforceQuery(payload);
    }
    if (tab === 'mentor' && payload) {
      setMentorInitialPrompt(payload);
    }
    setCurrentTab(tab);
  };

  // Navigate to Simulator from anywhere with pre-selected skill
  const handleNavigateToSimulatorWithSkill = (skillName?: string) => {
    setSimulatorPreselectedSkill(skillName);
    setSelectedJobForModal(null);
    setCurrentTab('simulator');
  };

  // Commit simulation skills to Twin
  const handleCommitSimulationToTwin = (skillsToAdd: string[]) => {
    const updatedSkills: UserSkill[] = [...profile.skills];

    skillsToAdd.forEach((skillName) => {
      const existing = updatedSkills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );
      if (existing) {
        existing.type = 'demonstrated';
        existing.proficiency = Math.min(95, existing.proficiency + 25);
        existing.confidence = 'High';
      } else {
        updatedSkills.push({
          id: `sk_sim_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: skillName,
          category: 'Software & Infrastructure',
          proficiency: 78,
          confidence: 'High',
          type: 'demonstrated',
          yearsExp: 1,
          marketDemand: 'Surging',
          lastPracticed: 'Today',
          evidence: [
            {
              id: `ev_sim_${Date.now()}`,
              type: 'Project',
              title: `Simulated production pipeline implementation for ${skillName}`
            }
          ]
        });
      }
    });

    updateProfileAndPersist({
      ...profile,
      targetRoleAlignment: Math.min(95, profile.targetRoleAlignment + 14),
      alignmentTrend: profile.alignmentTrend + 4,
      skills: updatedSkills
    });

    setCurrentTab('careertwin');
  };

  // Tailor Resume for a job from Job Intelligence
  const handleTailorResumeForJob = (job: JobOpportunity) => {
    setResumeTargetJob(job);
    setSelectedJobForModal(null);
    setCurrentTab('resumestudio');
  };

  // Show new landing page for unauthenticated / landing state
  if (currentTab === 'landing') {
    return (
      <PravriddhiLandingPage
        onGetStarted={() => setCurrentTab('onboarding')}
        onAuthSuccess={(user) => {
          setAuthUser(user);
        }}
        onStartOnboarding={() => setCurrentTab('onboarding')}
        onCheckUserStatus={(user) => {
          const prof = authService.loadProfileFromDatabase(user.uid, authService.createEmptyProfileForUser(user));
          return prof.onboardingCompleted ? 'dashboard' : 'onboarding';
        }}
      />
    );
  }

  // Dedicated Immersive Onboarding View: Completely isolated from Dashboard
  if (currentTab === 'onboarding') {
    return (
      <div className="min-h-screen ambient-bg flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <OnboardingFlow
          initialProfile={profile}
          authUser={authUser}
          onOpenSignIn={() => {
            setAuthModalInitialMode('signin');
            setIsAuthModalOpen(true);
          }}
          onComplete={(updated) => {
            updateProfileAndPersist(updated);
            setCurrentTab('dashboard');
          }}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalInitialMode}
          initialEmail={authModalInitialEmail}
          onClose={() => {
            setIsAuthModalOpen(false);
            setAuthModalInitialMode('signin');
          }}
          onSuccess={(user) => {
            setAuthUser(user);
          }}
          onEnterResetCode={() => {
            setResetAuthParams({
              mode: 'resetPassword',
              oobCode: '',
              apiKey: null
            });
          }}
        />

        {/* Password Reset Modal / View */}
        {resetAuthParams && (
          <ResetPasswordView
            mode={resetAuthParams.mode}
            oobCode={resetAuthParams.oobCode}
            apiKey={resetAuthParams.apiKey}
            onSuccess={() => {
              setResetAuthParams(null);
              if (typeof window !== 'undefined' && window.history.replaceState) {
                window.history.replaceState({}, document.title, '/');
              }
              setAuthModalInitialMode('signin');
              setIsAuthModalOpen(true);
            }}
            onCancel={() => {
              setResetAuthParams(null);
              if (typeof window !== 'undefined' && window.history.replaceState) {
                window.history.replaceState({}, document.title, '/');
              }
            }}
            onRequestNewLink={() => {
              setResetAuthParams(null);
              if (typeof window !== 'undefined' && window.history.replaceState) {
                window.history.replaceState({}, document.title, '/');
              }
              setAuthModalInitialMode('forgot');
              setIsAuthModalOpen(true);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen ambient-bg flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleNavigateTab}
        profile={profile}
        authUser={authUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOnboarding={() => setCurrentTab('onboarding')}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'landing' && (
          <LandingView
            profile={profile}
            onLaunchTwin={() => setCurrentTab('careertwin')}
            onExploreRadar={() => setCurrentTab('jobradar')}
            onTrySimulator={() => setCurrentTab('simulator')}
            onGetStarted={() => setCurrentTab('onboarding')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            jobs={jobs}
            trends={trends}
            onSelectJob={(job) => setSelectedJobForModal(job)}
            onNavigateTab={handleNavigateTab}
            onSimulateSkill={handleNavigateToSimulatorWithSkill}
            onUpdateProfile={updateProfileAndPersist}
            onOpenOnboarding={() => setCurrentTab('onboarding')}
          />
        )}

        {currentTab === 'careertwin' && (
          <CareerTwinView
            profile={profile}
            onUpdateProfile={updateProfileAndPersist}
            onNavigateToSimulator={() => setCurrentTab('simulator')}
          />
        )}

        {currentTab === 'jobradar' && (
          <JobRadarView
            jobs={jobs}
            profile={profile}
            onSelectJob={(job) => setSelectedJobForModal(job)}
            onToggleSaveJob={handleToggleSaveJob}
            onAddCustomJob={handleAddCustomJob}
          />
        )}

        {currentTab === 'skills' && (
          <SkillIntelligenceView
            trends={trends}
            profile={profile}
            onSelectSkillForSim={handleNavigateToSimulatorWithSkill}
          />
        )}

        {currentTab === 'careerpaths' && (
          <CareerPathsView
            nodes={careerNodes}
            profile={profile}
            onSetTargetRole={handleSetTargetRole}
            onNavigateToSimulator={(_roleTitle) => {
              setCurrentTab('simulator');
            }}
            onNavigateToRoadmap={(roleTitle) => {
              if (roleTitle) {
                updateProfileAndPersist({
                  ...profile,
                  targetRole: roleTitle
                });
              }
              setCurrentTab('roadmap');
            }}
          />
        )}

        {currentTab === 'roadmap' && (
          <CareerRoadmapView
            profile={profile}
            jobs={jobs}
            onUpdateProfile={updateProfileAndPersist}
            onNavigateTab={handleNavigateTab}
            onSimulateSkill={handleNavigateToSimulatorWithSkill}
            onSelectJob={(job) => setSelectedJobForModal(job)}
            onTailorResume={handleTailorResumeForJob}
          />
        )}

        {currentTab === 'simulator' && (
          <WhatIfSimulatorView
            profile={profile}
            initialSkillToAdd={simulatorPreselectedSkill}
            onCommitToTwin={handleCommitSimulationToTwin}
            onExploreRadar={() => setCurrentTab('jobradar')}
          />
        )}

        {currentTab === 'resumestudio' && (
          <ErrorBoundary fallbackMessage="The Resume builder encountered an error loading your data.">
            <ResumeStudioView
              profile={profile}
              jobs={jobs}
              selectedTargetJob={resumeTargetJob}
              onUpdateProfile={updateProfileAndPersist}
            />
          </ErrorBoundary>
        )}

        {currentTab === 'mentor' && (
          <AIMentorView
            profile={profile}
            recentJob={selectedJobForModal}
            activeSimulationSkills={['Docker & Containerization', 'MLOps (MLflow & CI/CD)']}
            initialPrompt={mentorInitialPrompt}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {currentTab === 'workforce' && (
          <WorkforceIntelligenceView
            profile={profile}
            initialQuery={workforceQuery}
            onNavigateToSimulator={handleNavigateToSimulatorWithSkill}
            onNavigateToMentor={(query) => handleNavigateTab('mentor', query)}
          />
        )}
      </main>

      {/* Deep Job Intelligence Modal */}
      <JobIntelligenceModal
        job={selectedJobForModal}
        profile={profile}
        onClose={() => setSelectedJobForModal(null)}
        onSimulateJobGaps={(job) => {
          const firstMissing = job.missingSkills[0] || 'MLOps (MLflow & CI/CD)';
          handleNavigateToSimulatorWithSkill(firstMissing);
        }}
        onTailorResume={handleTailorResumeForJob}
      />

      {/* Password Reset Modal / View */}
      {resetAuthParams && (
        <ResetPasswordView
          mode={resetAuthParams.mode}
          oobCode={resetAuthParams.oobCode}
          apiKey={resetAuthParams.apiKey}
          onSuccess={() => {
            setResetAuthParams(null);
            // Clean URL query parameters and reset path
            if (typeof window !== 'undefined' && window.history.replaceState) {
              window.history.replaceState({}, document.title, '/');
            }
            setAuthModalInitialMode('signin');
            setIsAuthModalOpen(true);
          }}
          onCancel={() => {
            setResetAuthParams(null);
            if (typeof window !== 'undefined' && window.history.replaceState) {
              window.history.replaceState({}, document.title, '/');
            }
          }}
          onRequestNewLink={() => {
            setResetAuthParams(null);
            if (typeof window !== 'undefined' && window.history.replaceState) {
              window.history.replaceState({}, document.title, '/');
            }
            setAuthModalInitialMode('forgot');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        initialEmail={authModalInitialEmail}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalInitialMode('signin');
        }}
        onSuccess={(user) => {
          setAuthUser(user);
        }}
        onStartOnboarding={() => {
          setIsAuthModalOpen(false);
          setCurrentTab('onboarding');
        }}
        onEnterResetCode={() => {
          setResetAuthParams({
            mode: 'resetPassword',
            oobCode: '',
            apiKey: null
          });
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 backdrop-blur-xs py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Pravriddhi</span>
            <span>·</span>
            <span>Understand Skills. Predict Demand. Simulate Careers.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTab('landing')} className="hover:text-slate-800">
              Platform
            </button>
            <button onClick={() => setCurrentTab('careertwin')} className="hover:text-slate-800">
              CareerTwin
            </button>
            <button onClick={() => setCurrentTab('roadmap')} className="hover:text-slate-800">
              Roadmap
            </button>
            <button onClick={() => setCurrentTab('workforce')} className="hover:text-slate-800">
              Workforce Intelligence
            </button>
            <button onClick={() => setCurrentTab('simulator')} className="hover:text-slate-800">
              Simulator
            </button>
            <button onClick={() => setCurrentTab('mentor')} className="hover:text-slate-800">
              AI Mentor
            </button>
          </div>
        </div>
      </footer>

      {/* Developer Debug Panel for Resume Flow Verification */}
      <DebugResumePanel
        authUser={authUser}
        profile={profile}
        activeResume={resumeStorageService.getActiveResumeRecord(profile.id)}
      />
    </div>
  );
}
