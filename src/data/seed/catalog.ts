import { GAMES, type GameSeed } from "@/data/games";
import { ADDITIONAL_GAMES } from "@/data/seed/additional-games";

export interface DealSeed {
  retailer: string;
  title: string;
  salePrice: number;
  msrp: number;
  url: string;
  startsAt: string;
  endsAt: string;
  couponCode?: string | null;
  featured?: boolean;
}

export interface CatalogGameSeed extends GameSeed {
  deals?: DealSeed[];
}

function makeDeal(game: GameSeed, retailer: string, title: string, salePrice: number): DealSeed {
  const msrp = Number((salePrice * (1.22 + (game.id % 4) * 0.08)).toFixed(2));
  return {
    retailer,
    title,
    salePrice,
    msrp,
    url: `${game.prices.find((price) => price.retailer === retailer)?.url ?? "https://boardgamegeek.com"}?ref=gamescout-deals`,
    startsAt: `2025-03-${String((game.id % 9) + 2).padStart(2, "0")}T09:00:00.000Z`,
    endsAt: `2025-04-${String((game.id % 9) + 11).padStart(2, "0")}T23:59:59.000Z`,
    couponCode: game.id % 3 === 0 ? `SAVE${game.id}` : null,
    featured: game.id % 5 === 0,
  };
}

function withDeals(game: GameSeed): CatalogGameSeed {
  const cheapest = [...game.prices].sort((a, b) => a.price - b.price)[0];
  if (!cheapest || game.id % 2 !== 0) {
    return { ...game };
  }

  const label =
    game.id % 6 === 0
      ? "Weekend Drop"
      : game.id % 4 === 0
        ? "Member Deal"
        : "Spring Sale";

  return {
    ...game,
    deals: [makeDeal(game, cheapest.retailer, label, cheapest.price)],
  };
}

export const SEEDED_GAMES: CatalogGameSeed[] = [...GAMES, ...ADDITIONAL_GAMES].map(withDeals);
