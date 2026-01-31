/**
 * Debug endpoint to test Better Auth initialization.
 * DELETE THIS FILE after debugging!
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  try {
    // Try to import and initialize auth
    const { auth } = await import("@/lib/auth");
    result.authImport = "success";
    result.authType = typeof auth;
    result.authHandler = typeof auth.handler;

    // Try to call a simple method
    if (auth.api) {
      result.authApi = Object.keys(auth.api || {});
    }
  } catch (error) {
    result.authImport = "failed";
    result.error = {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : undefined,
      stack: error instanceof Error ? error.stack?.split("\n").slice(0, 5) : undefined,
    };
  }

  return NextResponse.json(result, { status: 200 });
}
