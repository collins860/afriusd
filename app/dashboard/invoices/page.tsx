"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { useUserInvoices } from "@/lib/invoices/useUserInvoices";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function InvoicesPage() {
  const { invoices, loading } = useUserInvoices();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <DashboardLayout>
      <header className="border-b border-[#1e1e2e] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <div>
          <h1 className="text-lg lg:text-xl font-semibold">Invoices</h1>
          <p className="text-gray-500 text-xs lg:text-sm">{invoices.length} total invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300">Arc Testnet</span>
          </div>
          <Link href="/invoice/create">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors">
              + New Invoice
            </button>
          </Link>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["all", "pending", "paid", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all capitalize whitespace-nowrap ${
                filter === f
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-400 hover:text-white bg-[#1a1a24] border border-[#1e1e2e]"
              }`}
            >
              {f === "all" ? `All (${invoices.length})` : f}
            </button>
          ))}
        </div>

        {/* Mobile Invoice Cards */}
        <div className="lg:hidden space-y-3">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No invoices found</p>
              <Link href="/invoice/create">
                <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium">Create Invoice</button>
              </Link>
            </div>
          ) : (
            filtered.map((invoice) => (
              <div key={invoice.id} className="glass rounded-xl border border-[#1e1e2e] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{invoice.customer_name}</p>
                    <p className="text-xs text-gray-500">{invoice.customer_email}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{invoice.id}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#1e1e2e]">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium">{invoice.currency} {Number(invoice.amount).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">USDC</p>
                    <p className="text-sm font-bold text-emerald-400">{invoice.usdc_amount} USDC</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Due</p>
                    <p className="text-xs text-gray-300">{invoice.due_date || "—"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block glass rounded-xl border border-[#1e1e2e]">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-[#1e1e2e] text-xs text-gray-500 font-medium uppercase tracking-wider">
            <div className="col-span-2">Customer</div>
            <div>Amount</div>
            <div>USDC</div>
            <div>Due Date</div>
            <div>Status</div>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No invoices found</p>
              <Link href="/invoice/create">
                <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium">Create Invoice</button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#1e1e2e]">
              {filtered.map((invoice) => (
                <div key={invoice.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-[#1a1a24]/50 transition-colors items-center">
                  <div className="col-span-2">
                    <p className="text-sm font-medium">{invoice.customer_name}</p>
                    <p className="text-xs text-gray-500">{invoice.customer_email}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{invoice.id}</p>
                  </div>
                  <div><p className="text-sm font-medium">{invoice.currency} {Number(invoice.amount).toLocaleString()}</p></div>
                  <div><p className="text-sm text-emerald-400 font-medium">{invoice.usdc_amount} USDC</p></div>
                  <div><p className="text-sm text-gray-300">{invoice.due_date || "—"}</p></div>
                  <div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>
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