-- ============================================================
-- Social Features Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      text UNIQUE,               -- null until onboarding modal completes
  display_name  text,
  avatar_url    text,
  bio           text CHECK (char_length(bio) <= 160),
  is_public     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id);

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing users
INSERT INTO public.profiles (id, display_name, avatar_url)
SELECT
  id,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ── follows ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS follows_follower_idx  ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_idx ON public.follows(following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_select" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "follows_insert" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_delete" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);


-- ── posts ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  outfit_id       uuid REFERENCES public.outfits(id) ON DELETE SET NULL,
  caption         text CHECK (char_length(caption) <= 280),
  image_urls      text[] NOT NULL DEFAULT '{}',
  vibes           text[] NOT NULL DEFAULT '{}',
  likes_count     int NOT NULL DEFAULT 0,
  comments_count  int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_user_created_idx ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_vibes_idx        ON public.posts USING GIN (vibes);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select" ON public.posts
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = user_id AND p.is_public = true
    )
  );

CREATE POLICY "posts_insert" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_update" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "posts_delete" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);


-- ── likes ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.likes (
  post_id     uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "likes_select" ON public.likes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "likes_insert" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- Maintain posts.likes_count
CREATE OR REPLACE FUNCTION public.handle_like_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = new.post_id;
  -- Notify post owner
  INSERT INTO public.notifications (user_id, actor_id, type, entity_id)
  SELECT p.user_id, new.user_id, 'like', new.post_id
  FROM public.posts p
  WHERE p.id = new.post_id AND p.user_id <> new.user_id;
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_like_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = old.post_id;
  RETURN old;
END;
$$;

DROP TRIGGER IF EXISTS on_like_insert ON public.likes;
CREATE TRIGGER on_like_insert
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_insert();

DROP TRIGGER IF EXISTS on_like_delete ON public.likes;
CREATE TRIGGER on_like_delete
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_delete();


-- ── comments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body        text NOT NULL CHECK (char_length(body) <= 500),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_post_idx ON public.comments(post_id, created_at ASC);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select" ON public.comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "comments_insert" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Maintain posts.comments_count + notify post owner
CREATE OR REPLACE FUNCTION public.handle_comment_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = new.post_id;
  INSERT INTO public.notifications (user_id, actor_id, type, entity_id)
  SELECT p.user_id, new.user_id, 'comment', new.post_id
  FROM public.posts p
  WHERE p.id = new.post_id AND p.user_id <> new.user_id;
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_comment_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = old.post_id;
  RETURN old;
END;
$$;

DROP TRIGGER IF EXISTS on_comment_insert ON public.comments;
CREATE TRIGGER on_comment_insert
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_insert();

DROP TRIGGER IF EXISTS on_comment_delete ON public.comments;
CREATE TRIGGER on_comment_delete
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_delete();


-- ── conversations ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_b   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (participant_a, participant_b),
  CONSTRAINT ordered_participants CHECK (participant_a < participant_b)
);

CREATE INDEX IF NOT EXISTS conversations_a_idx   ON public.conversations(participant_a);
CREATE INDEX IF NOT EXISTS conversations_b_idx   ON public.conversations(participant_b);
CREATE INDEX IF NOT EXISTS conversations_time_idx ON public.conversations(last_message_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_all" ON public.conversations
  FOR ALL USING (auth.uid() = participant_a OR auth.uid() = participant_b);


-- ── messages ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body             text CHECK (char_length(body) <= 1000),
  outfit_id        uuid REFERENCES public.outfits(id) ON DELETE SET NULL,
  is_read          boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT message_has_content CHECK (body IS NOT NULL OR outfit_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS messages_conv_idx ON public.messages(conversation_id, created_at ASC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_all" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())
    )
  );

-- Update conversation timestamp + notify recipient
CREATE OR REPLACE FUNCTION public.handle_message_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  recipient_id uuid;
BEGIN
  UPDATE public.conversations
  SET last_message_at = now()
  WHERE id = new.conversation_id;

  -- Determine the other participant
  SELECT CASE
    WHEN participant_a = new.sender_id THEN participant_b
    ELSE participant_a
  END INTO recipient_id
  FROM public.conversations
  WHERE id = new.conversation_id;

  INSERT INTO public.notifications (user_id, actor_id, type, entity_id)
  VALUES (recipient_id, new.sender_id, 'message', new.conversation_id);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_message_insert();


-- ── notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('follow', 'like', 'comment', 'message')),
  entity_id   uuid,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_update" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Notify on new follow
CREATE OR REPLACE FUNCTION public.handle_follow_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, type, entity_id)
  VALUES (new.following_id, new.follower_id, 'follow', new.follower_id);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_follow_insert ON public.follows;
CREATE TRIGGER on_follow_insert
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_follow_insert();


-- ── Storage bucket ────────────────────────────────────────────
-- Run separately if your Supabase project doesn't support bucket creation via SQL.
-- In the Supabase dashboard: Storage → New Bucket → "post-images" → Public bucket ON
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "post_images_insert" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "post_images_select" ON storage.objects
--   FOR SELECT USING (bucket_id = 'post-images');
