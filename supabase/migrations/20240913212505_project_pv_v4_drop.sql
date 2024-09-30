ALTER TABLE public.projects
ADD COLUMN
IF NOT EXISTS "chain_id" int;
