"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  AuthBrand,
  AuthCard,
  AuthPageShell,
} from "@/components/auth/AuthForm";
import { VerifyEmailPrompt } from "@/components/auth/VerifyEmailPrompt";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return <VerifyEmailPrompt email={email} />;
}

export default function SignupVerifyPage() {
  return (
    <AuthPageShell>
      <AuthCard>
        <AuthBrand />
        <Suspense fallback={<div className="text-sm text-gray-500">Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </AuthCard>
    </AuthPageShell>
  );
}
