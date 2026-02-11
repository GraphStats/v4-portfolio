import { createClient } from "@/lib/supabase/server"
import type { Project } from "@/lib/types"
import { PortfolioContent } from "@/components/portfolio-content"
import { TechStack } from "@/components/tech-stack"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollButton } from "@/components/scroll-button"
import Link from "next/link"
import { Lock, ArrowRight, Sparkles } from "lucide-react"
import { getSiteSettings } from "@/lib/actions"
import { normalizeDeveloperName } from "@/lib/site-settings"

export default async function HomePage() {
  const supabase = await createClient()
  const { developerName } = await getSiteSettings()
  const brand = normalizeDeveloperName(developerName)

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-effect sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
            {brand}
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hover-lift">
              <Link href="/admin">
                <Lock className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,144,226,0.15),transparent_50%)]" />

        <div className="container relative mx-auto px-4 text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary animate-scale-in">
            <Sparkles className="h-4 w-4" />
            <span>Last Update: New design</span>
          </div>

          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-balance leading-tight">
            Creative Developer
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              & Designer
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Crafting exceptional digital experiences with modern technologies.
            <br />
            Transforming ideas into elegant, performant solutions.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <ScrollButton targetId="projects" size="lg" className="hover-lift group">
              View Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </ScrollButton>
            <ScrollButton targetId="tech-stack" variant="outline" className="hover-lift bg-transparent">
              Tech Stack
            </ScrollButton>
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-balance">Featured Projects</h3>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Explore my latest work and discover the technologies behind each project
            </p>
          </div>

          <PortfolioContent projects={(projects as Project[]) || []} />
        </div>
      </section>

      <TechStack />

      <footer className="border-t border-border/50 py-12 mt-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">&copy; {new Date().getFullYear()} {brand}. Crafted with passion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
