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
| **🔍 Search & Filter** | Search 55+ real board games with filters for players, complexity, and playtime |
| **📋 Game Detail Pages** | Full info, price comparison across retailers, reviews, similar games, play logging |
| **📚 Collection Management** | Track owned games and wishlist with shelf view and sorting |
| **📝 Play Logging** | Log plays with date, player count, winner, rating, and notes |
| **📊 Stats Dashboard** | Charts for plays per month, complexity distribution, top categories, ratings |
| **💰 Price Tracker** | Compare prices across Amazon, Target, and more with deal alert setup |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it! The SQLite database is created and seeded automatically with 55 real board games on first run.

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
│       └── price-alerts/         # Deal alert subscriptions
├── components/                   # Shared UI components
├── data/games.ts                 # 55 real board games seed data
├── lib/
│   ├── db.ts                     # SQLite schema, init, seed logic
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
| `games` | Game catalog (55 seeded entries) |
| `price_history` | Retailer prices per game |
| `users` | User accounts (demo single-user MVP) |
| `sessions` | Opaque session tokens |
| `quiz_answers` | Game ratings and preference answers |
| `collection` | Owned/wishlist items |
| `play_logs` | Play history with ratings |
| `reviews` | User game reviews |
| `price_alerts` | Deal alert subscriptions |

## 🎮 Seed Data

The database includes 55 real board games spanning all complexity levels:

- **Heavy**: Gloomhaven, Brass: Birmingham, Spirit Island
- **Medium-Heavy**: Terraforming Mars, Scythe, Twilight Imperium
- **Medium**: Wingspan, 7 Wonders, Pandemic Legacy
- **Gateway**: Catan, Ticket to Ride, Azul
- **Light/Party**: Codenames, Coup, Love Letter

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## 📄 License

[MIT](LICENSE)
