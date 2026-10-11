"use client";

import { motion } from "framer-motion";
import { Shield, Music, Trophy, Sparkles, Settings } from "lucide-react";

/**
 * STEP CARD 2 - Configure Features Animation
 * Shows feature icons connecting to center dashboard
 */

export default function StepCard2() {
  const features = [
    { icon: Shield, color: "from-blue-500 to-blue-600", delay: 0.2 },
    { icon: Music, color: "from-purple-500 to-purple-600", delay: 0.4 },
    { icon: Trophy, color: "from-pink-500 to-pink-600", delay: 0.6 },
    { icon: Sparkles, color: "from-yellow-500 to-yellow-600", delay: 0.8 },
  ];

  return (
    <div className="relative w-full h-[280px] bg-gradient-to-br from-purple-50 to-white rounded-3xl p-6 overflow-hidden border border-purple-100">
      
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center Dashboard Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl"
        >
          <Settings className="w-10 h-10 text-white" />
        </motion.div>
      </motion.div>

      {/* Feature Icons Flying In and Orbiting */}
      {features.map((feature, i) => {
        const Icon = feature.icon;
        const angle = (i * 360) / features.length;
        const radius = 80;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            initial={{ 
              x: 0, 
              y: 0,
              scale: 0,
              opacity: 0,
            }}
            animate={{ 
              x,
              y,
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: feature.delay,
              type: "spring",
              bounce: 0.4,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>

            {/* Connection line */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: Math.abs(x) * 2 + 24,
                height: Math.abs(y) * 2 + 24,
                zIndex: -1,
              }}
            >
              <motion.line
                x1={x > 0 ? 24 : Math.abs(x) * 2}
                y1={y > 0 ? 24 : Math.abs(y) * 2}
                x2={x > 0 ? Math.abs(x) * 2 : 24}
                y2={y > 0 ? Math.abs(y) * 2 : 24}
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 0.8, delay: feature.delay + 0.3 }}
              />
            </svg>
          </motion.div>
        );
      })}

    </div>
  );
}
