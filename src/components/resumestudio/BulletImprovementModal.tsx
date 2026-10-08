import React, { useState } from 'react';
import { BulletImprovement } from '../../types/resume';
import {
  Sparkles,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface BulletImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  improvements: BulletImprovement[];
  onApplyImprovements: (applied: BulletImprovement[]) => void;
}

export const BulletImprovementModal: React.FC<BulletImprovementModalProps> = ({
  isOpen,
  onClose,
  improvements: initialList,
  onApplyImprovements
}) => {
  const [improvements, setImprovements] = useState<BulletImprovement[]>(initialList);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleAccept = (id: string) => {
    setImprovements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, accepted: !item.accepted } : item
      )
    );
  };

  const handleUpdateText = (id: string, text: string) => {
    setImprovements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, improved: text } : item))
    );
  };

  const handleAcceptAll = () => {
    const allAccepted = improvements.map((item) => ({ ...item, accepted: true }));
    setImprovements(allAccepted);
    onApplyImprovements(allAccepted);
    onClose();
  };

  const handleApplySelected = () => {
    onApplyImprovements(improvements.filter((i) => i.accepted));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Evidence-Based Bullet Point Reframer
              </h3>
              <p className="text-xs text-slate-500">
                STAR methodology upgrades with technical precision. Zero fabricated statistics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ethical Non-Fabrication Notice */}
        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Truthful AI Commitment:</strong> Reframing strengthens action verbs, domain technologies, and STAR structuring. It never fabricates false performance multipliers or unearned achievements.
          </span>
        </div>

        {/* Improvements List */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {improvements.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No improvements suggested. Your bullet points currently exhibit strong technical precision!
            </div>
          ) : (
            improvements.map((item) => {
              const isAccepted = item.accepted ?? true;
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isAccepted
                      ? 'bg-indigo-50/30 border-indigo-200/90'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {item.methodology} Framework · Action: {item.actionVerb}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAccept(item.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          isAccepted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAccepted ? 'Accepted' : 'Keep Original'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Original vs Improved */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Original */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Original Bullet
                      </span>
                      <p className="text-slate-600 leading-relaxed italic">
                        "{item.original}"
                      </p>
                    </div>

                    {/* Improved */}
                    <div className="p-3 rounded-xl bg-white border border-indigo-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          AI Improved (STAR)
                        </span>
                        <button
                          onClick={() => setEditingId(isEditing ? null : item.id)}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{isEditing ? 'Done' : 'Edit'}</span>
                        </button>
                      </div>

                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={item.improved}
                          onChange={(e) => handleUpdateText(item.id, e.target.value)}
                          className="w-full text-xs p-2 border border-indigo-300 rounded-lg focus:outline-hidden"
                        />
                      ) : (
                        <p className="text-slate-900 leading-relaxed font-medium">
                          "{item.improved}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Why it is better */}
                  <div className="p-2.5 rounded-xl bg-white/60 border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">Why this is better:</span>
                    <span>{item.whyBetter}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-medium"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Accept All ({improvements.length})
            </button>
            <button
              onClick={handleApplySelected}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Apply Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
