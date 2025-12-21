'use client'

import { useEffect } from 'react'
import { RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#030712] text-[#f9fafb] font-sans flex items-center justify-center overflow-hidden relative selection:bg-red-500/30 selection:text-red-500">
            {/* Ambient Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-red-600/10 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
            </div>

            <div className="noise-overlay opacity-10" />

            <div className="container relative z-10 px-6 max-w-2xl text-center space-y-12 animate-shake">
                <div className="space-y-4">
                    <div className="text-[clamp(8rem,20vw,12rem)] font-black leading-none tracking-tighter font-display bg-gradient-to-b from-red-500 to-red-950 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        500
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display uppercase italic">
                        Noyau <span className="text-red-500">Instable</span>
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto font-medium leading-relaxed">
                        Le serveur du portfolio Drayko subit une surcharge de données. L'accès à mes projets est temporairement suspendu pour maintenance corrective.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={reset}
                        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(220,38,38,0.6)]"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Relancer le Système
                    </button>

                    <Link
                        href="/"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Hub Central
                    </Link>
                </div>

                <div className="flex justify-center flex-col items-center gap-4 opacity-50">
                    <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Diagnostic en cours...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
