"use client";

import { Shield, Lock, ShieldCheck, Database, AlertTriangle, ArrowRight, Check, X, Key } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Alert Badge */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 rounded-full text-sm text-orange-600 mb-8 shadow-lg shadow-orange-500/10"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Double Counter breach: 28M users exposed</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent leading-tight">
              Privacy‑First<br/>Verification
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Layer's verification happens entirely within Discord.<br/>
              <span className="font-semibold text-gray-900">No external websites. No IP logging. No data collection.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Data Comparison Cards */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Data Transparency</h2>
            <p className="text-xl text-gray-600">Most bots collect way more than they need.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* What We Collect */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-green-200/50 shadow-xl shadow-green-500/5 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Database className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900">What We Collect</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                {[
                  { title: "Discord User ID", desc: "Required by Discord's API" },
                  { title: "Guild Membership", desc: "Needed for role management" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                <p className="text-sm text-gray-800">
                  <strong className="text-green-900">That's it.</strong> Just 2 data points — and you never leave Discord.
                </p>
              </div>
            </motion.div>

            {/* What We DON'T Collect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-red-200/50 shadow-xl shadow-red-500/5 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Lock className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900">What We NEVER Collect</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Email Addresses", desc: "Never requested, never stored" },
                  { title: "IP Addresses", desc: "No logging, no tracking" },
                  { title: "Browser Fingerprints", desc: "No device tracking" },
                  { title: "Location Data", desc: "No GPS or geolocation" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-red-50/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600 stroke-[3]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Why Layer is Different</h2>
            <p className="text-xl text-gray-600">Security through simplicity</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                color: "blue",
                title: "No External Websites",
                desc: "Verification stays entirely within Discord. Users never visit our website, so we can't collect IPs or track location — even if we wanted to."
              },
              {
                icon: ShieldCheck,
                color: "purple",
                title: "GDPR Compliant",
                desc: "Full EU compliance with data protection. Right to deletion, minimal collection, and complete transparency about what we store."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${item.color}-500/30`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Comparison - Dynamic Layout */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple verification. Zero unnecessary data.</p>
          </motion.div>

          <div className="space-y-8">
            {/* Double Counter Problem - Left aligned, larger */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="max-w-3xl">
                <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 backdrop-blur-xl rounded-3xl p-10 border-2 border-red-200/50 shadow-2xl shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <X className="w-7 h-7 text-white stroke-[3]" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-900 mb-2">How Double Counter Worked</h3>
                      <p className="text-red-700 font-medium">The Problem</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      'User clicks "Verify" in Discord',
                      { text: 'Bot redirects to doublecounter.gg/verify', bold: true, sub: '(external website)' },
                      { text: 'User logs in with Discord OAuth', bold: true, sub: 'on their website' },
                      { text: 'Website logs: IP address, email, browser fingerprint, location', bold: true },
                      'All data stored in their database',
                      '❌ Hacker breaches database → 28M users exposed'
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 items-start group hover:translate-x-1 transition-transform"
                      >
                        <span className="flex-shrink-0 w-7 h-7 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 text-sm group-hover:bg-red-200 transition-colors">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          {typeof item === 'string' ? (
                            <p className="text-gray-800 leading-relaxed">{item}</p>
                          ) : (
                            <p className="text-gray-800 leading-relaxed">
                              <strong>{item.text}</strong> {item.sub && <span className="text-gray-700">{item.sub}</span>}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -right-12 top-1/4 w-32 h-32 bg-red-200/30 rounded-full blur-3xl"
              />
            </motion.div>

            {/* Layer Solution - Right aligned, elevated */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-end"
            >
              <div className="max-w-3xl">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 backdrop-blur-xl rounded-3xl p-10 border-2 border-green-200/50 shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-7 h-7 text-white stroke-[3]" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-900 mb-2">How Layer Works</h3>
                      <p className="text-green-700 font-medium">No External Website</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { text: 'User clicks "Verify" button', bold: true, sub: 'in Discord' },
                      { text: 'Discord OAuth popup', bold: true, sub: '(stays in Discord app)' },
                      'Discord API returns: User ID only',
                      { text: 'User never visits our website → No IP, email, or fingerprint logged', bold: true },
                      'Role assigned via Discord API',
                      '✅ Minimal data, maximum security'
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 + 0.2 }}
                        className="flex gap-4 items-start group hover:-translate-x-1 transition-transform"
                      >
                        <span className="flex-shrink-0 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600 text-sm group-hover:bg-green-200 transition-colors">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          {typeof item === 'string' ? (
                            <p className="text-gray-800 leading-relaxed">{item}</p>
                          ) : (
                            <p className="text-gray-800 leading-relaxed">
                              <strong>{item.text}</strong> {item.sub && <span className="text-gray-700">{item.sub}</span>}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -left-12 top-1/3 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
              />
            </motion.div>

            {/* Key Difference Callout - Centered, prominent */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mt-12"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative max-w-2xl w-full overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-blue-200/50 shadow-2xl shadow-blue-500/20"
              >
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-60" />
                
                <div className="relative flex items-center gap-6">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40"
                  >
                    <Key className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      The Key Difference: No External Website
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      When you never leave Discord, we can't collect your IP or location — even if we wanted to.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to protect your server?</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Join thousands of servers using Layer's privacy-first approach.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/invite"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
              >
                Add Layer to Discord
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
