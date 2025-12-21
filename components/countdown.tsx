"use client"

import { useState, useEffect } from "react"
import { Timer } from "lucide-react"

interface CountdownProps {
    targetDate: string
}

export function Countdown({ targetDate }: CountdownProps) {
    const [mounted, setMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState<{
        days: number
        hours: number
        minutes: number
        seconds: number
    } | null>(null)

    useEffect(() => {
        setMounted(true)
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeLeft(null)
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    if (!mounted) {
        return <div className="h-32" /> // Simple placeholder
    }

    if (!timeLeft) {
        return (
            <div className="text-2xl font-bold text-muted-foreground animate-pulse">
                MISSION ACCOMPLISHED OR PENDING...
            </div>
        )
    }

    const units = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {units.map((unit) => (
                <div key={unit.label} className="glass bg-white/5 border-white/10 p-4 md:p-6 rounded-3xl space-y-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <div className="relative z-10">
                        <div className="text-3xl md:text-5xl font-black tracking-tighter font-display tabular-nums">
                            {String(unit.value).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
                            {unit.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
