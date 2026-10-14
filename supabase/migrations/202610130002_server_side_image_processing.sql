-- Staging bucket for originals that must be decoded and re-encoded by the Vercel API.
-- Apply this migration before deploying the frontend that calls /api/process-image.

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
