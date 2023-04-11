alter table public.projects 
alter COLUMN "id" type text;

-- Set default values for id so we can convert column type to not null
update public.projects
set id = '0-0' where id is null;

alter table public.projects 
alter COLUMN "id" set not null,
add COLUMN "handle" text,
add COLUMN "project_id" int not null,
add COLUMN "pv" char(1) check (pv in('1', '2')) not null,
add COLUMN "current_balance" char(32) not null,
add COLUMN "trending_score" char(32) not null,
add COLUMN "total_paid" char(32) not null,
add COLUMN "payments_count" int not null,
add COLUMN "terminal" char(42),
add COLUMN "deployer" char(42),
add COLUMN "created_at" int not null,
add COLUMN "name" text,
add COLUMN "description" text,
add COLUMN "logo_uri" text,
add COLUMN "metadata_uri" text,
add COLUMN "tags" text[],
add COLUMN "archived" boolean,
add COLUMN "_updated_at" bigint not null,
add COLUMN "_has_unresolved_metadata" boolean,
add COLUMN "_metadata_retries_left" int;