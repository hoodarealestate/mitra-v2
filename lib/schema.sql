-- ============================================
-- MITRA 2.0 — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- USERS / PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  city text,
  province text,
  postal_code text,
  faith text check (faith in ('Hindu','Sikh','Buddhist','Jain','Ally','Prefer not to say')),
  date_of_birth date,
  avatar_url text,
  is_verified boolean default false,
  verification_paid_at timestamptz,
  member_since timestamptz default now(),
  role text default 'member' check (role in ('member','admin','moderator')),
  created_at timestamptz default now()
);

-- BUSINESS DIRECTORY
create table if not exists businesses (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade,
  business_name text not null,
  category text not null,
  description text,
  city text not null,
  province text not null,
  postal_code text,
  website text,
  phone text,
  email text,
  faith text,
  is_active boolean default false,
  created_at timestamptz default now()
);

-- DHARMIC CERTIFICATIONS
create table if not exists certifications (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references businesses(id) on delete cascade,
  owner_id uuid references profiles(id) on delete cascade,
  tier text default 'certified' check (tier in ('certified','champion','partner')),
  status text default 'pending' check (status in ('pending','under_review','approved','rejected','expired')),
  referring_org_code text,
  zeffy_payment_id text,
  amount_paid numeric default 100,
  applied_at timestamptz default now(),
  approved_at timestamptz,
  expires_at timestamptz,
  reviewed_by uuid references profiles(id),
  notes text
);

-- CONNECT BOARD POSTS
create table if not exists connect_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade,
  category text not null check (category in (
    'Sports & Games','Arts & Culture','Study Groups',
    'Family','Food & Cooking','Wellness',
    'Professional','Seva','Events','Other'
  )),
  title text not null,
  description text not null,
  city text not null,
  province text not null,
  contact_method text,
  contact_value text,
  is_paid boolean default false,
  is_active boolean default true,
  expires_at timestamptz default (now() + interval '30 days'),
  created_at timestamptz default now()
);

-- Auto-purge expired posts function
create or replace function purge_expired_posts()
returns void as $$
  delete from connect_posts where expires_at < now();
$$ language sql;

-- CIVIC CONNECT
create table if not exists civic_listings (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references profiles(id) on delete cascade,
  full_name text not null,
  election_level text check (election_level in ('Federal','Provincial','Municipal','School Board')),
  riding_name text not null,
  postal_code text not null,
  federal_riding text,
  provincial_riding text,
  party text,
  platform_statement text,
  contact_website text,
  contact_email text,
  listing_type text check (listing_type in ('basic','featured','riding_wide','bundle')),
  status text default 'pending' check (status in ('pending','active','expired','rejected')),
  zeffy_payment_id text,
  amount_paid numeric,
  is_active boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ADVERTISEMENTS
create table if not exists advertisements (
  id uuid default gen_random_uuid() primary key,
  advertiser_id uuid references profiles(id),
  business_name text not null,
  ad_text text not null,
  website text,
  city_target text,
  ad_type text check (ad_type in ('basic','featured')),
  amount_paid numeric,
  status text default 'pending' check (status in ('pending','active','expired')),
  is_active boolean default false,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- PARTNER ORGANIZATIONS
create table if not exists partner_orgs (
  id uuid default gen_random_uuid() primary key,
  org_name text not null,
  referral_code text unique not null,
  contact_email text,
  contact_name text,
  city text,
  province text,
  total_referrals integer default 0,
  total_earned numeric default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- CHARITY PARTNERS
create table if not exists charity_partners (
  id uuid default gen_random_uuid() primary key,
  charity_name text not null,
  description text,
  website text,
  contact_email text,
  quarter text,
  year integer,
  amount_received numeric default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- CHAT HISTORY (Mitra AI)
create table if not exists chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  messages jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table businesses enable row level security;
alter table certifications enable row level security;
alter table connect_posts enable row level security;
alter table civic_listings enable row level security;
alter table chat_history enable row level security;

-- POLICIES
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Public can view active businesses" on businesses for select using (is_active = true);
create policy "Owners can manage own business" on businesses for all using (auth.uid() = owner_id);
create policy "Public can view active posts" on connect_posts for select using (is_active = true);
create policy "Verified members can post" on connect_posts for insert with check (auth.uid() = author_id);
create policy "Authors can manage own posts" on connect_posts for all using (auth.uid() = author_id);
create policy "Public can view active civic listings" on civic_listings for select using (is_active = true);
create policy "Users can view own chat history" on chat_history for all using (auth.uid() = user_id);

-- INDEXES
create index if not exists idx_businesses_city on businesses(city);
create index if not exists idx_businesses_category on businesses(category);
create index if not exists idx_connect_posts_city on connect_posts(city);
create index if not exists idx_connect_posts_category on connect_posts(category);
create index if not exists idx_connect_posts_expires on connect_posts(expires_at);
create index if not exists idx_civic_postal on civic_listings(postal_code);
create index if not exists idx_civic_riding on civic_listings(federal_riding);
