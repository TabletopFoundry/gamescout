import { getDb, parseGame, type GameRow, type CollectionRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();

  const rows = db
    .prepare(
      `SELECT c.*, g.* FROM collection c 
       JOIN games g ON c.game_id = g.id 
       WHERE c.user_id = 1 
       ORDER BY c.added_at DESC`
    )
    .all() as (CollectionRow & GameRow)[];

  const items = rows.map((row) => ({
    collectionId: row.id,
    status: row.status,
    addedAt: row.added_at,
    game: parseGame({
      id: row.game_id,
      name: row.name,
      year: row.year,
      description: row.description,
      min_players: row.min_players,
      max_players: row.max_players,
      min_playtime: row.min_playtime,
      max_playtime: row.max_playtime,
      complexity: row.complexity,
      bgg_rating: row.bgg_rating,
      bgg_rank: row.bgg_rank,
      categories: row.categories,
      mechanics: row.mechanics,
      designer: row.designer,
      publisher: row.publisher,
      image_url: row.image_url,
      thumbnail_url: row.thumbnail_url,
    }),
  }));

  return Response.json({ items });
}

export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();
  const { gameId, status } = body as { gameId: number; status: "owned" | "wishlist" };

  if (!gameId || !["owned", "wishlist"].includes(status)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO collection (user_id, game_id, status)
    VALUES (1, @gameId, @status)
    ON CONFLICT(user_id, game_id) DO UPDATE SET status = excluded.status
  `).run({ gameId, status });

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get("gameId"));

  if (!gameId) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  db.prepare(`DELETE FROM collection WHERE user_id = 1 AND game_id = ?`).run(gameId);

  return Response.json({ ok: true });
}
