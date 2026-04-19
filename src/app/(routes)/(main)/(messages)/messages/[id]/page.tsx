'use client'

import { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { useMessages } from '@/src/app/providers/messagesContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import MessageBubble from '@/src/app/components/messages/message-bubble'
import MessageInput from '@/src/app/components/messages/message-input'
import PageSkeleton from '@/src/app/components/page-skeleton'
import { useState } from 'react'
import type { ConversationCard } from '@/src/app/types/social'

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>()
  const user = useUser()
  const router = useRouter()
  const { messages, openConversation, sendMessage, conversations } = useMessages()
  const [conv, setConv] = useState<ConversationCard | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const thread = messages[id] ?? []

  useEffect(() => {
    if (!user || !id) return
    openConversation(id)

    // Mark incoming messages as read
    supabase.from('messages')
      .update({ is_read: true })
      .eq('conversation_id', id)
      .neq('sender_id', user.id)
      .eq('is_read', false)
      .then(() => {})
  }, [user, id, openConversation])

  // Find conv from context
  useEffect(() => {
    const found = conversations.find(c => c.id === id)
    setConv(found ?? null)
  }, [conversations, id])

  // Scroll to bottom when messages load/arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length])

  const handleSend = (body: string, outfitId?: string) => {
    sendMessage(id, body, outfitId)
  }

  if (!user) return <PageSkeleton />

  const otherUser = conv?.other_user
  const initials = (otherUser?.display_name ?? otherUser?.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="h-screen flex flex-col pt-16 bg-off-white-100">

      {/* Conversation header */}
      <div className="flex-shrink-0 border-b border-mocha-200 px-4 py-3 flex items-center gap-3 bg-off-white-100">
        <button
          onClick={() => router.push('/messages')}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 transition-all"
        >
          <ArrowLeft size={13} />
        </button>

        {otherUser && (
          <>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-mocha-200 text-mocha-500 text-[10px] font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-mocha-500 font-medium leading-none">
                {otherUser.display_name ?? otherUser.username}
              </p>
              <p className="text-[9px] text-mocha-300">@{otherUser.username}</p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {thread.length === 0 && (
          <p className="text-center text-[10px] tracking-[0.3em] uppercase text-mocha-300 pt-8">
            Start the conversation
          </p>
        )}
        {thread.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.sender_id === user.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  )
}
