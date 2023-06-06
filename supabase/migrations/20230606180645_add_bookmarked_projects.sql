create table public.user_bookmarks (
    "project" text not null,
    "user_id" uuid not null,
    "wallet" char(42) not null,
    "created_at" timestamptz default timezone('utc'::text, now()) not null
);

alter table public.user_bookmarks enable row level security;

CREATE UNIQUE INDEX user_bookmarks_pkey ON public.user_bookmarks USING btree (project, user_id);

alter table public.user_bookmarks add constraint user_bookmarks_pkey PRIMARY KEY using index user_bookmarks_pkey;

create policy "Can perform crud operations."
on public.user_bookmarks
as permissive
for all
to public
using (((auth.jwt() ->> 'sub'::text) = (user_id)::text))
with check (((auth.jwt() ->> 'sub'::text) = (user_id)::text));

alter table public.user_bookmarks add constraint user_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table public.user_bookmarks validate constraint user_bookmarks_user_id_fkey;
