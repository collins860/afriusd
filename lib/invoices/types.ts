export type InvoiceData = {
  merchant_id: string;
  customer_name: string;
  customer_email: string;
  description: string;
  amount: number;
  currency: string;
  usdc_amount: number;
  status: string;
  due_date: string;
  payment_tx_hash?: string | null;
};

export type Invoice = InvoiceData & {
  id: string;
  user_id: string;
  created_at: string;
};

export type InvoiceRow = {
  id: string;
  user_id: string;
  data: InvoiceData;
  created_at: string;
};

export function rowToInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    user_id: row.user_id,
    created_at: row.created_at,
    ...row.data,
  };
}
