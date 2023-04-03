alter table "public"."user_subscriptions" drop constraint "user_subscriptions_pkey";

drop index if exists "public"."user_subscriptions_pkey";

alter table "public"."user_subscriptions" alter column "project_id" set not null;

CREATE UNIQUE INDEX user_subscriptions_pkey ON public.user_subscriptions USING btree (project_id, user_id, notification_id);

alter table "public"."user_subscriptions" add constraint "user_subscriptions_pkey" PRIMARY KEY using index "user_subscriptions_pkey";


