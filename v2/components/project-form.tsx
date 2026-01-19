"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/lib/types"
import { createProject, updateProject } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = project ? await updateProject(project.id, formData) : await createProject(formData)

      if (!result.success) {
        setError(result.error || "An error occurred")
        setIsLoading(false)
        return
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" defaultValue={project?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={project?.description} required rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={project?.image_url || ""}
          placeholder="/placeholder.svg?height=400&width=600"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated) *</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={project?.tags.join(", ")}
          placeholder="React, Next.js, TypeScript"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_url">Project URL</Label>
        <Input
          id="project_url"
          name="project_url"
          type="url"
          defaultValue={project?.project_url || ""}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input
          id="github_url"
          name="github_url"
          type="url"
          defaultValue={project?.github_url || ""}
          placeholder="https://github.com/username/repo"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  )
}
