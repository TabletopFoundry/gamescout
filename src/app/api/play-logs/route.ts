import { getDb, type PlayLogRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();

  const logs = db
    .prepare(
      `SELECT pl.*, g.name as game_name, g.thumbnail_url
       FROM play_logs pl
       JOIN games g ON pl.game_id = g.id
       WHERE pl.user_id = 1
       ORDER BY pl.played_at DESC`
    )
    .all() as (PlayLogRow & { game_name: string; thumbnail_url: string })[];

  // Stats
  const totalPlays = logs.length;
  const uniqueGames = new Set(logs.map((l) => l.game_id)).size;

  // Most played game
  const playCounts: Record<number, { count: number; name: string }> = {};
  for (const log of logs) {
    if (!playCounts[log.game_id]) {
      playCounts[log.game_id] = { count: 0, name: log.game_name };
    }
    playCounts[log.game_id].count++;
  }
  const mostPlayed = Object.entries(playCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([gameId, data]) => ({ gameId: Number(gameId), ...data }));

  // Plays by month (last 6 months)
  const playsByMonth: Record<string, number> = {};
  for (const log of logs) {
    const month = log.played_at.slice(0, 7); // YYYY-MM
    playsByMonth[month] = (playsByMonth[month] || 0) + 1;
  }

  return Response.json({
    logs,
    stats: {
      totalPlays,
      uniqueGames,
      mostPlayed,
      playsByMonth,
    },
  });
}

export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();
  const { gameId, playedAt, players, winner, rating, notes } = body as {
    gameId: number;
    playedAt: string;
    players?: number;
    winner?: string;
    rating?: number;
    notes?: string;
  };

  if (!gameId || !playedAt) {
    return Response.json({ error: "gameId and playedAt required" }, { status: 400 });
  }

  const result = db
    .prepare(
      `INSERT INTO play_logs (user_id, game_id, played_at, players, winner, rating, notes)
       VALUES (1, @gameId, @playedAt, @players, @winner, @rating, @notes)`
    )
    .run({
      gameId,
      playedAt,
      players: players || null,
      winner: winner || null,
      rating: rating || null,
      notes: notes || null,
    });

  return Response.json({ ok: true, id: result.lastInsertRowid });
}

export async function DELETE(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  db.prepare(`DELETE FROM play_logs WHERE id = ? AND user_id = 1`).run(id);

  return Response.json({ ok: true });
}
