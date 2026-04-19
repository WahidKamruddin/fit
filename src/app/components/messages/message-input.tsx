'use client'

import { useState } from 'react'
import { Send, Shirt } from 'lucide-react'
import { useCloset } from '@/src/app/providers/closetContext'
import OutfitCard from '@/src/app/components/outfit-card'
import { useUser } from '@/src/app/auth/auth'

interface Props {
  onSend: (body: string, outfitId?: string) => void
}

export default function MessageInput({ onSend }: Props) {
  const user = useUser()
  const { outfits, cards } = useCloset()
  const [body, setBody] = useState('')
  const [showOutfitPicker, setShowOutfitPicker] = useState(false)

  const handleSend = () => {
    const trimmed = body.trim()
    if (!trimmed) return
    onSend(trimmed)
    setBody('')
  }

  const handleOutfitShare = (outfitId: string) => {
    onSend('', outfitId)
    setShowOutfitPicker(false)
  }

  return (
    <div className="border-t border-mocha-200 bg-off-white-100">

      {/* Outfit picker tray */}
      {showOutfitPicker && (
        <div className="px-4 py-3 border-b border-mocha-100">
          <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400 mb-2">Share an outfit</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {outfits.length === 0 ? (
              <p className="text-[10px] text-mocha-300">No outfits saved yet</p>
            ) : outfits.map(outfit => (
              <div
                key={outfit.id}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => handleOutfitShare(outfit.id)}
              >
                <OutfitCard
                  userID={user?.id ?? null}
                  outfit={outfit}
                  clothes={cards}
                  canEdit={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setShowOutfitPicker(s => !s)}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 flex-shrink-0 ${
            showOutfitPicker
              ? 'bg-mocha-500 border-mocha-500 text-mocha-100'
              : 'border-mocha-200 text-mocha-400 hover:border-mocha-400'
          }`}
        >
          <Shirt size={14} />
        </button>

        <input
          type="text"
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Message…"
          className="flex-1 bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 transition-colors duration-200"
        />

        <button
          onClick={handleSend}
          disabled={!body.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-mocha-500 text-mocha-100 hover:bg-mocha-400 transition-all duration-200 flex-shrink-0 disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
