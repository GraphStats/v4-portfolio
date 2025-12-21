import type React from "react"
import { getFirestoreServer } from "@/lib/firebase/server"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import type { Project } from "@/lib/types"
import { PortfolioContent } from "@/components/portfolio-content"
import { TechStack } from "@/components/tech-stack"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollButton } from "@/components/scroll-button"
import Link from "next/link"
import { Lock, ArrowRight, Sparkles, Code2, Globe, Command, ChevronDown } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let projects: Project[] = []
  let fetchError = false

  try {
    const db = await getFirestoreServer()
    const projectsQuery = query(collection(db, "portfolio"), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(projectsQuery)

    projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[]
  } catch (e) {
    console.error("Firebase config or connection error:", e)
    fetchError = true
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans">
      <div className="noise-overlay" />

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <Command className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient">
              Drayko
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <ScrollButton targetId="projects" variant="link" className="p-0 h-auto hover:text-foreground transition-colors">Projects</ScrollButton>
            <ScrollButton targetId="tech-stack" variant="link" className="p-0 h-auto hover:text-foreground transition-colors">Tech</ScrollButton>
            <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex rounded-full glass border border-white/10 hover:bg-white/10 hover:text-foreground transition-all">
              <Link href="/admin">
                <Lock className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="container px-6 py-24 mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-sm font-medium animate-fade-in text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Fix database bug and new interface (v3!)</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-[calc(-0.05em)] leading-[0.85] animate-fade-in-up font-display">
                <span className="text-foreground/90 block">CREATIVE</span>
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 via-cyan-400 to-blue-600 bg-clip-text text-transparent italic inline-block pr-12 text-glow drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                  DEVELOPER.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-medium" style={{ animationDelay: "0.1s" }}>
                I build high-performance web applications that bridge the gap between
                <span className="text-foreground"> design </span> and
                <span className="text-foreground"> engineering</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <ScrollButton targetId="projects" size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 group w-full sm:w-auto transition-all">
                Discover Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ScrollButton>
              <ScrollButton targetId="tech-stack" variant="ghost" size="lg" className="rounded-full px-8 border border-white/10 glass hover:bg-white/10 hover:text-foreground w-full sm:w-auto transition-all">
                Explore Tech
              </ScrollButton>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
            <ChevronDown className="h-8 w-8 text-primary text-glow" />
          </div>
        </section>

        <section id="projects" className="py-32 bg-muted/30 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="text-primary font-bold tracking-widest text-sm uppercase">Selected Works</div>
                <h3 className="text-5xl md:text-6xl font-bold tracking-tight">FEATURED PROJECTS</h3>
                <p className="text-lg text-muted-foreground font-medium">
                  A collection of digital experiences focusing on performance,
                  scalability, and user-centric design.
                </p>
              </div>

              {fetchError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive glass">
                  <p className="font-semibold flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Database Error
                  </p>
                  <p className="text-sm opacity-80">Check your Firebase configuration settings.</p>
                </div>
              )}
            </div>

            <PortfolioContent projects={projects} />
          </div>
        </section>

        <TechStack />

        <section id="contact" className="py-32">
          <div className="container mx-auto px-6 text-center">
            <div className="glass p-16 rounded-[3rem] border-white/10 space-y-8 mesh-bg relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight">LET'S BUILD SOMETHING</h3>
                <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
                  Always open for new opportunities and collaborations.
                  Let's bring your vision to life.
                </p>
                <div className="pt-8">
                  <Button size="lg" className="rounded-full px-12 h-16 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95">
                    Start a Conversation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <Command className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">Drayko</span>
              </div>
              <p className="text-muted-foreground font-medium max-w-xs">
                Crafting high-quality digital products with focus on modern aesthetics and performance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 col-span-2">
              <div className="space-y-4">
                <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Explore</h5>
                <ul className="space-y-3 text-muted-foreground font-medium">
                  <li><ScrollButton targetId="projects" variant="link" className="p-0 h-auto hover:text-foreground">Projects</ScrollButton></li>
                  <li><ScrollButton targetId="tech-stack" variant="link" className="p-0 h-auto hover:text-foreground">Tech Stack</ScrollButton></li>
                  <li><Link href="/admin" className="hover:text-foreground">Admin Access</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Social</h5>
                <ul className="space-y-3 text-muted-foreground font-medium">
                  <li><Link href="#" className="hover:text-foreground transition-all flex items-center gap-2"><Globe className="h-4 w-4" /> GitHub</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-all flex items-center gap-2"><Globe className="h-4 w-4" /> LinkedIn</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-all flex items-center gap-2"><Globe className="h-4 w-4" /> Twitter</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground font-medium gap-4">
            <p>&copy; {new Date().getFullYear()} Drayko. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

