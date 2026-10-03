-- Afyon Şehir Rotası — Yönetim paneli, geri bildirim, duyuru ve trafik ölçümü
-- Supabase > SQL Editor'de bir kez çalıştırın. Güvenle tekrar çalıştırılabilir.

-- 1) Yönetici bayrağı (yalnızca SQL Editor / service_role değiştirebilir)
alter table public.profiles add column if not exists is_admin boolean not null default false;

create or replace function public.protect_admin_flag() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.is_admin is distinct from old.is_admin and auth.uid() is not null and coalesce(auth.role(), '') <> 'service_role' then
    new.is_admin := old.is_admin;
  end if;
  return new;
end $$;
drop trigger if exists protect_admin_flag on public.profiles;
create trigger protect_admin_flag before update on public.profiles for each row execute function public.protect_admin_flag();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- 2) Geri bildirim: öneri, şikayet, katkı, hata
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  kind text not null check (kind in ('oneri', 'sikayet', 'katki', 'hata')),
  place_id text check (place_id is null or char_length(place_id) <= 80),
  message text not null check (char_length(message) between 5 and 2000),
  contact text check (contact is null or char_length(contact) <= 120),
  status text not null default 'yeni' check (status in ('yeni', 'inceleniyor', 'cozuldu', 'reddedildi')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.feedback enable row level security;
drop policy if exists "geri bildirim gonder" on public.feedback;
create policy "geri bildirim gonder" on public.feedback for insert to anon, authenticated with check (status = 'yeni');
drop policy if exists "geri bildirim oku" on public.feedback;
create policy "geri bildirim oku" on public.feedback for select to authenticated using (public.is_admin() or user_id = auth.uid());
drop policy if exists "geri bildirim yonet" on public.feedback;
create policy "geri bildirim yonet" on public.feedback for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "geri bildirim sil" on public.feedback;
create policy "geri bildirim sil" on public.feedback for delete to authenticated using (public.is_admin());

-- 3) Duyurular (bilgilendirme)
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 100),
  body text not null check (char_length(body) between 3 and 600),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;
drop policy if exists "duyuru oku" on public.announcements;
create policy "duyuru oku" on public.announcements for select to anon, authenticated using (active or public.is_admin());
drop policy if exists "duyuru yonet" on public.announcements;
create policy "duyuru yonet" on public.announcements for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4) Anonim sayfa görüntüleme olayları (çerezsiz, kişisel veri içermez)
create table if not exists public.events (
  id bigint generated always as identity primary key,
  path text not null check (char_length(path) <= 200),
  sid text check (sid is null or char_length(sid) <= 40),
  created_at timestamptz not null default now()
);
create index if not exists events_created_idx on public.events (created_at desc);
alter table public.events enable row level security;
drop policy if exists "olay ekle" on public.events;
create policy "olay ekle" on public.events for insert to anon, authenticated with check (true);
drop policy if exists "olay oku" on public.events;
create policy "olay oku" on public.events for select to authenticated using (public.is_admin());

-- 5) Yönetici özeti (tek çağrıda)
create or replace function public.admin_stats() returns json
language plpgsql stable security definer set search_path = public as $$
declare r json;
begin
  if not public.is_admin() then raise exception 'yetkisiz'; end if;
  select json_build_object(
    'users', (select count(*) from public.profiles where not is_guest),
    'guests', (select count(*) from public.profiles where is_guest),
    'posts', (select count(*) from public.posts),
    'comments', (select count(*) from public.comments),
    'favorites', (select count(*) from public.favorites),
    'started_routes', (select count(*) from public.route_progress),
    'completed_routes', (select count(*) from public.route_progress where completed_at is not null),
    'feedback_new', (select count(*) from public.feedback where status = 'yeni'),
    'views_today', (select count(*) from public.events where created_at >= date_trunc('day', now())),
    'visitors_today', (select count(distinct sid) from public.events where created_at >= date_trunc('day', now())),
    'views_7d', (select count(*) from public.events where created_at >= now() - interval '7 days'),
    'visitors_7d', (select count(distinct sid) from public.events where created_at >= now() - interval '7 days'),
    'daily', (select coalesce(json_agg(x order by x.d), '[]'::json) from (
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as d, count(*) as views, count(distinct sid) as visitors
        from public.events where created_at >= now() - interval '14 days' group by 1) x),
    'top_pages', (select coalesce(json_agg(y), '[]'::json) from (
        select path, count(*) as views from public.events where created_at >= now() - interval '7 days' group by 1 order by 2 desc limit 10) y)
  ) into r;
  return r;
end $$;
revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;

-- 6) İlk yönetici: kendi e-postanızla kayıt olduktan sonra çalıştırın
-- update public.profiles set is_admin = true where id = (select id from auth.users where email = 'harun032925@gmail.com');
