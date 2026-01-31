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
import { NextRequest, NextResponse } from "next/server";

// Get the base handlers
const handlers = toNextJsHandler(auth);

// Wrap GET with error handling
export async function GET(request: NextRequest) {
  try {
    return await handlers.GET(request);
  } catch (error) {
    console.error("Auth GET error:", error);
    // Always return error details for debugging (remove in production later)
    return NextResponse.json(
      {
        error: "Auth error",
        message: error instanceof Error ? error.message : "Unknown error",
        name: error instanceof Error ? error.name : undefined,
      },
      { status: 500 }
    );
  }
}

// Wrap POST with error handling
export async function POST(request: NextRequest) {
  try {
    return await handlers.POST(request);
  } catch (error) {
    console.error("Auth POST error:", error);
    return NextResponse.json(
      {
        error: "Auth error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}
