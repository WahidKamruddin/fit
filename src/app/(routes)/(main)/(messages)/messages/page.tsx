'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IoMdAdd } from 'react-icons/io'
import { useUser } from '@/src/app/auth/auth'
import { useMessages } from '@/src/app/providers/messagesContext'
import ConversationRow from '@/src/app/components/messages/conversation-row'
import UserSearchModal from '@/src/app/components/social/user-search-modal'
import PageSkeleton from '@/src/app/components/page-skeleton'

export default function MessagesPage() {
  const user = useUser()
  const { conversations, getOrCreateConversation } = useMessages()
  const router = useRouter()
  const [showSearch, setShowSearch] = useState(false)

  const handleSelectUser = async (userId: string) => {
    const convId = await getOrCreateConversation(userId)
    if (convId) router.push(`/messages/${convId}`)
  }

  if (!user) return <PageSkeleton />

  return (
    <div className="min-h-screen bg-off-white-100 pt-16">
      <div className="px-4 sm:px-8 lg:px-20 pt-8 pb-12">

        {/* Page header */}
        <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Social</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Direct</span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1
            className="font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
          >
            Your<br /><span className="italic text-mocha-400">Messages.</span>
          </h1>
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 pb-1 animate-fade-in"
            style={{ animationDelay: '0.25s' }}
          >
            <IoMdAdd size={13} />
            New Message
          </button>
        </div>
        <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />

        <div className="mt-4 max-w-lg animate-fade-in" style={{ animationDelay: '0.35s' }}>
          {conversations.length === 0 ? (
            <div className="text-center py-24">
              <span className="font-cormorant text-[6rem] font-light text-mocha-200/60 leading-none block">00</span>
              <p className="font-cormorant text-3xl font-light text-mocha-400">No conversations yet.</p>
              <button
                onClick={() => setShowSearch(true)}
                className="mt-8 px-7 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map(conv => <ConversationRow key={conv.id} conv={conv} />)}
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <UserSearchModal
          onClose={() => setShowSearch(false)}
          onSelectUser={handleSelectUser}
          actionLabel="Message"
        />
      )}
    </div>
  )
}
