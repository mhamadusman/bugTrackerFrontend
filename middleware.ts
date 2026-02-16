import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!authToken && !refreshToken) {
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/me/:path*',
    '/dashboard/:path*',
    '/bugs/:path*',
  ],
}
