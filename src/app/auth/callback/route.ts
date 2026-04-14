import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const origin = process.env.NODE_ENV === 'development'
    ? new URL(request.url).origin
    : forwardedHost ? `https://${forwardedHost}` : new URL(request.url).origin
  const code = searchParams.get('code')

  console.log('[auth/callback] request.url:', request.url)
  console.log('[auth/callback] x-forwarded-host:', forwardedHost)
  console.log('[auth/callback] resolved origin:', origin)
  console.log('[auth/callback] code present:', !!code)

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('[auth/callback] exchangeCodeForSession error:', error)

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Something went wrong — send back to login
  return NextResponse.redirect(`${origin}/login`)
}
