'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useSocial } from '@/src/app/providers/socialContext'
import { useUser } from '@/src/app/auth/auth'

export default function UsernameSetupModal() {
  const user = useUser()
  const { currentProfile, profileLoading, refreshProfile } = useSocial()
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce uniqueness check
  useEffect(() => {
    if (!username || username.length < 3) { setAvailable(null); return }
    setChecking(true)
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', username)
        .neq('id', user?.id ?? '')
        .limit(1)
      setAvailable((data?.length ?? 0) === 0)
      setChecking(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [username, user?.id])

  if (profileLoading || !user) return null
  if (currentProfile?.username) return null  // already set

  const isValid = /^[a-z0-9_]{3,24}$/.test(username)

  const handleSave = async () => {
    if (!isValid || !available || !user) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', user.id)
    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      await refreshProfile()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-off-white-100 rounded-3xl p-8 shadow-2xl">

        <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-2">Welcome</p>
        <h2 className="font-cormorant text-4xl font-light text-mocha-500 leading-tight mb-2">
          Pick your <span className="italic text-mocha-400">handle.</span>
        </h2>
        <p className="text-[11px] text-mocha-300 leading-relaxed mb-7">
          This is your public @username. Choose wisely — lowercase letters, numbers, and underscores only.
        </p>

        <div className="relative mb-1">
          <span className="absolute left-0 bottom-2.5 text-mocha-300 text-sm select-none">@</span>
          <input
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
              setAvailable(null)
            }}
            maxLength={24}
            placeholder="your_handle"
            className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 pl-4 transition-colors duration-200"
          />
        </div>

        <div className="h-5 mb-5">
          {username.length >= 3 && (
            <p className={`text-[9px] tracking-[0.3em] uppercase ${
              checking ? 'text-mocha-300' :
              !isValid ? 'text-red-400' :
              available === true ? 'text-olive-200' :
              available === false ? 'text-red-400' : 'text-mocha-300'
            }`}>
              {checking ? 'Checking…' :
               !isValid ? '3–24 chars, no special characters' :
               available === true ? '✓ Available' :
               available === false ? 'Already taken' : ''}
            </p>
          )}
        </div>

        {error && <p className="text-[9px] text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleSave}
          disabled={!isValid || available !== true || saving}
          className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Setting up…' : 'Claim Handle'}
        </button>
      </div>
    </div>
  )
}
