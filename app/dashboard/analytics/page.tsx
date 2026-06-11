"use client";

import DashboardLayout from "@/components/dashboard/Layout";
import { useUserInvoices } from "@/lib/invoices/useUserInvoices";

export default function AnalyticsPage() {
  const { invoices, loading } = useUserInvoices();

  const totalUsdc = invoices.reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);
  const paidUsdc = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);
  const pendingUsdc = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + Number(i.usdc_amount), 0).toFixed(2);
  const currencies = invoices.reduce((acc, i) => { acc[i.currency] = (acc[i.currency] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <header className="border-b px-4 lg:px-8 py-4 sticky top-0 backdrop-blur-md z-10"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <h1 className="text-lg lg:text-xl font-semibold">Analytics</h1>
        <p className="text-xs lg:text-sm" style={{ color: "var(--text-muted)" }}>Your payment insights</p>
      </header>

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-6">
          {[
            { label: "Total Invoiced", value: `${totalUsdc} USDC`, color: "" },
            { label: "Collected", value: `${paidUsdc} USDC`, color: "text-emerald-400" },
            { label: "Outstanding", value: `${pendingUsdc} USDC`, color: "text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
              <p className={`text-xl lg:text-2xl font-bold ${stat.color}`}>{loading ? "..." : stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-5">Invoice Status</h2>
            <div className="space-y-4">
              {[
                { label: "Paid", count: invoices.filter(i => i.status === "paid").length, color: "bg-emerald-500" },
                { label: "Pending", count: invoices.filter(i => i.status === "pending").length, color: "bg-yellow-500" },
                { label: "Overdue", count: invoices.filter(i => i.status === "overdue").length, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                    <span className="font-medium">{item.count} invoices</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-input)" }}>
                    <div className={`h-full ${item.color} rounded-full`}
                      style={{ width: invoices.length > 0 ? `${(item.count / invoices.length) * 100}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-5">Currencies Used</h2>
            <div className="space-y-3">
              {Object.entries(currencies).map(([currency, count]) => (
                <div key={currency} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--bg-input)" }}>
                  <span className="text-sm font-medium">{currency}</span>
                  <span className="text-emerald-400 text-sm font-bold">{count} invoice{count > 1 ? "s" : ""}</span>
                </div>
              ))}
              {Object.keys(currencies).length === 0 && <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}