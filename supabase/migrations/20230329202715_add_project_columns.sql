alter table public.project_subscriptions 
drop COLUMN "project_id";

alter table public.projects 
alter COLUMN "id" type text,
add COLUMN "handle" text,
add COLUMN "projectId" int,
add COLUMN "pv" char(1),
add COLUMN "currentBalance" char(32),
add COLUMN "trendingScore" char(32),
add COLUMN "totalPaid" char(32),
add COLUMN "paymentsCount" int,
add COLUMN "terminal" char(42),
add COLUMN "deployer" char(42),
add COLUMN "createdAt" int,
add COLUMN "name" text,
add COLUMN "description" text,
add COLUMN "logoUri" text,
add COLUMN "metadataUri" text,
add COLUMN "tags" text[],
add COLUMN "archived" boolean,
add COLUMN "_lastUpdated" bigint,
add COLUMN "_hasUnresolvedMetadata" boolean,
add COLUMN "_metadataRetriesLeft" int,
add COLUMN "_v" text;

alter table public.project_subscriptions 
add COLUMN "project_id" text not null references public.projects(id);
