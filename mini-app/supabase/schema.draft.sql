-- Черновик схемы для следующего этапа. Пока не применяем.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique not null,
  first_name text not null,
  last_name text,
  username text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  remaining_sessions integer not null default 0 check (remaining_sessions >= 0),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default true
);

create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('ofp', 'sfp', 'stretch')),
  starts_at timestamptz not null,
  duration_min integer not null default 60,
  capacity integer not null default 10,
  location text not null default 'Онлайн · Zoom'
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  training_id uuid not null references public.trainings (id) on delete cascade,
  status text not null default 'booked' check (status in ('booked', 'cancelled', 'attended', 'missed')),
  created_at timestamptz not null default now()
);

create unique index if not exists bookings_active_unique
  on public.bookings (student_id, training_id)
  where status = 'booked';
