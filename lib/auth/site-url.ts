/** Canonical app URL for auth redirects (production vs local). */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(next = "/dashboard"): string {
  const site = getSiteUrl();
  const path = next.startsWith("/") ? next : `/${next}`;
  return `${site}/auth/callback?next=${encodeURIComponent(path)}`;
}
