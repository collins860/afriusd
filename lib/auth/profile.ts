import type { SupabaseClient } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  marketing_consent: boolean;
  business_name: string | null;
  default_currency: string | null;
  created_at: string;
};

export async function upsertProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    marketing_consent?: boolean;
  }
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      marketing_consent: profile.marketing_consent ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfile | null;
}

/**
 * Safely saves business_name / default_currency.
 * - If a profile row already exists, only those two fields are touched —
 *   existing email/first_name/last_name are preserved untouched.
 * - If no profile row exists yet, one is created using the auth user's
 *   email/metadata as a fallback so required fields aren't left blank.
 */
export async function saveMerchantSettings(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Pick<UserProfile, "business_name" | "default_currency">>,
  authUser: { email?: string | null; user_metadata?: { first_name?: string; last_name?: string } }
): Promise<UserProfile> {
  const existing = await getProfile(supabase, userId);

  const payload = {
    id: userId,
    email: existing?.email ?? authUser.email ?? "",
    first_name: existing?.first_name ?? authUser.user_metadata?.first_name ?? "",
    last_name: existing?.last_name ?? authUser.user_metadata?.last_name ?? "",
    marketing_consent: existing?.marketing_consent ?? false,
    ...updates,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export function getFullName(profile: Pick<UserProfile, "first_name" | "last_name">) {
  return [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
}
