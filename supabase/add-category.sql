-- Add / update category on existing notices table

alter table public.notices
  add column if not exists category text not null default 'general';

alter table public.notices
  drop constraint if exists notices_category_check;

alter table public.notices
  add constraint notices_category_check
  check (category in (
    'general', 'upgrade', 'shareholder', 'urgent'
  ));

create index if not exists notices_category_idx
  on public.notices (category);
