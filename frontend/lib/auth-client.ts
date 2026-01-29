/**
 * Better Auth client configuration.
 *
 * This provides client-side authentication methods:
 * - signUp: Create a new account
 * - signIn: Login with email/password
 * - signOut: Logout and clear session
 * - useSession: React hook for session state
 * - getSession: Get current session
 * - getToken: Get JWT token for API requests
 */

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

/**
 * Auth client with JWT plugin for retrieving tokens.
 *
 * Usage:
 *   import { authClient } from "@/lib/auth-client";
 *
 *   // Sign up
 *   await authClient.signUp.email({ email, password, name });
 *
 *   // Sign in
 *   await authClient.signIn.email({ email, password });
 *
 *   // Sign out
 *   await authClient.signOut();
 *
 *   // Get JWT token for API requests
 *   const { token } = await authClient.getToken();
 *
 *   // React hook for session
 *   const { data: session, isPending } = authClient.useSession();
 */
export const authClient = createAuthClient({
  // Base URL for auth API endpoints
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",

  // JWT plugin for token retrieval
  plugins: [jwtClient()],

  // Ensure cookies are sent with all requests
  fetchOptions: {
    credentials: "include" as RequestCredentials,
  },
});

// Export individual methods for convenience
export const {
  signUp,
  signIn,
  signOut,
  useSession,
  getSession,
} = authClient;

/**
 * Get the current JWT token for API requests.
 *
 * The JWT plugin adds a `token` method to the auth client.
 *
 * Usage:
 *   const token = await getToken();
 *   fetch('/api/...', {
 *     headers: { Authorization: `Bearer ${token}` }
 *   });
 */
export async function getToken(): Promise<string | null> {
  try {
    console.log("getToken: Fetching token from Better Auth...");
    // The jwt plugin adds $fetch.token() method
    const response = await authClient.token();
    console.log("getToken: Response:", response);
    return response.data?.token || null;
  } catch (err) {
    console.error("getToken: Error:", err);
    return null;
  }
}
