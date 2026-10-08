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
  AlertCircle,
  FileText
} from 'lucide-react';
import { RoadmapMilestone, MilestoneStatus } from '../../types/roadmap';
import { UserProfile } from '../../types';

interface MilestoneDetailModalProps {
  milestone: RoadmapMilestone | null;
  profile: UserProfile;
  onClose: () => void;
  onToggleStatus: (milestoneId: string, newStatus: MilestoneStatus) => void;
  onToggleSubtask: (milestoneId: string, subtaskId: string, completed: boolean) => void;
  onSaveEvidence: (milestoneId: string, url: string, note: string) => void;
  onSimulateSkill?: (skillName: string) => void;
  onAskMentor?: (query: string) => void;
  onAddToResume?: (milestone: RoadmapMilestone) => void;
}

export const MilestoneDetailModal: React.FC<MilestoneDetailModalProps> = ({
  milestone,
  profile,
  onClose,
  onToggleStatus,
  onToggleSubtask,
  onSaveEvidence,
  onSimulateSkill,
  onAskMentor,
  onAddToResume
}) => {
  if (!milestone) return null;

  const [evidenceUrl, setEvidenceUrl] = useState(milestone.evidenceUrl || '');
  const [evidenceNote, setEvidenceNote] = useState(milestone.evidenceNote || '');
  const [isSavedEvidence, setIsSavedEvidence] = useState(false);

  const completedSubtasks = milestone.subtasks.filter((t) => t.completed).length;
  const totalSubtasks = milestone.subtasks.length;

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvidence(milestone.id, evidenceUrl.trim(), evidenceNote.trim());
    setIsSavedEvidence(true);
    setTimeout(() => setIsSavedEvidence(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="uppercase text-indigo-600 font-bold tracking-wider">
                {milestone.category} Milestone
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{milestone.estimatedDuration}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-medium">+{milestone.alignmentImpact}% Alignment Impact</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {milestone.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Milestone Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Milestone Objective
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Concrete Deliverable */}
          {milestone.deliverable && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-0.5">
                    Production Deliverable
                  </h5>
                  <p className="text-xs sm:text-sm text-indigo-950 font-medium">
                    {milestone.deliverable}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subtask Action Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Actionable Tasks ({completedSubtasks}/{totalSubtasks})
              </h4>
              <span className="text-xs font-semibold text-slate-600">
                {milestone.progressPercent}% Completed
              </span>
            </div>

            {/* Checklist progress bar */}
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
                      : 'bg-white border-slate-200/80 hover:border-indigo-300 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => onToggleSubtask(milestone.id, task.id, e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className={`text-xs sm:text-sm ${task.completed ? 'line-through text-slate-500' : 'font-medium'}`}>
                    {task.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Required Competencies in CareerTwin Profile */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Required Profile Competencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-900">{skillName}</span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {hasSkill ? `${proficiency}% Proficiency` : 'Not in Profile'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{isDemonstrated ? 'Demonstrated Evidence' : hasSkill ? 'Claimed Skill' : 'Gap to Bridge'}</span>
                      {onSimulateSkill && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSimulateSkill(skillName);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                        >
                          Simulate →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Attachment & Documentation */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Attach Artifact or Verification Link
            </h4>
            <form onSubmit={handleEvidenceSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://github.com/user/project or credential link"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
                >
                  Save Link
                </button>
              </div>

              {isSavedEvidence && (
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Artifact link saved to roadmap milestone.</span>
                </div>
              )}
            </form>
          </div>

          {/* Quick Cross-Functional App Actions */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            {onAskMentor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskMentor(`How can I best prepare and complete the "${milestone.title}" milestone for my target role as ${profile.targetRole}?`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Mentor for Strategy</span>
              </button>
            )}

            {onAddToResume && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddToResume(milestone);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Add Deliverable to Resume Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Current Status:</span>
            <div className="inline-flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => onToggleStatus(milestone.id, 'upcoming')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  milestone.status === 'upcoming'
                    ? 'bg-white text-slate-900 shadow-xs'
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
                    ? 'bg-indigo-600 text-white shadow-xs'
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
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
