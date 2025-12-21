"use client"

import { useState, useMemo } from "react"
import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"
import { TagFilter } from "@/components/tag-filter"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface PortfolioContentProps {
  projects: Project[]
}

export function PortfolioContent({ projects }: PortfolioContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [projects])

  // Filter projects based on selected tag and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag = !selectedTag || project.tags.includes(selectedTag)
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesTag && matchesSearch
    })
  }, [projects, selectedTag, searchQuery])

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-focus-within:bg-primary/30 transition-all duration-500 opacity-0 group-focus-within:opacity-100" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search projects by name, tech or description..."
              className="pl-12 pr-12 h-14 bg-background/50 backdrop-blur-xl border-white/10 rounded-2xl focus:ring-primary/20 focus:border-primary/30 transition-all text-lg font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <TagFilter tags={allTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="h-full animate-fade-in-up"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-24 glass rounded-[3rem] border-white/5 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-muted mb-6 text-muted-foreground">
            <Search className="h-10 w-10 opacity-20" />
          </div>
          <h4 className="text-2xl font-bold mb-2">No projects found</h4>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedTag(null)
            }}
            className="mt-8 text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
