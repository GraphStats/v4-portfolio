import Link from "next/link"
import { ChevronLeft, Scale } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">Terms of Service</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6">
                <div className="glass p-10 md:p-16 rounded-[2.5rem] border-white/5 space-y-12 shadow-2xl">
                    <section className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display text-gradient">TERMS OF SERVICE</h1>
                        <p className="text-muted-foreground font-medium">Last updated: December 21, 2025</p>
                    </section>

                    <div className="prose prose-invert max-w-none space-y-8 font-medium text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any
                                part of the terms, then you may not access the service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">2. Intellectual Property</h2>
                            <p>
                                The website and its original content (excluding project code linked to external repositories), features,
                                and functionality are and will remain the exclusive property of Drayko. All designs, layouts, and logos
                                are protected by copyright.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">3. Use License</h2>
                            <p>
                                Permission is granted to temporarily view the materials on this website for personal, non-commercial
                                transitory viewing only. You may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Modify or copy the materials for commercial purposes.</li>
                                <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                                <li>Remove any copyright or other proprietary notations from the materials.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Disclaimer</h2>
                            <p>
                                The materials on this website are provided on an 'as is' basis. Drayko makes no warranties, expressed
                                or implied, and hereby disclaims and negates all other warranties including, without limitation,
                                implied warranties or conditions of merchantability.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">5. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction
                                and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-sm text-muted-foreground font-medium">
                <p>&copy; 2025 Drayko. Legal Framework & Terms.</p>
            </footer>
        </div>
    )
}
