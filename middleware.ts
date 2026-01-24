import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ADMIN_IP = "91.169.161.97"

const normalizeIp = (ip: string) => {
  if (!ip) return ""
  if (ip.startsWith("::ffff:")) return ip.slice(7)
  return ip
}

const isPrivateIp = (ip: string) => {
  if (!ip) return false
  if (ip === "127.0.0.1" || ip === "::1") return true
  if (ip.startsWith("192.168.")) return true
  if (ip.startsWith("10.")) return true
  const parts = ip.split(".").map(Number)
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true
  }
  return false
}

const getClientIps = (req: Request) => {
  const forwardedFor = req.headers.get("x-forwarded-for") ?? ""
  const realIp = req.headers.get("x-real-ip") ?? ""
  const list = forwardedFor
    .split(",")
    .map((value) => normalizeIp(value.trim()))
    .filter(Boolean)

  if (realIp) list.push(normalizeIp(realIp))
  if ("ip" in req) {
    const requestIp = normalizeIp((req as { ip?: string }).ip ?? "")
    if (requestIp) list.push(requestIp)
  }

  return Array.from(new Set(list))
}

const withRequestHeaders = (req: Request, extra?: Record<string, string>) => {
  const headers = new Headers(req.headers)
  headers.set("x-pathname", new URL(req.url).pathname)
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      headers.set(key, value)
    })
  }
  return headers
}

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname
  
  if (
    pathname.startsWith("/v1") ||
    pathname.startsWith("/v2") ||
    pathname.startsWith("/v3") ||
    pathname.startsWith("/v4") ||
    pathname.endsWith(".html")
  ) {
    return NextResponse.next({
      request: {
        headers: withRequestHeaders(req),
      },
    })
  }

  if (pathname.startsWith("/admin")) {
    const clientIps = getClientIps(req)
    const isDev = process.env.NODE_ENV !== "production"
    const hasAdminIp = clientIps.includes(ADMIN_IP)
    const allowDevPrivate = isDev && clientIps.some(isPrivateIp)

    if (!hasAdminIp && !allowDevPrivate) {
      const blockedIp = clientIps[0] || "unknown"
      const url = new URL("/403", req.url)
      return NextResponse.rewrite(url, {
        status: 403,
        request: {
          headers: withRequestHeaders(req, {
            "x-blocked-ip": blockedIp,
          }),
        },
      })
    }
  }

  if (pathname.startsWith("/admin/dashboard")) {
    const adminSession = req.cookies.get("admin_session")

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next({
    request: {
      headers: withRequestHeaders(req),
    },
  })
})

export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
