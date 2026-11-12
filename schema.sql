
-- ============================================================
-- MINDVAULT
-- Initial Supabase / PostgreSQL database schema
-- ============================================================
--
-- IMPORTANT:
-- 1. Run this in the Supabase SQL Editor.
-- 2. Keep your Supabase service-role key secret.
-- 3. Never store passwords in this file.
-- 4. Enable and verify RLS before using the application.
-- 5. This is the initial foundation, not the entire production
--    database or a substitute for a security audit.
--
-- ============================================================


-- ------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------

create extension if not exists pgcrypto;


-- ------------------------------------------------------------
-- 2. ADMIN ALLOWLIST
-- ------------------------------------------------------------
-- Only database administrators should be able to modify this.
-- The table is not readable or writable by ordinary users.
-- The approved email is the one specified for MindVault.

create table if not exists public.admin_allowlist (
    email text primary key,
    created_at timestamptz not null default now(),

    constraint admin_allowlist_email_lowercase
        check (email = lower(email))
);

insert into public.admin_allowlist (email)
values ('anantataneja4@gmail.com')
on conflict (email) do nothing;

alter table public.admin_allowlist enable row level security;

revoke all on public.admin_allowlist
from anon, authenticated;


-- ------------------------------------------------------------
-- 3. USER PROFILES
-- ------------------------------------------------------------

create table if not exists public.profiles (
    id uuid primary key references auth.users(id)
        on delete cascade,

    display_name text,
    role text not null default 'user'
        check (role in ('user', 'admin')),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;


-- ------------------------------------------------------------
-- 4. ADMIN ROLE VERIFICATION
-- ------------------------------------------------------------
-- The role is assigned by the database, not by frontend input.
-- A user cannot promote their own profile to admin.
--
-- SECURITY DEFINER functions use a fixed search_path.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles p
        where p.id = (select auth.uid())
          and p.role = 'admin'
    );
$$;

revoke all on function public.is_admin() from public;

grant execute on function public.is_admin()
to authenticated;


-- ------------------------------------------------------------
-- 5. PROFILE CREATION AND ROLE ASSIGNMENT
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    assigned_role text;
begin
    assigned_role := 'user';

    if exists (
        select 1
        from public.admin_allowlist a
        where a.email = lower(new.email)
    ) then
        assigned_role := 'admin';
    end if;

    insert into public.profiles (
        id,
        role
    )
    values (
        new.id,
        assigned_role
    )
    on conflict (id) do update
    set role = excluded.role,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert or update of email
on auth.users
for each row
execute procedure public.handle_new_user();


-- ------------------------------------------------------------
-- 6. PROFILE POLICIES
-- ------------------------------------------------------------

drop policy if exists "Users can view their own profile"
on public.profiles;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (
    id = (select auth.uid())
    or (select public.is_admin())
);

drop policy if exists "Admins can update profiles"
on public.profiles;

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Ordinary users may update their display name only.
revoke update on public.profiles from authenticated;

grant update (display_name)
on public.profiles
to authenticated;


-- ------------------------------------------------------------
-- 7. PRIVATE DIARY NOTEBOOKS
-- ------------------------------------------------------------

create table if not exists public.diary_notebooks (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references auth.users(id)
        on delete cascade,

    title text not null default 'My Notebook',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.diary_notebooks enable row level security;

drop policy if exists "Owners manage their notebooks"
on public.diary_notebooks;

create policy "Owners manage their notebooks"
on public.diary_notebooks
for all
to authenticated
using (
    user_id = (select auth.uid())
)
with check (
    user_id = (select auth.uid())
);


-- ------------------------------------------------------------
-- 8. PRIVATE DIARY ENTRIES
-- ------------------------------------------------------------

create table if not exists public.diary_entries (
    id uuid primary key default gen_random_uuid(),

    notebook_id uuid not null
        references public.diary_notebooks(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    title text not null default 'Untitled Entry',
    content text not null default '',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists diary_entries_user_id_idx
on public.diary_entries(user_id);

create index if not exists diary_entries_notebook_id_idx
on public.diary_entries(notebook_id);

alter table public.diary_entries enable row level security;

drop policy if exists "Owners manage their diary entries"
on public.diary_entries;

create policy "Owners manage their diary entries"
on public.diary_entries
for all
to authenticated
using (
    user_id = (select auth.uid())
    and exists (
        select 1
        from public.diary_notebooks n
        where n.id = notebook_id
          and n.user_id = (select auth.uid())
    )
)
with check (
    user_id = (select auth.uid())
    and exists (
        select 1
        from public.diary_notebooks n
        where n.id = notebook_id
          and n.user_id = (select auth.uid())
    )
);


-- ------------------------------------------------------------
-- 9. PHILOSOPHY ARCHIVE
-- ------------------------------------------------------------

create table if not exists public.philosophy_articles (
    id uuid primary key default gen_random_uuid(),

    slug text unique not null,
    title text not null,
    category text not null default 'Philosophy',

    introduction text not null default '',
    definition text not null default '',
    history text not null default '',
    arguments_for text not null default '',
    arguments_against text not null default '',
    thinkers_and_works text not null default '',
    examples text not null default '',
    critical_questions text not null default '',
    further_reading text not null default '',
    references_text text not null default '',

    status text not null default 'draft'
        check (status in ('draft', 'published', 'archived')),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.philosophy_articles enable row level security;

drop policy if exists "Published philosophy is readable"
on public.philosophy_articles;

create policy "Published philosophy is readable"
on public.philosophy_articles
for select
to anon, authenticated
using (
    status = 'published'
    or (select public.is_admin())
);

drop policy if exists "Admins manage philosophy"
on public.philosophy_articles;

create policy "Admins manage philosophy"
on public.philosophy_articles
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 10. PHILOSOPHY SUBMISSIONS
-- ------------------------------------------------------------

create table if not exists public.philosophy_submissions (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    title text not null,
    content text not null,

    display_anonymously boolean not null default true,

    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected')),

    created_at timestamptz not null default now(),
    reviewed_at timestamptz
);

alter table public.philosophy_submissions enable row level security;

drop policy if exists "Users manage their own submissions"
on public.philosophy_submissions;

create policy "Users manage their own submissions"
on public.philosophy_submissions
for select
to authenticated
using (
    user_id = (select auth.uid())
    or (select public.is_admin())
);

drop policy if exists "Users create submissions"
on public.philosophy_submissions;

create policy "Users create submissions"
on public.philosophy_submissions
for insert
to authenticated
with check (
    user_id = (select auth.uid())
    and status = 'pending'
);

drop policy if exists "Admins review submissions"
on public.philosophy_submissions;

create policy "Admins review submissions"
on public.philosophy_submissions
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 11. DAILY IDEAS
-- ------------------------------------------------------------

create table if not exists public.daily_ideas (
    id uuid primary key default gen_random_uuid(),

    title text not null,
    category text not null
        check (
            category in (
                'Philosophy',
                'Psychology',
                'Neuroscience'
            )
        ),

    explanation text not null,
    example text not null default '',
    application text not null default '',
    references_text text not null default '',

    scheduled_date date unique,
    status text not null default 'draft'
        check (status in ('draft', 'published', 'archived')),

    created_at timestamptz not null default now()
);

alter table public.daily_ideas enable row level security;

drop policy if exists "Published daily ideas are readable"
on public.daily_ideas;

create policy "Published daily ideas are readable"
on public.daily_ideas
for select
to anon, authenticated
using (
    status = 'published'
    or (select public.is_admin())
);

drop policy if exists "Admins manage daily ideas"
on public.daily_ideas;

create policy "Admins manage daily ideas"
on public.daily_ideas
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 12. PERCEPTION LAB
-- ------------------------------------------------------------

create table if not exists public.perception_exercises (
    id uuid primary key default gen_random_uuid(),

    title text not null,
    category text not null,
    scenario text not null,

    options jsonb not null default '[]'::jsonb,
    explanation text not null default '',
    evidence_notes text not null default '',
    limitations text not null default '',

    status text not null default 'draft'
        check (status in ('draft', 'published', 'archived')),

    created_at timestamptz not null default now()
);

alter table public.perception_exercises enable row level security;

drop policy if exists "Published perception exercises are readable"
on public.perception_exercises;

create policy "Published perception exercises are readable"
on public.perception_exercises
for select
to anon, authenticated
using (
    status = 'published'
    or (select public.is_admin())
);

drop policy if exists "Admins manage perception exercises"
on public.perception_exercises;

create policy "Admins manage perception exercises"
on public.perception_exercises
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 13. DEBATE TOPICS
-- ------------------------------------------------------------

create table if not exists public.debate_topics (
    id uuid primary key default gen_random_uuid(),

    title text not null,
    category text not null
        check (
            category in (
                'Philosophy',
                'Psychology',
                'Neuroscience'
            )
        ),

    central_question text not null,
    description text not null default '',

    status text not null default 'scheduled'
        check (
            status in (
                'scheduled',
                'active',
                'closed',
                'archived'
            )
        ),

    starts_at timestamptz,
    ends_at timestamptz,

    created_at timestamptz not null default now()
);

alter table public.debate_topics enable row level security;

drop policy if exists "Debate topics are readable"
on public.debate_topics;

create policy "Debate topics are readable"
on public.debate_topics
for select
to authenticated
using (true);

drop policy if exists "Admins manage debate topics"
on public.debate_topics;

create policy "Admins manage debate topics"
on public.debate_topics
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 14. DEBATE REPLIES
-- ------------------------------------------------------------

create table if not exists public.debate_replies (
    id uuid primary key default gen_random_uuid(),

    topic_id uuid not null
        references public.debate_topics(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    parent_reply_id uuid
        references public.debate_replies(id)
        on delete cascade,

    content text not null,

    display_anonymously boolean not null default false,

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'approved',
                'removed'
            )
        ),

    created_at timestamptz not null default now()
);

create index if not exists debate_replies_topic_id_idx
on public.debate_replies(topic_id);

alter table public.debate_replies enable row level security;

drop policy if exists "Approved debate replies are readable"
on public.debate_replies;

create policy "Approved debate replies are readable"
on public.debate_replies
for select
to authenticated
using (
    status = 'approved'
    or user_id = (select auth.uid())
    or (select public.is_admin())
);

drop policy if exists "Authenticated users can submit replies"
on public.debate_replies;

create policy "Authenticated users can submit replies"
on public.debate_replies
for insert
to authenticated
with check (
    user_id = (select auth.uid())
    and status = 'pending'
);

drop policy if exists "Admins moderate debate replies"
on public.debate_replies;

create policy "Admins moderate debate replies"
on public.debate_replies
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 15. ANONYMOUS DIARY
-- ------------------------------------------------------------

create table if not exists public.anonymous_diary_entries (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    content text not null,

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'approved',
                'rejected',
                'removed'
            )
        ),

    created_at timestamptz not null default now(),
    reviewed_at timestamptz
);

alter table public.anonymous_diary_entries
enable row level security;

drop policy if exists "Approved anonymous entries are readable"
on public.anonymous_diary_entries;

create policy "Approved anonymous entries are readable"
on public.anonymous_diary_entries
for select
to anon, authenticated
using (
    status = 'approved'
    or user_id = (select auth.uid())
    or (select public.is_admin())
);

drop policy if exists "Users submit anonymous entries"
on public.anonymous_diary_entries;

create policy "Users submit anonymous entries"
on public.anonymous_diary_entries
for insert
to authenticated
with check (
    user_id = (select auth.uid())
    and status = 'pending'
);

drop policy if exists "Admins moderate anonymous entries"
on public.anonymous_diary_entries;

create policy "Admins moderate anonymous entries"
on public.anonymous_diary_entries
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 16. CONTENT REPORTS
-- ------------------------------------------------------------

create table if not exists public.content_reports (
    id uuid primary key default gen_random_uuid(),

    reporter_id uuid not null
        references auth.users(id)
        on delete cascade,

    content_type text not null,
    content_id uuid not null,
    reason text not null,

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'reviewed',
                'dismissed',
                'action_taken'
            )
        ),

    created_at timestamptz not null default now(),
    reviewed_at timestamptz
);

alter table public.content_reports enable row level security;

drop policy if exists "Users submit reports"
on public.content_reports;

create policy "Users submit reports"
on public.content_reports
for insert
to authenticated
with check (
    reporter_id = (select auth.uid())
    and status = 'pending'
);

drop policy if exists "Users view their reports"
on public.content_reports;

create policy "Users view their reports"
on public.content_reports
for select
to authenticated
using (
    reporter_id = (select auth.uid())
    or (select public.is_admin())
);

drop policy if exists "Admins manage reports"
on public.content_reports;

create policy "Admins manage reports"
on public.content_reports
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 17. ACCOUNT DELETION REQUESTS
-- ------------------------------------------------------------

create table if not exists public.deletion_requests (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    requested_at timestamptz not null default now(),
    scheduled_deletion_at timestamptz not null,

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'cancelled',
                'completed'
            )
        ),

    cancelled_at timestamptz,
    completed_at timestamptz
);

alter table public.deletion_requests enable row level security;

drop policy if exists "Users view their deletion requests"
on public.deletion_requests;

create policy "Users view their deletion requests"
on public.deletion_requests
for select
to authenticated
using (
    user_id = (select auth.uid())
    or (select public.is_admin())
);

drop policy if exists "Users create deletion requests"
on public.deletion_requests;

create policy "Users create deletion requests"
on public.deletion_requests
for insert
to authenticated
with check (
    user_id = (select auth.uid())
    and status = 'pending'
);

drop policy if exists "Users cancel their deletion requests"
on public.deletion_requests;

create policy "Users cancel their deletion requests"
on public.deletion_requests
for update
to authenticated
using (
    user_id = (select auth.uid())
    and status = 'pending'
)
with check (
    user_id = (select auth.uid())
    and status = 'cancelled'
);

drop policy if exists "Admins manage deletion requests"
on public.deletion_requests;

create policy "Admins manage deletion requests"
on public.deletion_requests
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));


-- ------------------------------------------------------------
-- 18. INDEXES
-- ------------------------------------------------------------

create index if not exists philosophy_articles_status_idx
on public.philosophy_articles(status);

create index if not exists daily_ideas_status_date_idx
on public.daily_ideas(status, scheduled_date);

create index if not exists perception_exercises_status_idx
on public.perception_exercises(status);

create index if not exists debate_topics_status_idx
on public.debate_topics(status);

create index if not exists anonymous_diary_status_idx
on public.anonymous_diary_entries(status);

create index if not exists deletion_requests_user_idx
on public.deletion_requests(user_id);


-- ------------------------------------------------------------
-- 19. END
-- ------------------------------------------------------------
--
-- This schema does not yet implement:
-- - Supabase Auth configuration and email delivery.
-- - Secure admin login UI and session verification endpoints.
-- - OTP expiry, resend limits and attempt limits.
-- - Automated 15-day deletion processing.
-- - Monthly experiment scheduling and result delivery.
-- - File storage for diary backgrounds.
-- - Full moderation workflows and notifications.
-- - All remaining content collections.
--
-- These require additional backend configuration and testing.
--
-- Do not describe the application as production-secure merely
-- because this SQL has been installed.
-- ============================================================
