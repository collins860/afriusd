"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function NavbarAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show nothing while loading to avoid flash of wrong buttons
    return (
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="w-24 h-9 rounded-lg animate-pulse" style={{ backgroundColor: "var(--bg-input)" }} />
      </div>
    );
  }

  if (user) {
    const label = user.user_metadata?.business_name || (user.email?.split("@")[0] ?? "Account");
    return (
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-sm hidden sm:inline truncate max-w-[140px]" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
        <Link href="/dashboard">
          <button className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Dashboard
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Link href="/login">
        <button className="text-sm transition-colors px-4 py-2 hover:text-emerald-400"
          style={{ color: "var(--text-secondary)" }}>
          Sign in
        </button>
      </Link>
      <Link href="/signup">
        <button className="text-sm bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          Get Started
        </button>
      </Link>
    </div>
  );
}