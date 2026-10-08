import { motion } from 'framer-motion';

const PRIMARY = '#5b4cf5';
const VIOLET = '#7c3aed';

const STEPS = [
  { k: 'You', label: '01 · YOU', t: 'Understand what you already know', chips: ['Skills', 'Projects', 'Experience'] },
  { k: 'Skills', label: '02 · SKILLS', t: 'Connect your skills and experience', chips: ['Python', 'SQL', 'Machine Learning', 'React'] },
  { k: 'Career', label: '03 · CAREER', t: 'Explore where your skills can take you', chips: ['ML Engineer', 'Data Analyst', 'Software Engineer'], emph: 0 },
  { k: 'Skill gap', label: '04 · SKILL GAP', t: 'See what you need to learn next', chips: ['Docker', 'PyTorch', 'Cloud', 'MLOps'], dashed: true },
  { k: 'Next step', label: '05 · NEXT STEP', t: 'Start with Docker — about 3 weeks', chips: ['Week 1–3'] },
  { k: 'Opportunities', label: '06 · OPPORTUNITIES', t: 'Turn your direction into opportunities', chips: ['ML Engineer · Remote · 4 matched'], example: true },
];

const GLYPH: Record<string, string> = { Python: 'Py', SQL: 'SQL', 'Machine Learning': 'ML', React: 'Re', Docker: 'Dk', PyTorch: 'PT', Cloud: 'Cl', MLOps: 'Ops' };

export function MobileStoryLanding() {
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      {/* vertical line */}
      <div style={{
        position: 'absolute', top: 16, bottom: 16, left: 7, width: 1,
        background: `linear-gradient(to bottom, ${PRIMARY}, ${VIOLET}, transparent)`,
      }} />

      {STEPS.map((s, i) => (
        <motion.div
          key={s.k}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', marginBottom: 16 }}
        >
          {/* dot */}
          <span style={{
            position: 'absolute', left: -24, top: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 14, height: 14, borderRadius: '50%',
            border: `1px solid ${PRIMARY}`, background: 'white',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIMARY }} />
          </span>

          <div style={{
            borderRadius: 16, border: '1px solid #e5e7eb',
            background: 'white', padding: 16,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: PRIMARY }}>
                {s.label}
              </span>
              {s.example && (
                <span style={{ borderRadius: 999, background: '#f3f4f6', padding: '2px 6px', fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase', color: '#9ca3af' }}>
                  Example
                </span>
              )}
            </div>
            <p style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: '#111827' }}>{s.t}</p>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {s.chips.map((c, j) => (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + j * 0.08 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    padding: '4px 10px',
                    fontSize: 12,
                    ...(s.dashed
                      ? { border: `1px dashed ${VIOLET}60`, color: VIOLET, background: 'transparent' }
                      : s.emph === j
                        ? { background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`, color: 'white', border: 'none' }
                        : { border: '1px solid #e5e7eb', background: 'white', color: '#111827' }),
                  }}
                >
                  {GLYPH[c] && (
                    <span style={{
                      marginRight: 6,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 16, height: 16, borderRadius: '50%', padding: '0 3px',
                      fontFamily: 'monospace', fontSize: 8,
                      ...(s.dashed
                        ? { border: `1px dashed ${VIOLET}60`, color: VIOLET }
                        : { background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`, color: 'white' }),
                    }}>
                      {GLYPH[c]}
                    </span>
                  )}
                  {c}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
