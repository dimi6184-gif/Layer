'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, ReactNode } from 'react';

/* ─── Brand ─────────────────────────────────────────────────── */
const TEAL = '#1FA7BB';
const TEAL_DIM = 'rgba(31,167,187,0.12)';
const BG = '#0a0a0f';
const CARD = '#111116';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#F5F4F5';
const MUTED = 'rgba(255,255,255,0.42)';

/* ─── Intersection-Observer fade-in hook ────────────────────── */
function useAppear(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, vis };
}

/* ─── Fade wrapper ───────────────────────────────────────────── */
function Fade({
  children, delay = 0, y = 24, x = 0,
}: {
  children: ReactNode; delay?: number; y?: number; x?: number;
}) {
  const { ref, vis } = useAppear();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translate(0,0)' : `translate(${x}px,${y}px)`,
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 40px',
      background: scrolled ? 'rgba(10,10,15,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
      transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 40 }}>
        <Image src="/logo.png" alt="Layer" width={24} height={24} style={{ objectFit: 'contain' }} />
        <span style={{ color: TEXT, fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Layer</span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
        {([['Features', '#features'], ['How it Works', '#how'], ['Pricing', '/premium'], ['FAQ', '#faq'], ['Docs', '/commands']] as [string, string][]).map(([label, href]) => (
          <Link key={href} href={href}
            style={{ color: MUTED, fontSize: 13.5, fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
            {label}
          </Link>
        ))}
      </div>

      {/* Right CTA */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link href="/dashboard"
          style={{ color: MUTED, fontSize: 13.5, fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
          onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
          Sign in
        </Link>
        <InviteBtn />
      </div>
    </nav>
  );
}

/* ─── Invite button ──────────────────────────────────────────── */
function InviteBtn({ large }: { large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href="/invite"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: hov ? '#189AAD' : TEAL,
        color: '#080808', fontWeight: 700,
        fontSize: large ? 15 : 13,
        padding: large ? '13px 28px' : '8px 18px',
        borderRadius: 999, textDecoration: 'none',
        transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? '0 6px 20px rgba(31,167,187,0.32)' : 'none',
        letterSpacing: '-0.01em',
      }}>
      <span style={{ fontWeight: 900, fontSize: large ? 17 : 14 }}>+</span>
      Invite to Discord
    </Link>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '100px 40px 80px',
      maxWidth: 1200, margin: '0 auto',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '10%',
        width: 480, height: 480, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(31,167,187,0.1) 0%, transparent 65%)',
      }} />

      {/* LEFT — text */}
      <div style={{ flex: '0 0 52%', maxWidth: 580, position: 'relative', zIndex: 2 }}>
        {/* Badge */}
        <Fade delay={0}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
            borderRadius: 999, padding: '5px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }} />
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Open Source · Always Maintained</span>
          </div>
        </Fade>

        {/* Headline */}
        <Fade delay={0.08}>
          <h1 style={{
            fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1.0,
            color: TEXT, margin: '0 0 6px',
          }}>
            The bot that
          </h1>
        </Fade>
        <Fade delay={0.15}>
          <h1 style={{
            fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1.0,
            color: TEAL, margin: '0 0 28px',
          }}>
            protects servers.
          </h1>
        </Fade>

        <Fade delay={0.22}>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.75, maxWidth: 460, marginBottom: 36 }}>
            Layer is a Discord bot that automatically catches scams, bans evaders,
            routes tickets with AI, and keeps your community clean — with zero data stored.
          </p>
        </Fade>

        <Fade delay={0.3}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28 }}>
            <InviteBtn large />
            <Link href="/commands"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: MUTED, fontSize: 15, fontWeight: 600,
                textDecoration: 'none',
                padding: '12px 24px',
                border: `1px solid ${BORDER}`,
                borderRadius: 999,
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = BORDER; }}>
              Read the Guide
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
            🔓 Open Source · 🔒 Activity Maintained
          </p>
        </Fade>
      </div>

      {/* RIGHT — Discord-style preview panel */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>
        <Fade delay={0.2} y={16}>
          <HeroPanel />
        </Fade>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes hp-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes hp-slide { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes hp-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes hp-scan { 0%{transform:scaleX(0);opacity:0} 40%{opacity:1} 80%{transform:scaleX(1);opacity:1} 100%{opacity:0} }
        @keyframes scroll-bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
      `}</style>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        animation: 'scroll-bounce 1.8s ease-in-out infinite',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>SCROLL</span>
        <div style={{ width: 1, height: 28, background: `linear-gradient(${TEAL}, transparent)` }} />
      </div>
    </section>
  );
}

/* ─── Hero right panel ───────────────────────────────────────── */
function HeroPanel() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(v => (v + 1) % 5), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      width: 340, position: 'relative',
      animation: 'hp-float 4s ease-in-out infinite',
    }}>
      {/* Main Discord-channel card */}
      <div style={{
        background: '#1e1f22', borderRadius: 12,
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* Titlebar */}
        <div style={{
          padding: '10px 14px', background: '#2b2d31',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Image src="/logo.png" alt="Layer" width={18} height={18} style={{ objectFit: 'contain', borderRadius: 4 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Layer</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            Online
          </span>
        </div>

        {/* Messages area */}
        <div style={{ padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180 }}>
          {/* Scam message */}
          <div style={{
            background: step >= 1 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${step >= 1 ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 8, padding: '8px 11px', position: 'relative', overflow: 'hidden',
            transition: 'background 0.4s, border-color 0.4s',
          }}>
            {step === 1 && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, height: 2,
                width: '100%', background: TEAL, transformOrigin: 'left',
                animation: 'hp-scan 1s ease forwards',
              }} />
            )}
            <div style={{ fontSize: 11.5, color: step >= 2 ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.45)' }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', marginRight: 6 }}>ScamUser:</span>
              <span style={{ textDecoration: step >= 2 ? 'line-through' : 'none' }}>
                FREE NITRO!! discord.gift/abc123 limited time!!
              </span>
            </div>
            {step >= 2 && (
              <div style={{ fontSize: 10, color: '#EF4444', marginTop: 4, animation: 'hp-slide 0.3s ease' }}>
                🚨 Phishing link · deleted in 0.3s
              </div>
            )}
          </div>

          {/* Bot reply */}
          {step >= 3 && (
            <div style={{ display: 'flex', gap: 7, animation: 'hp-slide 0.3s ease' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: TEAL_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>🛡</div>
              <div style={{
                background: TEAL_DIM, border: `1px solid rgba(31,167,187,0.2)`,
                borderRadius: '2px 8px 8px 8px', padding: '7px 11px',
                fontSize: 12, color: TEAL, lineHeight: 1.4,
              }}>
                Scam removed — members protected ✓
              </div>
            </div>
          )}

          {/* Normal message appears after cycle */}
          {step === 4 && (
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', animation: 'hp-slide 0.3s ease' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 6 }}>member:</span>
              thanks for the quick protection! 🙏
            </div>
          )}
        </div>

        {/* Stats row at bottom */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '10px 14px', gap: 8,
        }}>
          {[['0.3s', 'Reaction time'], ['98%', 'Accuracy']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating side cards */}
      <div style={{
        position: 'absolute', top: -16, right: -100,
        background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 10, padding: '10px 14px', minWidth: 160,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        animation: 'hp-float 5s ease-in-out infinite',
        animationDelay: '0.8s',
      }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Ban Evasion</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', display: 'inline-block', boxShadow: '0 0 6px #EF4444' }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>Evader caught</span>
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>98% match confidence</div>
      </div>

      <div style={{
        position: 'absolute', bottom: -18, left: -80,
        background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 10, padding: '10px 14px', minWidth: 150,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        animation: 'hp-float 4.5s ease-in-out infinite',
        animationDelay: '1.4s',
      }}>
        <div style={{ fontSize: 10, color: TEAL, fontWeight: 700, marginBottom: 3 }}>🤖 AI Ticket</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>&ldquo;Check #roles first!&rdquo;</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Resolved in 4s</div>
      </div>
    </div>
  );
}

/* ─── Stats bar ──────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { n: '186,345', label: 'Servers Protected' },
    { n: '1,427,040', label: 'Users Scanned' },
    { n: '100%', label: 'Open Source' },
    { n: '24/7', label: 'Always Online' },
  ];
  return (
    <section style={{
      borderTop: `1px solid ${BORDER}`,
      borderBottom: `1px solid ${BORDER}`,
      padding: '36px 40px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}>
        {stats.map((s, i) => (
          <Fade key={s.label} delay={i * 0.07}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: TEAL_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15,
              }}>
                {['🛡', '👁', '🔓', '⚡'][i]}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: TEXT, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
}

/* ─── Why Choose Layer — 4-col feature cards ────────────────── */
function WhyChoose() {
  const cards = [
    {
      icon: '🚨',
      title: 'AI Scam Detection',
      desc: 'Reads text inside images with OCR. Catches phishing links, fake giveaways, and fraud before any member sees it.',
    },
    {
      icon: '🔁',
      title: 'Ban Evasion Tracking',
      desc: 'Detects banned users creating new accounts through behavioral pattern matching. Auto-bans the evader on rejoin.',
    },
    {
      icon: '🎫',
      title: 'AI Ticket Routing',
      desc: 'Scans the ticket context, answers common questions automatically, and hands off to staff only when needed.',
    },
    {
      icon: '🔒',
      title: 'Zero Data Storage',
      desc: 'No emails, no IPs, no personal info written to our servers. Everything stays inside Discord. Privacy by design.',
    },
  ];

  return (
    <section id="features" style={{ padding: '96px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Fade>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Features
          </p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, marginBottom: 52 }}>
            Why Choose Layer?
          </h2>
        </Fade>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {cards.map((c, i) => (
            <Fade key={c.title} delay={i * 0.08}>
              <FeatureCard icon={c.icon} title={c.title} desc={c.desc} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#161619' : CARD,
        border: `1px solid ${hov ? 'rgba(31,167,187,0.25)' : BORDER}`,
        borderRadius: 14, padding: '24px 20px',
        transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-3px)' : 'none',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: TEAL_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 19, marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{desc}</div>
    </div>
  );
}

/* ─── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '1', label: 'Add Layer', desc: 'Invite Layer to your server with one click.' },
    { n: '2', label: '#layer-logs Channel', desc: 'A dedicated channel is auto-created to log everything.' },
    { n: '3', label: 'Layer Scans', desc: 'Every message and image is checked in real time.' },
    { n: '4', label: 'Instant Action', desc: 'Layer removes the threat and bans or warns the user.' },
    { n: '5', label: 'Logged', desc: 'Every action is logged with full context in your log channel.' },
  ];

  return (
    <section id="how" style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.013)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Fade>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Process</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, marginBottom: 56 }}>
            How It Works
          </h2>
        </Fade>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, position: 'relative' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: 22, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(to right, transparent, ${BORDER} 15%, ${BORDER} 85%, transparent)`,
            zIndex: 0,
          }} />

          {steps.map((s, i) => (
            <Fade key={s.n} delay={i * 0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 10px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: i === 0 ? TEAL : CARD,
                  border: `1px solid ${i === 0 ? TEAL : BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800,
                  color: i === 0 ? '#080808' : MUTED,
                  marginBottom: 16,
                }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Deep Feature sections (alternating) ───────────────────── */
function DeepFeatures() {
  return (
    <section style={{ padding: '40px 40px 0' }}>
      <FeatureRow
        tag="AI Scam Detection"
        title="Catches scams before members even see them."
        desc="Layer scans every message and image in real time. OCR reads text inside screenshots. Pattern matching catches phishing links, fake giveaway bots, and crypto fraud — deleted automatically."
        bullets={[
          'OCR image scanning — reads text inside screenshots',
          'Phishing & fake invite link detection',
          'Fake giveaway and crypto fraud patterns',
          'Configurable action: delete, warn, or ban',
        ]}
        visual={<ScamVisual />}
      />
      <FeatureRow
        tag="Ban Evasion"
        title="Banned users can't come back."
        desc="When a banned user creates a new account and rejoins, Layer detects them through behavioral and account pattern matching — and bans the new account automatically."
        bullets={[
          'Account pattern & behavioral fingerprinting',
          'Auto-ban on rejoin with confidence score',
          'Full audit log with match reason',
          'Zero false positives by design',
        ]}
        visual={<BanVisual />}
        reverse
      />
      <FeatureRow
        tag="AI Tickets"
        title="Support tickets that resolve themselves."
        desc="Layer reads the ticket content, searches your server for relevant channels or roles, and answers common questions automatically. Staff only sees tickets that actually need them."
        bullets={[
          'Context-aware automatic first response',
          'Role and channel lookup within your server',
          'Hands off to staff when human judgment is needed',
          'Full conversation history preserved',
        ]}
        visual={<TicketVisual />}
      />
      <FeatureRow
        tag="Auto-Moderation"
        title="Fine-grained rules, zero code."
        desc="Set up spam detection, caps filters, invite blockers, and link filters in seconds from the dashboard. Every rule is configurable and toggleable without touching a command."
        bullets={[
          'Spam, caps, emoji, link, invite filters',
          'Per-channel and per-role overrides',
          'Dashboard toggle — no commands needed',
          'Graduated punishments: warn → mute → kick → ban',
        ]}
        visual={<ModVisual />}
        reverse
      />
    </section>
  );
}

function FeatureRow({
  tag, title, desc, bullets, visual, reverse,
}: {
  tag: string; title: string; desc: string; bullets: string[];
  visual: ReactNode; reverse?: boolean;
}) {
  return (
    <div style={{
      maxWidth: 1100, margin: '0 auto',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 72, alignItems: 'center',
      padding: '80px 0',
      borderBottom: `1px solid ${BORDER}`,
      direction: reverse ? 'rtl' : 'ltr',
    }}>
      <div style={{ direction: 'ltr' }}>
        <Fade x={reverse ? 24 : -24}>
          <p style={{ fontSize: 11, fontWeight: 800, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{tag}</p>
          <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 38px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, lineHeight: 1.1, marginBottom: 18 }}>{title}</h2>
          <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.78, marginBottom: 28, maxWidth: 420 }}>{desc}</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bullets.map(b => (
              <li key={b} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.6)', alignItems: 'flex-start' }}>
                <span style={{ color: TEAL, flexShrink: 0, fontWeight: 800, marginTop: 1 }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </Fade>
      </div>
      <div style={{ direction: 'ltr' }}>
        <Fade x={reverse ? -24 : 24} delay={0.1}>
          {visual}
        </Fade>
      </div>
    </div>
  );
}

/* ─── Animated visuals ───────────────────────────────────────── */
function ScamVisual() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(v => (v + 1) % 4), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '9px 13px', background: '#161619', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 6 }}>
        {['#EF4444','#F59E0B','#22C55E'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        <span style={{ fontSize: 11, color: MUTED, marginLeft: 6 }}>#general</span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          background: step >= 1 ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${step >= 1 ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 9, padding: '9px 11px', position: 'relative', overflow: 'hidden',
          transition: 'all 0.4s',
        }}>
          {step === 1 && <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: '100%', background: TEAL, animation: 'hp-scan 1s ease forwards' }} />}
          <div style={{ fontSize: 12, color: step >= 2 ? '#EF4444' : 'rgba(255,255,255,0.45)' }}>
            {step >= 2 && <span style={{ marginRight: 5 }}>🚨</span>}
            <span style={{ textDecoration: step >= 2 ? 'line-through' : 'none' }}>FREE NITRO — discord.gift/abc123 Click now!!</span>
          </div>
          {step >= 2 && <div style={{ fontSize: 10.5, color: '#EF4444', marginTop: 3 }}>Phishing link detected · Deleted in 0.3s</div>}
        </div>
        {step >= 3 && (
          <div style={{ display: 'flex', gap: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: TEAL_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🛡</div>
            <div style={{ background: TEAL_DIM, border: `1px solid rgba(31,167,187,0.2)`, borderRadius: '2px 8px 8px 8px', padding: '8px 12px', fontSize: 12.5, color: TEAL }}>
              Scam deleted — members protected ✓
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
          {[['98%', 'AI Confidence'],['0.3s','Reaction']].map(([v, l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '9px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ fontSize: 10, color: MUTED }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BanVisual() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const i = setInterval(() => {
      setShow(false);
      const t = setTimeout(() => setShow(true), 700);
      return () => clearTimeout(t);
    }, 3500);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Ban Evasion Detected</div>
      {[{ name: 'BadUser#1234', tag: 'BANNED' }, { name: 'NewUser#9876', tag: 'AUTO-BANNED' }].map((u, i) => (
        <div key={u.name}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.13)',
            opacity: i === 1 ? (show ? 1 : 0) : 1,
            transform: i === 1 ? (show ? 'translateY(0)' : 'translateY(8px)') : 'none',
            transition: 'opacity 0.5s, transform 0.5s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 13, color: TEXT }}>{u.name}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,0.12)', padding: '3px 8px', borderRadius: 4 }}>{u.tag}</span>
          </div>
          {i === 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '7px 0' }}>
              <span style={{ fontSize: 10, color: TEAL, fontWeight: 700, background: TEAL_DIM, padding: '2px 10px', borderRadius: 4 }}>98% confidence match</span>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 14, fontSize: 12, color: MUTED, textAlign: 'center' }}>6 evaders caught this week</div>
    </div>
  );
}

function TicketVisual() {
  const msgs = [
    { from: 'user', text: "Hey I can't access the server channels" },
    { from: 'bot', text: 'Check #roles to self-assign your access roles!' },
    { from: 'system', text: '— Staff joined · AI stepped back —' },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(v => Math.min(v + 1, msgs.length - 1)), 1800);
    return () => clearInterval(t);
  }, [msgs.length]);
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '9px 13px', background: '#161619', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13 }}>🎫</span>
        <span style={{ fontSize: 11, color: MUTED }}>#ticket-0042</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} /> Active
        </span>
      </div>
      <div style={{ padding: 14, minHeight: 160, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {msgs.slice(0, idx + 1).map((m, i) =>
          m.from === 'system' ? (
            <div key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', textAlign: 'center', padding: '3px 0' }}>{m.text}</div>
          ) : (
            <div key={i} style={{ display: 'flex', gap: 7, justifyContent: m.from === 'bot' ? 'flex-end' : 'flex-start' }}>
              {m.from === 'user' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />}
              <div style={{
                background: m.from === 'bot' ? TEAL_DIM : 'rgba(255,255,255,0.05)',
                border: `1px solid ${m.from === 'bot' ? 'rgba(31,167,187,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: m.from === 'bot' ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
                padding: '7px 11px', fontSize: 12.5,
                color: m.from === 'bot' ? TEAL : 'rgba(255,255,255,0.65)',
                maxWidth: '80%',
              }}>{m.text}</div>
              {m.from === 'bot' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: TEAL_DIM, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🤖</div>}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ModVisual() {
  const rules = [
    { label: 'Spam Detection', on: true },
    { label: 'Caps Filter', on: true },
    { label: 'Link Filter', on: false },
    { label: 'Invite Links', on: true },
    { label: 'Emoji Spam', on: false },
  ];
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Auto-Moderation Rules</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rules.map(r => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px', borderRadius: 9,
            background: r.on ? 'rgba(31,167,187,0.05)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${r.on ? 'rgba(31,167,187,0.15)' : 'rgba(255,255,255,0.05)'}`,
          }}>
            <span style={{ fontSize: 13, color: r.on ? TEXT : MUTED }}>{r.label}</span>
            <div style={{ width: 34, height: 19, borderRadius: 10, background: r.on ? TEAL : 'rgba(255,255,255,0.1)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2.5, width: 14, height: 14, borderRadius: '50%', background: '#fff', left: r.on ? 18 : 2.5, transition: 'left 0.2s' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '9px 12px', background: TEAL_DIM, borderRadius: 8, fontSize: 12, color: TEAL }}>
        ✓ Configurable from dashboard — no commands needed
      </div>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: 'Is Layer free to use?', a: 'Yes. The free plan covers up to 1,000 members with moderation, tickets, leveling, and verification. Pro unlocks unlimited AI scans, ban evasion tracking, and advanced analytics for €4.99/month.' },
  { q: 'Will it ban legitimate users?', a: 'No. Layer uses high-confidence thresholds. Scam detection flags only clear patterns. Ban evasion requires a 95%+ confidence match before any action is taken.' },
  { q: 'Can I customise the action Layer takes?', a: 'Yes — delete only, delete + warn, delete + mute, or delete + ban. All configurable per rule from the dashboard.' },
  { q: 'Where are actions logged?', a: 'Every action Layer takes is logged in your #layer-logs channel with full context: what was detected, which member, what action was taken, and a confidence score.' },
  { q: 'Does it work in all servers?', a: 'Yes, Layer works in any Discord server. Free plan for small communities, Pro for large or high-traffic servers.' },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: '96px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
        {/* Left */}
        <Fade x={-24}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, marginBottom: 20 }}>Frequently asked questions</h2>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 12 }}>Built for Discord Communities</p>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, marginBottom: 16 }}>Layer is used by server owners who want serious protection without writing a single line of code.</p>
              {['No setup hassle', 'Low resource usage', 'Always focused', 'Actively maintained'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: 11 }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </Fade>

        {/* Right — accordion */}
        <Fade x={24} delay={0.1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}
                style={{
                  background: open === i ? '#161619' : CARD,
                  border: `1px solid ${open === i ? 'rgba(31,167,187,0.2)' : BORDER}`,
                  borderRadius: 12, overflow: 'hidden', transition: 'background 0.2s, border-color 0.2s',
                }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    color: TEXT, fontSize: 14, fontWeight: 600,
                  }}>
                  {item.q}
                  <span style={{ color: TEAL, fontSize: 18, lineHeight: 1, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
                </button>
                {open === i && (
                  <div style={{ padding: '0 18px 14px', fontSize: 13.5, color: MUTED, lineHeight: 1.7 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section style={{ padding: '0 40px 96px' }}>
      <Fade>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: `linear-gradient(135deg, rgba(31,167,187,0.12) 0%, rgba(31,167,187,0.04) 100%)`,
          border: `1px solid rgba(31,167,187,0.2)`,
          borderRadius: 20, padding: '60px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 28,
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, marginBottom: 10 }}>
              Ready to protect your server?
            </h2>
            <p style={{ fontSize: 15, color: MUTED }}>Free to start. Setup in under 2 minutes.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <InviteBtn large />
            <Link href="/commands"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: MUTED, fontSize: 15, fontWeight: 600,
                textDecoration: 'none', padding: '12px 24px',
                border: `1px solid ${BORDER}`, borderRadius: 999,
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = BORDER; }}>
              View Commands
            </Link>
          </div>
        </div>
      </Fade>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const cols: { title: string; links: [string, string][] }[] = [
    { title: 'Resources', links: [['Pricing', '/premium'], ['Documentation', '/commands'], ['Support Server', '/invite'], ['Status', '/status']] },
    { title: 'Legal', links: [['Terms of Service', '/terms'], ['Privacy Policy', '/privacy'], ['Credits', '/credits']] },
    { title: 'Stay Updated', links: [['Join Discord', '/invite']] },
  ];

  return (
    <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '60px 40px 36px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          {/* Brand col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Image src="/logo.png" alt="Layer" width={22} height={22} style={{ objectFit: 'contain' }} />
              <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Layer</span>
            </div>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, maxWidth: 220 }}>
              The bot that protects your Discord community — automatically.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>
              Made with ❤️ by <span style={{ color: MUTED }}>BlabyMk</span>
            </p>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>{col.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(([label, href]) => (
                  <Link key={href} href={href}
                    style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 BlabyMk. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Credits'].map((t, i) => (
              <Link key={t} href={['/privacy', '/terms', '/credits'][i]}
                style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = MUTED)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Nav />
      <Hero />
      <StatsBar />
      <WhyChoose />
      <HowItWorks />
      <DeepFeatures />
      <FAQSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
