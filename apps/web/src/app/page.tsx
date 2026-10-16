'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Eye,
  Sliders,
  Check,
  ChevronDown,
  Volume2,
  Sparkles,
  Bot,
  ExternalLink,
  MessageSquare,
  Users,
  Lock,
  ArrowRight,
  Activity,
  Layers,
  Radio,
  Clock,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  HelpCircle,
  Hash,
} from 'lucide-react';

/* ─── Discord Gamepad SVG Icon ───────────────────────────────── */
function DiscordIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Interactive Verification Demo State
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verified'>('idle');

  // Interactive Switch States (Control Panel)
  const [switches, setSwitches] = useState({
    antiScam: true,
    antiRaid: true,
    ocrVision: true,
    botQuarantine: true,
    autoRestore: true,
  });

  const toggleSwitch = (key: keyof typeof switches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqs = [
    {
      q: 'Is Layer free to use?',
      a: 'Yes. Layer is completely free to invite and start protecting your server immediately. Essential protection, OCR anti-scam, leveling, and music are included without any required subscription.',
    },
    {
      q: 'Will Layer ban legitimate users by accident?',
      a: 'No. Layer uses multi-factor validation and high-confidence neural OCR thresholds. If a message or event is borderline, Layer quarantines or logs the incident rather than auto-banning.',
    },
    {
      q: 'Does Layer log member IP addresses or private messages?',
      a: 'Never. Layer is architected with a strict zero-telemetry policy. We do not store member IPs, private chat logs, or user emails. Everything runs in-memory.',
    },
    {
      q: 'How fast is setup?',
      a: 'Under 60 seconds. Simply invite the bot, grant recommended permissions, and Layer runs autonomous protection out-of-the-box with sensible defaults.',
    },
    {
      q: 'Can I customize punishment thresholds?',
      a: 'Yes. From your web dashboard at uselayer.de, you can configure whether Layer deletes the message, warns the user, times them out, or bans them immediately.',
    },
  ];

  return (
    <>
      {/* ─── PROTECTOR-INSPIRED EXACT CSS SYSTEM ──────────────────── */}
      <style jsx global>{`
        :root {
          --bg: #07080c;
          --bg-2: #0a0c12;
          --surface: #0f1118;
          --surface-2: #141722;
          --surface-3: #1a1e2b;
          --surface-hover: #1d2130;
          --line: rgba(255, 255, 255, 0.07);
          --line-2: rgba(255, 255, 255, 0.11);
          --line-3: rgba(255, 255, 255, 0.18);
          --text: #f1f3f9;
          --text-2: #aab1c5;
          --text-3: #737b91;
          --text-4: #4d5467;

          /* Layer Brand Colors */
          --brand: #1FA7BB;
          --brand-2: #25bdd3;
          --brand-soft: rgba(31, 167, 187, 0.14);
          --brand-line: rgba(31, 167, 187, 0.35);
          --brand-gradient: linear-gradient(135deg, #1FA7BB 0%, #178596 55%, #146c7a 100%);
          --glow-brand: 0 10px 40px -10px rgba(31, 167, 187, 0.55);

          --ok: #3ddc97;
          --ok-soft: rgba(61, 220, 151, 0.12);
          --warn: #ffc14d;
          --warn-soft: rgba(255, 193, 77, 0.12);
          --danger: #ff6b6b;
          --danger-soft: rgba(255, 107, 107, 0.12);

          --inner: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
          --shadow-md: 0 8px 24px -8px rgba(0, 0, 0, 0.6), 0 2px 6px -2px rgba(0, 0, 0, 0.4);
          --shadow-lg: 0 30px 80px -20px rgba(0, 0, 0, 0.75), 0 10px 30px -10px rgba(0, 0, 0, 0.5);

          --r-xs: 6px;
          --r-sm: 9px;
          --r-md: 12px;
          --r-lg: 16px;
          --r-xl: 22px;
          --r-2xl: 28px;
          --r-full: 999px;
        }

        /* ─── Buttons (Protector Precision 3D Bevel) ─── */
        .p-btn {
          height: 40px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          border: 1px solid transparent;
          border-radius: var(--r-sm);
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: -0.005em;
          white-space: nowrap;
          user-select: none;
          transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 140ms ease,
                      border-color 140ms ease,
                      box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1),
                      color 140ms ease;
        }
        .p-btn:active {
          transform: translateY(1px) scale(0.99);
        }
        .p-btn-lg {
          height: 48px;
          padding: 0 24px;
          font-size: 0.9375rem;
          border-radius: var(--r-md);
        }
        .p-btn-primary {
          color: #fff;
          background: var(--brand-gradient);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.4);
        }
        .p-btn-primary:hover {
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), var(--glow-brand);
          filter: brightness(1.05);
        }
        .p-btn-secondary {
          color: var(--text);
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--line-2);
          box-shadow: var(--inner);
          backdrop-filter: blur(8px);
        }
        .p-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--line-3);
        }

        /* ─── Kicker Section Headers ─── */
        .p-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brand);
        }
        .p-kicker::before {
          content: "";
          width: 18px;
          height: 1px;
          background: currentColor;
          opacity: 0.7;
        }

        /* ─── Backdrop Grid (Protector Exact 56px Hairline Grid) ─── */
        .p-backdrop-grid {
          position: absolute;
          inset: 0 0 auto 0;
          height: 850px;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .p-backdrop-grid::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%);
        }
        .p-backdrop-grid::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -260px;
          width: 1000px;
          height: 540px;
          transform: translateX(-50%);
          background: radial-gradient(closest-side, rgba(31, 167, 187, 0.22), transparent 70%);
          filter: blur(28px);
        }

        /* ─── Console Window (Protector Style) ─── */
        .p-console {
          position: relative;
          border-radius: var(--r-2xl);
          border: 1px solid var(--line-2);
          background: linear-gradient(180deg, rgba(26, 30, 43, 0.94), rgba(15, 17, 24, 0.98));
          box-shadow: var(--inner), var(--shadow-lg);
          overflow: hidden;
        }
        .p-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 26px;
          padding: 0 10px;
          border-radius: var(--r-full);
          background: var(--ok-soft);
          border: 1px solid rgba(61, 220, 151, 0.22);
          color: var(--ok);
          font-size: 0.72rem;
          font-weight: 600;
        }
        .p-pulse {
          position: relative;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }
        .p-pulse::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid currentColor;
          animation: p-pulse-anim 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @keyframes p-pulse-anim {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* ─── Protector Switches ─── */
        .p-switch {
          position: relative;
          flex: none;
          width: 46px;
          height: 28px;
          padding: 0;
          border-radius: var(--r-full);
          border: 1px solid var(--line-2);
          background: var(--surface-3);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.45);
          transition: background-color 260ms ease, border-color 260ms ease, box-shadow 260ms ease;
          cursor: pointer;
        }
        .p-switch-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #c9cfdd;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.12);
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 260ms ease;
        }
        .p-switch[data-checked="true"] {
          background: var(--brand-gradient);
          border-color: rgba(31, 167, 187, 0.6);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 16px -4px rgba(31, 167, 187, 0.6);
        }
        .p-switch[data-checked="true"] .p-switch-knob {
          transform: translateX(18px);
          background: #fff;
        }
      `}</style>

      <div className="min-h-screen bg-[#07080c] text-[#f1f3f9] font-sans selection:bg-[#1FA7BB] selection:text-white overflow-x-hidden relative">
        
        {/* ─── Ambient Backdrop Grid (Exact Protector Style) ──── */}
        <div className="p-backdrop-grid" aria-hidden="true" />

        {/* ─── 1. Header / Navbar ───────────────────────────────── */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080c]/85 backdrop-blur-xl border-b border-white/[0.07] h-16 flex items-center px-6">
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#1FA7BB]/10 border border-[#1FA7BB]/30 flex items-center justify-center transition-all group-hover:border-[#1FA7BB]/60">
                <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" priority />
              </div>
              <span className="font-bold text-base tracking-tight text-[#f1f3f9]">Layer</span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#aab1c5]">
              <a href="#features" className="px-3 py-1.5 rounded-lg hover:text-[#f1f3f9] hover:bg-white/[0.05] transition-colors">Features</a>
              <a href="#stats" className="px-3 py-1.5 rounded-lg hover:text-[#f1f3f9] hover:bg-white/[0.05] transition-colors">Live Stats</a>
              <a href="#dashboard" className="px-3 py-1.5 rounded-lg hover:text-[#f1f3f9] hover:bg-white/[0.05] transition-colors">Dashboard</a>
              <a href="#faq" className="px-3 py-1.5 rounded-lg hover:text-[#f1f3f9] hover:bg-white/[0.05] transition-colors">FAQ</a>
              <Link href="/commands" className="px-3 py-1.5 rounded-lg hover:text-[#f1f3f9] hover:bg-white/[0.05] transition-colors">Commands</Link>
              <Link href="/premium" className="px-3 py-1.5 rounded-lg hover:text-[#f1f3f9] hover:bg-white/[0.05] transition-colors">Pricing</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-[#aab1c5] hover:text-white px-3 py-1.5 transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <Link
                href="/invite"
                target="_blank"
                rel="noopener noreferrer"
                className="p-btn p-btn-primary"
              >
                <DiscordIcon size={16} />
                <span>Add to Discord</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ─── 2. Hero Section (Protector Exact Two-Column Layout) ─ */}
        <section className="relative z-10 pt-32 sm:pt-40 pb-16 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 h-8 px-3 rounded-full border border-white/[0.11] bg-white/[0.03] text-xs font-medium text-[#aab1c5]">
                <span className="inline-flex items-center h-5 px-2 rounded-full bg-[#1FA7BB]/15 text-[#1FA7BB] font-bold text-[11px]">
                  New
                </span>
                <span>Layer 2.0 autonomous security engine</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#737b91]" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#f1f3f9] leading-[1.05]">
                Your Discord server, <br />
                <span className="bg-gradient-to-r from-[#1FA7BB] via-[#25bdd3] to-[#7be0ee] bg-clip-text text-transparent">
                  protected before the attack.
                </span>
              </h1>

              {/* Lead Paragraph */}
              <p className="text-sm sm:text-base text-[#aab1c5] leading-relaxed max-w-xl">
                Layer stops token raids, scans scam images with neural OCR, quarantines malicious bot joins, and restores your server on its own. Free, zero data logged, ready in a minute.
              </p>

              {/* Primary & Secondary Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/invite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-btn p-btn-primary p-btn-lg"
                >
                  <DiscordIcon size={18} />
                  <span>Add to Discord</span>
                </Link>

                <a
                  href="#features"
                  className="p-btn p-btn-secondary p-btn-lg"
                >
                  <span>Explore Protections</span>
                  <ArrowRight className="w-4 h-4 text-[#737b91]" />
                </a>
              </div>

              {/* Proof Badges List */}
              <ul className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#737b91]">
                <li className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3ddc97]" />
                  <span>Full protection for free</span>
                </li>
                <li className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3ddc97]" />
                  <span>Zero data retention (0 IPs logged)</span>
                </li>
                <li className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3ddc97]" />
                  <span>One-click setup in 60s</span>
                </li>
              </ul>
            </div>

            {/* Right Visual Console (Protector Live Security Console Mockup) */}
            <div className="lg:col-span-5 relative">
              <div className="p-console">
                {/* Console Head */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#737b91]">#</span>
                    <span className="text-sm font-semibold text-[#f1f3f9]">logs-security</span>
                  </div>
                  <span className="p-status-pill">
                    <span className="p-pulse" />
                    <span>Server protected</span>
                  </span>
                </div>

                {/* Console Event Feed */}
                <ol className="p-3 divide-y divide-white/[0.03] space-y-1">
                  
                  {/* Event 1 */}
                  <li className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03]">
                    <div className="w-9 h-9 rounded-xl bg-[#ff6b6b]/15 text-[#ff6b6b] flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs font-semibold text-[#f1f3f9]">Raid blocked</strong>
                      <span className="block text-[11px] text-[#737b91] truncate">42 accounts created yesterday stopped at the door</span>
                    </div>
                    <time className="text-[10px] text-[#737b91] shrink-0 font-mono">just now</time>
                  </li>

                  {/* Event 2 */}
                  <li className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#ffc14d]/15 text-[#ffc14d] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs font-semibold text-[#f1f3f9]">Bot quarantined</strong>
                      <span className="block text-[11px] text-[#737b91] truncate">NukeBot is waiting for the owner&apos;s approval</span>
                    </div>
                    <time className="text-[10px] text-[#737b91] shrink-0 font-mono">7 min</time>
                  </li>

                  {/* Event 3 */}
                  <li className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#ff6b6b]/15 text-[#ff6b6b] flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs font-semibold text-[#f1f3f9]">Scam image removed</strong>
                      <span className="block text-[11px] text-[#737b91] truncate">Fake Nitro OCR detected in #general</span>
                    </div>
                    <time className="text-[10px] text-[#737b91] shrink-0 font-mono">14 min</time>
                  </li>

                  {/* Event 4 */}
                  <li className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#3ddc97]/15 text-[#3ddc97] flex items-center justify-center shrink-0">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="block text-xs font-semibold text-[#f1f3f9]">Channels restored</strong>
                      <span className="block text-[11px] text-[#737b91] truncate">12 channels and permissions rebuilt automatically</span>
                    </div>
                    <time className="text-[10px] text-[#737b91] shrink-0 font-mono">21 min</time>
                  </li>

                </ol>

                {/* Console Foot Meters */}
                <div className="grid grid-cols-3 border-t border-white/[0.07] bg-white/[0.01]">
                  <div className="p-3 text-center border-r border-white/[0.07]">
                    <span className="block text-[10px] text-[#737b91] uppercase tracking-wider font-semibold">Anti-raid</span>
                    <b className="text-xs text-[#3ddc97] font-semibold flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc97]" /> Active
                    </b>
                  </div>
                  <div className="p-3 text-center border-r border-white/[0.07]">
                    <span className="block text-[10px] text-[#737b91] uppercase tracking-wider font-semibold">OCR Vision</span>
                    <b className="text-xs text-[#3ddc97] font-semibold flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc97]" /> Active
                    </b>
                  </div>
                  <div className="p-3 text-center">
                    <span className="block text-[10px] text-[#737b91] uppercase tracking-wider font-semibold">Backup</span>
                    <b className="text-xs text-[#f1f3f9] font-semibold flex items-center justify-center gap-1.5 mt-0.5">
                      4 min ago
                    </b>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ─── 3. Stats Strip (Protector Exact Home-Band) ───────── */}
        <section className="relative z-10 border-y border-white/[0.07] bg-[#0a0c12] py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#aab1c5] text-center md:text-left">
              <strong className="text-white font-bold">18,500+</strong> members protected · <strong className="text-white font-bold">100%</strong> zero data retention
            </p>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-center">
              <div>
                <dt className="text-xs text-[#737b91]">Modules available</dt>
                <dd className="text-xl font-bold text-[#f1f3f9] mt-0.5">20+</dd>
              </div>
              <div>
                <dt className="text-xs text-[#737b91]">Structure backups</dt>
                <dd className="text-xl font-bold text-[#1FA7BB] mt-0.5">Every 10m</dd>
              </div>
              <div>
                <dt className="text-xs text-[#737b91]">Reaction speed</dt>
                <dd className="text-xl font-bold text-[#3ddc97] mt-0.5">&lt; 14ms</dd>
              </div>
              <div>
                <dt className="text-xs text-[#737b91]">Core security</dt>
                <dd className="text-xl font-bold text-white mt-0.5">Free</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ─── 4. ZIG-ZAG FEATURE SUITE (Protector Home-Zig) ─────── */}
        <section id="features" className="relative z-10 py-24 px-6 max-w-6xl mx-auto space-y-28">

          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="p-kicker">Features</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#f1f3f9] tracking-tight">
              Every attack already has an answer.
            </h2>
            <p className="text-sm sm:text-base text-[#aab1c5] leading-relaxed">
              Layer watches joins, messages, bots, images, and the audit log around the clock. When something goes wrong, it acts within seconds and tells you exactly what it did.
            </p>
          </div>

          {/* ─── ZIG 1: Anti-Raid ─── */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="p-kicker">Anti-raid</p>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
                Anti-raid and flood shield
              </h3>
              <p className="text-sm text-[#aab1c5] leading-relaxed">
                A sudden wave of joins? The server locks down instantly and brand-new accounts stay outside in quarantine while your legitimate members chat normally.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#0f1118] border border-white/[0.08] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ffc14d]" />
                    <span className="text-xs font-bold text-[#f1f3f9]">Raid Velocity Containment</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ffc14d]/10 text-[#ffc14d] border border-[#ffc14d]/25">
                    42 BOTS STOPPED
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#aab1c5]">
                    <span>Join Velocity Spike</span>
                    <span className="font-mono text-[#ff6b6b] font-bold">42 joins / 1.2s</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#141722] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ffc14d] to-[#ff6b6b] rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141722] border border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-[#aab1c5]">Suspicious tokens quarantined in memory</span>
                  <span className="text-[#3ddc97] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 0 Staff Pings
                  </span>
                </div>
              </div>
            </div>
          </article>


          {/* ─── ZIG 2: Anti-Nuke & Auto-Restore (Reverse) ─── */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl bg-[#0f1118] border border-white/[0.08] p-6 shadow-xl space-y-2.5">
                {[
                  { channel: '#general', time: 'Restored in 40ms' },
                  { channel: '#announcements', time: 'Restored in 60ms' },
                  { channel: '#rules-and-info', time: 'Restored in 55ms' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between h-10 px-4 rounded-xl bg-[#141722] border border-white/[0.06] text-xs font-mono text-[#aab1c5]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#737b91]">#</span>
                      <span className="text-[#f1f3f9] font-medium">{item.channel.replace('#', '')}</span>
                    </div>
                    <span className="text-[#3ddc97] font-semibold flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <p className="p-kicker">Anti-nuke</p>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
                Anti-nuke and auto-restore
              </h3>
              <p className="text-sm text-[#aab1c5] leading-relaxed">
                Channels or roles deleted in a row by a rogue admin account? The attacker loses their permissions immediately, then channels, permissions, and settings are rebuilt as they were.
              </p>
            </div>
          </article>


          {/* ─── ZIG 3: Neural OCR Scam Vision ─── */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="p-kicker">OCR Vision</p>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
                Neural OCR image scam scanner
              </h3>
              <p className="text-sm text-[#aab1c5] leading-relaxed">
                Scammers bypass standard bot filters by uploading screenshots of fake Discord Nitro gifts or QR codes. Layer reads the image text directly and removes the message in 11ms.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#0f1118] border border-white/[0.08] p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-semibold text-[#f1f3f9]">Attachment Scanner</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff6b6b]/15 text-[#ff6b6b]">
                    MALICIOUS DOMAIN DETECTED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141722] border border-[#ff6b6b]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#f1f3f9] font-bold">nitro-free-claim.png</span>
                    <span className="text-[#3ddc97]">Deleted in 11ms</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#aab1c5] bg-[#0a0c12] p-2 rounded-lg border border-white/[0.04]">
                    Extracted text: &quot;https://discord.nitro-drop.ru/claim&quot; ➔ Match found on global blacklist
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#737b91] pt-1">
                  <span>Punishment: <strong>User timed out for 24h</strong></span>
                  <span>Accuracy: <strong>99.8%</strong></span>
                </div>
              </div>
            </div>
          </article>


          {/* ─── ZIG 4: Member Verification (Reverse) ─── */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl bg-[#0f1118] border border-white/[0.08] p-6 shadow-xl space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-semibold text-[#f1f3f9]">Discord Verification Gate</span>
                  <span className="text-[10px] font-mono text-[#737b91]">Zero-Storage Policy</span>
                </div>

                <div className="p-4 rounded-xl bg-[#141722] border border-white/[0.05] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-base font-bold tracking-widest text-[#f1f3f9] px-3.5 py-1.5 rounded-lg bg-[#0a0c12] border border-white/[0.1]">
                      K7M2Q
                    </div>
                    <span className="text-xs text-[#aab1c5]">Solve captcha or click verify</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVerifyStatus(verifyStatus === 'idle' ? 'verified' : 'idle')}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      verifyStatus === 'verified'
                        ? 'bg-[#3ddc97] text-[#07080c]'
                        : 'bg-[#1FA7BB] hover:bg-[#25bdd3] text-white'
                    }`}
                  >
                    {verifyStatus === 'verified' ? '✓ Verified! Role @Member Granted' : 'Click to Verify with Layer'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#737b91]">
                  <span>0 IP addresses logged</span>
                  <span>100% GDPR compliant</span>
                </div>

              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <p className="p-kicker">Verification</p>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
                Zero-storage member verification
              </h3>
              <p className="text-sm text-[#aab1c5] leading-relaxed">
                Button or image captcha: new members see nothing of the server until they are verified. Stops automated scrapers and token raids without collecting member IPs or personal data.
              </p>
            </div>
          </article>


          {/* ─── ZIG 5: Web Control Panel ─── */}
          <article id="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="p-kicker">Dashboard</p>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
                Control your protections from your browser.
              </h3>
              <p className="text-sm text-[#aab1c5] leading-relaxed">
                Log in with Discord, pick a server and turn each module on or off in one click, even from your phone.
              </p>

              {/* Checklist */}
              <ul className="space-y-3.5 pt-1 text-xs text-[#aab1c5]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#f1f3f9] block">The site never touches your server credentials</strong>
                    <span>Every change is authenticated through Discord OAuth and permission checks.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#f1f3f9] block">Critical protections stay locked</strong>
                    <span>Anti-raid and anti-nuke can only be modified by the server owner or security role.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#1FA7BB]/10 text-[#1FA7BB] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#f1f3f9] block">Everything is logged</strong>
                    <span>Every setting change shows up in your security audit channel with its author.</span>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="p-btn p-btn-primary"
                >
                  <span>Open Web Dashboard</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>

            {/* Interactive Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#0f1118] border border-white/[0.08] shadow-2xl overflow-hidden">
                {/* Mock Server Header */}
                <div className="flex items-center justify-between p-4 px-5 border-b border-white/[0.07] bg-white/[0.015]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1FA7BB] to-[#141722] flex items-center justify-center font-bold text-xs text-white">
                      GS
                    </div>
                    <div>
                      <strong className="block text-xs text-[#f1f3f9]">Gaming Server Hub</strong>
                      <span className="block text-[11px] text-[#737b91]">1,420 members</span>
                    </div>
                  </div>
                  <span className="p-status-pill">
                    <span className="p-pulse" />
                    <span>Protected</span>
                  </span>
                </div>

                {/* Mock Toggles List */}
                <div className="p-3 divide-y divide-white/[0.03] space-y-1">
                  {[
                    { key: 'antiRaid' as const, title: 'Anti-Raid and flood shield', desc: 'Auto-lock joins on abnormal spike' },
                    { key: 'ocrVision' as const, title: 'Neural OCR Image Scanner', desc: 'Read text in fake Nitro promo images' },
                    { key: 'botQuarantine' as const, title: 'Bot Quarantine', desc: 'Strip permissions from new bots until approved' },
                    { key: 'autoRestore' as const, title: 'Anti-Nuke Structure Restore', desc: 'Rebuild deleted channels in 50ms' },
                    { key: 'antiScam' as const, title: 'Autonomous Ticket AI', desc: 'Instant answers for common member questions' },
                  ].map((m) => {
                    const isChecked = switches[m.key];
                    return (
                      <div
                        key={m.key}
                        onClick={() => toggleSwitch(m.key)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <div className="space-y-0.5">
                          <strong className="block text-xs text-[#f1f3f9]">{m.title}</strong>
                          <span className="block text-[11px] text-[#737b91]">{m.desc}</span>
                        </div>

                        {/* Protector Switch */}
                        <div
                          className="p-switch"
                          data-checked={isChecked ? 'true' : 'false'}
                        >
                          <div className="p-switch-knob" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mock Foot */}
                <div className="px-5 py-3 border-t border-white/[0.07] bg-white/[0.01] flex items-center justify-between text-xs text-[#737b91]">
                  <span>Changes sync via websocket</span>
                  <span className="text-[#3ddc97]">Latency: 12ms</span>
                </div>
              </div>
            </div>
          </article>

        </section>

        {/* ─── 5. 8-CARD FEATURE MATRIX (Protector Feature-List) ─── */}
        <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] bg-[#0f1118]">
            
            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Zap className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Anti-Spam &amp; Floods</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Stops copy-paste floods, repetitive mentions, and Discord server invite links in public chats.
              </p>
            </div>

            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Shield className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Ban Evasion Tracking</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Detects returning trouble-makers trying to rejoin on fresh alt-accounts and removes them.
              </p>
            </div>

            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Users className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Auto-Role &amp; Welcome</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Custom welcome messages, dynamic welcome image generation, and instant role assign on join.
              </p>
            </div>

            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Eye className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Ghost Ping Cleaner</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Reveals and logs the author of deleted messages that pinged members or staff unfairly.
              </p>
            </div>

          </div>

          <div className="border-x border-b border-white/[0.08] rounded-b-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] bg-[#0f1118]">
            
            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Sparkles className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Autonomous AI Tickets</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Answers common FAQs and syncs booster roles in 2.8s without waking human moderators.
              </p>
            </div>

            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Volume2 className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Lossless 320k Audio</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                24/7 radio mode, high-bitrate audio playback with zero stuttering or buffer lag.
              </p>
            </div>

            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Layers className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Member Leveling XP</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Custom rank cards, XP multipliers, and automatic role rewards for active text chatters.
              </p>
            </div>

            <div className="p-6 space-y-2 hover:bg-[#141722] transition-colors">
              <Clock className="w-5 h-5 text-[#1FA7BB]" />
              <h3 className="text-sm font-bold text-[#f1f3f9]">Full Audit Logs</h3>
              <p className="text-xs text-[#737b91] leading-relaxed">
                Every moderation action, timeout, ban, and config edit is dispatched to your private log channel.
              </p>
            </div>

          </div>
        </section>

        {/* ─── 6. GETTING STARTED IN 3 STEPS (Protector Steps) ───── */}
        <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <p className="p-kicker">Getting started</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
              Protected in under a minute.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            
            {/* Step 1 */}
            <div className="space-y-3 p-4">
              <div className="w-20 h-20 rounded-full border border-white/[0.11] bg-[#141722] shadow-xl flex items-center justify-center mx-auto relative">
                <DiscordIcon size={28} className="text-[#1FA7BB]" />
                <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#1FA7BB] to-[#146c7a] text-white text-xs font-bold flex items-center justify-center shadow-md">
                  1
                </span>
              </div>
              <h3 className="text-base font-bold text-[#f1f3f9]">Add Layer to server</h3>
              <p className="text-xs text-[#aab1c5] leading-relaxed max-w-xs mx-auto">
                Invite the bot in one click with standard moderation and manage-roles permissions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 p-4">
              <div className="w-20 h-20 rounded-full border border-white/[0.11] bg-[#141722] shadow-xl flex items-center justify-center mx-auto relative">
                <Sliders className="w-7 h-7 text-[#1FA7BB]" />
                <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#1FA7BB] to-[#146c7a] text-white text-xs font-bold flex items-center justify-center shadow-md">
                  2
                </span>
              </div>
              <h3 className="text-base font-bold text-[#f1f3f9]">Auto-configures defaults</h3>
              <p className="text-xs text-[#aab1c5] leading-relaxed max-w-xs mx-auto">
                Layer instantly deploys anti-raid velocity filters, OCR scam scanning, and logs automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 p-4">
              <div className="w-20 h-20 rounded-full border border-white/[0.11] bg-[#141722] shadow-xl flex items-center justify-center mx-auto relative">
                <ShieldCheck className="w-7 h-7 text-[#3ddc97]" />
                <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#1FA7BB] to-[#146c7a] text-white text-xs font-bold flex items-center justify-center shadow-md">
                  3
                </span>
              </div>
              <h3 className="text-base font-bold text-[#f1f3f9]">Sleep peacefully</h3>
              <p className="text-xs text-[#aab1c5] leading-relaxed max-w-xs mx-auto">
                Threats are intercepted in milliseconds before members can click. Zero maintenance required.
              </p>
            </div>

          </div>
        </section>

        {/* ─── 7. FAQ Section (Accordion) ───────────────────────── */}
        <section id="faq" className="relative z-10 py-16 px-6 max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <p className="p-kicker">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
              What people ask us.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0f1118] border border-white/[0.08] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#f1f3f9]">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#737b91] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#aab1c5] leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 8. Bottom CTA Banner (Protector Exact .cta Style) ─── */}
        <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
          <div className="rounded-2xl p-8 sm:p-14 bg-gradient-to-b from-[#141722] to-[#0f1118] border border-white/[0.11] text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f1f3f9] tracking-tight">
                Don&apos;t let the next raid decide for you.
              </h2>
              <p className="text-xs sm:text-sm text-[#aab1c5] leading-relaxed">
                Join thousands of Discord communities protected by Layer. Ready in under 60 seconds with zero credit card required.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/invite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-btn p-btn-primary p-btn-lg"
                >
                  <DiscordIcon size={18} />
                  <span>Add to Discord</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="p-btn p-btn-secondary p-btn-lg"
                >
                  <span>Open Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 9. Clean Footer (Protector Style) ─────────────────── */}
        <footer className="relative z-10 border-t border-white/[0.07] bg-[#07080c] py-12 px-6 text-xs text-[#737b91]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Layer" width={20} height={20} className="object-contain" />
              <span className="font-bold text-[#f1f3f9]">Layer</span>
              <span className="text-[#4d5467]">·</span>
              <span>The bot that protects your Discord server before the attack.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[#aab1c5]">
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/refunds" className="hover:text-white transition-colors">Refunds</Link>
              <Link href="/commands" className="hover:text-white transition-colors">Commands</Link>
              <Link href="/premium" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
