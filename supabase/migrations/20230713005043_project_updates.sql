create table "public"."project_updates" (
    "project" text not null,
    "created_at" timestamp with time zone default now(),
    "id" uuid not null default uuid_generate_v4(),
    "poster_user_id" uuid not null,
    "title" text not null,
    "message" text not null,
    "image_url" text
);


alter table "public"."project_updates" enable row level security;

CREATE UNIQUE INDEX project_updates_pkey ON public.project_updates USING btree (project, id);

alter table "public"."project_updates" add constraint "project_updates_pkey" PRIMARY KEY using index "project_updates_pkey";

alter table "public"."project_updates" add constraint "project_updates_poster_user_id_fkey" FOREIGN KEY (poster_user_id) REFERENCES users(id) not valid;

alter table "public"."project_updates" validate constraint "project_updates_poster_user_id_fkey";

alter table "public"."project_updates" add constraint "project_updates_project_fkey" FOREIGN KEY (project) REFERENCES projects(id) not valid;

alter table "public"."project_updates" validate constraint "project_updates_project_fkey";

create policy "Enable read access for all users"
on "public"."project_updates"
as permissive
for select
to public
using (true);



