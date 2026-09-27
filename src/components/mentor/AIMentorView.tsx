import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, MentorMessage, JobOpportunity, MentorSession } from '../../types';
import { askGeminiCareerMentor } from '../../services/aiService';
import { LiveWebBadge } from '../common/LiveWebBadge';
import { SourceCard } from '../common/SourceCard';
import { SkillChip } from '../common/SkillChip';
import {
  Sparkles,
  Send,
  User,
  ArrowRight,
  ShieldCheck,
  Target,
  Cpu,
  Compass,
  Briefcase,
  Plus,
  MessageSquare,
  Globe,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Printer
} from 'lucide-react';
import { RoadmapSummaryModal } from './RoadmapSummaryModal';
import { CareerTwinReportModal } from './CareerTwinReportModal';
import { FileCheck, Download } from 'lucide-react';

interface AIMentorViewProps {
  profile: UserProfile;
  recentJob?: JobOpportunity | null;
  activeSimulationSkills?: string[];
  initialPrompt?: string;
  onNavigateTab: (tab: string) => void;
}

export const AIMentorView: React.FC<AIMentorViewProps> = ({
  profile,
  recentJob,
  activeSimulationSkills = ['Docker & Containerization', 'MLOps (MLflow & CI/CD)'],
  initialPrompt,
  onNavigateTab
}) => {
  // Saved Sessions / History (Left Column)
  const [sessions, setSessions] = useState<MentorSession[]>([
    {
      id: 'sess_1',
      title: 'ML Engineer Readiness & Gaps',
      lastUpdated: '10 mins ago',
      messages: [
        {
          id: 'msg_welcome',
          sender: 'assistant',
          content: `Hello ${profile.name.split(' ')[0]}. I'm your CareerTwin Advisor. I have loaded your 9 verified skills, your 72% alignment toward ${profile.targetRole}, and live 2026 hiring telemetry. What would you like to plan today?`,
          timestamp: 'Just now',
          suggestedPrompts: [
            'Why am I not ready for ML Engineer?',
            'What should I learn next?',
            'Show me my biggest skill gaps.',
            'What happens if I learn MLOps?',
            'Create a 90-day roadmap for my target role.',
            'What skills are currently emerging in AI?'
          ]
        }
      ]
    },
    {
      id: 'sess_2',
      title: '90-Day Transition to AI Systems',
      lastUpdated: 'Yesterday',
      messages: [
        {
          id: 'msg_hist_1',
          sender: 'user',
          content: 'What skills should I prioritize to reach 85%+ alignment?',
          timestamp: 'Yesterday'
        },
        {
          id: 'msg_hist_2',
          sender: 'assistant',
          content: 'Prioritize Docker containerization followed by MLOps tracking pipelines. This bridges your two largest interview risks with verified project evidence.',
          timestamp: 'Yesterday'
        }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('sess_1');
  const [inputValue, setInputValue] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalMode, setReportModalMode] = useState<'generate' | 'preview' | 'download'>('preview');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleCreateNewSession = () => {
    const newSession: MentorSession = {
      id: `sess_${Date.now()}`,
      title: 'New Strategy Session',
      lastUpdated: 'Just now',
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          content: `New session started for ${profile.targetRole} trajectory. Ask any question about your profile, market criteria, or skill simulations.`,
          timestamp: 'Just now',
          suggestedPrompts: [
            'Why am I not ready for ML Engineer?',
            'Create a 90-day roadmap for my target role.',
            'What happens if I learn MLOps?',
            'Which career path fits my current profile?'
          ]
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: MentorMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session state with user message
    const updatedMessages = [...messages, userMsg];
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: updatedMessages, lastUpdated: 'Just now' }
          : s
      )
    );
    setInputValue('');
    setIsLoading(true);

    try {
      const assistantMsg = await askGeminiCareerMentor(
        textToSend,
        updatedMessages,
        profile,
        recentJob,
        activeSimulationSkills
      );

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...updatedMessages, assistantMsg] }
            : s
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Context-Aware Gemini Career Mentor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            AI Career Mentor Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in your CareerTwin, target role benchmarks, and real-time Google Search workforce signals.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setReportModalMode('download');
              setIsReportModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CareerTwin Report</span>
          </button>

          <button
            onClick={() => {
              setReportModalMode('preview');
              setIsReportModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview Report</span>
          </button>

          <LiveWebBadge label="Gemini + Live Web" />
        </div>
      </div>

      {/* 3-Column Studio Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================
            LEFT COLUMN (25% / 3 Cols): Conversation History
            ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-white/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sessions History
              </span>
              <button
                onClick={handleCreateNewSession}
                className="p-1 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-colors"
                title="New Session"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleCreateNewSession}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Conversation</span>
            </button>

            {/* List of Previous Sessions */}
            <div className="space-y-1.5 pt-1">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block pl-5">
                      {s.lastUpdated}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            CENTER COLUMN (50% / 6 Cols): Premium Conversation Stream
            ============================================================ */}
        <div className="lg:col-span-6 flex flex-col h-[700px] glass-card rounded-3xl border border-white/80 overflow-hidden shadow-xs">
          
          {/* Header of Active Chat */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 truncate">
                {activeSession.title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm font-semibold">
              Gemini 3.5 Flash
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-indigo-600 text-white shadow-2xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white font-medium shadow-xs'
                        : 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Skill chips if structured in response */}
                    {msg.structuredSkills && !isUser && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Identified Competency Vectors
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.structuredSkills.matched.map((m) => (
                            <SkillChip key={m} name={m} status="matched" />
                          ))}
                          {msg.structuredSkills.developing.map((d) => (
                            <SkillChip key={d} name={d} status="developing" />
                          ))}
                          {msg.structuredSkills.missing.map((mis) => (
                            <SkillChip key={mis} name={mis} status="missing" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Source Citations when Google Search was used */}
                    {msg.citations && msg.citations.length > 0 && !isUser && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                          <Globe className="w-3.5 h-3.5" />
                          <span>Google Search Citations:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.citations.map((c, i) => (
                            <SourceCard key={i} source={c} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline CareerTwin Report Action Card */}
                    {!isUser && (msg.content.includes('Roadmap') || msg.content.includes('roadmap') || msg.content.includes('Report') || msg.content.includes('report') || msg.content.includes('gap')) && (
                      <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/90 via-violet-50/70 to-blue-50/80 border border-indigo-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Official CareerTwin Intelligence Report</span>
                          </div>
                          <span className="text-[11px] text-slate-600 block">
                            Includes gaps analysis, What-If simulation delta, and database-backed 90-day learning roadmap.
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setReportModalMode('preview');
                              setIsReportModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors shadow-2xs"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              setReportModalMode('download');
                              setIsReportModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action link if available */}
                    {msg.actionLink && !isUser && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => onNavigateTab(msg.actionLink!.tab)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                        >
                          <span>{msg.actionLink.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Suggested Question Chips on first message */}
                    {msg.suggestedPrompts && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                          Suggested Strategic Inquiries
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedPrompts.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => handleSendMessage(prompt)}
                              className="text-left text-xs bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 rounded-lg px-2.5 py-1.5 transition-colors font-medium"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-[10px] mt-2 ${
                        isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 italic">
                  Analyzing CareerTwin telemetry, job criteria & Google Search signals...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200/80 bg-white/70">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about readiness, skill gaps, roadmaps, or market demand..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN (25% / 3 Cols): "Career Context" Panel
            ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-white/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Career Context
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                Live Model
              </span>
            </div>

            {/* Target Role & Current Alignment */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Target Role</span>
              <p className="text-base font-bold text-slate-900">{profile.targetRole}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-indigo-700">{profile.targetRoleAlignment}% Alignment</span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-mono">+{profile.alignmentTrend}% 30d</span>
              </div>
            </div>

            {/* Top Skills */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Top Demonstrated Skills
              </span>
              <div className="flex flex-wrap gap-1">
                {profile.skills
                  .filter((s) => s.type === 'demonstrated')
                  .slice(0, 4)
                  .map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold"
                    >
                      {s.name} ({s.proficiency}%)
                    </span>
                  ))}
              </div>
            </div>

            {/* Priority Skill Gaps */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Priority Skill Gaps
              </span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px]">
                  Docker & Containers
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px]">
                  MLOps CI/CD
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px]">
                  Kubernetes
                </span>
              </div>
            </div>

            {/* Recent Job Match context */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Recent Inspected Job
              </span>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block truncate">
                  {recentJob ? `${recentJob.company} — ${recentJob.role}` : 'Stripe — Machine Learning Engineer'}
                </span>
                <span className="text-[11px] text-indigo-700 font-mono font-semibold">
                  {recentJob ? `${recentJob.matchScore}% Match` : '86% Match Compatibility'}
                </span>
              </div>
            </div>

            {/* Contextual Quick Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Contextual Quick Actions
              </span>
              
              <div className="space-y-1.5">
                {/* Primary CareerTwin Report Action Button */}
                <button
                  onClick={() => {
                    setReportModalMode('preview');
                    setIsReportModalOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-between shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                    <span>Download CareerTwin Report</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
                </button>

                {/* Secondary 90-Day Roadmap Summary */}
                <button
                  onClick={() => setIsRoadmapModalOpen(true)}
                  className="w-full text-left p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200 text-xs font-semibold text-indigo-950 transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span>90-Day Roadmap Document</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                </button>

                <button
                  onClick={() => handleSendMessage('Analyze my skill gap for ML Engineer')}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-800 transition-colors flex items-center justify-between"
                >
                  <span>Analyze My Skill Gap</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleSendMessage('Build a 90-day roadmap for my target role')}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-800 transition-colors flex items-center justify-between"
                >
                  <span>Build 90-Day Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleSendMessage('Why did my recent job match receive an 86% score?')}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-800 transition-colors flex items-center justify-between"
                >
                  <span>Explain My Job Match</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateTab('careerpaths')}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-800 transition-colors flex items-center justify-between"
                >
                  <span>Explore Career Paths</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateTab('simulator')}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-800 transition-colors flex items-center justify-between"
                >
                  <span>Run What-If Simulation</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigateTab('workforce')}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-800 transition-colors flex items-center justify-between"
                >
                  <span>Find Emerging Skills (Live Web)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Downloadable 90-Day Roadmap & Gaps PDF Modal */}
      <RoadmapSummaryModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        profile={profile}
        simulationSkills={activeSimulationSkills}
      />

      {/* Official Database-Backed CareerTwin PDF Report Modal */}
      <CareerTwinReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        simulationSkills={activeSimulationSkills}
        initialMode={reportModalMode}
      />
    </div>
  );
};
