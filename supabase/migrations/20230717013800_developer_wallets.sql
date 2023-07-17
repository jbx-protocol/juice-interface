create table "public"."developer_wallets" (
    "wallet" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."developer_wallets" enable row level security;

CREATE UNIQUE INDEX developer_wallets_pkey ON public.developer_wallets USING btree (wallet);

alter table "public"."developer_wallets" add constraint "developer_wallets_pkey" PRIMARY KEY using index "developer_wallets_pkey";

create policy "Enable read access for all users"
on "public"."developer_wallets"
as permissive
for select
to public
using (true);



