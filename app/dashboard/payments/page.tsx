"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { useUserInvoices } from "@/lib/invoices/useUserInvoices";
import type { Invoice } from "@/lib/invoices/types";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function InvoiceModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const paymentLink = `${typeof window !== "undefined" ? window.location.origin : ""}/invoice/${invoice.id}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border"
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
            { label: "Amount", value: `${invoice.amount} ${invoice.currency}` },
            { label: "USDC Amount", value: `${invoice.usdc_amount} USDC` },
            { label: "Date Created", value: invoice.created_at?.slice(0, 10) },
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
          <button onClick={onClose} className="flex-1 border py-2 rounded-lg text-sm font-medium hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Close</button>
          {invoice.status !== "paid" && (
            <Link href={`/invoice/${invoice.id}`} className="flex-1">
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium">View Payment Page</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const { invoices, loading } = useUserInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const totalUsdc = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);

  return (
    <DashboardLayout>
      {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}

      <header className="border-b px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 backdrop-blur-md z-10"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <div>
          <h1 className="text-lg lg:text-xl font-semibold">Payments</h1>
          <p className="text-xs lg:text-sm" style={{ color: "var(--text-muted)" }}>All payment activity</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 border rounded-lg px-3 py-2" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Arc Testnet</span>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6">
          {[
            { label: "Total Received", value: `${totalUsdc} USDC`, color: "text-emerald-400" },
            { label: "Paid", value: invoices.filter((i) => i.status === "paid").length.toString(), color: "text-emerald-400" },
            { label: "Pending", value: invoices.filter((i) => i.status === "pending").length.toString(), color: "text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-3 lg:p-5">
              <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
              <p className={`text-lg lg:text-2xl font-bold ${stat.color}`}>{loading ? "..." : stat.value}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl">
          <div className="p-4 lg:p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-semibold">Payment History</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading...</div>
          ) : invoices.map((invoice) => (
            <div key={invoice.id}
              className="flex items-center justify-between px-4 lg:px-6 py-4 border-b transition-colors cursor-pointer hover:opacity-80"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setSelectedInvoice(invoice)}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${invoice.status === "paid" ? "bg-emerald-500/10" : "bg-yellow-500/10"}`}>
                  <span className="text-sm">{invoice.status === "paid" ? "✓" : "⏳"}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{invoice.customer_name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{invoice.id} · {invoice.created_at?.slice(0, 10)}</p>
                  {invoice.payment_tx_hash && (
                    <a href={`https://testnet.arcscan.app/tx/${invoice.payment_tx_hash}`} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} className="text-xs text-emerald-400 hover:underline truncate block max-w-[150px] lg:max-w-none">
                      {invoice.payment_tx_hash.slice(0, 16)}...
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-emerald-400">{invoice.usdc_amount} USDC</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}