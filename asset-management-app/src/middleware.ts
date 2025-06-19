import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log("\n--- Middleware Running ---");
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const publicPaths = ['/login'];

  console.log("Pathname:", pathname);
  console.log("Token Found?:", token ? 'Yes' : 'No');
  
  if (!publicPaths.includes(pathname) && !token) {
    console.log("Action: Redirecting to /login (protected route, no token)");
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (publicPaths.includes(pathname) && token) {
    console.log("Action: Redirecting to /asset/list_asset (public route, has token)");
    return NextResponse.redirect(new URL('/asset/list_asset', request.url));
  }
  
  console.log("Action: Allowing request to proceed.");
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}