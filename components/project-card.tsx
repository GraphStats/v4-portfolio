import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowUpRight, Hammer, Wrench, Construction, CheckCircle2, Trophy, ImageOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={`group relative rounded-3xl overflow-hidden glass h-full flex flex-col perspective-card reveal-up transition-all duration-500 
      ${project.in_development ? "border-dashed border-white/20" : "border-white/5"}
      ${project.is_completed ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : ""}
    `}>
      {/* Background Mesh (Appears on Hover) - Emerald version for finished projects */}
      {project.is_completed ? (
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      ) : (
        <div className="absolute inset-0 mesh-bg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}

      {/* Glow Effect Overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 
        ${project.is_completed ? "group-hover:bg-emerald-500/5" : "group-hover:bg-primary/5"}
      `} />

      <div className="relative w-full aspect-video bg-muted/20 overflow-hidden border-b border-white/5">
        {project.image_url ? (
          <>
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className={`object-cover group-hover:scale-110 transition-transform duration-1000 ease-out 
                ${project.in_development ? "grayscale brightness-50" : ""}
                ${project.is_completed ? "brightness-110 contrast-110" : ""}
              `}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors duration-500">
            <div className={`p-4 rounded-2xl border border-dashed transition-all duration-500 
              ${project.is_completed ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/10 bg-white/5 group-hover:border-primary/20"}
            `}>
              <ImageOff className={`h-8 w-8 transition-transform duration-500 group-hover:scale-110 
                ${project.is_completed ? "text-emerald-500/40" : "text-muted-foreground/40 group-hover:text-primary/40"}
              `} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500
              ${project.is_completed ? "text-emerald-500/30" : "text-muted-foreground/30 group-hover:text-primary/40"}
            `}>
              Projet sans visuel
            </span>
          </div>
        )}

        {project.in_development && (
          <>
            <div
              className="absolute inset-x-0 top-0 h-[18%] construction-pattern"
              style={{
                maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
              }}
            />
            <div className="absolute top-3 inset-x-0 flex items-center justify-center">
              <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl border-2 border-black rotate-[-1deg] animate-pulse">
                In Development
              </div>
            </div>
          </>
        )}

        {project.is_completed && (
          <div className="absolute top-3 right-3">
            <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg border border-emerald-400/50 animate-bounce">
              < Trophy className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col space-y-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h4 className={`text-2xl font-bold tracking-tight transition-all duration-500
                ${project.is_completed ? "text-emerald-400" : "text-gradient group-hover:text-primary"}
              `}>
                {project.title}
              </h4>
              {project.in_development && (
                <div className="p-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <Wrench className="h-3.5 w-3.5 text-yellow-400 animate-spin-slow" />
                </div>
              )}
              {project.is_completed && (
                <div className="p-1 rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </div>
            <div className={`p-2 rounded-full border transition-all duration-300 shadow-glow
              ${project.is_completed ? "bg-emerald-500/10 border-emerald-500/20 opacity-100 shadow-emerald-500/20" : "bg-white/5 border-white/10 opacity-0 group-hover:opacity-100 shadow-primary/20"}
            `}>
              <ArrowUpRight className={`h-4 w-4 ${project.is_completed ? "text-emerald-500" : "text-primary"}`} />
            </div>
          </div>
          <p className={`text-muted-foreground leading-relaxed font-medium line-clamp-3 transition-colors 
            ${project.in_development ? "italic opacity-70" : ""}
            ${project.is_completed ? "text-emerald-50/70" : ""}
          `}>
            {project.description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`rounded-full px-4 py-1 border-white/10 transition-all font-semibold text-[10px] uppercase tracking-wider
                  ${project.is_completed ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/80" : "bg-white/5 group-hover:border-primary/50"}
                `}
              >
                {tag}
              </Badge>
            ))}
            {project.in_development && (
              <Badge variant="secondary" className="rounded-full px-4 py-1 bg-primary/20 border-primary/30 text-primary font-bold text-[10px] uppercase tracking-widest animate-pulse">
                WIP
              </Badge>
            )}
            {project.is_completed && (
              <Badge variant="secondary" className="rounded-full px-4 py-1 bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                Finished
              </Badge>
            )}
          </div>

          {project.in_development && (
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400/40 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent transition-all duration-1000"
                style={{ width: `${project.development_progress || 0}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6 mt-auto">
          {project.in_development ? (
            <Button disabled className="flex-1 rounded-full bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed">
              <Construction className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          ) : (
            project.project_url && (
              <Button asChild size="sm" className="flex-1 rounded-full bg-white text-black hover:bg-primary hover:text-white font-bold tracking-tight transition-all duration-500 hover:scale-110 active:scale-95 shadow-lg hover:shadow-primary/20">
                <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Link>
              </Button>
            )
          )}

          {project.github_url && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-1 rounded-full border border-white/10 glass hover:bg-white/10 hover:text-foreground font-bold tracking-tight transition-all duration-500 hover:scale-110 active:scale-95"
            >
              <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

