"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

type Invoice = {
  id: string;
  amount: number;
  currency: string;
  usdc_amount: number;
  status: string;
  created_at: string;
};

export default function AnalyticsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setInvoices(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const totalUsdc = invoices.reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);
  const paidUsdc = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);
  const pendingUsdc = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);

  const currencies = invoices.reduce((acc, i) => {
    acc[i.currency] = (acc[i.currency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          {[
            { label: "Dashboard", icon: "▦", href: "/dashboard" },
            { label: "Invoices", icon: "📄", href: "/dashboard/invoices" },
            { label: "Payments", icon: "💳", href: "/dashboard/payments" },
            { label: "Analytics", icon: "📊", href: "/dashboard/analytics" },
            { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.href === "/dashboard/analytics"
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
        <header className="border-b border-[#1e1e2e] px-8 py-4 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-gray-500 text-sm">Your payment insights</p>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Invoiced", value: `${totalUsdc} USDC`, color: "text-white" },
              { label: "Collected", value: `${paidUsdc} USDC`, color: "text-emerald-400" },
              { label: "Outstanding", value: `${pendingUsdc} USDC`, color: "text-yellow-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5 border border-[#1e1e2e]">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{loading ? "..." : stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-6">Invoice Status Breakdown</h2>
              <div className="space-y-4">
                {[
                  { label: "Paid", count: invoices.filter(i => i.status === "paid").length, color: "bg-emerald-500" },
                  { label: "Pending", count: invoices.filter(i => i.status === "pending").length, color: "bg-yellow-500" },
                  { label: "Overdue", count: invoices.filter(i => i.status === "overdue").length, color: "bg-red-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white font-medium">{item.count} invoices</span>
                    </div>
                    <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: invoices.length > 0 ? `${(item.count / invoices.length) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-6">Currencies Used</h2>
              <div className="space-y-3">
                {Object.entries(currencies).map(([currency, count]) => (
                  <div key={currency} className="flex items-center justify-between p-3 bg-[#1a1a24] rounded-lg">
                    <span className="text-sm font-medium">{currency}</span>
                    <span className="text-emerald-400 text-sm font-bold">{count} invoice{count > 1 ? "s" : ""}</span>
                  </div>
                ))}
                {Object.keys(currencies).length === 0 && (
                  <p className="text-gray-500 text-sm">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}