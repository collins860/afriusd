"use client";

import DashboardLayout from "@/components/dashboard/Layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <header className="border-b px-4 lg:px-8 py-4 sticky top-0 backdrop-blur-md z-10"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <h1 className="text-lg lg:text-xl font-semibold">Settings</h1>
        <p className="text-xs lg:text-sm" style={{ color: "var(--text-muted)" }}>Manage your account</p>
      </header>

      <div className="p-4 lg:p-8 max-w-2xl">
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-5">Merchant Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>Business Name</label>
                <input defaultValue="My Business"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                  style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>Wallet Address</label>
                <input defaultValue="0x308c092244ca7266134acd2fff755af08a7a46db" disabled
                  className="w-full border rounded-lg px-4 py-3 text-sm cursor-not-allowed"
                  style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-muted)" }} />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-4">Network</h2>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--bg-input)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium">Arc Testnet</span>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">Connected</span>
            </div>
          </div>

          <div className="glass rounded-xl p-4 lg:p-6">
            <h2 className="font-semibold mb-4">Default Currency</h2>
            <select className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
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
    </DashboardLayout>
  );
}