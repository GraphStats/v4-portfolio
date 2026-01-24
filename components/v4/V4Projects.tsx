"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight, Layers, Lock, History, Pause, Play, Search, X } from "lucide-react"
import { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection"
import { cn } from "@/lib/utils"

interface V4ProjectsProps {
    projects: Project[]
}

export function V4Projects({ projects }: V4ProjectsProps) {
    const [filter, setFilter] = useState<string>("all")
    const [query, setQuery] = useState<string>("")
    const { user } = useUser()
    const isSignedIn = !!user

    const normalizedQuery = query.trim().toLowerCase()

    const filteredProjects = projects.filter((project) => {
        const matchesFilter = filter === "all" || project.tags?.includes(filter)
        const matchesQuery = !normalizedQuery
            || [project.title, project.description, ...(project.tags || [])]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedQuery))
        return matchesFilter && matchesQuery
    })

    const allTags = Array.from(new Set(projects.flatMap(p => p.tags || []))).sort((a, b) => a.localeCompare(b))
    const tagCounts = projects.reduce<Record<string, number>>((acc, project) => {
        (project.tags || []).forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
    }, {})
    const hasFilters = filter !== "all" || normalizedQuery.length > 0
    const clearFilters = () => {
        setFilter("all")
        setQuery("")
    }

    const headerContent = (
        <div className="flex flex-col gap-8 pt-16 md:pt-32">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-primary font-black uppercase tracking-[0.3em] text-xs sm:text-sm"
                    >
                        Selected Works
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter"
                    >
                        FEATURED <span className="text-muted-foreground/40 italic">PROJECTS</span>
                    </motion.h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                        Filter by tag or search for a project to quickly find what you want to explore.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {filteredProjects.length} / {projects.length} projects
                    </Badge>
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white"
                            onClick={clearFilters}
                        >
                            <X className="w-3 h-3 mr-2" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        aria-pressed={filter === "all"}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
                            filter === "all"
                                ? "bg-primary text-primary-foreground border-primary/50"
                                : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:border-white/30"
                        )}
                    >
                        All
                        <span className="ml-2 text-[9px] font-black opacity-70">{projects.length}</span>
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => setFilter(tag)}
                            aria-pressed={filter === tag}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
                                filter === tag
                                    ? "bg-primary text-primary-foreground border-primary/50"
                                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:border-white/30"
                            )}
                        >
                            {tag}
                            <span className="ml-2 text-[9px] font-black opacity-70">{tagCounts[tag] || 0}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            type="search"
                            placeholder="Search a project, tag, or keyword"
                            className="h-11 rounded-xl bg-white/5 border-white/10 pl-9 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-11 rounded-xl glass border-white/10 text-[10px] font-black uppercase tracking-widest"
                        onClick={clearFilters}
                        disabled={!hasFilters}
                    >
                        Clear filters
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <section id="projects" className="relative">
            <HorizontalScrollSection header={headerContent}>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} isSignedIn={isSignedIn} />
                    ))
                ) : (
                    <EmptyState onReset={clearFilters} hasFilters={hasFilters} />
                )}
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
            className={`group relative flex flex-col md:flex-row h-full v4-card p-4 md:p-6 hover:border-primary/50 transition-all duration-500 overflow-hidden ${isLocked ? "scale-[0.98] opacity-90" : ""} w-full sm:w-[90vw] md:w-[70vw] lg:w-[45vw] flex-shrink-0`}
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
                        {getStatusText()}
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

function EmptyState({ onReset, hasFilters }: { onReset: () => void; hasFilters: boolean }) {
    return (
        <div className="v4-card p-8 md:p-12 rounded-2xl w-full sm:w-[90vw] md:w-[70vw] lg:w-[45vw] flex-shrink-0">
            <div className="space-y-4 text-center">
                <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                    No results
                </div>
                <h3 className="text-2xl md:text-3xl font-black">No projects found</h3>
                <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                    Try another tag or clear your filters to see all projects.
                </p>
                {hasFilters && (
                    <Button
                        variant="outline"
                        className="rounded-xl glass border-white/10 text-[10px] font-black uppercase tracking-widest"
                        onClick={onReset}
                    >
                        Reset filters
                    </Button>
                )}
            </div>
        </div>
    )
}
