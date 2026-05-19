---
title: Changelog
description: Notable changes to GameScout.
---

# Changelog

GameScout follows [Semantic Versioning](https://semver.org/). Notable user-facing and API changes are listed here. The canonical source is the [GitHub releases page](https://github.com/TabletopFoundry/gamescout/releases).

## 0.1.0 — Initial public release

The first public cut of GameScout.

### Highlights

- **Taste quiz** (`/quiz`) with ten game ratings and a small set of preference questions.
- **Discover page** (`/discover`) with personalized recommendations, mood filters, search, and catalog filters.
- **Game detail page** with prices, deals, reviews, similar games, and play logging.
- **Collection management** (`/collection`) with owned/wishlist split and sort options.
- **Stats dashboard** (`/stats`) — Recharts visualizations for plays per month, complexity mix, top categories, ratings, and recent scores.
- **Price tracker** with retailer snapshots, active deals, and target-price alerts.

### Engine

- Content-based recommendation engine in `src/lib/recommendations.ts`, ~150 lines, fully explainable.
- Eight built-in moods with hard SQL-side filters.

### Data

- 85 real board games seeded with accurate metadata.
- 12 personas, 216 play logs, 60 reviews, retailer price history, and curated active deals.
- Idempotent, transactional seeder with version tracking.

### Stack

- Next.js 16 (App Router) with React 19.
- TypeScript 5 in strict mode (`noUncheckedIndexedAccess`).
- SQLite via `better-sqlite3` — zero external services.
- Tailwind CSS v4 with a dark theme.

### Known limitations

- No built-in email transport for price alerts (the data is there; bring your own sender).
- No bulk import UI for collections (the API is open).
- No multi-device session sync without manually copying the cookie.

---

Want to track upcoming work? Watch the [GitHub Issues](https://github.com/TabletopFoundry/gamescout/issues) and [Discussions](https://github.com/TabletopFoundry/gamescout/discussions).
