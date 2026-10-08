/**
 * PravriddhiLandingPage
 *
 * Faithfully reproduces the Lovable landing page design (with its 3 responsive layouts)
 * integrated with the existing Firebase auth system.
 *
 * Desktop: Two-column layout — hero text left, CareerMap animation right
 * Tablet:  Stack layout — hero full-width, CareerMap animation below
 * Mobile:  Hero full-width, then MobileStory vertical timeline
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, Mail, X } from 'lucide-react';
import { CareerMapLanding } from './CareerMapLanding';
import { MobileStoryLanding } from './MobileStoryLanding';
import { HowItWorksLanding } from './HowItWorksLanding';
import { authService } from '../../services/firebaseAuth';
import type { AuthUser } from '../../types';

const PRIMARY = '#5b4cf5';
const VIOLET = '#7c3aed';
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Auth Modal ───────────────────────────────────────────────────────────────

interface AuthModalProps {
  open: boolean;
  mode: 'signup' | 'signin';
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  onStartOnboarding: () => void;
  onCheckUserStatus: (user: AuthUser) => 'onboarding' | 'dashboard';
}

function LovableAuthModal({ open, mode, onClose, onSuccess, onStartOnboarding, onCheckUserStatus }: AuthModalProps) {
  const [step, setStep] = useState<'choose' | 'email' | 'password'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    if (!open) {
      setStep('choose');
      setEmail('');
      setPassword('');
      setName('');
      setError('');
    }
    setCurrentMode(mode);
  }, [open, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.signInWithGoogle();
      const dest = onCheckUserStatus(user);
      onSuccess(user);
      if (dest === 'onboarding') onStartOnboarding();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (currentMode === 'signup') {
        const user = await authService.signUpWithEmail(name, email, password);
        const dest = onCheckUserStatus(user);
        onSuccess(user);
        if (dest === 'onboarding') onStartOnboarding();
        onClose();
      } else {
        const user = await authService.signInWithEmail(email, password);
        const dest = onCheckUserStatus(user);
        onSuccess(user);
        if (dest === 'onboarding') onStartOnboarding();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.2)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            style={{
              position: 'relative', width: '100%', maxWidth: 448,
              overflow: 'hidden', borderRadius: 24,
              border: '1px solid #e5e7eb', background: 'white', padding: 32,
              boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)',
            }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/* canvas gradient top */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 0, height: 160,
              background: 'radial-gradient(120% 80% at 50% 0%, oklch(0.96 0.025 270) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />

            {/* close */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', right: 16, top: 16,
                borderRadius: '50%', padding: 8,
                color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={16} />
            </button>

            <div style={{ position: 'relative' }}>
              {/* YOU orb */}
              <div style={{
                margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 48, borderRadius: '50%',
                border: '1px solid #e5e7eb', background: 'white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>YOU</span>
              </div>

              <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#111827' }}>
                {currentMode === 'signup' ? 'Start your journey.' : 'Welcome back.'}
              </h2>
              <p style={{ marginTop: 8, textAlign: 'center', fontSize: 14, color: '#9ca3af' }}>
                Your skills. Your direction. Your next move.
              </p>

              {error && (
                <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 'choose' ? (
                  <motion.div key="choose" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button
                      onClick={handleGoogle}
                      disabled={loading}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        height: 48, width: '100%', borderRadius: 12,
                        border: '1px solid #e5e7eb', background: 'white',
                        fontSize: 14, fontWeight: 500, color: '#111827',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
                      }}
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                    <button
                      onClick={() => setStep('email')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        height: 48, width: '100%', borderRadius: 12,
                        background: '#111827', border: 'none',
                        fontSize: 14, fontWeight: 500, color: 'white',
                        cursor: 'pointer', transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      <Mail size={16} /> Continue with Email
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="email-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}
                    onSubmit={handleEmailContinue}
                  >
                    {currentMode === 'signup' && (
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoFocus
                        style={inputStyle}
                      />
                    )}
                    <input
                      type="email"
                      required
                      autoFocus={currentMode === 'signin'}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                    />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      style={inputStyle}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        height: 48, width: '100%', borderRadius: 12, border: 'none',
                        background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`,
                        fontSize: 14, fontWeight: 500, color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.8 : 1, transition: 'opacity 0.2s',
                      }}
                    >
                      {loading ? 'Please wait…' : 'Continue →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('choose')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        paddingTop: 4, fontSize: 12, color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer',
                      }}
                    >
                      <ArrowLeft size={12} /> Other options
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: '#9ca3af' }}>
                {currentMode === 'signup' ? 'Already have an account? ' : 'New here? '}
                <button
                  onClick={() => setCurrentMode(m => m === 'signup' ? 'signin' : 'signup')}
                  style={{ fontWeight: 500, color: PRIMARY, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {currentMode === 'signup' ? 'Sign in' : 'Create an account'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputStyle: React.CSSProperties = {
  height: 48, width: '100%', borderRadius: 12,
  border: '1px solid #d1d5db', background: 'white',
  padding: '0 16px', fontSize: 14, color: '#111827',
  outline: 'none', transition: 'all 0.2s',
  boxSizing: 'border-box',
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} aria-hidden>
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.3-4.7 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

interface PravriddhiLandingPageProps {
  onGetStarted: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  onStartOnboarding: () => void;
  onCheckUserStatus: (user: AuthUser) => 'onboarding' | 'dashboard';
}

export function PravriddhiLandingPage({ onGetStarted, onAuthSuccess, onStartOnboarding, onCheckUserStatus }: PravriddhiLandingPageProps) {
  const [modal, setModal] = useState<null | 'signup' | 'signin'>(null);
  const [playToken, setPlayToken] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: 'oklch(0.985 0.003 280)', fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes pravriddhi-flow { to { stroke-dashoffset: -24; } }
        @keyframes pravriddhi-pulse { 0%,100% { transform: scale(1); opacity: .5 } 50% { transform: scale(1.35); opacity: 0 } }
        .pravriddhi-landing * { box-sizing: border-box; }
        .pravriddhi-landing input:focus {
          border-color: ${PRIMARY} !important;
          box-shadow: 0 0 0 4px ${PRIMARY}18 !important;
        }
        /* Desktop: 2-col grid */
        @media (min-width: 1024px) {
          .landing-hero-grid {
            display: grid !important;
            grid-template-columns: minmax(0, 5fr) minmax(0, 8fr) !important;
            align-items: center !important;
            gap: 40px !important;
          }
          .career-map-wrap { display: block !important; }
          .mobile-story-wrap { display: none !important; }
          .hero-heading { font-size: 60px !important; }
        }
        /* Tablet: 768–1023px → full-width stacked */
        @media (min-width: 768px) and (max-width: 1023px) {
          .landing-hero-grid {
            display: block !important;
          }
          .career-map-wrap { display: block !important; margin-top: 32px !important; }
          .mobile-story-wrap { display: none !important; }
          .hero-heading { font-size: 56px !important; }
        }
        /* Mobile: < 768px → hero + MobileStory */
        @media (max-width: 767px) {
          .career-map-wrap { display: none !important; }
          .mobile-story-wrap { display: block !important; }
          .hero-heading { font-size: 40px !important; }
          .how-line { display: none !important; }
        }
        @media (min-width: 768px) {
          .how-line { display: block !important; }
        }
      `}</style>

      <div className="pravriddhi-landing">
        {/* ── NAV ── */}
        <header style={{
          maxWidth: 1152, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 24px',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.28em', color: '#111827', fontFamily: 'inherit' }}>
            PRAVRIDDHI
          </span>
          <button
            onClick={() => setModal('signin')}
            style={{ fontSize: 14, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            Sign In
          </button>
        </header>

        {/* ── HERO ── */}
        <section style={{ position: 'relative' }}>
          {/* canvas gradient */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(120% 80% at 50% 0%, oklch(0.96 0.025 270) 0%, transparent 60%)',
          }} />

          <div
            className="landing-hero-grid"
            style={{
              position: 'relative',
              maxWidth: 1152, margin: '0 auto',
              padding: '32px 24px 80px',
              display: 'block', // overridden by media queries
            }}
          >
            {/* Left: Hero text */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="hero-heading"
                style={{
                  fontSize: 48, fontWeight: 600, lineHeight: 1.02,
                  letterSpacing: '-0.02em', color: '#111827', margin: 0,
                }}
              >
                Build your next{' '}
                <em style={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontWeight: 400, fontStyle: 'italic',
                  background: `linear-gradient(135deg, ${PRIMARY}, ${VIOLET})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  chapter.
                </em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                style={{ marginTop: 20, maxWidth: 448, fontSize: 18, lineHeight: 1.6, color: '#6b7280' }}
              >
                Understand what you know, discover where you can go, and see what to learn next.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}
              >
                <button
                  onClick={() => setModal('signup')}
                  style={{
                    height: 48, borderRadius: 999, background: '#111827', border: 'none',
                    padding: '0 24px', fontSize: 14, fontWeight: 500, color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  Get Started →
                </button>
                <button
                  onClick={() => setModal('signin')}
                  style={{
                    height: 48, borderRadius: 999,
                    border: '1px solid #e5e7eb', background: 'white',
                    padding: '0 24px', fontSize: 14, fontWeight: 500, color: '#111827',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${PRIMARY}60`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                >
                  Sign In
                </button>
              </motion.div>

              <p style={{ marginTop: 32, fontFamily: 'monospace', fontSize: 12, color: '#9ca3af' }}>
                <span style={{ color: PRIMARY }}>Your skills.</span>{' '}
                <span style={{ color: VIOLET }}>Your direction.</span>{' '}
                <span style={{ color: '#6b7280' }}>Your next move.</span>
              </p>
            </div>

            {/* Right: Desktop/Tablet CareerMap */}
            <motion.div
              className="career-map-wrap"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
              style={{
                display: 'none', // default; shown via media query
                borderRadius: 32, border: '1px solid #e5e7eb',
                background: 'rgba(255,255,255,0.7)', padding: 8,
                boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 24px 48px -16px rgba(90,80,200,0.22)',
              }}
            >
              <div style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: 26, border: '1px solid rgba(229,231,235,0.6)',
                background: 'oklch(0.985 0.003 280)',
                backgroundImage: 'radial-gradient(circle, rgba(17,24,39,0.09) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}>
                <CareerMapLanding playToken={playToken} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 4px' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Illustrative example · hover or tap any node</span>
                <button
                  onClick={() => setPlayToken((t) => t + 1)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    borderRadius: 999, border: '1px solid #e5e7eb', background: 'white',
                    padding: '6px 12px', fontSize: 12, fontWeight: 500, color: '#111827',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${PRIMARY}60`; e.currentTarget.style.color = PRIMARY; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#111827'; }}
                >
                  <Play size={12} /> Explore the journey
                </button>
              </div>
            </motion.div>

            {/* Mobile: Timeline story */}
            <div className="mobile-story-wrap" style={{ display: 'none', marginTop: 48 }}>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#9ca3af' }}>
                  Illustrative Journey
                </span>
              </div>
              <MobileStoryLanding />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <HowItWorksLanding />

        {/* ── CTA SECTION ── */}
        <section style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px 96px' }}>
          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: 32,
            border: '1px solid #e5e7eb', background: 'white',
            padding: '56px 32px', textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(120% 80% at 50% 0%, oklch(0.96 0.025 270) 0%, transparent 60%)',
            }} />
            <h2 style={{ position: 'relative', fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: '#111827' }}>
              Watch your career story come to life.
            </h2>
            <button
              onClick={() => setModal('signup')}
              style={{
                position: 'relative', marginTop: 24,
                height: 48, borderRadius: 999, background: '#111827', border: 'none',
                padding: '0 24px', fontSize: 14, fontWeight: 500, color: 'white',
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              Get Started →
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          maxWidth: 1152, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          padding: '0 24px 40px',
          fontSize: 12, color: '#9ca3af',
        }}>
          <span style={{ letterSpacing: '0.24em' }}>PRAVRIDDHI</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      {/* ── AUTH MODAL ── */}
      <LovableAuthModal
        open={modal !== null}
        mode={modal ?? 'signup'}
        onClose={() => setModal(null)}
        onSuccess={(user) => { onAuthSuccess(user); setModal(null); }}
        onStartOnboarding={() => { setModal(null); onStartOnboarding(); }}
        onCheckUserStatus={onCheckUserStatus}
      />
    </div>
  );
}
