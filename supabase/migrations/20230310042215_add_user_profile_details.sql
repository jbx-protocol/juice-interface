alter table "public"."users" add column "bio" text;

alter table "public"."users" add column "twitter" text;

alter table "public"."users" add column "website" text;

create or replace view "public"."user_profiles" as  SELECT users.wallet,
    users.created_at,
    users.bio,
    users.website,
    users.twitter,
    users.id
   FROM users;



