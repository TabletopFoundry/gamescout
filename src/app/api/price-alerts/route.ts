/**
 * Price alert API.
 *
 * GET    — List active price alerts for the current user.
 * POST   — Create or update a price alert for a game.
 * DELETE — Deactivate a price alert by `gameId` (soft-delete).
 */

import { getDb } from "@/lib/db";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const userId = await getUserId();
    const alerts = db
      .prepare(
        `SELECT pa.id, pa.user_id, pa.game_id, pa.target_price, pa.email, pa.active, pa.created_at,
                g.name as game_name, g.thumbnail_url FROM price_alerts pa
         JOIN games g ON pa.game_id = g.id
         WHERE pa.user_id = ? AND pa.active = 1
         ORDER BY pa.created_at DESC`
      )
      .all(userId);
    return Response.json({ alerts });
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to load price alerts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const userId = await getUserId();

    let body: { gameId: number; targetPrice: number; email?: string };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { gameId, targetPrice, email } = body;

    if (!gameId || typeof targetPrice !== "number" || targetPrice <= 0) {
      return Response.json({ error: "gameId and a positive targetPrice are required" }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO price_alerts (user_id, game_id, target_price, email)
      VALUES (@userId, @gameId, @targetPrice, @email)
      ON CONFLICT(user_id, game_id) DO UPDATE SET target_price = excluded.target_price, email = excluded.email, active = 1
    `).run({ userId, gameId, targetPrice, email: email || null });

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to create price alert" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = getDb();
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const gameId = Number(searchParams.get("gameId"));

    if (Number.isNaN(gameId) || gameId <= 0) {
      return Response.json({ error: "gameId required" }, { status: 400 });
    }

    db.prepare(`UPDATE price_alerts SET active = 0 WHERE user_id = ? AND game_id = ?`).run(userId, gameId);

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to delete price alert" }, { status: 500 });
  }
}
