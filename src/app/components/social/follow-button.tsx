'use client'

import { useState } from 'react'
import { useSocial } from '@/src/app/providers/socialContext'

interface Props {
  targetId: string
  initialIsFollowing: boolean
}

export default function FollowButton({ targetId, initialIsFollowing }: Props) {
  const { followUser, unfollowUser } = useSocial()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    if (isFollowing) {
      await unfollowUser(targetId)
      setIsFollowing(false)
    } else {
      await followUser(targetId)
      setIsFollowing(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-5 py-2 text-[10px] tracking-[0.3em] uppercase rounded-full transition-all duration-300 disabled:opacity-50 ${
        isFollowing
          ? 'bg-mocha-500 text-mocha-100 hover:bg-mocha-400'
          : 'border border-mocha-300 text-mocha-500 hover:border-mocha-500'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
