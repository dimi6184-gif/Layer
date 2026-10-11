'use client';

import { Zap, Shield, Heart, Bot, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Hero Section - Kompakt */}
      <section className="py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Our Story</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Built by Discord users,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-gradient">
              for Discord users
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
            We got tired of bad bots. So we built a better one.
          </p>

        </div>
      </section>

      {/* Story Timeline - Kompakt */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Story 1 */}
          <div className="flex gap-6 items-start animate-fade-in">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                1
              </div>
            </div>
            <div className="flex-1 pt-2">
              <h3 className="text-xl font-bold mb-2">The Problem</h3>
              <p className="text-gray-600">
                Scammers everywhere. Existing bots couldn't keep up.
              </p>
            </div>
          </div>

          {/* Story 2 */}
          <div className="flex gap-6 items-start animate-fade-in-delay">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                2
              </div>
            </div>
            <div className="flex-1 pt-2">
              <h3 className="text-xl font-bold mb-2">The Idea</h3>
              <p className="text-gray-600">
                Use real AI. Make it dead simple.
              </p>
            </div>
          </div>

          {/* Story 3 */}
          <div className="flex gap-6 items-start animate-fade-in-delay-2">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                3
              </div>
            </div>
            <div className="flex-1 pt-2">
              <h3 className="text-xl font-bold mb-2">The Build</h3>
              <p className="text-gray-600">
                Late nights, lots of coffee. Layer was born.
              </p>
            </div>
          </div>

          {/* Story 4 */}
          <div className="flex gap-6 items-start animate-fade-in-delay-2">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                4
              </div>
            </div>
            <div className="flex-1 pt-2">
              <h3 className="text-xl font-bold mb-2">Today</h3>
              <p className="text-gray-600">
                10,000+ servers. Thousands of scams blocked daily.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Stats - Kompakt */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">We're just getting started</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 card-glow group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-sm text-gray-600 font-medium">Servers</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 card-glow group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                100K+
              </div>
              <div className="text-sm text-gray-600 font-medium">Scams Blocked</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 card-glow group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-sm text-gray-600 font-medium">Protection</div>
            </div>

          </div>
        </div>
      </section>

      {/* Values - Kompakt */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What we believe</h2>
            <p className="text-gray-600">Three simple principles</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Value 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 card-glow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Shield className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">Security First</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Your community's safety is priority #1.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 card-glow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Zap className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">Keep It Simple</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Powerful features, 5-minute setup.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 card-glow group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Heart className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">Always Free</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Core features stay free. Forever.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Quote - Kompakt */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-4">
            We're not building a bot.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              We're protecting communities.
            </span>
          </p>
          <p className="text-sm text-gray-600">— The Layer Team</p>
        </div>
      </section>

      {/* CTA - Kompakt */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            Join us
          </h2>

          <p className="text-lg text-gray-600 mb-8 animate-fade-in-delay">
            Be part of the safest Discord communities.
          </p>

          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25 animate-bounce-in"
          >
            <Bot className="w-5 h-5" />
            Add to Discord
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-sm text-gray-500 mt-6 animate-fade-in-delay-2">
            Free forever • 5-minute setup
          </p>

        </div>
      </section>

    </div>
  );
}
