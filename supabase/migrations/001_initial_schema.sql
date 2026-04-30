-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_bigm";
create extension if not exists "pg_cron";

-- ============================================================
-- Households
-- ============================================================
create table households (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- Household Members
-- ============================================================
create table household_members (
  household_id uuid references households(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete cascade,
  joined_at    timestamptz default now(),
  primary key (household_id, user_id)
);

-- ============================================================
-- Household Invites
-- ============================================================
create table household_invites (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade,
  token        text unique not null default gen_random_uuid()::text,
  created_by   uuid references auth.users(id),
  expires_at   timestamptz not null default (now() + interval '72 hours'),
  used_at      timestamptz,
  created_at   timestamptz default now()
);

-- ============================================================
-- Nodes (items, locations, containers - unified)
-- ============================================================
create table nodes (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade not null,
  parent_id    uuid references nodes(id) on delete set null,
  name         text not null,
  type         text not null check (type in ('room','furniture','container','item')),
  description  text,
  photo_url    text,
  qr_uuid      uuid unique,
  position     jsonb,   -- {x, y, w, h} for floor plan grid
  metadata     jsonb,   -- {expiry_date, quantity, unit, serial_number, ...}
  archived     boolean default false,
  archived_at  timestamptz,
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  -- Full-text search vector
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) stored
);

create index nodes_household_idx on nodes(household_id);
create index nodes_parent_idx on nodes(parent_id);
create index nodes_qr_uuid_idx on nodes(qr_uuid);
create index nodes_search_idx on nodes using gin(search_vector);
create index nodes_archived_idx on nodes(household_id, archived);

-- Trigger: update updated_at on change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger nodes_updated_at
  before update on nodes
  for each row execute function update_updated_at();

-- ============================================================
-- Node History
-- ============================================================
create table node_history (
  id             uuid primary key default gen_random_uuid(),
  node_id        uuid references nodes(id) on delete cascade,
  action         text not null check (action in ('created','moved','disposed','renamed','restored')),
  from_parent_id uuid references nodes(id) on delete set null,
  to_parent_id   uuid references nodes(id) on delete set null,
  metadata       jsonb,
  performed_by   uuid references auth.users(id),
  created_at     timestamptz default now()
);

create index node_history_node_idx on node_history(node_id);

-- ============================================================
-- Push Subscriptions
-- ============================================================
create table push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  subscription jsonb not null,
  created_at   timestamptz default now()
);

create index push_subscriptions_user_idx on push_subscriptions(user_id);

-- ============================================================
-- AI Recognition Rate Limit (free plan: 10/day per user)
-- ============================================================
create table ai_recognition_usage (
  user_id    uuid references auth.users(id) on delete cascade,
  date       date not null default current_date,
  count      integer not null default 0,
  primary key (user_id, date)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table households           enable row level security;
alter table household_members    enable row level security;
alter table household_invites    enable row level security;
alter table nodes                enable row level security;
alter table node_history         enable row level security;
alter table push_subscriptions   enable row level security;
alter table ai_recognition_usage enable row level security;

-- Helper: get household_ids for current user
create or replace function my_household_ids()
returns setof uuid as $$
  select household_id from household_members where user_id = auth.uid();
$$ language sql security definer stable;

-- Households: members can read
create policy "households_select" on households
  for select using (id in (select my_household_ids()));

create policy "households_insert" on households
  for insert with check (true);

-- Household members: members can read their household
create policy "household_members_select" on household_members
  for select using (household_id in (select my_household_ids()));

create policy "household_members_insert" on household_members
  for insert with check (true);

-- Household invites: members can read/insert
create policy "household_invites_select" on household_invites
  for select using (household_id in (select my_household_ids()));

create policy "household_invites_insert" on household_invites
  for insert with check (household_id in (select my_household_ids()));

create policy "household_invites_update" on household_invites
  for update using (true);

-- Nodes: household members can do everything
create policy "nodes_select" on nodes
  for select using (household_id in (select my_household_ids()));

create policy "nodes_insert" on nodes
  for insert with check (household_id in (select my_household_ids()));

create policy "nodes_update" on nodes
  for update using (household_id in (select my_household_ids()));

create policy "nodes_delete" on nodes
  for delete using (household_id in (select my_household_ids()));

-- Node history: read only for members
create policy "node_history_select" on node_history
  for select using (
    node_id in (select id from nodes where household_id in (select my_household_ids()))
  );

create policy "node_history_insert" on node_history
  for insert with check (
    node_id in (select id from nodes where household_id in (select my_household_ids()))
  );

-- Push subscriptions: own only
create policy "push_subscriptions_all" on push_subscriptions
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- AI usage: own only
create policy "ai_usage_all" on ai_recognition_usage
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- Cron: Expiry notification check (daily 8:00 JST = 23:00 UTC)
-- ============================================================
select cron.schedule(
  'expiry-check',
  '0 23 * * *',
  $$
    select pg_notify(
      'expiry_check',
      json_build_object('date', current_date)::text
    );
  $$
);
