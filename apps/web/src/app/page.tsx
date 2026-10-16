'use client';

import { useState, useEffect, useRef } from 'react';
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
  Crown,
  Menu,
  X,
  BookOpen,
  Code2,
} from 'lucide-react';

/* ─── Discord Gamepad SVG Icon ───────────────────────────────── */
function DiscordIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/* ─── FeatureBlock: reusable zig-zag block ────────────────────── */
interface FeatureBlockProps {
  reverse: boolean;
  label: string;
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
  label,
  heading,
  body,
  primaryHref,
  primaryLabel,
  primaryIcon,
  secondaryHref,
  secondaryLabel,
  visual,
}: FeatureBlockProps) {
  return (
    <div className="feat-block grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Visual column — mobile: always first; desktop: alternates via order */}
      <div className={`order-1 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        {visual}
      </div>

      {/* Text column */}
      <div
        className={`order-2 ${reverse ? 'lg:order-1' : 'lg:order-2'} space-y-5 max-w-[480px] mx-auto lg:mx-0`}
      >
        <p className="p-kicker">{label}</p>
        <h3 className="text-[28px] sm:text-[32px] font-extrabold text-white tracking-tight leading-tight">
          {heading}
        </h3>
        <p className="text-[14px] sm:text-[15px] text-[#94a3b8] leading-[1.7] max-w-[420px]">
          {body}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Link
            href={primaryHref}
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

  // Navbar dropdown & language state
  const [activeDropdown, setActiveDropdown] = useState<'plugins' | 'resources' | 'lang' | null>(null);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'DE' | 'FR' | 'ES'>('EN');
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
        
        {/* ─── 1. Header / Sticky Navbar (Picture 1 style) ──────── */}
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

              {/* Desktop Dropdowns: Plugins & Resources */}
              <nav className="hidden md:flex items-center gap-2">
                
                {/* Plugins Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'plugins' ? null : 'plugins')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium transition-colors ${
                      activeDropdown === 'plugins'
                        ? 'text-white bg-white/[0.08]'
                        : 'text-[#cbd5e1] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Plugins</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === 'plugins' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Plugins Menu Dropdown Card */}
                  {activeDropdown === 'plugins' && (
                    <div className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-[#121522]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl p-2.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        href="#features"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#1FA7BB]/15 text-[#1FA7BB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#1FA7BB] transition-colors">
                            Moderation & Security
                          </div>
                          <div className="text-[11px] text-[#94a3b8] leading-tight">
                            Anti-raid shield, auto-ban, spam filters
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="#features"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#3ddc97]/15 text-[#3ddc97] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#3ddc97] transition-colors">
                            Neural OCR Vision
                          </div>
                          <div className="text-[11px] text-[#94a3b8] leading-tight">
                            Real-time scam & fake Nitro image scanning
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="#features"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 text-[#a78bfa] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#a78bfa] transition-colors">
                            High-Fidelity Music
                          </div>
                          <div className="text-[11px] text-[#94a3b8] leading-tight">
                            320kbps lag-free audio streaming & queues
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="#features"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 text-[#fbbf24] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#fbbf24] transition-colors">
                            Leveling & XP
                          </div>
                          <div className="text-[11px] text-[#94a3b8] leading-tight">
                            Custom rank cards, leaderboards & role rewards
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="#features"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#ec4899]/15 text-[#f472b6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#f472b6] transition-colors">
                            Ticket Support
                          </div>
                          <div className="text-[11px] text-[#94a3b8] leading-tight">
                            Interactive buttons, transcripts & threads
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Resources Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium transition-colors ${
                      activeDropdown === 'resources'
                        ? 'text-white bg-white/[0.08]'
                        : 'text-[#cbd5e1] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>Resources</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === 'resources' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Resources Menu Dropdown Card */}
                  {activeDropdown === 'resources' && (
                    <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#121522]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl p-2.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        href="/about"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <BookOpen className="w-4 h-4 text-[#1FA7BB] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#1FA7BB]">Documentation</div>
                          <div className="text-[11px] text-[#94a3b8]">Setup manuals and permissions</div>
                        </div>
                      </Link>
                      <a
                        href="https://discord.gg"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <Users className="w-4 h-4 text-[#38bdf8] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#38bdf8]">Support Server</div>
                          <div className="text-[11px] text-[#94a3b8]">Join 5,000+ members in Discord</div>
                        </div>
                      </a>
                      <Link
                        href="/commands"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <Code2 className="w-4 h-4 text-[#a78bfa] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#a78bfa]">Bot Commands</div>
                          <div className="text-[11px] text-[#94a3b8]">Full list of slash commands</div>
                        </div>
                      </Link>
                      <Link
                        href="/api/health"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <Activity className="w-4 h-4 text-[#3ddc97] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#3ddc97]">Status & Shards</div>
                          <div className="text-[11px] text-[#94a3b8]">99.98% uptime and cluster health</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

              </nav>
            </div>

            {/* Right: Language Selector, Premium Button & Login */}
            <div className="flex items-center gap-3">
              
              {/* Language Selector */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'lang' ? null : 'lang')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                    activeDropdown === 'lang'
                      ? 'text-white bg-white/[0.08]'
                      : 'text-[#cbd5e1] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-sm">🇬🇧</span>
                  <span className="font-semibold">{selectedLang}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-[#94a3b8] transition-transform duration-200 ${
                      activeDropdown === 'lang' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === 'lang' && (
                  <div className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-[#121522]/95 backdrop-blur-xl border border-white/[0.1] shadow-xl p-1 z-50 text-xs">
                    {(['EN', 'DE', 'FR', 'ES'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedLang(lang);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between hover:bg-white/[0.06] transition-colors ${
                          selectedLang === lang ? 'text-[#1FA7BB] font-bold' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <span>
                          {lang === 'EN' ? '🇬🇧 English' : lang === 'DE' ? '🇩🇪 Deutsch' : lang === 'FR' ? '🇫🇷 Français' : '🇪🇸 Español'}
                        </span>
                        {selectedLang === lang && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Highlighted Secondary Premium Button with Crown */}
              <Link
                href="/premium"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs sm:text-sm font-semibold bg-[#262014] text-[#facc15] border border-[#eab308]/30 hover:bg-[#342b1a] hover:border-[#eab308]/50 shadow-sm transition-all duration-150"
              >
                <Crown className="w-3.5 h-3.5 text-[#facc15]" />
                <span>Premium</span>
              </Link>

              {/* Primary Login Button in Main Brand Color */}
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-xs sm:text-sm font-semibold text-white bg-[#1FA7BB] hover:bg-[#25bdd3] shadow-md shadow-[#1FA7BB]/20 hover:shadow-[#1FA7BB]/35 transition-all duration-150"
              >
                <span>Login with Discord</span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#cbd5e1] hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Toggle navigation menu"
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
                  Features & Plugins
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

              <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                <span className="text-xs text-[#737b91]">Language</span>
                <div className="flex gap-1.5">
                  {(['EN', 'DE', 'FR', 'ES'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        selectedLang === lang ? 'bg-[#1FA7BB] text-white' : 'bg-white/[0.05] text-[#cbd5e1]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* ─── 2. HERO CONTAINER (Mood Dark + Dusk Gradient + Pine Forest Edge) ─── */}
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

          {/* Announcement Banner (Centered Below Navbar) */}
          <div className="pt-6 sm:pt-8 pb-4 flex justify-center px-4 relative z-20">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-white/[0.22] hover:bg-white/[0.07] text-xs sm:text-sm text-[#cbd5e1] transition-all duration-150 backdrop-blur-sm group shadow-lg shadow-black/20"
            >
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#1FA7BB]/20 text-[#1FA7BB] border border-[#1FA7BB]/35">
                NEW!
              </span>
              <span>Turn your ideas into a Discord bot.</span>
              <span className="font-semibold text-white group-hover:text-[#1FA7BB] transition-colors inline-flex items-center gap-1">
                Explore Bot Maker{' '}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          {/* Hero Section (Two Columns, ~1200px Container) */}
          <section className="relative z-20 pt-6 sm:pt-10 pb-28 lg:pb-36 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column: 3-line Headline, Muted Paragraph, 2 Rounded 6px Buttons */}
              <div className="lg:col-span-6 space-y-6 order-1 text-left">
                {/* 3-line bold headline (56-64px) */}
                <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-white leading-[1.08] tracking-tight">
                  The best <br />
                  all-in-one bot <br />
                  for Discord
                </h1>

                {/* Muted paragraph (about 3 lines, 16-17px) */}
                <p className="text-base sm:text-[17px] text-[#94a3b8] leading-relaxed max-w-lg">
                  Layer is a complete Discord bot, easy to use, that thousands of
                  Discord servers worldwide trust to manage, protect, entertain, and grow
                  their community.
                </p>

                {/* Two buttons side by side (rounded at about 6px) */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  {/* Primary button with Discord icon in main brand color */}
                  <Link
                    href="/invite"
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

              {/* Right Column: Illustration of Mascot Characters on Rocky Cliff with Leafy Vines & Glowing Moon */}
              <div className="lg:col-span-6 order-2 relative flex justify-center lg:justify-end items-end select-none">
                
                {/* ─── MASCOT CLIFF ILLUSTRATION (Picture 1 Exact Recreation) ─── */}
                {/* Custom illustration container: You can also drop your own PNG here */}
                <div className="w-full max-w-[580px] relative">
                  <svg
                    viewBox="0 0 640 450"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-2xl"
                  >
                    <defs>
                      {/* Moon Ambient Glow */}
                      <radialGradient id="moonGlow" cx="62%" cy="65%" r="48%">
                        <stop offset="0%" stopColor="#fff8db" stopOpacity="0.45" />
                        <stop offset="35%" stopColor="#ffd880" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#ffd880" stopOpacity="0" />
                      </radialGradient>

                      {/* Cliff Gradient */}
                      <linearGradient id="cliffGrad" x1="20%" y1="0%" x2="90%" y2="100%">
                        <stop offset="0%" stopColor="#252b3d" />
                        <stop offset="35%" stopColor="#1a1e2b" />
                        <stop offset="100%" stopColor="#0e1017" />
                      </linearGradient>

                      {/* Mascot Cyan / Brand Shading */}
                      <linearGradient id="mascotBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#5edff3" />
                        <stop offset="100%" stopColor="#1FA7BB" />
                      </linearGradient>

                      {/* Crown Gold Gradient */}
                      <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>

                      {/* Straw Hat Gradient */}
                      <linearGradient id="strawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#ca8a04" />
                      </linearGradient>

                      {/* Helmet Silver Gradient */}
                      <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                    </defs>

                    {/* 1. Moon & Radiant Atmospheric Halo behind cliff */}
                    <circle cx="410" cy="350" r="180" fill="url(#moonGlow)" />
                    <circle cx="410" cy="355" r="75" fill="#fff7d6" opacity="0.9" />

                    {/* 2. Rocky Cliff Face (Jutting from bottom right) */}
                    {/* Shadow Body */}
                    <path
                      d="M 370 450 L 388 322 Q 402 316 430 318 L 640 318 L 640 450 Z"
                      fill="url(#cliffGrad)"
                    />
                    {/* Cliff Top Ledge Highlights & Crevices */}
                    <path
                      d="M 388 322 Q 410 316 440 318 L 640 318 L 640 326 Q 440 326 405 328 Z"
                      fill="#2e3549"
                    />
                    {/* Craggy facets & cracks on cliff wall */}
                    <path
                      d="M 400 340 L 420 375 L 415 410 L 435 450 M 460 330 L 475 365 L 470 405 M 540 330 L 555 380 L 570 450"
                      stroke="#141822"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 392 328 L 410 355 M 480 340 L 500 370"
                      stroke="#38435d"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* 3. Lush Leafy Vines hanging over cliff */}
                    {/* Vine Stem 1 */}
                    <path
                      d="M 394 322 Q 380 360 395 395 Q 405 425 398 450"
                      stroke="#166534"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Leaves along Vine 1 */}
                    <ellipse cx="384" cy="340" rx="7" ry="4" fill="#22c55e" transform="rotate(-30 384 340)" />
                    <ellipse cx="396" cy="360" rx="8" ry="4.5" fill="#16a34a" transform="rotate(20 396 360)" />
                    <ellipse cx="388" cy="380" rx="7" ry="4" fill="#4ade80" transform="rotate(-40 388 380)" />
                    <ellipse cx="403" cy="405" rx="7.5" ry="4" fill="#22c55e" transform="rotate(15 403 405)" />
                    <ellipse cx="394" cy="430" rx="6" ry="3.5" fill="#15803d" transform="rotate(-25 394 430)" />

                    {/* Vine Stem 2 (Right side) */}
                    <path
                      d="M 590 322 Q 605 350 595 385 Q 588 415 600 450"
                      stroke="#166534"
                      strokeWidth="3"
                      fill="none"
                    />
                    <ellipse cx="602" cy="345" rx="7" ry="4" fill="#22c55e" transform="rotate(35 602 345)" />
                    <ellipse cx="590" cy="370" rx="7.5" ry="4" fill="#16a34a" transform="rotate(-20 590 370)" />
                    <ellipse cx="600" cy="400" rx="6.5" ry="3.5" fill="#4ade80" transform="rotate(40 600 400)" />
                    <ellipse cx="592" cy="425" rx="6" ry="3" fill="#15803d" transform="rotate(-15 592 425)" />

                    {/* ─── 4. FOUR MASCOTS ON CLIFF EDGE (Picture 1 style) ─── */}

                    {/* MASCOT 1: Viking (Leftmost, near cliff edge) */}
                    <g transform="translate(408, 280)">
                      {/* Shadow */}
                      <ellipse cx="0" cy="38" rx="16" ry="4" fill="#000" opacity="0.4" />
                      {/* Body */}
                      <circle cx="0" cy="12" r="23" fill="url(#mascotBlue)" />
                      {/* Eyes */}
                      <circle cx="-6" cy="10" r="3" fill="#0f172a" />
                      <circle cx="-5" cy="9" r="1" fill="#fff" />
                      <circle cx="6" cy="10" r="3" fill="#0f172a" />
                      <circle cx="7" cy="9" r="1" fill="#fff" />
                      {/* Open Battle Mouth */}
                      <path d="M -4 18 Q 0 25 4 18 Z" fill="#0f172a" />
                      {/* Belt */}
                      <path d="M -21 21 Q 0 28 21 21" stroke="#78350f" strokeWidth="3" fill="none" />
                      {/* Viking Horned Helmet */}
                      <path d="M -20 2 Q 0 -12 20 2 L 18 8 Q 0 -2 -18 8 Z" fill="url(#ironGrad)" />
                      {/* Left Horn */}
                      <path d="M -18 2 Q -30 -2 -26 -14 Q -20 -10 -14 -1 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                      {/* Right Horn */}
                      <path d="M 18 2 Q 30 -2 26 -14 Q 20 -10 14 -1 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                      {/* Mini Sword */}
                      <path d="M -24 16 L -32 -2 L -29 -4 L -21 14 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
                      <rect x="-26" y="14" width="7" height="2" rx="1" fill="#d97706" transform="rotate(-30 -26 14)" />
                      {/* Boots */}
                      <ellipse cx="-7" cy="35" rx="5" ry="3" fill="#78350f" />
                      <ellipse cx="7" cy="35" rx="5" ry="3" fill="#78350f" />
                    </g>

                    {/* MASCOT 2: Explorer / Farmer with Straw Hat & Shovel */}
                    <g transform="translate(468, 276)">
                      {/* Shadow */}
                      <ellipse cx="0" cy="42" rx="17" ry="4" fill="#000" opacity="0.4" />
                      {/* Body */}
                      <circle cx="0" cy="14" r="24" fill="url(#mascotBlue)" />
                      {/* Eyes */}
                      <circle cx="-6" cy="12" r="3" fill="#0f172a" />
                      <circle cx="-5" cy="11" r="1" fill="#fff" />
                      <circle cx="6" cy="12" r="3" fill="#0f172a" />
                      <circle cx="7" cy="11" r="1" fill="#fff" />
                      {/* Friendly Smile */}
                      <path d="M -5 19 Q 0 24 5 19" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
                      {/* Straw Hat */}
                      <ellipse cx="0" cy="2" rx="27" ry="7" fill="url(#strawGrad)" stroke="#a16207" strokeWidth="1" />
                      <path d="M -13 2 Q 0 -15 13 2 Z" fill="url(#strawGrad)" stroke="#a16207" strokeWidth="1" />
                      <rect x="-13" y="0" width="26" height="3" fill="#dc2626" />
                      {/* Shovel resting over shoulder */}
                      <line x1="18" y1="36" x2="34" y2="-6" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 28 -6 L 38 -12 L 44 -4 L 34 2 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                      {/* Boots */}
                      <ellipse cx="-7" cy="38" rx="6" ry="3.5" fill="#854d0e" />
                      <ellipse cx="7" cy="38" rx="6" ry="3.5" fill="#854d0e" />
                    </g>

                    {/* MASCOT 3: Greek / Roman Toga with Laurel Wreath (Jumping Joyfully) */}
                    <g transform="translate(534, 252)">
                      {/* Shadow on cliff below */}
                      <ellipse cx="0" cy="66" rx="14" ry="3" fill="#000" opacity="0.3" />
                      {/* Floating / Jumping Body */}
                      <circle cx="0" cy="12" r="23" fill="url(#mascotBlue)" />
                      {/* Happy Closed Wink Eyes */}
                      <path d="M -8 11 Q -5 7 -2 11" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M 2 11 Q 5 7 8 11" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      {/* Joyful Laughing Mouth */}
                      <path d="M -4 17 Q 0 25 4 17 Z" fill="#0f172a" />
                      {/* White Toga Drape */}
                      <path d="M -21 16 Q 0 32 21 16 L 16 32 Q 0 35 -16 32 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                      <path d="M -18 16 L 12 32" stroke="#eab308" strokeWidth="2" fill="none" />
                      {/* Golden Laurel Wreath Leaves on Head */}
                      <path d="M -16 2 Q -8 -6 0 -2 Q 8 -6 16 2" stroke="#ca8a04" strokeWidth="2" fill="none" />
                      <circle cx="-12" cy="0" r="2.5" fill="#eab308" />
                      <circle cx="-6" cy="-4" r="2.5" fill="#eab308" />
                      <circle cx="0" cy="-3" r="2.5" fill="#fde047" />
                      <circle cx="6" cy="-4" r="2.5" fill="#eab308" />
                      <circle cx="12" cy="0" r="2.5" fill="#eab308" />
                      {/* Joyful Outstretched Arms */}
                      <ellipse cx="-24" cy="5" rx="5" ry="3" fill="#1FA7BB" transform="rotate(-30 -24 5)" />
                      <ellipse cx="24" cy="5" rx="5" ry="3" fill="#1FA7BB" transform="rotate(30 24 5)" />
                      {/* Golden Winged Sandals */}
                      <ellipse cx="-8" cy="38" rx="5" ry="3" fill="#eab308" />
                      <ellipse cx="8" cy="36" rx="5" ry="3" fill="#eab308" />
                    </g>

                    {/* MASCOT 4: King (Rightmost, Crown & Royal Crimson Cape) */}
                    <g transform="translate(594, 274)">
                      {/* Shadow */}
                      <ellipse cx="0" cy="44" rx="18" ry="4" fill="#000" opacity="0.4" />
                      {/* Royal Red Cape Drape Behind */}
                      <path d="M -22 16 Q -30 42 -18 46 L 22 46 Q 32 42 22 16 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                      {/* Body */}
                      <circle cx="0" cy="14" r="25" fill="url(#mascotBlue)" />
                      {/* Eyes */}
                      <circle cx="-6" cy="11" r="3" fill="#0f172a" />
                      <circle cx="-5" cy="10" r="1" fill="#fff" />
                      <circle cx="6" cy="11" r="3" fill="#0f172a" />
                      <circle cx="7" cy="10" r="1" fill="#fff" />
                      {/* Regal Beard & Mustache in Warm Brown */}
                      <path
                        d="M -16 16 Q -10 13 -2 18 Q 6 13 16 16 Q 14 36 0 38 Q -14 36 -16 16 Z"
                        fill="#78350f"
                      />
                      <ellipse cx="0" cy="20" rx="3" ry="1.5" fill="#451a03" />
                      {/* Ornate Gold Crown with Jewels */}
                      <path
                        d="M -16 0 L -18 -14 L -8 -7 L 0 -17 L 8 -7 L 18 -14 L 16 0 Z"
                        fill="url(#crownGold)"
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                      <circle cx="-16" cy="-13" r="2" fill="#ef4444" />
                      <circle cx="0" cy="-16" r="2.5" fill="#ef4444" />
                      <circle cx="16" cy="-13" r="2" fill="#ef4444" />
                      <circle cx="0" cy="-3" r="2" fill="#3b82f6" />
                    </g>
                  </svg>
                </div>

              </div>

            </div>
          </section>

          {/* ─── 3. PINE TREE SILHOUETTE ALONG BOTTOM EDGE (Picture 1 exact match) ─── */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none z-10 leading-none">
            <svg
              viewBox="0 0 1440 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-[75px] sm:h-[105px] md:h-[135px] object-cover"
              preserveAspectRatio="none"
            >
              {/* Back Layer Conifer Silhouette (Dusky purple conifer horizon) */}
              <path
                d="M 0 140 L 0 85 L 18 52 L 28 75 L 42 45 L 56 72 L 72 38 L 86 68 L 105 48 L 120 78 L 140 40 L 158 70 L 180 50 L 202 78 L 225 36 L 244 68 L 268 44 L 290 74 L 315 40 L 336 72 L 360 48 L 382 76 L 405 35 L 428 68 L 452 42 L 476 74 L 500 48 L 522 75 L 546 38 L 568 70 L 592 45 L 615 76 L 638 38 L 660 70 L 685 45 L 710 75 L 734 36 L 758 70 L 782 45 L 805 76 L 828 38 L 850 70 L 875 42 L 898 74 L 922 45 L 945 76 L 968 38 L 990 70 L 1015 45 L 1038 75 L 1062 38 L 1085 70 L 1108 45 L 1132 76 L 1155 38 L 1178 70 L 1202 45 L 1225 76 L 1250 40 L 1272 72 L 1295 45 L 1318 75 L 1342 38 L 1365 70 L 1390 45 L 1414 74 L 1440 50 L 1440 140 Z"
                fill="#1c162b"
                opacity="0.85"
              />

              {/* Front Layer Pine Forest (Dark conifer silhouettes seamlessly merging into #07080c) */}
              <path
                d="M 0 140 L 0 100 L 12 70 L 22 92 L 34 60 L 48 88 L 60 52 L 74 84 L 90 62 L 104 90 L 122 55 L 138 85 L 154 62 L 170 92 L 190 50 L 208 82 L 224 58 L 240 88 L 258 54 L 274 84 L 292 60 L 308 90 L 328 52 L 346 84 L 362 60 L 380 92 L 400 48 L 418 80 L 434 56 L 450 88 L 470 52 L 488 82 L 504 58 L 520 90 L 540 50 L 558 80 L 574 58 L 590 88 L 610 52 L 628 82 L 644 58 L 660 90 L 680 48 L 698 80 L 714 56 L 730 88 L 750 52 L 768 82 L 784 58 L 800 90 L 820 48 L 838 80 L 854 56 L 870 88 L 890 52 L 908 82 L 924 58 L 940 90 L 960 50 L 978 80 L 994 58 L 1010 88 L 1030 52 L 1048 82 L 1064 58 L 1080 90 L 1100 48 L 1118 80 L 1134 56 L 1150 88 L 1170 52 L 1188 82 L 1204 58 L 1220 90 L 1240 50 L 1258 80 L 1274 58 L 1290 88 L 1310 52 L 1328 82 L 1344 58 L 1360 90 L 1380 48 L 1398 80 L 1414 56 L 1430 88 L 1440 68 L 1440 140 Z"
                fill="#07080c"
              />

              {/* Bottom Base Solid Strip to guarantee 100% seam-free connection */}
              <rect x="0" y="128" width="1440" height="12" fill="#07080c" />
            </svg>
          </div>
        </div>

        {/* ─── FEATURES: ZIG-ZAG SECTION ──────────────────────────── */}
        <section id="features" className="relative z-10 bg-[#07080c] py-20 sm:py-28 px-4 sm:px-6">

          {/* Section eyebrow */}
          <div className="max-w-[1160px] mx-auto text-center mb-20 sm:mb-28">
            <p className="p-kicker justify-center mb-3">What Layer does</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Every attack already has an answer.
            </h2>
          </div>

          <div className="max-w-[1160px] mx-auto space-y-28 sm:space-y-36">

            {/* ── FEATURE 1: Anti-Raid Shield  (visual left, text right) ── */}
            <FeatureBlock
              reverse={false}
              label="Anti-Raid & Flood Shield"
              heading={<>Stop a raid before it<br />touches your members.</>}
              body="When join velocity spikes past your threshold Layer freezes the gate: new accounts are quarantined in memory, existing members stay completely unaffected, and the entire lockdown resolves without a single staff ping. The moment the wave stops, the server reopens on its own."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              secondaryHref="#"
              secondaryLabel="See raid settings"
              visual={
                <div className="relative">
                  {/* Floating avatar badges */}
                  <div className="float-a absolute -top-5 -left-5 w-11 h-11 rounded-full bg-[#ff6b6b]/20 border-2 border-[#ff6b6b]/40 flex items-center justify-center text-[#ff6b6b] shadow-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="float-b absolute -bottom-4 -right-4 w-9 h-9 rounded-full bg-[#3ddc97]/15 border border-[#3ddc97]/40 flex items-center justify-center text-[#3ddc97] shadow-lg">
                    <Check className="w-4 h-4" />
                  </div>

                  {/* Main card */}
                  <div className="rounded-2xl bg-[#0d0f18] border border-white/[0.09] shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07] bg-[#111420]">
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-[#ffc14d]" />
                        <span className="text-xs font-bold text-white">Raid Detector — Live</span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff6b6b]/12 text-[#ff6b6b] border border-[#ff6b6b]/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] animate-pulse" />
                        LOCKDOWN
                      </span>
                    </div>

                    {/* Velocity meter */}
                    <div className="px-5 py-4 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#aab1c5]">Join velocity</span>
                        <span className="font-mono text-[#ff6b6b] font-bold">47 joins / 1.4s</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#1a1e2b] overflow-hidden">
                        <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-[#ffc14d] to-[#ff6b6b]" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {[
                          { label: 'Stopped', val: '47', col: 'text-[#ff6b6b]' },
                          { label: 'Quarantined', val: '47', col: 'text-[#ffc14d]' },
                          { label: 'Staff Pings', val: '0', col: 'text-[#3ddc97]' },
                        ].map(s => (
                          <div key={s.label} className="rounded-xl bg-[#111420] border border-white/[0.06] px-3 py-2 text-center">
                            <div className={`text-sm font-bold ${s.col}`}>{s.val}</div>
                            <div className="text-[10px] text-[#737b91] mt-0.5">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Log feed */}
                    <div className="px-5 pb-4 space-y-1.5">
                      {[
                        { time: '00:00:01', msg: 'Lockdown triggered — threshold exceeded' },
                        { time: '00:00:01', msg: '47 new accounts held in memory quarantine' },
                        { time: '00:00:09', msg: 'Raid wave subsided — gate re-opening' },
                      ].map((l, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[11px] font-mono">
                          <span className="text-[#4d5467] shrink-0">{l.time}</span>
                          <span className="text-[#aab1c5]">{l.msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Layered second mini-card behind */}
                  <div className="absolute -bottom-3 left-4 right-4 h-10 rounded-xl bg-[#0d0f18] border border-white/[0.06] -z-10 opacity-60" />
                </div>
              }
            />

            {/* ── FEATURE 2: Neural OCR Scam Vision  (text left, visual right) ── */}
            <FeatureBlock
              reverse={true}
              label="Neural OCR Vision"
              heading={<>Reads the scam inside<br />the image.</>}
              body="Scammers stopped using text links the moment bots got good at filtering them. Now they send screenshots: fake Nitro gifts, QR codes, phishing URLs embedded inside an image. Layer reads the pixels, extracts the text, matches it against known scam patterns, and pulls the message in under 11 ms — before a single member can tap the image."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              visual={
                <div className="relative">
                  {/* Decorative floating icon */}
                  <div className="float-c absolute -top-5 -right-5 w-12 h-12 rounded-2xl bg-[#1FA7BB]/15 border border-[#1FA7BB]/30 flex items-center justify-center shadow-xl">
                    <Eye className="w-5 h-5 text-[#1FA7BB]" />
                  </div>

                  {/* Scan result card stacked on top of "image" card */}
                  <div className="relative">
                    {/* Background "image" message */}
                    <div className="rounded-2xl bg-[#0d0f18] border border-white/[0.09] shadow-2xl p-5 space-y-3">
                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.07]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1FA7BB] to-[#0d4a54]" />
                        <div>
                          <div className="text-xs font-semibold text-white">scammer_account_#1337</div>
                          <div className="text-[10px] text-[#737b91]">posted in #general</div>
                        </div>
                      </div>

                      {/* Fake image preview with scan overlay */}
                      <div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
                        {/* Placeholder image */}
                        <div className="h-28 bg-gradient-to-br from-[#1a1424] to-[#0d0f18] flex items-center justify-center">
                          <div className="text-center space-y-1.5">
                            <div className="w-12 h-8 rounded bg-[#1FA7BB]/20 mx-auto flex items-center justify-center">
                              <span className="text-[10px] font-mono text-[#1FA7BB] font-bold">IMG</span>
                            </div>
                            <div className="text-[10px] text-[#4d5467] font-mono">nitro_gift_real.png</div>
                          </div>
                        </div>

                        {/* OCR scan overlay */}
                        <div className="absolute inset-0 bg-[#ff6b6b]/08 border-2 border-[#ff6b6b]/60 rounded-xl flex items-center justify-center">
                          <div className="bg-[#07080c]/90 rounded-lg px-3 py-2 flex items-center gap-2 shadow-xl">
                            <Eye className="w-4 h-4 text-[#ff6b6b] shrink-0" />
                            <div>
                              <div className="text-[11px] font-bold text-[#ff6b6b]">SCAM DETECTED</div>
                              <div className="text-[10px] text-[#aab1c5]">OCR matched phishing URL pattern</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action taken row */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#737b91]">Message deleted · user warned</span>
                        <span className="font-mono text-[#3ddc97] font-semibold">11ms</span>
                      </div>
                    </div>

                    {/* Layered shadow card */}
                    <div className="absolute -bottom-3 left-4 right-4 h-10 rounded-2xl bg-[#0d0f18] border border-white/[0.06] -z-10 opacity-50" />
                  </div>
                </div>
              }
            />

            {/* ── FEATURE 3: Anti-Nuke + Auto-Restore  (visual left, text right) ── */}
            <FeatureBlock
              reverse={false}
              label="Anti-Nuke & Restore"
              heading={<>One click undo<br />for nuclear attacks.</>}
              body="A rogue admin starts bulk-deleting channels, stripping roles, kicking members. Layer detects the pattern in real time, strips the attacker's permissions instantly, then rebuilds every deleted channel, permission overwrite, and role configuration from its last snapshot — in under 60 ms per object. Your server structure comes back as if nothing happened."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              secondaryHref="#"
              secondaryLabel="See how restore works"
              visual={
                <div className="relative">
                  <div className="float-a absolute -top-5 -right-5 w-11 h-11 rounded-full bg-[#3ddc97]/15 border border-[#3ddc97]/40 flex items-center justify-center text-[#3ddc97] shadow-lg">
                    <RotateCcw className="w-4 h-4" />
                  </div>

                  <div className="rounded-2xl bg-[#0d0f18] border border-white/[0.09] shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07] bg-[#111420]">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#3ddc97]" />
                        <span className="text-xs font-bold text-white">Auto-Restore — Running</span>
                      </div>
                      <span className="text-[10px] text-[#3ddc97] font-mono font-bold">COMPLETE</span>
                    </div>

                    <div className="p-4 space-y-2">
                      {[
                        { name: '#general', type: 'Channel', ms: '34ms', done: true },
                        { name: '#announcements', type: 'Channel', ms: '41ms', done: true },
                        { name: '#rules-and-info', type: 'Channel', ms: '55ms', done: true },
                        { name: 'Moderator', type: 'Role', ms: '22ms', done: true },
                        { name: 'Member', type: 'Role', ms: '18ms', done: true },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#111420] border border-white/[0.05]"
                        >
                          <div className="flex items-center gap-2.5 text-xs">
                            <span className="text-[#737b91] font-mono">{item.type === 'Channel' ? '#' : '@'}</span>
                            <span className="text-white font-medium">{item.name.replace('#', '').replace('@', '')}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1e2b] text-[#737b91] font-mono">{item.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#4d5467]">{item.ms}</span>
                            <div className="w-5 h-5 rounded-full bg-[#3ddc97]/15 flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#3ddc97]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-5 py-3 border-t border-white/[0.07] bg-[#111420]/50 flex items-center justify-between text-xs text-[#737b91]">
                      <span>5 objects restored from snapshot</span>
                      <span className="text-[#3ddc97] font-semibold">Avg 34ms per object</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 left-4 right-4 h-10 rounded-2xl bg-[#0d0f18] border border-white/[0.06] -z-10 opacity-50" />
                </div>
              }
            />

            {/* ── FEATURE 4: Zero-Storage Verification  (text left, visual right) ── */}
            <FeatureBlock
              reverse={true}
              label="Zero-Storage Verification"
              heading={<>Verify real people.<br />Store nothing.</>}
              body="Layer's verification system confirms a user is human through an interactive browser challenge — without storing IPs, device fingerprints, or emails. The result is kept only in Discord's own role system. Bots stay out. Privacy stays intact. There's nothing for a data breach to expose."
              primaryHref="/invite"
              primaryLabel="Add to Discord"
              primaryIcon={<DiscordIcon size={16} />}
              visual={
                <div className="relative">
                  <div className="float-b absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center shadow-lg">
                    <UserCheck className="w-4 h-4 text-[#a78bfa]" />
                  </div>

                  {/* Verification panel */}
                  <div className="rounded-2xl bg-[#0d0f18] border border-white/[0.09] shadow-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.07] bg-[#111420] text-center space-y-0.5">
                      <div className="text-xs font-bold text-white">Layer Verification</div>
                      <div className="text-[10px] text-[#737b91]">Community Server · 4,200 members</div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Privacy badge row */}
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1FA7BB]/08 border border-[#1FA7BB]/20">
                        <Lock className="w-4 h-4 text-[#1FA7BB] shrink-0" />
                        <span className="text-[11px] text-[#aab1c5]">
                          Zero data stored · No IPs · No emails logged
                        </span>
                      </div>

                      {/* Status based on verifyStatus */}
                      {verifyStatus === 'idle' ? (
                        <button
                          onClick={() => setVerifyStatus('verified')}
                          className="w-full py-3 rounded-[6px] bg-[#1FA7BB] hover:bg-[#25bdd3] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Complete verification
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#3ddc97]/10 border border-[#3ddc97]/30">
                          <Check className="w-4 h-4 text-[#3ddc97]" />
                          <span className="text-sm font-semibold text-[#3ddc97]">Verified — member role granted</span>
                        </div>
                      )}

                      {/* Stat pills */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { val: '0', label: 'IPs stored' },
                          { val: '0', label: 'Emails logged' },
                          { val: '100%', label: 'In-memory' },
                        ].map(s => (
                          <div key={s.label} className="rounded-xl bg-[#111420] border border-white/[0.06] py-2">
                            <div className="text-sm font-bold text-white">{s.val}</div>
                            <div className="text-[10px] text-[#737b91] mt-0.5">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* ── FEATURE 5: Web Dashboard & Control Panel  (visual left, text right) ── */}
            <FeatureBlock
              reverse={false}
              label="Web Dashboard"
              heading={<>Full control from<br />your browser.</>}
              body="Every Layer module has a dedicated settings page at uselayer.de. Toggle anti-raid thresholds, configure OCR sensitivity, set leveling multipliers, manage ticket categories — live, without a single bot command. Changes sync over websocket and reflect on your server within 12 ms. The dashboard is protected by Discord OAuth and permission-gated per role."
              primaryHref="/dashboard"
              primaryLabel="Open Dashboard"
              primaryIcon={<ExternalLink size={14} />}
              visual={
                <div className="relative">
                  <div className="float-a absolute -top-5 -right-5 w-12 h-12 rounded-2xl bg-[#1FA7BB]/15 border border-[#1FA7BB]/30 flex items-center justify-center shadow-xl">
                    <Sliders className="w-5 h-5 text-[#1FA7BB]" />
                  </div>
                  <div className="float-c absolute -bottom-5 -left-5 w-9 h-9 rounded-full bg-[#3ddc97]/15 border border-[#3ddc97]/30 flex items-center justify-center shadow-lg">
                    <Activity className="w-3.5 h-3.5 text-[#3ddc97]" />
                  </div>

                  {/* Dashboard card */}
                  <div className="rounded-2xl bg-[#0d0f18] border border-white/[0.09] shadow-2xl overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07] bg-[#111420]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1FA7BB] to-[#0d4a54] flex items-center justify-center text-[10px] font-bold text-white">GS</div>
                        <div>
                          <div className="text-xs font-semibold text-white">Gaming Server Hub</div>
                          <div className="text-[10px] text-[#737b91]">Security settings</div>
                        </div>
                      </div>
                      <span className="p-status-pill">
                        <span className="p-pulse" />
                        <span>Live</span>
                      </span>
                    </div>

                    {/* Toggle rows */}
                    <div className="p-3 space-y-1">
                      {[
                        { key: 'antiRaid' as const, label: 'Anti-Raid Shield', desc: 'Auto-lock on join spike' },
                        { key: 'antiScam' as const, label: 'Neural OCR Scanner', desc: 'Image scam detection' },
                        { key: 'botQuarantine' as const, label: 'Bot Quarantine', desc: 'Hold bots for owner approval' },
                        { key: 'autoRestore' as const, label: 'Auto Structure Restore', desc: 'Rebuild on nuke event' },
                        { key: 'ocrVision' as const, label: 'AI Ticket Bot', desc: 'Answer common questions' },
                      ].map(m => {
                        const checked = switches[m.key];
                        return (
                          <div
                            key={m.key}
                            onClick={() => toggleSwitch(m.key)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-white">{m.label}</div>
                              <div className="text-[10px] text-[#737b91]">{m.desc}</div>
                            </div>
                            <div className="p-switch" data-checked={checked ? 'true' : 'false'}>
                              <div className="p-switch-knob" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-5 py-2.5 border-t border-white/[0.07] bg-[#111420]/60 flex items-center justify-between text-[11px] text-[#737b91]">
                      <span>Changes sync via websocket</span>
                      <span className="text-[#3ddc97]">Latency: 12ms</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 left-4 right-4 h-10 rounded-2xl bg-[#0d0f18] border border-white/[0.06] -z-10 opacity-50" />
                </div>
              }
            />

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
  );
}
