export interface StatusComponent {
  id: string
  name: string
  group_name?: string
  current_status?: string
}

export interface StatusIncident {
  id: string
  name: string
  status?: string
  url?: string
  current_worst_impact?: string
  affected_components?: StatusComponent[]
  last_update_at?: string
  last_update_message?: string
}

export interface StatusSummary {
  page_title?: string
  page_url?: string
  ongoing_incidents?: StatusIncident[]
  in_progress_maintenances?: Array<{
    id?: string
    name?: string
    status?: string
    url?: string
  }>
  scheduled_maintenances?: Array<{
    id?: string
    name?: string
    status?: string
    url?: string
  }>
}

const STATUS_SUMMARY_URL = "https://status.drayko.xyz/api/v1/summary"

export async function getStatusSummary(): Promise<StatusSummary | null> {
  try {
    const response = await fetch(STATUS_SUMMARY_URL, {
      cache: "no-store",
      next: { revalidate: 30 },
    })
    if (!response.ok) return null
    return (await response.json()) as StatusSummary
  } catch (error) {
    console.error("status summary fetch failed:", error)
    return null
  }
}

function isDegradedOrDown(status?: string): boolean {
  if (!status) return false
  const normalized = status.toLowerCase()
  return normalized !== "operational" && normalized !== "up"
}

export function getActiveIncident(summary: StatusSummary | null): StatusIncident | null {
  if (!summary?.ongoing_incidents?.length) return null

  return (
    summary.ongoing_incidents.find((incident) => {
      if (isDegradedOrDown(incident.status)) return true
      return (incident.affected_components ?? []).some((component) =>
        isDegradedOrDown(component.current_status)
      )
    }) ?? null
  )
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function getIncidentProjectMarkers(incident: StatusIncident | null): string[] {
  if (!incident) return []

  const markers = new Set<string>()

  for (const component of incident.affected_components ?? []) {
    const platformName = normalizeText(component.name || "")
    if (!platformName) continue

    // Keep the full platform name (e.g. "clerk", "cloudflare workers").
    markers.add(platformName)

    // Also keep specific tokens from the platform name only.
    const tokens = platformName
      .split(" ")
      .filter((token) => token.length >= 4)
    for (const token of tokens) markers.add(token)

    // Keep group_name as a strict marker (project identity), without tokenizing it.
    const groupName = normalizeText(component.group_name || "")
    if (groupName) {
      markers.add(groupName)
    }
  }

  return Array.from(markers)
}
