import React, { useState, useEffect } from 'react';
import { JobOpportunity, UserProfile } from '../../types';
import { MatchScore } from '../common/MatchScore';
import { EmptyState } from '../common/EmptyState';
import { discoverLiveJobsWithGrounding } from '../../services/aiService';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Building,
  Globe,
  Loader2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';

interface JobRadarViewProps {
  jobs: JobOpportunity[];
  profile: UserProfile;
  onSelectJob: (job: JobOpportunity) => void;
  onToggleSaveJob: (jobId: string) => void;
  onAddCustomJob: (job: JobOpportunity) => void;
}

const ALL_COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 
  'Germany', 'Singapore', 'Australia', 'Netherlands', 
  'Ireland', 'Remote / Global'
];

export const JobRadarView: React.FC<JobRadarViewProps> = ({
  jobs,
  profile,
  onSelectJob,
  onToggleSaveJob,
  onAddCustomJob
}) => {
  const [displayedJobs, setDisplayedJobs] = useState<JobOpportunity[]>(jobs);
  const [searchRole, setSearchRole] = useState(profile.targetRole || 'AI Engineer');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['India']);
  const [workplaceFilter, setWorkplaceFilter] = useState<'all' | 'Remote' | 'Hybrid' | 'On-site'>('all');
  
  // Live Discovery Status
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'success' | 'no_results' | 'service_unavailable' | 'partial_success'>('idle');
  const [searchErrorMsg, setSearchErrorMsg] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Finding live opportunities...');
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // Perform live job discovery for ALL selected countries
  const handlePerformLiveJobSearch = async () => {
    if (selectedCountries.length === 0) {
      alert("Please select at least one country/region to search.");
      return;
    }

    setIsSearchingLive(true);
    setSearchStatus('idle');
    setDisplayedJobs([]);
    
    // Rotate loading messages
    let msgIndex = 0;
    const msgs = ["Finding live opportunities...", "Analyzing your career fit...", "Ranking personalized matches..."];
    setLoadingMessage(msgs[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % msgs.length;
      setLoadingMessage(msgs[msgIndex]);
    }, 2500);

    try {
      const skillsToMatch = profile.skills.map(s => s.name);
      
      const allResults = await Promise.all(selectedCountries.map(country => 
        discoverLiveJobsWithGrounding({
          title: searchRole,
          skills: skillsToMatch,
          location: country === 'Remote / Global' ? 'Global Remote' : country,
          workplaceType: workplaceFilter === 'all' ? '' : workplaceFilter,
          profile
        })
      ));

      // Combine and deduplicate by originalUrl or title+company
      let combinedJobs: JobOpportunity[] = [];
      let hadSuccess = false;
      let hadFailure = false;

      const seenKeys = new Set<string>();

      allResults.forEach(res => {
        if (res.status === 'success') {
          hadSuccess = true;
          res.jobs.forEach(job => {
            const dupKey = (job.originalUrl || (job.title + (job.companyName || job.company))).toLowerCase();
            if (!seenKeys.has(dupKey)) {
              seenKeys.add(dupKey);
              combinedJobs.push(job);
            }
          });
        } else if (res.status === 'service_unavailable') {
          hadFailure = true;
          if (res.errorMessage) setSearchErrorMsg(res.errorMessage);
        }
      });

      // Sort combined by match score
      combinedJobs.sort((a, b) => b.matchScore - a.matchScore);

      setDisplayedJobs(combinedJobs);
      setLastSearchQuery(allResults[0]?.searchQuery || '');

      if (combinedJobs.length > 0) {
        setSearchStatus(hadFailure ? 'partial_success' : 'success');
      } else if (hadFailure) {
        setSearchStatus('service_unavailable');
      } else {
        setSearchStatus('no_results');
      }
    } catch (err) {
      console.error('Multi-region search failed:', err);
      setSearchStatus('service_unavailable');
    } finally {
      clearInterval(msgInterval);
      setIsSearchingLive(false);
    }
  };

  // Trigger live search on mount if empty
  useEffect(() => {
    if (displayedJobs.length === 0 && profile.targetRole) {
      handlePerformLiveJobSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };

  const filteredJobs = displayedJobs.filter(job => {
    const matchesWorkplace = workplaceFilter === 'all' || job.workplaceType === workplaceFilter || job.workplaceType === 'Any';
    return matchesWorkplace;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Ingestion CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-indigo-600" />
            REAL-TIME JOB DISCOVERY
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">JobRadar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover real current opportunities from official company career portals and verified boards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePerformLiveJobSearch}
            disabled={isSearchingLive}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {isSearchingLive ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh Live Opportunities
          </button>
        </div>
      </div>

      {/* Main Search Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              placeholder="Target Role (e.g. AI Engineer, Product Manager)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {['all', 'Remote', 'Hybrid', 'On-site'].map((type) => (
              <button
                key={type}
                onClick={() => setWorkplaceFilter(type as any)}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  workplaceFilter === type
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Countries Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Countries</label>
          <div className="flex flex-wrap gap-2">
            {ALL_COUNTRIES.map(country => (
              <button
                key={country}
                onClick={() => toggleCountry(country)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedCountries.includes(country)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery Status Alerts */}
      {isSearchingLive && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-800 font-medium">Searching live opportunities across {selectedCountries.length} regions...</p>
          <p className="text-sm text-slate-500 mt-1">This may take a moment as we query official career boards.</p>
        </div>
      )}

      {!isSearchingLive && searchStatus === 'service_unavailable' && (
          <EmptyState
            icon={<AlertCircle className="w-12 h-12 text-red-500" />}
            title="Live Search Pipeline Failed"
            description={"The backend AI engine encountered an error or was unavailable while executing the Search API or NVIDIA AI Provider for ''. Please check the console logs or backend terminal.\n\nError details: " + searchErrorMsg}
            actionText="Retry Search"
            onAction={handlePerformLiveJobSearch}
          />
        )}

        {!isSearchingLive && searchStatus === 'no_results' && (
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-slate-400" />}
          title="No matching opportunities found"
          description={`We couldn't find any current, verified openings for "${searchRole}" in your selected regions.`}
          actionText="Try a different role or region"
          onAction={() => document.querySelector('input')?.focus()}
        />
      )}

      {!isSearchingLive && searchStatus === 'partial_success' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Some job sources could not be reached</h4>
            <p className="text-xs text-amber-700 mt-1">Showing results from successfully verified sources in your selected regions.</p>
          </div>
        </div>
      )}

      {/* Job List */}
      {!isSearchingLive && filteredJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-slate-700">
              Showing {filteredJobs.length} verified opportunit{filteredJobs.length === 1 ? 'y' : 'ies'} 
              {selectedCountries.length > 0 && (
                <span className="font-normal text-slate-500"> across {selectedCountries.join(' · ')}</span>
              )}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-lg shadow-inner">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={(job.companyName || job.company)} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        (job.companyName || job.company).charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{(job.companyName || job.company)}</h4>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-emerald-100 text-emerald-800 uppercase">
                          VERIFIED POSTING
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mt-1 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleSaveJob(job.id); }}
                      className="p-2 -m-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {job.saved ? <BookmarkCheck className="w-5 h-5 text-indigo-600" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <span>{job.matchScore}% MATCH</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600 mb-5">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job.location} · {job.country}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building className="w-4 h-4 text-slate-400" />
                    {job.workplaceType}
                  </div>
                  {job.isVerified && (
                    <div className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </div>
                  )}
                </div>

                {job.salary && job.salary !== 'Salary not disclosed' && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-5">
                    <span className="text-emerald-700 font-bold tracking-wide">{job.salary}</span>
                  </div>
                )}

                <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                  {job.description}
                </p>

                <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Fit for This Role</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.matchedSkills.slice(0, 4).map((skill, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> {skill}
                        </div>
                      ))}
                      {job.missingSkills.slice(0, 2).map((skill, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 font-medium">
                          <AlertCircle className="w-3 h-3" /> {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        Source: {job.sourceName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Checked: {job.retrievedAt}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onSelectJob(job)}
                        className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200 hover:border-indigo-200"
                      >
                        Why this match?
                      </button>
                      <a 
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                      >
                        View Job <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
