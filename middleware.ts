import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname
  
  // Skip middleware for version routes and static HTML files - let them pass through
  if (
    pathname.startsWith("/v1") ||
    pathname.startsWith("/v2") ||
    pathname.startsWith("/v3") ||
    pathname.startsWith("/v4") ||
    pathname.endsWith(".html")
  ) {
    return NextResponse.next()
  }

  // Check if the request is for the admin dashboard
  if (pathname.startsWith("/admin/dashboard")) {
    const adminSession = req.cookies.get("admin_session")

    // If no admin session, redirect to admin login
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  // Let all other requests pass through
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
