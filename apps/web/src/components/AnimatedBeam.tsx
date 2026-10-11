"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

/**
 * ANIMATED BEAM — Layer Bot Edition
 * Shows Layer bot in center with feature icons flowing in/out
 */

interface NodeItem {
  icon?: React.ReactNode;
  label?: string;
}

interface Props {
  // Layout
  padding?: number;
  gap?: number;
  nodeSize?: number;
  centerSize?: number;
  // Nodes
  centerIcon?: React.ReactNode;
  leftNodes?: NodeItem[];
  rightNodes?: NodeItem[];
  // Node styling
  nodeBackground?: string;
  nodeBorderColor?: string;
  nodeBorderWidth?: number;
  nodeRadius?: number;
  // Beam styling
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  curvature?: number;
  endYOffset?: number;
  // Animation
  duration?: number;
  delay?: number;
  stagger?: number;
  speedVariation?: number;
  reverseFlow?: boolean;
  style?: CSSProperties;
}

interface Beam {
  d: string;
  reverse: boolean;
  delay: number;
  duration: number;
}

export default function AnimatedBeam(props: Props) {
  const {
    padding = 40,
    gap = 32,
    nodeSize = 64,
    centerSize = 96,
    centerIcon,
    leftNodes = [],
    rightNodes = [],
    nodeBackground = "#ffffff",
    nodeBorderColor = "#e5e7eb",
    nodeBorderWidth = 2,
    nodeRadius = 24,
    pathColor = "#9ca3af",
    pathWidth = 2,
    pathOpacity = 0.2,
    gradientStartColor = "#3b82f6",
    gradientStopColor = "#8b5cf6",
    curvature = 75,
    endYOffset = 10,
    duration = 6,
    delay = 0,
    stagger = 0.3,
    speedVariation = 0.4,
    reverseFlow = false,
    style,
  } = props;

  const uid = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [svg, setSvg] = useState({ width: 0, height: 0 });
  const [beams, setBeams] = useState<Beam[]>([]);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const center = centerRef.current;
      if (!container || !center) return;

      const cRect = container.getBoundingClientRect();
      setSvg({ width: cRect.width, height: cRect.height });
      const half = cRect.height / 2 || 1;

      const centerRect = center.getBoundingClientRect();
      const cx = centerRect.left - cRect.left + centerRect.width / 2;
      const cy = centerRect.top - cRect.top + centerRect.height / 2;

      const next: Beam[] = [];

      const build = (
        el: HTMLDivElement | null,
        isRight: boolean,
        index: number
      ) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const sx = r.left - cRect.left + r.width / 2;
        const sy = r.top - cRect.top + r.height / 2;

        const dy = sy - cy;
        const sign = dy === 0 ? 0 : dy < 0 ? -1 : 1;

        const curveApplied = curvature * (dy / half);
        const controlY = sy - curveApplied;
        const midX = (sx + cx) / 2;
        const endY = cy + sign * endYOffset;

        const d = `M ${sx},${sy} Q ${midX},${controlY} ${cx},${endY}`;

        const baseReverse = isRight;
        next.push({
          d,
          reverse: reverseFlow ? !baseReverse : baseReverse,
          delay: delay + index * stagger,
          duration:
            speedVariation > 0
              ? duration + ((index * 1.3) % (speedVariation * 2))
              : duration,
        });
      };

      leftRefs.current.forEach((el, i) => build(el, false, i));
      rightRefs.current.forEach((el, i) =>
        build(el, true, leftRefs.current.length + i)
      );

      setBeams(next);
    };

    measure();
    const raf = requestAnimationFrame(measure);

    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [
    leftNodes.length,
    rightNodes.length,
    nodeSize,
    centerSize,
    padding,
    gap,
    curvature,
    endYOffset,
    delay,
    stagger,
    duration,
    speedVariation,
    reverseFlow,
  ]);

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "visible",
    padding,
    boxSizing: "border-box",
    ...style,
  };

  const columnStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    gap,
    height: "100%",
    zIndex: 1,
  };

  const nodeStyle = (size: number): CSSProperties => ({
    width: size,
    height: size,
    flex: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: nodeRadius,
    background: nodeBackground,
    border: `${nodeBorderWidth}px solid ${nodeBorderColor}`,
    boxShadow: "0 4px 24px -8px rgba(0,0,0,0.15)",
    overflow: "hidden",
    boxSizing: "border-box",
  });

  const gradientCoords = (reverse: boolean) =>
    reverse
      ? {
          x1: ["90%", "-10%"],
          x2: ["100%", "0%"],
          y1: ["0%", "0%"],
          y2: ["0%", "0%"],
        }
      : {
          x1: ["10%", "110%"],
          x2: ["0%", "100%"],
          y1: ["0%", "0%"],
          y2: ["0%", "0%"],
        };

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Left column */}
      <div style={columnStyle}>
        {leftNodes.map((item, i) => (
          <motion.div
            key={`left-${i}`}
            ref={(el) => (leftRefs.current[i] = el)}
            style={nodeStyle(nodeSize)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.1, y: -4 }}
          >
            <div className="text-2xl">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Center node */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          ref={centerRef}
          style={{
            ...nodeStyle(centerSize),
            background: `linear-gradient(135deg, ${gradientStartColor}, ${gradientStopColor})`,
            borderColor: "transparent",
            boxShadow: "0 8px 32px -8px rgba(59,130,246,0.4)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
        >
          <div className="text-4xl text-white">{centerIcon}</div>
        </motion.div>
      </div>

      {/* Right column */}
      <div style={columnStyle}>
        {rightNodes.map((item, i) => (
          <motion.div
            key={`right-${i}`}
            ref={(el) => (rightRefs.current[i] = el)}
            style={nodeStyle(nodeSize)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (i + leftNodes.length) * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.1, y: -4 }}
          >
            <div className="text-2xl">{item.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Beams */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: svg.width,
          height: svg.height,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {beams.map((beam, i) => {
          const gradId = `beam-${uid}-${i}`;
          const coords = gradientCoords(beam.reverse);
          return (
            <g key={i}>
              {/* Static track */}
              <path
                d={beam.d}
                fill="none"
                stroke={pathColor}
                strokeWidth={pathWidth}
                strokeOpacity={pathOpacity}
                strokeLinecap="round"
              />
              {/* Animated gradient beam */}
              <motion.path
                d={beam.d}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={pathWidth}
                strokeOpacity={0.8}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{
                  duration: beam.duration,
                  delay: beam.delay,
                  ease: [0.16, 1, 0.3, 1],
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
              />
              <defs>
                <motion.linearGradient id={gradId} animate={coords}>
                  <stop offset="0%" stopColor={gradientStartColor} stopOpacity={0} />
                  <stop offset="10%" stopColor={gradientStartColor} stopOpacity={0.5} />
                  <stop offset="50%" stopColor={gradientStopColor} stopOpacity={1} />
                  <stop offset="90%" stopColor={gradientStopColor} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={gradientStopColor} stopOpacity={0} />
                </motion.linearGradient>
              </defs>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
