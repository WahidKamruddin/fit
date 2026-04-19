import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import Link from 'next/link'
import type { CommentCard } from '@/src/app/types/social'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function CommentItem({ comment }: { comment: CommentCard }) {
  const initials = (comment.author?.display_name ?? comment.author?.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex gap-3">
      <Link href={`/profile/${comment.author?.username}`} className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author?.avatar_url ?? ''} />
          <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[9px] font-semibold">{initials}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <Link href={`/profile/${comment.author?.username}`}>
            <span className="text-[10px] tracking-[0.2em] uppercase text-mocha-500 font-medium hover:text-mocha-400 transition-colors">
              {comment.author?.username ?? 'Unknown'}
            </span>
          </Link>
          <span className="text-[9px] text-mocha-300">{timeAgo(comment.created_at)}</span>
        </div>
        <p className="text-sm text-mocha-500 leading-relaxed mt-0.5">{comment.body}</p>
      </div>
    </div>
  )
}
