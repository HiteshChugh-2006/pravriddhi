import React, { useState } from 'react';
import {
  ResumeVersion,
  ResumeExperienceItem,
  ResumeProjectItem,
  ResumeEducationItem,
  ResumeCertificationItem,
  ResumeAchievementItem
} from '../../types/resume';
import { UserSkill, SkillCategory } from '../../types';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Undo2,
  Redo2,
  Check,
  Sparkles,
  Layers,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  Flame,
  HelpCircle
} from 'lucide-react';

interface ResumeContentEditorProps {
  version: ResumeVersion;
  onChange: (updated: ResumeVersion) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenImproveModal: () => void;
}

export const ResumeContentEditor: React.FC<ResumeContentEditorProps> = ({
  version,
  onChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenImproveModal
}) => {
  const [activeTab, setActiveTab] = useState<string>('experience');

  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase, count: version.experience.length },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Flame, count: version.skills.length },
    { id: 'projects', label: 'Projects', icon: Layers, count: version.projects.length },
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap, count: version.education.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: version.certifications.length },
    { id: 'achievements', label: 'Achievements', icon: Award, count: version.achievements.length }
  ];

  // Helper updater
  const updateField = <K extends keyof ResumeVersion>(field: K, value: ResumeVersion[K]) => {
    onChange({
      ...version,
      [field]: value,
      lastUpdated: 'Just Now'
    });
  };

  // Reorder Sections
  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const newOrder = [...version.sectionOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[idx];
    newOrder[idx] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    updateField('sectionOrder', newOrder);
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp: ResumeExperienceItem = {
      id: `exp_${Date.now()}`,
      title: 'Machine Learning Engineer',
      role: 'Machine Learning Engineer',
      company: 'New Enterprise Corp',
      period: '2024 - Present',
      startDate: '2024',
      endDate: 'Present',
      location: 'Remote',
      bullets: [
        'Implemented machine learning model pipeline in Python with robust feature tracking.'
      ],
      skillsUsed: ['Python', 'Docker', 'Machine Learning']
    };
    updateField('experience', [newExp, ...version.experience]);
  };

  const deleteExperience = (id: string) => {
    updateField('experience', version.experience.filter((e) => e.id !== id));
  };

  const addBulletToExperience = (expIdx: number) => {
    const newExp = [...version.experience];
    newExp[expIdx].bullets.push('Spearheaded development of scalable microservices in Python.');
    updateField('experience', newExp);
  };

  const updateBullet = (expIdx: number, bulletIdx: number, val: string) => {
    const newExp = [...version.experience];
    newExp[expIdx].bullets[bulletIdx] = val;
    updateField('experience', newExp);
  };

  const deleteBullet = (expIdx: number, bulletIdx: number) => {
    const newExp = [...version.experience];
    newExp[expIdx].bullets.splice(bulletIdx, 1);
    updateField('experience', newExp);
  };

  const moveBullet = (expIdx: number, bulletIdx: number, direction: 'up' | 'down') => {
    const newExp = [...version.experience];
    const targetIdx = direction === 'up' ? bulletIdx - 1 : bulletIdx + 1;
    if (targetIdx < 0 || targetIdx >= newExp[expIdx].bullets.length) return;
    const temp = newExp[expIdx].bullets[bulletIdx];
    newExp[expIdx].bullets[bulletIdx] = newExp[expIdx].bullets[targetIdx];
    newExp[expIdx].bullets[targetIdx] = temp;
    updateField('experience', newExp);
  };

  // Projects Handlers
  const addProject = () => {
    const newProj: ResumeProjectItem = {
      id: `proj_${Date.now()}`,
      title: 'Real-Time Inference Engine',
      name: 'Real-Time Inference Engine',
      description: 'Containerized deep learning inference server built using FastAPI and Docker.',
      tech: ['Python', 'FastAPI', 'Docker', 'PyTorch'],
      highlights: ['Achieved reproducible multi-environment deployment.'],
      verified: true
    };
    updateField('projects', [newProj, ...version.projects]);
  };

  const deleteProject = (id: string) => {
    updateField('projects', version.projects.filter((p) => p.id !== id));
  };

  // Skills Handlers
  const addSkill = (name: string, category: SkillCategory = 'Core AI/ML') => {
    if (!name.trim()) return;
    const newSkill: UserSkill = {
      id: `sk_custom_${Date.now()}`,
      name: name.trim(),
      category,
      proficiency: 80,
      confidence: 'High',
      type: 'demonstrated',
      yearsExp: 2,
      marketDemand: 'High',
      lastPracticed: 'Today',
      evidence: [{ id: `ev_${Date.now()}`, type: 'Project', title: 'Self-reported production proficiency' }]
    };
    updateField('skills', [...version.skills, newSkill]);
  };

  const deleteSkill = (id: string) => {
    updateField('skills', version.skills.filter((s) => s.id !== id));
  };

  const toggleSkillType = (id: string) => {
    const updated = version.skills.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          type: s.type === 'demonstrated' ? ('claimed' as const) : ('demonstrated' as const)
        };
      }
      return s;
    });
    updateField('skills', updated);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 no-print">
      {/* Top Header with Undo/Redo & AI Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Resume Content Editor
          </span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            Autosaved
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenImproveModal}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold hover:shadow-xs transition-all ml-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Bullet Reframer</span>
          </button>
        </div>
      </div>

      {/* Editor Section Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION: EXPERIENCE */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Work Experience ({version.experience.length})
            </span>
            <button
              onClick={addExperience}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-4">
            {version.experience.map((exp, expIdx) => (
              <div key={exp.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...version.experience];
                        newExp[expIdx].company = e.target.value;
                        updateField('experience', newExp);
                      }}
                      placeholder="Company Name"
                      className="text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-400"
                    />
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...version.experience];
                        newExp[expIdx].title = e.target.value;
                        updateField('experience', newExp);
                      }}
                      placeholder="Job Title"
                      className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-400"
                    />
                  </div>

                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={exp.startDate || ''}
                    onChange={(e) => {
                      const newExp = [...version.experience];
                      newExp[expIdx].startDate = e.target.value;
                      updateField('experience', newExp);
                    }}
                    placeholder="Start (e.g. 2022)"
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={exp.endDate || ''}
                    onChange={(e) => {
                      const newExp = [...version.experience];
                      newExp[expIdx].endDate = e.target.value;
                      updateField('experience', newExp);
                    }}
                    placeholder="End (e.g. Present)"
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                {/* Bullets List */}
                <div className="space-y-2 pt-1 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>Achievement Bullets ({exp.bullets.length})</span>
                    <button
                      onClick={() => addBulletToExperience(expIdx)}
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80">
                      <div className="flex flex-col gap-0.5 pt-0.5 text-slate-400">
                        <button
                          onClick={() => moveBullet(expIdx, bIdx, 'up')}
                          disabled={bIdx === 0}
                          className="hover:text-slate-700 disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveBullet(expIdx, bIdx, 'down')}
                          disabled={bIdx === exp.bullets.length - 1}
                          className="hover:text-slate-700 disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                        className="flex-1 text-xs p-1.5 border border-slate-200 rounded focus:outline-hidden focus:border-indigo-400 font-sans"
                      />

                      <button
                        onClick={() => deleteBullet(expIdx, bIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">
            Professional Executive Summary
          </label>
          <textarea
            rows={5}
            value={version.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-400 leading-relaxed font-sans bg-white"
            placeholder="Write a clear summary highlighting your technical strengths and target role..."
          />
          <p className="text-[11px] text-slate-500">
            Tip: Mentioning your target role explicitly in the summary improves the ATS Role Alignment metric.
          </p>
        </div>
      )}

      {/* SECTION: SKILLS */}
      {activeTab === 'skills' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Technical Competencies ({version.skills.length})
            </span>
            <span className="text-[11px] text-slate-500">Click tag to toggle Demonstrated vs Claimed</span>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {version.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{skill.name}</span>
                  <button
                    onClick={() => toggleSkillType(skill.id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                      skill.type === 'demonstrated'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {skill.type}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500">{skill.proficiency}%</span>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <input
              type="text"
              id="newSkillInput"
              placeholder="Add skill (e.g. Kubernetes, Triton, LangChain)..."
              className="flex-1 text-xs p-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-400 bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSkill(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const el = document.getElementById('newSkillInput') as HTMLInputElement;
                if (el) {
                  addSkill(el.value);
                  el.value = '';
                }
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* SECTION: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Demonstrated Projects ({version.projects.length})
            </span>
            <button
              onClick={addProject}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {version.projects.map((proj, pIdx) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const newP = [...version.projects];
                      newP[pIdx].title = e.target.value;
                      newP[pIdx].name = e.target.value;
                      updateField('projects', newP);
                    }}
                    placeholder="Project Title"
                    className="text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg flex-1"
                  />
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => {
                    const newP = [...version.projects];
                    newP[pIdx].description = e.target.value;
                    updateField('projects', newP);
                  }}
                  placeholder="Project description and quantifiable technical evidence..."
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                />

                <input
                  type="text"
                  value={proj.tech?.join(', ') || ''}
                  onChange={(e) => {
                    const newP = [...version.projects];
                    newP[pIdx].tech = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                    updateField('projects', newP);
                  }}
                  placeholder="Technologies used (comma separated: Python, Docker, PyTorch)"
                  className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: CONTACT */}
      {activeTab === 'contact' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={version.contact.fullName}
                onChange={(e) =>
                  updateField('contact', { ...version.contact, fullName: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Email</label>
              <input
                type="text"
                value={version.contact.email}
                onChange={(e) =>
                  updateField('contact', { ...version.contact, email: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Phone</label>
              <input
                type="text"
                value={version.contact.phone}
                onChange={(e) =>
                  updateField('contact', { ...version.contact, phone: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                value={version.contact.location}
                onChange={(e) =>
                  updateField('contact', { ...version.contact, location: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={version.contact.linkedin}
                onChange={(e) =>
                  updateField('contact', { ...version.contact, linkedin: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">GitHub Profile</label>
              <input
                type="text"
                value={version.contact.github}
                onChange={(e) =>
                  updateField('contact', { ...version.contact, github: e.target.value })
                }
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION: EDUCATION */}
      {activeTab === 'education' && (
        <div className="space-y-3">
          {version.education.map((edu, edIdx) => (
            <div key={edu.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEd = [...version.education];
                    newEd[edIdx].degree = e.target.value;
                    updateField('education', newEd);
                  }}
                  placeholder="Degree"
                  className="p-1.5 bg-white border border-slate-200 rounded"
                />
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => {
                    const newEd = [...version.education];
                    newEd[edIdx].school = e.target.value;
                    updateField('education', newEd);
                  }}
                  placeholder="Institution"
                  className="p-1.5 bg-white border border-slate-200 rounded"
                />
              </div>
              <input
                type="text"
                value={edu.year}
                onChange={(e) => {
                  const newEd = [...version.education];
                  newEd[edIdx].year = e.target.value;
                  updateField('education', newEd);
                }}
                placeholder="Graduation Year"
                className="p-1.5 bg-white border border-slate-200 rounded w-32"
              />
            </div>
          ))}
        </div>
      )}

      {/* SECTION: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <div className="space-y-3">
          {version.certifications.map((cert, cIdx) => (
            <div key={cert.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
              <input
                type="text"
                value={cert.name}
                onChange={(e) => {
                  const newC = [...version.certifications];
                  newC[cIdx].name = e.target.value;
                  updateField('certifications', newC);
                }}
                placeholder="Certification Name"
                className="w-full p-1.5 bg-white border border-slate-200 rounded font-semibold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => {
                    const newC = [...version.certifications];
                    newC[cIdx].issuer = e.target.value;
                    updateField('certifications', newC);
                  }}
                  placeholder="Issuer (e.g. AWS, Coursera)"
                  className="p-1.5 bg-white border border-slate-200 rounded"
                />
                <input
                  type="text"
                  value={cert.year}
                  onChange={(e) => {
                    const newC = [...version.certifications];
                    newC[cIdx].year = e.target.value;
                    updateField('certifications', newC);
                  }}
                  placeholder="Year"
                  className="p-1.5 bg-white border border-slate-200 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-3">
          {version.achievements.map((ach, aIdx) => (
            <div key={ach.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
              <input
                type="text"
                value={ach.title}
                onChange={(e) => {
                  const newA = [...version.achievements];
                  newA[aIdx].title = e.target.value;
                  updateField('achievements', newA);
                }}
                placeholder="Achievement Title"
                className="w-full p-1.5 bg-white border border-slate-200 rounded font-bold"
              />
              <textarea
                rows={2}
                value={ach.description}
                onChange={(e) => {
                  const newA = [...version.achievements];
                  newA[aIdx].description = e.target.value;
                  updateField('achievements', newA);
                }}
                placeholder="Description of tangible milestone..."
                className="w-full p-1.5 bg-white border border-slate-200 rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
