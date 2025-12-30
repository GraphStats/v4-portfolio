import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { SpecialThemeHandler } from "@/components/special-theme-handler"
import { CustomCursor } from "@/components/custom-cursor"
import { headers } from "next/headers"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const metadata: Metadata = {
  title: "Drayko - Creative Developer",
  description: "Portfolio of Drayko, a Creative Developer & Designer specializing in high-performance digital experiences.",
  generator: "v0.app",
  other: {
    "google-adsense-account": "ca-pub-3145023750951462",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const { isMaintenance } = await getMaintenanceMode()

  // Protect all routes except admin and the maintenance page itself
  if (isMaintenance && !pathname.startsWith("/admin") && pathname !== "/maintenance") {
    redirect("/maintenance")
  }

  // If not in maintenance mode but trying to access maintenance page, redirect home
  if (!isMaintenance && pathname === "/maintenance") {
    redirect("/")
  }
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SpecialThemeHandler />
          <CustomCursor />
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3145023750951462"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}

