import React, { useState, useEffect } from 'react';
import { JobOpportunity, UserProfile } from '../../types';
import { MatchScore } from '../common/MatchScore';
import { SkillChip } from '../common/SkillChip';
import { EmptyState } from '../common/EmptyState';
import { discoverLiveJobsWithGrounding } from '../../services/aiService';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  PlusCircle,
  Sparkles,
  MapPin,
  Building,
  Upload,
  ExternalLink,
  Globe,
  Loader2,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface JobRadarViewProps {
  jobs: JobOpportunity[];
  profile: UserProfile;
  onSelectJob: (job: JobOpportunity) => void;
  onToggleSaveJob: (jobId: string) => void;
  onAddCustomJob: (job: JobOpportunity) => void;
}

export const JobRadarView: React.FC<JobRadarViewProps> = ({
  jobs,
  profile,
  onSelectJob,
  onToggleSaveJob,
  onAddCustomJob
}) => {
  const [displayedJobs, setDisplayedJobs] = useState<JobOpportunity[]>(jobs);
  const [searchRole, setSearchRole] = useState(profile.targetRole || 'ML Engineer');
  const [searchLocation, setSearchLocation] = useState('Remote or India');
  const [workplaceFilter, setWorkplaceFilter] = useState<'all' | 'Remote' | 'Hybrid' | 'On-site'>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'recent'>('match');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Live Discovery Status
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveSearchStage, setLiveSearchStage] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'success' | 'no_results' | 'service_unavailable'>('idle');
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // Custom Job Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customLocation, setCustomLocation] = useState('Remote');
  const [customJdText, setCustomJdText] = useState('');

  // Perform live job discovery with Google Search grounding
  const handlePerformLiveJobSearch = async (overrideRole?: string, overrideLoc?: string) => {
    const roleToSearch = overrideRole !== undefined ? overrideRole : searchRole;
    const locToSearch = overrideLoc !== undefined ? overrideLoc : searchLocation;

    setIsSearchingLive(true);
    setSearchStatus('idle');
    setLiveSearchStage('Searching live opportunities with Google Search...');

    try {
      const skillsToMatch = profile.skills.map(s => s.name);
      const res = await discoverLiveJobsWithGrounding({
        role: roleToSearch,
        skills: skillsToMatch,
        location: locToSearch,
        workplaceType: workplaceFilter,
        profile
      });

      setLastSearchQuery(res.searchQuery);
      setSearchStatus(res.status);

      if (res.status === 'success' && res.jobs.length > 0) {
        // Prepend or replace jobs list
        setDisplayedJobs(res.jobs);
      } else if (res.status === 'no_results') {
        setDisplayedJobs([]);
      }
    } catch (e) {
      console.error('Job search failure:', e);
      setSearchStatus('service_unavailable');
    } finally {
      setIsSearchingLive(false);
    }
  };

  // Trigger live search on first mount if displayedJobs is empty and profile exists
  useEffect(() => {
    if (displayedJobs.length === 0 && profile.targetRole) {
      handlePerformLiveJobSearch();
    }
  }, []);

  // Filtering
  const filteredJobs = displayedJobs
    .filter((job) => {
      const matchesSearch =
        job.role.toLowerCase().includes(searchRole.toLowerCase()) ||
        job.company.toLowerCase().includes(searchRole.toLowerCase()) ||
        job.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        job.strongMatches.some((s) => s.toLowerCase().includes(searchRole.toLowerCase()));

      const matchesWorkplace = workplaceFilter === 'all' || job.workplaceType === workplaceFilter;
      const matchesScore = job.matchScore >= minMatchScore;
      const matchesSaved = !showSavedOnly || job.saved;

      return matchesWorkplace && matchesScore && matchesSaved;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchScore - a.matchScore;
      }
      return 0;
    });

  const handleCreateCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRole.trim() || !customCompany.trim()) return;

    const lower = customJdText.toLowerCase();
    const candidateSkillNames = profile.skills.map(s => s.name);
    const strong = candidateSkillNames.filter(s => lower.includes(s.toLowerCase()));
    const missing = ['MLOps', 'Docker', 'Kubernetes'].filter(m => !candidateSkillNames.some(c => c.toLowerCase().includes(m.toLowerCase())));

    const newJob: JobOpportunity = {
      id: `job_custom_${Date.now()}`,
      role: customRole.trim(),
      company: customCompany.trim(),
      location: customLocation.trim(),
      workplaceType: 'Hybrid',
      salary: 'Estimated from posting',
      experienceLevel: 'Mid-Level',
      postedDate: 'Analyzed from custom job description',
      matchScore: Math.min(95, Math.max(40, Math.round((strong.length / Math.max(1, strong.length + missing.length)) * 100))),
      strongMatches: strong.length > 0 ? strong : ['Technical Competencies'],
      developingSkills: [],
      missingSkills: missing,
      aiExplanation: `Semantic analysis of ${customCompany}'s job posting indicates direct overlap with your verified CareerTwin skills.`,
      description: customJdText || `Custom job posting for ${customRole} at ${customCompany}.`,
      requirements: ['Production engineering discipline', 'Technical collaboration'],
      responsibilities: ['Deliver technical milestones.'],
      saved: true,
      source: 'Custom Analyzed JD',
      retrievalDate: 'Today',
      isDemoData: false,
      isRealJob: true
    };

    onAddCustomJob(newJob);
    setDisplayedJobs([newJob, ...displayedJobs]);
    setShowImportModal(false);
    setCustomRole('');
    setCustomCompany('');
    setCustomJdText('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Ingestion CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Real-Time Job Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            JobRadar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover real current opportunities from Greenhouse, Lever, Ashby, and company career portals.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handlePerformLiveJobSearch()}
            disabled={isSearchingLive}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSearchingLive ? 'animate-spin' : ''}`} />
            <span>{isSearchingLive ? 'Discovering Live Jobs...' : 'Search Live Opportunities'}</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Analyze Custom JD</span>
          </button>
        </div>
      </div>

      {/* Filter and Live Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-white/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Role Input */}
          <div className="relative md:col-span-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Target Role (e.g. ML Engineer, Data Scientist)..."
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePerformLiveJobSearch()}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-indigo-400 text-slate-800"
            />
          </div>

          {/* Location Input */}
          <div className="relative md:col-span-3">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Location (e.g. Remote, India, US)..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePerformLiveJobSearch()}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-indigo-400 text-slate-800"
            />
          </div>

          {/* Workplace Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl shrink-0 text-xs md:col-span-3 overflow-x-auto">
            {(['all', 'Remote', 'Hybrid', 'On-site'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setWorkplaceFilter(type)}
                className={`flex-1 px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  workplaceFilter === type
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>

          {/* Search CTA */}
          <div className="md:col-span-2">
            <button
              onClick={() => handlePerformLiveJobSearch()}
              disabled={isSearchingLive}
              className="w-full h-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Jobs</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Min Match:</span>
              <select
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700"
              >
                <option value={0}>Any Match</option>
                <option value={60}>60%+ Match</option>
                <option value={75}>75%+ High Match</option>
                <option value={85}>85%+ Top Tier</option>
              </select>
            </div>

            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showSavedOnly
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {showSavedOnly ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
              <span>Saved ({displayedJobs.filter(j => j.saved).length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing {filteredJobs.length} active opportunities
          </div>
        </div>
      </div>

      {/* Loading state during real search */}
      {isSearchingLive && (
        <div className="p-8 rounded-2xl bg-white/80 border border-indigo-100 shadow-sm text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              {liveSearchStage}
            </h3>
            <p className="text-xs text-slate-500">
              Querying verified company portals (Greenhouse, Lever, Ashby, Official Careers) via Gemini Google Search grounding...
            </p>
          </div>
        </div>
      )}

      {/* Service Unavailable or No Results State */}
      {!isSearchingLive && searchStatus === 'service_unavailable' && (
        <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-bold text-sm">Live job search is temporarily unavailable.</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            We were unable to reach live Google Search grounding. You can retry with a broader query or analyze a custom job posting.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handlePerformLiveJobSearch()}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700"
            >
              Try Again
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-50"
            >
              Analyze Custom JD
            </button>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      {!isSearchingLive && filteredJobs.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/80 border border-slate-200 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No verified opportunities found for this search.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your query, expanding your location, or targeting remote roles to discover verified opportunities.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => {
                setSearchLocation('Remote');
                handlePerformLiveJobSearch(searchRole, 'Remote');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
            >
              Try Remote
            </button>
            <button
              onClick={() => {
                setSearchLocation('Worldwide or India');
                handlePerformLiveJobSearch(searchRole, 'Worldwide or India');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Expand Location
            </button>
            <button
              onClick={() => {
                setSearchRole('ML Engineer');
                handlePerformLiveJobSearch('ML Engineer', searchLocation);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Change Role
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const hasSourceUrl = Boolean(job.sourceUrl || job.url);

            return (
              <div
                key={job.id}
                className="glass-card rounded-2xl p-6 border border-white/90 flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                <div>
                  {/* Header: Company & Role */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                          {job.company}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          REAL JOB
                        </span>
                        {job.isDemoData && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                            DEMO DATA
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">
                        {job.role}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location}</span>
                        </span>
                        <span>·</span>
                        <span className="font-medium text-slate-600">{job.workplaceType}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400 text-[11px]">{job.retrievalDate || 'Verified'}</span>
                      </div>
                    </div>

                    {/* Match score & Bookmark */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                        title={job.saved ? 'Remove from Saved' : 'Save Job'}
                      >
                        {job.saved ? (
                          <BookmarkCheck className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <MatchScore score={job.matchScore} size="sm" />
                    </div>
                  </div>

                  {/* Compensation Bar & Source Attribution */}
                  <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                    <div className="text-xs font-mono font-medium text-slate-700 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md">
                      {job.salary}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Source: <strong className="text-slate-700">{job.source || 'Career Portal'}</strong>
                    </div>
                  </div>

                  {/* Description Excerpt */}
                  {job.description && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {job.description}
                    </p>
                  )}

                  {/* Skill Compatibility Snapshot */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Twin Compatibility Breakdown</span>
                      <span className="font-medium text-slate-700">
                        {job.strongMatches.length} Verified · {job.missingSkills.length} Gaps
                      </span>
                    </div>

                    {/* Skills checkmarks: ✓ Matched, ⚠ Developing, ✕ Missing */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.strongMatches.map((s) => (
                        <SkillChip key={s} name={s} status="matched" />
                      ))}
                      {job.developingSkills.map((s) => (
                        <SkillChip key={s} name={s} status="developing" />
                      ))}
                      {job.missingSkills.map((s) => (
                        <SkillChip key={s} name={s} status="missing" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action: View Original Job & Inspect */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    {hasSourceUrl ? (
                      <a
                        href={job.sourceUrl || job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
                      >
                        <span>View Original Job</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {job.experienceLevel} · {job.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                    >
                      Why this match?
                    </button>

                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ingest Custom JD Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Analyze Custom Job Posting
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead ML Engineer"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-medium block mb-1">Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Databricks"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Job Description Content</label>
                <textarea
                  rows={6}
                  placeholder="Paste the full job description or requirements list..."
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Run Compatibility Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
