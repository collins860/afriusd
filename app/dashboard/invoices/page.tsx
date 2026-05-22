"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

type Invoice = {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  usdc_amount: number;
  status: string;
  created_at: string;
  due_date: string;
  description: string;
};

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchInvoices() {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setInvoices(data);
      setLoading(false);
    }
    fetchInvoices();
  }, []);

  const filtered = filter === "all"
    ? invoices
    : invoices.filter((i) => i.status === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1e1e2e] flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#1e1e2e]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">AfriUSD</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: "Dashboard", icon: "▦", href: "/dashboard" },
            { label: "Invoices", icon: "📄", href: "/dashboard/invoices" },
            { label: "Payments", icon: "💳", href: "/dashboard/payments" },
            { label: "Analytics", icon: "📊", href: "/dashboard/analytics" },
            { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.href === "/dashboard/invoices"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a24]"
              }`}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1e1e2e]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a24]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-sm font-bold">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Merchant</p>
              <p className="text-xs text-gray-500 truncate">0x308c...46db</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <header className="border-b border-[#1e1e2e] px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-xl font-semibold">Invoices</h1>
            <p className="text-gray-500 text-sm">{invoices.length} total invoices</p>
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

        <div className="p-8">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {["all", "pending", "paid", "overdue"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white bg-[#1a1a24] border border-[#1e1e2e]"
                }`}
              >
                {f === "all" ? `All (${invoices.length})` : f}
              </button>
            ))}
          </div>

          {/* Invoices Table */}
          <div className="glass rounded-xl border border-[#1e1e2e]">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-[#1e1e2e] text-xs text-gray-500 font-medium uppercase tracking-wider">
              <div className="col-span-2">Customer</div>
              <div>Amount</div>
              <div>USDC</div>
              <div>Due Date</div>
              <div>Status</div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading invoices...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No invoices found</p>
                <Link href="/invoice/create">
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Create Invoice
                  </button>
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
                    <div>
                      <p className="text-sm font-medium">{invoice.currency} {Number(invoice.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-400 font-medium">{invoice.usdc_amount} USDC</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">{invoice.due_date || "—"}</p>
                    </div>
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
      </main>
    </div>
  );
}