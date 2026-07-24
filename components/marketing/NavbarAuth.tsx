"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/auth/profile";

export function NavbarAuth() {
  const { user, loading } = useAuth();
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBusinessName(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const profile = await getProfile(supabase, user.id);
        if (!cancelled) {
          setBusinessName(profile?.business_name ?? null);
        }
      } catch {
        // Silently fall back to email if profile fetch fails
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:block"><ThemeToggle /></div>
        <div className="w-24 h-9 rounded-lg animate-pulse" style={{ backgroundColor: "var(--bg-input)" }} />
      </div>
    );
  }

  if (user) {
    const label = businessName || (user.email?.split("@")[0] ?? "Account");
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:block"><ThemeToggle /></div>
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
      <div className="hidden sm:block"><ThemeToggle /></div>
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
