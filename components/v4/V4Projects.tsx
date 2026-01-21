"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight, Layers, Lock, History, Pause, Play } from "lucide-react"
import { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection"

interface V4ProjectsProps {
    projects: Project[]
}

export function V4Projects({ projects }: V4ProjectsProps) {
    const [filter, setFilter] = useState<string>("all")
    const { user } = useUser()
    const isSignedIn = !!user

    const filteredProjects = filter === "all"
        ? projects
        : projects.filter(p => p.tags?.includes(filter))

    const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])))

    const headerContent = (
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 pt-16 md:pt-32">
            <div className="space-y-4 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-primary font-black uppercase tracking-[0.3em] text-sm"
                >
                    Selected Works
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter"
                >
                    FEATURED <span className="text-muted-foreground/40 italic">PROJECTS</span>
                </motion.h2>
            </div>
        </div>
    );

    return (
        <section id="projects" className="relative">
            <HorizontalScrollSection header={headerContent}>
                {filteredProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} isSignedIn={isSignedIn} />
                ))}
            </HorizontalScrollSection>
        </section>
    )
}

function ProjectCard({ project, index, isSignedIn }: { project: Project; index: number; isSignedIn: boolean }) {
    const isLocked = project.requires_auth && !isSignedIn

    const getStatusText = () => {
        if (project.in_development) return project.development_status === 'paused' ? "Paused" : "In Development"
        if (project.is_archived) return "Archived"
        if (project.is_completed) return "Completed"
        return "Active"
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`group relative flex flex-col md:flex-row h-full v4-card p-4 md:p-6 hover:border-primary/50 transition-all duration-500 overflow-hidden ${isLocked ? "scale-[0.98] opacity-90" : ""} w-[90vw] md:w-[70vw] lg:w-[45vw] flex-shrink-0`}
        >
            <div className="relative w-full md:w-2/5 md:min-w-[280px] lg:min-w-[320px] aspect-[16/10] md:aspect-square rounded-xl overflow-hidden mb-4 md:mb-0 md:mr-6 bg-muted/20 flex-shrink-0">
                {project.image_url ? (
                    <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isLocked ? "blur-md grayscale scale-110" : ""}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                        <Layers className="w-12 h-12" />
                    </div>
                )}

                {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                        <Lock className="w-8 h-8 text-white/50 mb-4" />
                        <SignInButton mode="modal">
                            <Button size="sm" className="rounded-xl bg-white text-black font-black uppercase tracking-widest text-[9px]">Unlock</Button>
                        </SignInButton>
                    </div>
                )}

                <div className="absolute top-4 left-4">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground border-white/5 font-bold uppercase tracking-widest text-[9px] px-3 py-1 flex items-center gap-1.5">
                        {project.in_development && (project.development_status === 'paused' ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 animate-pulse" />)}
                        getStatusText()
                    </Badge>
                </div>
            </div>

            <div className="flex flex-col flex-grow min-w-0 space-y-4 md:space-y-6">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight group-hover:text-primary transition-colors flex-1 min-w-0">
                        {project.title}
                    </h3>
                    {!isLocked && (
                        <motion.div whileHover={{ rotate: 45 }} className="flex-shrink-0">
                            <ArrowRight className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        </motion.div>
                    )}
                </div>

                <p className={`text-sm md:text-base text-muted-foreground line-clamp-3 md:line-clamp-4 leading-relaxed ${isLocked ? "opacity-30" : ""}`}>
                    {project.description}
                </p>

                {project.in_development && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            <span>Progress</span>
                            <span>{project.development_progress || 0}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${project.development_progress || 0}%` }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2">
                    {project.tags?.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-extrabold text-primary/40">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-col gap-3 mt-auto pt-2">
                    {!isLocked && (project.project_url || project.github_url) && (
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            {project.project_url && (
                                <Button 
                                    asChild 
                                    size="sm" 
                                    variant="secondary"
                                    className="w-full sm:flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5 h-10"
                                >
                                    <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-3 h-3 mr-2" />
                                        Live Demo
                                    </Link>
                                </Button>
                            )}
                            {project.github_url && (
                                <Button 
                                    asChild 
                                    size="sm" 
                                    variant="secondary"
                                    className="w-full sm:flex-1 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5 h-10"
                                >
                                    <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-3 h-3 mr-2" />
                                        GitHub
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}

                    <Button 
                        asChild 
                        variant="ghost" 
                        className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5"
                    >
                        <Link href={
                            (project.slug === "my-portfolio-this-web-site" || project.title === "My portfolio (this web site)")
                                ? "/update"
                                : `/${project.slug || project.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}/update`
                        }>
                            <History className="w-3 h-3 mr-2" />
                            View Updates
                        </Link>
                    </Button>
                </div>
            </div>

            {!isLocked && <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/2 to-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />}
        </motion.div>
    )
}