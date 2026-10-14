-- Server-side image processing for the Vercel API route.
-- Apply this migration in Supabase SQL Editor after deploying the matching application code.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'image-staging',
    'image-staging',
    false,
    41943040,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
    name = excluded.name,
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Originals can only be staged by an authorized uploader in their own UID/memory folder.
drop policy if exists "image staging: uploader insert own files" on storage.objects;
create policy "image staging: uploader insert own files"
on storage.objects for insert to authenticated
with check (
    bucket_id = 'image-staging'
    and public.is_photo_uploader()
    and public.is_member()
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'avif')
    and lower(coalesce(metadata->>'mimetype', '')) in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
);

drop policy if exists "image staging: uploader delete own files" on storage.objects;
create policy "image staging: uploader delete own files"
on storage.objects for delete to authenticated
using (
    bucket_id = 'image-staging'
    and public.is_photo_uploader()
    and public.is_member()
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "image staging: admin full access" on storage.objects;
create policy "image staging: admin full access"
on storage.objects for all to authenticated
using (bucket_id = 'image-staging' and public.is_admin())
with check (bucket_id = 'image-staging' and public.is_admin());

-- Remove direct photo-uploader writes to the final bucket. The Vercel server, using its
-- server-only service-role key, writes only re-encoded WebP variants to the final bucket.
drop policy if exists "media bucket: photo uploaders upload images only" on storage.objects;

-- Keep the bucket private and limit member reads to media records the database authorizes.
-- Admin access remains provided by "media bucket: administradores control total".
drop policy if exists "media bucket: miembros leen" on storage.objects;
create policy "media bucket: miembros leen media autorizada"
on storage.objects for select to authenticated
using (
    bucket_id = 'media'
    and public.is_member()
    and exists (
        select 1
        from public.media m
        where storage.objects.name in (m.path_thumb, m.path_medium, m.path_full)
          and (
              m.created_by = auth.uid()
              or (
                  m.is_active
                  and exists (
                      select 1
                      from public.memories mem
                      where mem.id = m.memory_id
                        and mem.is_active
                        and (
                            not coalesce(mem.in_surprise, false)
                            or public.surprise_unlocked()
                        )
                  )
              )
          )
    )
);
