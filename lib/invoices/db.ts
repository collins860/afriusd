import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type Invoice,
  type InvoiceData,
  type InvoiceRow,
  rowToInvoice,
} from "./types";

export async function fetchInvoicesForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("id, user_id, data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as InvoiceRow[]).map(rowToInvoice);
}

export async function fetchInvoiceById(
  supabase: SupabaseClient,
  invoiceId: string
): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from("invoices")
    .select("id, user_id, data, created_at")
    .eq("id", invoiceId.toUpperCase())
    .maybeSingle();

  if (!error && data) return rowToInvoice(data as InvoiceRow);

  const { data: data2 } = await supabase
    .from("invoices")
    .select("id, user_id, data, created_at")
    .ilike("id", invoiceId)
    .maybeSingle();

  if (data2) return rowToInvoice(data2 as InvoiceRow);
  return null;
}

export async function createInvoice(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  data: InvoiceData
): Promise<Invoice> {
  // Include legacy flat columns when the table still has them (older Supabase schema).
  const row = {
    id,
    user_id: userId,
    data,
    merchant_id: data.merchant_id,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    description: data.description,
    amount: data.amount,
    currency: data.currency,
    usdc_amount: data.usdc_amount,
    status: data.status,
    due_date: data.due_date,
  };
  const { data: inserted, error } = await supabase
    .from("invoices")
    .insert(row)
    .select("id, user_id, data, created_at")
    .single();

  if (error) throw error;
  return rowToInvoice(inserted as InvoiceRow);
}

export async function updateInvoiceData(
  supabase: SupabaseClient,
  userId: string,
  invoiceId: string,
  patch: Partial<InvoiceData>
): Promise<Invoice> {
  const { data: existing, error: fetchError } = await supabase
    .from("invoices")
    .select("id, user_id, data, created_at")
    .eq("id", invoiceId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) throw fetchError ?? new Error("Invoice not found");

  const row = existing as InvoiceRow;
  const nextData = { ...row.data, ...patch };

  const { data: updated, error } = await supabase
    .from("invoices")
    .update({ data: nextData })
    .eq("id", invoiceId)
    .eq("user_id", userId)
    .select("id, user_id, data, created_at")
    .single();

  if (error) throw error;
  return rowToInvoice(updated as InvoiceRow);
}

export async function deleteInvoice(
  supabase: SupabaseClient,
  userId: string,
  invoiceId: string
): Promise<void> {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", userId);

  if (error) throw error;
}

/** Server-side payment updates (service role). */
export async function markInvoicePaid(
  supabase: SupabaseClient,
  invoiceId: string,
  paymentTxHash: string
): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from("invoices")
    .select("id, user_id, data, created_at")
    .eq("id", invoiceId)
    .maybeSingle();

  if (fetchError || !existing) throw fetchError ?? new Error("Invoice not found");

  const row = existing as InvoiceRow;
  const nextData: InvoiceData = {
    ...row.data,
    status: "paid",
    payment_tx_hash: paymentTxHash,
  };

  const updatePayload: Record<string, unknown> = { data: nextData };

  // Keep legacy flat columns in sync when the table still has them.
  updatePayload.status = "paid";
  updatePayload.payment_tx_hash = paymentTxHash;

  const { error } = await supabase
    .from("invoices")
    .update(updatePayload)
    .eq("id", invoiceId);

  if (error) throw error;
}
