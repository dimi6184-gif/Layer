"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Only log in development — never expose internals in production
    if (process.env.NODE_ENV === "development") {
      console.error("[Dashboard Error]", error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#101012" }}
    >
      <div className="text-center max-w-sm">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(239,68,68,0.1)" }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: "#EF4444" }} />
        </div>

        <h1 className="text-lg font-semibold mb-2" style={{ color: "#F5F4F5" }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-1" style={{ color: "#A8A9A2" }}>
          An error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="text-xs mb-6 font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background: "#1FA7BB", color: "#101012" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:text-white"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <Home className="w-3.5 h-3.5" />
            My Servers
          </Link>
        </div>
      </div>
    </div>
  );
}
