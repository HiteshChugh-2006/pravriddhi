import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { JobOpportunity } from '../../types';
import { TargetJobAnalysis, analyzeTargetJobDescription } from '../../services/resumeParserService';

interface TargetJobSelectorProps {
  jobs: JobOpportunity[];
  currentAnalysis: TargetJobAnalysis;
  onSelectTargetJob: (analysis: TargetJobAnalysis) => void;
}

export const TargetJobSelector: React.FC<TargetJobSelectorProps> = ({
  jobs,
  currentAnalysis,
  onSelectTargetJob
}) => {
  const [mode, setMode] = useState<'jobradar' | 'paste' | 'upload'>('jobradar');
  const [pastedText, setPastedText] = useState('');
  const [customRole, setCustomRole] = useState('Senior ML Engineer');
  const [customCompany, setCustomCompany] = useState('Tech Solutions Corp');

  const handleApplyPasted = () => {
    if (!pastedText.trim()) return;
    const analysis = analyzeTargetJobDescription(pastedText, customCompany, customRole);
    onSelectTargetJob(analysis);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const analysis = analyzeTargetJobDescription(text, file.name.replace(/\.[^/.]+$/, ''), 'ML Engineer');
        onSelectTargetJob(analysis);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Target Job & Role Requirements
            </h2>
            <p className="text-[11px] text-slate-500">
              Align resume keywords and evidence strength against verified role expectations.
            </p>
          </div>
        </div>

        {/* Source Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setMode('jobradar')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mode === 'jobradar'
                ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Use JobRadar
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mode === 'paste'
                ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste JD
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload JD
          </button>
        </div>
      </div>

      {/* Mode 1: Select from JobRadar */}
      {mode === 'jobradar' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {jobs.slice(0, 6).map((job) => {
              const isSelected = currentAnalysis.company === job.company && currentAnalysis.role === job.role;
              return (
                <div
                  key={job.id}
                  onClick={() => onSelectTargetJob(analyzeTargetJobDescription(job))}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{job.role}</span>
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {job.matchScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">{job.company}</div>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Paste JD */}
      {mode === 'paste' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Role Title</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Lead ML Engineer"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Company Name</label>
              <input
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                placeholder="e.g. Stripe, Databricks"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Job Description Content (Paste Full Text)
            </label>
            <textarea
              rows={4}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste responsibilities, required skills, tools, and qualification requirements..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 bg-white leading-relaxed"
            />
          </div>
          <button
            onClick={handleApplyPasted}
            disabled={!pastedText.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Extract Keywords & Analyze ATS Target
          </button>
        </div>
      )}

      {/* Mode 3: Upload JD */}
      {mode === 'upload' && (
        <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 mt-2">
            Upload job specification text or PDF to automatically extract keywords and responsibilities.
          </p>
        </div>
      )}

      {/* Extracted Target Analysis Summary */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Targeting Role
          </span>
          <p className="font-semibold text-slate-900">
            {currentAnalysis.role} <span className="text-slate-500 font-normal">at {currentAnalysis.company}</span>
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Required Skills ({currentAnalysis.requiredSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {currentAnalysis.requiredSkills.map((sk: string) => (
              <span key={sk} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-semibold">
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Tools & Domain Keywords
          </span>
          <div className="flex flex-wrap gap-1">
            {currentAnalysis.domainKeywords.slice(0, 4).map((kw: string) => (
              <span key={kw} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
