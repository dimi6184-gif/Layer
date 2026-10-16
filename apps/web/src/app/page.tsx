'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, ReactNode } from 'react';

/* ─── Brand ─────────────────────────────────────────────────── */
const T = '#1FA7BB';
const T2 = 'rgba(31,167,187,0.12)';
const BG = '#0a0a0f';
const CARD = '#111116';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#F5F4F5';
const MUTED = 'rgba(255,255,255,0.42)';

/* ─── Intersection-Observer fade hook ───────────────────────── */
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

function Fade({ children, delay = 0, y = 22, x = 0 }: { children: ReactNode; delay?: number; y?: number; x?: number }) {
  const { ref, vis } = useAppear();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translate(0,0)' : `translate(${x}px,${y}px)`,
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─── SVG Icon set ───────────────────────────────────────────── */
function Icon({ name, size = 18, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const icons: Record<string, ReactNode> = {
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>,
    ban: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    ticket: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9z"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    music: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    scan: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    bot: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  };
  return <>{icons[name] ?? null}</>;
}

/* ─── Invite button — jubayer-10 exact blue palette ─────────── */
function InviteBtn({ large }: { large?: boolean }) {
  const [pressed, setPressed] = useState(false);
  const px = large ? '13px 26px' : '7px 16px';
  const fs = large ? 15 : 13;
  const iconSz = large ? 15 : 12;
  const br = large ? 12 : 9;

  return (
    <Link href="/invite" style={{ textDecoration: 'none', display: 'inline-block' }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}>
      {/* Outer ring — bg-blue-50 equivalent */}
      <div style={{
        background: 'rgba(219,234,254,0.06)',
        borderRadius: br + 4,
        padding: '3px',
        boxShadow: 'inset 0px 0px 1px 1px rgba(0,0,0,0.3), 2px 3px 5px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.1s',
      }}>
        {/* Black blur depth layer */}
        <div style={{
          background: '#000',
          borderRadius: br + 1,
          padding: pressed ? '4px 0 2px' : '3px 0 3px',
          filter: 'blur(0.5px)',
          transition: 'padding 0.08s',
        }}>
          {/* Face: from-blue-600 to-blue-400, exact template shadows */}
          <div style={{
            background: 'linear-gradient(to bottom, #2563eb, #60a5fa)',
            borderRadius: br,
            padding: px,
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: pressed
              ? 'inset 0px 4px 2px rgba(96,165,250,0.5), inset 0px -4px 2px rgba(37,99,235,0.5), 0px 0px 2px rgba(0,0,0,1)'
              : 'inset 0px 4px 2px #60a5fa, inset 0px -4px 0px #1e3a8a, 0px 0px 2px rgba(0,0,0,1)',
            transform: pressed ? 'translateY(1px)' : 'translateY(0)',
            transition: 'box-shadow 0.08s, transform 0.08s',
          }}>
            <Icon name="plus" size={iconSz} color="#bfdbfe" />
            <span style={{
              fontWeight: 700, fontSize: fs,
              color: '#bfdbfe',
              letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))',
            }}>
              Add to Discord
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Smooth scroll helper ───────────────────────────────────── */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Navbar ─────────────────────────────────────────────────── */
const NAV_LINKS: [string, string][] = [
  ['Features', 'features'],
  ['Security', 'security'],
  ['Pricing', '/premium'],
  ['FAQ', 'faq'],
  ['Docs', '/commands'],
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith('/')) {
      e.preventDefault();
      scrollTo(href);
    }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 56, display: 'flex', alignItems: 'center', padding: '0 40px',
      background: scrolled ? 'rgba(10,10,15,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
      transition: 'background 0.3s, backdrop-filter 0.3s',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 40 }}>
        <Image src="/logo.png" alt="Layer" width={24} height={24} style={{ objectFit: 'contain' }} />
        <span style={{ color: TEXT, fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Layer</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
        {NAV_LINKS.map(([label, href]) => (
          <a key={href} href={href.startsWith('/') ? href : `#${href}`}
            onClick={(e) => handleNav(e, href)}
            style={{ color: MUTED, fontSize: 13.5, fontWeight: 500, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
            {label}
          </a>
        ))}
      </div>

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

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '100px 40px 80px',
      maxWidth: 1200, margin: '0 auto',
    }}>
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(31,167,187,0.09) 0%, transparent 65%)' }} />

      {/* LEFT */}
      <div style={{ flex: '0 0 52%', maxWidth: 560, position: 'relative', zIndex: 2 }}>
        <Fade delay={0}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
            borderRadius: 999, padding: '5px 14px', marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }} />
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Activity Maintained</span>
          </div>
        </Fade>

        <Fade delay={0.08}>
          <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 70px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0, color: TEXT, margin: '0 0 4px' }}>
            The bot that
          </h1>
        </Fade>
        <Fade delay={0.15}>
          <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 70px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0, color: T, margin: '0 0 26px' }}>
            protects servers.
          </h1>
        </Fade>

        <Fade delay={0.22}>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 440, marginBottom: 34 }}>
            Layer is a Discord bot that catches scams, tracks ban evaders, routes tickets with AI, and keeps your community clean — with zero data stored.
          </p>
        </Fade>

        <Fade delay={0.3}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
            <InviteBtn large />
            <a href="#features" onClick={e => { e.preventDefault(); scrollTo('features'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: MUTED, fontSize: 15, fontWeight: 600, textDecoration: 'none',
                padding: '12px 22px', border: `1px solid ${BORDER}`, borderRadius: 999,
                cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderColor = BORDER; }}>
              Read the Guide
            </a>
          </div>
        </Fade>

        <Fade delay={0.36}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Free to start', 'No credit card', 'Zero data stored'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.28)' }}>
                <Icon name="check" size={12} color={T} /> {t}
              </span>
            ))}
          </div>
        </Fade>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>
        <Fade delay={0.2} y={14}>
          <HeroPanel />
        </Fade>
      </div>

      <style>{`
        @keyframes hp-float  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
        @keyframes hp-floatb { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-6px)} }
        @keyframes hp-slide  { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes hp-scan   { 0%{width:0;opacity:0} 30%{opacity:1} 100%{width:100%;opacity:0} }
      `}</style>
    </section>
  );
}

/* ─── Hero right panel ───────────────────────────────────────── */
function HeroPanel() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(v => (v + 1) % 5), 1700); return () => clearInterval(t); }, []);

  return (
    <div style={{ width: 340, position: 'relative', animation: 'hp-float 4s ease-in-out infinite' }}>
      {/* Main panel */}
      <div style={{
        background: '#1e1f22', borderRadius: 12,
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 14px', background: '#2b2d31', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Image src="/logo.png" alt="Layer" width={18} height={18} style={{ objectFit: 'contain', borderRadius: 4 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>Layer</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} /> Online
          </span>
        </div>

        <div style={{ padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180 }}>
          {/* Scam message */}
          <div style={{
            background: step >= 1 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${step >= 1 ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 8, padding: '8px 11px', position: 'relative', overflow: 'hidden',
            transition: 'background 0.4s, border-color 0.4s',
          }}>
            {step === 1 && <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: T, animation: 'hp-scan 1s ease forwards' }} />}
            <div style={{ fontSize: 11.5, color: step >= 2 ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.45)' }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', marginRight: 6 }}>ScamUser:</span>
              <span style={{ textDecoration: step >= 2 ? 'line-through' : 'none' }}>FREE NITRO!! discord.gift/abc123</span>
            </div>
            {step >= 2 && <div style={{ fontSize: 10, color: '#EF4444', marginTop: 4, animation: 'hp-slide 0.3s ease' }}>Phishing link · deleted in 0.3s</div>}
          </div>

          {step >= 3 && (
            <div style={{ display: 'flex', gap: 7, animation: 'hp-slide 0.3s ease' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: T2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="shield" size={12} color={T} />
              </div>
              <div style={{ background: T2, border: `1px solid rgba(31,167,187,0.2)`, borderRadius: '2px 8px 8px 8px', padding: '7px 11px', fontSize: 12, color: T }}>
                Scam removed — members protected ✓
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', animation: 'hp-slide 0.3s ease' }}>
              <span style={{ color: 'rgba(255,255,255,0.18)', marginRight: 6 }}>member:</span>
              thanks for the quick protection 🙏
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', gap: 8 }}>
          {[['0.3s', 'Reaction time'], ['98%', 'Accuracy']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Side cards */}
      <div style={{
        position: 'absolute', top: -16, right: -96,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', minWidth: 155,
        animation: 'hp-floatb 5s ease-in-out infinite', animationDelay: '0.8s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', display: 'inline-block', boxShadow: '0 0 6px #EF4444' }} />
          <span style={{ fontSize: 10, color: MUTED }}>Ban Evasion</span>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT }}>Evader caught</div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>98% confidence</div>
      </div>

      <div style={{
        position: 'absolute', bottom: -18, left: -76,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', minWidth: 148,
        animation: 'hp-floatb 4.5s ease-in-out infinite', animationDelay: '1.4s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Icon name="ticket" size={11} color={T} />
          <span style={{ fontSize: 10, color: T, fontWeight: 700 }}>AI Ticket</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>&ldquo;Check #roles first!&rdquo;</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Resolved in 4s</div>
      </div>
    </div>
  );
}

/* ─── Why Choose Layer — visual feature cards ────────────────── */
function WhyChoose() {
  const cards = [
    {
      icon: 'scan',
      title: 'AI Scam Detection',
      sub: 'Reads text inside images. Deletes phishing & fake giveaways before members see them.',
      visual: <ScamMini />,
    },
    {
      icon: 'ban',
      title: 'Ban Evasion Tracking',
      sub: 'New account after a ban? Layer catches the pattern and bans automatically.',
      visual: <BanMini />,
    },
    {
      icon: 'ticket',
      title: 'AI Ticket Routing',
      sub: 'AI answers common questions first. Staff only sees tickets that actually need them.',
      visual: <TicketMini />,
    },
    {
      icon: 'lock',
      title: 'Zero Data Storage',
      sub: 'No emails, no IPs, nothing logged to our servers. Privacy by design.',
      visual: <PrivacyMini />,
    },
    {
      icon: 'trending',
      title: 'Leveling & XP',
      sub: 'Streaks, achievements, leaderboard. Keep your community engaged.',
      visual: <LevelMini />,
    },
    {
      icon: 'music',
      title: 'Music Player',
      sub: 'High-quality YouTube playback with queue management built in.',
      visual: <MusicMini />,
    },
  ];

  return (
    <section id="features" style={{ padding: '96px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Fade>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: T, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Features</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT }}>
              Why Choose Layer?
            </h2>
          </div>
        </Fade>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {cards.map((c, i) => (
            <Fade key={c.title} delay={i * 0.07}>
              <FeatureCard icon={c.icon} title={c.title} sub={c.sub} visual={c.visual} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, sub, visual }: { icon: string; title: string; sub: string; visual: ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#15151a' : CARD,
        border: `1px solid ${hov ? 'rgba(31,167,187,0.22)' : BORDER}`,
        borderRadius: 16, overflow: 'hidden',
        transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}>
      {/* Preview area */}
      <div style={{
        height: 140, background: '#0d0d11',
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px 20px', overflow: 'hidden',
      }}>
        {visual}
      </div>
      {/* Text area */}
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
          <span style={{ color: T }}><Icon name={icon} size={16} color={T} /></span>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{title}</span>
        </div>
        <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ─── Mini visuals inside feature cards ─────────────────────── */
function ScamMini() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 1800); return () => clearInterval(t); }, []);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        background: on ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${on ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 7, padding: '7px 10px', fontSize: 11,
        color: on ? '#EF4444' : 'rgba(255,255,255,0.4)',
        transition: 'all 0.5s', textDecoration: on ? 'line-through' : 'none',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {on && <Icon name="ban" size={11} color="#EF4444" />}
        FREE NITRO discord.gift/abc123
      </div>
      {on && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', animation: 'hp-slide 0.3s ease' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: T2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="shield" size={10} color={T} />
          </div>
          <div style={{ background: T2, borderRadius: '2px 6px 6px 6px', padding: '5px 9px', fontSize: 11, color: T }}>
            Deleted in 0.3s ✓
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '5px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>98%</div>
          <div style={{ fontSize: 9, color: MUTED }}>Accuracy</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '5px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>0.3s</div>
          <div style={{ fontSize: 9, color: MUTED }}>Reaction</div>
        </div>
      </div>
    </div>
  );
}

function BanMini() {
  const [show, setShow] = useState(true);
  useEffect(() => { const i = setInterval(() => { setShow(false); setTimeout(() => setShow(true), 600); }, 3000); return () => clearInterval(i); }, []);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[{ name: 'BadUser#1234', tag: 'BANNED' }, { name: 'NewUser#9876', tag: 'AUTO-BANNED' }].map((u, i) => (
        <div key={u.name} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 10px', borderRadius: 7,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.13)',
          opacity: i === 1 ? (show ? 1 : 0) : 1,
          transform: i === 1 ? (show ? 'none' : 'translateY(6px)') : 'none',
          transition: 'opacity 0.5s, transform 0.5s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 11, color: TEXT }}>{u.name}</span>
          </div>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,0.12)', padding: '2px 6px', borderRadius: 3 }}>{u.tag}</span>
        </div>
      ))}
      {show && <div style={{ textAlign: 'center', fontSize: 10, color: T, fontWeight: 700, background: T2, borderRadius: 4, padding: '3px 0', animation: 'hp-slide 0.3s ease' }}>98% match confidence</div>}
    </div>
  );
}

function TicketMini() {
  const [idx, setIdx] = useState(0);
  const msgs = [
    { f: 'u', t: "Can't access channels" },
    { f: 'b', t: 'Check #roles to self-assign!' },
  ];
  useEffect(() => { const i = setInterval(() => setIdx(v => (v + 1) % (msgs.length + 1)), 1600); return () => clearInterval(i); }, [msgs.length]);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <Icon name="ticket" size={11} color={T} />
        <span style={{ fontSize: 10, color: MUTED }}>#ticket-0042</span>
        <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
      </div>
      {msgs.slice(0, Math.min(idx + 1, msgs.length)).map((m, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, justifyContent: m.f === 'b' ? 'flex-end' : 'flex-start', animation: 'hp-slide 0.3s ease' }}>
          {m.f === 'u' && <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />}
          <div style={{
            background: m.f === 'b' ? T2 : 'rgba(255,255,255,0.05)',
            border: `1px solid ${m.f === 'b' ? 'rgba(31,167,187,0.2)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: m.f === 'b' ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
            padding: '5px 9px', fontSize: 11,
            color: m.f === 'b' ? T : 'rgba(255,255,255,0.6)', maxWidth: '82%',
          }}>{m.t}</div>
        </div>
      ))}
    </div>
  );
}

function PrivacyMini() {
  const items = ['Emails stored', 'IPs logged', 'Member data', 'Message content'];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {items.map(item => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 11, color: MUTED }}>{item}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 700 }}>NONE</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LevelMini() {
  return (
    <div style={{ width: '100%' }}>
      {[{ name: 'User_Alpha', lvl: 24, xp: 78 }, { name: 'User_Beta', lvl: 19, xp: 45 }, { name: 'User_Gamma', lvl: 12, xp: 91 }].map((u, i) => (
        <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: [T, 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.25)'][i], minWidth: 14 }}>{i + 1}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: TEXT }}>{u.name}</span>
              <span style={{ fontSize: 10, color: T, fontWeight: 700 }}>Lv {u.lvl}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${u.xp}%`, background: T, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MusicMini() {
  const [playing, setPlaying] = useState(true);
  const [prog, setProg] = useState(38);
  useEffect(() => { if (!playing) return; const t = setInterval(() => setProg(v => v >= 100 ? 0 : v + 1), 120); return () => clearInterval(t); }, [playing]);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 8, background: T2, border: `1px solid rgba(31,167,187,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="music" size={16} color={T} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Chill Lofi Mix</div>
          <div style={{ fontSize: 10, color: MUTED }}>YouTube · 3:42</div>
        </div>
        <button onClick={() => setPlaying(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T, fontSize: 16 }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${prog}%`, background: T, borderRadius: 2, transition: 'width 0.12s linear' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 9, color: MUTED }}>1:{String(Math.floor(prog * 222 / 100 / 60)).padStart(2,'0')}</span>
        <span style={{ fontSize: 9, color: MUTED }}>3:42</span>
      </div>
    </div>
  );
}

/* ─── Deep feature rows ──────────────────────────────────────── */
function DeepFeatures() {
  return (
    <section id="security" style={{ padding: '0 40px' }}>
      {[
        {
          tag: 'AI Scam Detection',
          title: 'Scams deleted before anyone sees them.',
          bullets: ['OCR reads text inside screenshots', 'Phishing & fake nitro link detection', 'Configurable: delete · warn · ban'],
          visual: <ScamVisual />,
          reverse: false,
        },
        {
          tag: 'Ban Evasion',
          title: "Banned users can't come back.",
          bullets: ['Behavioral & account pattern matching', 'Auto-ban on rejoin', 'Confidence score in audit log'],
          visual: <BanVisual />,
          reverse: true,
        },
        {
          tag: 'AI Tickets',
          title: 'Support that resolves itself.',
          bullets: ['Context-aware first response', 'Hands off to staff when needed', 'Full conversation history kept'],
          visual: <TicketVisual />,
          reverse: false,
        },
        {
          tag: 'Auto-Moderation',
          title: 'Fine-grained rules. Zero code.',
          bullets: ['Spam, caps, link, invite filters', 'Dashboard toggles — no commands', 'Graduated punishments'],
          visual: <ModVisual />,
          reverse: true,
        },
      ].map((row, i) => (
        <FeatureRow key={row.tag} {...row} last={i === 3} />
      ))}
    </section>
  );
}

function FeatureRow({ tag, title, bullets, visual, reverse, last }: {
  tag: string; title: string; bullets: string[];
  visual: ReactNode; reverse?: boolean; last?: boolean;
}) {
  return (
    <div style={{
      maxWidth: 1100, margin: '0 auto',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 72, alignItems: 'center',
      padding: '72px 0',
      borderBottom: last ? 'none' : `1px solid ${BORDER}`,
      direction: reverse ? 'rtl' : 'ltr',
    }}>
      <div style={{ direction: 'ltr' }}>
        <Fade x={reverse ? 20 : -20}>
          <p style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{tag}</p>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, lineHeight: 1.12, marginBottom: 20 }}>{title}</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bullets.map(b => (
              <li key={b} style={{ display: 'flex', gap: 9, fontSize: 14, color: 'rgba(255,255,255,0.6)', alignItems: 'flex-start' }}>
                <span style={{ color: T, flexShrink: 0, marginTop: 2 }}><Icon name="check" size={13} color={T} /></span>
                {b}
              </li>
            ))}
          </ul>
        </Fade>
      </div>
      <div style={{ direction: 'ltr' }}>
        <Fade x={reverse ? -20 : 20} delay={0.1}>{visual}</Fade>
      </div>
    </div>
  );
}

/* ─── Full-size animated visuals ─────────────────────────────── */
function ScamVisual() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(v => (v + 1) % 4), 1600); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '9px 13px', background: '#161619', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 5 }}>
        {['#EF4444','#F59E0B','#22C55E'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        <span style={{ fontSize: 11, color: MUTED, marginLeft: 6 }}>#general</span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          background: step >= 1 ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${step >= 1 ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 9, padding: '9px 11px', position: 'relative', overflow: 'hidden', transition: 'all 0.4s',
        }}>
          {step === 1 && <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: T, animation: 'hp-scan 1s ease forwards' }} />}
          <div style={{ fontSize: 12, color: step >= 2 ? '#EF4444' : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {step >= 2 && <Icon name="ban" size={12} color="#EF4444" />}
            <span style={{ textDecoration: step >= 2 ? 'line-through' : 'none' }}>FREE NITRO — discord.gift/abc123 Click now!!</span>
          </div>
          {step >= 2 && <div style={{ fontSize: 10.5, color: '#EF4444', marginTop: 3 }}>Phishing link detected · Deleted in 0.3s</div>}
        </div>
        {step >= 3 && (
          <div style={{ display: 'flex', gap: 7 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: T2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="shield" size={12} color={T} />
            </div>
            <div style={{ background: T2, border: `1px solid rgba(31,167,187,0.2)`, borderRadius: '2px 8px 8px 8px', padding: '8px 12px', fontSize: 12.5, color: T }}>
              Scam deleted — members protected ✓
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
          {[['98%','AI Confidence'],['0.3s','Reaction']].map(([v,l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '9px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: TEXT }}>{v}</div>
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
  useEffect(() => { const i = setInterval(() => { setShow(false); setTimeout(() => setShow(true), 700); }, 3500); return () => clearInterval(i); }, []);
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="ban" size={12} color={MUTED} /> Ban Evasion Detected</span>
      </div>
      {[{ name: 'BadUser#1234', tag: 'BANNED' }, { name: 'NewUser#9876', tag: 'AUTO-BANNED' }].map((u, i) => (
        <div key={u.name}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.13)',
            opacity: i === 1 ? (show ? 1 : 0) : 1,
            transform: i === 1 ? (show ? 'none' : 'translateY(8px)') : 'none',
            transition: 'opacity 0.5s, transform 0.5s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 13, color: TEXT }}>{u.name}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,0.12)', padding: '3px 8px', borderRadius: 4 }}>{u.tag}</span>
          </div>
          {i === 0 && <div style={{ display: 'flex', justifyContent: 'center', padding: '7px 0' }}>
            <span style={{ fontSize: 10, color: T, fontWeight: 700, background: T2, padding: '2px 10px', borderRadius: 4 }}>98% confidence match</span>
          </div>}
        </div>
      ))}
      <div style={{ marginTop: 14, fontSize: 12, color: MUTED, textAlign: 'center' }}>6 evaders caught this week</div>
    </div>
  );
}

function TicketVisual() {
  const msgs = [
    { f: 'u', t: "Hey I can't access the server channels" },
    { f: 'b', t: 'Check #roles to self-assign your access roles!' },
    { f: 'sys', t: '— Staff joined · AI stepped back —' },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(v => Math.min(v + 1, msgs.length - 1)), 1800); return () => clearInterval(t); }, [msgs.length]);
  return (
    <div style={{ background: '#0e0e12', border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '9px 13px', background: '#161619', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="ticket" size={12} color={MUTED} />
        <span style={{ fontSize: 11, color: MUTED }}>#ticket-0042</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} /> Active
        </span>
      </div>
      <div style={{ padding: 14, minHeight: 160, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {msgs.slice(0, idx + 1).map((m, i) =>
          m.f === 'sys' ? (
            <div key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', textAlign: 'center', padding: '3px 0' }}>{m.t}</div>
          ) : (
            <div key={i} style={{ display: 'flex', gap: 7, justifyContent: m.f === 'b' ? 'flex-end' : 'flex-start' }}>
              {m.f === 'u' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />}
              <div style={{
                background: m.f === 'b' ? T2 : 'rgba(255,255,255,0.05)',
                border: `1px solid ${m.f === 'b' ? 'rgba(31,167,187,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: m.f === 'b' ? '8px 2px 8px 8px' : '2px 8px 8px 8px',
                padding: '7px 11px', fontSize: 12.5,
                color: m.f === 'b' ? T : 'rgba(255,255,255,0.65)', maxWidth: '80%',
              }}>{m.t}</div>
              {m.f === 'b' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: T2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bot" size={11} color={T} /></div>}
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
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="zap" size={14} color={T} /> Auto-Moderation Rules
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rules.map(r => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px', borderRadius: 9,
            background: r.on ? 'rgba(31,167,187,0.05)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${r.on ? 'rgba(31,167,187,0.15)' : 'rgba(255,255,255,0.05)'}`,
          }}>
            <span style={{ fontSize: 13, color: r.on ? TEXT : MUTED }}>{r.label}</span>
            <div style={{ width: 34, height: 19, borderRadius: 10, background: r.on ? T : 'rgba(255,255,255,0.1)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2.5, width: 14, height: 14, borderRadius: '50%', background: '#fff', left: r.on ? 18 : 2.5, transition: 'left 0.2s' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '9px 12px', background: T2, borderRadius: 8, fontSize: 12, color: T, display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon name="check" size={12} color={T} /> Dashboard toggles — no commands needed
      </div>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: 'Is Layer free to use?', a: 'Yes. The free plan covers up to 1,000 members with moderation, tickets, leveling, and verification. Pro unlocks unlimited AI scans, ban evasion tracking, and advanced analytics for €4.99/month.' },
  { q: 'Will it ban legitimate users?', a: 'No. Layer uses high-confidence thresholds — 95%+ required for ban evasion, clear pattern matching for scam detection. Ambiguous cases are flagged for staff review.' },
  { q: 'Can I customise the action Layer takes?', a: 'Yes — delete only, delete + warn, delete + mute, or delete + ban. All configurable per rule from the dashboard, no commands needed.' },
  { q: 'Where are actions logged?', a: 'Every action is logged in your #layer-logs channel with full context: what was detected, which member, what action was taken, and a confidence score.' },
  { q: 'Does it work in all servers?', a: 'Yes. Layer works in any Discord server regardless of size. Free plan for small communities, Pro for high-traffic servers that need unlimited AI scanning.' },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: '96px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
        <Fade x={-20}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: T, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.04em', color: TEXT, marginBottom: 20 }}>Frequently asked questions</h2>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="users" size={14} color={T} /> Built for Discord Communities
              </p>
              {['No setup hassle', 'Low resource usage', 'Always focused', 'Actively maintained'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                  <Icon name="check" size={12} color="#22C55E" /> {t}
                </div>
              ))}
            </div>
          </div>
        </Fade>

        <Fade x={20} delay={0.1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{
                background: open === i ? '#161619' : CARD,
                border: `1px solid ${open === i ? 'rgba(31,167,187,0.2)' : BORDER}`,
                borderRadius: 12, overflow: 'hidden', transition: 'background 0.2s, border-color 0.2s',
              }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: TEXT, fontSize: 14, fontWeight: 600 }}>
                  {item.q}
                  <span style={{ color: T, fontSize: 18, lineHeight: 1, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
                </button>
                {open === i && <div style={{ padding: '0 18px 14px', fontSize: 13.5, color: MUTED, lineHeight: 1.7 }}>{item.a}</div>}
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
          background: 'linear-gradient(135deg, rgba(31,167,187,0.12) 0%, rgba(31,167,187,0.04) 100%)',
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
                color: MUTED, fontSize: 15, fontWeight: 600, textDecoration: 'none',
                padding: '12px 22px', border: `1px solid ${BORDER}`, borderRadius: 999,
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
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
            {(['Privacy Policy', 'Terms of Service', 'Credits'] as const).map((t, i) => (
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
      <WhyChoose />
      <DeepFeatures />
      <FAQSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
