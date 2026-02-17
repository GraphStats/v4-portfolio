"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstaller() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error)
    })

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  }, [])

  if (!installEvent) return null

  return (
    <div className="fixed left-4 bottom-4 z-[130]">
      <Button
        size="sm"
        className="rounded-xl text-[10px] font-black uppercase tracking-widest"
        onClick={async () => {
          await installEvent.prompt()
          await installEvent.userChoice
          setInstallEvent(null)
        }}
      >
        Install App
      </Button>
    </div>
  )
}
