import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const BACKEND_URL = process.env.BACKEND_URL || process.env.LOCAL_BACKEND_URL;
export async function middleware(request: NextRequest) {
  console.log('inside middlw ware ')
  const { cookies, headers } = request
  const refreshToken = cookies.get('refresh_token')?.value
  const authToken = cookies.get('auth_token')?.value
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (!authToken) {
    console.log('no auth token....')
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { Cookie: `refresh_token=${refreshToken}` },
      })
      if (!response.ok) throw new Error()
      const setCookies = response.headers.getSetCookie()
      let newAuth = ''
      let newRefresh = ''
      setCookies.forEach((c) => {
        if (c.includes('auth_token=')) newAuth = c.split('auth_token=')[1].split('')[0]
        if (c.includes('refresh_token=')) newRefresh = c.split('refresh_token=')[1].split('')[0]
      })
      if (!newAuth) throw new Error()
      const nextResponse = NextResponse.next({
        request: {
          headers: new Headers(headers),
        },
      })
      nextResponse.cookies.set('auth_token', newAuth, {
        httpOnly: true,
        path: '/',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      nextResponse.cookies.set('refresh_token', newRefresh || refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      nextResponse.headers.set('Cookie', `auth_token=${newAuth} refresh_token=${newRefresh || refreshToken}`)
      return nextResponse
    } catch {
      const loginRes = NextResponse.redirect(new URL('/auth/login', request.url))
      loginRes.cookies.delete('auth_token')
      loginRes.cookies.delete('refresh_token')
      return loginRes
    }
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/dashboard/:path*', '/bugs/:path*', '/projects/:path*'],
}
