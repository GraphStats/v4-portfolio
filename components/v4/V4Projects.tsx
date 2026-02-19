"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight, Layers, Lock, History, Pause, Play, Search, X, Star, Eye, AlertTriangle } from "lucide-react"
import { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { HorizontalScrollSection } from "@/components/ui/HorizontalScrollSection"
import { cn } from "@/lib/utils"

interface V4ProjectsProps {
    projects: Project[]
    incidentProjectMarkers?: string[]
}

const FavoriteStarIcon = ({
    className,
    filled = false,
}: {
    className?: string
    filled?: boolean
}) => (
    <Star
        className={cn(className, filled ? "fill-current" : "fill-transparent")}
        strokeWidth={1.5}
    />
)

export function V4Projects({ projects, incidentProjectMarkers = [] }: V4ProjectsProps) {
    const [filter, setFilter] = useState<string>("all")
    const [query, setQuery] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("newest")
    const [favorites, setFavorites] = useState<string[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const { user } = useUser()
    const isSignedIn = !!user

    const normalizedQuery = query.trim().toLowerCase()
    const favoriteSet = useMemo(() => new Set(favorites), [favorites])

    useEffect(() => {
        const stored = window.localStorage.getItem("v4-favorites")
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) setFavorites(parsed)
            } catch {
                setFavorites([])
            }
        }
    }, [])

    useEffect(() => {
        window.localStorage.setItem("v4-favorites", JSON.stringify(favorites))
    }, [favorites])

    const toggleFavorite = (projectId: string) => {
        setFavorites((prev) =>
            prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
        )
    }

    const filteredProjects = projects.filter((project) => {
        const matchesFilter = filter === "all"
            || (filter === "favorites" ? favoriteSet.has(project.id) : project.tags?.includes(filter))
        const matchesQuery = !normalizedQuery
            || [project.title, project.description, ...(project.tags || [])]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedQuery))
        return matchesFilter && matchesQuery
    })

    const getTimestamp = (value: unknown) => {
        if (!value) return 0
        if (value instanceof Date) return value.getTime()
        if (typeof value === "number") return value
        if (typeof value === "string") {
            const parsed = Date.parse(value)
            return Number.isNaN(parsed) ? 0 : parsed
        }
        if (typeof value === "object" && value && "seconds" in value) {
            return Number((value as { seconds: number }).seconds) * 1000
        }
        return 0
    }

    const getStatusRank = (project: Project) => {
        if (project.in_development) return project.development_status === "paused" ? 1 : 0
        if (project.is_completed) return 2
        if (project.is_archived) return 3
        return 4
    }

    const sortedProjects = useMemo(() => {
        const list = [...filteredProjects]
        switch (sortBy) {
            case "oldest":
                return list.sort((a, b) => getTimestamp(a.created_at) - getTimestamp(b.created_at))
            case "progress":
                return list.sort((a, b) => (b.development_progress || 0) - (a.development_progress || 0))
            case "status":
                return list.sort((a, b) => getStatusRank(a) - getStatusRank(b))
            case "title":
                return list.sort((a, b) => a.title.localeCompare(b.title))
            case "newest":
            default:
                return list.sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at))
        }
    }, [filteredProjects, sortBy])

    const allTags = useMemo(
        () => Array.from(new Set(projects.flatMap((p) => p.tags || []))).sort((a, b) => a.localeCompare(b)),
        [projects]
    )
    const tagCounts = useMemo(
        () =>
            projects.reduce<Record<string, number>>((acc, project) => {
                (project.tags || []).forEach((tag) => {
                    acc[tag] = (acc[tag] || 0) + 1
                })
                return acc
            }, {}),
        [projects]
    )
    const favoriteCount = useMemo(
        () => projects.filter((project) => favoriteSet.has(project.id)).length,
        [projects, favoriteSet]
    )
    const selectedProject = useMemo(
        () => (selectedProjectId ? projects.find((project) => project.id === selectedProjectId) ?? null : null),
        [projects, selectedProjectId]
    )
    const hasFilters = filter !== "all" || normalizedQuery.length > 0
    const clearFilters = () => {
        setFilter("all")
        setQuery("")
    }

    const exportFavorites = () => {
        const payload = JSON.stringify({ favorites, exportedAt: new Date().toISOString() }, null, 2)
        const blob = new Blob([payload], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = "favorites.json"
        anchor.click()
        URL.revokeObjectURL(url)
    }

    const importFavorites = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result))
                const imported = Array.isArray(parsed) ? parsed : parsed.favorites
                if (!Array.isArray(imported)) return
                setFavorites(imported.filter((id) => typeof id === "string"))
            } catch {
                // Ignore malformed files.
            }
        }
        reader.readAsText(file)
        event.target.value = ""
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
                    {sortedProjects.length} / {projects.length} projects
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
                    <button
                        type="button"
                        onClick={() => setFilter("favorites")}
                        aria-pressed={filter === "favorites"}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors inline-flex items-center gap-1.5",
                            filter === "favorites"
                                ? "bg-primary text-primary-foreground border-primary/50"
                                : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:border-white/30"
                        )}
                    >
                        <FavoriteStarIcon className="w-3.5 h-3.5" filled={filter === "favorites"} />
                        Favorites
                        <span className="ml-1 text-[9px] font-black opacity-70">{favoriteCount}</span>
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
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11 w-full sm:w-52 rounded-xl bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 border-white/10">
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="progress">Progress</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-11 rounded-xl glass border-white/10 text-[10px] font-black uppercase tracking-widest"
                        onClick={clearFilters}
                        disabled={!hasFilters}
                    >
                        Clear filters
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-11 rounded-xl glass border-white/10 text-[10px] font-black uppercase tracking-widest"
                        onClick={exportFavorites}
                        disabled={favorites.length === 0}
                    >
                        Export favorites
                    </Button>
                    <label className="h-11 px-4 inline-flex items-center justify-center rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest cursor-pointer">
                        Import favorites
                        <input type="file" accept="application/json" className="hidden" onChange={importFavorites} />
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <section id="projects" className="relative scroll-mt-28">
            <HorizontalScrollSection header={headerContent}>
                {sortedProjects.length > 0 ? (
                    sortedProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            isSignedIn={isSignedIn}
                            isFavorite={favoriteSet.has(project.id)}
                            incidentProjectMarkers={incidentProjectMarkers}
                            onToggleFavorite={toggleFavorite}
                            onOpenQuickView={setSelectedProjectId}
                        />
                    ))
                ) : (
                    <EmptyState onReset={clearFilters} hasFilters={hasFilters} />
                )}
            </HorizontalScrollSection>
            <ProjectQuickViewDialog
                project={selectedProject}
                isOpen={!!selectedProject}
                isFavorite={selectedProject ? favoriteSet.has(selectedProject.id) : false}
                onOpenChange={(open) => {
                    if (!open) setSelectedProjectId(null)
                }}
                onToggleFavorite={toggleFavorite}
            />
        </section>
    )
}

function ProjectCard({
    project,
    index,
    isSignedIn,
    isFavorite,
    incidentProjectMarkers,
    onToggleFavorite,
    onOpenQuickView,
}: {
    project: Project
    index: number
    isSignedIn: boolean
    isFavorite: boolean
    incidentProjectMarkers: string[]
    onToggleFavorite: (projectId: string) => void
    onOpenQuickView: (projectId: string) => void
}) {
    const isLocked = project.requires_auth && !isSignedIn
    const hasIncidentIssue = doesProjectMatchIncident(project, incidentProjectMarkers)

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
            <button
                type="button"
                onClick={() => onToggleFavorite(project.id)}
                aria-pressed={isFavorite}
                className={cn(
                    "absolute top-4 right-4 z-10 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all",
                    isFavorite ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:text-white hover:border-white/30"
                )}
            >
                <FavoriteStarIcon className="w-4 h-4" filled={isFavorite} />
                <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
            </button>
            <div className="relative w-full md:w-2/5 md:min-w-[280px] lg:min-w-[320px] aspect-[16/10] md:aspect-square rounded-xl overflow-hidden mb-4 md:mb-0 md:mr-6 bg-muted/20 flex-shrink-0">
                {project.image_url ? (
                    <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 33vw"
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

                <div className="flex flex-wrap gap-2">
                    {hasIncidentIssue && (
                        <Link
                            href="/status"
                            className="inline-flex items-center rounded-full bg-red-500/15 border border-red-500/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-red-200 hover:bg-red-500/25 transition-colors"
                        >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Incident Issue
                        </Link>
                    )}
                    {project.requires_auth && (
                        <Badge className="rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Members
                        </Badge>
                    )}
                    {project.is_completed && (
                        <Badge className="rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                            Completed
                        </Badge>
                    )}
                    {project.is_archived && (
                        <Badge className="rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Archived
                        </Badge>
                    )}
                    {project.in_development && (
                        <Badge className="rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            {project.development_status === "paused" ? "Paused" : "In Development"}
                        </Badge>
                    )}
                </div>

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
                        type="button"
                        variant="outline"
                        className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5"
                        onClick={() => onOpenQuickView(project.id)}
                    >
                        <Eye className="w-3 h-3 mr-2" />
                        Quick View
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5"
                    >
                        <Link href={getProjectUpdateUrl(project)}>
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

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
}

function compactText(value: string): string {
    return normalizeText(value).replace(/\s+/g, "")
}

function doesProjectMatchIncident(project: Project, markers: string[]): boolean {
    if (!markers.length) return false

    const projectName = normalizeText(project.title || "")
    const projectNameCompact = compactText(projectName)
    if (!projectName) return false

    return markers.some((marker) => {
        const normalizedMarker = normalizeText(marker)
        if (!normalizedMarker || normalizedMarker.length < 3) return false
        const compactMarker = compactText(normalizedMarker)
        return (
            projectName.includes(normalizedMarker) ||
            normalizedMarker.includes(projectName) ||
            (compactMarker.length >= 3 && projectNameCompact.includes(compactMarker)) ||
            (projectNameCompact.length >= 3 && compactMarker.includes(projectNameCompact))
        )
    })
}

function getProjectUpdateUrl(project: Project) {
    return (project.slug === "my-portfolio-this-web-site" || project.title === "My portfolio (this web site)")
        ? "/update"
        : `/${project.slug || project.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}/update`
}

function ProjectQuickViewDialog({
    project,
    isOpen,
    isFavorite,
    onOpenChange,
    onToggleFavorite,
}: {
    project: Project | null
    isOpen: boolean
    isFavorite: boolean
    onOpenChange: (open: boolean) => void
    onToggleFavorite: (projectId: string) => void
}) {
    if (!project) return null

    const isLocked = project.requires_auth
    const statusText = project.in_development
        ? project.development_status === 'paused' ? "Paused" : "In Development"
        : project.is_archived
            ? "Archived"
            : project.is_completed
                ? "Completed"
                : "Active"

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background/95 border-white/10 sm:max-w-4xl">
                <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted/20">
                        {project.image_url ? (
                            <Image
                                src={project.image_url}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 90vw, 60vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-30">
                                <Layers className="w-12 h-12" />
                            </div>
                        )}
                    </div>
                    <div className="space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">
                                {project.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                {project.description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-wrap gap-2">
                            {project.tags?.map(tag => (
                                <Badge key={tag} className="rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>

                        {project.in_development && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{project.development_progress || 0}%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${project.development_progress || 0}%` }} />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant={isFavorite ? "default" : "outline"}
                                className="rounded-xl text-[10px] font-black uppercase tracking-widest"
                                onClick={() => onToggleFavorite(project.id)}
                            >
                                <FavoriteStarIcon className="w-3.5 h-3.5 mr-2" filled={isFavorite} />
                                {isFavorite ? "Favorited" : "Add to favorites"}
                            </Button>
                            <Badge className="rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                {statusText}
                            </Badge>
                        </div>

                        {!isLocked && (project.project_url || project.github_url) && (
                            <div className="flex flex-col sm:flex-row gap-3">
                                {project.project_url && (
                                    <Button asChild size="sm" className="rounded-xl">
                                        <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3 h-3 mr-2" />
                                            Live Demo
                                        </Link>
                                    </Button>
                                )}
                                {project.github_url && (
                                    <Button asChild size="sm" variant="outline" className="rounded-xl">
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
                            <Link href={getProjectUpdateUrl(project)}>
                                <History className="w-3 h-3 mr-2" />
                                View Updates
                            </Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
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
