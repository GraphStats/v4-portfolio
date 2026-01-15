import Link from "next/link"
import { ChevronLeft, Mail, MessageSquare, Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMaintenanceMode, getAvailability, getV4Mode } from "@/lib/actions"
import { redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export const revalidate = 0

export default async function ContactPage() {
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

    const { isAvailable } = await getAvailability()

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


            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6 flex items-center justify-center min-h-[80vh]">
                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 glass p-2 rounded-[3.5rem] border-white/5 shadow-2xl animate-scale-in">

                    {/* Info Side */}
                    <div className="bg-white/5 rounded-[3rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-glow shadow-primary/20 mb-8">
                                <Mail className="h-8 w-8" />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight font-display text-white">
                                    Parlons de votre <span className="text-gradient">Projet</span>
                                </h1>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    Vous avez une idée en tête ? Je suis là pour vous aider à la réaliser.
                                    Remplissez le formulaire et je vous répondrai sous 24h.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-6 mt-12">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Direct</p>
                                <a href="mailto:info@drayko.xyz" className="text-lg font-bold hover:text-primary transition-colors block">
                                    info@drayko.xyz
                                </a>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Disponibilité</p>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAvailable ? "bg-green-400" : "bg-red-400"}`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                                    </span>
                                    <span className={`font-bold ${isAvailable ? "text-white" : "text-red-200"}`}>
                                        {isAvailable ? "Ouvert aux projets" : "Indisponible"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Form Side */}
                    <div className="p-8 md:p-12">
                        <SignedIn>
                            <ChatInterface isAvailable={isAvailable} />
                        </SignedIn>
                        <SignedOut>
                            <div className="relative">
                                {/* Flou overlay */}
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-[2rem] z-10 flex items-center justify-center">
                                    <div className="text-center space-y-4 p-8">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                                            <Lock className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-xl font-bold">Connexion requise</h3>
                                        <p className="text-muted-foreground">Vous devez être connecté pour me contacter.</p>
                                        <SignInButton mode="modal">
                                            <Button className="rounded-full">Se connecter</Button>
                                        </SignInButton>
                                    </div>
                                </div>
                                {/* Contenu flouté */}
                                <div className="blur-sm opacity-60 pointer-events-none">
                                    <ChatInterface isAvailable={isAvailable} />
                                </div>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </main>
        </div>
    )
}
