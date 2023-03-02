create schema juice_auth;

grant usage on schema juice_auth to service_role;
grant all on schema juice_auth to postgres;

-- Tables

create table if not exists public.users(
  id uuid not null primary key references auth.users(id) on delete cascade,
  wallet text not null unique,
  email text,
  email_verified boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.users enable row level security;
create policy "Can view own user data."
  on public.users
  for select
  using ( auth.jwt() ->> 'sub' = id::text);
create policy "Can update own user data."
  on public.users
  for update
  using ( auth.jwt() ->> 'sub' = id::text);

create table if not exists juice_auth.signing_requests
(
  wallet_id text not null,
  nonce uuid not null,
  challenge_message text not null,
  expires_at timestamptz default timezone('utc'::text, now() + interval '1 hour') not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint signing_requests_pkey primary key (wallet_id, nonce)
);
grant all on table juice_auth.signing_requests to postgres;
grant all on table juice_auth.signing_requests to service_role;

create table if not exists public.projects
(
  id bigint not null primary key
);

create table if not exists public.notifications
(
  id uuid not null default uuid_generate_v4() primary key
);

create table if not exists public.project_subscriptions
(
  project_id bigint not null references public.projects(id),
  user_id uuid not null references public.users(id),
  notification_id uuid not null references public.notifications(id),
  constraint project_subscriptions_pkey primary key (project_id, user_id, notification_id)
);
alter table public.project_subscriptions enable row level security;
create policy "Can view own user data."
  on public.project_subscriptions
  for select using (
    exists (
      select *
      from public.users
      where public.users.email = auth.jwt() ->> 'email'
    )
  );
create policy "Can update own user data."
  on public.project_subscriptions
  for update using (
    exists (
      select *
      from public.users
      where public.users.email = auth.jwt() ->> 'email'
    )
  );

create function public.handle_email_update()
returns trigger as $$
begin
  if new.email != old.email then
    update public.users
      set email = new.email, email_verified = true
      where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_email_update();