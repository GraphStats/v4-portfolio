"use client"

import { useState } from "react"
import type { Project } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
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
      <Card className="overflow-hidden flex flex-col h-full">
        {project.image_url && (
          <div className="relative w-full h-48 bg-muted">
            <Image src={project.image_url || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-balance">{project.title}</CardTitle>
          <CardDescription className="text-pretty line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="flex-1">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="flex-1">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>

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
