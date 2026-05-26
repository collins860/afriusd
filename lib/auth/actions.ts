import { supabase } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/auth/profile";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
import type { SignUpInput, SignUpResult } from "@/lib/auth/types";

function isExistingEmailError(error: { message?: string; code?: string }) {
  const msg = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();
  return (
    code === "user_already_exists" ||
    code === "email_exists" ||
    msg.includes("already registered") ||
    msg.includes("already been registered") ||
    msg.includes("user already")
  );
}

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: input.emailRedirectTo,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        marketing_consent: input.marketingConsent ?? false,
      },
    },
  });

  if (error) {
    if (isExistingEmailError(error)) {
      return { status: "existing_email" };
    }
    throw error;
  }

  if (data.session && data.user) {
    await upsertProfile(supabase, data.user.id, {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      marketing_consent: input.marketingConsent,
    });
    return { status: "created" };
  }

  // Supabase: existing confirmed user often returns user with no identities
  if (data.user?.identities?.length === 0) {
    return { status: "existing_email" };
  }

  // No session: try sign-in to tell "new + confirm email" vs "already registered"
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

  if (signInData.session) {
    await supabase.auth.signOut();
    return { status: "existing_email" };
  }

  if (signInError) {
    const msg = signInError.message.toLowerCase();
    const code = (signInError as { code?: string }).code ?? "";

    if (
      code === "email_not_confirmed" ||
      msg.includes("email not confirmed") ||
      msg.includes("not confirmed")
    ) {
      return { status: "confirm_email", email: input.email };
    }

    if (
      code === "invalid_credentials" ||
      msg.includes("invalid login") ||
      msg.includes("invalid credentials")
    ) {
      return { status: "existing_email" };
    }
  }

  return { status: "confirm_email", email: input.email };
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/dashboard"),
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("rate limit") || msg.includes("too many")) {
      throw new Error("Too many emails sent. Please wait a few minutes and try again.");
    }
    if (msg.includes("already confirmed")) {
      throw new Error("This email is already confirmed. Try signing in.");
    }
    throw error;
  }
}

export async function verifyEmailCode(email: string, token: string) {
  const code = token.trim();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "signup",
  });

  if (!error && data.session) {
    return data;
  }

  const fallback = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (fallback.error) {
    throw new Error("Invalid or expired code. Tap resend to get a new one.");
  }

  return fallback.data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
