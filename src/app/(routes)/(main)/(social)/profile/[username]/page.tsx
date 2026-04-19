'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { useSocial } from '@/src/app/providers/socialContext'
import ProfileHeader from '@/src/app/components/social/profile-header'
import PostCollage from '@/src/app/components/social/post-collage'
import PageSkeleton from '@/src/app/components/page-skeleton'
import Link from 'next/link'
import type { ProfileView, PostRow } from '@/src/app/types/social'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const user = useUser()
  const { currentProfile, refreshProfile } = useSocial()

  const [profile, setProfile] = useState<ProfileView | null>(null)
  const [posts, setPosts] = useState<PostRow[]>([])
  const [notFound, setNotFound] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editPublic, setEditPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || !username) return
    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, username])

  const loadProfile = async () => {
    if (!user) return
    const { data: p } = await supabase.from('profiles').select('*').eq('username', username).single()
    if (!p) { setNotFound(true); return }

    const [{ count: followers }, { count: following }, { count: postsCount }, { data: isFollowingRow }, { data: postsData }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', p.id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', p.id),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', p.id),
      supabase.from('follows').select('follower_id').eq('follower_id', user.id).eq('following_id', p.id).single(),
      supabase.from('posts').select('*').eq('user_id', p.id).order('created_at', { ascending: false }),
    ])

    setProfile({
      ...p,
      followers_count: followers ?? 0,
      following_count: following ?? 0,
      posts_count: postsCount ?? 0,
      is_following: !!isFollowingRow,
    })
    setPosts(postsData ?? [])
  }

  const handleSaveEdit = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      display_name: editDisplayName,
      bio: editBio,
      is_public: editPublic,
    }).eq('id', user.id)
    setSaving(false)
    if (!error) {
      setEditModal(false)
      await loadProfile()
      await refreshProfile()
    }
  }

  if (!user) return <PageSkeleton />

  if (notFound) {
    return (
      <div className="min-h-screen bg-off-white-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <span className="font-cormorant text-[6rem] font-light text-mocha-200/60 leading-none block">404</span>
          <p className="font-cormorant text-3xl font-light text-mocha-400">Profile not found.</p>
          <Link href="/feed" className="mt-6 inline-block px-6 py-2.5 border border-mocha-300 text-mocha-400 text-[10px] tracking-[0.35em] uppercase rounded-full hover:border-mocha-500 transition-all">
            Back to feed
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) return <PageSkeleton />

  const isOwn = user.id === profile.id

  return (
    <div className="min-h-screen bg-off-white-100 pt-16">
      <div className="px-4 sm:px-8 lg:px-20 pt-8 pb-12">

        {/* Page header */}
        <div className="flex items-center gap-4 animate-fade-in mb-6" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Social</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Profile</span>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ProfileHeader
            profile={profile}
            isOwnProfile={isOwn}
            onEditProfile={() => {
              setEditDisplayName(profile.display_name ?? '')
              setEditBio(profile.bio ?? '')
              setEditPublic(profile.is_public)
              setEditModal(true)
            }}
          />
        </div>

        <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.2s' }} />

        {/* Private profile gate */}
        {!profile.is_public && !isOwn && (
          <div className="mt-16 text-center">
            <p className="font-cormorant text-3xl font-light text-mocha-400">This profile is private.</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300 mt-2">Follow to see their posts</p>
          </div>
        )}

        {/* Posts grid */}
        {(profile.is_public || isOwn) && (
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <span className="font-cormorant text-[5rem] font-light text-mocha-200/60 leading-none block">00</span>
                <p className="font-cormorant text-2xl font-light text-mocha-400">No posts yet.</p>
                {isOwn && (
                  <Link href="/create-post" className="mt-5 inline-block px-6 py-2.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all">
                    Share a look
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {posts.map(post => (
                  <Link key={post.id} href={`/post/${post.id}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-mocha-100 block">
                    {post.image_urls.length > 0 ? (
                      <img src={post.image_urls[0]} alt="post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] tracking-[0.3em] uppercase text-mocha-300">Outfit</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit profile modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="relative w-full max-w-sm bg-off-white-100 rounded-3xl p-8 shadow-2xl space-y-5">
            <button onClick={() => setEditModal(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 transition-all">
              <span className="text-xs leading-none">✕</span>
            </button>

            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-1">Edit</p>
              <h2 className="font-cormorant text-3xl font-light text-mocha-500">Your <span className="italic text-mocha-400">profile.</span></h2>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Display name</label>
              <input
                type="text"
                value={editDisplayName}
                onChange={e => setEditDisplayName(e.target.value)}
                className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 py-2 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Bio</label>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 resize-none py-2 transition-colors"
              />
              <p className="text-[9px] text-mocha-200 text-right">{editBio.length}/160</p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-mocha-100">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-500">Public profile</p>
                <p className="text-[9px] text-mocha-300">Visible in Discover and searchable</p>
              </div>
              <button
                onClick={() => setEditPublic(p => !p)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${editPublic ? 'bg-mocha-500' : 'bg-mocha-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${editPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
