import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE() {
  const cookieStore = await cookies()

  // Identify the calling user via their session
  const sessionClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user }, error: authError } = await sessionClient.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'Account deletion is not configured. Contact support.' },
      { status: 503 }
    )
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)

  // Delete user data before removing the auth record
  await admin.from('outfits').delete().eq('user_id', user.id)
  await admin.from('clothes').delete().eq('user_id', user.id)

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
