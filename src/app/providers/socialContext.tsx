'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import type { ProfileRow } from '@/src/app/types/social'

interface SocialContextValue {
  currentProfile: ProfileRow | null
  profileLoading: boolean
  unreadNotifCount: number
  followUser: (targetId: string) => Promise<void>
  unfollowUser: (targetId: string) => Promise<void>
  likePost: (postId: string) => Promise<void>
  unlikePost: (postId: string) => Promise<void>
  markNotifsRead: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const SocialContext = createContext<SocialContextValue>({
  currentProfile: null,
  profileLoading: true,
  unreadNotifCount: 0,
  followUser: async () => {},
  unfollowUser: async () => {},
  likePost: async () => {},
  unlikePost: async () => {},
  markNotifsRead: async () => {},
  refreshProfile: async () => {},
})

export function useSocial() {
  return useContext(SocialContext)
}

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const [currentProfile, setCurrentProfile] = useState<ProfileRow | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    setCurrentProfile(data ?? null)
    setProfileLoading(false)
  }, [])

  const fetchUnreadCount = useCallback(async (uid: string) => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .eq('is_read', false)
    setUnreadNotifCount(count ?? 0)
  }, [])

  useEffect(() => {
    if (!user) {
      setCurrentProfile(null)
      setProfileLoading(false)
      return
    }

    setProfileLoading(true)
    fetchProfile(user.id)
    fetchUnreadCount(user.id)

    const channel = supabase
      .channel(`social-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => setUnreadNotifCount(n => n + 1)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, fetchProfile, fetchUnreadCount])

  const followUser = useCallback(async (targetId: string) => {
    if (!user) return
    await supabase.from('follows').insert({ follower_id: user.id, following_id: targetId })
  }, [user])

  const unfollowUser = useCallback(async (targetId: string) => {
    if (!user) return
    await supabase.from('follows').delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetId)
  }, [user])

  const likePost = useCallback(async (postId: string) => {
    if (!user) return
    await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
  }, [user])

  const unlikePost = useCallback(async (postId: string) => {
    if (!user) return
    await supabase.from('likes').delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
  }, [user])

  const markNotifsRead = useCallback(async () => {
    if (!user) return
    await supabase.from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setUnreadNotifCount(0)
  }, [user])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await fetchProfile(user.id)
  }, [user, fetchProfile])

  return (
    <SocialContext.Provider value={{
      currentProfile,
      profileLoading,
      unreadNotifCount,
      followUser,
      unfollowUser,
      likePost,
      unlikePost,
      markNotifsRead,
      refreshProfile,
    }}>
      {children}
    </SocialContext.Provider>
  )
}
