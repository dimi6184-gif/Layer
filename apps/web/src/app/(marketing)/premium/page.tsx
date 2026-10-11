'use client';

import { Crown, Check, Sparkles, Zap, Shield, Bot, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Hero */}
      <section className="py-40 px-6 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 animate-fade-in">
            <Crown className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Layer Premium</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Unlock the full
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-gradient">
              power of Layer
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            Get advanced features, priority support, and exclusive tools for serious communities.
          </p>

        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Plan */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-600">Perfect for small communities</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Basic moderation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Music player</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Leveling system</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Web dashboard</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">AI features</span>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">Priority support</span>
                </div>
              </div>

              <Link 
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan - Featured */}
            <div className="p-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 relative card-glow border-2 border-blue-400 animate-fade-in-delay">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 bg-yellow-400 rounded-full text-xs font-bold text-gray-900 animate-pulse">
                  RECOMMENDED
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-white">$5</span>
                  <span className="text-blue-100">/month</span>
                </div>
                <p className="text-sm text-blue-100">For serious communities</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-white font-medium">Everything in Free</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-white">AI moderation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-white">AI tickets</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-white">Custom branding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-white">Priority support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-white">Advanced analytics</span>
                </div>
              </div>

              <Link 
                href="/dashboard"
                className="block w-full text-center px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Upgrade to Pro
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Compare plans</h2>
            <p className="text-gray-600">See what's included</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Feature</th>
                    <th className="text-center p-4 font-semibold text-sm">Free</th>
                    <th className="text-center p-4 font-semibold text-sm bg-blue-50">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-4 text-sm">Basic Commands</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4 bg-blue-50/50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-sm">Music Player</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4 bg-blue-50/50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-sm">Leveling System</td>
                    <td className="text-center p-4"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4 bg-blue-50/50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-sm">AI Moderation</td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="text-center p-4 bg-blue-50/50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-sm">Custom Branding</td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="text-center p-4 bg-blue-50/50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-sm">Priority Support</td>
                    <td className="text-center p-4"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="text-center p-4 bg-blue-50/50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            Start free,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              upgrade anytime
            </span>
          </h2>

          <p className="text-lg text-gray-600 mb-8 animate-fade-in-delay">
            Try Layer for free. Upgrade when you're ready for more.
          </p>

          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25 animate-bounce-in"
          >
            <Bot className="w-5 h-5" />
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-sm text-gray-500 mt-6 animate-fade-in-delay-2">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

    </div>
  );
}
