/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Bot,
  Zap,
  Code2,
  Briefcase,
  Award,
  Layers,
  CheckSquare,
  Square,
  Link,
  BookOpen,
  GraduationCap,
  Building2,
  DollarSign,
  MapPin,
  TrendingUp,
  FileText,
  Lock
} from 'lucide-react';
import { RoadmapMilestone, MilestoneStatus, LearningResource } from '../../types/roadmap';
import { UserProfile, JobOpportunity } from '../../types';

interface MilestoneSidePanelProps {
  milestone: RoadmapMilestone | null;
  profile: UserProfile;
  jobs: JobOpportunity[];
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (milestoneId: string, newStatus: MilestoneStatus) => void;
  onToggleSubtask: (milestoneId: string, subtaskId: string, completed: boolean) => void;
  onSaveEvidence: (milestoneId: string, url: string, note: string) => void;
  onSimulateSkill?: (skillName: string) => void;
  onAskMentor?: (query: string) => void;
  onSelectJob?: (job: JobOpportunity) => void;
  onTailorResume?: (job: JobOpportunity) => void;
}

export const MilestoneSidePanel: React.FC<MilestoneSidePanelProps> = ({
  milestone,
  profile,
  jobs,
  isOpen,
  onClose,
  onToggleStatus,
  onToggleSubtask,
  onSaveEvidence,
  onSimulateSkill,
  onAskMentor,
  onSelectJob,
  onTailorResume
}) => {
  if (!isOpen || !milestone) return null;

  const [activeTab, setActiveTab] = useState<'requirements' | 'resources' | 'jobs'>('requirements');
  const [evidenceUrl, setEvidenceUrl] = useState(milestone.evidenceUrl || '');
  const [evidenceNote, setEvidenceNote] = useState(milestone.evidenceNote || '');
  const [isSavedEvidence, setIsSavedEvidence] = useState(false);

  // Subtask statistics
  const completedSubtasks = milestone.subtasks.filter((t) => t.completed).length;
  const totalSubtasks = milestone.subtasks.length;

  // Handle artifact link save
  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvidence(milestone.id, evidenceUrl.trim(), evidenceNote.trim());
    setIsSavedEvidence(true);
    setTimeout(() => setIsSavedEvidence(false), 2500);
  };

  // Find matching job openings for this specific milestone
  const matchingJobs = jobs.filter((job) => {
    const allJobSkills = [
      ...job.matchedSkills,
      ...job.developingSkills,
      ...job.missingSkills,
      ...job.requirements
    ].map((s) => s.toLowerCase());

    return milestone.keySkills.some((skill) =>
      allJobSkills.some((js) => js.includes(skill.toLowerCase()) || skill.toLowerCase().includes(js))
    );
  });

  const displayJobs = matchingJobs.length > 0 ? matchingJobs : jobs.slice(0, 3);

  const learningResources: LearningResource[] = milestone.learningResources || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over Drawer Container */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl z-10 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Top Drawer Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/60 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="uppercase text-indigo-600 font-bold tracking-wider">
                {milestone.category} Milestone
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{milestone.estimatedDuration}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-medium">+{milestone.alignmentImpact}% Alignment Impact</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close side panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {milestone.title}
          </h2>

          {/* Quick Status Control Segmented Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="inline-flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => onToggleStatus(milestone.id, 'upcoming')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  milestone.status === 'upcoming'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(milestone.id, 'in_progress')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  milestone.status === 'in_progress'
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(milestone.id, 'completed')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  milestone.status === 'completed'
                    ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
            </div>

            <span className="text-xs font-semibold text-slate-700">
              {milestone.progressPercent}% Mastered
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs (Segmented Buttons) */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white gap-2 pt-2">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'requirements'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Requirements ({completedSubtasks}/{totalSubtasks})</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Resources ({learningResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Matching Jobs ({displayJobs.length})</span>
          </button>
        </div>

        {/* Drawer Body - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: REQUIREMENTS & CHECKLIST */}
          {activeTab === 'requirements' && (
            <div className="space-y-6">
              {/* Objective Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Scope & Objective
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Deliverable Specification */}
              {milestone.deliverable && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-0.5">
                        Production Deliverable
                      </h5>
                      <p className="text-xs sm:text-sm text-indigo-950 font-medium">
                        {milestone.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Checklist of Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actionable Deliverables ({completedSubtasks}/{totalSubtasks})
                  </h4>
                  <span className="text-xs font-semibold text-slate-600">
                    {milestone.progressPercent}% Completed
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${milestone.progressPercent}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {milestone.subtasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                          : 'bg-white border-slate-200/90 hover:border-indigo-300 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => onToggleSubtask(milestone.id, task.id, e.target.checked)}
                        className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                      <span className={`text-xs sm:text-sm leading-snug ${task.completed ? 'line-through text-slate-500' : 'font-medium'}`}>
                        {task.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Profile Competencies Check */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Skills in CareerTwin Profile
                </h4>
                <div className="space-y-2">
                  {milestone.keySkills.map((skillName) => {
                    const userSkill = profile.skills.find(
                      (s) => s.name.toLowerCase() === skillName.toLowerCase() || s.name.toLowerCase().includes(skillName.toLowerCase())
                    );
                    const hasSkill = !!userSkill;
                    const proficiency = userSkill ? userSkill.proficiency : 0;
                    const isDemonstrated = userSkill?.type === 'demonstrated';

                    return (
                      <div
                        key={skillName}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900">{skillName}</span>
                            <span className={`text-[10px] font-semibold ${isDemonstrated ? 'text-emerald-700' : hasSkill ? 'text-amber-700' : 'text-slate-400'}`}>
                              {isDemonstrated ? 'Demonstrated' : hasSkill ? 'Claimed' : 'Missing'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {hasSkill ? `Current Profile Level: ${proficiency}%` : 'Not yet demonstrated in CareerTwin'}
                          </span>
                        </div>

                        {onSimulateSkill && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSimulateSkill(skillName);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
                          >
                            Simulate
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Artifact & Link Attachment */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Attach Verification Link (GitHub / Credential)
                </h4>
                <form onSubmit={handleEvidenceSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        value={evidenceUrl}
                        onChange={(e) => setEvidenceUrl(e.target.value)}
                        placeholder="https://github.com/... or credential URL"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
                    >
                      Save
                    </button>
                  </div>

                  {isSavedEvidence && (
                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Artifact link saved to milestone.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: SUGGESTED LEARNING RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Curated Technical Resources
                </h4>
                <p className="text-xs text-slate-500">
                  Recommended blueprints, official docs, and reference implementations for {milestone.title}.
                </p>
              </div>

              <div className="space-y-3">
                {learningResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-indigo-700">
                          {resource.provider}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{resource.type}</span>
                          {resource.duration && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span>{resource.duration}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <h5 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {resource.title}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[11px] font-medium text-slate-500">
                        {resource.isFree ? 'Free Resource' : 'Certification / Deep-dive'}
                      </span>

                      <div className="flex items-center gap-2">
                        {onAskMentor && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onAskMentor(`Can you generate a 1-week study and implementation plan for the resourceName: "${resource.title}"?`);
                            }}
                            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                          >
                            Study Plan
                          </button>
                        )}

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mentor Recommendation callout */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Need an interactive tutoring session on these concepts?</span>
                </div>
                {onAskMentor && (
                  <button
                    onClick={() => {
                      onClose();
                      onAskMentor(`I am working on the milestone: "${milestone.title}". What are the most common production pitfalls and how can I avoid them?`);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-50 transition-colors shrink-0"
                  >
                    Ask AI Mentor
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MATCHING JOB OPENINGS */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Active Market Opportunities
                </h4>
                <p className="text-xs text-slate-500">
                  Real positions in JobRadar where {milestone.keySkills.join(', ')} are core hiring criteria.
                </p>
              </div>

              <div className="space-y-3">
                {displayJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                          <span className="font-semibold text-slate-900">{(job.companyName || job.company)}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{job.location}</span>
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 leading-snug">
                          {job.title}
                        </h5>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-indigo-600 block">
                          {job.matchScore}% Match
                        </span>
                        <span className="text-[10px] text-slate-500">{job.salary}</span>
                      </div>
                    </div>

                    {/* Matching and missing skills */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                      <span className="font-medium text-slate-400">Relevant:</span>
                      {job.matchedSkills.slice(0, 3).map((sm, sIdx) => (
                        <React.Fragment key={sm}>
                          {sIdx > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
                          <span className="text-emerald-700 font-medium">{sm}</span>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Job Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {onTailorResume && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onTailorResume(job);
                          }}
                          className="text-slate-600 hover:text-slate-900 font-medium"
                        >
                          Tailor Resume
                        </button>
                      )}

                      {onSelectJob && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectJob(job);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>View Full Job Intelligence</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onAskMentor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskMentor(`How does achieving the "${milestone.title}" milestone accelerate my transition into ${profile.targetRole}?`);
                }}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ask Mentor</span>
              </button>
            )}

            {milestone.keySkills[0] && onSimulateSkill && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSimulateSkill(milestone.keySkills[0]);
                }}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Skill Gap</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
