/**
 * Better Auth server configuration with JWT plugin.
 *
 * This configures authentication for the Next.js frontend.
 * JWTs issued here will be verified by the FastAPI backend
 * using the shared BETTER_AUTH_SECRET.
 */

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

// Create PostgreSQL connection pool using Neon database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Initialize Better Auth with:
 * - PostgreSQL database for user/session storage (works on Vercel)
 * - JWT plugin for issuing tokens to send to backend API
 * - Email/password authentication
 */
export const auth = betterAuth({
  // PostgreSQL database for storing users and sessions
  database: pool,

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
