import type { MetadataRoute } from "next";
import { getDb, type GameRow } from "@/lib/db";

const BASE_URL = process.env["NEXT_PUBLIC_BASE_URL"] || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/discover`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/collection`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/stats`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  let gameRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getDb();
    const games = db.prepare("SELECT id FROM games ORDER BY bgg_rank ASC").all() as Pick<GameRow, "id">[];
    gameRoutes = games.map((g) => ({
      url: `${BASE_URL}/games/${g.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Fall back to static-only sitemap if DB is unavailable
  }

  return [...staticRoutes, ...gameRoutes];
}
