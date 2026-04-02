import { authHandler } from "encore.dev/auth";
import { APIError, Gateway, Header } from "encore.dev/api";
import { secret } from "encore.dev/config";

const supabaseUrl = secret("SUPABASE_URL");
const supabaseAnonKey = secret("SUPABASE_ANON_KEY");

interface AuthParams {
  authorization: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
}

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const token = params.authorization?.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    throw APIError.unauthenticated("No token provided");
  }

  try {
    // TEMP DEBUG
    const url = supabaseUrl() || "";
    const key = supabaseAnonKey() || "";
    console.log("SERVER DEBUG URL:", `Len: ${url.length}, Ends with: '${url.slice(-5)}'`);
    console.log("SERVER DEBUG KEY:", `Len: ${key.length}, Ends with: '${key.slice(-5)}'`);

    // Direct REST call — exactly what cURL proved works
    const response = await fetch(`${url}/auth/v1/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": key,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.log("Supabase rejected token:", response.status, body);
      throw APIError.unauthenticated("Invalid or expired token");
    }

    const user = await response.json() as { id?: string };

    if (!user || !user.id) {
      throw APIError.unauthenticated("No user in response");
    }

    return { userID: user.id };

  } catch (err) {
    if (err instanceof APIError) throw err;
    console.log("Auth fetch error:", err);
    throw APIError.unauthenticated("Auth verification failed");
  }
});

export const gateway = new Gateway({
  authHandler: auth,
});
