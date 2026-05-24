-- Optional: run if create invoice still fails after app update
-- Makes old invoice columns optional so JSON-only saves work too

do $$
declare
  col text;
begin
  foreach col in array array[
    'merchant_id',
    'customer_name',
    'customer_email',
    'description',
    'amount',
    'currency',
    'usdc_amount',
    'status',
    'due_date',
    'payment_tx_hash'
  ]
  loop
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'invoices'
        and column_name = col
    ) then
      execute format(
        'alter table public.invoices alter column %I drop not null',
        col
      );
    end if;
  end loop;
end $$;
