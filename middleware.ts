import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware((auth, req) => {
  // Check if the request is for the admin dashboard
  if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const adminSession = req.cookies.get("admin_session")

    // If no admin session, redirect to admin login
    if (!adminSession) {
      return Response.redirect(new URL("/admin", req.url))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
