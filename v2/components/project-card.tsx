import type { Project } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover-lift group border-border/50 bg-card/50 backdrop-blur-sm">
      {project.image_url && (
        <div className="relative w-full h-56 bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src={project.image_url || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      )}
      <CardHeader className="space-y-3">
        <CardTitle className="text-balance text-xl group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-pretty leading-relaxed">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:scale-110 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 pt-4 border-t border-border/50">
        {project.project_url && (
          <Button asChild variant="default" size="sm" className="flex-1 hover:scale-105 transition-transform group/btn">
            <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform" />
              View Live
            </Link>
          </Button>
        )}
        {project.github_url && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 hover:scale-105 transition-transform bg-transparent"
          >
            <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Source
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
