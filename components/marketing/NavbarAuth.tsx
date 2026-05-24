"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";

export function NavbarAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 px-4 py-2">...</span>
      </div>
    );
  }

  if (user) {
    const label = user.email?.split("@")[0] ?? "Account";
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 hidden sm:inline truncate max-w-[140px]">
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
      <Link href="/login">
        <button className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
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
