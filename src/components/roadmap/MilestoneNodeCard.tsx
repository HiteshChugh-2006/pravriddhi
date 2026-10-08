/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Bot,
  Zap,
  Code2,
  Briefcase,
  Award,
  Layers,
  CheckSquare,
  Lock,
  BookOpen,
  Building2,
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';
import { RoadmapMilestone, MilestoneStatus, MilestoneCategory, LearningResource } from '../../types/roadmap';
import { UserProfile, JobOpportunity } from '../../types';

interface MilestoneNodeCardProps {
  milestone: RoadmapMilestone;
  index: number;
  phaseNumber?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onHover?: (hovered: boolean) => void;
  prerequisiteMilestone?: { title: string; status: MilestoneStatus };
  unlocksMilestone?: { title: string; status: MilestoneStatus };
  profile?: UserProfile;
  jobs?: JobOpportunity[];
  onSelect: () => void;
  onToggleStatus: (newStatus: MilestoneStatus) => void;
  onToggleSubtask?: (subtaskId: string, completed: boolean) => void;
  onSimulateSkill?: (skillName: string) => void;
  onAskMentor?: (query: string) => void;
  onAddToResume?: (milestone: RoadmapMilestone) => void;
  onSelectJob?: (job: JobOpportunity) => void;
  onTailorResume?: (job: JobOpportunity) => void;
}

export const MilestoneNodeCard: React.FC<MilestoneNodeCardProps> = ({
  milestone,
  index,
  phaseNumber,
  isSelected,
  isHovered,
  onHover,
  prerequisiteMilestone,
  unlocksMilestone,
  profile,
  jobs = [],
  onSelect,
  onToggleStatus,
  onToggleSubtask,
  onSimulateSkill,
  onAskMentor,
  onAddToResume,
  onSelectJob,
  onTailorResume
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTab, setExpandedTab] = useState<'requirements' | 'resources' | 'jobs'>('requirements');
  const activeHover = isHovered || internalHover;

  const getCategoryIcon = (category: MilestoneCategory) => {
    switch (category) {
      case 'skill':
        return <Code2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'project':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
      case 'certification':
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      case 'systems':
        return <Zap className="w-3.5 h-3.5 text-violet-600" />;
      case 'architecture':
      case 'leadership':
        return <Layers className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const completedSubtasksCount = milestone.subtasks.filter((t) => t.completed).length;
  const totalSubtasksCount = milestone.subtasks.length;
  const isPrerequisiteMet = !prerequisiteMilestone || prerequisiteMilestone.status === 'completed';

  // Matching jobs specifically associated with this milestone's key skills
  const matchingJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    const matched = jobs.filter((job) => {
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

    return matched.length > 0 ? matched : jobs.slice(0, 2);
  }, [jobs, milestone.keySkills]);

  const learningResources: LearningResource[] = milestone.learningResources || [];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => {
        setInternalHover(true);
        if (onHover) onHover(true);
      }}
      onMouseLeave={() => {
        setInternalHover(false);
        if (onHover) onHover(false);
      }}
      className={`group relative rounded-2xl transition-all duration-300 cursor-pointer text-left ${
        isSelected
          ? 'bg-white shadow-lg ring-2 ring-indigo-500 border-transparent -translate-y-0.5'
          : activeHover
          ? 'bg-white shadow-md border-indigo-200/90 -translate-y-0.5 ring-1 ring-indigo-200'
          : 'bg-white/80 hover:bg-white hover:shadow-xs border border-slate-200/90'
      } p-5 flex flex-col justify-between`}
    >
      <div>
        {/* Top Metadata Line */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            {getCategoryIcon(milestone.category)}
            {phaseNumber && (
              <span className="font-bold text-indigo-700">Node {phaseNumber}.{index + 1}</span>
            )}
            {phaseNumber && <span aria-hidden="true" className="text-slate-300">·</span>}
            <span className="capitalize">{milestone.category} Milestone</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{milestone.estimatedDuration}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              +{milestone.alignmentImpact}% alignment
            </span>

            {/* Inline Expand Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
              title={isExpanded ? 'Collapse inline view' : 'Expand detailed requirements, resources & jobs'}
            >
              <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Milestone Title */}
        <h4 className={`text-sm sm:text-base font-semibold tracking-tight leading-snug transition-colors ${
          activeHover ? 'text-indigo-600' : 'text-slate-900'
        }`}>
          {milestone.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {milestone.description}
        </p>

        {/* Dependency Relationship Bar */}
        {(prerequisiteMilestone || unlocksMilestone) && (
          <div className={`mt-3 pt-2.5 pb-1 border-t text-[11px] transition-colors ${
            activeHover
              ? 'border-indigo-100 bg-indigo-50/40 -mx-2 px-2 rounded-lg'
              : 'border-slate-100 text-slate-500'
          }`}>
            <div className="flex flex-col gap-1">
              {prerequisiteMilestone && (
                <div className="flex items-center gap-1.5">
                  {isPrerequisiteMet ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className="text-slate-400 font-medium">Requires:</span>
                  <span className={`truncate ${isPrerequisiteMet ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>
                    {prerequisiteMilestone.title}
                  </span>
                  <span className={`text-[10px] ml-auto shrink-0 ${isPrerequisiteMet ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-medium'}`}>
                    {isPrerequisiteMet ? 'Dependency Met' : 'Prerequisite Gated'}
                  </span>
                </div>
              )}

              {unlocksMilestone && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Zap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-slate-400 font-medium">Unlocks:</span>
                  <span className="truncate text-slate-700 font-medium">{unlocksMilestone.title}</span>
                  <span className="text-[10px] text-indigo-600 font-semibold ml-auto shrink-0">
                    Next in Flow →
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Target Skills */}
        {milestone.keySkills.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
            <span className="font-medium text-slate-400">Target Skills:</span>
            {milestone.keySkills.map((skill, sIdx) => (
              <React.Fragment key={skill}>
                {sIdx > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSimulateSkill) onSimulateSkill(skill);
                  }}
                  className="hover:text-indigo-600 hover:underline font-medium text-slate-700 transition-colors"
                  title={`Simulate ${skill} in What-If Simulator`}
                >
                  {skill}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ============================================================
            EXPANDED SECTION: REQUIREMENTS, LEARNING RESOURCES & JOBS
            ============================================================ */}
        {isExpanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 pt-3 border-t border-slate-200/90 space-y-4 animate-in fade-in duration-200 bg-slate-50/70 -mx-5 -mb-2 px-5 py-4 rounded-b-2xl"
          >
            {/* Expanded Internal Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setExpandedTab('requirements')}
                className={`pb-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  expandedTab === 'requirements'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Requirements ({completedSubtasksCount}/{totalSubtasksCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedTab('resources')}
                className={`pb-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  expandedTab === 'resources'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Learning Resources ({learningResources.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setExpandedTab('jobs')}
                className={`pb-1 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  expandedTab === 'jobs'
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Matching Jobs ({matchingJobs.length})</span>
              </button>
            </div>

            {/* TAB 1: REQUIREMENTS */}
            {expandedTab === 'requirements' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* Concrete Deliverable */}
                {milestone.deliverable && (
                  <div className="p-3 rounded-xl bg-white border border-indigo-100/90 text-xs shadow-2xs">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-900 block mb-0.5">Production Deliverable:</span>
                        <span className="text-slate-700 font-medium leading-relaxed">{milestone.deliverable}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtasks Checklist */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Deliverable Checklist</span>
                    <span>{milestone.progressPercent}% Completed</span>
                  </div>
                  <div className="space-y-1">
                    {milestone.subtasks.map((task) => (
                      <label
                        key={task.id}
                        className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          task.completed
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                            : 'bg-white border-slate-200/80 hover:border-indigo-300 text-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => onToggleSubtask && onToggleSubtask(task.id, e.target.checked)}
                          className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span className={`text-[11px] ${task.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Profile Verified Competency Status */}
                {profile && milestone.keySkills.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      CareerTwin Verification:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {milestone.keySkills.map((sk) => {
                        const userSkill = profile.skills.find(
                          (s) => s.name.toLowerCase() === sk.toLowerCase() || s.name.toLowerCase().includes(sk.toLowerCase())
                        );
                        const hasSkill = !!userSkill;
                        const isDem = userSkill?.type === 'demonstrated';

                        return (
                          <div
                            key={sk}
                            className="p-2 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between gap-1 text-[11px]"
                          >
                            <span className="font-semibold text-slate-800 truncate">{sk}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isDem ? 'bg-emerald-50 text-emerald-700' : hasSkill ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {isDem ? 'Demonstrated' : hasSkill ? `${userSkill?.proficiency}%` : 'Gap'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SUGGESTED LEARNING RESOURCES */}
            {expandedTab === 'resources' && (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Recommended Blueprints & Technical Guides:
                </span>
                {learningResources.length > 0 ? (
                  learningResources.map((res) => (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs transition-all shadow-2xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
                          <span className="font-bold text-indigo-600">{res.provider}</span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span>{res.type}</span>
                          {res.duration && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span>{res.duration}</span>
                            </>
                          )}
                        </div>
                        <h6 className="font-semibold text-slate-900 truncate">
                          {res.title}
                        </h6>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onAskMentor && (
                          <button
                            type="button"
                            onClick={() => onAskMentor(`Can you generate a study breakdown for ${res.title}?`)}
                            className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Study Plan
                          </button>
                        )}
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                    No explicit links configured. Ask AI Mentor for tailored materials.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: POTENTIAL JOB OPENINGS */}
            {expandedTab === 'jobs' && (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Active Positions Requiring This Milestone's Competencies:
                </span>
                {matchingJobs.length > 0 ? (
                  matchingJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span className="font-bold text-slate-800">{(job.companyName || job.company)}</span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{job.location}</span>
                            </span>
                          </div>
                          <h6 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {job.title}
                          </h6>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-indigo-600 block">
                            {job.matchScore}% Match
                          </span>
                          <span className="text-[10px] text-slate-500">{job.salary}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500">
                          Top requirement: <strong className="text-slate-700">{job.matchedSkills[0] || 'Machine Learning'}</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {onSelectJob && (
                            <button
                              type="button"
                              onClick={() => onSelectJob(job)}
                              className="px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            >
                              Inspect
                            </button>
                          )}
                          {onTailorResume && (
                            <button
                              type="button"
                              onClick={() => onTailorResume(job)}
                              className="px-2 py-0.5 text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                            >
                              Tailor Resume
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                    No direct jobs mapped to this specific milestone skill subset yet.
                  </div>
                )}
              </div>
            )}

            {/* Bottom CTA to open full Side Panel Drawer */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-medium">
                Want deep verification or artifact links?
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Open Full Side Panel Drawer →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Progress & Interactive Status */}
      <div className="mt-4 pt-3 border-t border-slate-100/90 flex flex-col gap-2.5">
        {/* Progress bar if in progress */}
        {milestone.status === 'in_progress' && (
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-semibold text-indigo-700">In Progress ({milestone.progressPercent}%)</span>
              <span>{completedSubtasksCount} of {totalSubtasksCount} tasks completed</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${milestone.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Line & Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2">
            {milestone.status === 'completed' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Achieved</span>
              </span>
            ) : milestone.status === 'in_progress' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600" />
                </span>
                <span>Active Track</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Next in Sequence</span>
              </span>
            )}
          </div>

          {/* Quick Interactive Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="px-2 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>

            {milestone.status !== 'completed' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus('completed');
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                title="Mark milestone complete"
              >
                Mark Complete
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus('in_progress');
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-md transition-colors"
                title="Set to in progress"
              >
                Reopen
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Open full milestone side panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
