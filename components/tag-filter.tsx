"use client"

import { cn } from "@/lib/utils"

interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-8">
      <button
        onClick={() => onTagSelect(null)}
        className={cn(
          "px-6 py-2 rounded-full text-sm font-bold tracking-tight transition-all duration-300 border",
          selectedTag === null
            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
            : "glass border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
        )}
      >
        All Works
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold tracking-tight transition-all duration-300 border uppercase text-[11px] tracking-widest",
            selectedTag === tag
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
              : "glass border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

