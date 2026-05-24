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
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    description: "",
    amount: "",
    currency: "NGN",
    dueDate: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [invoiceId] = useState(`INV-${Math.floor(Math.random() * 9000) + 1000}`);

  const selectedCurrency = currencies.find((c) => c.code === form.currency)!;
  const usdcAmount = form.amount
    ? (parseFloat(form.amount) * selectedCurrency.rate).toFixed(2)
    : "0.00";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be signed in to create an invoice");
      return;
    }

    try {
      await createInvoice(supabase, user.id, invoiceId, {
        merchant_id: "0x308c092244ca7266134acd2fff755af08a7a46db",
        customer_name: form.customerName,
        customer_email: form.customerEmail,
        description: form.description,
        amount: parseFloat(form.amount),
        currency: form.currency,
        usdc_amount: parseFloat(usdcAmount),
        status: "pending",
        due_date: form.dueDate,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save invoice");
      return;
    }

    // Send email to customer
await fetch("/api/send-invoice", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customerEmail: form.customerEmail,
    customerName: form.customerName,
    merchantName: "AfriUSD Merchant",
    invoiceId,
    amount: parseFloat(form.amount).toLocaleString(),
    currency: form.currency,
    usdcAmount,
    dueDate: form.dueDate,
    description: form.description,
  }),
});

toast.success("Invoice created & email sent to customer!");
setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Invoice Created!</h1>
          <p className="text-gray-400 mb-8">Your invoice {invoiceId} has been created successfully.</p>
          <div className="glass rounded-xl border border-[#1e1e2e] p-6 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Invoice ID</span>
                <span className="text-white text-sm font-medium">{invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Customer</span>
                <span className="text-white text-sm font-medium">{form.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Amount</span>
                <span className="text-white text-sm font-medium">{selectedCurrency.symbol}{parseFloat(form.amount).toLocaleString()} {form.currency}</span>
              </div>
              <div className="flex justify-between border-t border-[#1e1e2e] pt-3">
                <span className="text-gray-400 text-sm">USDC Amount</span>
                <span className="text-emerald-400 text-sm font-bold">{usdcAmount} USDC</span>
              </div>
            </div>
          </div>
          <div className="glass rounded-xl border border-[#1e1e2e] p-4 mb-6">
            <p className="text-gray-400 text-xs mb-2">Payment Link</p>
            <div className="flex items-center gap-2">
              <code className="text-emerald-400 text-xs flex-1 truncate">
                afriusd.vercel.app/invoice/{invoiceId.toLowerCase()}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`https://afriusd.vercel.app/invoice/${invoiceId}`)}
                className="text-gray-400 hover:text-white text-xs border border-[#1e1e2e] px-3 py-1.5 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <button className="w-full border border-[#1e1e2e] hover:border-gray-600 text-gray-300 py-3 rounded-xl text-sm font-medium transition-all">
                Back to Dashboard
              </button>
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              New Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-[#1e1e2e] px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Back
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Create Invoice</h1>
            <p className="text-gray-500 text-xs">{invoiceId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-gray-300">Arc Testnet</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-5">Customer Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Customer Name *</label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Customer Email *</label>
                  <input
                    name="customerEmail"
                    type="email"
                    value={form.customerEmail}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-5">Invoice Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Website design, freelance work, product sale..."
                    required
                    rows={3}
                    className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Currency *</label>
                    <select
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Amount *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        {selectedCurrency.symbol}
                      </span>
                      <input
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Due Date *</label>
                  <input
                    name="dueDate"
                    type="date"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-semibold text-lg transition-colors glow-emerald"
            >
              Create Invoice →
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl border border-[#1e1e2e] p-6 sticky top-6">
            <h3 className="font-semibold mb-5 text-sm text-gray-400">Live Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <span className="text-sm font-medium">AfriUSD</span>
                </div>
                <span className="text-xs text-gray-500">{invoiceId}</span>
              </div>
              <div className="border-t border-[#1e1e2e] pt-4">
                <p className="text-xs text-gray-500 mb-1">Bill to</p>
                <p className="text-sm font-medium">{form.customerName || "Customer Name"}</p>
                <p className="text-xs text-gray-500">{form.customerEmail || "email@example.com"}</p>
              </div>
              <div className="border-t border-[#1e1e2e] pt-4">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm">{form.description || "Invoice description"}</p>
              </div>
              <div className="border-t border-[#1e1e2e] pt-4 bg-emerald-500/5 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-400">Amount ({form.currency})</span>
                  <span className="text-sm font-medium">
                    {selectedCurrency.symbol}{form.amount ? parseFloat(form.amount).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">USDC Equivalent</span>
                  <span className="text-sm font-bold text-emerald-400">{usdcAmount} USDC</span>
                </div>
              </div>
              {form.dueDate && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Due date</span>
                  <span className="text-gray-300">{form.dueDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}