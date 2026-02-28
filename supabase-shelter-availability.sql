-- Shelter availability: facilities submit; public sees approved rows; admin approves/denies.
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists public.shelter_availability (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  total_beds int not null default 0,
  available_beds int not null default 0,
  notes text,
  approved boolean default false,
  reviewed_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

comment on table public.shelter_availability is 'Shelter bed availability submitted by facilities; approved rows shown on Find shelter.';

alter table public.shelter_availability enable row level security;

-- Anyone can insert (facilities submit without an account).
create policy "Anyone can insert shelter availability"
  on public.shelter_availability for insert
  with check (true);

-- Public can read only approved rows (so the app shows live availability).
create policy "Public can read approved shelter availability"
  on public.shelter_availability for select
  using (approved = true);

-- Authenticated (admin) can read all and update/delete for moderation.
create policy "Authenticated can read all shelter availability"
  on public.shelter_availability for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can update shelter availability"
  on public.shelter_availability for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated can delete shelter availability"
  on public.shelter_availability for delete
  using (auth.role() = 'authenticated');

-- If you already created the table earlier, run this to add approval columns:
-- alter table public.shelter_availability add column if not exists approved boolean default false;
-- alter table public.shelter_availability add column if not exists reviewed_at timestamptz;
