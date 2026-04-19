'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import type { ConversationCard, MessageRow } from '@/src/app/types/social'

interface MessagesContextValue {
  conversations: ConversationCard[]
  messages: Record<string, MessageRow[]>
  totalUnread: number
  openConversation: (id: string) => Promise<void>
  sendMessage: (conversationId: string, body: string, outfitId?: string) => Promise<void>
  getOrCreateConversation: (otherUserId: string) => Promise<string | null>
}

const MessagesContext = createContext<MessagesContextValue>({
  conversations: [],
  messages: {},
  totalUnread: 0,
  openConversation: async () => {},
  sendMessage: async () => {},
  getOrCreateConversation: async () => null,
})

export function useMessages() {
  return useContext(MessagesContext)
}

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const [conversations, setConversations] = useState<ConversationCard[]>([])
  const [messages, setMessages] = useState<Record<string, MessageRow[]>>({})
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0)

  const fetchConversations = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
      .order('last_message_at', { ascending: false })

    if (!data) return

    const enriched: ConversationCard[] = await Promise.all(
      data.map(async (conv) => {
        const otherId = conv.participant_a === uid ? conv.participant_b : conv.participant_a

        const [{ data: profile }, { data: lastMsg }, { count: unread }] = await Promise.all([
          supabase.from('profiles').select('id, username, display_name, avatar_url').eq('id', otherId).single(),
          supabase.from('messages').select('body, outfit_id').eq('conversation_id', conv.id).order('created_at', { ascending: false }).limit(1).single(),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('conversation_id', conv.id).eq('is_read', false).neq('sender_id', uid),
        ])

        const preview = lastMsg?.body ?? (lastMsg?.outfit_id ? '📦 Outfit' : null)

        return {
          ...conv,
          other_user: profile ?? { id: otherId, username: null, display_name: null, avatar_url: null },
          last_message_preview: preview,
          unread_count: unread ?? 0,
        }
      })
    )

    setConversations(enriched)
  }, [])

  useEffect(() => {
    if (!user) { setConversations([]); setMessages({}); return }

    fetchConversations(user.id)

    const channel = supabase
      .channel(`messages-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as MessageRow
          // Append to cached thread if loaded
          setMessages(prev => {
            const thread = prev[msg.conversation_id]
            if (!thread) return prev
            return { ...prev, [msg.conversation_id]: [...thread, msg] }
          })
          // Refresh conversation list to update preview + unread count
          fetchConversations(user.id)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        () => fetchConversations(user.id)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, fetchConversations])

  const openConversation = useCallback(async (id: string) => {
    if (messagesRef.current[id]) return // already cached
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
    setMessages(prev => ({ ...prev, [id]: data ?? [] }))
  }, [])

  const sendMessage = useCallback(async (conversationId: string, body: string, outfitId?: string) => {
    if (!user) return
    const payload: Record<string, unknown> = {
      conversation_id: conversationId,
      sender_id: user.id,
    }
    if (body.trim()) payload.body = body.trim()
    if (outfitId) payload.outfit_id = outfitId

    const { data: msg, error } = await supabase
      .from('messages')
      .insert(payload)
      .select()
      .single()

    if (!error && msg) {
      // Optimistic append (the realtime channel will also fire, dedup is handled by id)
      setMessages(prev => {
        const thread = prev[conversationId] ?? []
        const exists = thread.some(m => m.id === msg.id)
        return exists ? prev : { ...prev, [conversationId]: [...thread, msg] }
      })
    }
  }, [user])

  const getOrCreateConversation = useCallback(async (otherUserId: string): Promise<string | null> => {
    if (!user) return null

    // Enforce participant_a < participant_b ordering
    const [a, b] = [user.id, otherUserId].sort()

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('participant_a', a)
      .eq('participant_b', b)
      .single()

    if (existing) return existing.id

    const { data: created, error } = await supabase
      .from('conversations')
      .insert({ participant_a: a, participant_b: b })
      .select('id')
      .single()

    if (error) { console.error('Failed to create conversation:', error.message); return null }
    return created?.id ?? null
  }, [user])

  return (
    <MessagesContext.Provider value={{
      conversations,
      messages,
      totalUnread,
      openConversation,
      sendMessage,
      getOrCreateConversation,
    }}>
      {children}
    </MessagesContext.Provider>
  )
}
