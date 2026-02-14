"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Command, Menu, X, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AuthButtons } from "@/components/auth-buttons"
import { VersionSelector } from "@/components/version-selector"
import { FaDiscord } from "react-icons/fa"
import { useRouteTransition } from "@/components/route-transition"
import { useSiteSettings } from "@/components/site-settings-provider"

export function V4Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()
    const { loading, progress } = useRouteTransition()
    const { developerName } = useSiteSettings()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        const originalOverflow = document.body.style.overflow
        if (mobileOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = originalOverflow
        }
        return () => {
            document.body.style.overflow = originalOverflow
        }
    }, [mobileOpen])

    

    const navItems = [
        { label: "Projects", href: "/#projects" },
        { label: "News", href: "/news" },
        { label: "Feedback", href: "/feedback" },
        { label: "Stats", href: "/stats" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ]

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className={`relative overflow-hidden flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 rounded-2xl transition-all duration-500 ${scrolled ? "v4-glass shadow-2xl" : "bg-transparent"}`}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-all group-hover:bg-white group-hover:text-primary"
                        >
                            <Command className="w-5 h-5" />
                        </motion.div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">
                            {developerName}<span className="text-primary group-hover:text-white transition-colors">.</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-3">
                            <VersionSelector />
                            <AuthButtons />
                        </div>
                        <Button asChild variant="outline" size="sm" className="hidden lg:flex rounded-xl glass border-white/5 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-primary hover:text-primary-foreground transition-all">
                            <Link href="https://discord.gg/nZwFrnEW">
                                <FaDiscord className="w-3.5 h-3.5 mr-2" />
                                Discord
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden rounded-xl"
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>

                    {loading && scrolled && (
                        <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 via-primary to-cyan-400 transition-transform duration-200 origin-left"
                                style={{ transform: `scaleX(${progress / 100})` }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {loading && !scrolled && (
                <div className="fixed top-0 left-0 right-0 h-[2px] z-[120] bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 via-primary to-cyan-400 transition-transform duration-200 origin-left"
                        style={{ transform: `scaleX(${progress / 100})` }}
                    />
                </div>
            )}

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-[120] lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu overlay"
                        />
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-4 right-4 top-20"
                        >
                            <div className="v4-glass rounded-3xl p-6 border border-white/10 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        Navigation
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-xl"
                                        onClick={() => setMobileOpen(false)}
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="mt-6 grid gap-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <span>{item.label}</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-6 grid gap-3">
                                    <div className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Version
                                        </span>
                                        <VersionSelector />
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Account
                                        </span>
                                        <AuthButtons />
                                    </div>
                                    <Button asChild variant="outline" className="w-full rounded-2xl glass border-white/5 text-[10px] font-black uppercase tracking-widest">
                                        <Link href="https://discord.gg/nZwFrnEW" className="flex items-center justify-center">
                                            <FaDiscord className="w-4 h-4 mr-2" />
                                            Discord
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
