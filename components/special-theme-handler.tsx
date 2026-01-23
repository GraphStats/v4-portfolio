"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const NewYearOverlay = dynamic(
    () => import("./special-themes/new-year-overlay").then(mod => ({ default: mod.NewYearOverlay })),
    { ssr: false }
)

const ChristmasOverlay = dynamic(
    () => import("./special-themes/christmas-overlay").then(mod => ({ default: mod.ChristmasOverlay })),
    { ssr: false }
)

interface ThemeConfig {
    id: string
    name: string
    description: string
    startDate: {
        day: number
        month: number
        year: number
        hour: number
        minute: number
        second: number
    }
    endDate: {
        day: number
        month: number
        year: number
        hour: number
        minute: number
        second: number
    }
}

interface ActiveThemes {
    newYear: boolean
    christmas: boolean
}

export function SpecialThemeHandler() {
    const [activeThemes, setActiveThemes] = useState<ActiveThemes>({
        newYear: false,
        christmas: false
    })

    useEffect(() => {
        const checkThemes = async () => {
            const now = new Date()

            try {
                const { getFirestoreClient } = await import("@/lib/firebase/client")
                const { doc, getDoc } = await import("firebase/firestore")

                const db = getFirestoreClient()
                const docRef = doc(db, "special-themes", "config")
                const docSnap = await getDoc(docRef)

                let themes: ThemeConfig[] = []

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    if (data.themes) {
                        const savedThemes = data.themes
                        const mergedThemes = AVAILABLE_THEMES.map(defaultTheme => {
                            const savedTheme = savedThemes.find(t => t.id === defaultTheme.id)
                            return savedTheme || defaultTheme
                        })
                        themes = mergedThemes
                    }
                }


                const newYearTheme = themes.find(t => t.id === 'new-year')
                const christmasTheme = themes.find(t => t.id === 'christmas')

                let isNewYearActive = false
                if (newYearTheme) {
                    const startDate = new Date(
                        newYearTheme.startDate.year,
                        newYearTheme.startDate.month - 1,
                        newYearTheme.startDate.day,
                        newYearTheme.startDate.hour,
                        newYearTheme.startDate.minute,
                        newYearTheme.startDate.second
                    )
                    const endDate = new Date(
                        newYearTheme.endDate.year,
                        newYearTheme.endDate.month - 1,
                        newYearTheme.endDate.day,
                        newYearTheme.endDate.hour,
                        newYearTheme.endDate.minute,
                        newYearTheme.endDate.second
                    )
                    isNewYearActive = now >= startDate && now <= endDate
                }

                let isChristmasActive = false
                if (christmasTheme) {
                    const startDate = new Date(
                        christmasTheme.startDate.year,
                        christmasTheme.startDate.month - 1,
                        christmasTheme.startDate.day,
                        christmasTheme.startDate.hour,
                        christmasTheme.startDate.minute,
                        christmasTheme.startDate.second
                    )
                    const endDate = new Date(
                        christmasTheme.endDate.year,
                        christmasTheme.endDate.month - 1,
                        christmasTheme.endDate.day,
                        christmasTheme.endDate.hour,
                        christmasTheme.endDate.minute,
                        christmasTheme.endDate.second
                    )
                    isChristmasActive = now >= startDate && now <= endDate
                }

                if (isNewYearActive) {
                    document.documentElement.classList.remove("special-christmas")
                    document.documentElement.classList.add("special-new-year")

                    if (!document.getElementById('new-year-theme-css')) {
                        const link = document.createElement('link')
                        link.id = 'new-year-theme-css'
                        link.rel = 'stylesheet'
                        link.href = '/styles/special-themes/new-year.css'
                        document.head.appendChild(link)
                    }

                    const christmasLink = document.getElementById('christmas-theme-css')
                    if (christmasLink) christmasLink.remove()

                    setActiveThemes({ newYear: true, christmas: false })
                } else if (isChristmasActive) {
                    document.documentElement.classList.remove("special-new-year")
                    document.documentElement.classList.add("special-christmas")

                    if (!document.getElementById('christmas-theme-css')) {
                        const link = document.createElement('link')
                        link.id = 'christmas-theme-css'
                        link.rel = 'stylesheet'
                        link.href = '/styles/special-themes/christmas.css'
                        document.head.appendChild(link)
                    }

                    const newYearLink = document.getElementById('new-year-theme-css')
                    if (newYearLink) newYearLink.remove()

                    setActiveThemes({ newYear: false, christmas: true })
                } else {
                    document.documentElement.classList.remove("special-new-year", "special-christmas")

                    const newYearLink = document.getElementById('new-year-theme-css')
                    const christmasLink = document.getElementById('christmas-theme-css')
                    if (newYearLink) newYearLink.remove()
                    if (christmasLink) christmasLink.remove()

                    setActiveThemes({ newYear: false, christmas: false })
                }
            } catch (e) {
                console.error('Error reading themes config from Firebase:', e)
            }
        }

        checkThemes()
        const interval = setInterval(checkThemes, 1000 * 60 * 60)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <>
            {activeThemes.newYear && <NewYearOverlay />}
            {activeThemes.christmas && <ChristmasOverlay />}
        </>
    )
}