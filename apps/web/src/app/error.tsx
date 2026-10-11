"use client";

import { useEffect } from "react";
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 relative overflow-hidden">
      {/* Subtle animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/[0.04] rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-300/[0.02] rounded-full blur-3xl animate-float-fast"></div>
      </div>

      <div className="max-w-lg w-full relative z-10 text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/logo.png" alt="Layer" className="w-16 h-16 rounded-2xl" />
        </div>

        {/* Error Icon - minimalist */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-600">
            Don't worry, <span className="text-blue-600 font-medium">this isn't your fault</span>. We're working on it.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Go home
          </button>
        </div>

        {/* Error ID Box - clean and subtle */}
        {error.digest && (
          <div className="pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <span className="text-xs text-gray-500">Error ID:</span>
              <span className="text-xs text-gray-700 font-mono">{error.digest}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
