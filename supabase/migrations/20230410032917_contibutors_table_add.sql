create table "public"."contributors" (
    "id" text not null,
    "name" text not null,
    "avatar_url" text,
    "is_discord_avatar" boolean default false,
    "title" text
);


CREATE UNIQUE INDEX contributors_pkey ON public.contributors USING btree (id);

alter table "public"."contributors" add constraint "contributors_pkey" PRIMARY KEY using index "contributors_pkey";


