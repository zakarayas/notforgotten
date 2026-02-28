# Admin page setup (message board moderation)

The admin page is at **`#/admin`** (e.g. `https://yoursite.com/#/admin`). It does not appear in the app menu; bookmark or type the URL.

## 1. Create an admin user in Supabase

1. In Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter an **email** and **password** (e.g. your admin email and a strong password).
3. Click **Create user**.

## 2. Allow the admin to read, update, and delete messages (RLS)

In **SQL Editor** → **New query**, run:

```sql
-- Let authenticated users (e.g. your admin) read all messages (including unapproved).
create policy "Authenticated can read all messages"
  on public.messages for select
  using (auth.role() = 'authenticated');

-- Let authenticated users approve messages (update approved, reviewed_at).
create policy "Authenticated can update messages"
  on public.messages for update
  using (auth.role() = 'authenticated');

-- Let authenticated users remove messages (delete).
create policy "Authenticated can delete messages"
  on public.messages for delete
  using (auth.role() = 'authenticated');
```

Run the query, then open the app, go to `#/admin`, sign in with the same email and password, and use **Approve** / **Remove** on the message board.
