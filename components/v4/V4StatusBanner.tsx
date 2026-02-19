"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle } from "lucide-react"

type StatusSummary = {
  ongoing_incidents?: Array<{
    id: string
    name: string
    status?: string
    url?: string
    affected_components?: Array<{
      id: string
      name: string
      group_name?: string
      current_status?: string
    }>
    last_update_message?: string
  }>
}

const SUMMARY_URL = "https://status.drayko.xyz/api/v1/summary"
const REFRESH_INTERVAL_MS = 60_000

function isDegradedOrDown(status?: string) {
  if (!status) return false
  const normalized = status.toLowerCase()
  return normalized !== "operational" && normalized !== "up"
}

export function V4StatusBanner() {
  const [summary, setSummary] = useState<StatusSummary | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadSummary = async () => {
      try {
        const response = await fetch(SUMMARY_URL, { cache: "no-store" })
        if (!response.ok) throw new Error(`Status API returned ${response.status}`)
        const data = (await response.json()) as StatusSummary
        if (!isActive) return
        setSummary(data)
        setFailed(false)
      } catch (error) {
        if (!isActive) return
        console.error("status banner fetch failed", error)
        setFailed(true)
      }
    }

    loadSummary()
    const timer = window.setInterval(loadSummary, REFRESH_INTERVAL_MS)
    return () => {
      isActive = false
      window.clearInterval(timer)
    }
  }, [])

  const incident = useMemo(() => {
    const ongoing = summary?.ongoing_incidents ?? []
    const withAffectedService = ongoing.find((item) =>
      (item.affected_components ?? []).some((component) =>
        isDegradedOrDown(component.current_status)
      ) || isDegradedOrDown(item.status)
    )
    return withAffectedService ?? null
  }, [summary])

  if (!incident && !failed) return null

  const affectedServices = (incident?.affected_components ?? [])
    .filter((component) => isDegradedOrDown(component.current_status))
    .map((component) => {
      if (component.group_name) return `${component.group_name} / ${component.name}`
      return component.name
    })

  const details =
    incident?.last_update_message ||
    (affectedServices.length > 0
      ? `Services impactes: ${affectedServices.join(", ")}`
      : "Un incident est en cours sur nos services.")

  return (
    <section className="relative z-20 mx-auto mt-4 w-[92%] max-w-6xl">
      <div className="v4-glass rounded-3xl border border-amber-400/35 bg-amber-500/10 px-5 py-4 shadow-xl shadow-amber-900/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
              Service Status
            </p>
            <p className="text-sm font-semibold text-foreground">
              {failed
                ? "Impossible de verifier le status en ce moment."
                : incident?.name || "Incident en cours"}
            </p>
            <p className="text-sm text-foreground/80">{details}</p>
            {incident?.url ? (
              <a
                href={incident.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs font-bold uppercase tracking-widest text-amber-200 hover:text-amber-100"
              >
                Voir les details
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
