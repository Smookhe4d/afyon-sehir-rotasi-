-- Afyon Şehir Rotası — Supabase şeması (Supabase SQL Editor'de çalıştırın)
-- Rota ve durak içeriği uygulama kodunda (lib/routes.ts) tutulur; veritabanı yalnızca kullanıcıya ait verileri saklar.

create extension if not exists "pgcrypto";

-- Profiller (auth.users ile 1-1)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Gezgin' check (char_length(display_name) between 2 and 40),
  avatar_url text,
  is_guest boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, is_guest)
  values (new.id,
          coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Gezgin'),
          coalesce(new.is_anonymous, false));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Favori rotalar
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  route_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, route_slug)
);

-- Rota ilerlemesi: başlatılan rota ve ziyaret edilen duraklar
create table if not exists public.route_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  route_slug text not null,
  visited_place_ids text[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, route_slug)
);

-- Kullanıcının oluşturduğu rotalar (Rotanı Belirle)
create table if not exists public.custom_routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  place_ids text[] not null check (array_length(place_ids, 1) between 2 and 30),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- Sosyal paylaşımlar
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  route_slug text,
  body text not null check (char_length(body) between 1 and 1000),
  photo_path text,
  created_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (post_id, user_id)
);

-- Rota yorumları (rota sayfasında) ve gönderi yorumları
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  route_slug text,
  post_id uuid references public.posts(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  check ((route_slug is not null) <> (post_id is not null))
);
create index if not exists comments_route_idx on public.comments (route_slug, created_at desc);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.route_progress enable row level security;
alter table public.custom_routes enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.comments enable row level security;

create policy "profiller herkese okunur" on public.profiles for select to authenticated using (true);
create policy "kendi profilini güncelle" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "favoriler kendi" on public.favorites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ilerleme kendi" on public.route_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "rotalar: kendi veya herkese açık oku" on public.custom_routes for select to authenticated using (auth.uid() = user_id or is_public);
create policy "rotalar: kendi yaz" on public.custom_routes for insert to authenticated with check (auth.uid() = user_id);
create policy "rotalar: kendi güncelle" on public.custom_routes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "rotalar: kendi sil" on public.custom_routes for delete to authenticated using (auth.uid() = user_id);

create policy "gönderiler okunur" on public.posts for select to authenticated using (true);
create policy "gönderi yaz" on public.posts for insert to authenticated with check (auth.uid() = user_id);
create policy "gönderi sil" on public.posts for delete to authenticated using (auth.uid() = user_id);

create policy "beğeniler okunur" on public.post_likes for select to authenticated using (true);
create policy "beğeni ekle" on public.post_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "beğeni kaldır" on public.post_likes for delete to authenticated using (auth.uid() = user_id);

create policy "yorumlar okunur" on public.comments for select to authenticated using (true);
create policy "yorum yaz" on public.comments for insert to authenticated with check (auth.uid() = user_id);
create policy "yorum sil" on public.comments for delete to authenticated using (auth.uid() = user_id);

-- Misafir (anonim) kullanıcılar paylaşım ve yorum yazamaz
create or replace function public.is_registered() returns boolean language sql stable as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
$$;
drop policy "gönderi yaz" on public.posts;
create policy "gönderi yaz" on public.posts for insert to authenticated with check (auth.uid() = user_id and public.is_registered());
drop policy "yorum yaz" on public.comments;
create policy "yorum yaz" on public.comments for insert to authenticated with check (auth.uid() = user_id and public.is_registered());

-- Fotoğraf depolama (paylaşım fotoğrafları)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-photos', 'post-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "paylaşım fotoğrafı okunur" on storage.objects for select using (bucket_id = 'post-photos');
create policy "kendi klasörüne yükle" on storage.objects for insert to authenticated
  with check (bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text and public.is_registered());
create policy "kendi dosyasını sil" on storage.objects for delete to authenticated
  using (bucket_id = 'post-photos' and (storage.foldername(name))[1] = auth.uid()::text);
