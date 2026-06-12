"use client";

import Link from "next/link";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="w-full max-w-[520px]">{children}</div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="glass rounded-xl px-8 py-8 sm:px-10 sm:py-10">
      {children}
    </div>
  );
}

export function AuthBrand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 mb-6">
      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
        <span className="text-white font-bold text-sm">A</span>
      </div>
      <span className="font-semibold text-lg">AfriUSD</span>
    </Link>
  );
}

type AuthFieldProps = { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({ label, id, className = "", ...props }: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input id={id}
        className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors ${className}`}
        style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        {...props} />
    </div>
  );
}

export function AuthPasswordField({ label, id, value, onChange, placeholder = "Password", autoComplete }: {
  label: string; id: string; value: string; onChange: (value: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-sm block mb-2" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} value={value}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          required minLength={6} autoComplete={autoComplete}
          className="w-full border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
        <button type="button" onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
          style={{ color: "var(--text-muted)" }}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export function AuthCheckbox({ id, checked, onChange, required, children }: {
  id: string; checked: boolean; onChange: (checked: boolean) => void; required?: boolean; children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex gap-3 items-start cursor-pointer">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} required={required}
        className="mt-0.5 h-4 w-4 rounded text-emerald-500 focus:ring-emerald-500/30"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }} />
      <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</span>
    </label>
  );
}

export function AuthPrimaryButton({ children, loading, disabled }: {
  children: ReactNode; loading?: boolean; disabled?: boolean;
}) {
  return (
    <button type="submit" disabled={disabled || loading}
      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors">
      {children}
    </button>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-emerald-400 hover:text-emerald-300 transition-colors">{children}</Link>
  );
}