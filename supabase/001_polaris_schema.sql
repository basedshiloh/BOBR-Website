-- Polaris CMS schema for plain PostgreSQL.
-- Run in Coolify's PostgreSQL service → SQL editor, or via psql:
--   psql $DATABASE_URL < supabase/001_polaris_schema.sql

-- ── Posts ─────────────────────────────────────────────────
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
  status text default 'draft',
  intent text default 'informational',
  is_pillar boolean default false,
  pillar_id uuid,
  seo_score integer default 0,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_posts_status on posts(status, published_at desc);
create index if not exists idx_posts_slug on posts(slug);

-- ── API keys ──────────────────────────────────────────────
create table if not exists cms_api_keys (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  revoked boolean default false,
  created_at timestamptz default now(),
  last_used_at timestamptz
);

create index if not exists idx_api_keys_hash on cms_api_keys(key_hash);

-- ── Comments ──────────────────────────────────────────────
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,
  page_type text not null,
  author_name text not null,
  content text not null,
  hidden boolean default false,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_comments_page on comments(page_id, created_at desc);
