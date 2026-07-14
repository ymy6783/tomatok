-- Public image bucket for notice attachments (run in Supabase SQL Editor)

insert into storage.buckets (id, name, public)
values ('notices', 'notices', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read notice images" on storage.objects;
create policy "Public read notice images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'notices');

drop policy if exists "Auth upload notice images" on storage.objects;
create policy "Auth upload notice images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'notices');

drop policy if exists "Auth update notice images" on storage.objects;
create policy "Auth update notice images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'notices')
  with check (bucket_id = 'notices');

drop policy if exists "Auth delete notice images" on storage.objects;
create policy "Auth delete notice images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'notices');
