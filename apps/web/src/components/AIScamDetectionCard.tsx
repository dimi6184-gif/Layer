"use client"

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    startTransition,
    type CSSProperties,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

// Stub for Framer-specific hook — always false in Next.js context
const useIsStaticRenderer = () => false

/**
 * AI SCAM DETECTION CARD
 * Shows image scanning with OCR + pattern matching animation
 * Apple-style clean design with smooth transitions
 * 
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 320
 */

interface AIScamDetectionCardProps {
    bgColor: string
    cardColor: string
    borderColor: string
    primaryColor: string
    dangerColor: string
    textColor: string
    autoplayDemo: boolean
    autoplayInterval: number
    loopSpeed: number
    showCursor: boolean
    style?: CSSProperties
}

export default function AIScamDetectionCard(props: AIScamDetectionCardProps) {
    const {
        bgColor = "#EFF6FF",
        cardColor = "#FFFFFF",
        borderColor = "#DBEAFE",
        primaryColor = "#3B82F6",
        dangerColor = "#EF4444",
        textColor = "#1F2937",
        autoplayDemo = true,
        autoplayInterval = 3000,
        loopSpeed = 1,
        showCursor = true,
        style,
    } = props

    const isStaticRenderer = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()
    const [scanProgress, setScanProgress] = useState(0)
    const [isScanning, setIsScanning] = useState(false)
    const [threatDetected, setThreatDetected] = useState(false)
    const [showOCR, setShowOCR] = useState(false)
    const [showPattern, setShowPattern] = useState(false)
    const [cursorVisible, setCursorVisible] = useState(false)
    const [cursorX, setCursorX] = useState(200)
    const [cursorY, setCursorY] = useState(160)

    const mountedRef = useRef(true)
    const timeoutsRef = useRef<number[]>([])

    const canAnimate = !isStaticRenderer && !prefersReducedMotion
    const effectiveSpeed = useMemo(
        () => Math.min(2.5, Math.max(0.45, loopSpeed || 1)),
        [loopSpeed]
    )
    const speedDuration = useCallback(
        (ms: number) => Math.max(1, Math.round(ms / effectiveSpeed)),
        [effectiveSpeed]
    )

    const clearTrackedTimeouts = useCallback(() => {
        if (typeof window === "undefined") return
        timeoutsRef.current.forEach((id) => window.clearTimeout(id))
        timeoutsRef.current = []
    }, [])

    const wait = useCallback((ms: number) => {
        return new Promise<void>((resolve) => {
            if (typeof window === "undefined") {
                resolve()
                return
            }
            const id = window.setTimeout(() => {
                timeoutsRef.current = timeoutsRef.current.filter(
                    (t) => t !== id
                )
                resolve()
            }, ms)
            timeoutsRef.current.push(id)
        })
    }, [])

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    useEffect(() => {
        if (!autoplayDemo || !canAnimate || typeof window === "undefined")
            return
        let cancelled = false

        const runLoop = async () => {
            while (!cancelled && mountedRef.current) {
                // Reset
                startTransition(() => {
                    setScanProgress(0)
                    setIsScanning(false)
                    setThreatDetected(false)
                    setShowOCR(false)
                    setShowPattern(false)
                    setCursorVisible(showCursor)
                    setCursorX(200)
                    setCursorY(160)
                })
                await wait(speedDuration(600))
                if (cancelled) return

                // Move cursor to scan button
                startTransition(() => {
                    setCursorX(200)
                    setCursorY(260)
                })
                await wait(speedDuration(800))
                if (cancelled) return

                // Start scanning
                startTransition(() => {
                    setIsScanning(true)
                    setCursorVisible(false)
                })

                // Progress animation
                for (let i = 0; i <= 100; i += 5) {
                    if (cancelled) return
                    startTransition(() => setScanProgress(i))
                    await wait(speedDuration(80))

                    // Show OCR at 30%
                    if (i === 30) {
                        startTransition(() => setShowOCR(true))
                    }

                    // Show pattern matching at 60%
                    if (i === 60) {
                        startTransition(() => setShowPattern(true))
                    }
                }

                // Threat detected
                await wait(speedDuration(400))
                if (cancelled) return
                startTransition(() => {
                    setThreatDetected(true)
                    setIsScanning(false)
                })

                await wait(speedDuration(2000))
                if (cancelled) return

                // Wait before loop restart
                await wait(Math.max(200, speedDuration(autoplayInterval)))
            }
        }

        runLoop()

        return () => {
            cancelled = true
            clearTrackedTimeouts()
        }
    }, [
        autoplayDemo,
        autoplayInterval,
        canAnimate,
        clearTrackedTimeouts,
        showCursor,
        speedDuration,
        wait,
    ])

    useEffect(() => {
        return () => {
            clearTrackedTimeouts()
        }
    }, [clearTrackedTimeouts])

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: 320,
                background: bgColor,
                borderRadius: 24,
                padding: 32,
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                ...style,
            }}
        >
            {/* Background glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 200,
                    height: 200,
                    background: `${primaryColor}20`,
                    borderRadius: "50%",
                    filter: "blur(60px)",
                }}
            />

            {/* Mock Image */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                style={{
                    position: "relative",
                    width: "100%",
                    height: 140,
                    background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)`,
                    borderRadius: 16,
                    border: `1px solid ${borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginBottom: 20,
                }}
            >
                {/* Fake suspicious text overlay */}
                <div
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: textColor,
                        opacity: 0.4,
                    }}
                >
                    FREE NITRO
                </div>

                {/* Scanning overlay */}
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0, y: -140 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 140 }}
                            transition={{ duration: 2, ease: "linear" }}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 3,
                                background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                                boxShadow: `0 0 20px ${primaryColor}`,
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* OCR Detection Boxes */}
                <AnimatePresence>
                    {showOCR && (
                        <>
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                style={{
                                    position: "absolute",
                                    top: 35,
                                    left: 100,
                                    width: 120,
                                    height: 40,
                                    border: `2px solid ${primaryColor}`,
                                    borderRadius: 8,
                                    background: `${primaryColor}10`,
                                }}
                            />
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    position: "absolute",
                                    top: 80,
                                    left: 120,
                                    width: 80,
                                    height: 30,
                                    border: `2px solid ${primaryColor}`,
                                    borderRadius: 8,
                                    background: `${primaryColor}10`,
                                }}
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Pattern matching grid */}
                <AnimatePresence>
                    {showPattern && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: `
                                    repeating-linear-gradient(0deg, ${primaryColor}15 0px, ${primaryColor}15 1px, transparent 1px, transparent 20px),
                                    repeating-linear-gradient(90deg, ${primaryColor}15 0px, ${primaryColor}15 1px, transparent 1px, transparent 20px)
                                `,
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Threat detected badge */}
                <AnimatePresence>
                    {threatDetected && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", bounce: 0.6 }}
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                padding: "8px 16px",
                                background: dangerColor,
                                color: "#FFFFFF",
                                borderRadius: 999,
                                fontSize: 13,
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                boxShadow: `0 4px 12px ${dangerColor}40`,
                            }}
                        >
                            <span>⚠</span>
                            <span>SCAM</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Status text */}
            <motion.div
                style={{
                    fontSize: 14,
                    color: textColor,
                    marginBottom: 12,
                    fontWeight: 500,
                    opacity: 0.8,
                }}
            >
                <AnimatePresence mode="wait">
                    {threatDetected ? (
                        <motion.span
                            key="threat"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            ✓ Threat blocked automatically
                        </motion.span>
                    ) : isScanning ? (
                        <motion.span
                            key="scanning"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            Scanning image...
                        </motion.span>
                    ) : (
                        <motion.span
                            key="ready"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            AI Protection Active
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Progress bar */}
            <div
                style={{
                    width: "100%",
                    height: 8,
                    background: `${primaryColor}15`,
                    borderRadius: 999,
                    overflow: "hidden",
                    marginBottom: 20,
                }}
            >
                <motion.div
                    animate={{
                        width: `${scanProgress}%`,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}CC)`,
                        borderRadius: 999,
                    }}
                />
            </div>

            {/* Features list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: showOCR ? 1 : 0.4, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: textColor,
                    }}
                >
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: showOCR
                                ? `${primaryColor}20`
                                : `${primaryColor}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                        }}
                    >
                        {showOCR ? "✓" : "○"}
                    </div>
                    <span style={{ opacity: showOCR ? 1 : 0.6 }}>
                        OCR text extraction
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: showPattern ? 1 : 0.4, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: textColor,
                    }}
                >
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: showPattern
                                ? `${primaryColor}20`
                                : `${primaryColor}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                        }}
                    >
                        {showPattern ? "✓" : "○"}
                    </div>
                    <span style={{ opacity: showPattern ? 1 : 0.6 }}>
                        Pattern matching
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: threatDetected ? 1 : 0.4, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: textColor,
                    }}
                >
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: threatDetected
                                ? `${dangerColor}20`
                                : `${primaryColor}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                        }}
                    >
                        {threatDetected ? "✓" : "○"}
                    </div>
                    <span style={{ opacity: threatDetected ? 1 : 0.6 }}>
                        Automatic blocking
                    </span>
                </motion.div>
            </div>

            {/* Cursor */}
            {canAnimate && showCursor && (
                <motion.div
                    aria-hidden
                    animate={{
                        x: cursorX,
                        y: cursorY,
                        opacity: cursorVisible ? 1 : 0,
                    }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        pointerEvents: "none",
                        width: 26,
                        height: 30,
                        marginLeft: -14,
                        marginTop: -15,
                        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.28))",
                        zIndex: 10,
                    }}
                >
                    <svg viewBox="0 0 26 30" width="100%" height="100%">
                        <path
                            d="M2 1.5L2.4 24.4L8.7 18.3L12.6 26.8L16.3 25.1L12.4 16.7L20.8 16.6L2 1.5Z"
                            fill="#FFFFFF"
                            stroke="rgba(0,0,0,0.85)"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.div>
            )}
        </div>
    )
}


