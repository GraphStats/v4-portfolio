import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  // Check if the request is for the admin dashboard
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const adminSession = request.cookies.get("admin_session")

    // If no admin session, redirect to admin login
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
