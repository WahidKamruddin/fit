export interface ProfileRow {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  is_public: boolean
  created_at: string
}

export interface ProfileView extends ProfileRow {
  followers_count: number
  following_count: number
  posts_count: number
  is_following: boolean
}

export interface PostRow {
  id: string
  user_id: string
  outfit_id: string | null
  caption: string | null
  image_urls: string[]
  vibes: string[]
  likes_count: number
  comments_count: number
  created_at: string
}

export interface PostCard extends PostRow {
  author: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
  is_liked: boolean
}

export interface CommentRow {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
}

export interface CommentCard extends CommentRow {
  author: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
}

export interface ConversationRow {
  id: string
  participant_a: string
  participant_b: string
  last_message_at: string | null
  created_at: string
}

export interface ConversationCard extends ConversationRow {
  other_user: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
  last_message_preview: string | null
  unread_count: number
}

export interface MessageRow {
  id: string
  conversation_id: string
  sender_id: string
  body: string | null
  outfit_id: string | null
  is_read: boolean
  created_at: string
}

export interface NotificationRow {
  id: string
  user_id: string
  actor_id: string
  type: 'follow' | 'like' | 'comment' | 'message'
  entity_id: string | null
  is_read: boolean
  created_at: string
}

export interface NotificationCard extends NotificationRow {
  actor: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
}
