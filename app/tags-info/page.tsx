import Link from "next/link"
import { Tags, Rocket, CheckCircle2, Archive, Timer, Code2, AlertCircle, Play, Pause } from "lucide-react"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"
import { isLocalRequest } from "@/lib/server-utils"
import { V4Navbar } from "@/components/v4/V4Navbar"
import { V4Footer } from "@/components/v4/V4Footer"
import { V4Dock } from "@/components/v4/V4Dock"

export const dynamic = "force-dynamic"

export default async function TagsInfoPage() {
    // Platform Status check (Skipped if local)
    const isLocal = await isLocalRequest()
    if (!isLocal) {
        // Maintenance check
        const { isMaintenance } = await getMaintenanceMode()
        if (isMaintenance) {
            redirect("/maintenance")
        }
    }

    const tagCategories = [
        {
            id: "active",
            name: "Active",
            icon: Rocket,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            iconColor: "text-blue-400",
            description: "Le projet est en version stable et actif.",
            details: [
                "Le projet est pleinement fonctionnel et en version stable",
                "Des mises à jour régulières sont toujours apportées",
                "De nouvelles fonctionnalités peuvent être ajoutées",
                "Le projet est activement maintenu et amélioré"
            ]
        },
        {
            id: "in-development",
            name: "In Development",
            icon: Play,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20",
            iconColor: "text-green-400",
            description: "Le projet est actuellement en développement actif avec des progrès réguliers.",
            details: [
                "Le projet est en construction active",
                "Des mises à jour régulières sont apportées",
                "La barre de progression avance continuellement",
                "Le projet arrivera prochainement dans une version stable"
            ]
        },
        {
            id: "paused",
            name: "Paused",
            icon: Pause,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500/20",
            iconColor: "text-orange-400",
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
            name: "Completed",
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-500",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
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
            name: "Archived",
            icon: Archive,
            color: "from-gray-500 to-slate-500",
            bgColor: "bg-gray-500/10",
            borderColor: "border-gray-500/20",
            iconColor: "text-gray-400",
            description: "Ce tag indique que le projet a été archivé et n'est plus maintenu.",
            details: [
                "Le projet ne recevra plus aucune mise à jour",
                "Le projet n'est pas terminé et est incomplet",
                "Certaines fonctionnalités peuvent ne pas être opérationnelles",
                "Le code source reste disponible pour référence ou fork (si possible)"
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-v4" />
            <div className="mesh-v4 fixed inset-0 pointer-events-none" />

            <V4Navbar />

            <main className="relative z-10 pt-40 pb-32 container mx-auto px-6">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full v4-glass border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary mx-auto">
                        <Tags className="w-3 h-3" />
                        Project Status Guide
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">
                        COMPRENDRE LES <span className="text-primary">TAGS.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground/70 font-medium max-w-2xl mx-auto leading-relaxed">
                        Chaque projet est marqué d'un <span className="text-primary font-bold">tag de statut</span> pour vous informer de son état actuel.
                    </p>
                </div>

                {/* Tags Grid */}
                <div className="max-w-6xl mx-auto space-y-6">
                    {tagCategories.map((tag, index) => {
                        const IconComponent = tag.icon
                        return (
                            <div
                                key={tag.id}
                                className="v4-glass p-8 md:p-10 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${tag.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start gap-6 mb-8">
                                        <div className={`w-16 h-16 rounded-2xl ${tag.bgColor} border ${tag.borderColor} flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-xl`}>
                                            <IconComponent className={`h-8 w-8 ${tag.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-black tracking-tight mb-3 uppercase italic">{tag.name}</h2>
                                            <p className="text-lg text-muted-foreground/70 font-medium leading-relaxed">
                                                {tag.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4 pl-[88px]">
                                        {tag.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group/item">
                                                <div className={`w-2 h-2 rounded-full ${tag.bgColor} border ${tag.borderColor} mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform`} />
                                                <p className="text-muted-foreground/60 font-medium leading-relaxed text-sm">
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
                <div className="max-w-4xl mx-auto mt-16">
                    <div className="v4-glass p-8 rounded-[2rem] border-white/5 bg-primary/5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 backdrop-blur-xl">
                                <AlertCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <h3 className="text-xl font-black uppercase tracking-tight">Bon à savoir</h3>
                                <p className="text-muted-foreground/70 font-medium leading-relaxed">
                                    Les tags sont mis à jour régulièrement pour refléter l'état actuel de chaque projet.
                                    Si vous avez des questions sur un projet spécifique, n'hésitez pas à me <Link href="/contact" className="text-primary hover:underline font-bold">contacter</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <div className="v4-glass p-12 rounded-[2.5rem] border-white/5 space-y-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Rocket className="h-12 w-12 text-primary mx-auto animate-pulse relative z-10" />
                        <h3 className="text-3xl font-black tracking-tight uppercase italic relative z-10">Prêt à explorer mes projets ?</h3>
                        <p className="text-lg text-muted-foreground/70 font-medium max-w-xl mx-auto relative z-10">
                            Découvrez tous mes projets et leurs statuts actuels.
                        </p>
                        <div className="pt-4 relative z-10">
                            <Link
                                href="/#projects"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
                            >
                                <Code2 className="h-4 w-4" />
                                Voir les projets
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <V4Footer />
            <V4Dock />
        </div>
    )
}
