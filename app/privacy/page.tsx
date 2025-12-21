import Link from "next/link"
import { ChevronLeft, Shield } from "lucide-react"

export default function PrivacyPage() {
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
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">Privacy Policy</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6">
                <div className="glass p-10 md:p-16 rounded-[2.5rem] border-white/5 space-y-12 shadow-2xl">
                    <section className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display text-gradient">PRIVACY POLICY</h1>
                        <p className="text-muted-foreground font-medium">Last updated: {new Date().toLocaleDateString()}</p>
                    </section>

                    <div className="prose prose-invert max-w-none space-y-8 font-medium text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Introduction</h2>
                            <p>
                                Welcome to Drayko's Portfolio. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you about how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">2. The Data We Collect</h2>
                            <p>
                                As a portfolio website, we collect minimal data. This may include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Usage Data: Information about how you use our website.</li>
                                <li>Technical Data: IP address, browser type and version, time zone setting, and location.</li>
                                <li>Contact Data: If you contact us via email, we may store your email address and message content.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">3. How We Use Your Data</h2>
                            <p>
                                We only use your personal data when the law allows us to. Most commonly, we will use your personal data
                                to improve our website experience or to respond to your inquiries.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Cookies</h2>
                            <p>
                                Our website uses minimal cookies to enhance performance. You can set your browser to refuse all or some
                                browser cookies, or to alert you when websites set or access cookies.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                <span className="text-primary ml-1">admin@drayko.dev</span>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-sm text-muted-foreground font-medium">
                <p>&copy; {new Date().getFullYear()} Drayko. Professional Ethics & Privacy.</p>
            </footer>
        </div>
    )
}
