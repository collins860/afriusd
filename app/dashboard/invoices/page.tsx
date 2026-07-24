"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { useUserInvoices } from "@/lib/invoices/useUserInvoices";
import { CountUp } from "@/components/ui/CountUp";
import type { Invoice } from "@/lib/invoices/types";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const paymentLink = `${typeof window !== "undefined" ? window.location.origin : ""}/invoice/${invoice.id}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-scale-in"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--bg-input)" }}>
              <span className="text-base">📄</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{invoice.customer_name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{invoice.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xl leading-none hover:opacity-70" style={{ color: "var(--text-muted)" }}>✕</button>
        </div>
        <div className="flex items-center justify-between mb-5">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
          <p className="text-xl font-bold">{invoice.usdc_amount} USDC</p>
        </div>
        <div className="space-y-3 rounded-xl p-4 mb-5" style={{ backgroundColor: "var(--bg-input)" }}>
          {[
            { label: "Customer Email", value: invoice.customer_email },
            { label: "Description", value: invoice.description },
            { label: "Amount", value: `${invoice.amount} ${invoice.currency}` },
            { label: "USDC Amount", value: `${invoice.usdc_amount} USDC` },
            { label: "Date Created", value: invoice.created_at?.slice(0, 10) },
            { label: "Due Date", value: invoice.due_date?.slice(0, 10) ?? "—" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between gap-4 text-sm">
              <span className="flex-shrink-0" style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span className="text-right">{row.value}</span>
            </div>
          ))}
        </div>
        {invoice.status !== "paid" && (
          <div className="mb-5">
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Payment Link</p>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
              <p className="text-xs truncate flex-1" style={{ color: "var(--text-secondary)" }}>{paymentLink}</p>
              <button onClick={() => navigator.clipboard.writeText(paymentLink)} className="text-xs text-emerald-400 hover:text-emerald-300 flex-shrink-0">Copy</button>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Close</button>
          {invoice.status !== "paid" && (
            <Link href={`/invoice/${invoice.id}`} className="flex-1">
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium transition-colors">View Payment Page</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const { invoices, loading } = useUserInvoices();
  const [filter, setFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <DashboardLayout>
      {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}

      <header className="border-b px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 backdrop-blur-md z-10"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <div>
          <h1 className="text-lg lg:text-xl font-semibold">Invoices</h1>
          <p className="text-xs lg:text-sm" style={{ color: "var(--text-muted)" }}>
            {loading ? "..." : <CountUp end={invoices.length} duration={800} />} total invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 border rounded-lg px-3 py-2" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Arc Testnet</span>
          </div>
          <Link href="/invoice/create">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors hover:scale-[1.03]">+ New Invoice</button>
          </Link>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["all", "pending", "paid", "overdue"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all capitalize whitespace-nowrap ${
                filter === f ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "border hover:opacity-80"
              }`}
              style={filter !== f ? { backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-secondary)" } : {}}>
              {f === "all" ? `All (${invoices.length})` : f}
            </button>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center animate-fade-in-up">
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>No invoices found</p>
              <Link href="/invoice/create"><button className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium">Create Invoice</button></Link>
            </div>
          ) : filtered.map((invoice, i) => (
            <div key={invoice.id}
              className="glass rounded-xl p-4 cursor-pointer hover-lift transition-colors hover:border-emerald-500/30 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setSelectedInvoice(invoice)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{invoice.customer_name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{invoice.customer_email}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{invoice.id}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>{invoice.status}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Amount</p>
                  <p className="text-sm font-medium">{invoice.currency} {Number(invoice.amount).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>USDC</p>
                  <p className="text-sm font-bold text-emerald-400">{invoice.usdc_amount} USDC</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Due</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{invoice.due_date || "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block glass rounded-xl animate-fade-in-up delay-1">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b text-xs font-medium uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <div className="col-span-2">Customer</div>
            <div>Amount</div><div>USDC</div><div>Due Date</div><div>Status</div>
          </div>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>No invoices found</p>
              <Link href="/invoice/create"><button className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium">Create Invoice</button></Link>
            </div>
          ) : filtered.map((invoice, i) => (
            <div key={invoice.id}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b transition-colors items-center cursor-pointer hover:opacity-80 animate-fade-in-up"
              style={{ borderColor: "var(--border)", animationDelay: `${i * 60}ms` }}
              onClick={() => setSelectedInvoice(invoice)}>
              <div className="col-span-2">
                <p className="text-sm font-medium">{invoice.customer_name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{invoice.customer_email}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{invoice.id}</p>
              </div>
              <div><p className="text-sm font-medium">{invoice.currency} {Number(invoice.amount).toLocaleString()}</p></div>
              <div><p className="text-sm text-emerald-400 font-medium">{invoice.usdc_amount} USDC</p></div>
              <div><p className="text-sm" style={{ color: "var(--text-secondary)" }}>{invoice.due_date || "—"}</p></div>
              <div><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>{invoice.status}</span></div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
