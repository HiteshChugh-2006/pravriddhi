/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { CheckCircle2, ChevronRight, Layers, Sparkles, ExternalLink, Code2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  theme?: 'light' | 'dark';
}

/**
 * Custom robust Markdown & structured text renderer that transforms raw markdown
 * (headings, bold, lists, roadmap milestones, and technical notes) into pristine UI components.
 * Eliminates raw markdown syntax artifacts (**, ##, *, _) completely.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // Helper function to render inline markdown elements (bold, italic, code, links)
  const renderInlineFormatted = (text: string): React.ReactNode => {
    if (!text) return null;

    // Tokens parser regex:
    // 1. Bold: \*\*(.*?)\*\*
    // 2. Italic: \*(.*?)\* or _(.*?)_
    // 3. Code: `(.*?)`
    // 4. Markdown Links: \[(.*?)\]\((.*?)\)
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const inner = part.slice(2, -2);
        return (
          <strong
            key={index}
            className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}
          >
            {inner}
          </strong>
        );
      }

      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        const inner = part.slice(1, -1);
        return (
          <em key={index} className="italic">
            {inner}
          </em>
        );
      }

      // Inline code: `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const inner = part.slice(1, -1);
        return (
          <code
            key={index}
            className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium ${
              isDark
                ? 'bg-indigo-700/60 text-indigo-100'
                : 'bg-slate-100 text-indigo-700 border border-slate-200/80'
            }`}
          >
            {inner}
          </code>
        );
      }

      // Links: [label](url)
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const closingBracket = part.indexOf('](');
        const label = part.slice(1, closingBracket);
        const url = part.slice(closingBracket + 2, -1);
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-0.5 font-medium underline underline-offset-2 ${
              isDark ? 'text-indigo-200 hover:text-white' : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            <span>{label}</span>
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const parsedBlocks = useMemo(() => {
    if (!content) return [];

    const lines = content.split('\n');
    const blocks: {
      type: 'paragraph' | 'heading' | 'list' | 'structured-phase' | 'code-block';
      level?: number;
      title?: string;
      subtitle?: string;
      items?: string[];
      text?: string;
      language?: string;
    }[] = [];

    let currentList: string[] = [];
    let currentPhase: {
      title: string;
      items: string[];
    } | null = null;

    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockContent: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push({
          type: 'list',
          items: [...currentList]
        });
        currentList = [];
      }
    };

    const flushPhase = () => {
      if (currentPhase) {
        blocks.push({
          type: 'structured-phase',
          title: currentPhase.title,
          items: [...currentPhase.items]
        });
        currentPhase = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check Code Block ```
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          blocks.push({
            type: 'code-block',
            language: codeBlockLang,
            text: codeBlockContent.join('\n')
          });
          inCodeBlock = false;
          codeBlockContent = [];
          codeBlockLang = '';
        } else {
          flushList();
          flushPhase();
          inCodeBlock = true;
          codeBlockLang = trimmed.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      if (!trimmed) {
        flushList();
        continue;
      }

      // Structured Phase detection (e.g., "Days 1–30:", "Days 1-30", "Phase 1:", "Month 1:")
      const phaseRegex = /^(?:\*\*|\#\#\s*|\#\#\#\s*)?(Days\s+\d+[\–\-]\d+|Phase\s+\d+|Month\s+\d+)(?:\*\*|:)?(?:\s*[:\-]\s*(.*))?$/i;
      const phaseMatch = trimmed.match(phaseRegex);

      if (phaseMatch) {
        flushList();
        flushPhase();
        const phaseLabel = phaseMatch[1];
        const phaseDetail = phaseMatch[2] ? phaseMatch[2].replace(/\*\*/g, '').trim() : '';
        currentPhase = {
          title: `${phaseLabel}${phaseDetail ? ` · ${phaseDetail}` : ''}`,
          items: []
        };
        continue;
      }

      // Headings (###, ##, #)
      if (trimmed.startsWith('### ')) {
        flushList();
        flushPhase();
        blocks.push({
          type: 'heading',
          level: 3,
          text: trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '')
        });
        continue;
      }

      if (trimmed.startsWith('## ')) {
        flushList();
        flushPhase();
        blocks.push({
          type: 'heading',
          level: 2,
          text: trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '')
        });
        continue;
      }

      if (trimmed.startsWith('# ')) {
        flushList();
        flushPhase();
        blocks.push({
          type: 'heading',
          level: 1,
          text: trimmed.replace(/^#\s+/, '').replace(/\*\*/g, '')
        });
        continue;
      }

      // Bullet List item (- or * or •)
      const listMatch = trimmed.match(/^[\*\-\•]\s+(.*)$/);
      if (listMatch) {
        const itemText = listMatch[1];
        if (currentPhase) {
          currentPhase.items.push(itemText);
        } else {
          currentList.push(itemText);
        }
        continue;
      }

      // Numbered List item (1. 2. etc)
      const numMatch = trimmed.match(/^\d+[\.\)]\s+(.*)$/);
      if (numMatch) {
        const itemText = numMatch[1];
        if (currentPhase) {
          currentPhase.items.push(itemText);
        } else {
          currentList.push(itemText);
        }
        continue;
      }

      // Standard paragraph line
      if (currentPhase) {
        currentPhase.items.push(trimmed);
      } else {
        flushList();
        blocks.push({
          type: 'paragraph',
          text: trimmed
        });
      }
    }

    flushList();
    flushPhase();

    return blocks;
  }, [content]);

  return (
    <div className={`space-y-3 ${className}`}>
      {parsedBlocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <h2
                key={index}
                className={`text-base sm:text-lg font-bold tracking-tight mt-3 mb-1.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {renderInlineFormatted(block.text || '')}
              </h2>
            );
          }
          if (block.level === 2) {
            return (
              <h3
                key={index}
                className={`text-sm sm:text-base font-bold tracking-tight mt-2.5 mb-1 ${
                  isDark ? 'text-indigo-200' : 'text-indigo-900'
                }`}
              >
                {renderInlineFormatted(block.text || '')}
              </h3>
            );
          }
          return (
            <h4
              key={index}
              className={`text-xs sm:text-sm font-semibold mt-2 mb-1 ${
                isDark ? 'text-indigo-300' : 'text-slate-800'
              }`}
            >
              {renderInlineFormatted(block.text || '')}
            </h4>
          );
        }

        if (block.type === 'structured-phase') {
          return (
            <div
              key={index}
              className={`p-3.5 rounded-xl border my-2 transition-all ${
                isDark
                  ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-50'
                  : 'bg-indigo-50/70 border-indigo-200/80 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-indigo-200/50">
                <Layers className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-indigo-950'}`}>
                  {block.title}
                </span>
              </div>
              {block.items && block.items.length > 0 && (
                <ul className="space-y-1.5">
                  {block.items.map((item, itIdx) => (
                    <li key={itIdx} className="flex items-start gap-2 text-xs">
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <div className="flex-1">{renderInlineFormatted(item)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="space-y-1.5 pl-0.5">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      isDark ? 'bg-indigo-300' : 'bg-indigo-600'
                    }`}
                  />
                  <div className="flex-1">{renderInlineFormatted(item)}</div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'code-block') {
          return (
            <div
              key={index}
              className="my-2.5 rounded-xl bg-slate-900 text-slate-100 p-3 overflow-x-auto text-xs font-mono border border-slate-800"
            >
              {block.language && (
                <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">
                  {block.language}
                </div>
              )}
              <pre className="whitespace-pre">{block.text}</pre>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p
            key={index}
            className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-white/90' : 'text-slate-700'
            }`}
          >
            {renderInlineFormatted(block.text || '')}
          </p>
        );
      })}
    </div>
  );
};
