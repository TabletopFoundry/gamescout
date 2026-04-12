import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const alerts = db
    .prepare(
      `SELECT pa.*, g.name as game_name, g.thumbnail_url FROM price_alerts pa
       JOIN games g ON pa.game_id = g.id
       WHERE pa.user_id = 1 AND pa.active = 1
       ORDER BY pa.created_at DESC`
    )
    .all();
  return Response.json({ alerts });
}

export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();
  const { gameId, targetPrice, email } = body as {
    gameId: number;
    targetPrice: number;
    email?: string;
  };

  if (!gameId || !targetPrice) {
    return Response.json({ error: "gameId and targetPrice required" }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO price_alerts (user_id, game_id, target_price, email)
    VALUES (1, @gameId, @targetPrice, @email)
    ON CONFLICT(user_id, game_id) DO UPDATE SET target_price = excluded.target_price, email = excluded.email, active = 1
  `).run({ gameId, targetPrice, email: email || null });

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const gameId = Number(searchParams.get("gameId"));

  if (!gameId) {
    return Response.json({ error: "gameId required" }, { status: 400 });
  }

  db.prepare(`UPDATE price_alerts SET active = 0 WHERE user_id = 1 AND game_id = ?`).run(gameId);

  return Response.json({ ok: true });
}
