-- Final hardening after the new Vercel image-processing endpoint is deployed and tested.
-- This prevents photo_uploader accounts from bypassing server-side re-encoding.

drop policy if exists "media bucket: photo uploaders upload images only" on storage.objects;

-- Private bucket reads are checked against the corresponding authorized media row.
-- Admin access remains provided by "media bucket: administradores control total".
drop policy if exists "media bucket: miembros leen" on storage.objects;
drop policy if exists "media bucket: miembros leen media autorizada" on storage.objects;
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
