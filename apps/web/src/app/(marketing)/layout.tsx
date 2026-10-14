"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft, CreditCard, FileText, ShieldCheck, RotateCcw,
  Terminal, Shield, Menu, X
} from "lucide-react";

const navSections = [
  {
    title: "Pricing",
    items: [
      { href: "/premium", label: "Plans & Pricing", icon: CreditCard, badge: "PRO" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/terms", label: "Terms of Service", icon: FileText },
      { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
      { href: "/refunds", label: "Refund Policy", icon: RotateCcw },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/commands", label: "Bot Commands", icon: Terminal },
      { href: "/security", label: "Security", icon: Shield },
    ],
  },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#080808", color: "#F5F4F5" }}>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar — slim like Honeypot */}
      <aside
        className={`fixed md:sticky top-0 h-screen flex flex-col z-40 transition-transform duration-200 flex-shrink-0
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{
          width: 220,
          background: "#080808",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo + back */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/" className="flex items-center gap-2 mb-5 group">
            <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain opacity-90" />
            <span className="font-semibold text-sm tracking-tight text-white">Layer</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
            style={{ color: "#A8A9A2" }}
          >
            <ArrowLeft size={12} />
            Back to Homepage
          </Link>
        </div>

        {/* Nav — exactly like Honeypot */}
        <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {navSections.map(section => (
            <div key={section.title}>
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#F5F4F5", letterSpacing: "0.01em" }}
              >
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-1 text-sm transition-colors duration-150 ${
                        isActive
                          ? "text-white font-medium"
                          : "text-white/40 hover:text-white font-normal"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(31,167,187,0.15)", color: "#1FA7BB" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — minimal */}
        <div className="px-5 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Link
            href="/dashboard"
            className="block w-full text-center py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#F5F4F5",
            }}
          >
            Open Dashboard →
          </Link>
          <p className="text-center mt-3 text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Layer
          </p>
        </div>
      </aside>

      {/* Main content — centered with max-width */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center justify-between px-5 py-3 sticky top-0 z-20"
          style={{ background: "rgba(8,8,8,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Layer" width={20} height={20} className="object-contain" />
            <span className="font-semibold text-sm text-white">Layer</span>
          </Link>
          <button onClick={() => setOpen(!open)} style={{ color: "#A8A9A2" }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Desktop breadcrumb — minimal, right-aligned like Honeypot */}
        <div
          className="hidden md:flex items-center justify-between px-16 py-3 sticky top-0 z-20"
          style={{ background: "rgba(8,8,8,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <Link href="/" className="hover:text-white transition-colors">Layer</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }} className="capitalize">
              {pathname.replace("/", "") || "docs"}
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <ArrowLeft size={12} /> Back to Home
          </Link>
        </div>

        {/* Page content — wide center column like Honeypot */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-8 py-14">
          {children}
        </main>
      </div>
    </div>
  );
}
