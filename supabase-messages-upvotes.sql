-- Run in Supabase SQL Editor to add upvotes for messages.
-- 1. Add upvotes column to messages (if it doesn't exist)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS upvotes integer NOT NULL DEFAULT 0;

-- 2. Secure function: only increment upvotes for approved messages (no arbitrary updates)
CREATE OR REPLACE FUNCTION public.increment_message_upvote(msg_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE messages
  SET upvotes = COALESCE(upvotes, 0) + 1
  WHERE id = msg_id AND approved = true;
$$;

-- 3. Allow anonymous and authenticated users to call the function
GRANT EXECUTE ON FUNCTION public.increment_message_upvote(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_message_upvote(uuid) TO authenticated;
