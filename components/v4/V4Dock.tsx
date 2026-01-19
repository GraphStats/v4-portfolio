"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Briefcase, Mail, BarChart3, Settings, Github, Twitter, Search, Moon, Sun, Command } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaDiscord } from 'react-icons/fa';

const items = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "Projects", href: "#projects" },
    { icon: BarChart3, label: "Stats", href: "/stats" },
    { icon: User, label: "About", href: "/about" },
    { icon: Mail, label: "Contact", href: "/contact" },
    { icon: FaDiscord, label: "Discord", href: "https://discord.gg/nZwFrnEW" },
    { icon: Settings, label: "Admin", href: "/admin" },
]

export function V4Dock() {
    const [hovered, setHovered] = useState<number | null>(null)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 p-2 rounded-3xl backdrop-blur-2xl background-color-black"
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

                {/* Theme Toggle in Dock */}
                <motion.button
                    whileHover={{ y: -10, scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-4 rounded-2xl text-muted-foreground hover:text-foreground transition-colors"
                >
                    {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </motion.button>
            </motion.div>
        </div>
    )
}
