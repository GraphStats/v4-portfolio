"use client"

import { useState } from "react"
import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Settings2 } from "lucide-react"
import Image from "next/image"
import { ProjectDialog } from "@/components/project-dialog"
import { DeleteProjectDialog } from "@/components/delete-project-dialog"

interface AdminProjectCardProps {
  project: Project
  onDeleted?: (projectId: string) => void
  onUpdated?: () => void
}

export function AdminProjectCard({ project, onDeleted, onUpdated }: AdminProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="group relative rounded-3xl overflow-hidden glass border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col h-full bg-card/20">
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-2 rounded-full glass border-white/10 backdrop-blur-md">
            <Settings2 className="h-4 w-4 text-primary animate-spin-slow" />
          </div>
        </div>

        {project.image_url && (
          <div className="relative w-full aspect-video bg-muted/50 overflow-hidden">
            <Image src={project.image_url || "/placeholder.svg"} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="space-y-2">
            <h4 className="text-xl font-bold tracking-tight text-foreground/90">{project.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full bg-white/5 border-white/5 text-[9px] uppercase tracking-tighter">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3 pt-4 mt-auto">
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} className="flex-1 rounded-full border border-white/10 glass hover:bg-white/10 hover:text-foreground font-bold transition-all">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="flex-1 rounded-full shadow-lg shadow-destructive/20 font-bold transition-all">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ProjectDialog open={editOpen} onOpenChange={setEditOpen} project={project} onSuccess={onUpdated} />
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        projectId={project.id}
        projectTitle={project.title}
        onDeleted={onDeleted}
      />
    </>
  )
}

