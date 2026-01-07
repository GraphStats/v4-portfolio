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
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inDev, setInDev] = useState(project?.in_development || false)
  const [isCompleted, setIsCompleted] = useState(project?.is_completed || false)
  const [isArchived, setIsArchived] = useState(project?.is_archived || false)
  const [progress, setProgress] = useState(project?.development_progress || 0)
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

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="in_development">In Development Mode</Label>
            <p className="text-sm text-muted-foreground">
              Adds a construction overlay and grayscale filter to the project card.
            </p>
          </div>
          <Switch
            id="in_development_toggle"
            defaultChecked={project?.in_development}
            onCheckedChange={(checked) => setInDev(checked)}
          />
          <input type="hidden" name="in_development" value={inDev.toString()} />
        </div>

        {inDev && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <Label>Project Progress</Label>
              <span className="text-primary">{progress}%</span>
            </div>
            <Slider
              defaultValue={[progress]}
              max={100}
              step={1}
              onValueChange={(val) => setProgress(val[0])}
            />
            <input type="hidden" name="development_progress" value={progress} />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="space-y-0.5">
            <Label htmlFor="is_completed">Project Finished</Label>
            <p className="text-sm text-muted-foreground">
              Adds a completion badge, trophy icon, and vibrant colors.
            </p>
          </div>
          <Switch
            id="is_completed_toggle"
            defaultChecked={project?.is_completed}
            onCheckedChange={(checked) => setIsCompleted(checked)}
          />
          <input type="hidden" name="is_completed" value={isCompleted.toString()} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="space-y-0.5">
            <Label htmlFor="is_archived">Archive Project</Label>
            <p className="text-sm text-muted-foreground">
              Marks the project as stable/legacy with an indigo theme.
            </p>
          </div>
          <Switch
            id="is_archived_toggle"
            defaultChecked={project?.is_archived}
            onCheckedChange={(checked) => setIsArchived(checked)}
          />
          <input type="hidden" name="is_archived" value={isArchived.toString()} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  )
}
