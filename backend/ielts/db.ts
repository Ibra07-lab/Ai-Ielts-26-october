import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseURL, SupabaseServiceRoleKey } from "./secrets";

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = SupabaseURL();
    const key = SupabaseServiceRoleKey();

    if (!url || !key) {
      throw new Error(`Missing Supabase secrets — URL: ${url ? "set" : "missing"}, KEY: ${key ? "set" : "missing"}`);
    }

    _client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

// Proxy so all callers can keep using supabaseAdmin.from(...) unchanged.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});
