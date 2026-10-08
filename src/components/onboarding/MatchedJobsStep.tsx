import React, { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, ArrowLeft, Bookmark, MapPin, Building2, Loader2, ExternalLink, AlertCircle, Compass } from 'lucide-react';
import { OnboardingSkill } from './SkillsStep';
import { discoverLiveJobsWithGrounding, queryWorkforceIntelligence } from '../../services/aiService';
import { JobOpportunity, WorkforceIntelligenceResult } from '../../types';

interface MatchedJobsStepProps {
  country: string;
  preferredLocation: string;
  workPreference: 'Remote' | 'Hybrid' | 'On-site';
  targetRoleTitle: string;
  skills: OnboardingSkill[];
  onNext: () => void;
  onBack: () => void;
}

export const MatchedJobsStep: React.FC<MatchedJobsStepProps> = ({
  country,
  preferredLocation,
  workPreference,
  targetRoleTitle,
  skills,
  onNext,
  onBack
}) => {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [marketSignals, setMarketSignals] = useState<WorkforceIntelligenceResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Analyzing live job market...');
  const [error, setError] = useState<string | null>(null);

  const loc = preferredLocation || country || 'Remote Global';

  useEffect(() => {
    let mounted = true;

    async function fetchJobsAndSignals() {
      setLoading(true);
      setError(null);
      setMarketSignals(null);
      
      const mockProfile = {
        uid: 'temp',
        email: '',
        name: '',
        onboardingCompleted: false,
        skills: skills.map(s => ({
          name: s.name,
          category: 'Core AI/ML',
          proficiency: 75,
          type: 'claimed',
          confidence: 'High',
          evidenceTitle: '',
          needsConfirmation: false
        })),
        targettitle: targetRoleTitle,
        targetRoleAlignment: 0,
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        achievements: [],
        savedJobs: []
      } as any;

      try {
        setLoadingMsg('Analyzing live job market...');
        const result = await discoverLiveJobsWithGrounding({
          title: targetRoleTitle,
          skills: skills.map(s => s.name),
          location: loc,
          workplaceType: workPreference,
          profile: mockProfile
        });

        if (mounted) {
          if (result.status === 'success' && result.jobs.length > 0) {
            setJobs(result.jobs);
            setLoading(false);
          } else {
            // No live jobs found, fetch market signals
            setLoadingMsg('No direct jobs found. Fetching live market signals...');
            const signals = await queryWorkforceIntelligence(`Hiring trends for ${targetRoleTitle} in ${loc}`, mockProfile);
            if (mounted) {
              setMarketSignals(signals);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setError("No verified relevant opening found right now.");
          setLoading(false);
        }
      }
    }

    fetchJobsAndSignals();

    return () => {
      mounted = false;
    };
  }, [targetRoleTitle, loc, workPreference, skills]);

  const toggleSaveJob = (id: string) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Step 7 of 8 · Find Jobs That Match</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Opportunities That Match You
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Tailored to your location ({loc}), your {workPreference.toLowerCase()} preference, and your current verified skills.
        </p>
      </div>

      {/* Jobs Content */}
      <div className="space-y-4 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-600">{loadingMsg}</p>
            <p className="text-xs text-slate-500 max-w-sm text-center">
              We are querying real-time opportunities and verifying skill alignment with your profile.
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-slate-50 rounded-3xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">{error}</p>
            <p className="text-xs text-slate-500 text-center max-w-md">
              We couldn't find exact matches meeting our strict verification criteria right now. You can still continue to plan your next move.
            </p>
          </div>
        ) : marketSignals ? (
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <Compass className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">No verified relevant opening found right now</h3>
                <p className="text-sm text-slate-600 mt-1">We couldn't find exact matches in {loc} for {targetRoleTitle}. Here are the current live market signals instead.</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Market Signals</h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {marketSignals.summary}
              </p>
              
              {marketSignals.sources && marketSignals.sources.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Verified Sources</span>
                  <div className="flex flex-wrap gap-2">
                    {marketSignals.sources.slice(0, 3).map((src, i) => (
                      <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center gap-1">
                        {src.domain}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          jobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {(job.companyName || job.company)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {job.workplaceType}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {job.retrievedAt}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 font-mono mt-0.5">
                      {job.salary}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Matches:
                    </span>
                    {job.matchedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                    {job.missingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                      >
                        - {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Match Score & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-lg font-black font-mono text-indigo-600">
                      {job.matchScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Profile Match
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-end">
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`w-full justify-center px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    {job.sourceUrl && (
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full justify-center px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 bg-slate-900 text-white hover:bg-slate-800 transition-all"
                      >
                        <span>View Original Job</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

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
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
