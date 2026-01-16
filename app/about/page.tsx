import Link from "next/link"
import { ChevronLeft, User, Heart, Sparkles, Code2, Brain, Globe, Laptop } from "lucide-react"
import { getMaintenanceMode, getV4Mode } from "@/lib/actions"
import { redirect } from "next/navigation"
import { isLocalRequest } from "@/lib/server-utils"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
    // Platform Status check (Skipped if local)
    const isLocal = await isLocalRequest()
    if (!isLocal) {
        // Maintenance check
        const { isMaintenance } = await getMaintenanceMode()
        if (isMaintenance) {
            redirect("/maintenance")
        }

        // V4 Mode check
        const { isV4Mode } = await getV4Mode()
        if (isV4Mode) {
            redirect("/v4-is-coming")
        }
    }
    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">About Me</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container mx-auto px-6">

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-24 reveal-up">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 text-glow">
                        BEHIND THE CODE
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        I'm Drayko, a <span className="text-primary">Creative Developer</span> passionate about crafting digital experiences that live at the intersection of design and engineering.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="max-w-5xl mx-auto">
                    <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/10 space-y-16 shadow-2xl relative overflow-hidden mesh-bg">

                        {/* Story Section */}
                        <section className="grid md:grid-cols-2 gap-12 items-center reveal-up stagger-1">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-primary mb-2">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="text-sm font-bold uppercase tracking-widest">My Journey</span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Crafting Digital Experiences</h2>
                                <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                    <p>
                                        I’ve always been obsessed with building things. It started with game modding—messing around with config files and assets until I broke something, then figuring out how to fix it. That curiosity naturally led me to code.
                                    </p>
                                    <p>
                                        I don't just write code to ship features; I write code to create experiences. For me, development isn't just about logic, it's about craft. Whether it's optimizing a database query or perfecting a micro-interaction, I care about the details that most people don't see, but definitely feel.
                                    </p>
                                </div>
                            </div>

                            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden glass border-white/5 flex items-center justify-center p-8 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                <Code2 className="w-32 h-32 text-foreground/10 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </section>

                        {/* Philosophy Grid */}
                        <section className="reveal-up stagger-2">
                            <div className="flex items-center gap-3 text-primary mb-8 justify-center">
                                <Brain className="h-5 w-5" />
                                <span className="text-sm font-bold uppercase tracking-widest">Philosophy</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-background/30 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                        <Laptop className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">User Centric</h3>
                                    <p className="text-sm text-muted-foreground">Every line of code is written with the end-user in mind. If it's not intuitive, it's not done.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-background/30 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Refined Design</h3>
                                    <p className="text-sm text-muted-foreground">Obsessive attention to detail. Smooth animations, responsive layouts, and modern aesthetics.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-background/30 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Performance First</h3>
                                    <p className="text-sm text-muted-foreground">Fast load times and optimized interactions are non-negotiable standards in my work.</p>
                                </div>
                            </div>
                        </section>

                        {/* Personal Note */}
                        <section className="text-center space-y-6 max-w-2xl mx-auto pt-8 border-t border-white/5 reveal-up stagger-3">
                            <Heart className="h-8 w-8 text-red-400 mx-auto animate-pulse" />
                            <p className="text-lg text-muted-foreground italic">
                                "I don't just write code; I craft digital experiences. Let's build something extraordinary together."
                            </p>

                            <div className="flex justify-center gap-4 pt-4">
                                <Link href="/contact" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20">
                                    Get in Touch
                                </Link>
                                <a href="https://github.com/GraphStats" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-full bg-background/50 border border-white/10 text-foreground font-bold text-sm tracking-wide hover:bg-white/10 transition-all hover:scale-105">
                                    GitHub
                                </a>
                            </div>
                        </section>

                    </div>
                </div >
            </main >
        </div >
    )
}
