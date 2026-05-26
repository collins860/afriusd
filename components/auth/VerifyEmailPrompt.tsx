"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resendConfirmationEmail, verifyEmailCode } from "@/lib/auth/actions";
import { toast } from "sonner";
import { AuthLink, AuthPrimaryButton } from "@/components/auth/AuthForm";

const RESEND_COOLDOWN_SEC = 60;

export function VerifyEmailPrompt({
  email,
}: {
  email: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    setVerifying(true);
    try {
      await verifyEmailCode(email, code.trim());
      toast.success("Email verified!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      await resendConfirmationEmail(email);
      toast.success("Confirmation email sent. Check your inbox and spam folder.");
      setCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Verify your email</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          We sent a confirmation to{" "}
          <span className="text-white font-medium">{email}</span>. Enter the
          6-digit code from the email, or open the confirmation link in that
          message.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label
            htmlFor="verifyCode"
            className="text-sm text-gray-400 block mb-2"
          >
            Confirmation code
          </label>
          <input
            id="verifyCode"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full bg-[#1a1a24] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white text-center tracking-[0.3em] placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <AuthPrimaryButton loading={verifying} disabled={code.length < 6}>
          {verifying ? "Verifying..." : "Verify email"}
        </AuthPrimaryButton>
      </form>

      <div className="border-t border-[#1e1e2e] pt-4 text-center space-y-2">
        <p className="text-sm text-gray-500">Didn&apos;t get the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="text-sm text-emerald-400 hover:text-emerald-300 disabled:text-gray-600 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {resending
            ? "Sending..."
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend confirmation email"}
        </button>
        <p className="text-xs text-gray-600">
          Check your spam or promotions folder too.
        </p>
      </div>

      <p className="text-center text-sm text-gray-500">
        <AuthLink href="/signup">← Back to sign up</AuthLink>
        {" · "}
        <AuthLink href="/login">Sign in</AuthLink>
      </p>
    </div>
  );
}
