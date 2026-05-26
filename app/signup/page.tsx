"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth/actions";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
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
import { VerifyEmailPrompt } from "@/components/auth/VerifyEmailPrompt";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const result = await signUp({
        email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailRedirectTo: getAuthCallbackUrl("/dashboard"),
      });

      if (result.status === "existing_email") {
        toast.error("This email is already registered. Please sign in instead.");
        return;
      }

      if (result.status === "created") {
        toast.success("Account created!");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setPendingEmail(result.email);
      setStep("verify");
      toast.success("Check your email for a confirmation code or link.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <AuthCard>
        <AuthBrand />

        {step === "verify" ? (
          <VerifyEmailPrompt
            email={pendingEmail}
            onBack={() => setStep("form")}
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">
              Already have an AfriUSD account?{" "}
              <AuthLink href="/login">Sign in</AuthLink>
            </p>

            <h1 className="text-2xl sm:text-[1.65rem] font-semibold text-white leading-tight mb-8">
              Create an AfriUSD account to access your dashboard
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuthField
                  id="firstName"
                  label="First name"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  autoComplete="given-name"
                />
                <AuthField
                  id="lastName"
                  label="Last name"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                  autoComplete="family-name"
                />
              </div>

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
                autoComplete="new-password"
              />

              <AuthPrimaryButton loading={loading}>
                {loading ? "Creating account..." : "Create account"}
              </AuthPrimaryButton>
            </form>
          </>
        )}
      </AuthCard>
    </AuthPageShell>
  );
}
