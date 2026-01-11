import { PublicStats } from "@/components/public-stats"

export default function StatsPage() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
                <div className="max-w-5xl mx-auto">
                    <PublicStats />
                </div>
            </div>
        </div>
    )
}
