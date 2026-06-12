"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { signOut } from "@/lib/auth/actions";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦", href: "/dashboard" },
  { id: "invoices", label: "Invoices", icon: "📄", href: "/dashboard/invoices" },
  { id: "payments", label: "Payments", icon: "💳", href: "/dashboard/payments" },
  { id: "analytics", label: "Analytics", icon: "📊", href: "/dashboard/analytics" },
  { id: "settings", label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const displayName = user?.user_metadata?.business_name || user?.email?.split("@")[0] || "Merchant";
  const displayEmail = user?.email ?? "";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Mobile Top Bar */}
      <header className="lg:hidden border-b px-4 py-3 flex items-center justify-between sticky top-0 backdrop-blur-md z-50"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--header-bg)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} style={{ color: "var(--text-secondary)" }} className="hover:opacity-80 p-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-sm">AfriUSD</span>
          </Link>
        </div>
        <div className="hidden">
          <ThemeToggle />
          <div className="flex items-center gap-1.5 border rounded-lg px-2 py-1.5"
            style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Arc Testnet</span>
          </div>
          <Link href="/invoice/create">
            <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ New</button>
          </Link>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-full w-64 border-r flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        `} style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">AfriUSD</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: "var(--text-secondary)" }}>✕</button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "hover:bg-emerald-500/5"
                  }`}
                  style={pathname !== item.href ? { color: "var(--text-secondary)" } : {}}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--bg-input)" }}>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-sm font-bold">{displayName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{displayEmail}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Theme</span>
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full text-sm border py-2 rounded-lg transition-colors disabled:opacity-50 hover:border-gray-500"
              style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
            >
              {loggingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}