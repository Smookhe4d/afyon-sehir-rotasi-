-- G-015: profil fotoğrafı ve hazır avatarlar. Supabase'e uygulandı.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "avatar okunur" on storage.objects for select using (bucket_id = 'avatars');
create policy "kendi avatarını yükle" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text and public.is_registered());
create policy "kendi avatarını güncelle" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "kendi avatarını sil" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
alter table public.profiles drop constraint if exists profiles_avatar_url_check;
alter table public.profiles add constraint profiles_avatar_url_check check (avatar_url is null or avatar_url ~ '^avatar:[a-z0-9-]{1,20}$' or avatar_url ~ '^https://ngtibkfnwmnbynzizcwp\.supabase\.co/storage/v1/object/public/avatars/');
