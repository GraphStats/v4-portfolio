import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteSettingsProvider } from "@/components/site-settings-provider"
import { getSiteSettings } from "@/lib/actions"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const { developerName } = await getSiteSettings()
  const name = developerName || "No Name"

  return {
    title: `${name} - Portfolio`,
    description: "Creative Developer & Designer Portfolio",
    generator: "v0.app",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { developerName } = await getSiteSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <SiteSettingsProvider developerName={developerName}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Analytics />
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
