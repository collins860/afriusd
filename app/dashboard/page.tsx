"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

type Invoice = {
  id: string;
  customer_name: string;
  amount: number;
  currency: string;
  usdc_amount: number;
  status: string;
  created_at: string;
  due_date: string;
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.usdc_amount), 0)
    .toFixed(2);

  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const totalUsdc = invoices
    .reduce((sum, i) => sum + Number(i.usdc_amount), 0)
    .toFixed(2);

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

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦", href: "/dashboard" },
    { id: "invoices", label: "Invoices", icon: "📄", href: "/dashboard/invoices" },
    { id: "payments", label: "Payments", icon: "💳", href: "/dashboard/payments" },
    { id: "analytics", label: "Analytics", icon: "📊", href: "/dashboard/analytics" },
    { id: "settings", label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
  ];

  const statusStyles: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
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
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeNav === item.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a24]"
                }`}
              >
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

        <div className="p-8">
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: `$${totalRevenue}`, change: "USDC received", color: "text-emerald-400" },
              { label: "Paid Invoices", value: paidCount.toString(), change: "completed", color: "text-emerald-400" },
              { label: "Pending Invoices", value: pendingCount.toString(), change: "awaiting payment", color: "text-yellow-400" },
              { label: "Total USDC", value: totalUsdc, change: "all invoices", color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5 border border-[#1e1e2e]">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {loading ? "..." : stat.value}
                </p>
                <p className={`text-xs ${stat.color}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 glass rounded-xl border border-[#1e1e2e]">
              <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
                <h2 className="font-semibold">Recent Invoices</h2>
                <Link href="/invoice/create">
                  <button className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
                    + Create Invoice
                  </button>
                </Link>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading invoices...</div>
              ) : invoices.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">No invoices yet</p>
                  <Link href="/invoice/create">
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                      Create your first invoice
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#1e1e2e]">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a24]/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-[#1a1a24] flex items-center justify-center">
                          <span className="text-xs text-gray-400">📄</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{invoice.customer_name}</p>
                          <p className="text-xs text-gray-500">{invoice.id} · {invoice.created_at?.slice(0, 10)}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">{invoice.currency} {Number(invoice.amount).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{invoice.usdc_amount} USDC</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[invoice.status] || statusStyles.pending}`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="glass rounded-xl border border-[#1e1e2e] p-6">
                <p className="text-gray-400 text-sm mb-4">Total Invoiced</p>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-white">{loading ? "..." : totalUsdc}</p>
                  <p className="text-gray-400 text-sm mt-1">USDC</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 text-xs">Arc Testnet</span>
                  </div>
                </div>
                <Link href="/invoice/create">
                  <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-lg text-sm transition-all font-medium">
                    + Create Invoice
                  </button>
                </Link>
              </div>

              <div className="glass rounded-xl border border-[#1e1e2e] p-6">
                <p className="text-gray-400 text-sm mb-4">Invoice Summary</p>
                <div className="space-y-3">
                  {[
                    { label: "Total invoices", value: invoices.length.toString() },
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
      </main>
    </div>
  );
}