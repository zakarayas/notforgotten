-- Volunteer availability: table + RLS. Run this ENTIRE script once in Supabase SQL Editor.

-- 1. Create the table (safe to run if table already exists)
create table if not exists public.volunteer_availability (
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

comment on table public.volunteer_availability is 'Volunteer signups: availability and services offered. Approved rows show on Volunteer page.';

-- 2. Enable RLS
alter table public.volunteer_availability enable row level security;

-- 3. Policies (run only once; if you run again you may need to drop policies first in a separate query)
create policy "Anyone can insert volunteer_availability"
  on public.volunteer_availability for insert
  with check (true);

create policy "Public can read approved volunteer_availability"
  on public.volunteer_availability for select
  using (approved = true);

create policy "Authenticated can read all volunteer_availability"
  on public.volunteer_availability for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can update volunteer_availability"
  on public.volunteer_availability for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can delete volunteer_availability"
  on public.volunteer_availability for delete
  using (auth.role() = 'authenticated');
