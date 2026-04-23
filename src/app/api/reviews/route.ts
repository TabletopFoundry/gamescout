import { getDb, type ReviewRow } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { sanitizeText } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const db = getDb();
  const userId = await getUserId();

  let body: { gameId: number; rating: number; body?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { gameId, rating, body: reviewBody } = body;

  if (!gameId || !rating || rating < 1 || rating > 10) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (reviewBody && reviewBody.length > 5000) {
    return Response.json({ error: "Review body exceeds 5000 character limit" }, { status: 400 });
  }

  try {
    db.prepare(`
      INSERT INTO reviews (user_id, game_id, rating, body)
      VALUES (@userId, @gameId, @rating, @body)
      ON CONFLICT(user_id, game_id) DO UPDATE SET rating = excluded.rating, body = excluded.body
    `).run({ userId, gameId, rating, body: reviewBody ? sanitizeText(reviewBody) : null });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to save review" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get("gameId"));

  if (Number.isNaN(gameId) || gameId <= 0) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  try {
    const reviews = db
      .prepare(`SELECT id, user_id, game_id, rating, body, created_at FROM reviews WHERE game_id = ? ORDER BY created_at DESC`)
      .all(gameId) as ReviewRow[];

    return Response.json({ reviews });
  } catch {
    return Response.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}
