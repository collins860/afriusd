"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth/actions";
import { toast } from "sonner";
import {
  AuthBrand,
  AuthCard,
  AuthField,
  AuthLink,
  AuthPageShell,
  AuthPasswordField,
  AuthPrimaryButton,
} from "@/components/auth/AuthForm";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthBrand />

      <p className="text-sm text-gray-500 mb-2">
        Don&apos;t have an account?{" "}
        <AuthLink href="/signup">Create account</AuthLink>
      </p>

      <h1 className="text-2xl sm:text-[1.65rem] font-semibold text-white leading-tight mb-8">
        Sign in to your AfriUSD dashboard
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="email"
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
        />

        <AuthPasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Password"
          autoComplete="current-password"
        />

        <AuthPrimaryButton loading={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </AuthPrimaryButton>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <AuthPageShell>
      <Suspense
        fallback={
          <div className="text-center text-sm text-gray-500 py-12">Loading...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
