"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, Home, UserPlus, LayoutDashboard, Database, Shield, History as HistoryIcon, Activity } from "lucide-react"
import { AdminProjectCard } from "@/components/admin-project-card"
import { ProjectDialog } from "@/components/project-dialog"
import { AdminDialog } from "@/components/admin-dialog"
import { AdminCard } from "@/components/admin-card"
import { AdminStats } from "@/components/admin-stats"
import { AdminMessages } from "@/components/admin-messages"
import { ThemeToggle } from "@/components/theme-toggle"
import { UpdateDialog } from "@/components/update-dialog"
import { BadgeDialog } from "@/components/badge-dialog"
import { Separator } from "@/components/ui/separator"
import type { Project, Admin, SiteUpdate } from "@/lib/types"
import { logoutAdmin } from "@/lib/auth"
import { getAdmins, getMaintenanceMode, getAvailability, getV4Mode } from "@/lib/actions"
import { MaintenanceToggle } from "@/components/maintenance-toggle"
import { V4Toggle } from "@/components/v4-toggle"
import { AvailabilityToggle } from "@/components/availability-toggle"
import { getFirestoreClient } from "@/lib/firebase/client"
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore"
import Link from "next/link"
import { Sparkles, Rocket } from "lucide-react"

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState<SiteUpdate | null>(null)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState("")
  const [maintenanceProgress, setMaintenanceProgress] = useState(0)
  const [v4Mode, setV4Mode] = useState(false)
  const [v4Message, setV4Message] = useState("")
  const [v4Progress, setV4Progress] = useState(0)
  const [isAvailable, setIsAvailable] = useState(true)

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

  const fetchUpdateData = async () => {
    const db = getFirestoreClient()
    const docRef = doc(db, "update-p", "main")
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setUpdateData(docSnap.data() as SiteUpdate)
    }
  }

  const fetchMaintenanceMode = async () => {
    const result = await getMaintenanceMode()
    if (result.success) {
      setMaintenanceMode(result.isMaintenance)
      setMaintenanceMessage(result.message || "")
      setMaintenanceProgress(result.progress || 0)
    }
  }

  const fetchV4Mode = async () => {
    const result = await getV4Mode()
    if (result.success) {
      setV4Mode(result.isV4Mode)
      setV4Message(result.message || "")
      setV4Progress(result.progress || 0)
    }
  }

  const fetchAvailability = async () => {
    const result = await getAvailability()
    if (result.success && result.isAvailable !== undefined) {
      setIsAvailable(result.isAvailable)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchAdmins()
    fetchUpdateData()
    fetchMaintenanceMode()
    fetchV4Mode()
    fetchAvailability()
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


        {/* Analytics Section */}
        <section className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
              <Activity className="h-4 w-4" />
              Performance Overview
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">NETWORK PULSE</h2>
            <p className="text-muted-foreground font-medium max-w-xl">
              Real-time insights into traffic, security, and performance across the global edge network.
            </p>
          </div>
          <AdminStats />
        </section>


        <Separator className="bg-white/5" />


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

        {/* Messages Section */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <Activity className="h-4 w-4" />
                Communications
              </div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">MESSAGES</h2>
              </div>
              <p className="text-muted-foreground font-medium max-w-xl">
                Gérez les demandes de contact entrantes et répondez aux opportunités.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <AvailabilityToggle initialState={isAvailable} />
            </div>
          </div>

          <AdminMessages />
        </section>

        <Separator className="bg-white/5" />

        {/* Hero Communication Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <Sparkles className="h-4 w-4" />
                Hero Communications
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">HOMEPAGE BADGE</h2>
              <p className="text-muted-foreground font-medium max-w-xl">
                Update the headline message that visitors see first when landing on your portfolio.
              </p>
            </div>
            <Button
              onClick={() => setBadgeDialogOpen(true)}
              className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 transition-all self-start md:self-auto"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Update Headline
            </Button>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Sparkles className="h-8 w-8 text-primary shadow-glow shadow-primary/20" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Current Live Badge Content</p>
                <p className="text-xl md:text-3xl font-bold text-foreground/90 italic">
                  "{updateData?.latest_update_text || "Fix database bug and new interface (v3!)"}"
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-white/5" />

        {/* Site Updates Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <HistoryIcon className="h-4 w-4" />
                Evolution & Roadmap
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">SITE SYSTEM UPDATES</h2>
              <p className="text-muted-foreground font-medium max-w-xl">
                Coordinate the release cycle, document breaking changes, and announce future capabilities.
              </p>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
                <HistoryIcon className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Historical Records</p>
                <p className="text-xl font-bold text-foreground/90 font-sans">
                  Track the evolution of the platform with detailed version logs.
                </p>
              </div>
            </div>
            <Button onClick={() => setUpdateDialogOpen(true)} variant="outline" className="rounded-2xl h-14 px-8 glass border-white/10 hover:bg-white/10 hover:text-foreground transition-all shrink-0">
              <HistoryIcon className="mr-2 h-5 w-5" />
              Manage Ecosystem Logs
            </Button>
          </div>
        </section>

        <Separator className="bg-white/5" />

        {/* Site Status Section */}
        <section className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
              <Shield className="h-4 w-4" />
              Availability Control
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">PLATFORM STATUS</h2>
            <p className="text-muted-foreground font-medium max-w-xl">
              Manage global site states. Activate maintenance mode or preview upcoming version announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.02] flex items-center justify-center">
              <MaintenanceToggle initialState={maintenanceMode} initialMessage={maintenanceMessage} initialProgress={maintenanceProgress} onUpdated={fetchMaintenanceMode} />
            </div>

            <div className="glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.02] flex items-center justify-center">
              <V4Toggle initialState={v4Mode} initialMessage={v4Message} initialProgress={v4Progress} onUpdated={fetchV4Mode} />
            </div>
          </div>
        </section>

        <Separator className="bg-white/5" />

        {/* Special Themes Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <Sparkles className="h-4 w-4" />
                Thèmes Festifs
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">THÈMES SPÉCIAUX</h2>
              <p className="text-muted-foreground font-medium max-w-xl">
                Configurez les périodes d'activation des thèmes festifs pour créer des expériences uniques.
              </p>
            </div>
            <Button asChild className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 self-start md:self-auto transition-all">
              <Link href="/admin/special-themes">
                <Sparkles className="mr-2 h-5 w-5" />
                Gérer les Thèmes
              </Link>
            </Button>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Sparkles className="h-8 w-8 text-primary shadow-glow shadow-primary/20" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Thème Actuel</p>
                <p className="text-xl md:text-3xl font-bold text-foreground/90 italic">
                  Nouvel An 2026 (20 déc - 2 jan)
                </p>
              </div>
            </div>
          </div>
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
      <UpdateDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen} onSuccess={fetchUpdateData} />
      <BadgeDialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen} onSuccess={fetchUpdateData} />
    </div>
  )
}
