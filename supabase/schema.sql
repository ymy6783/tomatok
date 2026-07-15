-- TomaTok notices board
-- Run this first in Supabase → SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  full_title text,
  content text not null default '',
  content_html text,
  title_en text,
  content_en text not null default '',
  content_html_en text,
  category text not null default 'general'
    check (category in (
      'general', 'upgrade', 'shareholder', 'urgent'
    )),
  links text[] not null default '{}',
  images text[] not null default '{}',
  slug text,
  published_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists notices_slug_uidx
  on public.notices (slug)
  where slug is not null;

-- Existing projects: run once
-- alter table public.notices
--   add column if not exists category text not null default 'general';

create index if not exists notices_published_at_idx
  on public.notices (published_at desc);

alter table public.notices enable row level security;

-- Public read for published notices
drop policy if exists "Public can read published notices" on public.notices;
create policy "Public can read published notices"
  on public.notices
  for select
  to anon, authenticated
  using (is_published = true);

-- Only logged-in users can insert/update/delete (admin)
drop policy if exists "Authenticated can insert notices" on public.notices;
create policy "Authenticated can insert notices"
  on public.notices
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update notices" on public.notices;
create policy "Authenticated can update notices"
  on public.notices
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete notices" on public.notices;
create policy "Authenticated can delete notices"
  on public.notices
  for delete
  to authenticated
  using (true);
