import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isVersionRoute = createRouteMatcher(['/v1(.*)', '/v2(.*)', '/v3(.*)', '/v4(.*)'])

export default clerkMiddleware((auth, req) => {
  // Skip middleware for version routes and static HTML files
  if (
    isVersionRoute(req) ||
    req.nextUrl.pathname.endsWith(".html")
  ) {
    return NextResponse.next()
  }

  // Check if the request is for the admin dashboard
  if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const adminSession = req.cookies.get("admin_session")

    // If no admin session, redirect to admin login
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
