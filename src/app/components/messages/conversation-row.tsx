import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import type { ConversationCard } from '@/src/app/types/social'

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function ConversationRow({ conv }: { conv: ConversationCard }) {
  const initials = (conv.other_user?.display_name ?? conv.other_user?.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Link href={`/messages/${conv.id}`}>
      <div className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-colors duration-150 hover:bg-mocha-100/50 ${conv.unread_count > 0 ? 'bg-mocha-100/30' : ''}`}>
        <Avatar className="h-11 w-11 flex-shrink-0">
          <AvatarImage src={conv.other_user.avatar_url ?? ''} />
          <AvatarFallback className="bg-mocha-200 text-mocha-500 text-sm font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`text-[11px] tracking-[0.2em] uppercase truncate ${conv.unread_count > 0 ? 'text-mocha-500 font-semibold' : 'text-mocha-500'}`}>
              {conv.other_user?.display_name ?? conv.other_user?.username ?? 'Unknown'}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {conv.unread_count > 0 && (
                <span className="bg-mocha-500 text-mocha-100 text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                  {conv.unread_count}
                </span>
              )}
              <span className="text-[9px] text-mocha-300">{timeAgo(conv.last_message_at)}</span>
            </div>
          </div>
          <p className="text-[10px] text-mocha-300 truncate mt-0.5">
            {conv.last_message_preview ?? 'Start a conversation'}
          </p>
        </div>
      </div>
    </Link>
  )
}
