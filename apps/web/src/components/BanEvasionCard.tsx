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
 * BAN EVASION TRACKING CARD - MINIMAL
 * Ultra-clean design showing alt account detection
 * 
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 360
 * @framerIntrinsicHeight 280
 */

interface BanEvasionCardProps {
    bgColor: string
    cardColor: string
    accentColor: string
    textColor: string
    autoplayDemo: boolean
    autoplayInterval: number
    loopSpeed: number
    style?: CSSProperties
}

export default function BanEvasionCard(props: BanEvasionCardProps) {
    const {
        bgColor = "transparent",
        cardColor = "#FFFFFF",
        accentColor = "#1F2937",
        textColor = "#6B7280",
        autoplayDemo = true,
        autoplayInterval = 3500,
        loopSpeed = 1,
        style,
    } = props

    const isStaticRenderer = useIsStaticRenderer()
    const prefersReducedMotion = useReducedMotion()
    const [detectStep, setDetectStep] = useState(0)

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
                startTransition(() => setDetectStep(0))
                await wait(speedDuration(600))
                if (cancelled) return

                // Step 1
                startTransition(() => setDetectStep(1))
                await wait(speedDuration(1000))
                if (cancelled) return

                // Step 2
                startTransition(() => setDetectStep(2))
                await wait(speedDuration(1000))
                if (cancelled) return

                // Step 3
                startTransition(() => setDetectStep(3))
                await wait(speedDuration(1800))
                if (cancelled) return

                // Wait before restart
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
                minHeight: 280,
                background: bgColor,
                borderRadius: 24,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                ...style,
            }}
        >

            {/* Minimal Card - Center */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    flex: 1,
                    background: cardColor,
                    borderRadius: 20,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
            >
                {/* Icon + Title */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: "rgba(0,0,0,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2C10.3431 2 9 3.34315 9 5C9 6.30622 9.83481 7.41746 11 7.82929V9C11 9.55228 11.4477 10 12 10C12.5523 10 13 9.55228 13 9V7.82929C14.1652 7.41746 15 6.30622 15 5C15 3.34315 13.6569 2 12 2Z"
                                fill="currentColor"
                            />
                            <path
                                d="M12 11C9.23858 11 7 13.2386 7 16V17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17V16C17 13.2386 14.7614 11 12 11Z"
                                fill="currentColor"
                            />
                            <path
                                d="M5 15C5 14.4477 4.55228 14 4 14C3.44772 14 3 14.4477 3 15V16C3 18.2091 4.79086 20 7 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H7C5.89543 18 5 17.1046 5 16V15Z"
                                fill="currentColor"
                                opacity="0.5"
                            />
                            <path
                                d="M19 15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15V16C21 18.2091 19.2091 20 17 20H16C15.4477 20 15 19.5523 15 19C15 18.4477 15.4477 18 16 18H17C18.1046 18 19 17.1046 19 16V15Z"
                                fill="currentColor"
                                opacity="0.5"
                            />
                            <circle cx="7" cy="9" r="2" fill="currentColor" opacity="0.3" />
                            <circle cx="17" cy="9" r="2" fill="currentColor" opacity="0.3" />
                        </svg>
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Ban Evasion Detection
                    </div>
                </div>

                {/* Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Step 1 */}
                    <motion.div
                        animate={{
                            opacity: detectStep >= 1 ? 1 : 0.35,
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: detectStep >= 1 ? accentColor : "rgba(0,0,0,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.3s",
                            }}
                        >
                            {detectStep >= 1 && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    width="12"
                                    height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                >
                                    <path
                                        d="M1 5L4.5 8.5L11 1.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            )}
                        </div>
                        <span
                            style={{
                                fontSize: 14,
                                color: textColor,
                                transition: "all 0.3s",
                            }}
                        >
                            Device fingerprint match
                        </span>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        animate={{
                            opacity: detectStep >= 2 ? 1 : 0.35,
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: detectStep >= 2 ? accentColor : "rgba(0,0,0,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.3s",
                            }}
                        >
                            {detectStep >= 2 && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    width="12"
                                    height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                >
                                    <path
                                        d="M1 5L4.5 8.5L11 1.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            )}
                        </div>
                        <span
                            style={{
                                fontSize: 14,
                                color: textColor,
                                transition: "all 0.3s",
                            }}
                        >
                            IP pattern analysis
                        </span>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        animate={{
                            opacity: detectStep >= 3 ? 1 : 0.35,
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: detectStep >= 3 ? accentColor : "rgba(0,0,0,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.3s",
                            }}
                        >
                            {detectStep >= 3 && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    width="12"
                                    height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                >
                                    <path
                                        d="M1 5L4.5 8.5L11 1.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            )}
                        </div>
                        <span
                            style={{
                                fontSize: 14,
                                color: textColor,
                                transition: "all 0.3s",
                            }}
                        >
                            Alt account detected
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}


