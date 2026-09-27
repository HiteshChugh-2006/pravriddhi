import React, { useState } from 'react';
import { AuthUser, UserProfile } from '../../types';
import { UserResumeRecord } from '../../types/resume';
import { Terminal, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface DebugResumePanelProps {
  authUser: AuthUser | null;
  profile: UserProfile;
  activeResume: UserResumeRecord | null;
}

export const DebugResumePanel: React.FC<DebugResumePanelProps> = ({
  authUser,
  profile,
  activeResume
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const userId = authUser?.uid || profile.id || 'usr_guest';
  const activeResumeId = profile.activeResumeId || activeResume?.id || (profile.hasUploadedResume ? 'res_active' : 'None');
  const filename = profile.uploadedResumeName || activeResume?.fileName || (profile.hasUploadedResume ? 'uploaded_resume' : 'No file uploaded');
  const source = profile.hasUploadedResume ? 'USER UPLOAD' : 'NONE (Awaiting Upload)';
  const status = profile.hasUploadedResume ? 'PARSED & SYNCED' : 'AWAITING UPLOAD';
  const timestamp = activeResume?.uploadedAt ? new Date(activeResume.uploadedAt).toLocaleTimeString() : (profile.hasUploadedResume ? 'Active Session' : 'N/A');
  const twinSource = profile.hasUploadedResume ? activeResumeId : 'N/A';

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs select-none no-print">
      {isOpen ? (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-2xl border border-slate-700/80 w-80 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>Resume Data Flow Debugger</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
              title="Minimize debug panel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Authenticated User:</span>
              <span className="text-indigo-300 font-semibold truncate block" title={userId}>{userId}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Active Resume ID:</span>
              <span className="text-amber-300 font-semibold truncate block" title={activeResumeId}>{activeResumeId}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Uploaded Filename:</span>
              <span className="text-white font-semibold truncate block" title={filename}>{filename}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Resume Source:</span>
                <span className={`font-semibold ${profile.hasUploadedResume ? 'text-emerald-400' : 'text-slate-400'}`}>{source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Extraction Status:</span>
                <span className={`font-semibold ${profile.hasUploadedResume ? 'text-emerald-400' : 'text-amber-400'}`}>{status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Extraction Time:</span>
                <span className="text-slate-300">{timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Twin Source ID:</span>
                <span className="text-indigo-300 truncate block" title={twinSource}>{twinSource}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Skills: {profile.skills.length}</span>
              <span>Experience: {profile.experience.length}</span>
              <span>Projects: {profile.projects.length}</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700/80 hover:bg-slate-900 transition-all text-xs"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px]">Debug Pipeline</span>
          {profile.hasUploadedResume ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active resume loaded" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="No resume uploaded" />
          )}
        </button>
      )}
    </div>
  );
};
