'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { verifySocial } from '@/src/app/actions/social-auth'

export default function SocialGatePage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await verifySocial(formData)
      if ('error' in result) {
        setError(result.error)
      } else {
        window.location.href = '/feed'
      }
    })
  }

  return (
    <div className="min-h-screen bg-mocha-500 flex items-center justify-center px-6">

      <div className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      <div className="w-full max-w-sm">

        <p className="font-cormorant text-3xl font-semibold tracking-[0.3em] text-mocha-200 mb-16 text-center">
          FIT.
        </p>

        <div className="bg-mocha-400/30 border border-mocha-400/40 rounded-3xl px-8 py-10 backdrop-blur-sm">

          <p className="text-[9px] tracking-[0.6em] uppercase text-mocha-300 mb-3">
            Social — Early Access
          </p>
          <h1 className="font-cormorant text-4xl font-light text-mocha-100 leading-tight mb-2">
            Coming soon.
          </h1>
          <p className="text-sm font-light text-mocha-300 leading-relaxed mb-10">
            Enter your access code to explore the social features.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1">
              <label className="text-[9px] tracking-[0.45em] uppercase text-mocha-300">
                Access Code
              </label>
              <input
                name="password"
                type="password"
                autoComplete="off"
                autoFocus
                required
                className="w-full bg-transparent border-b border-mocha-400 text-mocha-100 text-sm font-light py-2 focus:outline-none focus:border-mocha-200 transition-colors duration-200 placeholder:text-mocha-500 tracking-widest"
                placeholder="••••••••"
              />
              {error && (
                <p className="text-[9px] tracking-[0.3em] uppercase text-red-400 pt-1">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-full bg-mocha-200 text-mocha-500 text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-mocha-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Verifying…' : 'Enter'}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="text-[9px] tracking-[0.35em] uppercase text-white/60 hover:text-white transition-colors duration-200"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
