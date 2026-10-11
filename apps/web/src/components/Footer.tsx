import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-16 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-0.5">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Layer Logo" 
                width={40} 
                height={40}
                style={{ width: 'auto', height: 'auto' }}
                className="max-w-[40px] max-h-[40px] object-contain"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">ayer</span>
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">
            The modern Discord bot for community management.
          </p>
        </div>

        {/* Product */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="text-gray-900 font-semibold mb-2">Product</h4>
          <Link href="/commands" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Commands</Link>
          <Link href="/premium" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Premium</Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
        </div>

        {/* Resources */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="text-gray-900 font-semibold mb-2">Resources</h4>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Support Server</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Status</a>
        </div>

        {/* Legal */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="text-gray-900 font-semibold mb-2">Legal</h4>
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Layer. All rights reserved.</p>
      </div>
    </footer>
  );
}
