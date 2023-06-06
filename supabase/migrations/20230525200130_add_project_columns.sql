alter table public.projects 
add COLUMN "owner" char(42) not null,
add COLUMN "creator" char(42) not null,
add COLUMN "contributors_count" int not null,
add COLUMN "redeem_count" int not null,
drop column "total_paid",
add column "volume" char(32) not null,
add COLUMN "volume_usd" char(32) not null,
add COLUMN "trending_volume" char(32) not null,
add COLUMN "trending_payments_count" int not null,
add COLUMN "redeem_volume" char(32) not null,
add COLUMN "redeem_voume_usd" char(32) not null,
add COLUMN "nfts_minted_count" bigint not null,
add COLUMN "created_within_trending_window" boolean not null;