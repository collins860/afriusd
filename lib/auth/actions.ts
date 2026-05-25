import { supabase } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/auth/profile";
import type { SignUpInput } from "@/lib/auth/types";

export async function signUp(input: SignUpInput) {
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
  if (error) throw error;

  if (data.user && data.session) {
    await upsertProfile(supabase, data.user.id, {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      marketing_consent: input.marketingConsent,
    });
  }

  return data;
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
