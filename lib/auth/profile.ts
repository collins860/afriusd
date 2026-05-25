import type { SupabaseClient } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  marketing_consent: boolean;
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

export function getFullName(profile: Pick<UserProfile, "first_name" | "last_name">) {
  return [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
}
