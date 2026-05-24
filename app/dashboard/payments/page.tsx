"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardLayout from "@/components/dashboard/Layout";

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
    <DashboardLayout>
      <header className="border-b border-[#1e1e2e] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <div>
          <h1 className="text-lg lg:text-xl font-semibold">Payments</h1>
          <p className="text-gray-500 text-xs lg:text-sm">
            All payment activity
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-gray-300">Arc Testnet</span>
        </div>
      </header>

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-6">
          {[
            {
              label: "Total Received",
              value: `${totalUsdc} USDC`,
              color: "text-emerald-400",
            },
            {
              label: "Paid",
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
              className="glass rounded-xl p-3 lg:p-5 border border-[#1e1e2e]"
            >
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>

              <p className={`text-lg lg:text-2xl font-bold ${stat.color}`}>
                {loading ? "..." : stat.value}
              </p>
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
                  className="flex items-center justify-between px-4 lg:px-6 py-4 hover:bg-[#1a1a24]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        invoice.status === "paid"
                          ? "bg-emerald-500/10"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      <span className="text-sm">
                        {invoice.status === "paid" ? "✓" : "⏳"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {invoice.customer_name}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {invoice.id} · {invoice.created_at?.slice(0, 10)}
                      </p>

                      {invoice.payment_tx_hash && (
                        <a
                          href={`https://testnet.arcscan.app/tx/${invoice.payment_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:underline truncate block max-w-[150px] lg:max-w-none"
                        >
                          {invoice.payment_tx_hash.slice(0, 16)}...
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-400">
                      {invoice.usdc_amount} USDC
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
    </DashboardLayout>
  );
}