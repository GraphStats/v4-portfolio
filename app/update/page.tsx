import Link from "next/link"
import { ChevronLeft, History, Rocket, Calendar } from "lucide-react"
import { getFirestoreServer } from "@/lib/firebase/server"
import { doc, getDoc } from "firebase/firestore"
import type { SiteUpdate } from "@/lib/types"
import { Countdown } from "@/components/countdown"
import { ChangelogList } from "@/components/changelog-list"

import { getMaintenanceMode, getV4Mode } from "@/lib/actions"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function UpdatePage() {
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

    const db = await getFirestoreServer()
    const docRef = doc(db, "update-p", "main")
    const docSnap = await getDoc(docRef)

    const updateData = docSnap.exists()
        ? (docSnap.data() as SiteUpdate)
        : {
            next_update_date: null,
            no_update_planned: true,
            planned_features: [],
            changelog: []
        }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group reveal-left">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2 reveal-right">
                        <History className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight uppercase">System Roadmap</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6 space-y-12">
                {/* Next Update Card */}
                <section className="reveal-up opacity-0 stagger-1">
                    <div className="glass p-10 md:p-16 rounded-[3rem] border-white/5 relative overflow-hidden mesh-bg perspective-card">
                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                            <div className="p-4 rounded-3xl bg-primary/10 text-primary animate-bounce">
                                <Rocket className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight font-display text-gradient reveal-up stagger-1">NEXT EVOLUTION</h1>
                                <p className="text-muted-foreground font-medium text-lg reveal-up stagger-2">Predicting the future of the digital ecosystem.</p>
                            </div>

                            <div className="pt-4 w-full reveal-up stagger-3">
                                {updateData.no_update_planned || !updateData.next_update_date ? (
                                    <div className="glass bg-white/5 border-white/10 p-8 rounded-[2.5rem] max-w-md mx-auto">
                                        <div className="flex items-center justify-center gap-3 text-muted-foreground mb-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="font-bold tracking-widest uppercase text-xs">Status</span>
                                        </div>
                                        <div className="text-2xl font-black tracking-tighter italic text-muted-foreground/50">
                                            No updates planned
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center gap-3 text-primary">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-bold tracking-widest uppercase text-xs">Countdown to Deployment</span>
                                        </div>
                                        <Countdown targetDate={updateData.next_update_date} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Changelog Section */}
                <section className="space-y-12 reveal-up opacity-0 stagger-2">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="text-primary font-bold tracking-widest text-xs uppercase">History</div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">VERSION LOGS</h2>
                    </div>

                    <ChangelogList entries={updateData.changelog} />
                </section>
            </main>
        </div>
    )
}
