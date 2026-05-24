-- Run this in Supabase SQL Editor if you already had an invoices table
-- (fixes: column "user_id" does not exist)

-- 1. Add the new columns your app needs
alter table public.invoices
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

alter table public.invoices
  add column if not exists data jsonb not null default '{}'::jsonb;

-- 2. Move old column data into the JSON "data" field (if old columns still exist)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'invoices'
      and column_name = 'customer_name'
  ) then
    update public.invoices
    set data = jsonb_build_object(
      'merchant_id', merchant_id,
      'customer_name', customer_name,
      'customer_email', customer_email,
      'description', description,
      'amount', amount,
      'currency', currency,
      'usdc_amount', usdc_amount,
      'status', coalesce(status, 'pending'),
      'due_date', due_date,
      'payment_tx_hash', payment_tx_hash
    )
    where data = '{}'::jsonb
       or data->>'customer_name' is null;
  end if;
end $$;

-- 3. Indexes
create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_created_at_idx on public.invoices (created_at desc);

-- 4. Security rules
alter table public.invoices enable row level security;

drop policy if exists "Users manage own invoices" on public.invoices;
create policy "Users manage own invoices"
  on public.invoices
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Public read for payment" on public.invoices;
create policy "Public read for payment"
  on public.invoices
  for select
  using (true);
