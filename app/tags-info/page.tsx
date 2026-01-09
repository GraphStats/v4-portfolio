import Link from "next/link"
import { ChevronLeft, Tags, Rocket, CheckCircle2, Archive, Timer, Code2, AlertCircle } from "lucide-react"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"

export const revalidate = 60

export default async function TagsInfoPage() {
    // Maintenance check
    const { isMaintenance } = await getMaintenanceMode()
    if (isMaintenance) {
        redirect("/maintenance")
    }

    const tagCategories = [
        {
            id: "no-tag",
            name: "Aucun tag",
            icon: Rocket,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30",
            iconColor: "text-purple-500",
            description: "L'absence de tag signifie que le projet est en version stable et actif.",
            details: [
                "Le projet est pleinement fonctionnel et en version stable",
                "Des mises à jour régulières sont toujours apportées",
                "De nouvelles fonctionnalités peuvent être ajoutées",
                "Le projet est activement maintenu et amélioré"
            ]
        },
        {
            id: "in-development-active",
            name: "En développement (En cours)",
            icon: Timer,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30",
            iconColor: "text-green-500",
            description: "Le projet est actuellement en développement actif avec des progrès réguliers.",
            details: [
                "Le projet est en construction active",
                "Des mises à jour régulières sont apportées",
                "La barre de progression avance continuellement",
                "Le projet arrivera prochainement dans une version stable"
            ]
        },
        {
            id: "in-development-paused",
            name: "En développement (En pause)",
            icon: Timer,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500/30",
            iconColor: "text-orange-500",
            description: "Le développement du projet est temporairement en pause.",
            details: [
                "Le projet est en construction mais temporairement suspendu",
                "Aucune mise à jour n'est apportée pour le moment",
                "La barre de progression est figée",
                "Le développement reprendra ultérieurement"
            ]
        },
        {
            id: "completed",
            name: "Terminé",
            icon: CheckCircle2,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30",
            iconColor: "text-green-500",
            description: "Ce tag signifie que le projet est complètement terminé et fonctionnel.",
            details: [
                "Le projet est entièrement fonctionnel et stable",
                "Toutes les fonctionnalités prévues ont été implémentées",
                "Le projet ne recevra plus de mises à jour majeures ni mineures",
                "Corrections de bugs et mises à jour de sécurité uniquement si nécessaire"
            ]
        },
        {
            id: "archived",
            name: "Archivé",
            icon: Archive,
            color: "from-gray-500 to-slate-500",
            bgColor: "bg-gray-500/10",
            borderColor: "border-gray-500/30",
            iconColor: "text-gray-500",
            description: "Ce tag indique que le projet a été archivé et n'est plus maintenu.",
            details: [
                "Le projet ne recevra plus aucune mise à jour",
                "Le projet n'est pas terminé et être incomplet",
                "Certaines fonctionnalités peuvent ne pas être opérationnelles",
                "Le code source reste disponible pour référence ou fork (si possible)"
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Retour à l'accueil
                    </Link>
                    <div className="flex items-center gap-2">
                        <Tags className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">Tags Info</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container mx-auto px-6">

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-24 reveal-up">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 text-glow">
                        COMPRENDRE LES TAGS
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Chaque projet est marqué d'un <span className="text-primary">tag de statut</span> pour vous informer de son état actuel. Voici ce que signifie chaque tag.
                    </p>
                </div>

                {/* Tags Grid */}
                <div className="max-w-6xl mx-auto space-y-8">
                    {tagCategories.map((tag, index) => {
                        const IconComponent = tag.icon
                        return (
                            <div
                                key={tag.id}
                                className="glass p-8 md:p-10 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden mesh-bg reveal-up hover:scale-[1.02] transition-all duration-500"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${tag.color} opacity-10 rounded-full blur-3xl`} />

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl ${tag.bgColor} border ${tag.borderColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                            <IconComponent className={`h-8 w-8 ${tag.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-bold tracking-tight mb-3">{tag.name}</h2>
                                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                                {tag.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 pl-[88px]">
                                        {tag.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group">
                                                <div className={`w-1.5 h-1.5 rounded-full ${tag.bgColor} border ${tag.borderColor} mt-2 flex-shrink-0 group-hover:scale-150 transition-transform`} />
                                                <p className="text-muted-foreground font-medium leading-relaxed">
                                                    {detail}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Info Box */}
                <div className="max-w-4xl mx-auto mt-16 reveal-up">
                    <div className="glass p-8 rounded-[2rem] border-white/10 bg-primary/5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <h3 className="text-xl font-bold">Bon à savoir</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    Les tags sont mis à jour régulièrement pour refléter l'état actuel de chaque projet.
                                    Si vous avez des questions sur un projet spécifique, n'hésitez pas à me <Link href="/contact" className="text-primary hover:underline font-bold">contacter</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto mt-16 text-center reveal-up">
                    <div className="glass p-12 rounded-[2.5rem] border-white/10 space-y-6 mesh-bg relative overflow-hidden">
                        <Rocket className="h-12 w-12 text-primary mx-auto animate-pulse" />
                        <h3 className="text-3xl font-bold tracking-tight">Prêt à explorer mes projets ?</h3>
                        <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
                            Découvrez tous mes projets et leurs statuts actuels.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/#projects"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
                            >
                                <Code2 className="h-5 w-5" />
                                Voir les projets
                            </Link>
                        </div>
                    </div>
                </div>

            </main>

            <footer className="py-12 border-t border-white/5 text-center text-sm text-muted-foreground font-medium relative z-10">
                <p>&copy; 2025 - 2026 Drayko. All rights reserved.</p>
            </footer>
        </div>
    )
}
