import React, { useState } from 'react';
import { ResumeVersion } from '../../types/resume';
import {
  Copy,
  Trash2,
  Edit3,
  Plus,
  Check,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ResumeVersionManagerProps {
  versions: ResumeVersion[];
  activeVersionId: string;
  onSelectVersion: (versionId: string) => void;
  onDuplicateVersion: (versionId: string) => void;
  onRenameVersion: (versionId: string, newTitle: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onCreateNewVersion: () => void;
}

export const ResumeVersionManager: React.FC<ResumeVersionManagerProps> = ({
  versions,
  activeVersionId,
  onSelectVersion,
  onDuplicateVersion,
  onRenameVersion,
  onDeleteVersion,
  onCreateNewVersion
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (v: ResumeVersion) => {
    setEditingId(v.id);
    setEditTitle(v.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameVersion(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3 no-print">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Resume Version Control ({versions.length})
          </span>
        </div>
        <button
          onClick={onCreateNewVersion}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Version</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {versions.map((v) => {
          const isActive = v.id === activeVersionId;
          const isEditing = editingId === v.id;

          return (
            <div
              key={v.id}
              onClick={() => onSelectVersion(v.id)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                isActive
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(v.id)}
                      className="text-xs font-bold p-1 bg-white border border-slate-300 rounded w-full"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(v.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-900 truncate block flex-1">
                    {v.title}
                  </span>
                )}

                {v.isOriginalUpload && (
                  <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded shrink-0">
                    Original
                  </span>
                )}
                {v.isAiOptimized && (
                  <span className="text-[9px] font-bold uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded shrink-0">
                    AI-Optimized
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">Role: {v.targetRole || 'ML Engineer'}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{v.lastUpdated}</span>
              </div>

              {/* Version Card Controls */}
              <div
                className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartRename(v)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                    title="Rename Version"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDuplicateVersion(v.id)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                    title="Duplicate as New Version"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                {versions.length > 1 && !v.isOriginalUpload && (
                  <button
                    onClick={() => onDeleteVersion(v.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    title="Delete Version"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
