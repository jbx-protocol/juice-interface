ALTER TABLE public.projects 
DROP CONSTRAINT projects_pv_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_pv_check
CHECK (pv IN ('1', '2', '4'));

ALTER TABLE public.projects
add COLUMN "chain_id" int