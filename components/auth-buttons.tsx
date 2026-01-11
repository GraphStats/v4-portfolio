"use client"

import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      // Force a refresh when user signs in to update the UI
      router.refresh()
    }
  }, [isLoaded, userId, router])

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal" afterSignInUrl="/">
          <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full glass border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            Se connecter
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  )
}