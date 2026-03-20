import { authHandler as createAuthHandler } from "encore.dev/auth";
import { APIError, Header } from "encore.dev/api";

interface AuthParams {
  authorization: Header<string>;
}

export interface AuthData {
  userID: string;
}

/**
 * Decode a JWT payload without verification.
 * In development, we trust the token from the frontend (signed by Supabase).
 * For production, add proper JWT verification with the Supabase JWT secret.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Base64url decode the payload (2nd segment)
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Authentication handler for Supabase JWTs.
 * Extracts user ID from the JWT's "sub" claim.
 */
export const authHandler = createAuthHandler<AuthParams, AuthData>(async (params) => {
  const authHeader = params.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    throw APIError.unauthenticated("Missing authentication token");
  }

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.sub) {
    throw APIError.unauthenticated("Invalid authentication token");
  }

  // Check expiry
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw APIError.unauthenticated("Token expired");
  }

  return { userID: payload.sub };
});

