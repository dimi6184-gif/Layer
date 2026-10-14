import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#080808" }}
      suppressHydrationWarning
    >
      {/* Background: two soft glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: "absolute", top: "35%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(31,167,187,0.07) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "20%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(31,167,187,0.04) 0%, transparent 70%)",
        }} />
      </div>

      {/* Grid texture — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12 group">
          <div className="opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <Image src="/logo.png" alt="Layer" width={22} height={22} className="object-contain" />
            <span className="text-sm font-semibold text-white">Layer</span>
          </div>
        </Link>

        {/* Big 404 with teal border-bottom effect */}
        <div className="relative mb-6">
          <p
            className="font-bold leading-none select-none"
            style={{
              fontSize: "clamp(96px, 18vw, 160px)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-4px",
            }}
          >
            404
          </p>
          {/* Teal underline glow */}
          <div style={{
            position: "absolute", bottom: -4, left: "50%",
            transform: "translateX(-50%)",
            width: "60%", height: 2,
            background: "linear-gradient(90deg, transparent, #1FA7BB, transparent)",
            opacity: 0.6,
          }} />
        </div>

        {/* Text */}
        <h1 className="text-lg font-semibold mb-2" style={{ color: "#F5F4F5" }}>
          Page not found
        </h1>
        <p className="text-sm mb-10 max-w-xs leading-6" style={{ color: "rgba(255,255,255,0.38)" }}>
          This page doesn't exist or has been moved.<br />
          Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#1FA7BB", color: "#101012" }}
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:text-white active:scale-95"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Dashboard
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-12 mb-4">
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>or explore</span>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-6">
          {[
            { label: "Commands", href: "/commands" },
            { label: "Security", href: "/security" },
            { label: "Pricing", href: "/premium" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>

      {/* Bottom copyright */}
      <p
        className="absolute bottom-6 text-xs"
        style={{ color: "rgba(255,255,255,0.12)" }}
      >
        © {new Date().getFullYear()} Layer
      </p>
    </div>
  );
}
