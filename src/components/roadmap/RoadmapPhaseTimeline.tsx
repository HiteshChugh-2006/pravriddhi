/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  ArrowRight,
  Zap,
  Lock,
  GitBranch,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Building2,
  ExternalLink
} from 'lucide-react';
import { RoadmapPhase, RoadmapMilestone, MilestoneStatus } from '../../types/roadmap';
import { UserProfile, JobOpportunity } from '../../types';
import { MilestoneNodeCard } from './MilestoneNodeCard';

interface RoadmapPhaseTimelineProps {
  phase: RoadmapPhase;
  viewMode: 'timeline' | 'grid';
  selectedMilestoneId?: string;
  profile?: UserProfile;
  jobs?: JobOpportunity[];
  onSelectMilestone: (milestone: RoadmapMilestone) => void;
  onToggleMilestoneStatus: (milestoneId: string, newStatus: MilestoneStatus) => void;
  onToggleSubtask?: (milestoneId: string, subtaskId: string, completed: boolean) => void;
  onSimulateSkill?: (skillName: string) => void;
  onAskMentor?: (query: string) => void;
  onAddToResume?: (milestone: RoadmapMilestone) => void;
  onSelectJob?: (job: JobOpportunity) => void;
  onTailorResume?: (job: JobOpportunity) => void;
}

export const RoadmapPhaseTimeline: React.FC<RoadmapPhaseTimelineProps> = ({
  phase,
  viewMode,
  selectedMilestoneId,
  profile,
  jobs = [],
  onSelectMilestone,
  onToggleMilestoneStatus,
  onToggleSubtask,
  onSimulateSkill,
  onAskMentor,
  onAddToResume,
  onSelectJob,
  onTailorResume
}) => {
  const [hoveredMilestoneId, setHoveredMilestoneId] = useState<string | null>(null);
  const [hoveredConnectorIndex, setHoveredConnectorIndex] = useState<number | null>(null);
  const [activePegPopoverId, setActivePegPopoverId] = useState<string | null>(null);

  const completedMilestones = phase.milestones.filter((m) => m.status === 'completed').length;
  const totalMilestones = phase.milestones.length;
  const phaseProgressPercent = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  const isPhaseFullyCompleted = phaseProgressPercent === 100;
  const isPhaseInProgress = phaseProgressPercent > 0 && phaseProgressPercent < 100;

  return (
    <div className="relative bg-white/75 border border-slate-200/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xs shadow-xs transition-shadow duration-300 hover:shadow-md">
      {/* Phase Stage Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-indigo-600 font-bold">Phase 0{phase.phaseNumber}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{phase.estimatedTimeline}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{completedMilestones}/{totalMilestones} Milestones Achieved</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            {phase.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {phase.subtitle}
          </p>
        </div>

        {/* Phase Progress Badge & Gauge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-900">
              {phaseProgressPercent}% Complete
            </div>
            <div className="text-[11px] text-slate-500">
              {isPhaseFullyCompleted ? 'Stage Mastered' : isPhaseInProgress ? 'In Active Progress' : 'Pending'}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-sm transition-all ${
            isPhaseFullyCompleted
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs'
              : isPhaseInProgress
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {isPhaseFullyCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <span>{phaseProgressPercent}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Timeline Nodes View */}
      {viewMode === 'timeline' ? (
        <div className="mt-8 relative">
          
          {/* Desktop SVG Dynamic Animated Timeline Pathway */}
          <div className="hidden lg:block relative mb-8 px-4">
            <div className="flex items-center justify-between relative">
              {phase.milestones.map((milestone, idx) => {
                const nextMilestone = phase.milestones[idx + 1];
                const isCurrentHovered = hoveredMilestoneId === milestone.id;
                const isConnectedToHovered =
                  hoveredMilestoneId === milestone.id ||
                  (nextMilestone && hoveredMilestoneId === nextMilestone.id);

                const isCurrentCompleted = milestone.status === 'completed';
                const isCurrentInProgress = milestone.status === 'in_progress';
                const isNextCompleted = nextMilestone?.status === 'completed';
                const isNextInProgress = nextMilestone?.status === 'in_progress';

                // Dependency state for the line segment
                const isDependencySatisfied = isCurrentCompleted;
                const isFlowActive = isCurrentCompleted && (isNextInProgress || isNextCompleted);
                const isPartialPrereq = isCurrentInProgress;
                const isConnectorHovered = hoveredConnectorIndex === idx || isConnectedToHovered;

                const matchingJobsForMilestone = jobs.filter((job) =>
                  milestone.keySkills.some((skill) =>
                    [...job.matchedSkills, ...job.developingSkills, ...job.missingSkills].some((js) =>
                      js.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(js.toLowerCase())
                    )
                  )
                );

                return (
                  <React.Fragment key={`peg-group-${milestone.id}`}>
                    {/* Node Peg Marker with Popover on Hover/Click */}
                    <div
                      onMouseEnter={() => {
                        setHoveredMilestoneId(milestone.id);
                        setActivePegPopoverId(milestone.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredMilestoneId(null);
                        setActivePegPopoverId(null);
                      }}
                      onClick={() => onSelectMilestone(milestone)}
                      className="relative z-30 flex flex-col items-center group cursor-pointer"
                    >
                      {/* Node Peg Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          milestone.status === 'completed'
                            ? 'bg-emerald-600 text-white shadow-xs group-hover:scale-115 group-hover:ring-4 group-hover:ring-emerald-100'
                            : milestone.status === 'in_progress'
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md group-hover:scale-115 group-hover:ring-6'
                            : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:scale-115'
                        } ${isCurrentHovered ? 'scale-115 ring-4 ring-indigo-200' : ''}`}
                      >
                        {milestone.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : milestone.status === 'in_progress' ? (
                          <Zap className="w-4 h-4 fill-white animate-pulse" />
                        ) : (
                          <span>{phase.phaseNumber}.{idx + 1}</span>
                        )}
                      </div>

                      {/* Sub-label under peg */}
                      <span className={`text-[11px] font-semibold mt-1.5 transition-colors ${
                        isCurrentHovered ? 'text-indigo-600 font-bold' : 'text-slate-600'
                      }`}>
                        Node {phase.phaseNumber}.{idx + 1}
                      </span>

                      {/* Floating Interactive Popover when Peg is Hovered */}
                      {activePegPopoverId === milestone.id && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMilestone(milestone);
                          }}
                          className="absolute -top-36 left-1/2 -translate-x-1/2 w-64 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl z-50 text-left pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200 border border-slate-700/80"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="uppercase tracking-wider font-bold text-indigo-300">
                              Node {phase.phaseNumber}.{idx + 1} · {milestone.category}
                            </span>
                            <span className="font-semibold text-emerald-400">+{milestone.alignmentImpact}% alignment</span>
                          </div>

                          <h5 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                            {milestone.title}
                          </h5>

                          <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                            <div className="flex items-center justify-between">
                              <span>Prerequisite:</span>
                              <span className={isCurrentCompleted ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                                {idx === 0 ? 'Foundation' : isCurrentCompleted ? 'Satisfied ✓' : 'In Progress'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Checklist Subtasks:</span>
                              <span className="text-white font-medium">{milestone.subtasks.filter(t => t.completed).length}/{milestone.subtasks.length} done</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Matching Market Jobs:</span>
                              <span className="text-indigo-300 font-semibold">{matchingJobsForMilestone.length} positions</span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">Click to open side panel</span>
                            <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                              <span>Inspect</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connecting Animated Line to Next Node with Dependency Visualization */}
                    {nextMilestone && (
                      <div
                        onMouseEnter={() => setHoveredConnectorIndex(idx)}
                        onMouseLeave={() => setHoveredConnectorIndex(null)}
                        onClick={() => onSelectMilestone(isDependencySatisfied ? nextMilestone : milestone)}
                        className="flex-1 relative mx-2 h-14 flex items-center justify-center cursor-pointer group"
                        title={
                          isDependencySatisfied
                            ? `Prerequisite Satisfied: Complete Node ${phase.phaseNumber}.${idx + 1} unlocks Node ${phase.phaseNumber}.${idx + 2}`
                            : isPartialPrereq
                            ? `In Progress: Complete Node ${phase.phaseNumber}.${idx + 1} (${milestone.progressPercent}%) to satisfy prerequisite`
                            : `Locked: Node ${phase.phaseNumber}.${idx + 2} requires Node ${phase.phaseNumber}.${idx + 1} completion`
                        }
                      >
                        {/* SVG Animated Connector Path */}
                        <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                          <defs>
                            {/* Linear Gradient for Completed Dependency */}
                            <linearGradient id={`grad-emerald-${phase.id}-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor={isNextCompleted ? '#10b981' : '#6366f1'} />
                            </linearGradient>

                            {/* Linear Gradient for Active In-Progress Flow */}
                            <linearGradient id={`grad-active-${phase.id}-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="50%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor={isNextCompleted ? '#10b981' : '#818cf8'} />
                            </linearGradient>

                            {/* Linear Gradient for Partial Prerequisite Work */}
                            <linearGradient id={`grad-partial-${phase.id}-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#cbd5e1" />
                            </linearGradient>

                            {/* Glowing Filter */}
                            <filter id={`glow-${phase.id}-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3.5" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* Base Track (Subtle Gray or Warning Dashed) */}
                          <line
                            x1="0"
                            y1="16"
                            x2="100%"
                            y2="16"
                            stroke={isConnectorHovered && !isDependencySatisfied && !isPartialPrereq ? '#f59e0b' : '#e2e8f0'}
                            strokeWidth={isConnectorHovered ? '3.5' : '3'}
                            strokeLinecap="round"
                            className={isConnectorHovered && !isDependencySatisfied ? 'roadmap-flow-path-amber' : ''}
                          />

                          {/* Progress Flow Line with animated dash array when prerequisite satisfied */}
                          {isCurrentCompleted && (
                            <line
                              x1="0"
                              y1="16"
                              x2="100%"
                              y2="16"
                              stroke={isNextCompleted ? `url(#grad-emerald-${phase.id}-${idx})` : `url(#grad-active-${phase.id}-${idx})`}
                              strokeWidth={isConnectorHovered ? '5' : '3.5'}
                              strokeLinecap="round"
                              filter={isConnectorHovered ? `url(#glow-${phase.id}-${idx})` : undefined}
                              className={`transition-all duration-300 ${
                                isNextCompleted
                                  ? 'roadmap-pulse-emerald'
                                  : isConnectorHovered
                                  ? 'roadmap-flow-path-fast roadmap-pulse-indigo'
                                  : 'roadmap-flow-path roadmap-pulse-indigo'
                              }`}
                            />
                          )}

                          {/* Partial Prerequisite Active Energy Flow when current is in_progress */}
                          {!isCurrentCompleted && isCurrentInProgress && (
                            <line
                              x1="0"
                              y1="16"
                              x2={`${Math.max(30, milestone.progressPercent)}%`}
                              y2="16"
                              stroke={`url(#grad-partial-${phase.id}-${idx})`}
                              strokeWidth={isConnectorHovered ? '4.5' : '3'}
                              strokeLinecap="round"
                              className="roadmap-flow-path roadmap-pulse-indigo"
                            />
                          )}

                          {/* Forward Traveling Particle / Energy Pulse */}
                          {isCurrentCompleted && !isNextCompleted && (
                            <circle
                              cx={isConnectorHovered ? '70%' : '50%'}
                              cy="16"
                              r={isConnectorHovered ? '4.5' : '3.5'}
                              fill="#6366f1"
                              className="animate-ping opacity-85 transition-all duration-300"
                            />
                          )}
                        </svg>

                        {/* Interactive Floating Dependency Badge on Line */}
                        <div
                          className={`absolute top-0 transform -translate-y-1 transition-all duration-300 z-30 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold shadow-2xs ${
                            isConnectorHovered
                              ? 'opacity-100 scale-105 bg-slate-900 text-white shadow-lg'
                              : isFlowActive
                              ? 'opacity-90 scale-100 bg-indigo-50 border border-indigo-200 text-indigo-800'
                              : isDependencySatisfied
                              ? 'opacity-80 scale-95 bg-emerald-50 border border-emerald-200 text-emerald-800'
                              : isPartialPrereq
                              ? 'opacity-85 scale-95 bg-amber-50 border border-amber-200 text-amber-800'
                              : 'opacity-0 scale-90 bg-white border border-slate-200 text-slate-500 group-hover:opacity-100'
                          }`}
                        >
                          {isDependencySatisfied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Prerequisite Met</span>
                              <span className="text-slate-400">·</span>
                              <span>Unlocks Node {phase.phaseNumber}.{idx + 2}</span>
                            </>
                          ) : isPartialPrereq ? (
                            <>
                              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                              <span>Active Prerequisite: Node {phase.phaseNumber}.{idx + 1} ({milestone.progressPercent}%)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Locked: Complete Node {phase.phaseNumber}.{idx + 1}</span>
                            </>
                          )}
                        </div>

                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Milestone Node Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {phase.milestones.map((milestone, idx) => {
              const isSelected = selectedMilestoneId === milestone.id;
              const isHovered = hoveredMilestoneId === milestone.id;

              const prevMilestone = idx > 0 ? phase.milestones[idx - 1] : undefined;
              const nextMilestone = idx < phase.milestones.length - 1 ? phase.milestones[idx + 1] : undefined;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col transition-all duration-300 ${
                    hoveredMilestoneId && !isHovered ? 'opacity-90' : 'opacity-100'
                  }`}
                >
                  <MilestoneNodeCard
                    milestone={milestone}
                    index={idx}
                    phaseNumber={phase.phaseNumber}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onHover={(hover) => setHoveredMilestoneId(hover ? milestone.id : null)}
                    prerequisiteMilestone={
                      prevMilestone
                        ? { title: prevMilestone.title, status: prevMilestone.status }
                        : undefined
                    }
                    unlocksMilestone={
                      nextMilestone
                        ? { title: nextMilestone.title, status: nextMilestone.status }
                        : undefined
                    }
                    profile={profile}
                    jobs={jobs}
                    onSelect={() => onSelectMilestone(milestone)}
                    onToggleStatus={(newStatus) => onToggleMilestoneStatus(milestone.id, newStatus)}
                    onToggleSubtask={(subtaskId, completed) => onToggleSubtask && onToggleSubtask(milestone.id, subtaskId, completed)}
                    onSimulateSkill={onSimulateSkill}
                    onAskMentor={onAskMentor}
                    onAddToResume={onAddToResume}
                    onSelectJob={onSelectJob}
                    onTailorResume={onTailorResume}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Vertical Step-by-Step Layout */
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase.milestones.map((milestone, idx) => {
              const prevMilestone = idx > 0 ? phase.milestones[idx - 1] : undefined;
              const nextMilestone = idx < phase.milestones.length - 1 ? phase.milestones[idx + 1] : undefined;

              return (
                <MilestoneNodeCard
                  key={milestone.id}
                  milestone={milestone}
                  index={idx}
                  phaseNumber={phase.phaseNumber}
                  isSelected={selectedMilestoneId === milestone.id}
                  isHovered={hoveredMilestoneId === milestone.id}
                  onHover={(hover) => setHoveredMilestoneId(hover ? milestone.id : null)}
                  prerequisiteMilestone={
                    prevMilestone
                      ? { title: prevMilestone.title, status: prevMilestone.status }
                      : undefined
                  }
                  unlocksMilestone={
                    nextMilestone
                      ? { title: nextMilestone.title, status: nextMilestone.status }
                      : undefined
                  }
                  profile={profile}
                  jobs={jobs}
                  onSelect={() => onSelectMilestone(milestone)}
                  onToggleStatus={(newStatus) => onToggleMilestoneStatus(milestone.id, newStatus)}
                  onToggleSubtask={(subtaskId, completed) => onToggleSubtask && onToggleSubtask(milestone.id, subtaskId, completed)}
                  onSimulateSkill={onSimulateSkill}
                  onAskMentor={onAskMentor}
                  onAddToResume={onAddToResume}
                  onSelectJob={onSelectJob}
                  onTailorResume={onTailorResume}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
