// Wrapper for the auto-generated Encore client
// This file creates and exports a singleton instance of the Client
// with automatic Supabase authentication on every request.
import Client, { Local } from './client';
import { supabase } from './lib/supabase';

// Custom fetcher that injects the Supabase access token into every request
const authenticatedFetcher = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const modifiedInit: RequestInit = { ...init };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      modifiedInit.headers = {
        ...(modifiedInit.headers as Record<string, string>),
        'Authorization': `Bearer ${session.access_token}`,
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
