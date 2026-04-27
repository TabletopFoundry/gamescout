/**
 * Game detail API.
 *
 * GET — Fetch a single game with prices, reviews, similar games,
 *        collection status, average review score, and play logs.
 */

import { getDb, parseGame, type GameRow, type PriceRow, type ReviewRow, GAME_COLUMNS, GAME_LIST_COLUMNS } from "@/lib/db";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const userId = await getUserId();

  try {
    const gameRow = db
      .prepare(`SELECT ${GAME_COLUMNS} FROM games WHERE id = ?`)
      .get(Number(id)) as GameRow | undefined;

    if (!gameRow) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    const game = parseGame(gameRow);

    // Prices
    const prices = db
      .prepare(
        `SELECT id, game_id, retailer, price, url, updated_at FROM price_history WHERE game_id = ? ORDER BY price ASC`
      )
      .all(Number(id)) as PriceRow[];

    // Reviews
    const reviews = db
      .prepare(
        `SELECT r.id, r.user_id, r.game_id, r.rating, r.body, r.created_at, u.username FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.game_id = ? ORDER BY r.created_at DESC`
      )
      .all(Number(id)) as (ReviewRow & { username: string })[];

    // Collection status for current user
    const collectionStatus = db
      .prepare(
        `SELECT status FROM collection WHERE user_id = ? AND game_id = ?`
      )
      .get(userId, Number(id)) as { status: string } | undefined;

    // Similar games (by overlapping categories via SQL json_each)
    const similarRows = db
      .prepare(
        `SELECT ${GAME_LIST_COLUMNS}, COUNT(*) as overlap
         FROM games g, json_each(g.categories) je
         WHERE g.id != ?
           AND je.value IN (SELECT value FROM json_each((SELECT categories FROM games WHERE id = ?)))
         GROUP BY g.id
         ORDER BY overlap DESC, g.bgg_rating DESC
         LIMIT 6`
      )
      .all(Number(id), Number(id)) as (GameRow & { overlap: number })[];

    const similar = similarRows.map((row) => parseGame(row));

    // Average community rating from reviews
    const avgReview =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : null;

    // Play logs for this game
    const playLogs = db
      .prepare(
        `SELECT pl.id, pl.played_at, pl.players, pl.winner, pl.rating, pl.notes, g.name as game_name FROM play_logs pl JOIN games g ON pl.game_id = g.id WHERE pl.user_id = ? AND pl.game_id = ? ORDER BY pl.played_at DESC`
      )
      .all(userId, Number(id));

    return Response.json({
      game,
      prices,
      reviews,
      similar,
      collectionStatus: collectionStatus?.status || null,
      avgReview,
      playLogs,
    });
  } catch {
    return Response.json({ error: "Failed to load game details" }, { status: 500 });
  }
}
