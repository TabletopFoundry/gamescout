/**
 * Personalised recommendations API.
 *
 * GET — Return scored game recommendations and the user's taste profile.
 */

import { getRecommendations, buildTasteProfile } from "@/lib/recommendations";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await getUserId();
    const recommendations = getRecommendations(userId, 24);
    const profile = buildTasteProfile(userId);
    return Response.json({ recommendations, profile });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
