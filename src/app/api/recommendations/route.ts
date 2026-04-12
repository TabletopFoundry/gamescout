import { getRecommendations, buildTasteProfile } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const recommendations = getRecommendations(1, 24);
    const profile = buildTasteProfile(1);
    return Response.json({ recommendations, profile });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
