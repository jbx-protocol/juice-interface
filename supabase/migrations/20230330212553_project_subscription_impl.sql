drop policy "Can update own user data." on "public"."project_subscriptions";

drop policy "Can view own user data." on "public"."project_subscriptions";

alter table "public"."project_subscriptions" drop constraint "project_subscriptions_notification_id_fkey";

alter table "public"."project_subscriptions" drop constraint "project_subscriptions_project_id_fkey";

alter table "public"."project_subscriptions" drop constraint "project_subscriptions_user_id_fkey";

alter table "public"."notifications" drop constraint "notifications_pkey";

alter table "public"."project_subscriptions" drop constraint "project_subscriptions_pkey";

drop index if exists "public"."notifications_pkey";

drop index if exists "public"."project_subscriptions_pkey";

drop table "public"."notifications";

drop table "public"."project_subscriptions";

create table "public"."user_subscriptions" (
    "project_id" bigint,
    "user_id" uuid not null,
    "notification_id" text not null
);


alter table "public"."user_subscriptions" enable row level security;

CREATE UNIQUE INDEX user_subscriptions_pkey ON public.user_subscriptions USING btree (user_id, notification_id);

alter table "public"."user_subscriptions" add constraint "user_subscriptions_pkey" PRIMARY KEY using index "user_subscriptions_pkey";

create policy "Can perform crud operations."
on "public"."user_subscriptions"
as permissive
for all
to public
using (((auth.jwt() ->> 'sub'::text) = (user_id)::text))
with check (((auth.jwt() ->> 'sub'::text) = (user_id)::text));

alter table "public"."user_subscriptions" add constraint "user_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_subscriptions" validate constraint "user_subscriptions_user_id_fkey";

