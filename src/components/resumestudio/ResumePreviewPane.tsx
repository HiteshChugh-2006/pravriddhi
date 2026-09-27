import React, { useState } from 'react';
import { ResumeVersion } from '../../types/resume';
import {
  Printer,
  Copy,
  Check,
  Eye,
  FileCheck,
  ShieldCheck,
  Download
} from 'lucide-react';

interface ResumePreviewPaneProps {
  version: ResumeVersion;
  targetRole: string;
  matchedKeywords: string[];
}

export const ResumePreviewPane: React.FC<ResumePreviewPaneProps> = ({
  version,
  targetRole,
  matchedKeywords
}) => {
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [copied, setCopied] = useState(false);

  // Helper to render text with optional highlighted keywords
  const renderHighlightedText = (text: string) => {
    if (!highlightKeywords || matchedKeywords.length === 0) return text;
    // Create regex matching any matched keyword
    const pattern = new RegExp(
      `\\b(${matchedKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
      'gi'
    );
    const parts = text.split(pattern);
    return parts.map((part, i) => {
      const isMatch = matchedKeywords.some(
        (kw) => kw.toLowerCase() === part.toLowerCase()
      );
      if (isMatch) {
        return (
          <span
            key={i}
            className="bg-emerald-100 text-emerald-950 font-semibold px-1 py-0.5 rounded-sm print:bg-transparent print:text-inherit"
            title="Matched Target Keyword"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleCopyMarkdown = () => {
    const text = `# ${version.contact.fullName}
${version.contact.location} | ${version.contact.email} | ${version.contact.phone}
LinkedIn: ${version.contact.linkedin} | GitHub: ${version.contact.github}

Target Role: ${targetRole}

## Professional Summary
${version.summary}

## Core Technical Competencies
Demonstrated: ${version.skills.filter((s) => s.type === 'demonstrated').map((s) => s.name).join(', ')}
Tools & Infrastructure: ${version.skills.filter((s) => s.type === 'claimed').map((s) => s.name).join(', ')}

## Professional Experience
${version.experience
  .map(
    (exp) => `### ${exp.title} | ${exp.company}
${exp.startDate || exp.period} - ${exp.endDate || ''} | ${exp.location || ''}
${exp.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## Demonstrated Projects
${version.projects
  .map(
    (p) => `### ${p.title}
${p.description}
Technologies: ${p.tech?.join(', ')}`
  )
  .join('\n\n')}

## Education
${version.education.map((e) => `- ${e.degree}, ${e.school} (${e.year})`).join('\n')}

## Certifications
${version.certifications.map((c) => `- ${c.name} (${c.issuer}, ${c.year})`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-3">
      {/* Preview Action Toolbar */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live ATS Preview</span>
          </span>
          <button
            onClick={() => setHighlightKeywords(!highlightKeywords)}
            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
              highlightKeywords
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {highlightKeywords ? '✓ Keywords Highlighted' : 'Highlight Keywords'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Text / MD'}</span>
          </button>
        </div>
      </div>

      {/* Standard ATS Printable White Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 font-sans text-slate-900 space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Contact Header */}
        <div className="text-center pb-4 border-b border-slate-200 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {version.contact.fullName || 'Candidate Name'}
          </h1>
          <p className="text-xs text-slate-600">
            {version.contact.location} · {version.contact.email} · {version.contact.phone}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            {version.contact.linkedin} · {version.contact.github}
          </p>
          <p className="text-xs font-semibold text-indigo-700 pt-1">
            Target Alignment: {targetRole}
          </p>
        </div>

        {/* Professional Summary */}
        {version.summary && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {renderHighlightedText(version.summary)}
            </p>
          </div>
        )}

        {/* Technical Competencies */}
        {version.skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Technical Competencies
            </h2>
            <div className="text-xs text-slate-700 space-y-1">
              <p>
                <strong>Demonstrated Production Competencies:</strong>{' '}
                {version.skills
                  .filter((s) => s.type === 'demonstrated')
                  .map((s) => (
                    <span key={s.id} className="mr-1">
                      {renderHighlightedText(s.name)},
                    </span>
                  ))}
              </p>
              {version.skills.some((s) => s.type === 'claimed') && (
                <p>
                  <strong>Infrastructure & Tools:</strong>{' '}
                  {version.skills
                    .filter((s) => s.type === 'claimed')
                    .map((s) => (
                      <span key={s.id} className="mr-1">
                        {renderHighlightedText(s.name)},
                      </span>
                    ))}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {version.experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Professional Experience
            </h2>
            {version.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">
                    {exp.title} — {exp.company}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {exp.startDate || exp.period} – {exp.endDate || ''} | {exp.location}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1 leading-relaxed">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{renderHighlightedText(b)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Demonstrated Projects */}
        {version.projects.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Demonstrated Projects & Artifacts
            </h2>
            {version.projects.map((proj) => (
              <div key={proj.id} className="text-xs space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.title}</span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    Tech: {proj.tech?.join(', ')}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {renderHighlightedText(proj.description)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education & Credentials */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Education & Certifications
          </h2>
          <div className="text-xs text-slate-700 space-y-1">
            {version.education.map((edu) => (
              <p key={edu.id}>
                <strong>{edu.degree}</strong>, {edu.school} ({edu.year})
              </p>
            ))}
            {version.certifications.length > 0 && (
              <p>
                <strong>Certifications:</strong>{' '}
                {version.certifications.map((c) => `${c.name} (${c.issuer}, ${c.year})`).join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* Achievements & Leadership */}
        {(version.achievements.length > 0 || version.leadership.length > 0) && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              Achievements & Leadership
            </h2>
            <div className="text-xs text-slate-700 space-y-1">
              {version.achievements.map((ach) => (
                <p key={ach.id}>
                  <strong>{ach.title}</strong>: {ach.description}
                </p>
              ))}
              {version.leadership.map((l) => (
                <p key={l.id}>
                  <strong>{l.role}</strong> ({l.organization}, {l.period}): {l.description}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
