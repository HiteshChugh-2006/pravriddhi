import React, { useState } from 'react';
import { SkillTrend, UserProfile } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { TrendIndicator } from '../common/TrendIndicator';
import { MetricCard } from '../common/MetricCard';
import {
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Info,
  ChevronRight
} from 'lucide-react';

interface SkillIntelligenceViewProps {
  trends: SkillTrend[];
  profile: UserProfile;
  onSelectSkillForSim: (skillName: string) => void;
}

export const SkillIntelligenceView: React.FC<SkillIntelligenceViewProps> = ({
  trends,
  profile,
  onSelectSkillForSim
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillTrend | null>(trends[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredTrends = trends.filter((trend) => {
    const matchesSearch =
      trend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.relatedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      trend.relatedRoles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || trend.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Real-Time Workforce Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Skill Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze shifting industry skill velocities, salary premiums, and interconnected cluster demand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Updated with 2026 Market Index</span>
          </div>
        </div>
      </div>

      {/* Top Telemetry Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tracked Skill Nodes"
          value="1,420+"
          subtext="Active in production job postings"
          trend={{ value: 'Real-time', neutral: true }}
          icon={<Layers className="w-4 h-4 text-indigo-600" />}
        />
        <MetricCard
          label="Peak Growth Velocity"
          value="+142%"
          subtext="LLM Engineering & vLLM Serving"
          trend={{ value: '↑↑↑ Surging', positive: true }}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          label="Median Specialized Comp"
          value="$215,000"
          subtext="Across RAG & MLOps positions"
          trend={{ value: '+$34k vs 2024', positive: true }}
          icon={<Sparkles className="w-4 h-4 text-amber-600" />}
        />
        <MetricCard
          label="CareerTwin Synergy"
          value="6/8 Nodes"
          subtext="Matches high-growth cluster"
          trend={{ value: 'Strong Alignment', positive: true }}
          icon={<ShieldCheck className="w-4 h-4 text-cyan-600" />}
        />
      </div>

      {/* Main Layout: Skill Network Visualization + Detailed Selected Skill Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Skill Relationship Network Graph (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-white/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Skill Relationship Ecosystem
                </h3>
                <p className="text-xs text-slate-500">
                  Click any node to inspect market demand and your alignment
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Interactive Graph
              </span>
            </div>

            {/* Custom Interactive SVG Constellation */}
            <div className="relative w-full h-[360px] bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden my-4">
              <svg className="w-full h-full" viewBox="0 0 700 360">
                {/* SVG Defs for Gradients */}
                <defs>
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Connection Lines */}
                <line x1="350" y1="180" x2="200" y2="100" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="350" y1="180" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="350" y1="180" x2="200" y2="270" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="350" y1="180" x2="500" y2="270" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="200" y1="100" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="500" y1="100" x2="500" y2="270" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="200" y1="270" x2="350" y2="330" stroke="#cbd5e1" strokeWidth="1" />

                {/* Center Node: Python (Foundational Core) */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name === 'Python') || trends[0])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="350"
                    cy="180"
                    r="44"
                    fill={selectedSkill?.name === 'Python' ? '#4f46e5' : '#ffffff'}
                    stroke="#6366f1"
                    strokeWidth="3"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="350"
                    y="176"
                    textAnchor="middle"
                    fill={selectedSkill?.name === 'Python' ? '#ffffff' : '#0f172a'}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Python
                  </text>
                  <text
                    x="350"
                    y="192"
                    textAnchor="middle"
                    fill={selectedSkill?.name === 'Python' ? '#e0e7ff' : '#64748b'}
                    fontSize="10"
                    fontWeight="500"
                  >
                    Core · 91%
                  </text>
                </g>

                {/* Node 1: LLM Engineering */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name === 'LLM Engineering') || trends[0])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="200"
                    cy="100"
                    r="38"
                    fill={selectedSkill?.name === 'LLM Engineering' ? '#4f46e5' : '#ffffff'}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="200"
                    y="96"
                    textAnchor="middle"
                    fill={selectedSkill?.name === 'LLM Engineering' ? '#ffffff' : '#0f172a'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    LLM Eng
                  </text>
                  <text
                    x="200"
                    y="112"
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    ↑↑↑ +142%
                  </text>
                </g>

                {/* Node 2: RAG & Retrieval */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name.includes('RAG')) || trends[1])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="500"
                    cy="100"
                    r="38"
                    fill={selectedSkill?.name.includes('RAG') ? '#4f46e5' : '#ffffff'}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="500"
                    y="96"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('RAG') ? '#ffffff' : '#0f172a'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    RAG
                  </text>
                  <text
                    x="500"
                    y="112"
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    ↑↑↑ +118%
                  </text>
                </g>

                {/* Node 3: MLOps */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name.includes('MLOps')) || trends[3])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="200"
                    cy="270"
                    r="38"
                    fill={selectedSkill?.name.includes('MLOps') ? '#4f46e5' : '#ffffff'}
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="200"
                    y="266"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('MLOps') ? '#ffffff' : '#0f172a'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    MLOps
                  </text>
                  <text
                    x="200"
                    y="282"
                    textAnchor="middle"
                    fill="#d97706"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    ↑↑ Priority
                  </text>
                </g>

                {/* Node 4: Containerization & K8s */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name.includes('Containerization')) || trends[6])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="500"
                    cy="270"
                    r="38"
                    fill={selectedSkill?.name.includes('Containerization') ? '#4f46e5' : '#ffffff'}
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="500"
                    y="266"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('Containerization') ? '#ffffff' : '#0f172a'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    Docker/K8s
                  </text>
                  <text
                    x="500"
                    y="282"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('Containerization') ? '#e0e7ff' : '#64748b'}
                    fontSize="10"
                    fontWeight="500"
                  >
                    Infra
                  </text>
                </g>

                {/* Node 5: AI Agents */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name.includes('Agents')) || trends[2])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="350"
                    cy="45"
                    r="34"
                    fill={selectedSkill?.name.includes('Agents') ? '#4f46e5' : '#ffffff'}
                    stroke="#10b981"
                    strokeWidth="2"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="350"
                    y="43"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('Agents') ? '#ffffff' : '#0f172a'}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    AI Agents
                  </text>
                  <text
                    x="350"
                    y="57"
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    ↑↑ +89%
                  </text>
                </g>

                {/* Node 6: SQL & Data */}
                <g
                  onClick={() => setSelectedSkill(trends.find((t) => t.name.includes('SQL')) || trends[7])}
                  className="cursor-pointer group"
                >
                  <circle
                    cx="350"
                    cy="325"
                    r="32"
                    fill={selectedSkill?.name.includes('SQL') ? '#4f46e5' : '#ffffff'}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    className="transition-all duration-200 group-hover:scale-105"
                  />
                  <text
                    x="350"
                    y="323"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('SQL') ? '#ffffff' : '#0f172a'}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    SQL & Data
                  </text>
                  <text
                    x="350"
                    y="336"
                    textAnchor="middle"
                    fill={selectedSkill?.name.includes('SQL') ? '#e0e7ff' : '#64748b'}
                    fontSize="9"
                    fontWeight="500"
                  >
                    84% Verified
                  </text>
                </g>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Surging Demand</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Priority Career Gap</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Demonstrated Core</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Selected Skill Intelligence Panel (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedSkill ? (
            <div className="glass-card rounded-2xl p-6 border border-white/80 space-y-5">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-600 block">
                      {selectedSkill.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Market Signal</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {selectedSkill.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <TrendIndicator value={selectedSkill.growthRate} arrows={selectedSkill.arrows} />
                  <span className="text-[10px] text-slate-400 block mt-0.5">YoY Velocity</span>
                </div>
              </div>

              {/* Demand & Compensation Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Demand Index
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {selectedSkill.demandIndex}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Avg Market Salary
                  </span>
                  <span className="text-lg font-bold font-mono text-indigo-700">
                    {selectedSkill.avgSalary}
                  </span>
                </div>
              </div>

              {/* User Twin Alignment Status */}
              <div className="p-3.5 rounded-xl border bg-white border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Your CareerTwin Status</span>
                  {selectedSkill.userProficiency !== null ? (
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedSkill.userProficiency}% Demonstrated
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">Unclaimed Gap</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {selectedSkill.marketSummary}
                </p>
              </div>

              {/* Related Roles */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">
                  Top Associated Roles
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.relatedRoles.map((role) => (
                    <span
                      key={role}
                      className="text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Skills */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">
                  Connected Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.relatedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-xs text-indigo-800 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectSkillForSim(selectedSkill.name)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Simulate Adding {selectedSkill.name}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 glass-card rounded-2xl">
              Select a skill from the ecosystem graph or table to view intelligence.
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Trends Table (Solid White per prompt instruction for dense tables) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Workforce Skill Demand Index (2026 Telemetry)
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by job opening volume and employer salary velocity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Emerging Tech">Emerging Tech</option>
              <option value="Core AI/ML">Core AI/ML</option>
              <option value="Software & Infrastructure">Software & Infrastructure</option>
              <option value="Data & Analytics">Data & Analytics</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Skill Name</th>
                <th className="py-3 px-4">Growth Velocity</th>
                <th className="py-3 px-4">Demand Index</th>
                <th className="py-3 px-4">Active Openings</th>
                <th className="py-3 px-4">Avg Target Comp</th>
                <th className="py-3 px-4">CareerTwin Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrends.map((trend) => (
                <tr
                  key={trend.id}
                  onClick={() => setSelectedSkill(trend)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    selectedSkill?.id === trend.id ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 block">{trend.name}</span>
                    <span className="text-[11px] text-slate-500">{trend.category}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <TrendIndicator value={trend.growthRate} arrows={trend.arrows} />
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${trend.demandIndex}%` }}
                        />
                      </div>
                      <span>{trend.demandIndex}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                    {trend.activeJobCount.toLocaleString()} roles
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-slate-900">
                    {trend.avgSalary}
                  </td>
                  <td className="py-3.5 px-4">
                    {trend.userProficiency !== null ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{trend.userProficiency}%</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-medium">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSkillForSim(trend.name);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      Simulate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
