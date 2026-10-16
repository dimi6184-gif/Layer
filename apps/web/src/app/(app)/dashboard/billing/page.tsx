import { CreditCard, Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function BillingPage() {
  return (
    <div className="w-full animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Billing & Premium</h1>
        <p className="text-gray-400 font-light">Manage your Layer Premium subscription and invoices.</p>
      </div>

      <div className="flex flex-col items-center justify-center p-16 text-center border-3 border-black rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-yellow-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 relative z-10">
          <Sparkles className="text-yellow-400 w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 relative z-10">Premium Features Coming Soon</h3>
        <p className="text-zinc-400 max-w-md mb-8 relative z-10">
          We're currently finalizing our integration with Stripe. Soon you'll be able to upgrade your servers to Layer Premium for advanced AI limits, higher audio quality, and custom branding.
        </p>

        <button className="bg-white/10 hover:bg-yellow-400/20 border-3 border-black text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors relative z-10 cursor-not-allowed opacity-50">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}
