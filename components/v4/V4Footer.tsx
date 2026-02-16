"use client"

import { Github, Mail, ArrowUp, Command } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaCoffee } from "react-icons/fa"
import { useSiteSettings } from "@/components/site-settings-provider"


export function V4Footer() {
    const { developerName } = useSiteSettings()
    const brandUpper = developerName.toUpperCase()
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/#projects" },
        { label: "Feedback", href: "/feedback" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Stats", href: "/stats" },
        { label: "Tags", href: "/tags-info" },
    ]

    return (
        <footer className="relative pt-20 sm:pt-24 md:pt-32 pb-28 sm:pb-32 md:pb-40 overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 mb-16 md:mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20 rotate-6">
                                <Command className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter">{brandUpper} <span className="text-primary italic">.</span></span>
                        </div>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-sm leading-relaxed">
                            Building the next generation of digital tools and experiences with a focus on human-centric design.
                        </p>
                        <div className="flex gap-4">
                            <Button asChild variant="outline" size="icon" className="rounded-xl glass border-white/5 hover:bg-primary hover:text-primary-foreground transition-all">
                                <a href="https://github.com/graphstats" target="_blank" rel="noopener noreferrer">
                                    <Github className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="rounded-xl glass border-white/5 hover:bg-primary hover:text-primary-foreground transition-all">
                                <a href="https://buymeacoffee.com/drayko_dev">
                                    <FaCoffee className="w-5 h-5" />
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="rounded-xl glass border-white/5 hover:bg-primary hover:text-primary-foreground transition-all">
                                <a href="mailto:hello@drayko.xyz">
                                    <Mail className="w-5 h-5" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Navigation</h4>
                        <ul className="space-y-4">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Legal</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Social</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="https://buymeacoffee.com/drayko_dev" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                    Buy Me a Coffee
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center py-8 sm:py-10 md:py-12 border-t border-white/5 gap-6 md:gap-8">
                    <p className="text-sm text-muted-foreground font-medium">
                        © {new Date().getFullYear()} {developerName}. All rights reserved. <span className="text-primary">v4.0.0</span>
                    </p>
                    <Button
                        onClick={scrollToTop}
                        variant="ghost"
                        className="group flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                        <span className="text-xs font-black uppercase tracking-widest">Back to top</span>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <ArrowUp className="w-4 h-4" />
                        </div>
                    </Button>
                </div>
            </div>

            {/* Background Text */}
            <div className="absolute -bottom-10 left-0 right-0 pointer-events-none select-none overflow-hidden whitespace-nowrap opacity-[0.02]">
                <span className="text-[8rem] sm:text-[12rem] md:text-[20rem] font-black tracking-tighter leading-none italic uppercase">
                    {`${brandUpper}   ${brandUpper}   ${brandUpper}   ${brandUpper}`}
                </span>
            </div>
        </footer>
    )
}

