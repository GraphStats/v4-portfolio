"use client"

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type RouteTransitionState = {
    loading: boolean
    progress: number
    startTransition: (url: string) => void
}

const RouteTransitionContext = createContext<RouteTransitionState | null>(null)
const VISITED_STORAGE_KEY = "route-visited-paths"

export function useRouteTransition() {
    const context = useContext(RouteTransitionContext)
    return context ?? { loading: false, progress: 0, startTransition: () => {} }
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const timersRef = useRef({
        progressTimer: null as ReturnType<typeof setInterval> | null,
        finishTimer: null as ReturnType<typeof setTimeout> | null,
        hideTimer: null as ReturnType<typeof setTimeout> | null,
        slowTimer: null as ReturnType<typeof setTimeout> | null,
    })
    const latestUrl = useRef<string | null>(null)
    const slowToastShown = useRef(false)
    const loadingRef = useRef(false)
    const visitedRef = useRef<Set<string>>(new Set())

    const isExtendedLoadingWindow = (date: Date) => {
        const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes()
        const minutes = (utcMinutes + 120) % (24 * 60)
        return minutes >= 8 * 60 + 45 && minutes <= 20 * 60 + 45
    }

    const clearTimers = () => {
        if (timersRef.current.progressTimer) clearInterval(timersRef.current.progressTimer)
        if (timersRef.current.finishTimer) clearTimeout(timersRef.current.finishTimer)
        if (timersRef.current.hideTimer) clearTimeout(timersRef.current.hideTimer)
        if (timersRef.current.slowTimer) clearTimeout(timersRef.current.slowTimer)
    }

    const startTransition = useCallback((url: string) => {
        const nextUrl = new URL(url, window.location.href)
        const currentUrl = new URL(window.location.href)

        if (nextUrl.href === currentUrl.href) return

        clearTimers()
        latestUrl.current = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
        slowToastShown.current = false

        const getRootSegment = (pathname: string) => pathname.split("/").filter(Boolean)[0] ?? ""
        const getPathKey = (urlToKey: URL) => `${urlToKey.pathname}${urlToKey.search}`
        const currentRoot = getRootSegment(currentUrl.pathname)
        const nextRoot = getRootSegment(nextUrl.pathname)
        const isHome = nextUrl.pathname === "/"
        const isSameSection = currentRoot !== "" && currentRoot === nextRoot
        const hasVisited = visitedRef.current.has(getPathKey(nextUrl))
        const visitedMultiplier = hasVisited ? 0.4 : 1
        const timeMultiplier = isExtendedLoadingWindow(new Date()) ? 2 : 1
        const minDelay = Math.round((isHome ? 1500 : isSameSection ? 300 : 500) * visitedMultiplier * timeMultiplier)
        const maxDelay = Math.round((isHome ? 3500 : isSameSection ? 1000 : 2500) * visitedMultiplier * timeMultiplier)
        const delay = minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1))
        setLoading(true)
        loadingRef.current = true
        setProgress(10)

        let current = 10
        timersRef.current.progressTimer = setInterval(() => {
            current = Math.min(current + Math.random() * 12, 90)
            setProgress(current)
        }, 200)

        timersRef.current.slowTimer = setTimeout(() => {
            if (!loadingRef.current || slowToastShown.current) return
            slowToastShown.current = true
            toast.info("Server busy", {
                description: isHome
                    ? "High traffic right now. The homepage may load more slowly (images, animations, etc.)."
                    : "High traffic on the server. The site may feel slower."
            })
        }, 2500 * timeMultiplier)

        timersRef.current.finishTimer = setTimeout(() => {
            clearTimers()
            setProgress(100)
            if (latestUrl.current) {
                try {
                    visitedRef.current.add(getPathKey(nextUrl))
                    sessionStorage.setItem(
                        VISITED_STORAGE_KEY,
                        JSON.stringify(Array.from(visitedRef.current))
                    )
                } catch (error) {
                    console.error("Error saving visited routes:", error)
                }
                router.push(latestUrl.current)
            }
            timersRef.current.hideTimer = setTimeout(() => {
                setLoading(false)
                loadingRef.current = false
                setProgress(0)
            }, 200)
        }, delay)
    }, [router])
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(VISITED_STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    visitedRef.current = new Set(parsed.filter(item => typeof item === "string"))
                }
            }
            const currentUrl = new URL(window.location.href)
            visitedRef.current.add(`${currentUrl.pathname}${currentUrl.search}`)
            sessionStorage.setItem(
                VISITED_STORAGE_KEY,
                JSON.stringify(Array.from(visitedRef.current))
            )
        } catch (error) {
            console.error("Error loading visited routes:", error)
        }
    }, [])
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.button !== 0) return
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

            const target = event.target as HTMLElement | null
            const anchor = target?.closest("a") as HTMLAnchorElement | null
            if (!anchor) return
            if (anchor.target === "_blank" || anchor.hasAttribute("download")) return

            const href = anchor.getAttribute("href")
            if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return
            if (href.startsWith("#")) return

            const url = new URL(href, window.location.href)
            if (url.origin !== window.location.origin) return

            const currentUrl = new URL(window.location.href)
            const isOnlyHashChange =
                url.pathname === currentUrl.pathname &&
                url.search === currentUrl.search &&
                url.hash !== currentUrl.hash

            if (isOnlyHashChange) return

            event.preventDefault()
            event.stopPropagation()
            startTransition(url.href)
        }

        document.addEventListener("click", handleClick, true)
        return () => document.removeEventListener("click", handleClick, true)
    }, [startTransition])

    useEffect(() => {
        return () => clearTimers()
    }, [])

    return (
        <RouteTransitionContext.Provider value={{ loading, progress, startTransition }}>
            {children}
        </RouteTransitionContext.Provider>
    )
}
