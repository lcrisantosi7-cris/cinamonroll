-- Final hardening after the new Vercel image-processing endpoint is deployed and tested.
-- This prevents photo_uploader accounts from bypassing server-side re-encoding.
-- The existing Storage SELECT policy is intentionally left unchanged here because
-- the media bucket also allows audio/video; audit those paths before narrowing reads.

drop policy if exists "media bucket: photo uploaders upload images only" on storage.objects;
