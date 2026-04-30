/**
 * Game search and browse API.
 *
 * GET — Search/filter the game catalog by name, category, mechanic,
 *        player count, complexity, and playtime. All filtering runs in SQL.
 */

import type { NextRequest } from "next/server";
import { getDb, parseGame, type GameRow, GAME_LIST_COLUMNS } from "@/lib/db";

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

  // Build SQL WHERE clauses dynamically so filters run in the DB, not post-LIMIT JS
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (q) {
    const escaped = q.replace(/[%_\\]/g, "\\$&");
    conditions.push(`name LIKE ? ESCAPE '\\'`);
    params.push(`%${escaped}%`);
  }

  if (category) {
    conditions.push(`categories LIKE ? ESCAPE '\\'`);
    const escapedCat = category.replace(/[%_\\]/g, "\\$&");
    params.push(`%${escapedCat}%`);
  }

  if (mechanic) {
    conditions.push(`mechanics LIKE ? ESCAPE '\\'`);
    const escapedMech = mechanic.replace(/[%_\\]/g, "\\$&");
    params.push(`%${escapedMech}%`);
  }

  if (minPlayers > 0) {
    conditions.push(`max_players >= ?`);
    params.push(minPlayers);
  }

  if (maxComplexity < 5) {
    conditions.push(`complexity <= ?`);
    params.push(maxComplexity);
  }

  if (maxPlaytime < 9999) {
    conditions.push(`min_playtime <= ?`);
    params.push(maxPlaytime);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const rows = db
      .prepare(`SELECT ${GAME_LIST_COLUMNS} FROM games ${whereClause} ORDER BY bgg_rank ASC LIMIT ?`)
      .all(...params, limit) as GameRow[];

    const games = rows.map(parseGame);

    return Response.json({ games, total: games.length });
  } catch {
    return Response.json({ error: "Failed to search games" }, { status: 500 });
  }
}
