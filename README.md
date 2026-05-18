# 🎲 GameScout — Board Game Discovery & Collection Tracker

> Discover your next favorite board game with personalized recommendations, mood-based browsing, collection tracking, and price comparison.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **🎯 Taste Profile Quiz** | Rate 10 well-known games and answer preference questions to build a personalized recommendation engine |
| **🤖 Personalized Recommendations** | Content-based filtering scores games on complexity, theme, mechanics, and player count match |
| **🎭 Mood-Based Discovery** | Browse by "Quick Party Game", "Deep Strategy", "Cozy Two-Player", and 5 more moods |
| **🔍 Search & Filter** | Search 85+ real board games with filters for players, complexity, and playtime |
| **📋 Game Detail Pages** | Full info, current prices, seeded deals, reviews, similar games, and play logging |
| **📚 Collection Management** | Track owned games and wishlist with shelf view and sorting |
| **📝 Play Logging** | Log plays with date, player count, winner, optional score, rating, and notes |
| **📊 Stats Dashboard** | Charts for plays per month, complexity distribution, top categories, ratings, and recent scores |
| **💰 Price Tracker** | Compare retailer snapshots, surface active deals, and set deal alerts |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it! In non-production environments the SQLite database is created and reseeded automatically on first access with a rich demo dataset (85 board games, 12 personas, play history, reviews, collections, wishlists, price alerts, and active deals).

## 🛠 Tech Stack

- **[Next.js 16](https://nextjs.org/)** — App Router with React 19
- **[TypeScript 5](https://www.typescriptlang.org/)** — Strict mode enabled
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Dark theme, responsive design
- **[SQLite](https://sqlite.org/)** via `better-sqlite3` — Zero-config persistent storage
- **[Recharts](https://recharts.org/)** — Stats visualization

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page (server-rendered)
│   ├── quiz/page.tsx             # Taste profile quiz
│   ├── discover/page.tsx         # Game discovery (recs, browse, search)
│   ├── games/[id]/page.tsx       # Game detail page
│   ├── collection/page.tsx       # Collection & wishlist management
│   ├── stats/page.tsx            # Stats dashboard
│   └── api/
│       ├── games/                # Game search & detail endpoints
│       ├── quiz/                 # Quiz answer persistence
│       ├── collection/           # Collection CRUD
│       ├── recommendations/      # Personalized recommendations
│       ├── reviews/              # Game reviews
│       ├── play-logs/            # Play history
│       ├── price-alerts/         # Deal alert subscriptions
│       └── health/               # Service health check
├── components/                   # Shared UI components
├── data/
│   ├── games.ts                  # Base board game catalog data
│   └── seed/                     # Seed catalog, personas, and deal definitions
├── lib/
│   ├── db.ts                     # SQLite schema, init, and migrations
│   ├── seed.ts                   # Idempotent transactional seed orchestration
│   ├── recommendations.ts        # Taste profile + scoring engine
│   ├── moods.ts                  # Mood filter definitions
│   ├── session.ts                # Opaque session token management
│   └── sanitize.ts               # Input sanitization
└── types/index.ts                # Shared TypeScript interfaces
```

## 🧠 Recommendation Engine

Simple but effective content-based filtering that scores each game based on:

1. **Complexity match** (±15 pts per distance unit from preferred complexity)
2. **Theme/category overlap** with games you loved (15 pts each)
3. **Mechanics overlap** with your favorites (10 pts each)
4. **BGG community rating** (scaled to max 20 pts)
5. **Player count & duration fit** (10 pts each)
6. **Similarity to highly-rated games** (5 pts per category overlap)

## 🗄 Database Schema

SQLite with the following tables:

| Table | Purpose |
| --- | --- |
| `games` | Game catalog (85 seeded entries) |
| `price_history` | Historical retailer price snapshots per game |
| `game_deals` | Current seeded deals with discount metadata |
| `users` | Seeded personas plus runtime-created users |
| `sessions` | Opaque session tokens |
| `quiz_answers` | Game ratings and preference answers |
| `collection` | Owned/wishlist items |
| `play_logs` | Play history with winners, ratings, and optional scores |
| `reviews` | User game reviews |
| `price_alerts` | Deal alert subscriptions |
| `seed_metadata` | Seed dataset version tracking |

## 🎮 Seed Data

The demo dataset is intentionally rich and deterministic:

- **85 real games** with accurate mechanics, themes, player counts, playtimes, and complexity spread from **1.0 (`No Thanks!`)** to **5.0 (`Advanced Squad Leader`)**
- **12 user personas** with distinct tastes, collection sizes, wishlists, quiz answers, and price alerts
- **216 seeded play logs** with dates, player counts, winners, ratings, and scores
- **60 seeded reviews** with short, medium, and long-form text
- **Historical price snapshots** for every retailer listing plus **active deals** for a large portion of the catalog
- **Edge cases** including unicode names (`zoë_meeples`, `señor_carton`, `Café`, `Jórvík`) and long descriptions for heavier narrative titles

### Seed Behavior

- **Guarded in production** by default — automatic reseeding only runs outside production unless `GAMESCOUT_ALLOW_PRODUCTION_SEED=1`
- **Idempotent** — the seeder truncates seed-managed tables and re-inserts a known-good dataset version
- **Transactional** — catalog, personas, logs, reviews, and pricing data are inserted in a single transaction
- **Conventionally placed** — catalog and persona definitions live in `src/data/seed/`, while orchestration lives in `src/lib/seed.ts`

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `GAMESCOUT_ALLOW_PRODUCTION_SEED=1 npm run start` | Allow one-time automatic seeding while running the production server |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |
| `npm run lint:types` | TypeScript type checking (`tsc --noEmit`) |
| `npm run check` | Run both lint and type check |

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## 📄 License

[MIT](LICENSE)
