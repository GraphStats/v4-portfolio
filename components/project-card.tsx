import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative rounded-3xl overflow-hidden glass border-white/5 hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />

      {project.image_url && (
        <div className="relative w-full aspect-video bg-muted overflow-hidden">
          <Image
            src={project.image_url || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        </div>
      )}

      <div className="p-8 flex-1 flex flex-col space-y-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-2xl font-bold tracking-tight text-gradient group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h4>
            <div className="p-2 rounded-full bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed font-medium line-clamp-3">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full px-4 py-1 bg-white/5 border-white/10 hover:border-primary/50 transition-colors font-semibold text-[10px] uppercase tracking-wider"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-4 pt-6 mt-auto">
          {project.project_url && (
            <Button asChild size="sm" className="flex-1 rounded-full bg-white text-black hover:bg-white/90 font-bold tracking-tight shadow-lg shadow-white/5">
              <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Link>
            </Button>
          )}
          {project.github_url && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="flex-1 rounded-full border border-white/10 glass hover:bg-white/10 hover:text-foreground font-bold tracking-tight transition-all"
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

