import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Sparkles } from "lucide-react"

export default function V3Page() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-2xl w-full v4-card p-8 space-y-6 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Version 3</h1>
                        <p className="text-muted-foreground">Indisponible</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-muted">
                        <Sparkles className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                La version 3 n'est pas encore disponible.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Cette version est en cours de développement ou n'a pas été publiée. Veuillez utiliser une autre version du portfolio.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button asChild variant="outline" className="flex-1 sm:flex-none">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à la version 4
                            </Link>
                        </Button>
                        <Button asChild className="flex-1 sm:flex-none">
                            <Link href="/v1.html">
                                Voir la version 1
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}