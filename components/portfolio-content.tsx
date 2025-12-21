"use client"

import { useState, useMemo } from "react"
import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"
import { TagFilter } from "@/components/tag-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
          <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-focus-within:bg-primary/30 transition-all duration-700 opacity-0 group-focus-within:opacity-100" />
          <div className="relative flex items-center">
            <Search className="absolute left-5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <Input
              type="text"
              placeholder="Search by name, tech, or keywords..."
              className="pl-14 pr-12 h-16 bg-background/40 backdrop-blur-2xl border-white/10 rounded-[2rem] focus:ring-primary/20 focus:border-primary/40 transition-all duration-500 text-lg font-medium shadow-2xl shadow-black/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <TagFilter tags={allTags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />
          <div className="text-sm font-medium text-muted-foreground animate-fade-in">
            Showing <span className="text-primary">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="h-full animate-fade-in-up"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-32 glass rounded-[3rem] border-white/5 animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-muted mb-8 text-muted-foreground shadow-inner">
              <Search className="h-12 w-12 opacity-20" />
            </div>
            <h4 className="text-3xl font-bold mb-4 tracking-tight">No projects found</h4>
            <p className="text-muted-foreground max-w-sm mx-auto text-lg">
              We couldn't find any projects matching your search criteria. Try a different keyword or filter.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedTag(null)
              }}
              className="mt-10 rounded-full px-8 glass border-white/10 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Clear all filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
