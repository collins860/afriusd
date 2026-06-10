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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a1a24] flex items-center justify-center">
              <span className="text-base">📄</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{invoice.customer_name}</p>
              <p className="text-xs text-gray-500">{invoice.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-5">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
          <p className="text-xl font-bold text-white">{invoice.usdc_amount} USDC</p>
        </div>

        {/* Details */}
        <div className="space-y-3 bg-[#1a1a24] rounded-xl p-4 mb-5">
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

        {/* Payment Link */}
        {invoice.status !== "paid" && (
          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-2">Payment Link</p>
            <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
              <p className="text-xs text-gray-300 truncate flex-1">{paymentLink}</p>
              <button
                onClick={() => navigator.clipboard.writeText(paymentLink)}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex-shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#1e1e2e] hover:border-gray-600 text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
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
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-white text-right ${truncate ? "truncate max-w-[180px]" : ""}`}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { invoices, loading } = useUserInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);
  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const totalUsdc = invoices.reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);

  return (
    <DashboardLayout>
      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      {/* Desktop Header */}
      <header className="hidden lg:flex border-b border-[#1e1e2e] px-8 py-4 items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Merchant</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300">Arc Testnet</span>
          </div>
          <Link href="/invoice/create">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + New Invoice
            </button>
          </Link>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="lg:hidden mb-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-xs">Welcome back, Merchant</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {[
            { label: "Total Revenue", value: `$${totalRevenue}`, change: "USDC received", color: "text-emerald-400" },
            { label: "Paid Invoices", value: paidCount.toString(), change: "completed", color: "text-emerald-400" },
            { label: "Pending", value: pendingCount.toString(), change: "awaiting payment", color: "text-yellow-400" },
            { label: "Total USDC", value: totalUsdc, change: "all invoices", color: "text-blue-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 border border-[#1e1e2e]">
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className="text-xl lg:text-2xl font-bold text-white mb-1">{loading ? "..." : stat.value}</p>
              <p className={`text-xs ${stat.color}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Recent Invoices */}
          <div className="lg:col-span-2 glass rounded-xl border border-[#1e1e2e]">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-[#1e1e2e]">
              <h2 className="font-semibold">Recent Invoices</h2>
              <Link href="/invoice/create">
                <button className="text-emerald-400 text-sm hover:text-emerald-300">+ Create</button>
              </Link>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : invoices.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No invoices yet</p>
                <Link href="/invoice/create">
                  <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium">Create your first invoice</button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1e1e2e]">
                {invoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between px-4 lg:px-6 py-3 hover:bg-[#1a1a24]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#1a1a24] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">📄</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{invoice.customer_name}</p>
                        <p className="text-xs text-gray-500 truncate">{invoice.id} · {invoice.created_at?.slice(0, 10)}</p>
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

          {/* Summary */}
          <div className="space-y-4">
            <div className="glass rounded-xl border border-[#1e1e2e] p-4 lg:p-6">
              <p className="text-gray-400 text-sm mb-3">Total Invoiced</p>
              <div className="text-center py-2">
                <p className="text-3xl font-bold">{loading ? "..." : totalUsdc}</p>
                <p className="text-gray-400 text-sm mt-1">USDC</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-xs">Arc Testnet</span>
                </div>
              </div>
              <Link href="/invoice/create">
                <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  + Create Invoice
                </button>
              </Link>
            </div>
            <div className="glass rounded-xl border border-[#1e1e2e] p-4 lg:p-6">
              <p className="text-gray-400 text-sm mb-4">Invoice Summary</p>
              <div className="space-y-3">
                {[
                  { label: "Total", value: invoices.length.toString() },
                  { label: "Paid", value: paidCount.toString() },
                  { label: "Pending", value: pendingCount.toString() },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium">{loading ? "..." : item.value}</span>
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
