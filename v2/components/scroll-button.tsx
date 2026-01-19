"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface ScrollButtonProps {
  targetId: string
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ScrollButton({ targetId, children, variant = "outline", size = "lg", className }: ScrollButtonProps) {
  const handleScroll = () => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <Button size={size} variant={variant} className={className} onClick={handleScroll}>
      {children}
    </Button>
  )
}
