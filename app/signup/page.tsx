"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth/actions";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
import { toast } from "sonner";
import {
  AuthBrand,
  AuthCard,
  AuthCheckbox,
  AuthField,
  AuthLink,
  AuthPageShell,
  AuthPasswordField,
  AuthPrimaryButton,
  HumanVerificationPlaceholder,
} from "@/components/auth/AuthForm";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Please accept the terms and policies to continue.");
      return;
    }

    setLoading(true);
    try {
      const data = await signUp({
        email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailRedirectTo: getAuthCallbackUrl("/dashboard"),
        marketingConsent,
      });

      if (data.session) {
        toast.success("Account created!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.success("Check your email to confirm your account.");
      }
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

          <div className="space-y-4 pt-1">
            <AuthCheckbox
              id="marketing"
              checked={marketingConsent}
              onChange={setMarketingConsent}
            >
              I agree to receive product updates and communications from AfriUSD.
              You can unsubscribe at any time. See our{" "}
              <AuthLink href="/">Privacy Policy</AuthLink>.
            </AuthCheckbox>

            <AuthCheckbox
              id="terms"
              checked={termsAccepted}
              onChange={setTermsAccepted}
              required
            >
              I agree to the AfriUSD{" "}
              <AuthLink href="/">Terms of Service</AuthLink>,{" "}
              <AuthLink href="/">Privacy Policy</AuthLink>, and{" "}
              <AuthLink href="/">Acceptable Use Policy</AuthLink>.
            </AuthCheckbox>
          </div>

          <HumanVerificationPlaceholder />

          <AuthPrimaryButton loading={loading} disabled={!termsAccepted}>
            {loading ? "Creating account..." : "Create account"}
          </AuthPrimaryButton>
        </form>
      </AuthCard>
    </AuthPageShell>
  );
}
