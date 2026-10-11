import Link from "next/link";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(31,167,187,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Logo — top left */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2.5 z-20 group">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="/logo.png" alt="Layer" className="w-full h-full object-contain" />
        </div>
        <span className="text-base font-semibold tracking-tight" style={{ color: "#F5F4F5" }}>Layer</span>
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-sm relative z-10 rounded-2xl p-8 space-y-6"
        style={{ background: "#121315", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#F5F4F5" }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#A8A9A2" }}>
            Sign in to continue to Layer
          </p>
        </div>

        {/* Discord Button */}
        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#5865F2", color: "#FFFFFF" }}
          >
            {/* Discord SVG icon */}
            <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Continue with Discord
          </button>
        </form>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "#A8A9A2" }}>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No email required
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Zero data stored
          </span>
        </div>

        {/* Legal */}
        <p className="text-center text-xs leading-relaxed" style={{ color: "#A8A9A2" }}>
          By continuing, you agree to our{" "}
          <Link href="/terms" className="hover:opacity-80 transition-opacity" style={{ color: "#F5F4F5" }}>
            Terms
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="hover:opacity-80 transition-opacity" style={{ color: "#F5F4F5" }}>
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-6 text-xs" style={{ color: "#A8A9A2" }}>
        © 2026 Layer
      </div>
    </div>
  );
}
