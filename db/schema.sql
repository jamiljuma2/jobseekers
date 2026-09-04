create extension if not exists pgcrypto;
create extension if not exists citext;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext not null unique,
  full_name text not null,
  country text,
  current_title text,
  current_company text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  headline text,
  summary text,
  target_roles text[] not null default '{}',
  target_locations text[] not null default '{}',
  employment_preferences jsonb not null default '{}'::jsonb,
  profile_completeness integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, country, current_title)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'role'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    country = coalesce(excluded.country, public.users.country),
    current_title = coalesce(excluded.current_title, public.users.current_title);

  insert into public.career_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  company text not null,
  title text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  achievements text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  category text,
  level text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  issuer text,
  credential_id text,
  issued_at date,
  expires_at date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  description text,
  url text,
  tech_stack text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  website text,
  country text,
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null,
  base_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references public.employers (id) on delete set null,
  source_id uuid references public.job_sources (id) on delete set null,
  title text not null,
  location text,
  remote_type text not null default 'onsite',
  employment_type text,
  industry text,
  salary_min integer,
  salary_max integer,
  currency text,
  description text,
  requirements jsonb not null default '[]'::jsonb,
  responsibilities jsonb not null default '[]'::jsonb,
  external_url text,
  is_verified boolean not null default false,
  scam_flag_score numeric(4,2) not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  match_score integer not null,
  skills_score integer not null default 0,
  experience_score integer not null default 0,
  title_similarity_score integer not null default 0,
  education_score integer not null default 0,
  location_score integer not null default 0,
  preference_score integer not null default 0,
  semantic_notes jsonb not null default '{}'::jsonb,
  explanation text,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  label text not null,
  file_url text,
  file_type text,
  source text not null default 'upload',
  parsed_data jsonb not null default '{}'::jsonb,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  job_id uuid references public.jobs (id) on delete cascade,
  resume_id uuid references public.resumes (id) on delete set null,
  tone text not null default 'professional',
  content text not null,
  generation_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  resume_id uuid references public.resumes (id) on delete set null,
  cover_letter_id uuid references public.cover_letters (id) on delete set null,
  status text not null default 'saved',
  notes text,
  contact_person_name text,
  contact_person_email text,
  interview_at timestamptz,
  follow_up_at timestamptz,
  applied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_status_check check (
    status in ('saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn')
  )
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications (id) on delete cascade,
  company_research jsonb not null default '{}'::jsonb,
  likely_questions jsonb not null default '[]'::jsonb,
  suggested_answers jsonb not null default '[]'::jsonb,
  star_prompts jsonb not null default '[]'::jsonb,
  mock_score numeric(4,2),
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_jobs (
  user_id uuid not null references public.users (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

create table if not exists public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  keywords text,
  location text,
  work_type text,
  salary_min integer,
  remote_only boolean not null default false,
  channels text[] not null default '{in_app,email}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists experiences_user_id_idx on public.experiences (user_id);
create index if not exists education_user_id_idx on public.education (user_id);
create index if not exists skills_user_id_idx on public.skills (user_id);
create index if not exists certifications_user_id_idx on public.certifications (user_id);
create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists jobs_title_location_idx on public.jobs using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(location, '')));
create index if not exists job_matches_user_id_idx on public.job_matches (user_id);
create index if not exists applications_user_id_status_idx on public.applications (user_id, status);
create index if not exists resumes_user_id_idx on public.resumes (user_id);
create index if not exists cover_letters_user_id_idx on public.cover_letters (user_id);
create index if not exists interviews_application_id_idx on public.interviews (application_id);
create index if not exists job_alerts_user_id_idx on public.job_alerts (user_id);
create index if not exists job_reports_user_id_idx on public.job_reports (user_id);

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_career_profiles_updated_at
before update on public.career_profiles
for each row execute function public.set_updated_at();

create trigger set_experiences_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

create trigger set_education_updated_at
before update on public.education
for each row execute function public.set_updated_at();

create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create trigger set_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_employers_updated_at
before update on public.employers
for each row execute function public.set_updated_at();

create trigger set_job_sources_updated_at
before update on public.job_sources
for each row execute function public.set_updated_at();

create trigger set_jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create trigger set_job_matches_updated_at
before update on public.job_matches
for each row execute function public.set_updated_at();

create trigger set_resumes_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

create trigger set_cover_letters_updated_at
before update on public.cover_letters
for each row execute function public.set_updated_at();

create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create trigger set_interviews_updated_at
before update on public.interviews
for each row execute function public.set_updated_at();

create trigger set_job_alerts_updated_at
before update on public.job_alerts
for each row execute function public.set_updated_at();

create trigger set_job_reports_updated_at
before update on public.job_reports
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.career_profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.projects enable row level security;
alter table public.employers enable row level security;
alter table public.job_sources enable row level security;
alter table public.jobs enable row level security;
alter table public.job_matches enable row level security;
alter table public.resumes enable row level security;
alter table public.cover_letters enable row level security;
alter table public.applications enable row level security;
alter table public.interviews enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.job_alerts enable row level security;
alter table public.job_reports enable row level security;

create policy "users read own profile" on public.users
  for select using (auth.uid() = id);

create policy "users update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "career profiles own rows" on public.career_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "experiences own rows" on public.experiences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "education own rows" on public.education
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "skills own rows" on public.skills
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "certifications own rows" on public.certifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "projects own rows" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "employers public read" on public.employers
  for select using (true);

create policy "job sources public read" on public.job_sources
  for select using (true);

create policy "jobs public read" on public.jobs
  for select using (true);

create policy "job matches own rows" on public.job_matches
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "resumes own rows" on public.resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "cover letters own rows" on public.cover_letters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "applications own rows" on public.applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "interviews own rows" on public.interviews
  for all using (
    exists (
      select 1
      from public.applications applications
      where applications.id = interviews.application_id
        and applications.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.applications applications
      where applications.id = interviews.application_id
        and applications.user_id = auth.uid()
    )
  );

create policy "saved jobs own rows" on public.saved_jobs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "job alerts own rows" on public.job_alerts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "job reports own rows" on public.job_reports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
