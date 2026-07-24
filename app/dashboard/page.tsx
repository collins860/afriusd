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
          <DetailRow label="Customer Email" value={invoice.customer_email} />
          <DetailRow label="Description" value={invoice.description} />
          <DetailRow label="Amount" value={`${invoice.amount} ${invoice.currency}`} />
          <DetailRow label="USDC Amount" value={`${invoice.usdc_amount} USDC`} />
          <DetailRow label="Date Created" value={invoice.created_at?.slice(0, 10)} />
          <DetailRow label="Due Date" value={invoice.due_date?.slice(0, 10) ?? "—"} />
          {invoice.status === "paid" && invoice.payment_tx_hash && (
            <DetailRow label="Transaction Hash" value={invoice.payment_tx_hash} truncate />
          )}
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
              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                View Payment Page
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="flex-shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className={`text-right ${truncate ? "truncate max-w-[180px]" : ""}`}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { invoices, loading } = useUserInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.usdc_amount), 0);
  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const totalUsdc = invoices.reduce((sum, i) => sum + Number(i.usdc_amount), 0);

  return (
    <DashboardLayout>
      {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}

      <header className="hidden lg:flex border-b px-8 py-4 items-center justify-between sticky top-0 backdrop-blur-md z-10"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Welcome back, Merchant</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Arc Testnet</span>
          </div>
          <Link href="/invoice/create">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:scale-[1.03]">
              + New Invoice
            </button>
          </Link>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="lg:hidden mb-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Welcome back, Merchant</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {[
            { label: "Total Revenue", value: totalRevenue, prefix: "$", decimals: 2, change: "USDC received", color: "text-emerald-400" },
            { label: "Paid Invoices", value: paidCount, decimals: 0, change: "completed", color: "text-emerald-400" },
            { label: "Pending", value: pendingCount, decimals: 0, change: "awaiting payment", color: "text-yellow-400" },
            { label: "Total USDC", value: totalUsdc, decimals: 2, change: "all invoices", color: "text-blue-400" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
              <p className="text-xl lg:text-2xl font-bold mb-1">
                {loading ? "..." : <CountUp end={stat.value} prefix={stat.prefix} decimals={stat.decimals} />}
              </p>
              <p className={`text-xs ${stat.color}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 glass rounded-xl animate-fade-in-up delay-2">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold">Recent Invoices</h2>
              <Link href="/invoice/create">
                <button className="text-emerald-400 text-sm hover:text-emerald-300">+ Create</button>
              </Link>
            </div>
            {loading ? (
              <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading...</div>
            ) : invoices.length === 0 ? (
              <div className="p-8 text-center">
                <p className="mb-4" style={{ color: "var(--text-muted)" }}>No invoices yet</p>
                <Link href="/invoice/create">
                  <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium">Create your first invoice</button>
                </Link>
              </div>
            ) : (
              <div>
                {invoices.slice(0, 5).map((invoice, i) => (
                  <div key={invoice.id}
                    className="flex items-center justify-between px-4 lg:px-6 py-3 border-b transition-colors cursor-pointer hover:opacity-80 animate-fade-in-up"
                    style={{ borderColor: "var(--border)", animationDelay: `${i * 60}ms` }}
                    onClick={() => setSelectedInvoice(invoice)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--bg-input)" }}>
                        <span className="text-xs">📄</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{invoice.customer_name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{invoice.id} · {invoice.created_at?.slice(0, 10)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p className="text-sm font-medium hidden sm:block">{invoice.usdc_amount} USDC</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4 lg:p-6 hover-lift animate-fade-in-up delay-3">
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Total Invoiced</p>
              <div className="text-center py-2">
                <p className="text-3xl font-bold">
                  {loading ? "..." : <CountUp end={totalUsdc} decimals={2} />}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>USDC</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
                  <span className="text-emerald-400 text-xs">Arc Testnet</span>
                </div>
              </div>
              <Link href="/invoice/create">
                <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium transition-colors hover:scale-[1.02]">
                  + Create Invoice
                </button>
              </Link>
            </div>
            <div className="glass rounded-xl p-4 lg:p-6 hover-lift animate-fade-in-up delay-4">
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Invoice Summary</p>
              <div className="space-y-3">
                {[
                  { label: "Total", value: invoices.length },
                  { label: "Paid", value: paidCount },
                  { label: "Pending", value: pendingCount },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                    <span className="font-medium">{loading ? "..." : <CountUp end={item.value} duration={800} />}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
