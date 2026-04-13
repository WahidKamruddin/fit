'use server'

import { cookies } from 'next/headers'

export async function verifyBeta(formData: FormData): Promise<{ error: string } | { success: true }> {
  const submitted = (formData.get('password') as string ?? '').trim()
  const correct   = process.env.BETA_PASSWORD ?? ''

  if (submitted !== correct && correct !== '') {
    return { error: 'Incorrect access code.' }
  }

  cookies().set('beta_access', 'true', cookieOpts())
  return { success: true }
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
