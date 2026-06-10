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
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
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

export default function PaymentsPage() {
  const { invoices, loading } = useUserInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalUsdc = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.usdc_amount), 0)
    .toFixed(2);

  return (
    <DashboardLayout>
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      <header className="border-b border-[#1e1e2e] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <div>
          <h1 className="text-lg lg:text-xl font-semibold">Payments</h1>
          <p className="text-gray-500 text-xs lg:text-sm">All payment activity</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-gray-300">Arc Testnet</span>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6">
          {[
            { label: "Total Received", value: `${totalUsdc} USDC`, color: "text-emerald-400" },
            { label: "Paid", value: invoices.filter((i) => i.status === "paid").length.toString(), color: "text-emerald-400" },
            { label: "Pending", value: invoices.filter((i) => i.status === "pending").length.toString(), color: "text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-3 lg:p-5 border border-[#1e1e2e]">
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className={`text-lg lg:text-2xl font-bold ${stat.color}`}>{loading ? "..." : stat.value}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl border border-[#1e1e2e]">
          <div className="p-4 lg:p-6 border-b border-[#1e1e2e]">
            <h2 className="font-semibold">Payment History</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="divide-y divide-[#1e1e2e]">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between px-4 lg:px-6 py-4 hover:bg-[#1a1a24]/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      invoice.status === "paid" ? "bg-emerald-500/10" : "bg-yellow-500/10"
                    }`}>
                      <span className="text-sm">{invoice.status === "paid" ? "✓" : "⏳"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{invoice.customer_name}</p>
                      <p className="text-xs text-gray-500 truncate">{invoice.id} · {invoice.created_at?.slice(0, 10)}</p>
                      {invoice.payment_tx_hash && (
                        <a
                          href={`https://testnet.arcscan.app/tx/${invoice.payment_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-emerald-400 hover:underline truncate block max-w-[150px] lg:max-w-none"
                        >
                          {invoice.payment_tx_hash.slice(0, 16)}...
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-400">{invoice.usdc_amount} USDC</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      invoice.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
