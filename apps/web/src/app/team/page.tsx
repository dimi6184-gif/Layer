'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

/* ─── Brand (matches homepage exactly) ─────────────────────── */
const BG    = '#07080c';
const CARD  = '#0f1118';
const TEAL  = '#1FA7BB';
const TEAL2 = 'rgba(31,167,187,0.12)';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT  = '#f1f3f9';
const MUTED = 'rgba(255,255,255,0.42)';

/* ─── Fade hook ─────────────────────────────────────────────── */
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

function Fade({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const { ref, vis } = useAppear();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─── Team data ─────────────────────────────────────────────── */
const TEAM = [
  {
    name: 'Dimi',
    handle: 'BlabyMk',
    role: 'Founder & Developer',
    bio: 'Built Layer from scratch. Handles everything from the bot core to the dashboard and infrastructure.',
    avatar: null, // will use initials
    color: TEAL,
    badge: 'Founder',
    badgeColor: TEAL,
    links: {
      discord: 'https://discord.gg/W2XjhvBbtn',
    },
    tags: ['Bot Dev', 'Full Stack', 'Security'],
  },
];

/* ─── Navbar (simplified, matches homepage style) ─────────────── */
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
      height: 56, display: 'flex', alignItems: 'center', padding: '0 40px',
      background: scrolled ? 'rgba(7,8,12,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
      transition: 'all 0.3s',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
        <Image src="/logo.png" alt="Layer" width={24} height={24} style={{ objectFit: 'contain' }} />
        <span style={{ color: TEXT, fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>Layer</span>
      </Link>
      <div style={{ flex: 1 }} />
      <Link href="/" style={{
        fontSize: 13, color: MUTED, textDecoration: 'none', transition: 'color 0.15s',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
        onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
        onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
        ← Back to home
      </Link>
    </nav>
  );
}

/* ─── Avatar ────────────────────────────────────────────────── */
function Avatar({ name, color, size = 96 }: { name: string; color: string; size?: number }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}18`,
      border: `2px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 800,
      color,
      letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ─── Member card ────────────────────────────────────────────── */
function MemberCard({ member, index }: { member: typeof TEAM[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Fade delay={index * 0.1}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? '#13151c' : CARD,
          border: `1px solid ${hov ? 'rgba(31,167,187,0.22)' : BORDER}`,
          borderRadius: 20,
          padding: '32px 28px',
          display: 'flex', flexDirection: 'column', gap: 20,
          transition: 'all 0.22s ease',
          transform: hov ? 'translateY(-4px)' : 'none',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle teal glow top-right on hover */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle, ${member.color}${hov ? '16' : '08'} 0%, transparent 70%)`,
          transition: 'all 0.3s',
          pointerEvents: 'none',
        }} />

        {/* Top row — avatar + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Avatar name={member.name} color={member.color} size={72} />
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: member.badgeColor,
            background: `${member.badgeColor}16`,
            border: `1px solid ${member.badgeColor}30`,
            borderRadius: 999, padding: '3px 10px',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {member.badge}
          </span>
        </div>

        {/* Name + handle + role */}
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', marginBottom: 2 }}>
            {member.name}
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>@{member.handle}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: member.color }}>
            {member.role}
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, margin: 0 }}>
          {member.bio}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {member.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: 'rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: '3px 9px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Discord link */}
        {member.links.discord && (
          <a href={member.links.discord} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 12.5, color: MUTED, textDecoration: 'none',
            borderTop: `1px solid ${BORDER}`, paddingTop: 16,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
            <svg width="14" height="11" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Join our Discord
          </a>
        )}
      </div>
    </Fade>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function TeamPage() {
  return (
    <div style={{
      background: BG, minHeight: '100vh', color: TEXT,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: '140px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <Fade>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: TEAL,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              The Team
            </div>
          </div>
          <h1 style={{
            fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 900,
            letterSpacing: '-0.04em', lineHeight: 1.05,
            color: TEXT, margin: '0 0 20px',
          }}>
            The people building<br />
            <span style={{ color: TEAL }}>Layer.</span>
          </h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
            A small, focused team obsessed with keeping Discord servers clean and their communities safe.
          </p>
        </Fade>
      </section>

      {/* Team grid */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Single card centered for solo founder — scales to grid when more members join */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 380px))',
          gap: 20,
        }}>
          {TEAM.map((member, i) => (
            <MemberCard key={member.handle} member={member} index={i} />
          ))}

          {/* Open position placeholder */}
          <Fade delay={0.15}>
            <div style={{
              background: 'transparent',
              border: `1px dashed rgba(255,255,255,0.1)`,
              borderRadius: 20, padding: '32px 28px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, minHeight: 280, textAlign: 'center',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: `1px dashed rgba(255,255,255,0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: 'rgba(255,255,255,0.2)',
              }}>+</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.2)' }}>
                Open position
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', lineHeight: 1.6 }}>
                We&apos;re growing.<br />Maybe that&apos;s you.
              </div>
              <a href="https://discord.gg/W2XjhvBbtn" target="_blank" rel="noopener noreferrer" style={{
                fontSize: 12, color: TEAL, textDecoration: 'none',
                border: `1px solid rgba(31,167,187,0.3)`,
                borderRadius: 999, padding: '6px 16px',
                transition: 'background 0.15s',
              }}>
                Get in touch →
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '0 40px 96px', maxWidth: 1100, margin: '0 auto' }}>
        <Fade>
          <div style={{
            background: `linear-gradient(135deg, ${TEAL2} 0%, rgba(31,167,187,0.04) 100%)`,
            border: `1px solid rgba(31,167,187,0.18)`,
            borderRadius: 20, padding: '48px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            <div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 900, letterSpacing: '-0.03em', color: TEXT, marginBottom: 8 }}>
                Want to join the team?
              </h2>
              <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
                Drop by our Discord and say hi.
              </p>
            </div>
            <a href="https://discord.gg/W2XjhvBbtn" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: TEAL, color: '#080808', fontWeight: 700,
              fontSize: 14, padding: '12px 24px', borderRadius: 999,
              textDecoration: 'none', transition: 'opacity 0.15s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Join Discord
            </a>
          </div>
        </Fade>
      </section>

      {/* Footer line */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Layer. All rights reserved.</span>
        <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = MUTED)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
