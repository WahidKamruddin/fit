'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { useSocial } from '@/src/app/providers/socialContext'
import NotificationItem from '@/src/app/components/social/notification-item'
import UsernameSetupModal from '@/src/app/components/username-setup-modal'
import PageSkeleton from '@/src/app/components/page-skeleton'
import type { NotificationCard } from '@/src/app/types/social'

export default function NotificationsPage() {
  const user = useUser()
  const { markNotifsRead } = useSocial()
  const [notifs, setNotifs] = useState<NotificationCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    supabase
      .from('notifications')
      .select('*, actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setNotifs((data ?? []) as NotificationCard[])
        setLoading(false)
      })

    // Mark all as read after fetching
    markNotifsRead()
  }, [user, markNotifsRead])

  if (!user) return <PageSkeleton />

  return (
    <div className="min-h-screen bg-off-white-100 pt-16">
      <UsernameSetupModal />
      <div className="px-4 sm:px-8 lg:px-20 pt-8 pb-12">

        {/* Page header */}
        <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Social</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Activity</span>
        </div>
        <h1
          className="mt-3 font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
          style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
        >
          Your<br /><span className="italic text-mocha-400">Notifications.</span>
        </h1>
        <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />

        <div className="mt-6 max-w-lg animate-fade-in" style={{ animationDelay: '0.35s' }}>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-mocha-100/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : notifs.length === 0 ? (
            <div className="text-center py-24">
              <span className="font-cormorant text-[6rem] font-light text-mocha-200/60 leading-none block">00</span>
              <p className="font-cormorant text-3xl font-light text-mocha-400">All caught up.</p>
              <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-300 mt-2">No new activity</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {notifs.map(n => <NotificationItem key={n.id} notif={n} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
