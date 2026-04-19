'use client'

import { useState, useEffect, useCallback } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { useSocial } from '@/src/app/providers/socialContext'
import { useInView } from '@/src/app/hooks/use-in-view'
import PostCard from '@/src/app/components/social/post-card'
import VibeFilterBar from '@/src/app/components/social/vibe-filter-bar'
import UserSearchModal from '@/src/app/components/social/user-search-modal'
import PageSkeleton from '@/src/app/components/page-skeleton'
import Link from 'next/link'
import type { PostCard as PostCardType } from '@/src/app/types/social'
import type { Vibe } from '@/src/app/types/clothing'

const PAGE_SIZE = 20

async function fetchPosts(uid: string, tab: 'following' | 'discover', vibe: Vibe | null, offset: number): Promise<PostCardType[]> {
  let query = supabase
    .from('posts')
    .select('*, author:profiles!posts_user_id_fkey(id, username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (tab === 'following') {
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', uid)
    // Include own posts alongside followed users
    const ids = [uid, ...(follows ?? []).map(f => f.following_id)]
    query = query.in('user_id', ids)
  }

  if (vibe) query = query.contains('vibes', [vibe])

  const { data: posts } = await query
  if (!posts || posts.length === 0) return []

  // Check which posts the current user liked
  const { data: liked } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', uid)
    .in('post_id', posts.map(p => p.id))

  const likedSet = new Set((liked ?? []).map(l => l.post_id))

  return posts.map(p => ({ ...p, is_liked: likedSet.has(p.id) }))
}

export default function FeedPage() {
  const user = useUser()
  const { currentProfile } = useSocial()
  const [tab, setTab] = useState<'following' | 'discover'>('following')
  const [vibe, setVibe] = useState<Vibe | null>(null)
  const [posts, setPosts] = useState<PostCardType[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showSearch, setShowSearch] = useState(false)

  const { ref: sentinelRef, inView } = useInView() as { ref: React.RefObject<HTMLElement>; inView: boolean }

  const load = useCallback(async (reset = false) => {
    if (!user) return
    const offset = reset ? 0 : posts.length
    if (reset) setLoading(true); else setLoadingMore(true)
    const next = await fetchPosts(user.id, tab, vibe, offset)
    if (reset) {
      setPosts(next)
    } else {
      setPosts(prev => [...prev, ...next])
    }
    setHasMore(next.length === PAGE_SIZE)
    setLoading(false)
    setLoadingMore(false)
  }, [user, tab, vibe, posts.length])

  // Reset on tab/vibe change
  useEffect(() => {
    setPosts([])
    setHasMore(true)
    if (user) {
      setLoading(true)
      fetchPosts(user.id, tab, vibe, 0).then(next => {
        setPosts(next)
        setHasMore(next.length === PAGE_SIZE)
        setLoading(false)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, vibe, user])

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  if (!user) return <PageSkeleton />

  return (
    <div className="min-h-screen bg-off-white-100 pt-16">
      {/* Page header */}
      <div className="px-4 sm:px-8 lg:px-20 pt-8">
        <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Social</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">{posts.length} posts</span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1
            className="font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
          >
            Your<br /><span className="italic text-mocha-400">Style Feed.</span>
          </h1>
          <div className="flex items-center gap-2 pb-1 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <Link
              href="/create-post"
              className="flex items-center gap-2 px-5 py-2.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
            >
              <IoMdAdd size={13} />
              Post
            </Link>
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-mocha-300 text-mocha-500 text-[10px] tracking-[0.3em] uppercase rounded-full hover:border-mocha-500 transition-all duration-300"
            >
              Find People
            </button>
          </div>
        </div>
        <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />
      </div>

      <div className="px-4 sm:px-8 lg:px-20 mt-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1">
          {(['following', 'discover'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-[10px] tracking-[0.35em] uppercase transition-all duration-200 ${
                tab === t ? 'bg-mocha-500 text-mocha-100' : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Vibe filter */}
        <VibeFilterBar selected={vibe} onChange={setVibe} />

        {/* Posts */}
        {loading ? (
          <div className="space-y-4 pb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-mocha-100/40 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center py-32 animate-fade-in">
            <span className="font-cormorant text-[6rem] font-light text-mocha-200/60 leading-none select-none">00</span>
            <p className="mt-2 font-cormorant text-3xl font-light text-mocha-400">
              {tab === 'following' ? 'Nothing posted yet.' : 'Nothing here yet.'}
            </p>
            <div className="flex gap-3 mt-8">
              <Link
                href="/create-post"
                className="px-6 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
              >
                Post a Look
              </Link>
              {tab === 'following' && (
                <button
                  onClick={() => setShowSearch(true)}
                  className="px-6 py-3 border border-mocha-300 text-mocha-500 text-[10px] tracking-[0.35em] uppercase rounded-full hover:border-mocha-500 transition-all duration-300"
                >
                  Follow Someone
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-8 max-w-lg mx-auto lg:mx-0">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
            {loadingMore && <div className="h-16 bg-mocha-100/40 rounded-3xl animate-pulse" />}
            <div ref={sentinelRef as React.RefObject<HTMLDivElement>} className="h-1" />
          </div>
        )}
      </div>

      {showSearch && <UserSearchModal onClose={() => setShowSearch(false)} />}
    </div>
  )
}
