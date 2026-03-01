import type React from "react"
import { getFirestoreServer } from "@/lib/firebase/server"
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore"
import type { Project, SiteUpdate } from "@/lib/types"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"
import { unstable_cache } from "next/cache"
import dynamicImport from "next/dynamic"
import { getActiveIncident, getIncidentLevel, getIncidentProjectMarkers, getStatusSummary, type SystemStatusLevel } from "@/lib/status-summary"

import { V4Navbar } from "@/components/v4/V4Navbar"
import { V4Hero } from "@/components/v4/V4Hero"

const V4Projects = dynamicImport(() =>
  import("@/components/v4/V4Projects").then((mod) => mod.V4Projects)
)
const V4TechStack = dynamicImport(() =>
  import("@/components/v4/V4TechStack").then((mod) => mod.V4TechStack)
)
const V4Contact = dynamicImport(() =>
  import("@/components/v4/V4Contact").then((mod) => mod.V4Contact)
)
const V4Footer = dynamicImport(() =>
  import("@/components/v4/V4Footer").then((mod) => mod.V4Footer)
)
const V4Dock = dynamicImport(() =>
  import("@/components/v4/V4Dock").then((mod) => mod.V4Dock)
)

export const revalidate = 120

const getMaintenanceModeCached = unstable_cache(
  async () => getMaintenanceMode(),
  ["maintenance-mode"],
  { revalidate: 30, tags: ["settings-general"] }
)

const getHomePageData = unstable_cache(
  async () => {
    const [statusSummary, db] = await Promise.all([getStatusSummary(), getFirestoreServer()])
    const projectsQuery = query(collection(db, "portfolio"), orderBy("created_at", "desc"))
    const [querySnapshot, updateDocSnap] = await Promise.all([
      getDocs(projectsQuery),
      getDoc(doc(db, "update-p", "main")),
    ])

    const projects = querySnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Project[]

    const updateData = updateDocSnap.exists() ? (updateDocSnap.data() as SiteUpdate) : null
    return { statusSummary, projects, updateData }
  },
  ["home-page-data"],
  { revalidate: 120, tags: ["home-page-data", "projects", "status-summary", "settings-general"] }
)

export default async function HomePage() {
  const { isMaintenance } = await getMaintenanceModeCached()
  if (isMaintenance) {
    redirect("/maintenance")
  }

  let projects: Project[] = []
  let badgeText = "ALL SYSTEMS OPERATIONAL"
  let badgeHref = "/status"
  let badgeStatus: SystemStatusLevel = "operational"

  const { statusSummary, projects: cachedProjects, updateData } = await getHomePageData()
  const activeIncident = getActiveIncident(statusSummary)
  const incidentLevel = getIncidentLevel(activeIncident)
  const incidentProjectMarkers = getIncidentProjectMarkers(activeIncident)
  badgeStatus = incidentLevel
  if (incidentLevel === "outage") badgeText = "OUTAGE NOW"
  if (incidentLevel === "degraded") badgeText = "DEGRADED PERFORMANCE"

  projects = cachedProjects
  if (incidentLevel === "operational" && updateData?.latest_update_text) {
    badgeText = updateData.latest_update_text
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary font-sans scroll-smooth">
      <div className="noise-v4" />
      <div className="mesh-v4 fixed inset-0 pointer-events-none" />

      <V4Navbar />

      <main className="relative z-10">
        <V4Hero badgeText={badgeText} badgeHref={badgeHref} badgeStatus={badgeStatus} />

        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <V4Projects projects={projects} incidentProjectMarkers={incidentProjectMarkers} />
        </div>
        <V4TechStack />

        <V4Contact />

        <V4Footer />
      </main>

      <V4Dock />
    </div >
  )
}
