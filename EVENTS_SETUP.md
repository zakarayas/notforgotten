# Events table (Supabase)

Outreach volunteers and facilities can add upcoming events (meal service, shelter intake, etc.). Events appear on the **Events** page after approval.

## 1. Create the `events` table

In Supabase: **SQL Editor** → **New query**, run:

```sql
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  city text not null,
  contact_phone text,
  contact_email text,
  created_at timestamptz default now(),
  approved boolean default false,
  reviewed_at timestamptz
);

-- Optional: add a comment
comment on table public.events is 'Upcoming outreach events (meals, shelter, etc.) submitted by volunteers/facilities.';
```

Run the query.

## 2. Row Level Security (RLS)

Enable RLS and add policies so that:

- **Anyone** can insert a new event (volunteers/facilities don’t need an account).
- **Anyone** can read events that are approved.
- **Authenticated users** (e.g. admin) can read all events and update/delete for moderation.

In **SQL Editor** → **New query**, run:

```sql
alter table public.events enable row level security;

-- Anyone can insert (submit an event).
create policy "Anyone can insert events"
  on public.events for insert
  with check (true);

-- Anyone can read approved events.
create policy "Public can read approved events"
  on public.events for select
  using (approved = true);

-- Authenticated users can read all events (for admin).
create policy "Authenticated can read all events"
  on public.events for select
  using (auth.role() = 'authenticated');

-- Authenticated users can update (e.g. approve, edit).
create policy "Authenticated can update events"
  on public.events for update
  using (auth.role() = 'authenticated');

-- Authenticated users can delete (remove event).
create policy "Authenticated can delete events"
  on public.events for delete
  using (auth.role() = 'authenticated');
```

Run the query.

## 3. Optional: moderate events in the admin UI

You can add an “Events” section to the existing admin page (`#/admin`) to approve or remove events, similar to the message board. The table columns are: `id`, `title`, `description`, `event_date`, `city`, `contact_phone`, `contact_email`, `created_at`, `approved`, `reviewed_at`.
