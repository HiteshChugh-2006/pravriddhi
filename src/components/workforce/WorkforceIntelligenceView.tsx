import React, { useState } from 'react';
import { UserProfile, WorkforceIntelligenceResult } from '../../types';
import { queryWorkforceIntelligence } from '../../services/aiService';
import { LiveWebBadge } from '../common/LiveWebBadge';
import { SourceCard } from '../common/SourceCard';
import { SkillChip } from '../common/SkillChip';
import {
  Search,
  Sparkles,
  Globe,
  ArrowRight,
  TrendingUp,
  Cpu,
  Target,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  History
} from 'lucide-react';

interface WorkforceIntelligenceViewProps {
  profile: UserProfile;
  initialQuery?: string;
  onNavigateToSimulator: (skillName?: string) => void;
  onNavigateToMentor: (query: string) => void;
}

export const WorkforceIntelligenceView: React.FC<WorkforceIntelligenceViewProps> = ({
  profile,
  initialQuery = 'What skills are becoming important for ML Engineers?',
  onNavigateToSimulator,
  onNavigateToMentor
}) => {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WorkforceIntelligenceResult | null>(null);

  // Recent queries list
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'What skills are emerging for ML Engineers in India?',
    'What technologies are currently in demand for AI Engineers?',
    'What skills should I learn to move from Data Analyst to Data Scientist?',
    'What are the latest trends in Generative AI careers?',
    'Which skills are appearing frequently in current AI/ML roles?',
    'What certifications are becoming relevant for this career path?'
  ]);

  // Initial trigger
  React.useEffect(() => {
    handleRunQuery(initialQuery);
  }, []);

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await queryWorkforceIntelligence(queryText.trim(), profile);
      setResult(res);

      if (!recentQueries.includes(queryText.trim())) {
        setRecentQueries((prev) => [queryText.trim(), ...prev.slice(0, 5)]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Google Search Data Grounding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ask Workforce Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time industry telemetry powered by Google Search grounding and personalized against your CareerTwin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LiveWebBadge label="Google Search Telemetry" />
        </div>
      </div>

      {/* Prominent Intelligent Search Input Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery(queryInput);
          }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            placeholder="Ask about emerging skills, regional markets, salary trends, or role transitions..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full pl-12 pr-32 py-4 text-sm sm:text-base bg-white border border-slate-200/90 rounded-2xl focus:outline-hidden focus:border-indigo-500 text-slate-800 placeholder-slate-400 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isLoading || !queryInput.trim()}
            className="absolute right-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-40 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Prompt Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Suggested Intelligence Prompts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {recentQueries.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setQueryInput(prompt);
                  handleRunQuery(prompt);
                }}
                className="text-xs bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 rounded-lg px-2.5 py-1.5 transition-colors font-medium text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="glass-card rounded-3xl p-10 border border-white/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 animate-spin">
            <Globe className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            Synthesizing Live Google Search Telemetry...
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Extracting industry skill frequencies, verifying citations, and projecting alignment against your CareerTwin profile.
          </p>
        </div>
      )}

      {/* Structured Result Display */}
      {!isLoading && result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Dual Evidence Distinction Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border border-indigo-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>
                <strong>Distinction:</strong> Live Web Information is retrieved via Google Search grounding; personalized alignment is computed against your verified CareerTwin.
              </span>
            </div>
            <span className="font-mono text-[11px] text-indigo-700 font-semibold shrink-0">
              {result.timestamp}
            </span>
          </div>

          {/* Main Intelligence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Live Web Telemetry & AI Summary (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* AI Summary Card */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                      Workforce Market Synthesis
                    </span>
                  </div>
                  <LiveWebBadge label="Live Web" sourceCount={result.sources.length} />
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  "{result.query}"
                </h3>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                  {result.summary}
                </div>

                {/* Identified Emerging Skills Chips */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Extracted High-Velocity Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.emergingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-900"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{sk}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Identified Trending Roles */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Associated Role Demand
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.trendingRoles.map((role) => (
                      <span
                        key={role}
                        className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Sources / Citations Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider">
                    Grounded Sources & Citations ({result.sources.length})
                  </span>
                  <span className="text-slate-400">Verified Web References</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {result.sources.map((source, idx) => (
                    <SourceCard key={idx} source={source} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Personalized CareerTwin Mapping (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* CareerTwin Personalization Card */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Your CareerTwin Alignment
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700">
                    {result.twinAlignment.overallScore}% Fit
                  </span>
                </div>

                {/* Status Breakdown: Matched, Developing, Missing */}
                <div className="space-y-4">
                  {/* Matched */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Demonstrated in Profile</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.twinAlignment.matched.length > 0 ? (
                        result.twinAlignment.matched.map((m) => (
                          <SkillChip key={m} name={m} status="matched" />
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No direct matches found</span>
                      )}
                    </div>
                  </div>

                  {/* Developing */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Claimed / Developing</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.twinAlignment.developing.length > 0 ? (
                        result.twinAlignment.developing.map((d) => (
                          <SkillChip key={d} name={d} status="developing" />
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None currently flagged</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Critical Gaps */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Identified Market Gaps</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.twinAlignment.missing.map((mis) => (
                        <SkillChip key={mis} name={mis} status="missing" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Next Step */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                    Strategic Action Plan
                  </span>
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-800 leading-relaxed font-medium">
                    Learn Docker &rarr; MLOps (CI/CD) &rarr; Cloud Deployment
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onNavigateToSimulator(result.emergingSkills[0])}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Simulate These Skills in What-If</span>
                  </button>

                  <button
                    onClick={() => onNavigateToMentor(result.query)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ask AI Mentor to Explain Further</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
