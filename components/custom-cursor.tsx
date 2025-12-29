"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    const cursorRef = useRef<HTMLDivElement>(null)

    // Use refs for mutable values to avoid re-renders on every frame
    const mouse = useRef({ x: 0, y: 0 })
    const cursor = useRef({ x: 0, y: 0 })

    useEffect(() => {
        // Check if device is touch-capable (usually disable custom cursor on touch)
        const isTouch = window.matchMedia("(pointer: coarse)").matches
        if (isTouch) return

        setIsVisible(true)

        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
        }

        const onMouseDown = () => setIsClicking(true)
        const onMouseUp = () => setIsClicking(false)

        // Handle hover states for interactive elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Check if target or its parents are interactive
            const isInteractive =
                target.matches("a, button, input, textarea, [role='button'], .interactive") ||
                target.closest("a, button, input, textarea, [role='button'], .interactive")

            setIsHovering(!!isInteractive)
        }

        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mousedown", onMouseDown)
        window.addEventListener("mouseup", onMouseUp)
        document.addEventListener("mouseover", handleMouseOver)

        // Hide default cursor
        document.body.style.cursor = "none"

        // Animation Loop for fluid lag effect
        let animationFrameId: number

        const animate = () => {
            // Configurable lag factors (0 = no movement, 1 = instant)
            // Lower = more lag/fluidity
            const lag = 0.15

            // Lerp (Linear Interpolation)
            cursor.current.x += (mouse.current.x - cursor.current.x) * lag
            cursor.current.y += (mouse.current.y - cursor.current.y) * lag

            if (cursorRef.current) {
                // We translate by 0,0 typically, or offset slightly if needed.
                // For a mouse pointer, usually the tip is at 0,0 relative to the position
                cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0)`
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mousedown", onMouseDown)
            window.removeEventListener("mouseup", onMouseUp)
            document.removeEventListener("mouseover", handleMouseOver)
            document.body.style.cursor = "auto"
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div
            ref={cursorRef}
            className={cn(
                "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference text-primary transition-all duration-300 ease-out",
                isClicking && "scale-90"
            )}
            style={{
                // Use negative margin to offset if necessary, but for a pointer, 
                // usually top-left corner is the hotspot.
                marginLeft: "-3px", // Slight adjustment to center visual weight if needed, or 0
                marginTop: "-2px"
            }}
        >
            {/* Custom Mouse SVG */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                    "transition-all duration-300",
                    isHovering ? "scale-100 opacity-100" : "scale-100 opacity-100"
                )}
            >
                <path d="M5.5 3.21429C5.5 2.15575 6.74109 1.587 7.5459 2.27732L17.8016 11.0747C18.6676 11.8176 18.2393 13.2359 17.1199 13.3503L12.5699 13.8153C12.3789 13.8348 12.2033 13.9317 12.0833 14.0841L9.60098 17.2367C8.9419 18.0737 7.625 17.6534 7.625 16.5898V3.21429H5.5Z"
                    fill="currentColor" />
            </svg>
        </div>
    )
}
