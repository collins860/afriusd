"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { getProfile, saveMerchantSettings } from "@/lib/auth/profile";
import { toast } from "sonner";

const CURRENCIES = [
  { code: "NGN", label: "NGN — Nigerian Naira" },
  { code: "KES", label: "KES — Kenyan Shilling" },
  { code: "GHS", label: "GHS — Ghanaian Cedi" },
  { code: "ZAR", label: "ZAR — South African Rand" },
  { code: "USD", label: "USD — US Dollar" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const profile = await getProfile(supabase, user.id);
        if (profile) {
          setBusinessName(profile.business_name ?? "");
          setCurrency(profile.default_currency ?? "NGN");
        }
      } catch {
        toast.error("Could not load your settings");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveMerchantSettings(
        supabase,
        user.id,
        {
          business_name: businessName.trim(),
          default_currency: currency,
        },
        user
      );
      toast.success("Settings saved");
    } catch {
      toast.error("Could not save settings. Try again.");
    } finally {
      setSaving(false);
    }
  };

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
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={loading}
                  placeholder="My Business"
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 disabled:opacity-60"
                  style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
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
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={loading}
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 disabled:opacity-60"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
