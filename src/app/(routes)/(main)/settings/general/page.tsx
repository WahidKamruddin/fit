'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/src/app/auth/auth'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useSocial } from '@/src/app/providers/socialContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import Link from 'next/link'

export default function GeneralSettings() {
  const user = useUser()
  const { currentProfile, refreshProfile } = useSocial()
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) setBio(user.user_metadata?.bio ?? currentProfile?.bio ?? '')
  }, [user, currentProfile])

  if (!user) return null

  const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? 'User'
  const avatar   = user.user_metadata?.avatar_url ?? ''
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const [{ error: authErr }, { error: profileErr }] = await Promise.all([
      supabase.auth.updateUser({ data: { ...user.user_metadata, bio } }),
      supabase.from('profiles').update({ bio, display_name: fullName }).eq('id', user.id),
    ])
    setSaving(false)
    if (authErr || profileErr) {
      setError((authErr ?? profileErr)!.message)
    } else {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="max-w-lg space-y-8">

      {/* Section label */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-500 font-medium">Profile</span>
        <div className="flex-1 h-px bg-mocha-200" />
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <Avatar className="h-16 w-16 ring-1 ring-mocha-200">
          <AvatarImage src={avatar} alt={fullName} />
          <AvatarFallback className="bg-mocha-200 text-mocha-500 text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-cormorant text-2xl font-light text-mocha-500">{fullName}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300 mt-0.5">{user.email}</p>
          <p className="text-[9px] text-mocha-200 mt-1">Identity managed by Google</p>
        </div>
      </div>

      <div className="h-px bg-mocha-100" />

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
          rows={4}
          placeholder="A short note about your style..."
          className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 resize-none py-2 transition-colors duration-200"
        />
        <div className="flex justify-between items-center">
          {error && <p className="text-[9px] text-red-400">{error}</p>}
          <p className="text-[9px] text-mocha-200 ml-auto">{bio.length}/160</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Profile'}
        </button>
        {currentProfile?.username && (
          <Link
            href={`/profile/${currentProfile.username}`}
            className="px-6 py-3 border border-mocha-200 text-mocha-400 text-[10px] tracking-[0.35em] uppercase rounded-full hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
          >
            View Profile
          </Link>
        )}
      </div>
    </div>
  )
}
