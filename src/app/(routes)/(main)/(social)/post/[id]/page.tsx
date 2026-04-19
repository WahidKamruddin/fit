'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Send } from 'lucide-react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { useSocial } from '@/src/app/providers/socialContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import PostCollage from '@/src/app/components/social/post-collage'
import CommentItem from '@/src/app/components/social/comment-item'
import Link from 'next/link'
import type { PostCard as PostCardType, CommentCard } from '@/src/app/types/social'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useUser()
  const { likePost, unlikePost } = useSocial()

  const [post, setPost] = useState<PostCardType | null>(null)
  const [comments, setComments] = useState<CommentCard[]>([])
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user || !id) return

    // Fetch post
    supabase
      .from('posts')
      .select('*, author:profiles!posts_user_id_fkey(id, username, display_name, avatar_url)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) return
        setPost(data as PostCardType)
        setLikeCount(data.likes_count)
      })

    // Fetch liked state
    supabase.from('likes').select('post_id').eq('post_id', id).eq('user_id', user.id).single()
      .then(({ data }) => setLiked(!!data))

    // Fetch comments
    supabase
      .from('comments')
      .select('*, author:profiles!comments_user_id_fkey(id, username, display_name, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
      .then(({ data }) => setComments((data ?? []) as CommentCard[]))

    // Realtime comments
    const channel = supabase
      .channel(`post-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${id}` },
        async (payload) => {
          const c = payload.new as { id: string; user_id: string; post_id: string; body: string; created_at: string }
          const { data: author } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url')
            .eq('id', c.user_id)
            .single()
          const enriched: CommentCard = { ...c, author: author ?? { id: c.user_id, username: null, display_name: null, avatar_url: null } }
          setComments(prev => [...prev, enriched])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, id])

  const handleLike = async () => {
    if (!id) return
    if (liked) { setLiked(false); setLikeCount(n => n - 1); await unlikePost(id) }
    else { setLiked(true); setLikeCount(n => n + 1); await likePost(id) }
  }

  const handleComment = async () => {
    if (!user || !id || !draft.trim()) return
    setSubmitting(true)
    const body = draft.trim()
    setDraft('')
    await supabase.from('comments').insert({ post_id: id, user_id: user.id, body })
    setSubmitting(false)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-off-white-100 pt-16 flex items-center justify-center">
        <div className="w-full max-w-lg px-4 space-y-4 animate-pulse">
          <div className="h-8 bg-mocha-100 rounded-full w-32" />
          <div className="h-80 bg-mocha-100 rounded-3xl" />
        </div>
      </div>
    )
  }

  const authorInitials = (post.author.display_name ?? post.author.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-off-white-100 pt-16 pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-mocha-400 hover:text-mocha-500 transition-colors mb-6"
        >
          <ArrowLeft size={13} />
          Back
        </button>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar_url ?? ''} />
              <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">{authorInitials}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${post.author.username}`}>
              <p className="text-[11px] tracking-[0.2em] uppercase text-mocha-500 font-medium hover:text-mocha-400 transition-colors">
                {post.author.display_name ?? post.author.username}
              </p>
            </Link>
            <p className="text-[9px] text-mocha-300">@{post.author.username}</p>
          </div>
        </div>

        {/* Collage */}
        {post.image_urls.length > 0 && <PostCollage images={post.image_urls} />}

        {/* Caption */}
        {post.caption && <p className="text-sm text-mocha-500 leading-relaxed mt-4">{post.caption}</p>}

        {/* Vibes */}
        {post.vibes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.vibes.map(v => (
              <span key={v} className="text-[8px] tracking-[0.25em] uppercase text-mocha-400 border border-mocha-200 px-2 py-0.5 rounded-full">{v}</span>
            ))}
          </div>
        )}

        {/* Like */}
        <button onClick={handleLike} className="flex items-center gap-2 mt-4 text-mocha-400 hover:text-mocha-500 transition-colors">
          <Heart size={17} className={liked ? 'fill-mocha-500 text-mocha-500' : ''} />
          <span className="text-[10px] tracking-[0.2em]">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </button>

        {/* Divider */}
        <div className="my-5 h-px bg-mocha-200" />

        {/* Comments */}
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300 text-center py-4">Be the first to comment</p>
          ) : (
            comments.map(c => <CommentItem key={c.id} comment={c} />)
          )}
        </div>
      </div>

      {/* Fixed comment input */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-mocha-200 bg-off-white-100/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleComment() }}
          placeholder="Add a comment…"
          className="flex-1 bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 transition-colors duration-200"
        />
        <button
          onClick={handleComment}
          disabled={!draft.trim() || submitting}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-mocha-500 text-mocha-100 hover:bg-mocha-400 transition-all duration-200 disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
