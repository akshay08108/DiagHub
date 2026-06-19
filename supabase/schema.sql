create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

do $$ begin create type public.user_role as enum ('business', 'admin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.business_type as enum ('mechanic', 'electrician', 'store'); exception when duplicate_object then null; end $$;
do $$ begin create type public.application_status as enum ('draft', 'pending_review', 'verified', 'rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_status as enum ('pending', 'paid', 'invite_waived', 'refunded'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null,
  role public.user_role not null default 'business',
  created_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  owner_name text not null check (char_length(owner_name) between 2 and 100),
  type public.business_type not null,
  vehicle_types text[] not null default '{}',
  services text not null,
  contact_phone text not null,
  publish_contact boolean not null default false,
  address text not null,
  pincode text not null check (pincode ~ '^[0-9]{6}$'),
  google_place_id text not null,
  latitude double precision,
  longitude double precision,
  banner_path text not null,
  status public.application_status not null default 'pending_review',
  payment_status public.payment_status not null default 'pending',
  joining_fee integer not null default 250 check (joining_fee in (0, 250)),
  verification_note text,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text unique not null,
  max_uses integer not null default 1 check (max_uses between 1 and 10),
  uses integer not null default 0 check (uses >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  provider_order_id text unique,
  provider_payment_id text unique,
  amount_paise integer not null check (amount_paise in (0, 25000)),
  status public.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

create or replace function public.redeem_invite(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare matched_id uuid;
begin
  select id into matched_id from public.invite_codes
  where code_hash = encode(extensions.digest(upper(trim(p_code)), 'sha256'), 'hex')
    and active = true and uses < max_uses and (expires_at is null or expires_at > now())
  for update skip locked;
  if matched_id is null then return false; end if;
  update public.invite_codes set uses = uses + 1, active = (uses + 1 < max_uses) where id = matched_id;
  return true;
end;
$$;

create or replace function public.check_invite(p_code text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.invite_codes
    where code_hash = encode(extensions.digest(upper(trim(p_code)), 'sha256'), 'hex')
      and active = true and uses < max_uses and (expires_at is null or expires_at > now())
  );
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.invite_codes enable row level security;
alter table public.payments enable row level security;

drop policy if exists "verified businesses are public" on public.businesses;
drop policy if exists "owners see own applications" on public.businesses;
drop policy if exists "owners create own applications" on public.businesses;
drop policy if exists "owners edit non-verified applications" on public.businesses;
drop policy if exists "users create own profile" on public.profiles;
drop policy if exists "users read own profile" on public.profiles;
drop policy if exists "users update own profile" on public.profiles;

create policy "verified businesses are public" on public.businesses for select using (status = 'verified');
create policy "owners see own applications" on public.businesses for select using (auth.uid() = owner_id);
create policy "owners create own applications" on public.businesses for insert with check (auth.uid() = owner_id and status = 'pending_review');
create policy "owners edit non-verified applications" on public.businesses for update using (auth.uid() = owner_id and status in ('draft', 'pending_review'));

create policy "users create own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('business-banners', 'business-banners', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "owners upload business banners" on storage.objects;
drop policy if exists "owners read own business banners" on storage.objects;

create policy "owners upload business banners" on storage.objects for insert to authenticated
with check (bucket_id = 'business-banners' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owners read own business banners" on storage.objects for select to authenticated
using (bucket_id = 'business-banners' and (storage.foldername(name))[1] = auth.uid()::text);

-- Create ten one-use hashes from the Supabase SQL editor. Never store plaintext codes:
-- insert into public.invite_codes (code_hash) values (encode(extensions.digest(upper('YOUR-PRIVATE-CODE'), 'sha256'), 'hex'));
-- Repeat with ten different codes, or set max_uses = 10 for one temporary shared pilot code.
