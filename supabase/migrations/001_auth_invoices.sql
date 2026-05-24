-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- Invoices: user-scoped JSON documents
create table if not exists public.invoices (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_created_at_idx on public.invoices (created_at desc);

alter table public.invoices enable row level security;

-- Owners: full access to their rows
drop policy if exists "Users manage own invoices" on public.invoices;
create policy "Users manage own invoices"
  on public.invoices
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public payment page: read any invoice by id (link is the secret)
drop policy if exists "Public read for payment" on public.invoices;
create policy "Public read for payment"
  on public.invoices
  for select
  using (true);

-- If migrating from a flat invoices table, run separately after backup:
-- alter table public.invoices add column if not exists user_id uuid references auth.users(id);
-- alter table public.invoices add column if not exists data jsonb;
-- update public.invoices set data = jsonb_build_object(
--   'merchant_id', merchant_id,
--   'customer_name', customer_name,
--   ...
-- ) where data is null;
