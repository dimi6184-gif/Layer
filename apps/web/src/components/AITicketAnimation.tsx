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
import { motion, useReducedMotion } from "framer-motion"

/**
 * AI TICKET ROUTING ANIMATION - MINIMAL
 * Smooth typing text animation showing AI categorizing tickets
 * 
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 380
 * @framerIntrinsicHeight 200
 */

interface AITicketAnimationProps {
    textColor: string
    accentColor: string
    autoplayDemo: boolean
    autoplayInterval: number
    loopSpeed: number
    style?: CSSProperties
}

export default function AITicketAnimation(props: AITicketAnimationProps) {
    const {
        textColor = "#6B7280",
        accentColor = "#1F2937",
        autoplayDemo = true,
        autoplayInterval = 3000,
        loopSpeed = 1,
        style,
    } = props

    const prefersReducedMotion = useReducedMotion()
    const [displayText, setDisplayText] = useState("")
    const [isComplete, setIsComplete] = useState(false)
    const [showCategory, setShowCategory] = useState(false)

    const mountedRef = useRef(true)
    const timeoutsRef = useRef<number[]>([])

    const canAnimate = !prefersReducedMotion
    const effectiveSpeed = useMemo(
        () => Math.min(2.5, Math.max(0.45, loopSpeed || 1)),
        [loopSpeed]
    )
    const speedDuration = useCallback(
        (ms: number) => Math.max(1, Math.round(ms / effectiveSpeed)),
        [effectiveSpeed]
    )

    const fullText = "Analyzing server structure: #general, #support, #announcements, #tech-help..."
    const category = "✓ Server mapped successfully"

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
                    setDisplayText("")
                    setIsComplete(false)
                    setShowCategory(false)
                })
                await wait(speedDuration(600))
                if (cancelled) return

                // Type out text character by character
                for (let i = 0; i <= fullText.length; i++) {
                    if (cancelled) return
                    startTransition(() => {
                        setDisplayText(fullText.slice(0, i))
                    })
                    await wait(speedDuration(30))
                }

                startTransition(() => setIsComplete(true))
                await wait(speedDuration(400))
                if (cancelled) return

                // Show category
                startTransition(() => setShowCategory(true))
                await wait(speedDuration(2000))
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
        fullText.length,
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
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                ...style,
            }}
        >
            {/* Search bar header */}
            <div
                style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    backgroundColor: "#F9FAFB",
                }}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, opacity: 0.4 }}
                >
                    <circle
                        cx="11"
                        cy="11"
                        r="8"
                        stroke={textColor}
                        strokeWidth="2"
                    />
                    <path
                        d="M21 21l-4.35-4.35"
                        stroke={textColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search tickets..."
                    disabled
                    style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: textColor,
                        outline: "none",
                        fontFamily: "inherit",
                    }}
                />
                <div
                    style={{
                        padding: "4px 8px",
                        backgroundColor: "#E5E7EB",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#6B7280",
                    }}
                >
                    AI
                </div>
            </div>

            {/* Main content area */}
            <div
                style={{
                    flex: 1,
                    padding: "32px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {/* Main text with typing animation */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                    }}
                >
                {/* Animated spinner */}
                <motion.div
                    animate={
                        !isComplete
                            ? {
                                  rotate: [0, 360],
                              }
                            : {}
                    }
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                        marginTop: 2,
                    }}
                >
                    {!isComplete ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke={textColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="40 20"
                                opacity="0.3"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M5 13l4 4L19 7"
                                stroke="#22C55E"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </motion.div>

                {/* Typing text */}
                <div style={{ flex: 1 }}>
                    <motion.p
                        style={{
                            fontSize: 15,
                            lineHeight: 1.6,
                            color: textColor,
                            margin: 0,
                            fontWeight: 400,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {displayText}
                        {/* Blinking cursor */}
                        {!isComplete && (
                            <motion.span
                                animate={{
                                    opacity: [1, 0],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: "steps(1)",
                                }}
                                style={{
                                    display: "inline-block",
                                    width: 2,
                                    height: 18,
                                    background: accentColor,
                                    marginLeft: 2,
                                    verticalAlign: "text-bottom",
                                }}
                            />
                        )}
                    </motion.p>

                    {/* Category badge */}
                    {showCategory && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.4,
                                type: "spring",
                                bounce: 0.3,
                            }}
                            style={{
                                marginTop: 16,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 16px",
                                background: "rgba(34, 197, 94, 0.1)",
                                borderRadius: 999,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#22C55E",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M5 13l4 4L19 7"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>Server mapped successfully</span>
                        </motion.div>
                    )}
                </div>
            </div>
            </div>
        </div>
    )
}

addPropertyControls(AITicketAnimation, {
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "#6B7280",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#1F2937",
    },
    autoplayDemo: {
        type: ControlType.Boolean,
        title: "Auto Demo",
        defaultValue: true,
    },
    autoplayInterval: {
        type: ControlType.Number,
        title: "Demo Speed",
        defaultValue: 3000,
        min: 1500,
        max: 8000,
        step: 100,
        unit: "ms",
        hidden(props) {
            return !props.autoplayDemo
        },
    },
    loopSpeed: {
        type: ControlType.Number,
        title: "Loop Speed",
        defaultValue: 1,
        min: 0.5,
        max: 2.5,
        step: 0.05,
        hidden(props) {
            return !props.autoplayDemo
        },
    },
})
