"use client"

import Link from "next/link"
import { Command, Github, Gitlab, MessageSquare } from "lucide-react"
import { ScrollButton } from "@/components/scroll-button"
import { usePathname } from "next/navigation"

export function Footer() {
    const currentYear = new Date().getFullYear()
    const pathname = usePathname()
    const isHomePage = pathname === "/"

    return (
        <footer className="py-20 border-t border-white/5 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                <Command className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Drayko</span>
                        </div>
                        <p className="text-muted-foreground font-medium max-w-xs">
                            Crafting high-quality digital products with focus on modern aesthetics and performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 col-span-2">
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Explore</h5>
                            <ul className="space-y-3 text-muted-foreground font-medium">
                                <li className="transition-transform hover:translate-x-1">
                                    {isHomePage ? (
                                        <ScrollButton targetId="projects" variant="link" className="p-0 h-auto hover:text-foreground">Projects</ScrollButton>
                                    ) : (
                                        <Link href="/#projects" className="hover:text-foreground">Projects</Link>
                                    )}
                                </li>
                                <li className="transition-transform hover:translate-x-1">
                                    {isHomePage ? (
                                        <ScrollButton targetId="tech-stack" variant="link" className="p-0 h-auto hover:text-foreground">Tech Stack</ScrollButton>
                                    ) : (
                                        <Link href="/#tech-stack" className="hover:text-foreground">Tech Stack</Link>
                                    )}
                                </li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/tags-info" className="hover:text-foreground">Tags Info</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/about" className="hover:text-foreground">About Me</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/update" className="hover:text-foreground">Site Updates</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/admin" className="hover:text-foreground">Admin Access</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Social</h5>
                            <ul className="space-y-3 text-muted-foreground font-medium">
                                <li className="transition-transform hover:translate-x-1"><Link href="https://github.com/GraphStats" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-all flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="https://gitlab.com/graphstats.pro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-all flex items-center gap-2"><Gitlab className="h-4 w-4" /> GitLab</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/contact" className="hover:text-foreground transition-all flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground font-medium gap-4">
                    <p>&copy; 2025 - {currentYear} Drayko. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
