import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import type { NotificationCard } from '@/src/app/types/social'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function notifHref(n: NotificationCard): string {
  switch (n.type) {
    case 'follow':  return `/profile/${n.actor.username}`
    case 'like':    return `/post/${n.entity_id}`
    case 'comment': return `/post/${n.entity_id}`
    case 'message': return `/messages/${n.entity_id}`
  }
}

function notifText(n: NotificationCard): string {
  switch (n.type) {
    case 'follow':  return 'followed you'
    case 'like':    return 'liked your post'
    case 'comment': return 'commented on your post'
    case 'message': return 'sent you a message'
  }
}

export default function NotificationItem({ notif }: { notif: NotificationCard }) {
  const initials = (notif.actor?.display_name ?? notif.actor?.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Link href={notifHref(notif)}>
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors duration-150 hover:bg-mocha-100/50 ${!notif.is_read ? 'bg-mocha-100/30' : ''}`}>
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={notif.actor.avatar_url ?? ''} />
            <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">{initials}</AvatarFallback>
          </Avatar>
          {!notif.is_read && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-mocha-500 rounded-full border-2 border-off-white-100" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-mocha-500 leading-snug">
            <span className="font-medium">@{notif.actor?.username ?? '—'}</span>
            {' '}{notifText(notif)}
          </p>
          <p className="text-[9px] text-mocha-300 mt-0.5">{timeAgo(notif.created_at)}</p>
        </div>
      </div>
    </Link>
  )
}
