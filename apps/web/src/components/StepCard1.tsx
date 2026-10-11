"use client";

import { motion } from "framer-motion";
import { Bot, Plus, Check } from "lucide-react";
import { useState } from "react";

/**
 * STEP CARD 1 - Add to Server Animation
 * Complete inline styles - no external CSS needed
 */

export default function StepCard1() {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "280px",
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
      borderRadius: "24px",
      padding: "24px",
      overflow: "hidden",
      border: "1px solid #dbeafe",
    }}>
      
      {/* Background decoration */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "128px",
          height: "128px",
          background: "rgba(191, 219, 254, 0.3)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Discord Server Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #374151 0%, #111827 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "white",
        }}>S</div>
      </motion.div>

      {/* Bot Flying In */}
      <motion.div
        initial={{ x: 200, y: -50, scale: 0, rotate: 180 }}
        animate={{ 
          x: 0, 
          y: 0, 
          scale: 1, 
          rotate: 0 
        }}
        transition={{ 
          duration: 0.8, 
          delay: 0.3,
          type: "spring",
          bounce: 0.5
        }}
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
        }}
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px -12px rgba(59,130,246,0.4)",
          }}
        >
          <Bot style={{ width: "32px", height: "32px", color: "white" }} />
        </motion.div>
      </motion.div>

      {/* Connection Line */}
      <svg 
        style={{
          position: "absolute",
          top: "56px",
          left: "80px",
          width: "calc(100% - 160px)",
          height: "32px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <motion.line
          x1="0"
          y1="16"
          x2="100%"
          y2="16"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeDasharray="8 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </svg>

      {/* Add Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={() => setIsAdded(!isAdded)}
        style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          border: "none",
          cursor: "pointer",
          background: "transparent",
          padding: 0,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
            transition: "all 0.3s",
            background: isAdded ? "#22c55e" : "#2563eb",
            color: "white",
          }}
        >
          <motion.div
            animate={!isAdded ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            style={{ display: "flex", alignItems: "center" }}
          >
            {isAdded ? (
              <Check style={{ width: "16px", height: "16px" }} />
            ) : (
              <Plus style={{ width: "16px", height: "16px" }} />
            )}
          </motion.div>
          <span>{isAdded ? 'Added!' : 'Add Bot'}</span>
        </motion.div>
      </motion.button>

      {/* Success Checkmark */}
      {isAdded && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", bounce: 0.6 }}
          style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px -5px rgba(34,197,94,0.4)",
          }}
        >
          <Check style={{ width: "24px", height: "24px", color: "white" }} />
        </motion.div>
      )}

      {/* Floating particles */}
      {isAdded && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 1 
              }}
              animate={{
                x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                y: Math.sin((i * 60 * Math.PI) / 180) * 80,
                scale: [0, 1, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#60a5fa",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </>
      )}

    </div>
  );
}
