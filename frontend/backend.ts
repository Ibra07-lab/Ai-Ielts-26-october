// Wrapper for the auto-generated Encore client
// This file creates and exports a singleton instance of the Client
// with automatic Supabase authentication on every request.
import Client, { Local } from './client';
import { supabase } from './lib/supabase';

// Wait for Supabase to finish initializing before any request
let supabaseReady = false;
supabase.auth.onAuthStateChange(() => {
  supabaseReady = true;
});

// Custom fetcher that injects the Supabase access token into every request
const authenticatedFetcher = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const modifiedInit: RequestInit = { ...init };

  // ✅ Wait if Supabase is still loading its session from localStorage
  if (!supabaseReady) {
    await new Promise(resolve => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        subscription.unsubscribe();
        resolve(null);
      });
    });
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    // 🔍 DEBUG: Check if we have a session and token
    console.log("TOKEN BEING SENT:", session?.access_token);
    console.log("SESSION EXPIRES AT:", session?.expires_at);
    console.log("USER ID:", session?.user?.id);

    if (session?.access_token) {
      modifiedInit.headers = {
        ...(modifiedInit.headers as Record<string, string>),
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    }
  } catch (e) {
    // If session retrieval fails, proceed without auth header
    console.warn('Failed to get Supabase session for Encore request:', e);
  }

  return fetch(input, modifiedInit);
};

const backend = new Client(Local, {
  fetcher: authenticatedFetcher as any,
});

export default backend;
export { Local };
