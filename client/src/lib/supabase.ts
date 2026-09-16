import { submitLead as submitLeadToBackend } from "@leads/supabase-backend";

const supabaseUrl = import.meta.env.VITE_LEADS_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_LEADS_SUPABASE_ANON_KEY;

const SITE_ID = "enclava-ai";

export async function submitLead(email: string, source?: string) {
  if (!supabaseUrl || !supabaseAnonKey)
    return { status: "error", message: "Not configured" } as const;
  return submitLeadToBackend(supabaseUrl, supabaseAnonKey, {
    siteId: SITE_ID,
    contactValue: email,
    metadata: { ...(source ? { source } : {}), site: SITE_ID },
  });
}
