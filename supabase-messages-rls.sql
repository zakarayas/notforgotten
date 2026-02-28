-- Run this in Supabase: SQL Editor → New query → paste → Run
-- Fixes: app can't read messages because Row Level Security (RLS) blocks it.

-- 1. Ensure RLS is enabled on the messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to read approved messages (for Outreach / message board)
CREATE POLICY "Allow read approved messages"
ON messages FOR SELECT
TO anon, authenticated
USING (approved = true);

-- 3. Allow anyone to insert new messages (for Share a message form)
CREATE POLICY "Allow insert messages"
ON messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- If you get "policy already exists" errors, delete the old ones first:
-- DROP POLICY IF EXISTS "Allow read approved messages" ON messages;
-- DROP POLICY IF EXISTS "Allow insert messages" ON messages;
