"use client";

import { Shield, Music, Trophy, Sparkles, Zap, Bot } from "lucide-react";
import AnimatedBeam from "./AnimatedBeam";
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  // Feature nodes (left side = inputs, right side = outputs)
  const leftNodes = [
    { icon: <Shield className="w-6 h-6 text-blue-600" />, label: "Security" },
    { icon: <Sparkles className="w-6 h-6 text-purple-600" />, label: "AI" },
    { icon: <Music className="w-6 h-6 text-pink-600" />, label: "Music" },
  ];

  const rightNodes = [
    { icon: <Trophy className="w-6 h-6 text-yellow-600" />, label: "Leveling" },
    { icon: <Zap className="w-6 h-6 text-orange-600" />, label: "Fast" },
    { icon: <Shield className="w-6 h-6 text-green-600" />, label: "Verified" },
  ];

  const centerIcon = <Bot className="w-12 h-12" />;

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From chaos to control,
            <br />
            <span className="text-gray-400">in 3 simple steps</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Layer connects your server features through AI-powered automation. One bot, endless possibilities.
          </p>
        </motion.div>

        {/* Animated Beam Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] mb-20 rounded-3xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-gray-200/50 backdrop-blur-sm overflow-visible"
        >
          <AnimatedBeam
            leftNodes={leftNodes}
            rightNodes={rightNodes}
            centerIcon={centerIcon}
            nodeSize={72}
            centerSize={120}
            padding={60}
            gap={40}
            nodeBackground="rgba(255, 255, 255, 0.95)"
            nodeBorderColor="#e5e7eb"
            nodeBorderWidth={2}
            nodeRadius={24}
            pathColor="#9ca3af"
            pathWidth={3}
            pathOpacity={0.15}
            gradientStartColor="#3b82f6"
            gradientStopColor="#8b5cf6"
            curvature={80}
            endYOffset={12}
            duration={5}
            stagger={0.25}
            speedVariation={0.3}
          />
        </motion.div>

        {/* 3 Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            <div className="relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Add to server</h3>
              <p className="text-gray-600 leading-relaxed">
                Invite Layer bot to your Discord server. One click, zero configuration required.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            <div className="relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Configure features</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our dashboard to enable features. AI learns your server structure automatically.
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            <div className="relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-green-200 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Watch it work</h3>
              <p className="text-gray-600 leading-relaxed">
                Layer handles moderation, music, leveling, and more. Sit back and enjoy your community.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
