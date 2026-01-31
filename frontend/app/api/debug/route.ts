/**
 * Debug endpoint to check environment and database connection.
 * DELETE THIS FILE after debugging!
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Pool } from "@neondatabase/serverless";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : "NOT SET",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET (hidden)" : "NOT SET",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  // Test database connection
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const result = await pool.query("SELECT 1 as test, NOW() as time");
    checks.database = {
      status: "connected",
      result: result.rows[0],
    };
    await pool.end();
  } catch (error) {
    checks.database = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : undefined,
    };
  }

  return NextResponse.json(checks, { status: 200 });
}
