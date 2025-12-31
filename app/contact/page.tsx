import Link from "next/link"
import { ChevronLeft, Mail, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"

export const revalidate = 60

export default async function ContactPage() {
    // Maintenance check
    const { isMaintenance } = await getMaintenanceMode()
    if (isMaintenance) {
        redirect("/maintenance")
    }
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
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">Contact</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-2xl mx-auto px-6 flex items-center justify-center min-h-[80vh]">
                <div className="glass p-12 md:p-20 rounded-[3.5rem] border-white/5 text-center space-y-12 shadow-2xl animate-scale-in">
                    <div className="space-y-6">
                        <div className="mx-auto w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-2xl shadow-primary/20 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                            <Clock className="h-12 w-12 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display text-gradient">BIENTÔT DISPONIBLE</h1>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Mon système de messagerie directe est en cours de développement
                                pour vous offrir la meilleure expérience possible.
                            </p>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact Direct</p>
                            <h2 className="text-2xl font-bold font-display">PAR E-MAIL</h2>
                        </div>

                        <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold text-lg tracking-tight transition-all hover:scale-[1.05] active:scale-[0.95] shadow-xl">
                            <a href="mailto:admin@drayko.xyz" className="flex items-center gap-3">
                                <Mail className="h-6 w-6" />
                                admin@drayko.xyz
                            </a>
                        </Button>

                        <p className="text-sm text-muted-foreground font-medium">
                            Réponse généralement en moins de 24h.
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground font-medium italic">
                        La messagerie directe sera disponible dans la version 4.0.
                    </p>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-sm text-muted-foreground font-medium">
                <p>&copy; 2025 Drayko. Passion & Innovation.</p>
            </footer>
        </div>
    )
}
