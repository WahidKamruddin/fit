'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import PostCollage from './post-collage'
import { useSocial } from '@/src/app/providers/socialContext'
import type { PostCard as PostCardType } from '@/src/app/types/social'

interface Props {
  post: PostCardType
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function PostCard({ post }: Props) {
  const { likePost, unlikePost } = useSocial()
  const [liked, setLiked] = useState(post.is_liked)
  const [likeCount, setLikeCount] = useState(post.likes_count)

  const handleLike = async () => {
    if (liked) {
      setLiked(false); setLikeCount(n => n - 1)
      await unlikePost(post.id)
    } else {
      setLiked(true); setLikeCount(n => n + 1)
      await likePost(post.id)
    }
  }

  const authorInitials = (post.author?.display_name ?? post.author?.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-mocha-200/30 border border-mocha-100/60">

      {/* Author header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <Link href={`/profile/${post.author?.username}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.author?.avatar_url ?? ''} />
            <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">{authorInitials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${post.author?.username}`}>
            <p className="text-[11px] tracking-[0.2em] uppercase text-mocha-500 font-medium hover:text-mocha-400 transition-colors">
              {post.author?.display_name ?? post.author?.username ?? 'Unknown'}
            </p>
          </Link>
          <p className="text-[9px] text-mocha-300">@{post.author?.username ?? '—'} · {timeAgo(post.created_at)}</p>
        </div>
      </div>

      {/* Image collage */}
      {post.image_urls.length > 0 && (
        <Link href={`/post/${post.id}`}>
          <div className="px-3">
            <PostCollage images={post.image_urls} />
          </div>
        </Link>
      )}

      {/* Caption */}
      {post.caption && (
        <p className="px-5 pt-3 text-sm text-mocha-500 leading-relaxed">{post.caption}</p>
      )}

      {/* Vibe pills */}
      {post.vibes.length > 0 && (
        <div className="flex flex-wrap gap-1 px-5 pt-2">
          {post.vibes.map(v => (
            <span key={v} className="text-[8px] tracking-[0.25em] uppercase text-mocha-400 border border-mocha-200 px-2 py-0.5 rounded-full">
              {v}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-5 py-4 mt-1">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-mocha-400 hover:text-mocha-500 transition-colors group"
        >
          <Heart
            size={16}
            className={`transition-all duration-200 ${liked ? 'fill-mocha-500 text-mocha-500 scale-110' : 'group-hover:scale-110'}`}
          />
          <span className="text-[10px] tracking-[0.2em]">{likeCount}</span>
        </button>
        <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 text-mocha-400 hover:text-mocha-500 transition-colors">
          <MessageCircle size={16} />
          <span className="text-[10px] tracking-[0.2em]">{post.comments_count}</span>
        </Link>
      </div>
    </div>
  )
}
