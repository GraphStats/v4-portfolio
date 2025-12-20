"use client"

import { useEffect, useState } from "react"
import { AdBanner } from "./ad-banner"
import { X } from "lucide-react"

export function AdPopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative bg-card border border-border rounded-xl p-8 shadow-2xl max-w-2xl w-full animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="text-center space-y-4 mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Special Offer!
                    </h2>
                    <p className="text-muted-foreground">
                        Don't miss this exclusive opportunity. Support our site by viewing this awesome advertisement.
                    </p>
                </div>

                <div className="flex justify-center border-t border-b border-border py-8">
                    <AdBanner />
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        Continue to Site
                    </button>
                </div>

                <div className="mt-4 flex justify-center gap-4">
                    <AdBanner />
                    <AdBanner />
                </div>
            </div>
        </div>
    )
}
