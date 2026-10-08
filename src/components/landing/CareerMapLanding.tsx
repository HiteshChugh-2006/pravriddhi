import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Coordinate space: x 0–100, y 0–75 (4:3). */
type Pos = { x: number; y: number; s?: number };
type Kind = 'you' | 'skill' | 'exp' | 'career' | 'gap' | 'opp' | 'cluster';
type NodeDef = {
  id: string;
  label: string;
  kind: Kind;
  secondary?: boolean;
  info?: string;
  meta?: string;
  at: (Pos | null)[];
};

export const PHASES = [
  { key: 'discover', title: 'Discover', label: 'Understand what you already know' },
  { key: 'connect', title: 'Connect', label: 'Connect your skills and experience' },
  { key: 'direction', title: 'Direction', label: 'Explore where your skills can take you' },
  { key: 'gap', title: 'Skill gap', label: 'See what you need to learn next' },
  { key: 'opportunities', title: 'Opportunities', label: 'Turn your direction into opportunities' },
] as const;

const PHASE_MS = 3000;

const NODES: NodeDef[] = [
  { id: 'you', label: 'YOU', kind: 'you', at: [{ x: 50, y: 37.5 }, { x: 50, y: 37.5, s: 1.08 }, { x: 30, y: 37.5 }, { x: 22, y: 37.5, s: 0.88 }, { x: 11, y: 37.5, s: 0.78 }] },
  { id: 'python', label: 'Python', kind: 'skill', info: 'Used in 2 projects · strongest signal', at: [{ x: 25, y: 13 }, { x: 19, y: 19 }, { x: 11, y: 20 }, { x: 41, y: 20 }, null] },
  { id: 'sql', label: 'SQL', kind: 'skill', secondary: true, info: 'Querying & analysis', at: [{ x: 13, y: 36 }, { x: 10, y: 31 }, { x: 7, y: 37.5 }, null, null] },
  { id: 'ml', label: 'Machine Learning', kind: 'skill', info: 'Coursework + capstone project', at: [{ x: 22, y: 61 }, { x: 22, y: 58 }, { x: 12, y: 55 }, { x: 41, y: 55 }, null] },
  { id: 'react', label: 'React', kind: 'skill', info: 'Frontend development', at: [{ x: 76, y: 13 }, { x: 80, y: 19 }, { x: 31, y: 12 }, null, null] },
  { id: 'projects', label: 'Projects', kind: 'exp', info: 'Churn predictor · Portfolio site', at: [{ x: 50, y: 7 }, { x: 72, y: 54 }, { x: 31, y: 63 }, null, null] },
  { id: 'internship', label: 'Internship', kind: 'exp', info: '6 months · data team', at: [{ x: 87, y: 37 }, { x: 87, y: 59 }, null, null, null] },
  { id: 'education', label: 'Education', kind: 'exp', secondary: true, info: 'B.Tech, Computer Science', at: [{ x: 77, y: 62 }, { x: 74, y: 67 }, null, null, null] },
  { id: 'c-data', label: 'Data', kind: 'cluster', at: [null, { x: 11, y: 11 }, null, null, null] },
  { id: 'c-ai', label: 'AI / ML', kind: 'cluster', at: [null, { x: 22, y: 67 }, null, null, null] },
  { id: 'c-dev', label: 'Development', kind: 'cluster', at: [null, { x: 82, y: 11 }, null, null, null] },
  { id: 'c-exp', label: 'Experience', kind: 'cluster', at: [null, { x: 82, y: 47 }, null, null, null] },
  { id: 'da', label: 'Data Analyst', kind: 'career', meta: '68%', info: 'Close fit — SQL & Python carry over', at: [null, null, { x: 66, y: 15 }, null, null] },
  { id: 'mle', label: 'ML Engineer', kind: 'career', meta: '74%', info: 'Requires Python, ML, Docker, PyTorch, Cloud, MLOps', at: [null, null, { x: 70, y: 37.5, s: 1.08 }, { x: 60, y: 37.5, s: 1.12 }, null] },
  { id: 'swe', label: 'Software Engineer', kind: 'career', meta: '61%', info: 'React + projects are a strong start', at: [null, null, { x: 66, y: 60 }, null, null] },
  { id: 'docker', label: 'Docker', kind: 'gap', info: 'Package and ship models reliably. ~3 weeks to working knowledge.', at: [null, null, null, { x: 79, y: 13 }, null] },
  { id: 'pytorch', label: 'PyTorch', kind: 'gap', info: 'Train and fine-tune deep learning models.', at: [null, null, null, { x: 90, y: 30 }, null] },
  { id: 'cloud', label: 'Cloud', kind: 'gap', info: 'Deploy and scale on managed infrastructure.', at: [null, null, null, { x: 90, y: 46 }, null] },
  { id: 'mlops', label: 'MLOps', kind: 'gap', info: 'Monitor, version and retrain models in production.', at: [null, null, null, { x: 79, y: 63 }, null] },
  { id: 'o1', label: 'ML Engineer', kind: 'opp', meta: 'Remote|4', at: [null, null, null, null, { x: 37, y: 20 }] },
  { id: 'o2', label: 'Data Scientist', kind: 'opp', meta: 'Hybrid|3', at: [null, null, null, null, { x: 60, y: 46 }] },
  { id: 'o3', label: 'Software Engineer', kind: 'opp', meta: 'On-site|5', at: [null, null, null, null, { x: 83, y: 22 }] },
];

type EdgeDef = { a: string; b: string; phases: number[]; style?: 'strong' | 'weak' | 'dashed' };
const EDGES: EdgeDef[] = [
  ...['python', 'sql', 'ml', 'react', 'projects', 'internship', 'education'].map((id) => ({ a: id, b: 'you', phases: [0, 1] })),
  { a: 'python', b: 'sql', phases: [1], style: 'weak' },
  { a: 'python', b: 'ml', phases: [1], style: 'weak' },
  { a: 'react', b: 'projects', phases: [1], style: 'weak' },
  { a: 'projects', b: 'internship', phases: [1], style: 'weak' },
  { a: 'python', b: 'projects', phases: [1], style: 'weak' },
  ...['python', 'sql', 'ml', 'react', 'projects'].map((id) => ({ a: id, b: 'you', phases: [2], style: 'weak' as const })),
  { a: 'you', b: 'mle', phases: [2, 3], style: 'strong' },
  { a: 'you', b: 'da', phases: [2] },
  { a: 'you', b: 'swe', phases: [2] },
  { a: 'python', b: 'da', phases: [], style: 'weak' },
  { a: 'react', b: 'swe', phases: [], style: 'weak' },
  { a: 'you', b: 'python', phases: [3], style: 'weak' },
  { a: 'you', b: 'ml', phases: [3], style: 'weak' },
  { a: 'python', b: 'mle', phases: [3], style: 'strong' },
  { a: 'ml', b: 'mle', phases: [3], style: 'strong' },
  ...['docker', 'pytorch', 'cloud', 'mlops'].map((id) => ({ a: 'mle', b: id, phases: [3], style: 'dashed' as const })),
  ...['o1', 'o2', 'o3'].map((id) => ({ a: 'you', b: id, phases: [4] })),
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const N = (id: string) => byId[id]!;

function curve(p: Pos, q: Pos) {
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const k = 0.12;
  return `M ${p.x} ${p.y} Q ${mx - dy * k} ${my + dx * k} ${q.x} ${q.y}`;
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const PRIMARY = '#5b4cf5'; // indigo/violet brand color matching Lovable design
const VIOLET = '#7c3aed';
const MUTED = '#9ca3af';

export function CareerMapLanding({ playToken }: { playToken: number }) {
  const [phase, setPhase] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hover ?? pinned;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playToken > 0) {
      setPhase(0);
      setPinned(null);
    }
  }, [playToken]);

  useEffect(() => {
    if (active) return;
    timer.current = setTimeout(
      () => setPhase((p) => (p + 1) % PHASES.length),
      phase === 4 ? PHASE_MS + 1200 : PHASE_MS
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phase, active, playToken]);

  const visibleEdges = EDGES.filter((e) => e.phases.includes(phase) && N(e.a).at[phase] && N(e.b).at[phase]);

  const related = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    for (const e of visibleEdges) {
      if (e.a === active) set.add(e.b);
      if (e.b === active) set.add(e.a);
    }
    const extra: Record<string, string[]> = {
      python: ['projects', 'ml', 'sql', 'mle', 'da'],
      mle: ['python', 'ml', 'docker', 'pytorch', 'cloud', 'mlops'],
      react: ['projects', 'swe'],
    };
    extra[active]?.forEach((x) => set.add(x));
    return set;
  }, [active, visibleEdges]);

  const activeNode = active ? N(active) : null;

  return (
    <div
      className="relative select-none"
      style={{ aspectRatio: '4/3', width: '100%' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setPinned(null);
      }}
    >
      {/* edges */}
      <svg viewBox="0 0 100 75" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="edge-strong-pravriddhi" x1="0" x2="1">
            <stop offset="0%" stopColor={PRIMARY} />
            <stop offset="100%" stopColor={VIOLET} />
          </linearGradient>
        </defs>
        {EDGES.map((e, i) => {
          const pa = N(e.a).at[phase];
          const pb = N(e.b).at[phase];
          const on = visibleEdges.includes(e);
          const lit = related && related.has(e.a) && related.has(e.b) && (e.a === active || e.b === active || (related.has(e.a) && related.has(e.b)));
          const dim = related && !lit;
          const secondary = N(e.a).secondary || N(e.b).secondary;
          const p = pa ?? N(e.a).at.find(Boolean)!;
          const q = pb ?? N(e.b).at.find(Boolean)!;
          const d = curve(p, q);
          const stroke = e.style === 'strong' || lit ? 'url(#edge-strong-pravriddhi)' : MUTED;
          return (
            <g key={i} style={secondary ? { display: 'none' } : undefined} className={cn(!secondary && 'lg-inline')}>
              <motion.path
                initial={false}
                animate={{
                  d,
                  opacity: on ? (dim ? 0.12 : e.style === 'weak' ? 0.35 : e.style === 'strong' || lit ? 0.9 : 0.5) : 0,
                }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                fill="none"
                stroke={stroke}
                strokeWidth={e.style === 'strong' || lit ? 1.6 : 0.9}
                strokeDasharray={e.style === 'dashed' ? '3 4' : undefined}
                vectorEffect="non-scaling-stroke"
              />
              {on && (e.style === 'strong' || lit) && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: dim ? 0 : 1, d }}
                  transition={{ duration: 0.9 }}
                  fill="none"
                  stroke="white"
                  strokeWidth={1.2}
                  style={{
                    strokeDasharray: '2 6',
                    animation: 'pravriddhi-flow 1.4s linear infinite',
                  }}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* nodes */}
      {NODES.map((n) => {
        const pos = n.at[phase];
        const last = pos ?? n.at.find(Boolean)!;
        const dim = related ? !related.has(n.id) : false;
        const isActive = active === n.id;
        return (
          <motion.div
            key={n.id}
            style={{
              position: 'absolute',
              zIndex: 10,
              x: '-50%',
              y: '-50%',
              display: n.secondary ? 'none' : undefined,
              pointerEvents: pos ? 'auto' : 'none',
            }}
            initial={false}
            animate={{
              left: `${last.x}%`,
              top: `${(last.y / 75) * 100}%`,
              opacity: pos ? (dim ? 0.28 : 1) : 0,
              scale: pos ? (last.s ?? 1) * (isActive ? 1.08 : 1) : 0.6,
              filter: pos ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: pos ? (NODES.indexOf(n) % 7) * 0.05 : 0 }}
            onMouseEnter={() => pos && setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => pos && setPinned((p) => (p === n.id ? null : n.id))}
          >
            <NodeView node={n} phase={phase} active={isActive} />
          </motion.div>
        );
      })}

      {/* info card */}
      <AnimatePresence>
        {activeNode?.info && (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              width: 'min(22rem, 90%)',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              backgroundColor: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(14px) saturate(1.4)',
              padding: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#9ca3af' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeNode.kind === 'gap' ? 'transparent' : PRIMARY, border: activeNode.kind === 'gap' ? `1px solid ${VIOLET}` : 'none' }} />
              {activeNode.kind === 'gap' ? 'Skill to build' : activeNode.kind === 'career' ? 'Career path' : activeNode.kind === 'exp' ? 'Experience' : 'Skill you have'}
            </div>
            <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600, color: '#111827' }}>{activeNode.label}</div>
            <p style={{ marginTop: 2, fontSize: 13, lineHeight: 1.4, color: '#6b7280' }}>{activeNode.info}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* phase caption */}
      <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 20, pointerEvents: 'none' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: PRIMARY }}>
              0{phase + 1} — {PHASES[phase]!.title.toUpperCase()}
            </div>
            <div style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: '#111827' }}>{PHASES[phase]!.label}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progress dots */}
      <div style={{ position: 'absolute', right: 16, top: 16, zIndex: 20, display: 'flex', gap: 6 }}>
        {PHASES.map((p, i) => (
          <button
            key={p.key}
            aria-label={`Show ${p.title}`}
            onClick={() => { setPinned(null); setPhase(i); }}
            style={{ position: 'relative', height: 4, width: 28, overflow: 'hidden', borderRadius: 999, background: '#e5e7eb', cursor: 'pointer', border: 'none', padding: 0 }}
          >
            {i < phase && <span style={{ position: 'absolute', inset: 0, background: PRIMARY }} />}
            {i === phase && (
              <motion.span
                key={`${phase}-${playToken}-${active ? 'p' : 'r'}`}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: PRIMARY }}
                initial={{ width: '0%' }}
                animate={{ width: active ? '40%' : '100%' }}
                transition={{ duration: active ? 0.3 : (phase === 4 ? PHASE_MS + 1200 : PHASE_MS) / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

const GLYPH: Record<string, string> = { python: 'Py', sql: 'SQL', ml: 'ML', react: 'Re', docker: 'Dk', pytorch: 'PT', cloud: 'Cl', mlops: 'Ops' };

function TechGlyph({ id, gap }: { id: string; gap?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        minWidth: 20,
        borderRadius: '50%',
        padding: '0 4px',
        fontFamily: 'monospace',
        fontSize: 8.5,
        fontWeight: 500,
        background: gap ? 'transparent' : `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`,
        color: gap ? VIOLET : 'white',
        border: gap ? `1px dashed ${VIOLET}60` : 'none',
      }}
    >
      {GLYPH[id] ?? '•'}
    </span>
  );
}

function NodeView({ node, phase, active }: { node: NodeDef; phase: number; active: boolean }) {
  switch (node.kind) {
    case 'you':
      return (
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1px solid ${PRIMARY}40`,
            animation: 'pravriddhi-pulse 2.6s ease-out infinite',
          }} />
          <div style={{
            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: 128, height: 128, borderRadius: '50%',
            border: '1px solid #e5e7eb',
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)',
          }}>
            <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: `1px dashed ${PRIMARY}25` }} />
            <span style={{
              fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
              background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>YOU</span>
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, fontSize: 10, lineHeight: 1.3, color: '#9ca3af' }}>
              <span>Skills</span>
              <span>Projects</span>
              <span>Experience</span>
            </div>
          </div>
        </div>
      );
    case 'skill':
    case 'exp':
      return (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
          borderRadius: 999, border: `1px solid ${active ? PRIMARY : '#e5e7eb'}`,
          background: 'white', padding: '4px 12px 4px 4px',
          fontSize: 12, fontWeight: 500, color: '#111827',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}>
          {node.kind === 'skill' ? <TechGlyph id={node.id} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />}
          {node.label}
          {phase === 3 && <span style={{ marginLeft: 2, fontSize: 10, color: PRIMARY }}>✓</span>}
        </div>
      );
    case 'cluster':
      return (
        <div style={{ whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9ca3af' }}>
          {node.label}
        </div>
      );
    case 'career': {
      const emph = node.id === 'mle';
      const pct = node.meta ? parseInt(node.meta) : 50;
      return (
        <div style={{
          width: 160, borderRadius: 16, border: `1px solid ${active ? PRIMARY : emph ? `${PRIMARY}80` : '#e5e7eb'}`,
          background: 'white', padding: 12,
          boxShadow: emph ? '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)' : '0 1px 2px rgba(0,0,0,0.04)',
          cursor: 'pointer', transition: 'border-color 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9ca3af' }}>Path</span>
            {emph && <span style={{ borderRadius: 999, background: `${PRIMARY}15`, padding: '2px 6px', fontSize: 9, fontWeight: 500, color: PRIMARY }}>Best fit</span>}
          </div>
          <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600, color: emph ? '#111827' : '#111827b3' }}>{node.label}</div>
          <div style={{ marginTop: 8, height: 4, borderRadius: 999, background: '#f3f4f6', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: emph ? `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})` : '#9ca3af60' }} />
          </div>
          <div style={{ marginTop: 4, fontSize: 10, color: '#9ca3af' }}>{node.meta} match</div>
        </div>
      );
    }
    case 'gap':
      return (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
          borderRadius: 999, border: `1px dashed ${active ? VIOLET : `${VIOLET}80`}`,
          background: 'rgba(255,255,255,0.8)', padding: '4px 12px 4px 4px',
          fontSize: 12, fontWeight: 500, color: VIOLET,
          cursor: 'pointer',
        }}>
          <TechGlyph id={node.id} gap />
          {node.label}
        </div>
      );
    case 'opp': {
      const [mode, matched] = (node.meta ?? '|').split('|');
      return (
        <div style={{
          width: 176, borderRadius: 16, border: '1px solid #e5e7eb',
          background: 'white', padding: 14,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ borderRadius: 999, background: '#f3f4f6', padding: '2px 6px', fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9ca3af' }}>EXAMPLE</span>
            <span style={{ fontSize: 10, color: '#9ca3af' }}>{mode}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: '#111827' }}>{node.label}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ height: 6, flex: 1, borderRadius: 999, background: i < Number(matched) ? `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})` : '#f3f4f6' }} />
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: '#9ca3af' }}>Skills matched: {matched}</div>
        </div>
      );
    }
  }
}
