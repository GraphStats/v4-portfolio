import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname
  
  if (
    pathname.startsWith("/v1") ||
    pathname.startsWith("/v2") ||
    pathname.startsWith("/v3") ||
    pathname.startsWith("/v4") ||
    pathname.endsWith(".html")
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin/dashboard")) {
    const adminSession = req.cookies.get("admin_session")

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}