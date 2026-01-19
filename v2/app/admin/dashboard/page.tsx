"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, Home, UserPlus } from "lucide-react"
import { AdminProjectCard } from "@/components/admin-project-card"
import { ProjectDialog } from "@/components/project-dialog"
import { AdminDialog } from "@/components/admin-dialog"
import { AdminCard } from "@/components/admin-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import type { Project, Admin } from "@/lib/types"
import { logoutAdmin } from "@/lib/auth"
import { getAdmins } from "@/lib/actions"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [addAdminOpen, setAddAdminOpen] = useState(false)

  const fetchProjects = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
    } else {
      setProjects((data as Project[]) || [])
    }

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => setAddProjectOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Projects Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Manage Projects</h2>
            <p className="text-muted-foreground">Add, edit, or remove projects from your portfolio.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet. Add your first project to get started.</p>
              <Button onClick={() => setAddProjectOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
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
        </div>

        <Separator className="my-8" />

        {/* Admins Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Manage Admins</h2>
              <p className="text-muted-foreground">Add or remove admin accounts.</p>
            </div>
            <Button onClick={() => setAddAdminOpen(true)} size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </div>

          {admins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No admins found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} onDeleted={handleAdminDeleted} />
              ))}
            </div>
          )}
        </div>
      </main>

      <ProjectDialog open={addProjectOpen} onOpenChange={setAddProjectOpen} onSuccess={fetchProjects} />
      <AdminDialog open={addAdminOpen} onOpenChange={setAddAdminOpen} onSuccess={fetchAdmins} />
    </div>
  )
}
