"use client";

import Link from "next/link";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px]">{children}</div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="glass rounded-xl border border-[#1e1e2e] px-8 py-8 sm:px-10 sm:py-10">
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
      <span className="font-semibold text-lg text-white">AfriUSD</span>
    </Link>
  );
}

type AuthFieldProps = {
  label: string;
  id: string;
} & InputHTMLAttributes<HTMLInputElement>;

const inputClassName =
  "w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors";

export function AuthField({ label, id, className = "", ...props }: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-400 block mb-2">
        {label}
      </label>
      <input id={id} className={`${inputClassName} ${className}`} {...props} />
    </div>
  );
}

export function AuthPasswordField({
  label,
  id,
  value,
  onChange,
  placeholder = "Password",
  autoComplete,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-400 block mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          minLength={6}
          autoComplete={autoComplete}
          className={`${inputClassName} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export function AuthCheckbox({
  id,
  checked,
  onChange,
  required,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex gap-3 items-start cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-0.5 h-4 w-4 rounded border-[#1e1e2e] bg-[#1a1a24] text-emerald-500 focus:ring-emerald-500/30"
      />
      <span className="text-sm text-gray-400 leading-relaxed">{children}</span>
    </label>
  );
}

export function HumanVerificationPlaceholder() {
  return (
    <div className="border border-[#1e1e2e] rounded-lg px-4 py-3 flex items-center justify-between bg-[#1a1a24]">
      <label className="flex items-center gap-3 text-sm text-gray-500 cursor-default">
        <input
          type="checkbox"
          disabled
          className="h-4 w-4 rounded border-[#1e1e2e] bg-[#1a1a24]"
        />
        Verify you are human
      </label>
      <span className="text-[10px] text-gray-600">Cloudflare · Privacy · Help</span>
    </div>
  );
}

export function AuthPrimaryButton({
  children,
  loading,
  disabled,
}: {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors"
    >
      {children}
    </button>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-emerald-400 hover:text-emerald-300 transition-colors">
      {children}
    </Link>
  );
}
