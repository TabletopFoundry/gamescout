# GameScout — Board Game Discovery & Collection Tracker

A modern, Letterboxd/Spotify-inspired board game discovery platform. Get personalized recommendations, browse by mood, track your collection, log plays, and compare prices.

## Features

- **Taste Profile Quiz** — Rate 10 well-known games and answer preference questions to build your taste profile
- **Personalized Recommendations** — Content-based filtering engine powered by your quiz ratings
- **Mood-Based Discovery** — Browse by "Quick Party Game", "Deep Strategy", "Cozy Two-Player", and more
- **Search & Filter** — Search 55+ real board games with filters for players, complexity, and playtime
- **Game Detail Pages** — Full info, price comparison across retailers, reviews, similar games
- **Collection Management** — Track owned games and wishlist, with shelf view
- **Play Logging** — Log plays with date, player count, winner, rating, and notes
- **Stats Dashboard** — Charts showing plays per month, complexity distribution, top categories, ratings
- **Price Tracker** — Compare prices across Amazon, Target, and more with deal alert setup

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** — Dark theme, responsive
- **SQLite** via `better-sqlite3` — Persistent storage for collection, quiz, plays, reviews, alerts
- **Recharts** — Stats charts
- Single demo user model (no auth required for MVP)

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

The SQLite database (`gamescout.db`) is created automatically in the project root on first run and seeded with 55 real board games.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── quiz/page.tsx         # Taste profile quiz
│   ├── discover/page.tsx     # Game discovery (recommendations, browse, search)
│   ├── games/[id]/page.tsx   # Game detail page
│   ├── collection/page.tsx   # Collection & wishlist management
│   ├── stats/page.tsx        # Stats dashboard
│   └── api/
│       ├── games/            # Game search & detail
│       ├── quiz/             # Quiz answers persistence
│       ├── collection/       # Add/remove from collection
│       ├── recommendations/  # Personalized recommendations
│       ├── reviews/          # Game reviews
│       ├── play-logs/        # Play history
│       └── price-alerts/     # Deal alert setup
├── components/
│   ├── Navbar.tsx            # Navigation
│   ├── GameCard.tsx          # Game card with collection buttons
│   ├── LoadingSkeleton.tsx   # Skeleton loading states
│   └── EmptyState.tsx        # Empty state component
├── data/
│   └── games.ts              # 55 real board games seed data
└── lib/
    ├── db.ts                 # SQLite schema, init, seed
    └── recommendations.ts    # Taste profile + recommendation engine
```

## Seed Data

The database is seeded with 55 real board games including:
- Gloomhaven, Brass: Birmingham, Pandemic Legacy, Spirit Island (top BGG games)
- Catan, Ticket to Ride, Pandemic (gateway classics)  
- Wingspan, Terraforming Mars, Scythe (modern favorites)
- Codenames, Coup, Love Letter (social/party games)
- And many more across all complexity levels and themes

## Recommendation Engine

Simple content-based filtering that scores each game based on:
1. Complexity match (how close to your preferred complexity)
2. Theme/category overlap with games you loved
3. Mechanics overlap with your favorites
4. BGG community rating
5. Player count and duration fit

## Database

SQLite with the following tables:
- `games` — Game catalog
- `price_history` — Retailer prices per game
- `users` — Demo user (single-user MVP)
- `quiz_answers` — Game ratings and preference answers
- `collection` — Owned/wishlist items
- `play_logs` — Play history
- `reviews` — Game reviews
- `price_alerts` — Deal alert subscriptions
