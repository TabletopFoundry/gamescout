import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const answers = db
    .prepare(`SELECT * FROM quiz_answers WHERE user_id = 1`)
    .all();
  return Response.json({ answers });
}

export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();

  const { gameRatings, preferences } = body as {
    gameRatings?: { gameId: number; rating: string }[];
    preferences?: { key: string; value: string }[];
  };

  const upsertGameRating = db.prepare(`
    INSERT INTO quiz_answers (user_id, game_id, rating)
    VALUES (1, @gameId, @rating)
    ON CONFLICT(user_id, game_id) DO UPDATE SET rating = excluded.rating
  `);

  const upsertPref = db.prepare(`
    INSERT INTO quiz_answers (user_id, preference_key, preference_value)
    VALUES (1, @key, @value)
    ON CONFLICT(user_id, preference_key) DO UPDATE SET preference_value = excluded.preference_value
  `);

  const save = db.transaction(() => {
    if (gameRatings) {
      for (const gr of gameRatings) {
        upsertGameRating.run({ gameId: gr.gameId, rating: gr.rating });
      }
    }
    if (preferences) {
      for (const pref of preferences) {
        upsertPref.run({ key: pref.key, value: pref.value });
      }
    }
  });

  save();

  return Response.json({ ok: true });
}
