-- Security hardening: explicit application roles and server-side authorization.
-- Apply this migration in Supabase SQL Editor before relying on the UI role restrictions.
-- Luis is the current verified profile. Assign Lilian after her Auth account/profile exists.

create table if not exists public.app_roles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    role text not null check (role in ('admin', 'photo_uploader')),
    created_at timestamptz not null default now()
);

alter table public.app_roles enable row level security;
revoke all on table public.app_roles from anon, authenticated;

create or replace function public.get_my_app_role()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
    select coalesce(
        (select r.role from public.app_roles r where r.user_id = auth.uid()),
        'member'
    );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
    select exists (
        select 1 from public.app_roles r
        where r.user_id = auth.uid() and r.role = 'admin'
    );
$$;

create or replace function public.is_photo_uploader()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
    select exists (
        select 1 from public.app_roles r
        where r.user_id = auth.uid() and r.role = 'photo_uploader'
    );
$$;

revoke all on function public.get_my_app_role() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_photo_uploader() from public, anon;
grant execute on function public.get_my_app_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_photo_uploader() to authenticated;

-- Luis keeps administrator access.
insert into public.app_roles (user_id, role)
values ('f3f72537-0872-4e36-8186-9caa68ff6f9d', 'admin')
on conflict (user_id) do update set role = 'admin';

-- Admin-only writes for application content. Existing SELECT policies remain in place.
drop policy if exists "audio_tracks: crear" on public.audio_tracks;
drop policy if exists "audio_tracks: editar lo propio" on public.audio_tracks;
drop policy if exists "audio_tracks: admin full access" on public.audio_tracks;
create policy "audio_tracks: admin full access" on public.audio_tracks
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "coupons: crear" on public.coupons;
drop policy if exists "coupons: editar lo propio" on public.coupons;
drop policy if exists "coupons: admin full access" on public.coupons;
create policy "coupons: admin full access" on public.coupons
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "letters: crear" on public.letters;
drop policy if exists "letters: editar lo propio" on public.letters;
drop policy if exists "letters: admin full access" on public.letters;
create policy "letters: admin full access" on public.letters
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cuerpos: crear" on public.letter_bodies;
drop policy if exists "cuerpos: editar" on public.letter_bodies;
drop policy if exists "letter_bodies: admin full access" on public.letter_bodies;
create policy "letter_bodies: admin full access" on public.letter_bodies
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages: crear" on public.messages;
drop policy if exists "messages: editar lo propio" on public.messages;
drop policy if exists "messages: admin full access" on public.messages;
create policy "messages: admin full access" on public.messages
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reasons: crear" on public.reasons;
drop policy if exists "reasons: editar lo propio" on public.reasons;
drop policy if exists "reasons: admin full access" on public.reasons;
create policy "reasons: admin full access" on public.reasons
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contenido: crear" on public.site_content;
drop policy if exists "contenido: editar lo propio" on public.site_content;
drop policy if exists "site_content: admin full access" on public.site_content;
create policy "site_content: admin full access" on public.site_content
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Memories: Luis can manage all records; photo_uploader can only create non-surprise memories.
drop policy if exists "memories: crear" on public.memories;
drop policy if exists "memories: editar lo propio" on public.memories;
drop policy if exists "memories: admin full access" on public.memories;
create policy "memories: admin full access" on public.memories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "memories: photo uploader insert" on public.memories;
create policy "memories: photo uploader insert" on public.memories
for insert to authenticated
with check (
    public.is_photo_uploader()
    and public.is_member()
    and created_by = auth.uid()
    and coalesce(in_surprise, false) = false
);

-- Media rows: photo_uploader can add only processed image variants under their own memory.
drop policy if exists "media: crear" on public.media;
drop policy if exists "media: editar lo propio" on public.media;
drop policy if exists "media: admin full access" on public.media;
create policy "media: admin full access" on public.media
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "media: photo uploader insert images only" on public.media;
create policy "media: photo uploader insert images only" on public.media
for insert to authenticated
with check (
    public.is_photo_uploader()
    and public.is_member()
    and created_by = auth.uid()
    and kind = 'image'
    and path_thumb is not null
    and path_medium is not null
    and path_full is not null
    and path_thumb like auth.uid()::text || '/%'
    and path_medium like auth.uid()::text || '/%'
    and path_full like auth.uid()::text || '/%'
    and lower(path_thumb) ~ '\.(jpg|jpeg|webp|png|avif)$'
    and lower(path_medium) ~ '\.(jpg|jpeg|webp|png|avif)$'
    and lower(path_full) ~ '\.(jpg|jpeg|webp|png|avif)$'
    and exists (
        select 1 from public.memories m
        where m.id = media.memory_id
          and m.created_by = auth.uid()
          and coalesce(m.in_surprise, false) = false
    )
);

-- Profile management is administrator-only; members retain the existing SELECT policy.
drop policy if exists "profiles: admin full access" on public.profiles;
create policy "profiles: admin full access" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage: administrators retain full control. Photo uploaders can only INSERT image files
-- into their own UID folder; there is intentionally no uploader UPDATE/DELETE policy.
drop policy if exists "media bucket: miembros suben a su carpeta" on storage.objects;

drop policy if exists "media bucket: administradores control total" on storage.objects;
create policy "media bucket: administradores control total" on storage.objects
for all to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media bucket: photo uploaders upload images only" on storage.objects;
create policy "media bucket: photo uploaders upload images only" on storage.objects
for insert to authenticated
with check (
    bucket_id = 'media'
    and public.is_photo_uploader()
    and public.is_member()
    and (storage.foldername(name))[1] = (auth.uid())::text
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'avif')
    and lower(coalesce(metadata->>'mimetype', '')) in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
);

-- Lilian assignment (run only after her Auth user and profile have been created):
-- insert into public.app_roles (user_id, role)
-- select p.id, 'photo_uploader'
-- from public.profiles p
-- where lower(p.username) = 'lilian'
-- on conflict (user_id) do update set role = 'photo_uploader';
