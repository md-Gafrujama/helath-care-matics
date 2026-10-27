-- HealthMatics gated resources (white papers, reports, case studies, webinars).
-- Run in Supabase SQL Editor. Safe to re-run.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- resources
-- ---------------------------------------------------------------------------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null
    check (category in ('whitepaper', 'report', 'case_study', 'guide', 'webinar')),
  vertical text not null,
  slug text not null unique,
  seo jsonb not null default '{}'::jsonb,
  overview text,
  pdf_path text,
  pdf_url text,
  cover_path text,
  cover_url text,
  form_config jsonb not null default '{}'::jsonb,
  offered_by text not null default 'HealthMatics',
  author_name text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_status_category_idx
  on public.resources (status, category, published_at desc);
create index if not exists resources_vertical_idx on public.resources (vertical);

-- ---------------------------------------------------------------------------
-- resource_downloads
-- ---------------------------------------------------------------------------
create table if not exists public.resource_downloads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources (id) on delete cascade,
  email text not null,
  fields jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  profile_completed boolean not null default false,
  marketing_consent boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resource_downloads_resource_id_idx
  on public.resource_downloads (resource_id);
create index if not exists resource_downloads_email_idx
  on public.resource_downloads (email);
create unique index if not exists resource_downloads_resource_email_uidx
  on public.resource_downloads (resource_id, email);

-- ---------------------------------------------------------------------------
-- subscriber lead-source columns (JSON fallback still supported in app code)
-- ---------------------------------------------------------------------------
alter table public.subscribers
  add column if not exists source_type text;
alter table public.subscribers
  add column if not exists source_slug text;
alter table public.subscribers
  add column if not exists source_title text;

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

drop trigger if exists resource_downloads_set_updated_at on public.resource_downloads;
create trigger resource_downloads_set_updated_at
  before update on public.resource_downloads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.resources enable row level security;
alter table public.resource_downloads enable row level security;

drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read" on public.resources
  for select using (status = 'published');

drop policy if exists "resources_admin_all" on public.resources;
create policy "resources_admin_all" on public.resources
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "resource_downloads_admin_all" on public.resource_downloads;
create policy "resource_downloads_admin_all" on public.resource_downloads
  for all using (public.is_admin()) with check (public.is_admin());

grant select on public.resources to anon, authenticated;
grant all on public.resources to service_role;
grant all on public.resource_downloads to service_role;
grant select on public.resource_downloads to authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket (public) for PDF + cover
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources',
  'resources',
  true,
  52428800,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "resources_storage_public_read" on storage.objects;
create policy "resources_storage_public_read" on storage.objects
  for select using (bucket_id = 'resources');

drop policy if exists "resources_storage_admin_write" on storage.objects;
create policy "resources_storage_admin_write" on storage.objects
  for all using (
    bucket_id = 'resources' and public.is_admin()
  ) with check (
    bucket_id = 'resources' and public.is_admin()
  );

notify pgrst, 'reload schema';
