-- Polaris CMS — Supabase schema.
-- Run in Supabase Dashboard → SQL Editor → New Query → paste and Run.
-- Creates the three tables Polaris needs: posts, cms_api_keys, comments.

-- ── Posts ────────────────────────────────────────────────
-- The live blog renders from this table (not from markdown files).
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text default '',
  meta_description text default '',
  focus_keyword text default '',
  category text default '',
  author_name text default '',
  author_bio text default '',
  content text default '',
  featured_image text default '',
  featured_image_alt text default '',
  summary jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  reading_time integer default 1,
  status text default 'draft',            -- 'draft' | 'published'
  intent text default 'informational',    -- informational | commercial | transactional | navigational
  is_pillar boolean default false,
  pillar_id uuid,
  seo_score integer default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_posts_status on posts(status, published_at desc);
create index if not exists idx_posts_slug on posts(slug);

alter table posts enable row level security;

-- Public may read published posts only. Admin writes go through the service
-- role key (bypasses RLS), so no write policy is defined here.
drop policy if exists "Public can read published posts" on posts;
create policy "Public can read published posts" on posts
  for select using (status = 'published');

-- ── API keys (application passwords) ─────────────────────
-- Lets agents / external apps publish posts via the REST API.
create table if not exists cms_api_keys (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  key_prefix text not null,     -- e.g. "pp_1a2b3c4d" (shown in the UI)
  key_hash text not null,       -- sha256 of the raw key; the raw key is shown once
  revoked boolean default false,
  created_at timestamptz default now(),
  last_used_at timestamptz
);

create index if not exists idx_api_keys_hash on cms_api_keys(key_hash);

alter table cms_api_keys enable row level security;
-- No public policies: keys are only ever touched via the service role.

-- ── Comments ─────────────────────────────────────────────
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,        -- e.g. "blog-my-post"
  page_type text not null,      -- e.g. "blog"
  author_name text not null,
  content text not null,
  hidden boolean default false,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_comments_page on comments(page_id, created_at desc);

alter table comments enable row level security;

-- Anyone may read visible comments; hidden ones are filtered client-side/admin.
drop policy if exists "Anyone can read comments" on comments;
create policy "Anyone can read comments" on comments for select using (true);

-- Anyone may post a comment (length-guarded). Moderation (hide/delete) happens
-- through the service role in the /api/polaris admin route.
drop policy if exists "Anyone can insert comments" on comments;
create policy "Anyone can insert comments" on comments for insert with check (
  length(author_name) > 0 and length(author_name) <= 50
  and length(content) > 0 and length(content) <= 2000
);
