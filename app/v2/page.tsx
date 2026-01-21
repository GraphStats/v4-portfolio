import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code, Info } from "lucide-react"

export default function V2Page() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-2xl w-full v4-card p-8 space-y-6 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Code className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Version 2</h1>
                        <p className="text-muted-foreground">Projet Next.js séparé</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                La version 2 est un projet Next.js séparé situé dans le dossier <code className="px-2 py-1 rounded bg-background/50 text-xs">v2/</code>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Pour accéder à la version 2, vous devez démarrer le serveur depuis le dossier v2/ avec ses propres dépendances et configuration.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à la version 4
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}