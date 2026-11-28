-- G-027: Tur kayıtları, misafirlerin adıyla paylaşımı, bildirme ve yönetimden kaldırma.
-- Güvenle tekrar çalıştırılabilir.

-- 1) Tur kayıtları (anonim, kişisel veri yok)
create table if not exists public.tour_events (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('tur_basla','durak','tur_bitir','ses_basla','ses_bitir','anket')),
  route_slug text not null check (char_length(route_slug) <= 80),
  stop_id text check (stop_id is null or char_length(stop_id) <= 80),
  mode text check (mode is null or char_length(mode) <= 20),
  role text check (role is null or role in ('bireysel','lider','uye')),
  value integer,
  sid text not null check (char_length(sid) <= 40),
  happened_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists tour_events_route_idx on public.tour_events (route_slug, happened_at desc);
alter table public.tour_events enable row level security;
drop policy if exists "tur olayi ekle" on public.tour_events;
create policy "tur olayi ekle" on public.tour_events for insert to anon, authenticated
  with check (happened_at > now() - interval '7 days' and happened_at < now() + interval '1 hour');
drop policy if exists "tur olayi oku" on public.tour_events;
create policy "tur olayi oku" on public.tour_events for select to authenticated using (public.is_admin());

create or replace function public.admin_tour_stats(since timestamptz default now() - interval '30 days')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare r jsonb;
begin
  if not public.is_admin() then raise exception 'yetki yok'; end if;
  select jsonb_build_object(
    'routes', coalesce((select jsonb_agg(x order by x->>'started' desc) from (
      select jsonb_build_object('slug', route_slug,
        'started', count(distinct sid) filter (where kind = 'tur_basla'),
        'finished', count(distinct sid) filter (where kind = 'tur_bitir'),
        'group', count(distinct sid) filter (where kind = 'tur_basla' and role in ('lider','uye')),
        'audio_start', count(*) filter (where kind = 'ses_basla'),
        'audio_end', count(*) filter (where kind = 'ses_bitir'),
        'survey', count(distinct sid) filter (where kind = 'anket')) as x
      from public.tour_events where happened_at >= since group by route_slug) t), '[]'::jsonb),
    'stops', coalesce((select jsonb_agg(y order by (y->>'n')::int) from (
      select jsonb_build_object('slug', route_slug, 'stop', stop_id, 'n', min(value), 'visitors', count(distinct sid)) as y
      from public.tour_events where kind = 'durak' and happened_at >= since group by route_slug, stop_id) s), '[]'::jsonb)
  ) into r;
  return r;
end $$;

-- 2) Misafir kullanıcılar da adlarıyla paylaşım ve yorum yapabilir
drop policy if exists "gönderi yaz" on public.posts;
create policy "gönderi yaz" on public.posts for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "yorum yaz" on public.comments;
create policy "yorum yaz" on public.comments for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "kendi klasörüne yükle" on storage.objects;
create policy "kendi klasörüne yükle" on storage.objects for insert to authenticated
  with check (bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 3) Yönetici uygunsuz paylaşım, yorum ve fotoğrafı kaldırabilir
drop policy if exists "gönderi sil" on public.posts;
create policy "gönderi sil" on public.posts for delete to authenticated using (auth.uid() = user_id or public.is_admin());
drop policy if exists "yorum sil" on public.comments;
create policy "yorum sil" on public.comments for delete to authenticated using (auth.uid() = user_id or public.is_admin());
drop policy if exists "kendi dosyasını sil" on storage.objects;
create policy "kendi dosyasını sil" on storage.objects for delete to authenticated
  using (bucket_id = 'post-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- 4) Bildirme: kullanıcılar uygunsuz paylaşımı yöneticiye bildirir
create table if not exists public.post_reports (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.post_reports enable row level security;
drop policy if exists "bildir" on public.post_reports;
create policy "bildir" on public.post_reports for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "bildirim oku" on public.post_reports;
create policy "bildirim oku" on public.post_reports for select to authenticated using (public.is_admin() or auth.uid() = user_id);
