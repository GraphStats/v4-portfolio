import Link from "next/link"
import { ChevronLeft, History, Rocket, Calendar, Info, Package, Hammer, Archive } from "lucide-react"
import { getProjectBySlug } from "@/lib/actions"
import { notFound, redirect } from "next/navigation"
import { ChangelogList } from "@/components/changelog-list"
import { getMaintenanceMode, getV4Mode } from "@/lib/actions"
import { isLocalRequest } from "@/lib/server-utils"

export const dynamic = "force-dynamic"

interface ProjectUpdatePageProps {
    params: {
        slug: string
    }
}

export default async function ProjectUpdatePage({ params }: ProjectUpdatePageProps) {
    const { slug } = await params

    // Platform Status check (Skipped if local)
    const isLocal = await isLocalRequest()
    if (!isLocal) {
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
    }

    const project = await getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    // Redirect to main update page if it's the portfolio itself
    if (project.slug === "my-portfolio-this-web-site" || project.title === "My portfolio (this web site)") {
        redirect("/update")
    }

    const changelog = project.changelog || []

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
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <History className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold tracking-tight uppercase text-xs">Project Roadmap</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{project.title}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6 space-y-12">
                {/* Archived Status Banner */}
                {project.is_archived && (
                    <div className="glass p-6 rounded-3xl border-indigo-500/20 bg-indigo-500/5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                            <Archive className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-indigo-300">Project Archived</h3>
                            <p className="text-sm text-indigo-200/50">This project has reached its final stable state. No further updates are planned for this legacy version.</p>
                        </div>
                    </div>
                )}

                {/* Project Context Card */}
                <section>
                    <div className="glass p-10 md:p-14 rounded-[3rem] border-white/5 relative overflow-hidden perspective-card">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Package className="h-32 w-32" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest">
                                    {project.is_archived ? "Legacy Archive" : project.in_development ? "Development Phase" : project.is_completed ? "Stable Release" : "Active Project"}
                                </div>
                                {project.in_development && (
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-bold text-[10px] uppercase tracking-widest">
                                        <Hammer className="h-3 w-3" />
                                        {project.development_progress}% Complete
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gradient">{project.title}</h1>
                                <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">
                                    Tracing the evolution and milestone releases of the project environment.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Changelog Section */}
                <section className="space-y-12">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="text-primary font-bold tracking-widest text-xs uppercase px-4 py-1 rounded-full bg-primary/5 border border-primary/10">Lifecycle</div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">VERSION LOGS</h2>
                    </div>

                    {changelog.length > 0 ? (
                        <ChangelogList entries={changelog} />
                    ) : (
                        <div className="glass p-12 rounded-[2.5rem] border-white/5 text-center space-y-4">
                            <div className="inline-flex p-4 rounded-2xl bg-white/5 text-muted-foreground/50">
                                <History className="h-8 w-8 text-primary/40" />
                            </div>
                            <div className="space-y-2 max-w-md mx-auto">
                                <h3 className="font-bold text-xl text-foreground">Trace Initializing</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    The update tracking system was recently integrated. While this project is active, its historical logs are currently being synchronized or haven't been published yet.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
