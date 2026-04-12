import { getDb, type ReviewRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();
  const { gameId, rating, body: reviewBody } = body as {
    gameId: number;
    rating: number;
    body?: string;
  };

  if (!gameId || !rating || rating < 1 || rating > 10) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO reviews (user_id, game_id, rating, body)
    VALUES (1, @gameId, @rating, @body)
    ON CONFLICT(user_id, game_id) DO UPDATE SET rating = excluded.rating, body = excluded.body
  `).run({ gameId, rating, body: reviewBody || null });

  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get("gameId"));

  if (!gameId) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  const reviews = db
    .prepare(`SELECT * FROM reviews WHERE game_id = ? ORDER BY created_at DESC`)
    .all(gameId) as ReviewRow[];

  return Response.json({ reviews });
}
