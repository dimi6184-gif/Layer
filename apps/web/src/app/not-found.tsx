import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 relative">
            <Image src="/logo.png" alt="Layer Logo" width={80} height={80} style={{ width: 'auto', height: 'auto' }} className="max-w-[80px] max-h-[80px] object-contain opacity-50" />
          </div>
        </div>

        {/* 404 with gradient */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 animate-gradient">
              404
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lost in the layers
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-md mx-auto leading-relaxed">
            This page doesn't exist or has been moved to another layer.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 comic-button bg-yellow-400 text-black rounded-xl font-black text-lg transition-all hover:translate-y-\[-2px\] hover:shadow-\[8px_8px_0px_#000\] hover:shadow-2xl hover:shadow-yellow-500/50"
          >
            <Home className="w-5 h-5" />
            Go Back Home
          </Link>
          <Link
            href="/dashboard"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-yellow-400 border-3 border-black "
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
        </div>

        {/* Helpful links */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-zinc-500 mb-4">Looking for something?</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/commands" className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
              <Search className="w-4 h-4" />
              Commands
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/about" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              About
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/#features" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Features
            </Link>
            <span className="text-zinc-700">•</span>
            <Link href="/premium" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
