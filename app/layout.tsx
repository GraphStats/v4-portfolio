import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { AdBanner } from "@/components/ad-banner"
import { AdPopup } from "@/components/ad-popup"
import { ClientOnly } from "@/components/client-only"
import Script from "next/script"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drayko - Portfolio",
  description: "Creative Developer & Designer Portfolio",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://autographmarquisbuffet.com/9d/04/bb/9d04bb68d88e2f87e6638d2462507108.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <div className="w-full bg-accent/5 py-2 flex justify-center border-b border-border/50">
              <AdBanner />
            </div>
            <main className="flex-1">{children}</main>
            <div className="w-full bg-accent/5 py-4 flex flex-wrap justify-center gap-4 border-t border-border/50">
              <AdBanner />
              <AdBanner />
              <AdBanner />
            </div>
          </div>
          <ClientOnly>
            <AdPopup />
          </ClientOnly>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}


