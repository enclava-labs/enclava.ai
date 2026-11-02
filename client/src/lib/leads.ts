import { turnstileToken } from "./turnstile";

// Shared leads collector (Cloudflare Worker + D1, leads-collector repo). Public URL, it ships in the bundle.
const endpoint = import.meta.env.VITE_LEADS_ENDPOINT;

const SITE_ID = "enclava-ai";

export async function submitLead(email: string, source?: string) {
  if (!endpoint) return { status: "error", message: "Not configured" } as const;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      siteId: SITE_ID,
      contactValue: email,
      metadata: source ? { source } : {},
      turnstileToken: await turnstileToken(),
    }),
  });
  // 200 is "ok" or "duplicate": either way the visitor is on the list.
  if (res.ok) return { status: "ok" } as const;
  const body = await res.json().catch(() => null);
  return { status: "error", message: body?.message ?? res.statusText } as const;
}
