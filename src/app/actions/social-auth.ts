'use server'

import { cookies } from 'next/headers'

export async function verifySocial(formData: FormData): Promise<{ error: string } | { success: true }> {
  const submitted = (formData.get('password') as string ?? '').trim()
  const correct   = process.env.SOCIAL_PASSWORD ?? ''

  if (submitted !== correct && correct !== '') {
    return { error: 'Incorrect access code.' }
  }

  cookies().set('social_access', 'true', cookieOpts())
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
