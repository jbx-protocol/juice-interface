create schema juice_auth;

grant usage on schema juice_auth to service_role;
grant all on schema juice_auth to postgres;

-- Tables

create table if not exists public.users(
  id text not null primary key,
  wallet text not null unique,
  email text,
  email_verified boolean not null default false,
  created_at timestamp default timezone('utc'::text, now()) not null,
  updated_at timestamp default timezone('utc'::text, now()) not null
);
alter table public.users enable row level security;
create policy "Can view own user data."
  on public.users
  for select
  using ( auth.jwt() ->> 'email' = email);
create policy "Can update own user data."
  on public.users
  for update
  using ( auth.jwt() ->> 'email' = email);

create table if not exists juice_auth.user_passwords
(
  user_id text not null primary key,
  password text not null,
  constraint "user_passwords_user_id_fkey" foreign key (user_id)
    references public.users (id) match simple
    on update no action
    on delete cascade
);

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
  user_id text not null references public.users(id),
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

-- Dummy data

-- Not working currently
-- insert into public.users (id, wallet, email)
-- values
--   ('0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', 'wraeth.dao@gmail.com');

-- insert into juice_auth.user_passwords (user_id, password)
-- values
--   ('0x0000000000000000000000000000000000000000', 'foobar');

-- insert into public.projects(id)
-- values
--   (1);

-- insert into public.notifications
--   default values;

-- insert into public.project_subscriptions (project_id, user_id, notification_id)
-- values
--   (1, '0x0000000000000000000000000000000000000000', select id from public.notifications);