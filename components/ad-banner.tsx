"use client"

import { useEffect, useRef, useState } from "react"

export function AdBanner() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [adId] = useState(() => `ad-${Math.random().toString(36).substring(2, 11)}`)

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return

        if (containerRef.current && !containerRef.current.firstChild) {
            const scriptConfig = document.createElement("script")
            scriptConfig.type = "text/javascript"
            scriptConfig.text = `
        atOptions = {
          'key' : 'ff5f7f27ac4b6d00694ac774e77792f7',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `

            const scriptInvoke = document.createElement("script")
            scriptInvoke.type = "text/javascript"
            scriptInvoke.src = "https://autographmarquisbuffet.com/ff5f7f27ac4b6d00694ac774e77792f7/invoke.js"

            containerRef.current.appendChild(scriptConfig)
            containerRef.current.appendChild(scriptInvoke)
        }
    }, [])

    return (
        <div className="flex justify-center items-center my-4 min-h-[90px] w-full overflow-hidden bg-muted/10 border border-border/20 rounded-md">
            <div
                ref={containerRef}
                id={adId}
                className="max-sm:scale-[0.4] max-md:scale-[0.6] max-xl:scale-[0.8] transition-all origin-center"
                style={{ width: "728px", height: "90px" }}
            />
        </div>
    )
}
