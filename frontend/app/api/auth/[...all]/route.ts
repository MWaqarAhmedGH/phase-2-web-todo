/**
 * Better Auth API route handler.
 *
 * This catch-all route handles all authentication endpoints:
 * - POST /api/auth/sign-up/email - Create account
 * - POST /api/auth/sign-in/email - Login
 * - POST /api/auth/sign-out - Logout
 * - GET  /api/auth/session - Get current session
 * - GET  /api/auth/token - Get JWT token (via jwt plugin)
 *
 * Better Auth handles the routing internally based on the path.
 */
export const runtime = "nodejs";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Export handlers for all HTTP methods
export const { GET, POST } = toNextJsHandler(auth);
