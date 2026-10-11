"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoadingBar } from "@/components/LoadingBar";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/ToastContainer";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  LogOut, 
  Bot, 
  Shield, 
  Zap, 
  Music,
  Ticket,
  ChevronDown,
  ShieldCheck,
  Activity,
  Mail,
  Gift,
  UserPlus,
  Ban,
  BarChart3,
  Menu,
  X
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isServerRoute = pathname !== "/dashboard" && pathname !== "/dashboard/invites" && pathname.startsWith("/dashboard/") && pathname !== "/dashboard/billing" && pathname !== "/dashboard/settings";
  const serverId = isServerRoute ? pathname.split('/')[2] : null;
  const serverBaseUrl = `/dashboard/${serverId}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('button[aria-label="Toggle sidebar"]')) {
          setSidebarOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <ToastProvider>
    <div className="flex h-screen overflow-hidden" style={{ background: "#101012", color: "#F5F4F5" }}>
      <LoadingBar />
      <ToastContainer />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed lg:relative w-64 h-full flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: "#101012", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="Layer" className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-semibold tracking-tight" style={{ color: "#F5F4F5" }}>Layer</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: "#A8A9A2" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {isServerRoute ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-1" style={{ color: "#A8A9A2" }}>Server</p>
              <SidebarItem href={serverBaseUrl} icon={<LayoutDashboard size={16} />} label="Overview" active={pathname === serverBaseUrl} />
              <SidebarItem href={`${serverBaseUrl}/logs`} icon={<Activity size={16} />} label="Activity Logs" active={pathname.endsWith('/logs')} />
              <SidebarItem href={`${serverBaseUrl}/team`} icon={<Users size={16} />} label="Team" active={pathname.endsWith('/team')} />
              <SidebarItem href={`${serverBaseUrl}/settings`} icon={<Settings size={16} />} label="Server Settings" active={pathname.endsWith('/settings')} />

              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-6" style={{ color: "#A8A9A2" }}>Modules</p>
              <SidebarItem href={`${serverBaseUrl}/ai`} icon={<Bot size={16} />} label="AI Setup" active={pathname.endsWith('/ai')} />
              <SidebarItem href={`${serverBaseUrl}/ai-detection`} icon={<Bot size={16} />} label="AI Detection" active={pathname.endsWith('/ai-detection')} />
              <SidebarItem href={`${serverBaseUrl}/moderation`} icon={<Shield size={16} />} label="Moderation" active={pathname.endsWith('/moderation')} />
              <SidebarItem href={`${serverBaseUrl}/anti-scam`} icon={<Ban size={16} />} label="Anti-Scam" active={pathname.endsWith('/anti-scam')} />
              <SidebarItem href={`${serverBaseUrl}/leveling`} icon={<Zap size={16} />} label="Leveling" active={pathname.endsWith('/leveling')} />
              <SidebarItem href={`${serverBaseUrl}/music`} icon={<Music size={16} />} label="Music" active={pathname.endsWith('/music')} />
              <SidebarItem href={`${serverBaseUrl}/tickets`} icon={<Ticket size={16} />} label="Tickets" active={pathname.endsWith('/tickets')} />
              <SidebarItem href={`${serverBaseUrl}/verification`} icon={<ShieldCheck size={16} />} label="Verification" active={pathname.endsWith('/verification')} />
              <SidebarItem href={`${serverBaseUrl}/welcome`} icon={<UserPlus size={16} />} label="Welcome/Leave" active={pathname.endsWith('/welcome')} />
              <SidebarItem href={`${serverBaseUrl}/giveaways`} icon={<Gift size={16} />} label="Giveaways" active={pathname.endsWith('/giveaways')} />
              <SidebarItem href={`${serverBaseUrl}/polls`} icon={<BarChart3 size={16} />} label="Polls" active={pathname.endsWith('/polls')} />
              <SidebarItem href={`${serverBaseUrl}/advanced-mod`} icon={<Shield size={16} />} label="Advanced Mod" active={pathname.endsWith('/advanced-mod')} badge="NEW" />
            </>
          ) : (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-1" style={{ color: "#A8A9A2" }}>Overview</p>
              <SidebarItem href="/dashboard" icon={<LayoutDashboard size={16} />} label="My Servers" active={pathname === '/dashboard'} />
              <SidebarItem href="/dashboard/invites" icon={<Mail size={16} />} label="Invitations" active={pathname === '/dashboard/invites'} />

              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-6" style={{ color: "#A8A9A2" }}>Account</p>
              <SidebarItem href="/dashboard/billing" icon={<CreditCard size={16} />} label="Billing" active={pathname === '/dashboard/billing'} />
              <SidebarItem href="/dashboard/settings" icon={<Settings size={16} />} label="Settings" active={pathname === '/dashboard/settings'} />
            </>
          )}
        </nav>

        {/* User at bottom */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#1FA7BB", color: "#101012" }}>
                {session?.user?.name?.[0] || "U"}
              </div>
            )}
            <span className="text-sm font-medium truncate flex-1" style={{ color: "#F5F4F5" }}>
              {status === "loading" ? "..." : (session?.user?.name || "User")}
            </span>
            <button
              onClick={() => signOut({ redirectTo: "/" })}
              className="transition-colors"
              style={{ color: "#A8A9A2" }}
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto w-full" style={{ background: "#101012" }}>
        {/* Header */}
        <header
          className="h-14 flex items-center justify-between px-6 sticky top-0 z-30"
          style={{ background: "rgba(18,19,21,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            aria-label="Toggle sidebar"
            style={{ color: "#A8A9A2" }}
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="text-sm font-semibold" style={{ color: "#F5F4F5" }}>
            {isServerRoute ? 'Server Dashboard' : 'Dashboard'}
          </span>

          {/* User dropdown (desktop) */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#1FA7BB", color: "#101012" }}>
                  {session?.user?.name?.[0] || "U"}
                </div>
              )}
              <span className="text-sm font-medium" style={{ color: "#F5F4F5" }}>
                {status === "loading" ? "..." : (session?.user?.name || "User")}
              </span>
              <ChevronDown size={12} style={{ color: "#A8A9A2" }} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-2xl py-2 z-50"
                style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="px-4 py-2 mb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#A8A9A2" }}>Signed in as</p>
                  <p className="text-sm font-semibold truncate" style={{ color: "#F5F4F5" }}>{session?.user?.name}</p>
                </div>
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors text-left"
                  style={{ color: "#ef4444" }}
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
    </ToastProvider>
  );
}

function SidebarItem({ href, icon, label, active = false, badge }: { href: string; icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150"
      style={active
        ? { background: "#121315", color: "#1FA7BB", borderLeft: "2px solid #1FA7BB" }
        : { color: "#A8A9A2", borderLeft: "2px solid transparent" }
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider" style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}>
          {badge}
        </span>
      )}
    </Link>
  );
}
