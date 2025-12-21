"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, Home, UserPlus, LayoutDashboard, Database, Shield } from "lucide-react"
import { AdminProjectCard } from "@/components/admin-project-card"
import { ProjectDialog } from "@/components/project-dialog"
import { AdminDialog } from "@/components/admin-dialog"
import { AdminCard } from "@/components/admin-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import type { Project, Admin } from "@/lib/types"
import { logoutAdmin } from "@/lib/auth"
import { getAdmins } from "@/lib/actions"
import { getFirestoreClient } from "@/lib/firebase/client"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [addAdminOpen, setAddAdminOpen] = useState(false)

  const fetchProjects = async () => {
    const db = getFirestoreClient()
    const projectsQuery = query(collection(db, "portfolio"), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(projectsQuery)

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[]

    setProjects(data)
    setIsLoading(false)
  }

  const fetchAdmins = async () => {
    const result = await getAdmins()
    if (result.success) {
      setAdmins(result.data as Admin[])
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchAdmins()
  }, [])

  const handleProjectDeleted = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
  }

  const handleProjectUpdated = () => {
    fetchProjects()
  }

  const handleAdminDeleted = () => {
    fetchAdmins()
  }

  const handleLogout = async () => {
    await logoutAdmin()
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary transition-colors duration-500 font-sans">
      <div className="noise-overlay" />

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gradient hidden sm:block">Control Center</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex rounded-full border border-white/10 glass hover:bg-white/10 hover:text-foreground transition-all">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Live Site
              </Link>
            </Button>
            <ThemeToggle />
            <Button onClick={handleLogout} variant="destructive" size="sm" className="rounded-full shadow-lg shadow-destructive/20">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pt-32 pb-24 container mx-auto px-6 space-y-20">
        {/* Projects Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <Database className="h-4 w-4" />
                Portfolio Management
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">MANAGE PROJECTS</h2>
              <p className="text-muted-foreground font-medium max-w-xl">
                Update your latest achievements, showcase your skills, and keep your professional presence sharp.
              </p>
            </div>
            <Button onClick={() => setAddProjectOpen(true)} className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 group self-start md:self-auto">
              <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              New Project Entry
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-3xl glass border-white/5 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="glass p-20 rounded-[3.5rem] border-white/5 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center text-muted-foreground">
                <Database className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold">No projects archived</p>
                <p className="text-muted-foreground">Deploy your first project to start building your legacy.</p>
              </div>
              <Button onClick={() => setAddProjectOpen(true)} variant="outline" className="rounded-full glass border-white/10">
                <Plus className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <AdminProjectCard
                  key={project.id}
                  project={project}
                  onDeleted={handleProjectDeleted}
                  onUpdated={handleProjectUpdated}
                />
              ))}
            </div>
          )}
        </section>

        <Separator className="bg-white/5" />

        {/* Admins Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <Shield className="h-4 w-4" />
                Access Control
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">PLATFORM ADMINS</h2>
              <p className="text-muted-foreground font-medium max-w-xl">
                Secure your dashboard by managing authorized personnel with access to the core portfolio data.
              </p>
            </div>
            <Button onClick={() => setAddAdminOpen(true)} variant="ghost" className="rounded-2xl h-14 px-8 border border-white/10 glass hover:bg-white/10 hover:text-foreground self-start md:self-auto transition-all">
              <UserPlus className="mr-2 h-5 w-5" />
              Register Admin
            </Button>
          </div>

          {admins.length === 0 ? (
            <div className="glass p-20 rounded-[3.5rem] border-white/5 text-center">
              <p className="text-muted-foreground font-medium italic">Scanning for authorized accounts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} onDeleted={handleAdminDeleted} />
              ))}
            </div>
          )}
        </section>
      </main>

      <ProjectDialog open={addProjectOpen} onOpenChange={setAddProjectOpen} onSuccess={fetchProjects} />
      <AdminDialog open={addAdminOpen} onOpenChange={setAddAdminOpen} onSuccess={fetchAdmins} />
    </div>
  )
}

