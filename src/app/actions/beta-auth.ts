'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyBeta(formData: FormData): Promise<{ error: string } | never> {
  const submitted = (formData.get('password') as string ?? '').trim()
  const correct   = process.env.BETA_PASSWORD ?? ''

  if (!correct) {
    // No password configured — let them through (misconfiguration safety)
    cookies().set('beta_access', 'true', cookieOpts())
    redirect('/login')
  }

  if (submitted !== correct) {
    return { error: 'Incorrect access code.' }
  }

  cookies().set('beta_access', 'true', cookieOpts())
  redirect('/login')
}

function cookieOpts() {
  return {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path:     '/',
    maxAge:   60 * 60 * 24 * 7, // 7 days
  }
}
