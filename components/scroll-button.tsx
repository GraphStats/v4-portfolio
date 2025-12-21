"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

interface ScrollButtonProps {
  targetId: string
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ScrollButton({
  targetId,
  children,
  variant = "outline",
  size = "lg",
  className
}: ScrollButtonProps) {
  const handleScroll = () => {
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <Button size={size} variant={variant as any} className={className} onClick={handleScroll}>
      {children}
    </Button>
  )
}

