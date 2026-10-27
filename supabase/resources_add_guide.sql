-- Allow Guides as a resource category (safe to re-run).
alter table public.resources
  drop constraint if exists resources_category_check;

alter table public.resources
  add constraint resources_category_check
  check (category in ('whitepaper', 'report', 'case_study', 'guide', 'webinar'));
