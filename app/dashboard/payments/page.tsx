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
  payment_tx_hash: string;
};

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setInvoices(data);

      setLoading(false);
    }

    fetchPayments();
  }, []);

  const totalUsdc = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.usdc_amount), 0)
    .toFixed(2);

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
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.href === "/dashboard/payments"
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
              <p className="text-xs text-gray-500 truncate">
                0x308c...46db
              </p>
            </div>

            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <header className="border-b border-[#1e1e2e] px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-xl font-semibold">Payments</h1>
            <p className="text-gray-500 text-sm">
              All payment activity
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-300">
              Arc Testnet
            </span>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Received",
                value: `${totalUsdc} USDC`,
                color: "text-emerald-400",
              },
              {
                label: "Paid Invoices",
                value: invoices
                  .filter((i) => i.status === "paid")
                  .length.toString(),
                color: "text-emerald-400",
              },
              {
                label: "Pending",
                value: invoices
                  .filter((i) => i.status === "pending")
                  .length.toString(),
                color: "text-yellow-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-5 border border-[#1e1e2e]"
              >
                <p className="text-gray-400 text-sm mb-2">
                  {stat.label}
                </p>

                <p className={`text-2xl font-bold ${stat.color}`}>
                  {loading ? "..." : stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl border border-[#1e1e2e]">
            <div className="p-6 border-b border-[#1e1e2e]">
              <h2 className="font-semibold">Payment History</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading payments...
              </div>
            ) : (
              <div className="divide-y divide-[#1e1e2e]">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a24]/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          invoice.status === "paid"
                            ? "bg-emerald-500/10"
                            : "bg-yellow-500/10"
                        }`}
                      >
                        <span className="text-sm">
                          {invoice.status === "paid" ? "✓" : "⏳"}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {invoice.customer_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {invoice.id} ·{" "}
                          {invoice.created_at?.slice(0, 10)}
                        </p>

                        {invoice.payment_tx_hash && (
                          <a
                            href={`https://testnet.arcscan.app/tx/${invoice.payment_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-400 hover:underline"
                          >
                            {invoice.payment_tx_hash.slice(0, 20)}...
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">
                        {invoice.usdc_amount} USDC
                      </p>

                      <p className="text-xs text-gray-500">
                        {invoice.currency}{" "}
                        {Number(invoice.amount).toLocaleString()}
                      </p>

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          invoice.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
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