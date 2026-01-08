import type React from "react"
import { getFirestoreServer } from "@/lib/firebase/server"
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore"
import type { Project, SiteUpdate } from "@/lib/types"
import { PortfolioContent } from "@/components/portfolio-content"
import { TechStack } from "@/components/tech-stack"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollButton } from "@/components/scroll-button"
import Link from "next/link"
import { Lock, ArrowRight, Sparkles, Code2, Globe, Command, ChevronDown, Github, Gitlab, MessageSquare, Rocket, Timer } from "lucide-react"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"

export const revalidate = 60

export default async function HomePage() {
  // Maintenance check
  const { isMaintenance } = await getMaintenanceMode()
  if (isMaintenance) {
    redirect("/maintenance")
  }

  let projects: Project[] = []
  let fetchError = false
  let updateData: SiteUpdate | null = null

  try {
    const db = await getFirestoreServer()
    const projectsQuery = query(collection(db, "portfolio"), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(projectsQuery)

    projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[]

    // Fetch site update info for the badge
    const updateDocRef = doc(db, "update-p", "main")
    const updateDocSnap = await getDoc(updateDocRef)
    if (updateDocSnap.exists()) {
      updateData = updateDocSnap.data() as SiteUpdate
    }
  } catch (e) {
    console.error("Firebase config or connection error:", e)
    fetchError = true
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans">
      <div className="noise-overlay" />

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] animate-float" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
              <Command className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient">
              Drayko
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <ScrollButton targetId="projects" variant="ghost" className="p-0 h-auto text-muted-foreground hover:bg-transparent hover:text-foreground transition-all hover:translate-y-[-2px]">Projects</ScrollButton>
            <ScrollButton targetId="tech-stack" variant="ghost" className="p-0 h-auto text-muted-foreground hover:bg-transparent hover:text-foreground transition-all hover:translate-y-[-2px]">Tech</ScrollButton>
            <Link href="/about" className="hover:text-foreground transition-all hover:translate-y-[-2px]">About</Link>
            <Link href="#contact" className="hover:text-foreground transition-all hover:translate-y-[-2px]">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex rounded-full glass border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
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
            <div className="reveal-up stagger-1">
              <Link
                href="/update"
                className="inline-flex items-center px-4 py-2 rounded-full glass border-white/10 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all group overflow-hidden whitespace-nowrap hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]"
              >
                <style dangerouslySetInnerHTML={{
                  __html: `
                  @keyframes draw-tip {
                    from { stroke-dashoffset: 20; }
                    to { stroke-dashoffset: 0; }
                  }
                  .arrow-tip {
                    stroke-dasharray: 20;
                    stroke-dashoffset: 20;
                    transition: stroke-dashoffset 0.3s ease-out;
                  }
                  .group:hover .arrow-tip {
                    animation: draw-tip 0.3s ease-out 0.2s forwards;
                  }
                  .arrow-bar {
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s ease-out;
                  }
                  .group:hover .arrow-bar {
                    transform: scaleX(1);
                  }
                `}} />
                <Sparkles className="h-4 w-4 text-primary animate-pulse mr-2 flex-none" />
                <span className="transition-colors duration-300">
                  Latest update: {(updateData?.latest_update_text || "Fix database bug and new interface (v3!)").trim()}
                </span>
                <div className="flex items-center w-0 group-hover:w-6 transition-all duration-300 ease-out overflow-hidden flex-none group-hover:ml-2">
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="flex-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <path
                      d="M1 6H16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="arrow-bar shadow-glow shadow-primary/20"
                    />
                    <path
                      d="M11 1L16 6L11 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="arrow-tip shadow-glow shadow-primary/20"
                    />
                  </svg>
                </div>
              </Link>
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <ScrollButton targetId="projects" size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 group w-full sm:w-auto transition-all text-sm font-bold uppercase tracking-widest">
                Discover Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ScrollButton>
              <ScrollButton targetId="tech-stack" variant="ghost" size="lg" className="rounded-full px-8 border border-white/10 glass hover:bg-white/10 hover:text-foreground w-full sm:w-auto transition-all text-sm font-bold uppercase tracking-widest">
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
                <div className="text-primary font-bold tracking-widest text-sm uppercase reveal-up">Selected Works</div>
                <h3 className="text-5xl md:text-6xl font-bold tracking-tight reveal-up stagger-1">FEATURED PROJECTS</h3>
                <p className="text-lg text-muted-foreground font-medium reveal-up stagger-2">
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
            <div className="glass p-16 rounded-[3rem] border-white/10 space-y-8 mesh-bg relative overflow-hidden reveal-up perspective-card">
              <div className="relative z-10 space-y-4">
                <h3 className="text-4xl md:text-6xl font-bold tracking-tight reveal-up stagger-1">LET'S BUILD SOMETHING</h3>
                <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto reveal-up stagger-2">
                  Always open for new opportunities and collaborations.
                  Let's bring your vision to life.
                </p>
                <div className="pt-8 reveal-up stagger-3">
                  <Button asChild size="lg" className="rounded-full px-12 h-16 text-lg bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 active:scale-95 shadow-2xl hover:shadow-primary/20">
                    <Link href="/contact">
                      Start a Conversation
                    </Link>
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
                  <li className="transition-transform hover:translate-x-1"><ScrollButton targetId="projects" variant="link" className="p-0 h-auto hover:text-foreground">Projects</ScrollButton></li>
                  <li className="transition-transform hover:translate-x-1"><ScrollButton targetId="tech-stack" variant="link" className="p-0 h-auto hover:text-foreground">Tech Stack</ScrollButton></li>
                  <li className="transition-transform hover:translate-x-1"><Link href="/about" className="hover:text-foreground">About Me</Link></li>
                  <li className="transition-transform hover:translate-x-1"><Link href="/update" className="hover:text-foreground">Site Updates</Link></li>
                  <li className="transition-transform hover:translate-x-1"><Link href="/admin" className="hover:text-foreground">Admin Access</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Social</h5>
                <ul className="space-y-3 text-muted-foreground font-medium">
                  <li className="transition-transform hover:translate-x-1"><Link href="https://github.com/GraphStats" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-all flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</Link></li>
                  <li className="transition-transform hover:translate-x-1"><Link href="https://gitlab.com/graphstats.pro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-all flex items-center gap-2"><Gitlab className="h-4 w-4" /> GitLab</Link></li>
                  <li className="transition-transform hover:translate-x-1"><Link href="/contact" className="hover:text-foreground transition-all flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground font-medium gap-4">
            <p>&copy; 2025 - 2026 Drayko. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
