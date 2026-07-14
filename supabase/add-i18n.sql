-- Add English fields for bilingual notices
alter table public.notices
  add column if not exists title_en text;

alter table public.notices
  add column if not exists content_en text not null default '';

alter table public.notices
  add column if not exists content_html_en text;
