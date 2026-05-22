"use client";

import Link from "next/link";

export default function SettingsPage() {
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
                item.href === "/dashboard/settings"
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
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-gray-500 text-sm">Manage your account</p>
        </header>

        <div className="p-8 max-w-2xl">
          <div className="space-y-6">
            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-5">Merchant Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Business Name</label>
                  <input
                    defaultValue="My Business"
                    className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Wallet Address</label>
                  <input
                    defaultValue="0x308c092244ca7266134acd2fff755af08a7a46db"
                    disabled
                    className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-5">Network</h2>
              <div className="flex items-center justify-between p-4 bg-[#1a1a24] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium">Arc Testnet</span>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">Connected</span>
              </div>
            </div>

            <div className="glass rounded-xl border border-[#1e1e2e] p-6">
              <h2 className="font-semibold mb-5">Default Currency</h2>
              <select className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                <option>NGN — Nigerian Naira</option>
                <option>KES — Kenyan Shilling</option>
                <option>GHS — Ghanaian Cedi</option>
                <option>ZAR — South African Rand</option>
                <option>USD — US Dollar</option>
              </select>
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-medium transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}