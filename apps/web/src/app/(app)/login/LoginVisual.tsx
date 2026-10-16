'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* ─── Sub-components ─────────────────────────────────────────── */
function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/>
    </svg>
  );
}

function Toggle({ on }: { on?: boolean }) {
  return (
    <div style={{ width: 42, height: 24, borderRadius: 999, background: on ? '#5865F2' : '#2a2d3a', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 4, width: 16, height: 16, borderRadius: '50%', background: '#fff', left: on ? 22 : 4, transition: 'left 0.2s' }} />
    </div>
  );
}

function Dot() {
  return <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#5865F2', flexShrink: 0, boxShadow: '0 0 6px rgba(88,101,242,0.6)' }} />;
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>
      {label}
    </span>
  );
}

/* ─── Module data ────────────────────────────────────────────── */
const MODULES = [
  { icon: '👋',  svgIcon: null,          iconColor: undefined,  title: 'Welcome messages', sub: 'Module active',          subColor: '#3ddc97', right: <Toggle on />,                      highlight: false },
  { icon: null,  svgIcon: <ShieldIcon />, iconColor: '#1FA7BB',  title: 'Verification',     sub: '1,265 members verified', subColor: '#64748b', right: <Dot />,                            highlight: false },
  { icon: '🎫', svgIcon: null,           iconColor: undefined,  title: 'Support ticket',   sub: '#482',                   subColor: '#64748b', right: <Pill label="Solved" color="#3ddc97" />, highlight: false },
  { icon: '⭐', svgIcon: null,           iconColor: undefined,  title: 'Layer Pro',        sub: 'Your server, fully protected', subColor: '#64748b', right: <Pill label="Active" color="#3ddc97" />, highlight: true },
];

/* ─── Card component ─────────────────────────────────────────── */
function ModuleCard({ icon, svgIcon, title, sub, subColor, right, highlight, iconColor, delay, floatDelay }: {
  icon: string | null; svgIcon?: React.ReactNode; title: string; sub: string; subColor: string;
  right: React.ReactNode; highlight?: boolean; iconColor?: string; delay: number; floatDelay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      background: highlight
        ? 'linear-gradient(135deg, rgba(88,101,242,0.2) 0%, rgba(31,167,187,0.12) 100%)'
        : 'rgba(16,18,28,0.88)',
      border: `1px solid ${highlight ? 'rgba(88,101,242,0.38)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, padding: '16px 18px',
      backdropFilter: 'blur(16px)',
      boxShadow: highlight
        ? '0 4px 24px rgba(88,101,242,0.12)'
        : '0 2px 12px rgba(0,0,0,0.35)',
      /* slide-in on mount */
      opacity: vis ? 1 : 0,
      transform: vis ? `translateX(0)` : 'translateX(-20px)',
      transition: `opacity 0.55s ease ${delay * 0.001}s, transform 0.55s ease ${delay * 0.001}s`,
      /* CSS float animation — very subtle */
      animation: vis ? `login-float ${3.6 + floatDelay * 0.4}s ease-in-out ${floatDelay * 0.3}s infinite` : 'none',
    }}>
      {/* Icon box */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: iconColor ? `${iconColor}18` : 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, color: iconColor ?? '#f1f3f9',
      }}>
        {svgIcon ?? icon}
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f3f9', lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 12, color: subColor, marginTop: 3 }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
export default function LoginVisual() {
  return (
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #0d0e1a 0%, #0a0c16 40%, #07090f 100%)',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh',
    }}>

      {/* CSS keyframe for the float */}
      <style>{`
        @keyframes login-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>

      {/* ── Clean grid background ── */}

      {/* ── Radial glow blobs ── */}
      <div style={{ position: 'absolute', top: '8%', left: '15%', width: 380, height: 380, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(88,101,242,0.16) 0%, transparent 65%)', filter: 'blur(44px)' }} />
      <div style={{ position: 'absolute', bottom: '18%', right: '8%', width: 260, height: 260, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(31,167,187,0.11) 0%, transparent 65%)', filter: 'blur(32px)' }} />

      {/* ── Logo ── */}
      <Link href="/" style={{ position: 'absolute', top: 24, left: 28, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', zIndex: 10 }}>
        <Image src="/logo.png" alt="Layer" width={36} height={36} style={{ objectFit: 'contain' }} />
        <span style={{ fontWeight: 700, fontSize: 18, color: '#f1f3f9', letterSpacing: '-0.02em' }}>Layer</span>
      </Link>

      {/* ── Module cards — centered ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 44px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MODULES.map((m, i) => (
            <ModuleCard
              key={m.title}
              icon={m.icon}
              svgIcon={m.svgIcon}
              iconColor={m.iconColor}
              title={m.title}
              sub={m.sub}
              subColor={m.subColor}
              right={m.right}
              highlight={m.highlight}
              delay={180 + i * 110}
              floatDelay={i}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom tagline ── */}
      <div style={{ padding: '0 32px 36px', position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#f1f3f9', lineHeight: 1.2, letterSpacing: '-0.03em', maxWidth: 300 }}>
          Configure your<br />server in one place.
        </p>
        <p style={{ fontSize: 14, color: '#4d5467', marginTop: 10, maxWidth: 300, lineHeight: 1.65 }}>
          Modules, moderation, tickets, server protection and more, all at a glance in one dashboard.
        </p>
      </div>
    </div>
  );
}
