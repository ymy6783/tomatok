-- Optional: keep old WordPress-style ids for URL compatibility
-- Run in Supabase SQL Editor before importing notices

alter table public.notices
  add column if not exists slug text;

create unique index if not exists notices_slug_uidx
  on public.notices (slug)
  where slug is not null;
