/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { RoadmapMilestone, MilestoneCategory, RoadmapPhase } from '../../types/roadmap';

interface AddMilestoneModalProps {
  isOpen: boolean;
  phases: RoadmapPhase[];
  onClose: () => void;
  onAddMilestone: (milestone: RoadmapMilestone) => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  phases,
  onClose,
  onAddMilestone
}) => {
  if (!isOpen) return null;

  const [phaseId, setPhaseId] = useState(phases[0]?.id || 'phase_1');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MilestoneCategory>('project');
  const [estimatedDuration, setEstimatedDuration] = useState('2 weeks');
  const [alignmentImpact, setAlignmentImpact] = useState(10);
  const [keySkillsInput, setKeySkillsInput] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const [description, setDescription] = useState('');
  const [subtasksInput, setSubtasksInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const keySkills = keySkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const subtasks = subtasksInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((t, idx) => ({
        id: `custom_st_${Date.now()}_${idx}`,
        title: t,
        completed: false
      }));

    const newMilestone: RoadmapMilestone = {
      id: `custom_m_${Date.now()}`,
      phaseId,
      title: title.trim(),
      category,
      status: 'in_progress',
      progressPercent: 20,
      estimatedDuration,
      alignmentImpact: Number(alignmentImpact) || 10,
      description: description.trim() || 'Custom career milestone defined by user.',
      keySkills: keySkills.length > 0 ? keySkills : ['Custom Skill'],
      deliverable: deliverable.trim() || undefined,
      subtasks: subtasks.length > 0 ? subtasks : [
        { id: `st_def_${Date.now()}`, title: 'Complete first iteration of deliverable', completed: false }
      ],
      isCustom: true
    };

    onAddMilestone(newMilestone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
              Personalized Pathway
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Add Custom Career Milestone
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Phase selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Roadmap Stage / Phase
            </label>
            <select
              value={phaseId}
              onChange={(e) => setPhaseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  Phase {phase.phaseNumber}: {phase.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Real-Time Fraud Inference Pipeline"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MilestoneCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="skill">Skill Mastery</option>
                <option value="project">Practical Project</option>
                <option value="systems">Systems & MLOps</option>
                <option value="certification">Certification & Credential</option>
                <option value="architecture">Architecture & Leadership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 2 weeks"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Objective & Scope
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What core competencies will this milestone demonstrate or test?"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Deliverable */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Concrete Deliverable
            </label>
            <input
              type="text"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              placeholder="e.g. Verified GitHub repo with CI/CD and latency benchmarks"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Key Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Skills (Comma separated)
            </label>
            <input
              type="text"
              value={keySkillsInput}
              onChange={(e) => setKeySkillsInput(e.target.value)}
              placeholder="e.g. PyTorch, Docker, FastAPI"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Checklist Subtasks (One per line)
            </label>
            <textarea
              rows={3}
              value={subtasksInput}
              onChange={(e) => setSubtasksInput(e.target.value)}
              placeholder={"Write initial setup code\nRun load tests\nDeploy to staging"}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Add Milestone to Timeline
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
