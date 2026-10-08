/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { getMarketBenchmark } from '../../utils/salaryUtils';
import {
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Plus,
  RotateCcw,
  Download,
  Filter,
  Layers,
  ArrowRight,
  Bot,
  Zap,
  Code2,
  Briefcase,
  Award,
  ChevronDown,
  Share2,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { UserProfile, JobOpportunity } from '../../types';
import {
  RoadmapMilestone,
  MilestoneStatus,
  MilestoneCategory,
  CareerRoadmapState
} from '../../types/roadmap';
import { roadmapService } from '../../services/roadmapGenerator';
import { RoadmapPhaseTimeline } from './RoadmapPhaseTimeline';
import { MilestoneSidePanel } from './MilestoneSidePanel';
import { AddMilestoneModal } from './AddMilestoneModal';

interface CareerRoadmapViewProps {
  profile: UserProfile;
  jobs?: JobOpportunity[];
  onUpdateProfile?: (updated: UserProfile) => void;
  onNavigateTab: (tab: string, queryParam?: string) => void;
  onSimulateSkill?: (skillName: string) => void;
  onSelectJob?: (job: JobOpportunity) => void;
  onTailorResume?: (job: JobOpportunity) => void;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({
  profile,
  jobs = [],
  onUpdateProfile,
  onNavigateTab,
  onSimulateSkill,
  onSelectJob,
  onTailorResume
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(
    profile.targetRole || 'ML Engineer'
  );
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [statusFilter, setStatusFilter] = useState<'all' | MilestoneStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MilestoneCategory>('all');

  // Interactive Modals State
  const [inspectedMilestone, setInspectedMilestone] = useState<RoadmapMilestone | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load active roadmap state
  const roadmapState: CareerRoadmapState = useMemo(() => {
    // refreshTrigger used to force reload when storage changes
    return roadmapService.getRoadmapForUser(profile, selectedRole);
  }, [profile, selectedRole, refreshTrigger]);

  const availableRoles = roadmapService.getAvailableRoles();

  // Filtered Phases based on status and category filters
  const filteredPhases = useMemo(() => {
    return roadmapState.phases.map((phase) => {
      const filteredMilestones = phase.milestones.filter((m) => {
        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
        return matchesStatus && matchesCategory;
      });

      return {
        ...phase,
        milestones: filteredMilestones
      };
    }).filter((phase) => phase.milestones.length > 0);
  }, [roadmapState, statusFilter, categoryFilter]);

  // Aggregate Milestone Metrics
  const allMilestones = useMemo(() => {
    return roadmapState.phases.flatMap((p) => p.milestones);
  }, [roadmapState]);

  const completedCount = allMilestones.filter((m) => m.status === 'completed').length;
  const inProgressCount = allMilestones.filter((m) => m.status === 'in_progress').length;
  const upcomingCount = allMilestones.filter((m) => m.status === 'upcoming').length;
  const totalCount = allMilestones.length;

  // Next recommended milestone to focus on
  const nextMilestone = useMemo(() => {
    return allMilestones.find((m) => m.status === 'in_progress') ||
      allMilestones.find((m) => m.status === 'upcoming') ||
      allMilestones[0];
  }, [allMilestones]);

  // Status Handlers
  const handleToggleMilestoneStatus = (milestoneId: string, newStatus: MilestoneStatus) => {
    const progress = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 50 : 0;
    roadmapService.updateMilestone(profile.id, selectedRole, milestoneId, {
      status: newStatus,
      progress,
      completedDate: newStatus === 'completed' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined
    });

    // Optionally sync targetRoleAlignment if completed
    if (newStatus === 'completed' && onUpdateProfile) {
      const updatedProg = Math.min(98, (profile.targetRoleAlignment || 60) + 4);
      onUpdateProfile({
        ...profile,
        targetRoleAlignment: updatedProg
      });
    }

    setRefreshTrigger((prev) => prev + 1);

    // Update inspected milestone if open
    if (inspectedMilestone && inspectedMilestone.id === milestoneId) {
      setInspectedMilestone((prev) => (prev ? { ...prev, status: newStatus, progressPercent: progress } : null));
    }
  };

  // Subtask checkbox handler
  const handleToggleSubtask = (milestoneId: string, subtaskId: string, completed: boolean) => {
    roadmapService.updateMilestone(profile.id, selectedRole, milestoneId, {
      subtaskId,
      subtaskCompleted: completed
    });

    setRefreshTrigger((prev) => prev + 1);

    // Update inspected milestone local state
    if (inspectedMilestone && inspectedMilestone.id === milestoneId) {
      const updatedSubtasks = inspectedMilestone.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed } : st
      );
      const completedCount = updatedSubtasks.filter((t) => t.completed).length;
      const progressPercent = Math.round((completedCount / updatedSubtasks.length) * 100);
      const status: MilestoneStatus = progressPercent === 100 ? 'completed' : progressPercent > 0 ? 'in_progress' : 'upcoming';

      setInspectedMilestone({
        ...inspectedMilestone,
        subtasks: updatedSubtasks,
        progressPercent,
        status
      });
    }
  };

  // Save evidence
  const handleSaveEvidence = (milestoneId: string, url: string, note: string) => {
    roadmapService.updateMilestone(profile.id, selectedRole, milestoneId, {
      evidenceUrl: url,
      evidenceNote: note
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  // Add custom milestone
  const handleAddMilestone = (newMilestone: RoadmapMilestone) => {
    roadmapService.addCustomMilestone(profile.id, selectedRole, newMilestone);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Reset to blueprint
  const handleResetRoadmap = () => {
    if (window.confirm('Reset this roadmap back to suggested industry baseline? Custom notes and milestone overrides will be restored.')) {
      roadmapService.resetRoadmap(profile.id, selectedRole);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  // Export JSON summary
  const handleExportRoadmap = () => {
    const exportData = {
      user: profile.name || 'Pravriddhi User',
      targetRole: selectedRole,
      overallProgress: `${roadmapState.overallProgressPercent}%`,
      estimatedReadiness: roadmapState.estimatedTimeToReadiness,
      completedMilestones: completedCount,
      totalMilestones: totalCount,
      phases: roadmapState.phases.map((p) => ({
        phase: p.title,
        milestones: p.milestones.map((m) => ({
          title: m.title,
          category: m.category,
          status: m.status,
          progress: `${m.progressPercent}%`,
          skills: m.keySkills
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-roadmap-${selectedRole.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Target Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Interactive Target Trajectory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Track your step-by-step progress toward your target role across real-world milestone nodes, practical deliverables, and verified skill achievements.
          </p>
        </div>

        {/* Target Role Selector & Action Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Target Role Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200/90 shadow-2xs">
            <Target className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase text-slate-400">Target Role</span>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  if (onUpdateProfile && e.target.value !== profile.targetRole) {
                    onUpdateProfile({ ...profile, targetRole: e.target.value });
                  }
                }}
                className="text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden cursor-pointer pr-4"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Custom Milestone */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>

          {/* Export Roadmap */}
          <button
            onClick={handleExportRoadmap}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors"
            title="Export Roadmap Data (.json)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Reset Roadmap */}
          <button
            onClick={handleResetRoadmap}
            className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors"
            title="Reset to Blueprint Baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Readiness Hero Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Progress Bar & Milestone Counters */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Target Readiness Tracker
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {selectedRole}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-900">
                  {roadmapState.overallProgressPercent}%
                </span>
                <span className="text-xs font-medium text-slate-500 block">
                  Readiness Score
                </span>
              </div>
            </div>

            {/* Overall Progress Line */}
            <div className="w-full bg-slate-200/70 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${roadmapState.overallProgressPercent}%` }}
              />
            </div>

            {/* Milestone Statistics - Unboxed typography with bullet separators */}
            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{completedCount} Completed</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>{inProgressCount} In Progress</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{upcomingCount} Upcoming</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium">
                {totalCount} Total Milestones
              </span>
            </div>
          </div>

          {/* Right Column: Key Target Insights */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Market Benchmark
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Level:</span>
                <span className="font-semibold text-slate-900">{roadmapState.targetRoleLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Median Compensation:</span>
                <span className="font-semibold text-slate-900">{getMarketBenchmark(roadmapState.targetRole, profile.location)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Est. Time to Readiness:</span>
                <span className="font-semibold text-indigo-700">{roadmapState.estimatedTimeToReadiness}</span>
              </div>
            </div>

            {/* Quick action to career paths */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('careerpaths')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Career Paths</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Next Priority Milestone Callout Banner */}
      {nextMilestone && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                <span>Immediate Priority Milestone</span>
                <span aria-hidden="true" className="text-indigo-300">·</span>
                <span>+{nextMilestone.alignmentImpact}% Alignment Impact</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {nextMilestone.title}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                {nextMilestone.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setInspectedMilestone(nextMilestone)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/80 shadow-2xs transition-colors"
            >
              Inspect Tasks ({nextMilestone.subtasks.filter((t) => t.completed).length}/{nextMilestone.subtasks.length})
            </button>

            {nextMilestone.keySkills[0] && onSimulateSkill && (
              <button
                onClick={() => onSimulateSkill(nextMilestone.keySkills[0])}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Simulate Skill
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Toolbar & Filter Controls (Functional Button Tabs) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        {/* Status Filter Tabs (Segmented Buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Milestones ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'in_progress'
                ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'upcoming'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
        </div>

        {/* View Layout Mode (Timeline Flow vs Structured Grid) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">View Layout:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline Flow
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stage Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Timeline Phases List */}
      <div className="space-y-8">
        {filteredPhases.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No milestones match your current filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try switching filter tabs to view all milestones.</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPhases.map((phase, pIdx) => {
            const nextPhase = filteredPhases[pIdx + 1];
            const phaseCompletedCount = phase.milestones.filter((m) => m.status === 'completed').length;
            const isPhaseDone = phase.milestones.length > 0 && phaseCompletedCount === phase.milestones.length;
            const isPhaseActive = phaseCompletedCount > 0 && !isPhaseDone;

            return (
              <React.Fragment key={phase.id}>
                <RoadmapPhaseTimeline
                  phase={phase}
                  viewMode={viewMode}
                  selectedMilestoneId={inspectedMilestone?.id}
                  profile={profile}
                  jobs={jobs}
                  onSelectMilestone={(milestone) => setInspectedMilestone(milestone)}
                  onToggleMilestoneStatus={handleToggleMilestoneStatus}
                  onToggleSubtask={handleToggleSubtask}
                  onSimulateSkill={onSimulateSkill}
                  onAskMentor={(query) => onNavigateTab('mentor', query)}
                  onAddToResume={(milestone) => onNavigateTab('resumestudio')}
                  onSelectJob={onSelectJob}
                  onTailorResume={onTailorResume}
                />

                {/* Inter-Phase Progression Dependency Connector */}
                {nextPhase && (
                  <div className="flex flex-col items-center justify-center -my-3 relative z-20 group">
                    <div className="h-10 w-full flex items-center justify-center relative">
                      {/* Vertical SVG Animated Path */}
                      <svg className="w-16 h-10 overflow-visible">
                        <defs>
                          <linearGradient id={`phase-v-grad-${pIdx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isPhaseDone ? '#10b981' : '#6366f1'} />
                            <stop offset="100%" stopColor={isPhaseDone ? '#6366f1' : '#cbd5e1'} />
                          </linearGradient>
                        </defs>
                        <line
                          x1="32"
                          y1="0"
                          x2="32"
                          y2="40"
                          stroke={`url(#phase-v-grad-${pIdx})`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className={isPhaseDone ? 'roadmap-pulse-emerald' : isPhaseActive ? 'roadmap-flow-path roadmap-pulse-indigo' : ''}
                        />
                      </svg>

                      {/* Interactive Dependency Pill / Badge */}
                      <div className="absolute transform transition-all duration-300 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs group-hover:scale-105 group-hover:shadow-md bg-white border border-slate-200/90 text-slate-700">
                        {isPhaseDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800 font-bold">Phase 0{phase.phaseNumber} Completed</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-indigo-700">Unlocks Phase 0{nextPhase.phaseNumber}</span>
                          </>
                        ) : isPhaseActive ? (
                          <>
                            <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0 animate-pulse" />
                            <span className="text-indigo-800 font-bold">Phase 0{phase.phaseNumber} in Progress</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-500">Unlocks Phase 0{nextPhase.phaseNumber} upon completion</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-500">Prerequisite Stage: Phase 0{phase.phaseNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Milestone Side Panel (Detailed Requirements, Curated Learning Resources, Matching Jobs) */}
      <MilestoneSidePanel
        milestone={inspectedMilestone}
        profile={profile}
        jobs={jobs}
        isOpen={!!inspectedMilestone}
        onClose={() => setInspectedMilestone(null)}
        onToggleStatus={handleToggleMilestoneStatus}
        onToggleSubtask={handleToggleSubtask}
        onSaveEvidence={handleSaveEvidence}
        onSimulateSkill={onSimulateSkill}
        onAskMentor={(query) => onNavigateTab('mentor', query)}
        onSelectJob={onSelectJob}
        onTailorResume={onTailorResume}
      />

      {/* Add Custom Milestone Modal */}
      <AddMilestoneModal
        isOpen={isAddModalOpen}
        phases={roadmapState.phases}
        onClose={() => setIsAddModalOpen(false)}
        onAddMilestone={handleAddMilestone}
      />
    </div>
  );
};
