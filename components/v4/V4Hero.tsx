"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Sparkles, ArrowRight, Code2, Cpu, Globe, Zap, MousePointer2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaDiscord } from 'react-icons/fa';

interface V4HeroProps {
    badgeText?: string
}

export function V4Hero({ badgeText = "Experience v4.0.0 is Live" }: V4HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20 px-6">
            {/* Background Neural Grid */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Interactive Glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(0.7 0.25 260 / 0.08), transparent 40%)`
                }}
            />

            {/* Flying Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-[100px]"
                />
            </div>

            <div className="container relative z-10 mx-auto">
                <div className="flex flex-col items-center text-center space-y-10">
                    {/* Chip/Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/update" className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 text-xs font-bold uppercase tracking-widest text-primary hover:border-primary/50 transition-colors cursor-pointer">
                            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                            <span>{badgeText}</span>
                        </Link>
                    </motion.div>

                    {/* Main Title */}
                    <div className="space-y-4 max-w-5xl">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] font-display"
                        >
                            <span className="block text-white/90 drop-shadow-sm uppercase">DRAYKO</span>
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">VERSION 4.</span>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            Crafting high-fidelity digital experiences with
                            <span className="text-white"> precision </span> and
                            <span className="text-primary italic"> artistic vision</span>.
                        </motion.p>
                    </div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-6 pt-6"
                    >
                        <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/20 text-md font-bold uppercase tracking-widest">
                            <Link href="#projects">
                                Explore Work
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-white/10 glass hover:bg-white/5 text-md font-bold uppercase tracking-widest transition-all">
                            <Link href="/contact">
                                Get in touch
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-16 px 10 rounded-2xl border-white/10 glass hover:bg-white/5 text-md font-bold uppercase tracking-widest transition-all">
                            <Link href="https://discord.gg/nZwFrnEW" className="flex items-center justify-center">
                                <FaDiscord className="w-10 h-10 mr-2" />
                                <span>Discord</span>
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Quick Stats/Features */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 pt-20 border-t border-white/5"
                    >
                        {[
                            { label: "Performance", value: "100", icon: Cpu },
                            { label: "Stability", value: "99.9%", icon: Globe },
                            { label: "Modern Tech", value: "V4.0", icon: Code2 },
                            { label: "Interaction", value: "Next-Gen", icon: MousePointer2 },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <stat.icon className="w-5 h-5 text-primary/60" />
                                <span className="text-xl font-black text-white">{stat.value}</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
