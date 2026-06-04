import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const hasAuthCookie = request.cookies.getAll().some(
    c => c.name.startsWith('sb-') && c.name.includes('-auth-token'),
  )

  if (!hasAuthCookie) {
    return NextResponse.redirect(
      new URL(`/admin/login?from=${encodeURIComponent(pathname)}`, request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
