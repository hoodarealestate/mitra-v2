-- ============================================
-- MITRA 2.0 — AUTH TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique,
  city text,
  province text,
  postal_code text,
  phone text,
  faith text,
  is_verified boolean default false,
  member_since timestamptz default now(),
  membership_expires_at timestamptz,
  role text default 'member',
  bd_id integer,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Service role can do anything"
  on profiles for all using (true);

-- Index
create index if not exists idx_profiles_email on profiles(email);

select 'Auth tables ready ✅' as status;
