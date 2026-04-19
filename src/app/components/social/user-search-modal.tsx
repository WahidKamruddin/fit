'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import FollowButton from './follow-button'
import type { ProfileRow } from '@/src/app/types/social'

interface Props {
  onClose: () => void
  onSelectUser?: (userId: string) => void
  actionLabel?: string
}

export default function UserSearchModal({ onClose, onSelectUser, actionLabel }: Props) {
  const user = useUser()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProfileRow[]>([])
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('follows').select('following_id').eq('follower_id', user.id)
      .then(({ data }) => setFollowingIds(new Set((data ?? []).map(r => r.following_id))))
  }, [user])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setSearching(true)
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id ?? '')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10)
      setResults(data ?? [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, user?.id])

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-start pt-20 p-4">
      <div className="w-full max-w-sm bg-off-white-100 rounded-3xl p-6 shadow-2xl">

        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400">
            {actionLabel ?? 'Find People'}
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 transition-all duration-200"
          >
            <span className="text-xs leading-none">✕</span>
          </button>
        </div>

        <input
          type="text"
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or @handle"
          className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 mb-4 transition-colors duration-200"
        />

        <div className="space-y-1 max-h-72 overflow-y-auto">
          {searching && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300 text-center py-4">Searching…</p>
          )}
          {!searching && query && results.length === 0 && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300 text-center py-4">No results</p>
          )}
          {results.map(profile => {
            const initials = (profile?.display_name ?? profile?.username ?? '?')
              .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            return (
              <div
                key={profile.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-mocha-100/50 transition-colors duration-150"
              >
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarImage src={profile.avatar_url ?? ''} />
                  <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-mocha-500 font-medium truncate">
                    {profile.display_name ?? profile.username}
                  </p>
                  <p className="text-[9px] text-mocha-300 truncate">@{profile.username}</p>
                </div>
                {onSelectUser ? (
                  <button
                    onClick={() => { onSelectUser(profile.id); onClose() }}
                    className="px-4 py-1.5 bg-mocha-500 text-mocha-100 text-[9px] tracking-[0.25em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-200 flex-shrink-0"
                  >
                    {actionLabel ?? 'Select'}
                  </button>
                ) : (
                  <FollowButton targetId={profile.id} initialIsFollowing={followingIds.has(profile.id)} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
