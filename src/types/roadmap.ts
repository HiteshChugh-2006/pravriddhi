/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MilestoneStatus = 'completed' | 'in_progress' | 'upcoming';

export type MilestoneCategory = 
  | 'skill'
  | 'project'
  | 'certification'
  | 'systems'
  | 'architecture'
  | 'leadership';

export interface MilestoneSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  type: 'Course' | 'Documentation' | 'Book' | 'Repository' | 'Interactive Lab';
  url: string;
  duration?: string;
  isFree?: boolean;
}

export interface RoadmapMilestone {
  id: string;
  phaseId: string;
  title: string;
  category: MilestoneCategory;
  status: MilestoneStatus;
  progressPercent: number; // 0 - 100
  estimatedDuration: string; // e.g., '3 weeks'
  completedDate?: string;
  targetDate?: string;
  description: string;
  alignmentImpact: number; // e.g. 10 (+10% alignment)
  keySkills: string[];
  deliverable?: string;
  subtasks: MilestoneSubtask[];
  evidenceUrl?: string;
  evidenceNote?: string;
  learningResources?: LearningResource[];
  isCustom?: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  estimatedTimeline: string;
  milestones: RoadmapMilestone[];
}

export interface CareerRoadmapState {
  targetRole: string;
  targetRoleLevel: string;
  medianComp: string;
  estimatedTimeToReadiness: string;
  overallProgressPercent: number;
  phases: RoadmapPhase[];
  customMilestones: RoadmapMilestone[];
  lastUpdated: string;
}
