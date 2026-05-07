-- Supabase schema for Meritsync onboarding

create type user_role as enum ('TALENT', 'EMPLOYER');
create type onboarding_status as enum ('INCOMPLETE', 'COMPLETE');

create table profiles (
  id uuid primary key references auth.users(id),
  email text,
  user_role user_role,
  onboarding_status onboarding_status not null default 'INCOMPLETE',
  has_accepted_dpdp boolean not null default false,
  review_tokens int not null default 3,
  provider_token text,
  created_at timestamptz not null default now()
);

-- Existing tables...

-- Epic 5: Ethical AI & Manual Governance schemas

create table manual_review_requests (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references profiles(id) not null,
  job_id uuid references jobs(id) not null,
  justification text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  unique(candidate_id, job_id)
);

create table bias_audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references manual_review_requests(id),
  employer_id uuid references profiles(id) not null,
  ai_score int not null,
  human_decision text not null, -- 'APPROVED' / 'REJECTED'
  recruiter_reason text not null,
  anonymized_metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- RLS for HITL
alter table manual_review_requests enable row level security;
create policy "Appeals are viewable by owner" on manual_review_requests
  for select using (auth.uid() = candidate_id);
create policy "Appeals are insertable by owner" on manual_review_requests
  for insert with check (auth.uid() = candidate_id);
create policy "Appeals are viewable by employer" on manual_review_requests
  for select using (
    exists (
      select 1 from jobs where jobs.id = manual_review_requests.job_id and jobs.employer_id = auth.uid()
    )
  );

alter table bias_audit_logs enable row level security;
create policy "Audit logs are viewable by everyone" on bias_audit_logs
  for select using (true);


create table compliance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  consent_version text not null,
  hashed_ip text not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Profiles can be selected by owner" on profiles
  for select using (auth.uid() = id);
create policy "Profiles can be inserted by owner" on profiles
  for insert with check (auth.uid() = id);
create policy "Profiles can be updated by owner" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

alter table compliance_audit_logs enable row level security;
create policy "Audit logs can be inserted by owner" on compliance_audit_logs
  for insert with check (auth.uid() = user_id);
create policy "Audit logs can be selected by owner" on compliance_audit_logs
  for select using (auth.uid() = user_id);

-- Epic 1: Core Intelligence & Data Ingestion schemas

create type opportunity_type as enum ('FULL_TIME', 'FREELANCE_FLEX', 'GATED');
create type signal_type as enum ('FULL_TIME', 'FREELANCE');

create table jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references profiles(id), -- Null if scraped from external
  title text not null,
  company text not null,
  description text not null,
  location text,
  apply_url text,
  scraped_at timestamptz default now()
);

create table match_scores (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references profiles(id) not null,
  job_id uuid references jobs(id) not null,
  hard_skills_score int not null default 0,
  experience_score int not null default 0,
  domain_score int not null default 0,
  verification_score int not null default 0,
  total_score int not null default 0,
  xai_notes jsonb,
  opportunity_type opportunity_type not null default 'GATED',
  created_at timestamptz not null default now(),
  unique(candidate_id, job_id)
);

create table social_signals (
  id uuid primary key default gen_random_uuid(),
  signal_type signal_type not null,
  context text not null,
  profile_url text,
  extracted_at timestamptz not null default now()
);

-- RLS for jobs
alter table jobs enable row level security;
create policy "Jobs are viewable by everyone" on jobs
  for select using (true);
create policy "Employers can insert jobs" on jobs
  for insert with check (auth.uid() = employer_id);

-- RLS for match_scores
alter table match_scores enable row level security;
create policy "Match scores are viewable by candidate" on match_scores
  for select using (auth.uid() = candidate_id);
-- In production, employers would also be able to see match_scores for their jobs.
-- Hardened RLS for match_scores: Recruiters can only see 75%+ or those who pitched.
create policy "Match scores are viewable by job employer" on match_scores
  for select using (
    exists (
      select 1 from jobs where jobs.id = match_scores.job_id and jobs.employer_id = auth.uid()
    ) 
    and (
      total_score >= 75 or
      exists (
        select 1 from freelance_pitches 
        where freelance_pitches.job_id = match_scores.job_id 
        and freelance_pitches.candidate_id = match_scores.candidate_id
      )
    )
  );

-- RLS for social_signals
alter table social_signals enable row level security;
create policy "Social signals are viewable by everyone" on social_signals
  for select using (true);

-- Epic 3: Employer Command Center schemas

create table company_profiles (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references profiles(id) not null,
  company_name text not null,
  career_page_url text,
  legal_boilerplate text, -- Standard T&Cs
  settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(employer_id)
);

create table sow_audit_history (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid references freelance_pitches(id) not null,
  edited_by uuid references profiles(id) not null,
  previous_content text not null,
  new_content text not null,
  created_at timestamptz not null default now()
);


-- RLS for company_profiles
alter table company_profiles enable row level security;
create policy "Company profiles are viewable by owner" on company_profiles
  for select using (auth.uid() = employer_id);
create policy "Company profiles are insertable by owner" on company_profiles
  for insert with check (auth.uid() = employer_id);
create policy "Company profiles are updatable by owner" on company_profiles
  for update using (auth.uid() = employer_id);


create table freelance_pitches (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references profiles(id) not null,
  job_id uuid references jobs(id) not null,
  pitch_content text not null,
  suitability_score float not null,
  status text not null default 'PENDING',
  suggested_rate text,
  suggested_timeline text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(candidate_id, job_id)
);


-- RLS for freelance_pitches
alter table freelance_pitches enable row level security;
create policy "Pitches are viewable by owner" on freelance_pitches
  for select using (auth.uid() = candidate_id);
create policy "Pitches are insertable by owner" on freelance_pitches
  for insert with check (auth.uid() = candidate_id);
create policy "Pitches are viewable by employer" on freelance_pitches
  for select using (
    exists (
      select 1 from jobs where jobs.id = freelance_pitches.job_id and jobs.employer_id = auth.uid()
    )
  );


-- DPDP 2023: Immutable Audit Log Trigger
create function prevent_audit_deletion()
returns trigger as 
begin
  raise exception 'DPDP 2023 Compliance: Audit logs are immutable and cannot be deleted or updated.';
end;
 language plpgsql;

create trigger tr_immutable_audit
before update or delete on compliance_audit_logs
for each row execute function prevent_audit_deletion();

-- Gamified Quests & AI Coach Tables
create table skill_verifications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references profiles(id) not null,
  skill_name text not null,
  status text check (status in ('UNVERIFIED', 'VERIFIED')) default 'UNVERIFIED',
  quest_score int,
  created_at timestamptz not null default now()
);

create table interview_simulations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references profiles(id) not null,
  type text check (type in ('STRESS', 'BEHAVIORAL')),
  resilience_score int,
  feedback_json jsonb,
  created_at timestamptz not null default now()
);
