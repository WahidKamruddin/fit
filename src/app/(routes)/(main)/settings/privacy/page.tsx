'use client'

import { useState, useEffect } from 'react'
import { useUser, logOut } from '@/src/app/auth/auth'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useRouter } from 'next/navigation'

function Toggle({
  checked, onChange, label, description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-mocha-100 last:border-0">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-500">{label}</p>
        <p className="text-[10px] text-mocha-300 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full flex-shrink-0 transition-colors duration-300 ${
          checked ? 'bg-mocha-500' : 'bg-mocha-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default function PrivacySettings() {
  const user    = useUser()
  const router  = useRouter()

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs,  setPushNotifs]  = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  const [deleteModal,   setDeleteModal]   = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting,      setDeleting]      = useState(false)
  const [deleteErr,     setDeleteErr]     = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const notifs = user.user_metadata?.notifications ?? {}
      setEmailNotifs(notifs.email ?? true)
      setPushNotifs(notifs.push ?? false)
    }
  }, [user])

  if (!user) return null

  const handleSave = async () => {
    setSaving(true)
    setSaveErr(null)
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        notifications: { email: emailNotifs, push: pushNotifs },
      },
    })
    setSaving(false)
    if (error) {
      setSaveErr(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    setDeleteErr(null)
    const res = await fetch('/api/delete-account', { method: 'DELETE' })
    if (res.ok) {
      await logOut()
      router.push('/login')
    } else {
      const body = await res.json().catch(() => ({}))
      setDeleteErr(body.error ?? 'Something went wrong. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-lg space-y-10">

      {/* Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-500 font-medium">Notifications</span>
          <div className="flex-1 h-px bg-mocha-200" />
        </div>

        <div className="rounded-2xl border border-mocha-100 px-5">
          <Toggle
            checked={emailNotifs}
            onChange={setEmailNotifs}
            label="Email notifications"
            description="Receive updates and style tips via email"
          />
          <Toggle
            checked={pushNotifs}
            onChange={setPushNotifs}
            label="Push notifications"
            description="In-app alerts for new features and reminders"
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
          </button>
          {saveErr && <p className="text-[9px] text-red-400">{saveErr}</p>}
        </div>
      </div>

      {/* Danger zone */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[9px] tracking-[0.4em] uppercase text-red-400 font-medium">Danger Zone</span>
          <div className="flex-1 h-px bg-red-100" />
        </div>

        <div className="border border-red-100 rounded-2xl p-5 space-y-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-500">Delete Account</p>
          <p className="text-[11px] text-mocha-300 leading-relaxed">
            Permanently removes your account, wardrobe, and all saved data. This action cannot be undone.
          </p>
          <button
            onClick={() => { setDeleteModal(true); setDeleteConfirm(''); setDeleteErr(null) }}
            className="px-6 py-2.5 border border-red-200 text-red-400 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-red-50 transition-all duration-200"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="relative w-full max-w-sm bg-off-white-100 rounded-3xl p-8 shadow-2xl">

            <button
              onClick={() => setDeleteModal(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
            >
              <span className="text-xs leading-none">✕</span>
            </button>

            <p className="text-[10px] tracking-[0.5em] uppercase text-red-400 mb-2">Irreversible</p>
            <h2 className="font-cormorant text-3xl font-light text-mocha-500 mb-2">
              Delete your <span className="italic text-mocha-400">account?</span>
            </h2>
            <p className="text-[11px] text-mocha-300 leading-relaxed mb-6">
              All your clothes, outfits, and data will be permanently erased.{' '}
              Type <span className="font-semibold text-mocha-500">DELETE</span> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 mb-6 transition-colors duration-200"
            />

            {deleteErr && <p className="text-[9px] text-red-400 mb-3">{deleteErr}</p>}

            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || deleting}
              className="w-full py-3 bg-red-500 text-white text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-red-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting…' : 'Permanently Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
