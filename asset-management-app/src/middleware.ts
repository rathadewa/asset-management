

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  const publicPaths = ['/login','/asset/list_asset']

  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (publicPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}
export const config = {
  matcher: [
    /*
     * Cocokkan semua path permintaan kecuali untuk:
     * - /api routes
     * - /_next/static
     * - /_next/image
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}