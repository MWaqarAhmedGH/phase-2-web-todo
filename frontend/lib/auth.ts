/**
 * Better Auth server configuration with JWT plugin.
 *
 * This configures authentication for the Next.js frontend.
 * JWTs issued here will be verified by the FastAPI backend
 * using the shared BETTER_AUTH_SECRET.
 */

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { kyselyAdapter } from "better-auth/adapters/kysely";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { neonConfig } from "@neondatabase/serverless";

// Enable fetch connection for serverless (required for Vercel)
neonConfig.fetchConnectionCache = true;

// Create Kysely instance with Neon dialect (optimized for serverless)
const db = new Kysely<any>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL!,
  }),
});

/**
 * Initialize Better Auth with:
 * - Kysely + Neon serverless (optimized for Vercel Edge/Serverless)
 * - JWT plugin for issuing tokens to send to backend API
 * - Email/password authentication
 */
export const auth = betterAuth({
  // Kysely adapter with Neon dialect
  database: kyselyAdapter(db, {
    provider: "pg",
  }),

  // Secret for signing JWTs - MUST match backend BETTER_AUTH_SECRET
  secret: process.env.BETTER_AUTH_SECRET,

  // Base URL for auth endpoints
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    // Auto sign-in after signup for better UX
    autoSignIn: true,
  },

  // JWT plugin configuration
  plugins: [
    jwt({
      jwt: {
        // JWT expiration time (7 days)
        expirationTime: "7d",

        // Custom JWT payload - include user_id as 'sub' claim
        // This is what the backend will use to identify the user
        definePayload: ({ user }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],

  // Session configuration
  session: {
    // Session expiration (7 days)
    expiresIn: 60 * 60 * 24 * 7,
    // Update session expiration on activity
    updateAge: 60 * 60 * 24,
  },
});

// Export type for use in other files
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
