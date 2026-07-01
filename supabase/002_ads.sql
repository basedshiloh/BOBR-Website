-- ─── BOBR ad slots ───────────────────────────────────────
-- CMS-managed advertising. An "ad" is assigned to a named placement zone that
-- the frontend renders (see src/cms/ads/placements.ts). `type='image'` shows a
-- banner image linking out; `type='script'` injects an ad-network / Google Ads
-- embed (HTML/JS) into the same zone.

create table if not exists public.ad_slots (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                       -- internal label
  placement   text not null,                       -- zone id, e.g. 'post_before'
  type        text not null default 'image' check (type in ('image', 'script')),
  image_url   text default '',                     -- banner (type='image')
  link_url    text default '',                     -- click-through (type='image')
  html        text default '',                     -- embed markup (type='script')
  label       text default 'Sponsored',            -- disclosure label above the ad
  active      boolean not null default true,
  weight      integer not null default 100,        -- relative rotation weight
  starts_at   timestamptz,                         -- optional schedule window
  ends_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_ad_slots_placement on public.ad_slots (placement, active);

alter table public.ad_slots enable row level security;

-- Public may read only active ads within their scheduling window. Writes have
-- no policy → denied for anon; the service role (server) bypasses RLS.
drop policy if exists "public read active ads" on public.ad_slots;
create policy "public read active ads" on public.ad_slots
  for select
  using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

-- Keep updated_at fresh on write.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ad_slots_updated_at on public.ad_slots;
create trigger trg_ad_slots_updated_at
  before update on public.ad_slots
  for each row execute function public.set_updated_at();
