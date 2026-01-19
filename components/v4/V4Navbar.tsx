"use client"

import { motion } from "framer-motion"
import { Command, Lock, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { AuthButtons } from "@/components/auth-buttons"
import { VersionSelector } from "@/components/version-selector"
import { FaDiscord } from 'react-icons/fa';

export function V4Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-4" : "py-8"}`}>
            <div className="container mx-auto px-6">
                <div className={`flex items-center justify-between px-6 h-16 rounded-2xl transition-all duration-500 ${scrolled ? "v4-glass shadow-2xl" : "bg-transparent"}`}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-all group-hover:bg-white group-hover:text-primary"
                        >
                            <Command className="w-5 h-5" />
                        </motion.div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            Drayko<span className="text-primary group-hover:text-white transition-colors">.</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {["Projects", "Stats", "About"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase() === 'projects' ? '#projects' : item.toLowerCase()}`}
                                className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <VersionSelector />
                        <AuthButtons />
                        <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-xl glass border-white/5 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-primary hover:text-primary-foreground transition-all">
                            <Link href="https://discord.gg/nZwFrnEW">
                                <FaDiscord className="w-3.5 h-3.5 mr-2" />
                                Discord
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
