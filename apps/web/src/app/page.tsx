'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// ─── Teal brand color ──────────────────────────────────────────
const T = '#1FA7BB';
const T2 = 'rgba(31,167,187,0.12)';

// ─── Nav ───────────────────────────────────────────────────────
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
      padding: '0 40px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(8,8,8,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <Image src="/logo.png" alt="Layer" width={28} height={28} style={{ objectFit: 'contain' }} />
        <span style={{ color: '#F5F4F5', fontWeight: 700, fontSize: 16 }}>Layer</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {[
          { label: 'Features', href: '#features' },
          { label: 'Security', href: '/security' },
          { label: 'Pricing', href: '/premium' },
          { label: 'Commands', href: '/commands' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 500,
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/dashboard" style={{
          color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
        }}>Sign in</Link>
        <Link href="/dashboard" style={{
          background: T, color: '#080808', fontSize: 14, fontWeight: 600,
          padding: '8px 20px', borderRadius: 999, textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}>Add to Discord</Link>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      paddingTop: 160, paddingBottom: 120,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '160px 24px 120px',
    }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(31,167,187,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 14px', borderRadius: 999, marginBottom: 28,
        background: T2, border: `1px solid rgba(31,167,187,0.3)`,
        fontSize: 12, fontWeight: 600, color: T, letterSpacing: '0.03em',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T, display: 'inline-block' }} />
        Early Access — Join the first 1,000 servers
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(44px, 8vw, 82px)', fontWeight: 800,
        lineHeight: 1.03, letterSpacing: '-0.04em',
        color: '#F5F4F5', maxWidth: 900, margin: '0 auto 24px',
      }}>
        Your Discord server,<br />
        <span style={{ color: T }}>finally under control.</span>
      </h1>

      <p style={{
        fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 500,
        lineHeight: 1.7, margin: '0 auto 40px',
      }}>
        AI moderation, anti-scam protection, ban evasion tracking — all in one bot. Free to start.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/dashboard" style={{
          background: T, color: '#080808', fontWeight: 700, fontSize: 15,
          padding: '13px 32px', borderRadius: 999, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          Add to Discord — It&apos;s Free →
        </Link>
        <Link href="#features" style={{
          background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
          fontWeight: 600, fontSize: 15,
          padding: '13px 28px', borderRadius: 999, textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          See features
        </Link>
      </div>

      {/* Trust row */}
      <div style={{
        display: 'flex', gap: 28, justifyContent: 'center',
        marginTop: 48, flexWrap: 'wrap',
      }}>
        {['Free to start', 'No credit card', 'Zero data stored', 'Setup in 2 minutes'].map(t => (
          <span key={t} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: T }}>✓</span> {t}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: '10K+', label: 'Threats Blocked' },
    { value: '<100ms', label: 'Detection Speed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '2 min', label: 'Average Setup' },
  ];
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '32px 40px',
      display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap',
    }}>
      {stats.map(s => (
        <div key={s.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#F5F4F5', letterSpacing: '-0.03em' }}>{s.value}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
        </div>
      ))}
    </section>
  );
}

// ─── Feature Section (alternating layout) ─────────────────────
interface FeatureProps {
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
  color?: string;
}

function FeatureSection({ tag, title, description, bullets, visual, reverse, color = T }: FeatureProps) {
  return (
    <section style={{
      padding: '100px 40px',
      maxWidth: 1100, margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'center',
      direction: reverse ? 'rtl' : 'ltr',
    }}>
      <div style={{ direction: 'ltr' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color,
          display: 'block', marginBottom: 16,
        }}>{tag}</span>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
          letterSpacing: '-0.03em', color: '#F5F4F5',
          lineHeight: 1.1, marginBottom: 18,
        }}>{title}</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
          {description}
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bullets.map(b => (
            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
              <span style={{ color, marginTop: 2, flexShrink: 0 }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ direction: 'ltr' }}>{visual}</div>
    </section>
  );
}

// ─── Mock Discord UI visuals ───────────────────────────────────
function ScamVisual() {
  return (
    <div style={{
      background: '#111113', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: 20, fontFamily: 'monospace',
    }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
        #general
      </div>
      {/* Fake scam message */}
      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 4, fontWeight: 600 }}>⚠ SCAM DETECTED</div>
        <div style={{ fontSize: 12, color: 'rgba(239,68,68,0.7)', textDecoration: 'line-through' }}>
          FREE NITRO discord.gift/xyz123
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>Deleted in 0.3s — Phishing link</div>
      </div>
      {/* Normal message */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: T2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, color: T, fontWeight: 600, marginBottom: 2 }}>Layer Bot</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>🛡️ Scam deleted before anyone saw it.</div>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
        {[['98%', 'Confidence'], ['0.3s', 'Detection time']].map(([v, l]) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#F5F4F5' }}>{v}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BanEvasionVisual() {
  return (
    <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ban Evasion Detected</div>
      {[
        { name: 'BadUser#1234', status: 'BANNED', color: '#EF4444' },
        { name: 'NewUser#9876', status: 'AUTO-BANNED', color: '#EF4444' },
      ].map((u, i) => (
        <div key={u.name}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 8,
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 13, color: '#F5F4F5' }}>{u.name}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: u.color, background: `${u.color}15`, padding: '3px 8px', borderRadius: 4 }}>{u.status}</span>
          </div>
          {i === 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 1, height: 12, background: `${T}60` }} />
                <span style={{ fontSize: 10, color: T, fontWeight: 600, padding: '2px 8px', background: T2, borderRadius: 4 }}>98% match</span>
                <div style={{ width: 1, height: 12, background: `${T}60` }} />
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        6 ban evaders caught this week · 0 false positives
      </div>
    </div>
  );
}

function TicketVisual() {
  return (
    <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        🎫 <span>#ticket-0042</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0 8px 8px 8px', padding: '8px 12px', fontSize: 13, color: 'rgba(255,255,255,0.7)', maxWidth: '80%' }}>
            Hey, I can&apos;t access the server after the update
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <div style={{ background: T2, border: `1px solid rgba(31,167,187,0.2)`, borderRadius: '8px 0 8px 8px', padding: '8px 12px', fontSize: 13, color: T, maxWidth: '80%' }}>
            I can help! This usually happens after a role sync. I&apos;ve flagged this for staff — check #roles to self-assign.
          </div>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: T2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🤖</div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '4px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          — Staff joined — AI stepped back silently
        </div>
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
        {[['✓ Replied', '0.4s', T], ['✓ Server scanned', '42 channels', 'rgba(255,255,255,0.3)']].map(([l, v, c]) => (
          <div key={String(l)} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: c as string }}>{l}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#F5F4F5', marginTop: 1 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModVisual() {
  const rules = [
    { label: 'Spam Detection', active: true },
    { label: 'Caps Filter', active: true },
    { label: 'Link Filter', active: false },
    { label: 'Invite Links', active: true },
    { label: 'Emoji Spam', active: false },
  ];
  return (
    <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F4F5', marginBottom: 14 }}>Auto-Moderation Rules</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rules.map(r => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: 13, color: r.active ? '#F5F4F5' : 'rgba(255,255,255,0.35)' }}>{r.label}</span>
            <div style={{
              width: 32, height: 18, borderRadius: 9,
              background: r.active ? T : 'rgba(255,255,255,0.1)',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: 2, width: 14, height: 14, borderRadius: '50%', background: '#fff',
                left: r.active ? 16 : 2, transition: 'left 0.2s',
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '8px 12px', background: T2, borderRadius: 8, fontSize: 12, color: T }}>
        ✓ Dashboard-configured — no code needed
      </div>
    </div>
  );
}

// ─── Security section ─────────────────────────────────────────
function SecuritySection() {
  return (
    <section style={{
      maxWidth: 1100, margin: '0 auto', padding: '80px 40px',
    }}>
      <div style={{
        background: 'rgba(31,167,187,0.05)', border: '1px solid rgba(31,167,187,0.15)',
        borderRadius: 20, padding: '48px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: T, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            Privacy-First
          </span>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F4F5', lineHeight: 1.1, marginBottom: 16 }}>
            Zero data collected.<br />Verification stays in Discord.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 24 }}>
            Unlike Double Counter (28M users exposed in 2023), Layer never routes users to external websites. Verification happens entirely inside Discord — we can&apos;t log IPs or emails even if we wanted to.
          </p>
          <Link href="/security" style={{ color: T, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Read our security whitepaper →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '🔒', title: 'No external website', desc: 'Verification stays in Discord' },
            { icon: '📵', title: 'No IP logging', desc: 'Users are never redirected' },
            { icon: '📧', title: 'No emails', desc: 'Zero contact info stored' },
            { icon: '🛡️', title: 'GDPR Ready', desc: 'Minimal data collection' },
          ].map(item => (
            <div key={item.title} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F4F5', marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features grid ────────────────────────────────────────────
function FeaturesGrid() {
  const features = [
    { icon: '🔍', title: 'AI Scam Detection', desc: 'OCR + pattern matching scans every image in real time. Phishing links, fake nitro, crypto scams — deleted before anyone sees them.' },
    { icon: '🚫', title: 'Ban Evasion Tracking', desc: 'Banned users who rejoin with new accounts are detected and removed automatically. No staff action needed.' },
    { icon: '🎫', title: 'AI Ticket Routing', desc: 'Layer scans your entire server structure and replies instantly to tickets. Hands off to staff silently when they join.' },
    { icon: '⚙️', title: 'Auto-Moderation', desc: 'Spam, caps, invite links, mention spam — 8 individually configurable rules. All from the dashboard.' },
    { icon: '📈', title: 'Leveling System', desc: 'XP for messages, voice, tickets. Streaks, achievements, leaderboards, and custom rank cards.' },
    { icon: '🎵', title: 'Music Player', desc: 'High quality audio from YouTube. Queue management, volume, skip — full controls included.' },
    { icon: '✅', title: 'Verification System', desc: 'CAPTCHA verification entirely inside Discord. No external website, no data collection.' },
    { icon: '👻', title: 'Ghost Cleaner', desc: 'Automatically identifies and removes inactive members after configurable warning periods.' },
  ];

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px 100px' }} id="features">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F4F5', marginBottom: 12 }}>
          Everything your server needs.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>8 modules. 1 bot. Free to start.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {features.map(f => (
          <div key={f.title} style={{
            background: '#111113', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'default',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(31,167,187,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F4F5', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Comparison ───────────────────────────────────────────────
function ComparisonSection() {
  const rows = [
    ['AI Scam Detection (OCR)', true, false],
    ['Ban Evasion Tracking', true, false],
    ['AI Ticket Routing', true, false],
    ['Zero Data Policy', true, false],
    ['Basic Auto-Moderation', true, true],
    ['Leveling System', true, true],
    ['Music Player', true, true],
    ['Price', '€0 Free', '€11.95/mo'],
  ];
  return (
    <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 40px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F4F5', marginBottom: 10 }}>
          Layer vs MEE6
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Why servers switch to Layer.</p>
      </div>
      <div style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Feature</span>
          <span style={{ fontSize: 11, color: T, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Layer</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MEE6</span>
        </div>
        {rows.map(([feat, layer, mee6], i) => (
          <div key={String(feat)} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: '12px 20px',
            borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{feat}</span>
            <span style={{ textAlign: 'center', fontSize: 13 }}>
              {typeof layer === 'boolean'
                ? <span style={{ color: layer ? T : '#EF4444' }}>{layer ? '✓' : '✗'}</span>
                : <span style={{ color: T, fontWeight: 700 }}>{layer}</span>
              }
            </span>
            <span style={{ textAlign: 'center', fontSize: 13 }}>
              {typeof mee6 === 'boolean'
                ? <span style={{ color: mee6 ? 'rgba(255,255,255,0.5)' : '#EF4444' }}>{mee6 ? '✓' : '✗'}</span>
                : <span style={{ color: 'rgba(255,255,255,0.4)' }}>{mee6}</span>
              }
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{
      maxWidth: 1100, margin: '0 auto', padding: '0 40px 120px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(31,167,187,0.12) 0%, rgba(31,167,187,0.04) 100%)',
        border: '1px solid rgba(31,167,187,0.2)',
        borderRadius: 24, padding: '64px 48px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F4F5', marginBottom: 16 }}>
          You&apos;ve seen how Layer works.<br />
          <span style={{ color: T }}>Now put it to work.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>
          Add it to your server in seconds. Configure what you need. Let it run.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{
            background: T, color: '#080808', fontWeight: 700, fontSize: 16,
            padding: '14px 36px', borderRadius: 999, textDecoration: 'none',
          }}>
            Add to Discord — Free →
          </Link>
          <Link href="/premium" style={{
            background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
            fontWeight: 600, fontSize: 15, border: '1px solid rgba(255,255,255,0.1)',
            padding: '14px 28px', borderRadius: 999, textDecoration: 'none',
          }}>
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 40px 32px', maxWidth: 1100, margin: '0 auto',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Image src="/logo.png" alt="Layer" width={22} height={22} style={{ objectFit: 'contain' }} />
            <span style={{ color: '#F5F4F5', fontWeight: 700, fontSize: 15 }}>Layer</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 260 }}>
            The last Discord bot you&apos;ll ever need.
          </p>
        </div>
        {[
          { title: 'Product', links: [['Features', '#features'], ['Pricing', '/premium'], ['Commands', '/commands'], ['Security', '/security']] },
          { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/refunds']] },
          { title: 'Support', links: [['Dashboard', '/dashboard'], ['Contact', 'mailto:support@uselayer.de']] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{col.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Layer. All rights reserved.</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Made with ❤️ by the Layer Team</span>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#F5F4F5' }}>
      <Nav />
      <Hero />
      <StatsBar />

      {/* Feature sections */}
      <FeatureSection
        tag="01 — AI Scam Detection"
        title="Scams deleted before anyone sees them."
        description="Every image and message scanned in real time using OCR and pattern matching. Phishing links, fake giveaways, crypto scams — gone in milliseconds."
        bullets={[
          'Reads text inside images (OCR technology)',
          'Detects phishing links and fake Discord gifts',
          'Auto-deletes before members can click anything',
          'Logs to your moderation channel',
        ]}
        visual={<ScamVisual />}
      />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />

      <FeatureSection
        tag="02 — Ban Evasion Tracking"
        title="Banned users can't just create a new account."
        description="Layer tracks patterns and recognizes returning bad actors even when they show up with a brand new profile. Banned once, banned forever."
        bullets={[
          'Pattern matching across behavioral signals',
          'Automatic re-ban on rejoin detection',
          'Works even months after original ban',
          'No manual staff action needed',
        ]}
        visual={<BanEvasionVisual />}
        reverse
        color="#EF4444"
      />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />

      <FeatureSection
        tag="03 — AI Ticket System"
        title="Support that never sleeps."
        description="Layer scans your entire server — every channel, category, and role — before a ticket even opens. Replies instantly with context-aware answers, hands off to staff silently."
        bullets={[
          'Scans full server structure before responding',
          'Understands your community context',
          'Instant reply, then silent handoff to staff',
          'Escalates automatically when needed',
        ]}
        visual={<TicketVisual />}
        color="#A855F7"
      />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />

      <FeatureSection
        tag="04 — Auto-Moderation"
        title="8 individually configurable rules."
        description="Spam, caps abuse, invite links, mention spam, emoji floods — every rule is a separate toggle in your dashboard. Enable only what you need."
        bullets={[
          'Spam, caps, links, invites, mentions, emojis',
          'Custom action per rule (delete/warn/timeout/ban)',
          'Whitelist channels and roles',
          'No code required — all from dashboard',
        ]}
        visual={<ModVisual />}
        reverse
        color="#22C55E"
      />

      <SecuritySection />

      <FeaturesGrid />

      <ComparisonSection />

      <CTA />

      <Footer />
    </div>
  );
}
