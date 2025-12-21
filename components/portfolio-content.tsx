"use client"

import { useState, useMemo } from "react"
import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"
import { TagFilter } from "@/components/tag-filter"

interface PortfolioContentProps {
  projects: Project[]
}

export function PortfolioContent({ projects }: PortfolioContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [projects])

  // Filter projects based on selected tag
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects
    return projects.filter((project) => project.tags.includes(selectedTag))
  }, [projects, selectedTag])

  return (
    <div className="space-y-12">
      <TagFilter tags={allTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div key={project.id} style={{ animationDelay: `${index * 150}ms` }} className="h-full">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found with this tag.</p>
        </div>
      )}
    </div>
  )
}
