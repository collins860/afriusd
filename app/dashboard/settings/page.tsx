"use client";

import DashboardLayout from "@/components/dashboard/Layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <header className="border-b border-[#1e1e2e] px-4 lg:px-8 py-4 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <h1 className="text-lg lg:text-xl font-semibold">Settings</h1>
        <p className="text-gray-500 text-xs lg:text-sm">Manage your account</p>
      </header>

      <div className="p-4 lg:p-8 max-w-2xl">
        <div className="space-y-4">
          <div className="glass rounded-xl border border-[#1e1e2e] p-4 lg:p-6">
            <h2 className="font-semibold mb-5">Merchant Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Business Name</label>
                <input defaultValue="My Business" className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Wallet Address</label>
                <input defaultValue="0x308c092244ca7266134acd2fff755af08a7a46db" disabled className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl border border-[#1e1e2e] p-4 lg:p-6">
            <h2 className="font-semibold mb-4">Network</h2>
            <div className="flex items-center justify-between p-4 bg-[#1a1a24] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium">Arc Testnet</span>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">Connected</span>
            </div>
          </div>

          <div className="glass rounded-xl border border-[#1e1e2e] p-4 lg:p-6">
            <h2 className="font-semibold mb-4">Default Currency</h2>
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
    </DashboardLayout>
  );
}