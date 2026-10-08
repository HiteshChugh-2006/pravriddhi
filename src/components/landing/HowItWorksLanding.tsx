import { motion } from 'framer-motion';
import { Compass, Layers, Route, Sparkles, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const PRIMARY = '#5b4cf5';
const VIOLET = '#7c3aed';

const STEPS: { n: string; t: string; d: string; Icon: LucideIcon }[] = [
  { n: '01', t: 'Tell us about you', d: 'Your background, in a few minutes.', Icon: UserRound },
  { n: '02', t: 'Show us what you know', d: 'Skills, projects and experience, mapped.', Icon: Layers },
  { n: '03', t: 'Choose where you want to go', d: 'Compare paths that fit you.', Icon: Compass },
  { n: '04', t: 'Discover what to learn', d: 'The exact gaps between you and the role.', Icon: Route },
  { n: '05', t: 'Find opportunities', d: 'Roles that match where you\'re headed.', Icon: Sparkles },
];

export function HowItWorksLanding() {
  return (
    <section style={{ maxWidth: 1152, margin: '0 auto', padding: '112px 24px' }}>
      <div style={{ maxWidth: 448 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.18em', color: PRIMARY }}>
          How it works
        </span>
        <h2 style={{ marginTop: 12, fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: '#111827', lineHeight: 1.2 }}>
          Five steps from{' '}
          <em style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 400, fontStyle: 'italic', color: '#111827' }}>here</em>{' '}
          to next.
        </h2>
      </div>

      <div style={{ position: 'relative', marginTop: 64, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {/* connecting line */}
        <motion.div
          style={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`,
            position: 'absolute', left: 0, top: 24, height: 1,
            right: '10%', transformOrigin: 'left',
            display: 'none',
          }}
          className="how-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {STEPS.map(({ n, t, d, Icon }, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}
          >
            <motion.div
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 48, borderRadius: 16,
                border: '1px solid #e5e7eb', background: 'white',
                color: PRIMARY,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
              initial={{ scale: 0.7 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ borderColor: `${PRIMARY}60` }}
              transition={{ delay: i * 0.18 + 0.2, type: 'spring', stiffness: 260, damping: 18 }}
            >
              <Icon size={20} strokeWidth={1.6} />
            </motion.div>
            <div style={{ marginTop: 20, fontFamily: 'monospace', fontSize: 12, color: '#9ca3af' }}>{n}</div>
            <div style={{ marginTop: 4, fontWeight: 500, color: '#111827', fontSize: 14 }}>{t}</div>
            <p style={{ marginTop: 4, fontSize: 14, color: '#6b7280' }}>{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
