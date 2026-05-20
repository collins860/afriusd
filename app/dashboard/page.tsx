"use client";

import Link from "next/link";
import { useState } from "react";

const mockInvoices = [
  { id: "INV-001", customer: "Emeka Okafor", amount: "₦250,000", usdc: "162.50", status: "paid", date: "2025-05-18" },
  { id: "INV-002", customer: "Amara Diallo", amount: "KES 45,000", usdc: "348.00", status: "pending", date: "2025-05-17" },
  { id: "INV-003", customer: "Kwame Mensah", amount: "GHS 8,500", usdc: "580.00", status: "paid", date: "2025-05-16" },
  { id: "INV-004", customer: "Fatima Al-Hassan", amount: "ZAR 12,000", usdc: "648.00", status: "overdue", date: "2025-05-10" },
  { id: "INV-005", customer: "Chidi Ezekwe", amount: "₦180,000", usdc: "117.00", status: "paid", date: "2025-05-15" },
];

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "invoices", label: "Invoices", icon: "📄" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

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
          {navItems.map((item) => (
            <button
              key={item.id}
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
          ))}
        </nav>

        <div className="p-4 border-t border-[#1e1e2e]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a24]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-sm font-bold">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Merchant</p>
              <p className="text-xs text-gray-500 truncate">0x1234...5678</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: "$24,850", change: "+12.5%", color: "text-emerald-400" },
              { label: "Paid Invoices", value: "48", change: "+3 this week", color: "text-emerald-400" },
              { label: "Pending Invoices", value: "7", change: "2 overdue", color: "text-yellow-400" },
              { label: "USDC Received", value: "24,850", change: "≈ $24,850", color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-5 border border-[#1e1e2e]">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className={`text-xs ${stat.color}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Recent Invoices */}
            <div className="col-span-2 glass rounded-xl border border-[#1e1e2e]">
              <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
                <h2 className="font-semibold">Recent Invoices</h2>
                <Link href="/invoice/create">
                  <button className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
                    + Create Invoice
                  </button>
                </Link>
              </div>
              <div className="divide-y divide-[#1e1e2e]">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a24]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[#1a1a24] flex items-center justify-center">
                        <span className="text-xs text-gray-400">📄</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{invoice.customer}</p>
                        <p className="text-xs text-gray-500">{invoice.id} · {invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium">{invoice.amount}</p>
                        <p className="text-xs text-gray-500">{invoice.usdc} USDC</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet & Activity */}
            <div className="space-y-4">
              {/* Wallet Balance */}
              <div className="glass rounded-xl border border-[#1e1e2e] p-6">
                <p className="text-gray-400 text-sm mb-4">Wallet Balance</p>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-white">24,850</p>
                  <p className="text-gray-400 text-sm mt-1">USDC</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 text-xs">Arc Testnet</span>
                  </div>
                </div>
                <button className="w-full mt-4 border border-[#1e1e2e] hover:border-emerald-500/30 text-gray-300 hover:text-white py-2 rounded-lg text-sm transition-all">
                  Connect Wallet
                </button>
              </div>

              {/* Quick Stats */}
              <div className="glass rounded-xl border border-[#1e1e2e] p-6">
                <p className="text-gray-400 text-sm mb-4">Payment Activity</p>
                <div className="space-y-3">
                  {[
                    { label: "This week", value: "$3,240", bar: 65 },
                    { label: "Last week", value: "$2,180", bar: 44 },
                    { label: "This month", value: "$8,920", bar: 89 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.bar}%` }}
                        />
                      </div>
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