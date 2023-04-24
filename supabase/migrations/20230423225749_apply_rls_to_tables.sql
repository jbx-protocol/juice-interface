alter table "public"."contributors" enable row level security;

alter table "public"."projects" enable row level security;

create policy "Enable read access for all users"
on "public"."contributors"
as permissive
for select
to public
using (true);


create policy "all can read"
on "public"."projects"
as permissive
for select
to public
using (true);


create policy "service_role can write/read"
on "public"."projects"
as permissive
for all
to service_role
using (true)
with check (true);



