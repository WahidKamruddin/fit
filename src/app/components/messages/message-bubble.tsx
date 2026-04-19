import Link from 'next/link'
import type { MessageRow } from '@/src/app/types/social'

interface Props {
  message: MessageRow
  isMine: boolean
  outfitImages?: string[]  // first image(s) of the shared outfit
}

function timeStr(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function MessageBubble({ message, isMine, outfitImages }: Props) {
  return (
    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} gap-0.5 max-w-[75%] ${isMine ? 'self-end' : 'self-start'}`}>

      {/* Outfit share card */}
      {message.outfit_id && (
        <Link href={`/outfits`}>
          <div className={`rounded-2xl overflow-hidden border border-mocha-200 mb-1 w-40 ${isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
            {outfitImages && outfitImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-0.5 bg-mocha-100">
                {outfitImages.slice(0, 4).map((url, i) => (
                  <img key={i} src={url} alt="outfit piece" className="w-full h-12 object-contain bg-white p-1" />
                ))}
              </div>
            ) : (
              <div className="h-16 bg-mocha-100 flex items-center justify-center">
                <span className="text-[9px] tracking-[0.3em] uppercase text-mocha-300">Outfit</span>
              </div>
            )}
            <div className="px-2 py-1.5 bg-white">
              <p className="text-[8px] tracking-[0.25em] uppercase text-mocha-400">Shared outfit</p>
            </div>
          </div>
        </Link>
      )}

      {/* Text body */}
      {message.body && (
        <div className={`px-4 py-2.5 max-w-full ${
          isMine
            ? 'bg-mocha-500 text-mocha-100 rounded-3xl rounded-br-md'
            : 'bg-mocha-100 text-mocha-500 rounded-3xl rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed break-words">{message.body}</p>
        </div>
      )}

      <p className="text-[8px] text-mocha-300 px-1">{timeStr(message.created_at)}</p>
    </div>
  )
}
