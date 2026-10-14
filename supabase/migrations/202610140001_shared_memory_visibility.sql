-- Allow photo uploaders to view all active shared memories, including surprise memories.
-- Regular members remain subject to the existing surprise-unlock requirement.
-- This updates SELECT visibility only; it does not grant additional write permissions.

drop policy if exists "memories: ver" on public.memories;

create policy "memories: ver"
on public.memories
for select
to authenticated
using (
    public.is_member()
    and (
        created_by = auth.uid()
        or (
            is_active
            and (
                public.is_photo_uploader()
                or (
                    not in_surprise
                    or public.surprise_unlocked()
                )
            )
        )
    )
);

comment on policy "memories: ver" on public.memories is
'Members can see their own memories; active shared memories are visible to all members, and photo uploaders can also view active surprise memories.';
