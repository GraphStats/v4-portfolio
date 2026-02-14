"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Briefcase, Mail, BarChart3, Settings, Moon, Sun, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaDiscord } from "react-icons/fa"

const items = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "Projects", href: "/#projects" },
    { icon: BarChart3, label: "Stats", href: "/stats" },
    { icon: MessageSquare, label: "Feedback", href: "/feedback" },
    { icon: User, label: "About", href: "/about" },
    { icon: Mail, label: "Contact", href: "/contact" },
    { icon: FaDiscord, label: "Discord", href: "https://discord.gg/nZwFrnEW" },
    { icon: Settings, label: "Admin", href: "/admin" },
]

const mobileItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "Projects", href: "/#projects" },
    { icon: BarChart3, label: "Stats", href: "/stats" },
    { icon: MessageSquare, label: "Feedback", href: "/feedback" },
    { icon: Mail, label: "Contact", href: "/contact" },
]

export function V4Dock() {
    const [hovered, setHovered] = useState<number | null>(null)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [hideDock, setHideDock] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)")
        const section = document.getElementById("projects")

        if (!section) {
            setHideDock(false)
            return
        }

        const handleVisibility = () => {
            if (!mediaQuery.matches) {
                setHideDock(false)
                return
            }

            const rect = section.getBoundingClientRect()
            const viewportHeight = window.innerHeight || 0
            const isActive = rect.top <= 80 && rect.bottom >= viewportHeight * 0.65
            setHideDock(isActive)
        }

        handleVisibility()
        window.addEventListener("scroll", handleVisibility, { passive: true })
        window.addEventListener("resize", handleVisibility)

        mediaQuery.addEventListener("change", handleVisibility)

        return () => {
            window.removeEventListener("scroll", handleVisibility)
            window.removeEventListener("resize", handleVisibility)
            mediaQuery.removeEventListener("change", handleVisibility)
        }
    }, [])

    if (!mounted) return null

    return (
        <>
            <div className="hidden md:block fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                    initial={{ y: 100, opacity: 0.5 }}
                    animate={{ y: hideDock ? 30 : 0, opacity: hideDock ? 0 : 1 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                        "flex items-center gap-2 p-2 rounded-3xl v4-glass border border-white/10",
                        hideDock && "pointer-events-none"
                    )}
                >
                    {items.map((item, i) => (
                        <Link key={i} href={item.href}>
                            <motion.div
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                whileHover={{ y: -10, scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "relative p-4 rounded-2xl transition-colors",
                                    hovered === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-6 h-6" />
                                <AnimatePresence>
                                    {hovered === i && (
                                        <motion.span
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: -40 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-popover text-popover-foreground text-[10px] font-bold uppercase tracking-widest pointer-events-none"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}

                    <div className="w-[1px] h-8 bg-white/10 mx-2" />

                    <motion.button
                        whileHover={{ y: -10, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-4 rounded-2xl text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </motion.button>
                </motion.div>
            </div>

            <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: hideDock ? 20 : 0, opacity: hideDock ? 0 : 1 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                        "flex items-center justify-between gap-2 px-3 py-2 rounded-2xl v4-glass border border-white/10",
                        hideDock && "pointer-events-none"
                    )}
                >
                    {mobileItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span>Theme</span>
                    </button>
                </motion.div>
            </div>
        </>
    )
}
