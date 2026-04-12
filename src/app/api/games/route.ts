import { NextRequest } from "next/server";
import { getDb, parseGame, type GameRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const mechanic = searchParams.get("mechanic") || "";
  const minPlayers = Number(searchParams.get("minPlayers") || 0);
  const maxComplexity = Number(searchParams.get("maxComplexity") || 5);
  const maxPlaytime = Number(searchParams.get("maxPlaytime") || 9999);
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

  let rows: GameRow[];

  if (q) {
    rows = db
      .prepare(`SELECT * FROM games WHERE name LIKE ? ORDER BY bgg_rank ASC LIMIT ?`)
      .all(`%${q}%`, limit) as GameRow[];
  } else {
    rows = db
      .prepare(`SELECT * FROM games ORDER BY bgg_rank ASC LIMIT ?`)
      .all(limit) as GameRow[];
  }

  let games = rows.map(parseGame);

  // Filter by category
  if (category) {
    games = games.filter((g) =>
      g.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Filter by mechanic
  if (mechanic) {
    games = games.filter((g) =>
      g.mechanics.some((m) => m.toLowerCase().includes(mechanic.toLowerCase()))
    );
  }

  // Filter by player count
  if (minPlayers > 0) {
    games = games.filter((g) => g.max_players >= minPlayers);
  }

  // Filter by complexity
  if (maxComplexity < 5) {
    games = games.filter((g) => g.complexity <= maxComplexity);
  }

  // Filter by playtime
  if (maxPlaytime < 9999) {
    games = games.filter((g) => g.min_playtime <= maxPlaytime);
  }

  return Response.json({ games, total: games.length });
}
