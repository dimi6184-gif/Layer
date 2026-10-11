import Link from "next/link";
import { auth } from "@/auth";
import Image from "next/image";

export async function Navbar() {
  const session = await auth();

  return (
    <div className="fixed top-0 left-0 right-0 w-full px-6 pt-6 z-50 pointer-events-none">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-sm pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-0.5 group">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Layer Logo" 
                width={48} 
                height={48}
                style={{ width: 'auto', height: 'auto' }}
                className="max-w-[48px] max-h-[48px] object-contain transition-transform group-hover:scale-110 duration-300"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">ayer</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="/commands" className="hover:text-blue-600 transition-colors">Commands</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link href="/premium" className="hover:text-blue-600 transition-colors">Premium</Link>
        </div>
        <div className="flex items-center gap-4">
          {!session?.user && (
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Log in
            </Link>
          )}
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-sm">
            Dashboard
          </Link>
        </div>
      </nav>
    </div>
  );
}
