import { getDb, parseGame, type GameRow, type PriceRow, type ReviewRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const gameRow = db
    .prepare("SELECT * FROM games WHERE id = ?")
    .get(Number(id)) as GameRow | undefined;

  if (!gameRow) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  const game = parseGame(gameRow);

  // Prices
  const prices = db
    .prepare(
      `SELECT * FROM price_history WHERE game_id = ? ORDER BY price ASC`
    )
    .all(Number(id)) as PriceRow[];

  // Reviews
  const reviews = db
    .prepare(
      `SELECT r.*, 'demo' as username FROM reviews r WHERE r.game_id = ? ORDER BY r.created_at DESC`
    )
    .all(Number(id)) as (ReviewRow & { username: string })[];

  // Collection status for demo user
  const collectionStatus = db
    .prepare(
      `SELECT status FROM collection WHERE user_id = 1 AND game_id = ?`
    )
    .get(Number(id)) as { status: string } | undefined;

  // Similar games (by overlapping categories)
  const allGames = (
    db.prepare("SELECT * FROM games ORDER BY bgg_rank ASC").all() as GameRow[]
  ).map(parseGame);

  const similar = allGames
    .filter((g) => g.id !== game.id)
    .map((g) => {
      const overlap = g.categories.filter((c) => game.categories.includes(c)).length;
      return { game: g, overlap };
    })
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.game.bgg_rating - a.game.bgg_rating)
    .slice(0, 6)
    .map((x) => x.game);

  // Average community rating from reviews
  const avgReview =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  // Play logs for this game
  const playLogs = db
    .prepare(
      `SELECT pl.*, g.name as game_name FROM play_logs pl JOIN games g ON pl.game_id = g.id WHERE pl.user_id = 1 AND pl.game_id = ? ORDER BY pl.played_at DESC`
    )
    .all(Number(id));

  return Response.json({
    game,
    prices,
    reviews,
    similar,
    collectionStatus: collectionStatus?.status || null,
    avgReview,
    playLogs,
  });
}
