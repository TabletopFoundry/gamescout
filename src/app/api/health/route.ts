/**
 * Health check API.
 *
 * GET — Returns a 200 JSON response with service status and timestamp.
 *        Useful for uptime monitoring, load-balancer probes, and deploy verification.
 */

import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const result = db.prepare("SELECT COUNT(*) as count FROM games").get() as {
      count: number;
    };

    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      games: result.count,
    });
  } catch {
    return Response.json(
      { status: "unhealthy", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
