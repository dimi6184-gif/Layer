'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MODULES = [
  {
    icon: '👋',
    title: 'Welcome messages',
    sub: 'Module active',
    subColor: '#3ddc97',
    right: <Toggle on />,
  },
  {
    icon: '🛡',
    title: 'Verification',
    sub: '1,265 members verified',
    subColor: '#64748b',
    right: <Dot />,
  },
  {
    icon: '🎫',
    title: 'Support ticket',
    sub: '#482',
    subColor: '#64748b',
    right: <Pill label="Solved" color="#3ddc97" />,
  },
  {
    icon: '⭐',
    title: 'Layer Pro',
    sub: 'Your server, fully protected',
    subColor: '#64748b',
    right: <Pill label="Active" color="#3ddc97" />,
    highlight: true,
  },
];

function Toggle({ on }: { on?: boolean }) {
  return (
    <div style={{
      width: 36, height: 21, borderRadius: 999,
      background: on ? '#5865F2' : '#2a2d3a',
      position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, width: 15, height: 15,
        borderRadius: '50%', background: '#fff',
        left: on ? 18 : 3, transition: 'left 0.2s',
      }} />
    </div>
  );
}

function Dot() {
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5865F2', flexShrink: 0 }} />;
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color,
      background: `${color}18`,
      border: `1px solid ${color}30`,
      borderRadius: 999, padding: '2px 8px', flexShrink: 0,
    }}>{label}</span>
  );
}

function ModuleCard({ icon, title, sub, subColor, right, highlight, delay }: {
  icon: string; title: string; sub: string; subColor: string;
  right: React.ReactNode; highlight?: boolean; delay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: highlight
        ? 'linear-gradient(135deg, rgba(88,101,242,0.18) 0%, rgba(31,167,187,0.10) 100%)'
        : 'rgba(20,22,34,0.85)',
      border: `1px solid ${highlight ? 'rgba(88,101,242,0.35)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 12, padding: '12px 14px',
      backdropFilter: 'blur(12px)',
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateX(0)' : 'translateX(-16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15,
      }}>{icon}</div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f3f9', lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 11, color: subColor, marginTop: 2 }}>{sub}</div>
      </div>

      {/* Right */}
      {right}
    </div>
  );
}

export default function LoginVisual() {
  return (
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #0d0e1a 0%, #0a0c16 40%, #07090f 100%)',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Radial glow blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%',
        width: 420, height: 420, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(88,101,242,0.18) 0%, transparent 65%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(31,167,187,0.12) 0%, transparent 65%)',
        filter: 'blur(32px)',
      }} />

      {/* Logo top-left */}
      <Link href="/" style={{ position: 'absolute', top: 24, left: 28, display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', zIndex: 10 }}>
        <Image src="/logo.png" alt="Layer" width={28} height={28} style={{ objectFit: 'contain' }} />
        <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f3f9', letterSpacing: '-0.02em' }}>Layer</span>
      </Link>

      {/* Centered module cards */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 40px 80px',
      }}>
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MODULES.map((m, i) => (
            <ModuleCard key={m.title} {...m} delay={200 + i * 120} right={m.right} />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{ padding: '0 28px 28px', position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#f1f3f9', lineHeight: 1.25, letterSpacing: '-0.03em', maxWidth: 260 }}>
          Configure your<br />server in one place.
        </p>
        <p style={{ fontSize: 13, color: '#4d5467', marginTop: 8, maxWidth: 260, lineHeight: 1.6 }}>
          Modules, moderation, tickets, server protection and more, all at a glance in one dashboard.
        </p>
      </div>
    </div>
  );
}
