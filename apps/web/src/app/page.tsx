'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
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
  Crown,
  Menu,
  X,
  BookOpen,
  Code2,
} from 'lucide-react';
import { ScamDetectionMock, BanEvasionMock, TicketMock, VerificationMock, DashboardMock } from './DiscordMock';

/* --- Discord Gamepad SVG Icon --------------------------------- */
function DiscordIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/* --- FeatureBlock: reusable zig-zag block ---------------------- */
interface FeatureBlockProps {
  reverse: boolean;
  heading: React.ReactNode;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  primaryIcon: React.ReactNode;
  secondaryHref?: string;
  secondaryLabel?: string;
  visual: React.ReactNode;
}

function FeatureBlock({
  reverse,
  heading,
  body,
  primaryHref,
  primaryLabel,
  primaryIcon,
  secondaryHref,
  secondaryLabel,
  visual,
}: FeatureBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in-view'); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="feat-block grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Visual column - mobile: always first; desktop: alternates via order */}
      <div className={`order-1 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        {visual}
      </div>

      {/* Text column */}
      <div
        className={`order-2 ${reverse ? 'lg:order-1' : 'lg:order-2'} space-y-5 max-w-[480px] mx-auto lg:mx-0`}
      >
        <h3 className="text-[28px] sm:text-[32px] font-extrabold text-white tracking-tight leading-tight">
          {heading}
        </h3>
        <p className="text-[14px] sm:text-[15px] text-[#94a3b8] leading-[1.7] max-w-[420px]">
          {body}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Link
            href={primaryHref}
            prefetch={false}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#1FA7BB] hover:bg-[#25bdd3] text-white text-sm font-semibold shadow-lg shadow-[#1FA7BB]/20 hover:shadow-[#1FA7BB]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
          >
            {primaryIcon}
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-[6px] bg-[#111420] hover:bg-[#1a1f30] border border-white/[0.1] hover:border-white/[0.18] text-white/80 hover:text-white text-sm font-medium transition-all duration-150"
            >
              {secondaryLabel}
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Session for nav avatar
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Page intro animation - one-shot on mount
  const [introGone, setIntroGone] = useState(false);
  useEffect(() => {
    // After 1.4s start fade-out, remove after 1.7s
    const t1 = setTimeout(() => setIntroGone(true), 1400);
    return () => clearTimeout(t1);
  }, []);

  // Navbar dropdown state
  const [activeDropdown, setActiveDropdown] = useState<'features' | 'resources' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div suppressHydrationWarning className="min-h-screen bg-[#07080c] text-[#f1f3f9] font-sans selection:bg-[#1FA7BB] selection:text-white overflow-x-hidden relative">

        {/* --- Page intro animation ------------------------------- */}
        {!introGone && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: '#07080c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16,
            opacity: introGone ? 0 : 1,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}>
            <style>{`
              @keyframes intro-up {
                from { opacity: 0; transform: translateY(14px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes intro-fade {
                0%   { opacity: 0; }
                30%  { opacity: 1; }
                75%  { opacity: 1; }
                100% { opacity: 0; }
              }
              .intro-wrap { animation: intro-fade 1.45s ease forwards; }
              .intro-logo  { animation: intro-up 0.45s ease 0.05s both; }
              .intro-text  { animation: intro-up 0.45s ease 0.18s both; }
              .intro-sub   { animation: intro-up 0.45s ease 0.3s  both; }
            `}</style>
            <div className="intro-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div className="intro-logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Layer" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                <span style={{ fontSize: 28, fontWeight: 900, color: '#f1f3f9', letterSpacing: '-0.04em' }}>Layer</span>
              </div>
              <p className="intro-text" style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Your server, finally under control.
              </p>
            </div>
          </div>
        )}

        {/* --- 1. Header / Sticky Navbar (Picture 1 style) -------- */}
        <header
          ref={navRef}
          className="sticky top-0 z-50 w-full bg-[#0c0e17]/95 backdrop-blur-md border-b border-white/[0.08] transition-colors"
        >
          <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Left: Logo & Dropdowns */}
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/logo.png"
                  alt="Layer"
                  width={46}
                  height={46}
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-150 group-hover:scale-105"
                  priority
                />
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">Layer</span>
              </Link>

              {/* Desktop nav - Features, Resources, Support with slide transition */}
              <nav className="hidden md:flex items-center gap-2">

                {/* Each button has its own relative container + the dropdown lives in Features button */}
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDropdown('features')}
                    onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium transition-colors ${
                      activeDropdown === 'features'
                        ? 'text-white bg-white/[0.08]'
                        : 'text-[#cbd5e1] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Features</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown anchored to this button */}
                  {activeDropdown && (
                    <div
                      className="absolute top-full mt-2 rounded-xl bg-[#0f1117]/98 backdrop-blur-xl border border-white/[0.09] shadow-2xl z-50 overflow-hidden"
                      style={{
                        left: 0,
                        width: activeDropdown === 'features' ? 560 : 460,
                        transition: 'width 0.22s cubic-bezier(0.16,1,0.3,1)',
                      }}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {/* Sliding inner */}
                      <div style={{
                        display: 'flex',
                        transform: activeDropdown === 'features' ? 'translateX(0%)' : 'translateX(-50%)',
                        transition: 'transform 0.26s cubic-bezier(0.16,1,0.3,1)',
                        width: '200%',
                      }}>

                        {/* --- FEATURES: ZIG-ZAG SECTION ---------------------------- */}
                        <div style={{ width: '50%', flexShrink: 0 }}>
                          <div className="p-3 grid grid-cols-2 gap-1">
                            <div className="space-y-0.5">
                              {[
                                { icon: <Shield className="w-4 h-4" />, color: '#1FA7BB', bg: '#1FA7BB', label: 'Moderation', sub: 'Anti-raid, auto-ban, spam filters' },
                                { icon: <Eye className="w-4 h-4" />, color: '#3ddc97', bg: '#3ddc97', label: 'AI Scam Detection', sub: 'Image & link scanning' },
                                { icon: <ShieldAlert className="w-4 h-4" />, color: '#f472b6', bg: '#f472b6', label: 'Ban Evasion', sub: 'Pattern-match & auto-reban' },
                              ].map((item) => (
                                <a key={item.label} href="#features" onClick={() => setActiveDropdown(null)}
                                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group cursor-pointer">
                                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                                    style={{ background: `${item.bg}18`, color: item.color }}>{item.icon}</div>
                                  <div>
                                    <div className="text-xs font-semibold text-white leading-tight">{item.label}</div>
                                    <div className="text-[11px] text-[#64748b] leading-tight mt-0.5">{item.sub}</div>
                                  </div>
                                </a>
                              ))}
                            </div>
                            <div className="space-y-0.5">
                              {[
                                { icon: <MessageSquare className="w-4 h-4" />, color: '#a78bfa', bg: '#a78bfa', label: 'AI Tickets', sub: 'Auto-routing & transcripts' },
                                { icon: <Sparkles className="w-4 h-4" />, color: '#fbbf24', bg: '#f59e0b', label: 'Leveling & XP', sub: 'Rank cards, leaderboards' },
                                { icon: <Volume2 className="w-4 h-4" />, color: '#38bdf8', bg: '#38bdf8', label: 'Music Player', sub: 'YouTube queue, 320kbps' },
                              ].map((item) => (
                                <a key={item.label} href="#features" onClick={() => setActiveDropdown(null)}
                                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group cursor-pointer">
                                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                                    style={{ background: `${item.bg}18`, color: item.color }}>{item.icon}</div>
                                  <div>
                                    <div className="text-xs font-semibold text-white leading-tight">{item.label}</div>
                                    <div className="text-[11px] text-[#64748b] leading-tight mt-0.5">{item.sub}</div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-white/[0.06] px-3 py-2.5 flex items-center justify-between">
                            <span className="text-[11px] text-[#4d5467]">All modules in the free plan</span>
                            <a href="#features" onClick={() => setActiveDropdown(null)}
                              className="text-[11px] font-semibold text-[#1FA7BB] hover:text-[#25bdd3] transition-colors">
                              See all features →
                            </a>
                          </div>
                        </div>

                        {/* -- Resources panel -- */}
                        <div style={{ width: '50%', flexShrink: 0 }}>
                          <div className="p-3 grid grid-cols-2 gap-1">
                            <div className="space-y-0.5">
                              {[
                                { icon: <BookOpen className="w-4 h-4" />, color: '#1FA7BB', label: 'Documentation', sub: 'Setup guides & permissions', href: '/commands' },
                                { icon: <Code2 className="w-4 h-4" />, color: '#a78bfa', label: 'Bot Commands', sub: 'Full slash command list', href: '/commands' },
                              ].map((item) => (
                                <Link key={item.label} href={item.href} onClick={() => setActiveDropdown(null)}
                                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group">
                                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                    style={{ background: `${item.color}18`, color: item.color }}>{item.icon}</div>
                                  <div>
                                    <div className="text-xs font-semibold text-white leading-tight">{item.label}</div>
                                    <div className="text-[11px] text-[#64748b] leading-tight mt-0.5">{item.sub}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="space-y-0.5">
                              <Link href="https://status.uselayer.de" onClick={() => setActiveDropdown(null)} target="_blank" rel="noopener noreferrer"
                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group">
                                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                  style={{ background: '#3ddc9718', color: '#3ddc97' }}><Activity className="w-4 h-4" /></div>
                                <div>
                                  <div className="text-xs font-semibold text-white leading-tight">Status</div>
                                  <div className="text-[11px] text-[#64748b] leading-tight mt-0.5">99.98% uptime</div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* Resources button - triggers same dropdown, switches panel */}
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDropdown('resources')}
                    onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium transition-colors ${
                      activeDropdown === 'resources'
                        ? 'text-white bg-white/[0.08]'
                        : 'text-[#cbd5e1] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Resources</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Support - plain link */}
                <a
                  href="https://discord.gg/W2XjhvBbtn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium text-[#cbd5e1] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Support
                </a>

              </nav>

            </div>

            {/* Right: Premium + Login */}
            <div className="flex items-center gap-3">

              {/* Auth button — avatar when logged in, login button when not */}
              {session?.user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="inline-flex items-center gap-2 px-2 py-1.5 rounded-[8px] hover:bg-white/[0.06] transition-colors"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ''}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#1FA7BB]/20 flex items-center justify-center text-xs font-bold text-[#1FA7BB]">
                        {(session.user.name || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-[#f1f3f9] max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#94a3b8] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0f1117]/98 backdrop-blur-xl border border-white/[0.09] shadow-2xl z-50 overflow-hidden">
                      {/* User info header */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
                        {session.user.image ? (
                          <img src={session.user.image} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1FA7BB]/20 flex items-center justify-center text-sm font-bold text-[#1FA7BB] flex-shrink-0">
                            {(session.user.name || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{session.user.name}</div>
                          <div className="text-[11px] text-[#64748b] truncate">{session.user.email}</div>
                        </div>
                      </div>
                      {/* Menu items */}
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.06] hover:text-white transition-colors w-full text-left"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-xs sm:text-sm font-semibold text-white bg-[#1FA7BB] hover:bg-[#25bdd3] shadow-md shadow-[#1FA7BB]/20 hover:shadow-[#1FA7BB]/35 transition-all duration-150"
                >
                  <span>Login with Discord</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/[0.08] bg-[#0c0e17] px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#737b91] px-2 mb-1">
                  Features
                </div>
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.05]"
                >
                  Moderation & Security
                </Link>
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.05]"
                >
                  Neural OCR Scam Vision
                </Link>
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.05]"
                >
                  High-Fidelity Music
                </Link>
                <Link
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.05]"
                >
                  Leveling & Leaderboards
                </Link>
              </div>

              <div className="border-t border-white/[0.06] pt-3 space-y-1">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#737b91] px-2 mb-1">
                  Resources
                </div>
                <Link
                  href="/commands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.05]"
                >
                  Commands List
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#cbd5e1] hover:bg-white/[0.05]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/premium"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-[#facc15] hover:bg-white/[0.05]"
                >
                  👑 Premium Upgrade
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* --- 2. HERO CONTAINER (Mood Dark + Dusk Gradient + Pine Forest Edge) --- */}
        <div
          className="relative overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, #10131f 0%, #151829 40%, #231a2c 78%, #1a1424 100%)',
          }}
        >
          {/* Subtle Ambient Top Star/Atmosphere Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[340px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(31, 167, 187, 0.14), transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Early Access Banner */}
          <div className="pt-6 sm:pt-8 pb-4 flex justify-center px-4 relative z-20">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-sm shadow-lg shadow-black/20">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#1FA7BB]/20 text-[#1FA7BB] border border-[#1FA7BB]/35">
                Early Access
              </span>
              <span className="text-xs sm:text-sm text-[#cbd5e1]">We&apos;re launching soon - be among the first servers.</span>
            </div>
          </div>

          {/* Hero Section (Two Columns, ~1200px Container) */}
          <section className="relative z-20 pt-14 sm:pt-20 pb-40 lg:pb-56 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-4 items-end">
              
              {/* Left Column: 3-line Headline, Muted Paragraph, 2 Rounded 6px Buttons */}
              <div className="lg:col-span-5 space-y-6 order-1 text-left">
                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-white leading-[1.08] tracking-tight">
                  Your server,<br />
                  finally under<br />
                  <span className="text-[#1FA7BB]">control.</span>
                </h1>

                {/* Sub */}
                <p className="text-base sm:text-[17px] text-[#94a3b8] leading-relaxed max-w-lg">
                  Layer protects your Discord server with AI scam detection,
                  ban evasion tracking, and smart ticket routing -
                  zero data stored. Free to start, up in 60 seconds.
                </p>

                {/* Two buttons side by side (rounded at about 6px) */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  {/* Primary button with Discord icon in main brand color */}
                  <Link
                    href="/invite" prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[6px] bg-[#1FA7BB] hover:bg-[#25bdd3] text-white font-semibold text-sm sm:text-base transition-all duration-150 shadow-lg shadow-[#1FA7BB]/25 hover:shadow-[#1FA7BB]/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <DiscordIcon size={20} />
                    <span>Add to Discord</span>
                  </Link>

                  {/* Darker secondary button */}
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[6px] bg-[#222634] hover:bg-[#2b3142] border border-white/[0.1] text-white/90 font-medium text-sm sm:text-base transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>See features</span>
                  </a>
                </div>
              </div>

              {/* Right Column: placeholder for grid balance */}
              <div className="lg:col-span-7 order-2 hidden lg:block" />
            </div>
          </section>

          {/* --- ILLUSTRATION - behind pine spikes, right edge --- */}
          <div className="absolute bottom-0 right-0 pointer-events-none select-none hidden lg:block"
            style={{ width: '55vw', maxWidth: 980, zIndex: 5 }}>
            <svg viewBox="0 0 640 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <defs>
                <radialGradient id="mG" cx="62%" cy="65%" r="48%">
                  <stop offset="0%" stopColor="#fff8db" stopOpacity="0.45" />
                  <stop offset="35%" stopColor="#ffd880" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffd880" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="cG" x1="20%" y1="0%" x2="90%" y2="100%">
                  <stop offset="0%" stopColor="#252b3d" />
                  <stop offset="35%" stopColor="#1a1e2b" />
                  <stop offset="100%" stopColor="#0e1017" />
                </linearGradient>
              </defs>
              {/* Moon */}
              <circle cx="410" cy="350" r="180" fill="url(#mG)" />
              <circle cx="410" cy="355" r="75" fill="#fff7d6" opacity="0.9" />
              {/* Cliff */}
              <path d="M 370 450 L 388 322 Q 402 316 430 318 L 640 318 L 640 450 Z" fill="url(#cG)" />
              <path d="M 388 322 Q 410 316 440 318 L 640 318 L 640 326 Q 440 326 405 328 Z" fill="#2e3549" />
              <path d="M 400 340 L 420 375 L 415 410 L 435 450 M 460 330 L 475 365 M 540 330 L 555 380 L 570 450" stroke="#141822" strokeWidth="3" strokeLinecap="round" />
              {/* Vines */}
              <path d="M 394 322 Q 380 360 395 395 Q 405 425 398 450" stroke="#166534" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <ellipse cx="384" cy="340" rx="7" ry="4" fill="#22c55e" transform="rotate(-30 384 340)" />
              <ellipse cx="396" cy="360" rx="8" ry="4.5" fill="#16a34a" transform="rotate(20 396 360)" />
              <ellipse cx="388" cy="380" rx="7" ry="4" fill="#4ade80" transform="rotate(-40 388 380)" />
              <ellipse cx="403" cy="405" rx="7.5" ry="4" fill="#22c55e" transform="rotate(15 403 405)" />
              <path d="M 590 322 Q 605 350 595 385 Q 588 415 600 450" stroke="#166534" strokeWidth="3" fill="none" />
              <ellipse cx="602" cy="345" rx="7" ry="4" fill="#22c55e" transform="rotate(35 602 345)" />
              <ellipse cx="590" cy="370" rx="7.5" ry="4" fill="#16a34a" transform="rotate(-20 590 370)" />
              {/* Mascot 1 - Viking */}
              <g transform="translate(408,280)">
                <ellipse cx="0" cy="38" rx="16" ry="4" fill="#000" opacity="0.4"/>
                <polygon points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12" fill="#1a2233" stroke="#1FA7BB" strokeWidth="1.5"/>
                <polygon points="0,-16 13,-8 13,8 0,16 -13,8 -13,-8" fill="#0d1117"/>
                <circle cx="-6" cy="2" r="2.5" fill="#1FA7BB"/><circle cx="6" cy="2" r="2.5" fill="#1FA7BB"/>
                <circle cx="-5" cy="1" r="1" fill="#e0f7fa"/><circle cx="7" cy="1" r="1" fill="#e0f7fa"/>
                <path d="M -3 10 Q 0 14 3 10" stroke="#1FA7BB" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M -21 -10 Q -34 -16 -28 -26 Q -20 -18 -14 -10 Z" fill="#d1d5db" stroke="#6b7280" strokeWidth="1"/>
                <path d="M 21 -10 Q 34 -16 28 -26 Q 20 -18 14 -10 Z" fill="#d1d5db" stroke="#6b7280" strokeWidth="1"/>
                <ellipse cx="-7" cy="35" rx="5" ry="3" fill="#78350f"/><ellipse cx="7" cy="35" rx="5" ry="3" fill="#78350f"/>
              </g>
              {/* Mascot 2 - Straw Hat */}
              <g transform="translate(468,276)">
                <ellipse cx="0" cy="42" rx="17" ry="4" fill="#000" opacity="0.4"/>
                <polygon points="0,-26 22,-13 22,13 0,26 -22,13 -22,-13" fill="#1a2233" stroke="#1FA7BB" strokeWidth="1.5"/>
                <polygon points="0,-17 14,-8 14,8 0,17 -14,8 -14,-8" fill="#0d1117"/>
                <circle cx="-6" cy="2" r="2.5" fill="#1FA7BB"/><circle cx="6" cy="2" r="2.5" fill="#1FA7BB"/>
                <circle cx="-5" cy="1" r="1" fill="#e0f7fa"/><circle cx="7" cy="1" r="1" fill="#e0f7fa"/>
                <path d="M -4 10 Q 0 15 4 10" stroke="#1FA7BB" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <ellipse cx="0" cy="-24" rx="28" ry="6" fill="#fef08a" stroke="#a16207" strokeWidth="1"/>
                <path d="M -14 -24 Q 0 -38 14 -24 Z" fill="#fde047" stroke="#a16207" strokeWidth="1"/>
                <rect x="-14" y="-26" width="28" height="3" fill="#dc2626"/>
                <ellipse cx="-7" cy="38" rx="6" ry="3.5" fill="#854d0e"/><ellipse cx="7" cy="38" rx="6" ry="3.5" fill="#854d0e"/>
              </g>
              {/* Mascot 3 - Toga */}
              <g transform="translate(534,252)">
                <ellipse cx="0" cy="66" rx="14" ry="3" fill="#000" opacity="0.3"/>
                <polygon points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12" fill="#1a2233" stroke="#1FA7BB" strokeWidth="1.5"/>
                <polygon points="0,-16 13,-8 13,8 0,16 -13,8 -13,-8" fill="#0d1117"/>
                <path d="M -8 2 Q -5 -2 -2 2" stroke="#1FA7BB" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="6" cy="2" r="2.5" fill="#1FA7BB"/><circle cx="7" cy="1" r="1" fill="#e0f7fa"/>
                <path d="M -4 10 Q 0 16 4 10 Z" fill="#1FA7BB"/>
                <circle cx="-10" cy="-20" r="2" fill="#eab308"/><circle cx="-5" cy="-23" r="2" fill="#eab308"/>
                <circle cx="0" cy="-24" r="2.5" fill="#fde047"/><circle cx="5" cy="-23" r="2" fill="#eab308"/><circle cx="10" cy="-20" r="2" fill="#eab308"/>
                <path d="M -21 16 Q 0 30 21 16 L 16 32 Q 0 35 -16 32 Z" fill="#f8fafc" opacity="0.9"/>
                <ellipse cx="-8" cy="38" rx="5" ry="3" fill="#eab308"/><ellipse cx="8" cy="36" rx="5" ry="3" fill="#eab308"/>
              </g>
              {/* Mascot 4 - King */}
              <g transform="translate(594,274)">
                <ellipse cx="0" cy="44" rx="18" ry="4" fill="#000" opacity="0.4"/>
                <path d="M -22 16 Q -30 42 -18 46 L 22 46 Q 32 42 22 16 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1"/>
                <polygon points="0,-26 23,-13 23,13 0,26 -23,13 -23,-13" fill="#1a2233" stroke="#1FA7BB" strokeWidth="2"/>
                <polygon points="0,-17 15,-8 15,8 0,17 -15,8 -15,-8" fill="#0d1117"/>
                <circle cx="-7" cy="2" r="2.8" fill="#1FA7BB"/><circle cx="7" cy="2" r="2.8" fill="#1FA7BB"/>
                <circle cx="-6" cy="1" r="1.1" fill="#e0f7fa"/><circle cx="8" cy="1" r="1.1" fill="#e0f7fa"/>
                <path d="M -12 12 Q 0 20 12 12 Q 10 24 0 26 Q -10 24 -12 12 Z" fill="#78350f"/>
                <path d="M -16 -13 L -18 -26 L -8 -19 L 0 -30 L 8 -19 L 18 -26 L 16 -13 Z" fill="#fde047" stroke="#b45309" strokeWidth="1"/>
                <circle cx="-14" cy="-25" r="2" fill="#ef4444"/><circle cx="0" cy="-29" r="2.5" fill="#ef4444"/><circle cx="14" cy="-25" r="2" fill="#ef4444"/>
              </g>
            </svg>
          </div>

          {/* --- Pine spikes --- */}
            <svg viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[75px] sm:h-[105px] md:h-[135px] object-cover" preserveAspectRatio="none">
              {/* Back Layer */}
              <path d="M 0 140 L 0 85 L 18 52 L 28 75 L 42 45 L 56 72 L 72 38 L 86 68 L 105 48 L 120 78 L 140 40 L 158 70 L 180 50 L 202 78 L 225 36 L 244 68 L 268 44 L 290 74 L 315 40 L 336 72 L 360 48 L 382 76 L 405 35 L 428 68 L 452 42 L 476 74 L 500 48 L 522 75 L 546 38 L 568 70 L 592 45 L 615 76 L 638 38 L 660 70 L 685 45 L 710 75 L 734 36 L 758 70 L 782 45 L 805 76 L 828 38 L 850 70 L 875 42 L 898 74 L 922 45 L 945 76 L 968 38 L 990 70 L 1015 45 L 1038 75 L 1062 38 L 1085 70 L 1108 45 L 1132 76 L 1155 38 L 1178 70 L 1202 45 L 1225 76 L 1250 40 L 1272 72 L 1295 45 L 1318 75 L 1342 38 L 1365 70 L 1390 45 L 1414 74 L 1440 50 L 1440 140 Z" fill="#1c162b" opacity="0.85" />
              {/* Front Layer Pine Forest (Dark conifer silhouettes seamlessly merging into #07080c) */}
              <path
                d="M 0 140 L 0 100 L 12 70 L 22 92 L 34 60 L 48 88 L 60 52 L 74 84 L 90 62 L 104 90 L 122 55 L 138 85 L 154 62 L 170 92 L 190 50 L 208 82 L 224 58 L 240 88 L 258 54 L 274 84 L 292 60 L 308 90 L 328 52 L 346 84 L 362 60 L 380 92 L 400 48 L 418 80 L 434 56 L 450 88 L 470 52 L 488 82 L 504 58 L 520 90 L 540 50 L 558 80 L 574 58 L 590 88 L 610 52 L 628 82 L 644 58 L 660 90 L 680 48 L 698 80 L 714 56 L 730 88 L 750 52 L 768 82 L 784 58 L 800 90 L 820 48 L 838 80 L 854 56 L 870 88 L 890 52 L 908 82 L 924 58 L 940 90 L 960 50 L 978 80 L 994 58 L 1010 88 L 1030 52 L 1048 82 L 1064 58 L 1080 90 L 1100 48 L 1118 80 L 1134 56 L 1150 88 L 1170 52 L 1188 82 L 1204 58 L 1220 90 L 1240 50 L 1258 80 L 1274 58 L 1290 88 L 1310 52 L 1328 82 L 1344 58 L 1360 90 L 1380 48 L 1398 80 L 1414 56 L 1430 88 L 1440 68 L 1440 140 Z"
                fill="#07080c"
              />

              {/* Bottom Base Solid Strip to guarantee 100% seam-free connection */}
              <rect x="0" y="128" width="1440" height="12" fill="#07080c" />
            </svg>
          </div>

        {/* --- FEATURES: ZIG-ZAG SECTION ---------------------------- */}
        <section id="features" className="relative z-10 bg-[#07080c] py-20 sm:py-28 px-4 sm:px-6">

          {/* Gradient fade from #07080c at top - softens the pine forest edge */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #07080c 0%, transparent 100%)' }} />

          {/* Section eyebrow */}
          <div className="max-w-[1160px] mx-auto text-center mb-20 sm:mb-28">
            <p className="p-kicker justify-center mb-3">What Layer does</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Every attack already has an answer.
            </h2>
          </div>

          <div className="max-w-[1160px] mx-auto space-y-28 sm:space-y-36">

            <FeatureBlock
              reverse={false}
              heading={<>AI that knows scams.<br />You don&apos;t have to.</>}
              body="No blocklists to maintain. No dedicated honeypot channel. Layer's AI understands context - it knows what a scam looks like, even inside an image, without you ever updating a single rule."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              visual={<ScamDetectionMock />}
            />

            <FeatureBlock
              reverse={true}
              heading={<>Banned users<br />can&apos;t come back.</>}
              body="When a banned user creates a new account and rejoins, Layer detects them through behavioral and account pattern matching - and bans the new account automatically."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              visual={<BanEvasionMock />}
            />

            <FeatureBlock
              reverse={false}
              heading={<>Support tickets that<br />resolve themselves.</>}
              body="Layer reads the ticket context, searches your server for relevant channels and roles, and answers common questions automatically. Staff only gets involved when actually needed."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              visual={<TicketMock />}
            />

            <FeatureBlock
              reverse={true}
              heading={<>Verify real people.<br />Store nothing.</>}
              body="Layer confirms a user is human through an interactive challenge - without storing IPs, device fingerprints, or emails. Nothing to breach. Privacy by design."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              visual={<VerificationMock />}
            />

            <FeatureBlock
              reverse={false}
              heading={<>Full control from<br />your browser.</>}
              body="Every Layer module has a dedicated settings page at uselayer.de. Toggle rules, configure thresholds, manage ticket categories - live, without a single bot command."
              primaryHref="/dashboard"
              primaryLabel="Open Dashboard"
              primaryIcon={<Shield className="w-4 h-4" />}
              visual={<DashboardMock switches={switches} toggleSwitch={(k) => toggleSwitch(k as keyof typeof switches)} />}
            />

          </div>

        </section>



        {/* --- 7. FAQ -------------------------------------------- */}
        <section id="faq" className="relative z-10 py-24 px-6">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 lg:gap-24 items-start">

            {/* Left - title */}
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#f1f3f9] tracking-tight leading-[1.1]">
                Frequently<br />asked <span className="text-[#1FA7BB]">questions</span>
              </h2>
              <p className="mt-5 text-sm text-[#4d5467] leading-relaxed max-w-[280px]">
                Still have questions?{' '}
                <a href="https://discord.gg/W2XjhvBbtn" target="_blank" rel="noopener noreferrer"
                  className="text-[#1FA7BB] hover:text-[#25bdd3] transition-colors">
                  Join our Discord
                </a>{' '}and we&apos;ll help you out.
              </p>
            </div>

            {/* Right - accordion */}
            <div>
              {faqs.map((faq, idx) => {
                const isOpen = faqOpen === idx;
                return (
                  <div key={idx} className="border-b border-white/[0.07]">
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : idx)}
                      className="w-full py-5 text-left flex items-center justify-between gap-6 group cursor-pointer"
                    >
                      <span className={`text-[15px] font-semibold leading-snug transition-colors ${isOpen ? 'text-white' : 'text-[#c8cdd8] group-hover:text-white'}`}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#1FA7BB]' : 'text-[#4d5467]'}`}
                      />
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? 300 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.28s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <p className="pb-5 text-sm text-[#737b91] leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* --- 8. Bottom CTA Banner (Protector Exact .cta Style) --- */}
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
                  href="/invite" prefetch={false}
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

        {/* --- 9. Footer -------------------------------------------- */}
        <footer className="relative z-10 bg-[#07080c]">

          {/* Jagged pine-forest top edge - same motif as the hero section */}
          <div className="w-full overflow-hidden leading-none" style={{ height: 48 }}>
            <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
              className="w-full h-full" style={{ display: 'block' }}>
              <path
                d="M0 48 L0 28
                  L20 8 L40 28
                  L60 8 L80 28
                  L100 8 L120 28
                  L140 8 L160 28
                  L180 8 L200 28
                  L220 8 L240 28
                  L260 8 L280 28
                  L300 8 L320 28
                  L340 8 L360 28
                  L380 8 L400 28
                  L420 8 L440 28
                  L460 8 L480 28
                  L500 8 L520 28
                  L540 8 L560 28
                  L580 8 L600 28
                  L620 8 L640 28
                  L660 8 L680 28
                  L700 8 L720 28
                  L740 8 L760 28
                  L780 8 L800 28
                  L820 8 L840 28
                  L860 8 L880 28
                  L900 8 L920 28
                  L940 8 L960 28
                  L980 8 L1000 28
                  L1020 8 L1040 28
                  L1060 8 L1080 28
                  L1100 8 L1120 28
                  L1140 8 L1160 28
                  L1180 8 L1200 28
                  L1220 8 L1240 28
                  L1260 8 L1280 28
                  L1300 8 L1320 28
                  L1340 8 L1360 28
                  L1380 8 L1400 28
                  L1420 8 L1440 28
                  L1440 48 Z"
                fill="#07080c"
              />
            </svg>
          </div>

          {/* Main footer content */}
          <div className="max-w-[1100px] mx-auto px-6 pt-4 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-10 sm:gap-16">

              {/* About col */}
              <div className="max-w-[320px]">
                <div className="flex items-center gap-2.5 mb-4">
                  <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" />
                  <span className="font-extrabold text-[15px] text-white tracking-tight">Layer</span>
                </div>
                <p className="text-[13px] text-[#4d5467] leading-relaxed">
                  Layer is the Discord bot that automatically catches scams, bans evaders,
                  routes tickets with AI, and keeps your community clean - with zero data stored.
                </p>
                <p className="text-[12px] text-[#2e3347] mt-3">Not affiliated with Discord, Inc.</p>
              </div>

              {/* Important links col */}
              <div>
                <p className="text-[12px] font-bold text-white mb-4 tracking-wide uppercase">Important links</p>
                <div className="flex flex-col gap-3">
                  {[
                    ['Dashboard', '/dashboard'],
                    ['Features', '#features'],
                    ['Pricing', '/premium'],
                    ['Team', '/team'],
                    ['Support', 'https://discord.gg/W2XjhvBbtn'],
                  ].map(([label, href]) => (
                    <Link key={label} href={href}
                      className="text-[13px] text-[#4d5467] hover:text-white transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Legal col */}
              <div>
                <p className="text-[12px] font-bold text-white mb-4 tracking-wide uppercase">Legal</p>
                <div className="flex flex-col gap-3">
                  {[
                    ['Privacy Policy', '/privacy'],
                    ['Terms of Service', '/terms'],
                    ['Refunds', '/refunds'],
                    ['Commands', '/commands'],
                  ].map(([label, href]) => (
                    <Link key={label} href={href}
                      className="text-[13px] text-[#4d5467] hover:text-white transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.05]">
            <div className="max-w-[1100px] mx-auto px-6 py-4">
              <span className="text-[12px] text-[#2e3347]">© 2026 Layer. All rights reserved.</span>
            </div>
          </div>

        </footer>

      </div>
  );
}
