/**
 * Collection CRUD API.
 *
 * GET    — List all collection items (owned + wishlist) for the current user.
 * POST   — Add or update a game in the collection (upsert).
 * DELETE — Remove a game from the collection by `gameId`.
 */

import { getDb, parseGame, type GameRow, type CollectionRow } from "@/lib/db";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const userId = await getUserId();

  try {
    const rows = db
      .prepare(
        `SELECT c.id, c.user_id, c.game_id, c.status, c.added_at,
                g.id as g_id, g.name, g.year, g.description, g.min_players, g.max_players, 
                g.min_playtime, g.max_playtime, g.complexity, g.bgg_rating, g.bgg_rank,
                g.categories, g.mechanics, g.designer, g.publisher, g.image_url, g.thumbnail_url
         FROM collection c 
         JOIN games g ON c.game_id = g.id 
         WHERE c.user_id = ? 
         ORDER BY c.added_at DESC`
      )
      .all(userId) as (CollectionRow & GameRow)[];

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
  } catch {
    return Response.json({ error: "Failed to load collection" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const db = getDb();
  const userId = await getUserId();

  let body: { gameId: number; status: "owned" | "wishlist" };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { gameId, status } = body;

  if (!gameId || !["owned", "wishlist"].includes(status)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    db.prepare(`
      INSERT INTO collection (user_id, game_id, status)
      VALUES (@userId, @gameId, @status)
      ON CONFLICT(user_id, game_id) DO UPDATE SET status = excluded.status
    `).run({ userId, gameId, status });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const db = getDb();
  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get("gameId"));

  if (Number.isNaN(gameId) || gameId <= 0) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  try {
    db.prepare(`DELETE FROM collection WHERE user_id = ? AND game_id = ?`).run(userId, gameId);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to remove from collection" }, { status: 500 });
  }
}
