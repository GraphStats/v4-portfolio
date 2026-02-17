import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { SpecialThemeHandler } from "@/components/special-theme-handler"
import { ClerkThemeProvider } from "@/components/clerk-theme-provider"
import { Toaster } from "sonner"
import { headers } from "next/headers"
import { getErrorMode, getSiteSettings } from "@/lib/actions"
import { ErrorModeScreen } from "@/components/error-mode-screen"
import { RouteTransitionProvider } from "@/components/route-transition"
import { SiteSettingsProvider } from "@/components/site-settings-provider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export async function generateMetadata(): Promise<Metadata> {
  const { developerName } = await getSiteSettings()
  const name = developerName || "No Name"

  return {
    title: `${name} - Creative Developer`,
    description: `Portfolio of ${name}, a Creative Developer & Designer specializing in high-performance digital experiences.`,
    generator: "v0.app",
    other: {
      "google-adsense-account": "ca-pub-3145023750951462",
      "monetag": "ad42aaa7976ba5b3bbe06af8ece11ba3"
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isAdminRoute = pathname.startsWith("/admin")
  const errorMode = await getErrorMode()
  const showErrorMode = !isAdminRoute && errorMode.isErrorMode
  const { developerName } = await getSiteSettings()
  const isProd = process.env.NODE_ENV === "production"

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary transition-colors duration-300" suppressHydrationWarning>
        <SiteSettingsProvider developerName={developerName}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="theme">
            <ClerkThemeProvider>
              <SpecialThemeHandler />
              <Toaster position="top-right" richColors />
              <div className="relative flex min-h-screen flex-col">
                <main className="flex-1">
                  {showErrorMode ? (
                    <ErrorModeScreen message={errorMode.message} pathname={pathname} />
                  ) : (
                    <RouteTransitionProvider>{children}</RouteTransitionProvider>
                  )}
                </main>
              </div>
              {isProd && (
                <>
                  <Analytics />
                  <SpeedInsights />
                  <Script
                    id="umami"
                    strategy="afterInteractive"
                    defer
                    src="https://cloud.umami.is/script.js"
                    data-website-id="43ced19b-1c79-4c9a-abff-4f4e0b5dd798"
                  />
                  <Script
                    id="gtag-loader"
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-HN2Q6BTFCB"
                  />
                  <Script id="gtag-init" strategy="afterInteractive">
                    {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-HN2Q6BTFCB');`}
                  </Script>
                  <Script id="statcounter-config" strategy="afterInteractive">
                    {`var sc_project=13204241; var sc_invisible=1; var sc_security="4d852cb5";`}
                  </Script>
                  <Script id="statcounter-loader" strategy="afterInteractive" src="https://www.statcounter.com/counter/counter.js" />
                  <noscript>
                    <div className="statcounter" style={{ position: "absolute", left: "-9999px", width: 0, height: 0, overflow: "hidden" }}>
                      <a title="site stats" href="https://statcounter.com/" target="_blank" rel="noreferrer">
                        <img
                          className="statcounter"
                          src="https://c.statcounter.com/13204241/0/4d852cb5/1/"
                          alt="site stats"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </a>
                    </div>
                  </noscript>
                </>
              )}
            </ClerkThemeProvider>
          </ThemeProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
