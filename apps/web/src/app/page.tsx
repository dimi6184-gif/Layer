'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, ReactNode } from 'react';

const T = '#1FA7BB';
const T2 = 'rgba(31,167,187,0.12)';

/* ── Intersection Observer fade-in hook ─────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Animated Section wrapper ───────────────────────────────── */
function Appear({ children, delay = 0, from = 'bottom' }: { children: ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right' }) {
  const { ref, visible } = useFadeIn();
  const translate = from === 'left' ? 'translateX(-40px)' : from === 'right' ? 'translateX(40px)' : 'translateY(32px)';
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0,0)' : translate,
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Counter animation ──────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useFadeIn();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = to / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); } else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [visible, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── Nav ─────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 48px', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(6,6,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
        <Image src="/logo.png" alt="Layer" width={26} height={26} style={{ objectFit: 'contain' }} />
        <span style={{ color: '#F5F4F5', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Layer</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        {[['Features', '#features'], ['Security', '/security'], ['Pricing', '/premium'], ['Commands', '/commands']].map(([l, h]) => (
          <Link key={h} href={h} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
            {l}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        <AddBtn />
      </div>
    </nav>
  );
}

/* ── Add to Discord Button ───────────────────────────────────── */
function AddBtn({ large }: { large?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href="/dashboard"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: hov ? '#18909f' : T,
        color: '#080808', fontWeight: 700,
        fontSize: large ? 16 : 13.5,
        padding: large ? '14px 32px' : '9px 22px',
        borderRadius: 999, textDecoration: 'none',
        transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 24px rgba(31,167,187,0.35)` : 'none',
      }}>
      <span style={{ fontSize: large ? 18 : 14, lineHeight: 1 }}>+</span>
      Add to Discord
    </Link>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 80); return () => clearInterval(t); }, []);
  // Floating particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    x: (i * 137.5) % 100, y: (i * 61.8) % 100,
    size: 1 + (i % 3), speed: 0.3 + (i % 5) * 0.2,
    phase: i * 0.4,
  }));

  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '120px 48px 80px',
    }}>
      {/* Animated background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(31,167,187,0.07) 0%, transparent 70%)',
      }} />
      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${(p.y + Math.sin(tick * 0.02 * p.speed + p.phase) * 2) % 100}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: T,
          opacity: 0.15 + Math.sin(tick * 0.03 + p.phase) * 0.1,
          pointerEvents: 'none',
          transition: 'top 0.08s linear',
        }} />
      ))}

      {/* LEFT: Content */}
      <div style={{ flex: 1, maxWidth: 640, position: 'relative', zIndex: 2 }}>
        {/* Badge */}
        <Appear delay={0}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999, padding: '5px 14px', marginBottom: 28,
            fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
          }}>
            <span style={{ background: T, color: '#080808', fontWeight: 800, fontSize: 10, padding: '1px 6px', borderRadius: 999 }}>NEW</span>
            Early Access — Join the first 1,000 servers
            <span style={{ color: T }}>→</span>
          </div>
        </Appear>

        {/* BIG Headline */}
        <Appear delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(48px, 6.5vw, 80px)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: '-0.04em',
            margin: '0 0 8px', color: '#F5F4F5',
          }}>
            YOUR DISCORD
          </h1>
        </Appear>
        <Appear delay={0.18}>
          <h1 style={{
            fontSize: 'clamp(48px, 6.5vw, 80px)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: '-0.04em',
            margin: '0 0 8px', color: '#F5F4F5',
          }}>
            SERVER,
          </h1>
        </Appear>
        <Appear delay={0.26}>
          <h1 style={{
            fontSize: 'clamp(48px, 6.5vw, 80px)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: '-0.04em',
            margin: '0 0 8px', color: T,
          }}>
            FINALLY UNDER
          </h1>
        </Appear>
        <Appear delay={0.34}>
          <h1 style={{
            fontSize: 'clamp(48px, 6.5vw, 80px)', fontWeight: 900,
            lineHeight: 1.0, letterSpacing: '-0.04em',
            margin: '0 0 32px', color: T,
          }}>
            CONTROL.
          </h1>
        </Appear>

        <Appear delay={0.42}>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
            AI moderation, anti-scam protection, ban evasion tracking, and zero data collection. Free, setup in 2 minutes.
          </p>
        </Appear>

        <Appear delay={0.5}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <AddBtn large />
            <SetupBtn />
          </div>
        </Appear>

        <Appear delay={0.58}>
          <div style={{ display: 'flex', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
            {['Free forever', 'No credit card', 'Zero data stored'].map(t => (
              <span key={t} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: T, fontSize: 11 }}>✓</span> {t}
              </span>
            ))}
          </div>
        </Appear>
      </div>

      {/* RIGHT: Animated Bot + floating cards */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 500 }}>
        {/* Bot mascot glow */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(31,167,187,0.15) 0%, transparent 70%)`,
          animation: 'pulse 3s ease-in-out infinite',
        }} />

        {/* Bot body */}
        <BotMascot tick={tick} />

        {/* Floating stat cards */}
        <FloatingCard style={{ top: '10%', right: '5%' }} delay={0}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Scam deleted</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#EF4444' }}>0.3s</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Reaction time</div>
        </FloatingCard>

        <FloatingCard style={{ bottom: '20%', right: '2%' }} delay={0.3}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 6px #22C55E' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Ban Evasion</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F4F5' }}>Evader caught</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>98% match confidence</div>
        </FloatingCard>

        <FloatingCard style={{ top: '28%', left: '0%' }} delay={0.6}>
          <div style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 4 }}>🤖 AI replied</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>&ldquo;Check #roles to self-assign&rdquo;</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>Ticket #0042 · just now</div>
        </FloatingCard>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        animation: 'bounce 2s ease-in-out infinite',
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(31,167,187,0.5), transparent)' }} />
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.08); opacity:1; } }
        @keyframes bounce { 0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(8px); } }
        @keyframes floatA { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(-14px) rotate(2deg); } }
        @keyframes floatB { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        @keyframes countUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </section>
  );
}

/* ── Setup guide button ─────────────────────────────────────── */
function SetupBtn() {
  const [hov, setHov] = useState(false);
  return (
    <Link href="/commands"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: hov ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 15,
        padding: '13px 26px', borderRadius: 999, textDecoration: 'none',
        transition: 'all 0.2s',
      }}>
      <span style={{ fontSize: 16 }}>⚡</span> Setup guide
    </Link>
  );
}

/* ── Bot Mascot ─────────────────────────────────────────────── */
function BotMascot({ tick }: { tick: number }) {
  const float = Math.sin(tick * 0.025) * 10;
  const tilt = Math.sin(tick * 0.02) * 3;
  return (
    <div style={{
      position: 'relative', zIndex: 2,
      transform: `translateY(${float}px) rotate(${tilt}deg)`,
      transition: 'transform 0.08s linear',
    }}>
      {/* Shield body */}
      <svg width="180" height="200" viewBox="0 0 180 200" fill="none">
        {/* Outer glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1FA7BB" />
            <stop offset="100%" stopColor="#0d7a8a" />
          </linearGradient>
        </defs>
        {/* Body */}
        <ellipse cx="90" cy="110" rx="70" ry="75" fill="url(#bodyGrad)" opacity="0.9" filter="url(#glow)" />
        {/* Face */}
        <circle cx="65" cy="95" r="14" fill="white" opacity="0.95" />
        <circle cx="115" cy="95" r="14" fill="white" opacity="0.95" />
        <circle cx="67" cy="97" r="7" fill="#1FA7BB" />
        <circle cx="117" cy="97" r="7" fill="#1FA7BB" />
        <circle cx="69" cy="94" r="3" fill="white" />
        <circle cx="119" cy="94" r="3" fill="white" />
        {/* Smile */}
        <path d="M 72 118 Q 90 132 108 118" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Ears/antennas */}
        <circle cx="28" cy="75" r="12" fill="#1FA7BB" opacity="0.7" />
        <circle cx="152" cy="75" r="12" fill="#1FA7BB" opacity="0.7" />
        {/* Arms */}
        <ellipse cx="20" cy="120" rx="10" ry="18" fill="#1FA7BB" opacity="0.6" transform="rotate(-15 20 120)" />
        <ellipse cx="160" cy="120" rx="10" ry="18" fill="#1FA7BB" opacity="0.6" transform="rotate(15 160 120)" />
        {/* Layer text on chest */}
        <text x="90" y="140" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" opacity="0.8" letterSpacing="2">LAYER</text>
        {/* Feet */}
        <ellipse cx="68" cy="180" rx="20" ry="10" fill="#0d7a8a" />
        <ellipse cx="112" cy="180" rx="20" ry="10" fill="#0d7a8a" />
      </svg>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 16, borderRadius: '50%',
        background: 'rgba(31,167,187,0.2)', filter: 'blur(8px)',
        opacity: 0.5 + Math.sin(tick * 0.025) * 0.2,
      }} />
    </div>
  );
}

/* ── Floating card ──────────────────────────────────────────── */
function FloatingCard({ children, style, delay }: { children: ReactNode; style: React.CSSProperties; delay: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setTimeout(() => { const i = setInterval(() => setTick(v => v + 1), 60); return () => clearInterval(i); }, delay * 1000); return () => clearTimeout(t); }, [delay]);
  const float = Math.sin(tick * 0.02) * 6;
  return (
    <div style={{
      position: 'absolute', zIndex: 3,
      background: 'rgba(16,16,20,0.85)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '12px 16px',
      backdropFilter: 'blur(12px)',
      transform: `translateY(${float}px)`,
      transition: 'transform 0.06s linear',
      minWidth: 160,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Stats Bar ──────────────────────────────────────────────── */
function StatsBar() {
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '40px 48px',
      display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.01)',
    }}>
      {[
        { value: 10000, suffix: '+', label: 'Threats Blocked' },
        { value: 99, suffix: '.9%', label: 'Uptime' },
        { value: 2, suffix: ' min', label: 'Average Setup' },
        { value: 0, suffix: ' IPs', label: 'Data Collected' },
      ].map(s => (
        <Appear key={s.label} delay={0}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#F5F4F5', letterSpacing: '-0.04em', lineHeight: 1 }}>
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
          </div>
        </Appear>
      ))}
    </section>
  );
}

/* ── Feature Section ─────────────────────────────────────────── */
function FeatureSection({ tag, title, desc, bullets, visual, reverse, color = T }: {
  tag: string; title: string; desc: string; bullets: string[];
  visual: ReactNode; reverse?: boolean; color?: string;
}) {
  return (
    <section style={{ padding: '100px 48px', maxWidth: 1180, margin: '0 auto' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
        direction: reverse ? 'rtl' : 'ltr',
      }}>
        <div style={{ direction: 'ltr' }}>
          <Appear from={reverse ? 'right' : 'left'}>
            <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>{tag}</span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#F5F4F5', lineHeight: 1.08, marginBottom: 20 }}>{title}</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 32, maxWidth: 440 }}>{desc}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bullets.map(b => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
                  <span style={{ color, marginTop: 2, flexShrink: 0, fontWeight: 700 }}>✓</span>{b}
                </li>
              ))}
            </ul>
          </Appear>
        </div>
        <Appear from={reverse ? 'left' : 'right'} delay={0.15}>
          <div style={{ direction: 'ltr' }}>{visual}</div>
        </Appear>
      </div>
    </section>
  );
}

/* ── Visual Components ───────────────────────────────────────── */
function ScamVisual() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(v => (v + 1) % 4), 1500); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: '#0e0e12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {['#EF4444', '#F59E0B', '#22C55E'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>#general</span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Scam message */}
        <div style={{
          background: step >= 1 ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${step >= 1 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 10, padding: '10px 12px',
          transition: 'all 0.4s ease',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Scan line */}
          {step === 1 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: T, animation: 'scan 1s linear' }} />}
          <div style={{ fontSize: 12, color: step >= 2 ? '#EF4444' : 'rgba(255,255,255,0.5)', fontWeight: step >= 2 ? 700 : 400, display: 'flex', gap: 8 }}>
            {step >= 2 && <span>🚨</span>}
            <span style={{ textDecoration: step >= 2 ? 'line-through' : 'none' }}>FREE NITRO — discord.gift/abc123 Click now!!</span>
          </div>
          {step >= 2 && <div style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>Phishing link detected · Deleted in 0.3s</div>}
        </div>
        {/* Bot response */}
        {step >= 3 && (
          <div style={{ display: 'flex', gap: 8, animation: 'slideIn 0.3s ease' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: T2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🛡</div>
            <div style={{ background: T2, border: `1px solid rgba(31,167,187,0.2)`, borderRadius: '0 8px 8px 8px', padding: '8px 12px', fontSize: 13, color: T }}>
              Scam deleted — members protected ✓
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
          {[['98%', 'AI Confidence'], ['0.3s', 'Reaction Time']].map(([v, l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#F5F4F5' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes scan { from { top:0; } to { top:100%; } }`}</style>
    </div>
  );
}

function BanVisual() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 800); const i = setInterval(() => { setShow(false); setTimeout(() => setShow(true), 600); }, 4000); return () => { clearTimeout(t); clearInterval(i); }; }, []);
  return (
    <div style={{ background: '#0e0e12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ban Evasion Detected</div>
      {[{ name: 'BadUser#1234', tag: 'BANNED', c: '#EF4444' }, { name: 'NewUser#9876', tag: 'AUTO-BANNED', c: '#EF4444' }].map((u, i) => (
        <div key={u.name}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
            opacity: (i === 1 && !show) ? 0 : 1,
            transform: (i === 1 && !show) ? 'translateY(8px)' : 'translateY(0)',
            transition: 'all 0.5s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 13, color: '#F5F4F5' }}>{u.name}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: u.c, background: `${u.c}15`, padding: '3px 8px', borderRadius: 4 }}>{u.tag}</span>
          </div>
          {i === 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <span style={{ fontSize: 10, color: T, fontWeight: 700, padding: '2px 10px', background: T2, borderRadius: 4 }}>98% match</span>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>6 evaders caught this week</div>
    </div>
  );
}

function TicketVisual() {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = [
    { from: 'user', text: "Hey I can't access the server channels" },
    { from: 'bot', text: "I scanned your server — check #roles to self-assign your access roles!" },
    { from: 'system', text: '— Staff joined · AI stepped back —' },
  ];
  useEffect(() => { const t = setInterval(() => setMsgIdx(v => Math.min(v + 1, msgs.length - 1)), 1800); return () => clearInterval(t); }, [msgs.length]);
  return (
    <div style={{ background: '#0e0e12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>🎫</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>#ticket-0042</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} /> Active
        </span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 160 }}>
        {msgs.slice(0, msgIdx + 1).map((m, i) => (
          <div key={i} style={{ animation: 'slideIn 0.3s ease' }}>
            {m.from === 'system' ? (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '4px 0' }}>{m.text}</div>
            ) : (
              <div style={{ display: 'flex', gap: 8, justifyContent: m.from === 'bot' ? 'flex-end' : 'flex-start' }}>
                {m.from === 'user' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />}
                <div style={{
                  background: m.from === 'bot' ? T2 : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${m.from === 'bot' ? 'rgba(31,167,187,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: m.from === 'bot' ? '8px 0 8px 8px' : '0 8px 8px 8px',
                  padding: '8px 12px', fontSize: 13,
                  color: m.from === 'bot' ? T : 'rgba(255,255,255,0.7)',
                  maxWidth: '80%',
                }}>{m.text}</div>
                {m.from === 'bot' && <div style={{ width: 24, height: 24, borderRadius: '50%', background: T2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🤖</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModVisual() {
  const rules = [
    { label: 'Spam Detection', on: true }, { label: 'Caps Filter', on: true },
    { label: 'Link Filter', on: false }, { label: 'Invite Links', on: true },
    { label: 'Emoji Spam', on: false },
  ];
  return (
    <div style={{ background: '#0e0e12', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F4F5', marginBottom: 14 }}>Auto-Moderation Rules</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rules.map(r => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px', borderRadius: 9,
            background: r.on ? 'rgba(31,167,187,0.05)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${r.on ? 'rgba(31,167,187,0.15)' : 'rgba(255,255,255,0.05)'}`,
            transition: 'all 0.3s',
          }}>
            <span style={{ fontSize: 13, color: r.on ? '#F5F4F5' : 'rgba(255,255,255,0.3)' }}>{r.label}</span>
            <div style={{ width: 34, height: 19, borderRadius: 10, background: r.on ? T : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.3s' }}>
              <div style={{ position: 'absolute', top: 2.5, width: 14, height: 14, borderRadius: '50%', background: '#fff', left: r.on ? 18 : 2.5, transition: 'left 0.3s' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '9px 12px', background: T2, borderRadius: 8, fontSize: 12, color: T }}>
        ✓ All configurable from dashboard — no code
      </div>
    </div>
  );
}

/* ── Security Section ────────────────────────────────────────── */
function SecuritySection() {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 48px 100px' }}>
      <Appear>
        <div style={{
          background: 'linear-gradient(135deg, rgba(31,167,187,0.08) 0%, rgba(31,167,187,0.02) 100%)',
          border: '1px solid rgba(31,167,187,0.18)',
          borderRadius: 24, padding: '60px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: T, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>Privacy-First</span>
            <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', color: '#F5F4F5', lineHeight: 1.08, marginBottom: 16 }}>
              Zero data collected.<br /><span style={{ color: T }}>Verification stays in Discord.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 24 }}>
              Unlike Double Counter (28M users exposed), Layer never routes users to external websites. We can&apos;t log IPs or emails even if we wanted to.
            </p>
            <Link href="/security" style={{ color: T, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              Read our security whitepaper →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '🔒', t: 'No external website', d: 'Verification stays inside Discord' },
              { icon: '📵', t: 'No IP logging', d: 'Users are never redirected' },
              { icon: '📧', t: 'No emails stored', d: 'Zero contact info collected' },
              { icon: '🛡️', t: 'GDPR Ready', d: 'Minimal data policy' },
            ].map(item => (
              <div key={item.t} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '18px 16px', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(31,167,187,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F4F5', marginBottom: 3 }}>{item.t}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      </Appear>
    </section>
  );
}

/* ── Features Grid ───────────────────────────────────────────── */
function FeaturesGrid() {
  const features = [
    { icon: '🔍', title: 'AI Scam Detection', desc: 'OCR + pattern matching. Phishing, fake nitro, crypto scams — deleted in milliseconds.' },
    { icon: '🚫', title: 'Ban Evasion', desc: 'Rejoining with a new account? Detected and removed automatically.' },
    { icon: '🎫', title: 'AI Ticket Routing', desc: 'Scans your whole server, replies instantly, hands off to staff silently.' },
    { icon: '⚙️', title: 'Auto-Moderation', desc: '8 individually configurable rules. All from the dashboard.' },
    { icon: '📈', title: 'Leveling System', desc: 'XP, streaks, achievements, leaderboards, custom rank cards.' },
    { icon: '🎵', title: 'Music Player', desc: 'YouTube audio, queue management, full controls.' },
    { icon: '✅', title: 'Verification', desc: 'CAPTCHA entirely inside Discord. Zero data collected.' },
    { icon: '👻', title: 'Ghost Cleaner', desc: 'Remove inactive members automatically after configurable warnings.' },
  ];
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 48px 100px' }} id="features">
      <Appear>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', color: '#F5F4F5', marginBottom: 12 }}>Everything your server needs.</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>8 modules. 1 bot. Free forever.</p>
        </div>
      </Appear>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {features.map((f, i) => (
          <Appear key={f.title} delay={(i % 4) * 0.06}>
            <div style={{
              background: '#0e0e12', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '22px', cursor: 'default',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(31,167,187,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(31,167,187,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#0e0e12'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F4F5', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          </Appear>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 48px 120px' }}>
      <Appear>
        <div style={{
          background: 'linear-gradient(135deg, rgba(31,167,187,0.1) 0%, rgba(31,167,187,0.03) 100%)',
          border: '1px solid rgba(31,167,187,0.18)',
          borderRadius: 28, padding: '72px 56px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(31,167,187,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#F5F4F5', marginBottom: 16, position: 'relative' }}>
            You&apos;ve seen how Layer works.<br /><span style={{ color: T }}>Now put it to work.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginBottom: 40, position: 'relative' }}>
            Add to your server in 2 minutes. Configure what you need. Let it run.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative', flexWrap: 'wrap' }}>
            <AddBtn large />
            <SetupBtn />
          </div>
        </div>
      </Appear>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '52px 48px 36px', maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 44 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Image src="/logo.png" alt="Layer" width={22} height={22} style={{ objectFit: 'contain' }} />
            <span style={{ color: '#F5F4F5', fontWeight: 800, fontSize: 15 }}>Layer</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.75, maxWidth: 250, marginBottom: 20 }}>The last Discord bot you&apos;ll ever need.</p>
          <AddBtn />
        </div>
        {[
          { t: 'Product', l: [['Features', '#features'], ['Pricing', '/premium'], ['Commands', '/commands'], ['Security', '/security']] },
          { t: 'Legal', l: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/refunds']] },
          { t: 'Support', l: [['Dashboard', '/dashboard'], ['Contact', 'mailto:support@uselayer.de']] },
        ].map(col => (
          <div key={col.t}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{col.t}</div>
            {col.l.map(([label, href]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <Link href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>{label}</Link>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© 2026 Layer. All rights reserved.</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>Made with ❤️ by the Layer Team</span>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: '#06060a', minHeight: '100vh', color: '#F5F4F5' }}>
      <Nav />
      <Hero />
      <StatsBar />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />
      <FeatureSection tag="01 — AI Scam Detection" title="Scams deleted before anyone sees them." desc="Every image and message scanned in real time. Phishing, fake nitro, crypto scams — gone in milliseconds automatically." bullets={['Reads text inside images (OCR)', 'Detects phishing links and fake Discord gifts', 'Auto-deletes before members can click', 'Logs to your moderation channel']} visual={<ScamVisual />} />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />
      <FeatureSection tag="02 — Ban Evasion Tracking" title="Banned once. Banned forever." desc="Layer tracks patterns and recognizes returning bad actors even with new accounts. No staff action needed, ever." bullets={['Pattern matching across behavioral signals', 'Automatic re-ban on rejoin detection', 'Works months after original ban', 'Sticky punishment — survives server leave']} visual={<BanVisual />} reverse color="#EF4444" />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />
      <FeatureSection tag="03 — AI Ticket System" title="Support that never sleeps." desc="Layer scans your entire server structure before replying. Context-aware answers, instant response, silent handoff to staff." bullets={['Full server scan before first reply', 'Context-aware responses per server', 'Silent handoff when staff joins', 'Escalates automatically']} visual={<TicketVisual />} color="#A855F7" />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />
      <FeatureSection tag="04 — Auto-Moderation" title="8 individually configurable rules." desc="Spam, caps, invite links, mention spam — every rule is a separate toggle. Enable only what you need." bullets={['Spam, caps, links, invites, mentions, emojis', 'Custom action per rule', 'Whitelist channels and roles', 'No code — all from dashboard']} visual={<ModVisual />} reverse color="#22C55E" />
      <SecuritySection />
      <FeaturesGrid />
      <CTA />
      <Footer />
    </div>
  );
}
