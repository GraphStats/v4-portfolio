"use client"

import { Card } from "@/components/ui/card"
import { Code2, Cloud, Server, Terminal, FileCode, Laptop, type LucideIcon } from "lucide-react"

interface TechItem {
  name: string
  icon: LucideIcon
  color: string
}

const techStack: TechItem[] = [
  { name: "JavaScript", icon: Code2, color: "text-yellow-500" },
  { name: "TypeScript", icon: FileCode, color: "text-blue-500" },
  { name: "Node.js", icon: Server, color: "text-green-600" },
  { name: "Python", icon: Terminal, color: "text-blue-400" },
  { name: "Java", icon: Code2, color: "text-red-500" },
  { name: "CSS", icon: FileCode, color: "text-purple-500" },
  { name: "Tailwind CSS", icon: Code2, color: "text-cyan-500" },
  { name: "AWS", icon: Cloud, color: "text-orange-500" },
  { name: "Google Cloud", icon: Cloud, color: "text-blue-600" },
  { name: "Windows", icon: Laptop, color: "text-blue-500" },
  { name: "Linux", icon: Terminal, color: "text-yellow-600" },
]

export function TechStack() {
  return (
    <section id="tech-stack" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-3xl font-bold mb-4 text-balance">Ma Stack Technique</h3>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Les technologies et outils que j'utilise pour créer des applications modernes et performantes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {techStack.map((tech, index) => {
            const Icon = tech.icon
            return (
              <Card
                key={tech.name}
                className="p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in-up group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`h-8 w-8 ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                <span className="font-medium text-sm text-center">{tech.name}</span>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
