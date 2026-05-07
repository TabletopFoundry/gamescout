/**
 * Game reviews API.
 *
 * GET  — List reviews for a game by `gameId`.
 * POST — Create or update (upsert) the current user's review for a game.
 */

import { getDb } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { sanitizeText } from "@/lib/sanitize";
import type { Review } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const db = getDb();
    const userId = await getUserId();

    let body: { gameId?: unknown; rating?: unknown; body?: unknown };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { gameId, rating, body: reviewBody } = body;

    if (
      typeof gameId !== "number" ||
      !Number.isInteger(gameId) ||
      gameId <= 0 ||
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 10 ||
      (reviewBody !== undefined && reviewBody !== null && typeof reviewBody !== "string")
    ) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    if (typeof reviewBody === "string" && reviewBody.length > 5000) {
      return Response.json({ error: "Review body exceeds 5000 character limit" }, { status: 400 });
    }

    const sanitizedReviewBody =
      typeof reviewBody === "string" && reviewBody.length > 0
        ? sanitizeText(reviewBody)
        : null;

    db.prepare(`
      INSERT INTO reviews (user_id, game_id, rating, body)
      VALUES (@userId, @gameId, @rating, @body)
      ON CONFLICT(user_id, game_id) DO UPDATE SET rating = excluded.rating, body = excluded.body
    `).run({ userId, gameId, rating, body: sanitizedReviewBody });

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.name === "RateLimitError") {
      return Response.json({ error: e.message }, { status: 429 });
    }
    return Response.json({ error: "Failed to save review" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get("gameId"));

  if (Number.isNaN(gameId) || gameId <= 0) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  try {
    const db = getDb();
    const reviews = db
      .prepare(
        `SELECT r.id, r.rating, r.body, r.created_at, u.username
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.game_id = ?
         ORDER BY r.created_at DESC`
      )
      .all(gameId) as Review[];

    return Response.json({ reviews });
  } catch {
    return Response.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}
