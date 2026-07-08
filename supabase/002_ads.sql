-- BOBR ad slots — plain PostgreSQL (no RLS).
-- Run after 001_polaris_schema.sql.

create table if not exists ad_slots (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  placement   text not null,
  type        text not null default 'image' check (type in ('image', 'script')),
  image_url   text default '',
  link_url    text default '',
  html        text default '',
  label       text default 'Sponsored',
  active      boolean not null default true,
  weight      integer not null default 100,
  starts_at   timestamptz,
  ends_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_ad_slots_placement on ad_slots (placement, active);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ad_slots_updated_at on ad_slots;
create trigger trg_ad_slots_updated_at
  before update on ad_slots
  for each row execute function set_updated_at();
