import { submitLead as submitLeadToBackend } from "@leads/supabase-backend";

const supabaseUrl = import.meta.env.VITE_LEADS_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_LEADS_SUPABASE_ANON_KEY;

const SITE_ID = "enclava-ai";

export async function submitLead(email: string, source?: string) {
  if (!supabaseUrl || !supabaseAnonKey)
    return { status: "error", message: "Not configured" } as const;
  const payload = {
    siteId: SITE_ID,
    contactValue: email,
    metadata: { ...(source ? { source } : {}), site: SITE_ID },
  };
  const result = await submitLeadToBackend(supabaseUrl, supabaseAnonKey, payload);
  // sites.enclava-ai must exist (FK). If the row hasn't been inserted yet, keep
  // collecting under the legacy site_id so the waitlist does not 500.
  if (result.status === "error" && /23503|foreign key/i.test(result.message ?? "")) {
    return submitLeadToBackend(supabaseUrl, supabaseAnonKey, {
      ...payload,
      siteId: "enclava",
    });
  }
  return result;
}
