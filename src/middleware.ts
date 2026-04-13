import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register', '/pricing', '/beta', '/bugs', '/auth/callback', '/auth/signout']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Beta gate ────────────────────────────────────────────────────────────────
  if (process.env.BETA === 'true') {
    const hasBetaAccess = request.cookies.has('beta_access')
    if (pathname === '/login' && !hasBetaAccess) {
      return NextResponse.redirect(new URL('/beta', request.url))
    }
    if (pathname === '/beta' && hasBetaAccess) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  // ────────────────────────────────────────────────────────────────────────────

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
