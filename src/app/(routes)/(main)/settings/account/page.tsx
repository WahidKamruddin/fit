'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/src/app/auth/auth'
import { supabase } from '@/src/app/supabaseConfig/client'
import { VIBE_OPTIONS, STYLE_OPTIONS, WEATHER_OPTIONS } from '@/src/app/types/clothing'
import type { Vibe, Style, Weather } from '@/src/app/types/clothing'

function TogglePill<T extends string>({ label, active, onClick }: { label: T; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 ${
        active
          ? 'bg-mocha-500 text-mocha-100'
          : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500'
      }`}
    >
      {label}
    </button>
  )
}

function tog<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

export default function AccountSettings() {
  const user = useUser()
  const [vibes,   setVibes]   = useState<Vibe[]>([])
  const [styles,  setStyles]  = useState<Style[]>([])
  const [weather, setWeather] = useState<Weather[]>([])
  const [saving, setSaving]   = useState(false)
  const [saved,  setSaved]    = useState(false)
  const [error,  setError]    = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const prefs = user.user_metadata?.preferences ?? {}
      setVibes(prefs.vibes ?? [])
      setStyles(prefs.styles ?? [])
      setWeather(prefs.weather ?? [])
    }
  }, [user])

  if (!user) return null

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        preferences: { vibes, styles, weather },
      },
    })
    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="max-w-lg space-y-8">

      {/* Section label */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-500 font-medium">Default Preferences</span>
          <div className="flex-1 h-px bg-mocha-200" />
        </div>
        <p className="text-[10px] text-mocha-300 mt-2">
          These pre-fill your outfit generator so you don&apos;t have to re-select every time.
        </p>
      </div>

      {/* Vibes */}
      <div className="space-y-2.5">
        <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Vibe</p>
        <div className="flex flex-wrap gap-1.5">
          {VIBE_OPTIONS.map(v => (
            <TogglePill key={v} label={v} active={vibes.includes(v)} onClick={() => setVibes(tog(vibes, v))} />
          ))}
        </div>
      </div>

      {/* Styles */}
      <div className="space-y-2.5">
        <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Style</p>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_OPTIONS.map(s => (
            <TogglePill key={s} label={s} active={styles.includes(s)} onClick={() => setStyles(tog(styles, s))} />
          ))}
        </div>
      </div>

      {/* Weather */}
      <div className="space-y-2.5">
        <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Weather</p>
        <div className="flex flex-wrap gap-1.5">
          {WEATHER_OPTIONS.map(w => (
            <TogglePill key={w} label={w} active={weather.includes(w)} onClick={() => setWeather(tog(weather, w))} />
          ))}
        </div>
      </div>

      {error && <p className="text-[9px] text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-8 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Preferences'}
      </button>
    </div>
  )
}
