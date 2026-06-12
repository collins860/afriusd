"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createInvoice } from "@/lib/invoices/db";
import { supabase } from "@/lib/supabase/client";

const currencies = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 0.00065 },
  { code: "KES", symbol: "KES", name: "Kenyan Shilling", rate: 0.0077 },
  { code: "GHS", symbol: "GHS", name: "Ghanaian Cedi", rate: 0.068 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 0.054 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
];

export default function CreateInvoice() {
  const { user } = useAuth();
  const [form, setForm] = useState({ customerName: "", customerEmail: "", description: "", amount: "", currency: "NGN", dueDate: "" });
  const [submitted, setSubmitted] = useState(false);
  const [invoiceId] = useState(`INV-${Math.floor(Math.random() * 9000) + 1000}`);

  const selectedCurrency = currencies.find((c) => c.code === form.currency)!;
  const usdcAmount = form.amount ? (parseFloat(form.amount) * selectedCurrency.rate).toFixed(2) : "0.00";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("You must be signed in to create an invoice"); return; }
    try {
      await createInvoice(supabase, user.id, invoiceId, {
        merchant_id: "0x308c092244ca7266134acd2fff755af08a7a46db",
        customer_name: form.customerName, customer_email: form.customerEmail,
        description: form.description, amount: parseFloat(form.amount),
        currency: form.currency, usdc_amount: parseFloat(usdcAmount),
        status: "pending", due_date: form.dueDate,
      });
    } catch (error) {
      const message = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "Failed to save invoice";
      toast.error(message); return;
    }
    await fetch("/api/send-invoice", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerEmail: form.customerEmail, customerName: form.customerName, merchantName: "AfriUSD Merchant", invoiceId, amount: parseFloat(form.amount).toLocaleString(), currency: form.currency, usdcAmount, dueDate: form.dueDate, description: form.description }),
    });
    toast.success("Invoice created & email sent to customer!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-emerald-400">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Invoice Created!</h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Your invoice {invoiceId} has been created successfully.</p>
          <div className="glass rounded-xl p-6 mb-6 text-left">
            <div className="space-y-3">
              {[
                { label: "Invoice ID", value: invoiceId },
                { label: "Customer", value: form.customerName },
                { label: "Amount", value: `${selectedCurrency.symbol}${parseFloat(form.amount).toLocaleString()} ${form.currency}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                  <span className="text-sm font-medium">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>USDC Amount</span>
                <span className="text-sm font-bold text-emerald-400">{usdcAmount} USDC</span>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Payment Link</p>
            <div className="flex items-center gap-2">
              <code className="text-emerald-400 text-xs flex-1 truncate">afriusd.vercel.app/invoice/{invoiceId.toLowerCase()}</code>
              <button onClick={() => navigator.clipboard.writeText(`https://afriusd.vercel.app/invoice/${invoiceId}`)}
                className="text-xs border px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Copy</button>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <button className="w-full border py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Back to Dashboard</button>
            </Link>
            <button onClick={() => setSubmitted(false)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl text-sm font-medium transition-colors">
              New Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      <header className="border-b px-4 lg:px-8 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--text-secondary)" }}>← Back</button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Create Invoice</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{invoiceId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2"
          style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Arc Testnet</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-semibold mb-5">Customer Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "customerName", label: "Customer Name *", placeholder: "John Doe", type: "text" },
                  { name: "customerEmail", label: "Customer Email *", placeholder: "john@example.com", type: "email" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>{field.label}</label>
                    <input name={field.name} type={field.type} value={form[field.name as keyof typeof form]}
                      onChange={handleChange} placeholder={field.placeholder} required
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="font-semibold mb-5">Invoice Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Website design, freelance work, product sale..." required rows={3}
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                    style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>Currency *</label>
                    <select name="currency" value={form.currency} onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                      {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>Amount *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }}>{selectedCurrency.symbol}</span>
                      <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" required
                        className="w-full border rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                        style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>Due Date *</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required
                    className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                    style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-semibold text-lg transition-colors glow-emerald">
              Create Invoice →
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl p-6 sticky top-6">
            <h3 className="font-semibold mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>Live Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <span className="text-sm font-medium">AfriUSD</span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{invoiceId}</span>
              </div>
              <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Bill to</p>
                <p className="text-sm font-medium">{form.customerName || "Customer Name"}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{form.customerEmail || "email@example.com"}</p>
              </div>
              <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Description</p>
                <p className="text-sm">{form.description || "Invoice description"}</p>
              </div>
              <div className="border-t pt-4 bg-emerald-500/5 rounded-lg p-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Amount ({form.currency})</span>
                  <span className="text-sm font-medium">{selectedCurrency.symbol}{form.amount ? parseFloat(form.amount).toLocaleString() : "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>USDC Equivalent</span>
                  <span className="text-sm font-bold text-emerald-400">{usdcAmount} USDC</span>
                </div>
              </div>
              {form.dueDate && (
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--text-muted)" }}>Due date</span>
                  <span style={{ color: "var(--text-secondary)" }}>{form.dueDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}