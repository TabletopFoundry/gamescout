---
title: Quick Start
sidebar_position: 1
description: Get GameScout running locally with seeded demo data in under five minutes.
---

# Quick Start

You will go from `git clone` to a fully populated GameScout instance in under five minutes. No external services, no API keys, no signup.

## Prerequisites

- **Node.js 20+** (LTS recommended; project ships an `.nvmrc`)
- **npm 10+** (bundled with Node 20)
- A C/C++ toolchain for `better-sqlite3` to compile its native bindings:
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Linux: `build-essential` (Debian/Ubuntu) or `gcc`/`make` (Fedora/RHEL)
  - Windows: `windows-build-tools` or install through the Visual Studio installer

## 1. Clone and install

```bash
git clone https://github.com/TabletopFoundry/gamescout
cd gamescout
npm install
```

`npm install` compiles `better-sqlite3` against your local Node version. If you upgrade Node later, run `npm rebuild better-sqlite3`.

## 2. Start the dev server

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)**.

The first request triggers an idempotent seed: 85 board games, 12 personas, 216 play logs, 60 reviews, retailer price history, and a curated set of active deals are inserted in a single transaction. The SQLite database lives in `gamescout.db` at the repo root and is gitignored.

## 3. Build your taste profile

1. Click **Take the Quiz** on the landing page (`/quiz`).
2. Rate ten well-known board games (loved / liked / neutral / disliked / haven't played).
3. Answer a handful of preference questions (player count, complexity, playtime).
4. Visit **`/discover`** — recommendations are now scored against your profile, each annotated with the reason it surfaced.

## 4. Try the rest

- **`/discover`** — recommendations, mood-based browsing, free-text search with filters.
- **`/games/[id]`** — full game detail: prices, deals, reviews, similar games, log a play.
- **`/collection`** — manage owned games and your wishlist.
- **`/stats`** — Recharts dashboard for plays per month, complexity mix, top categories, ratings, and recent scores.

## Optional: production build

```bash
npm run build
npm run start          # serves the optimized build on :3000
```

By default the production server **will not reseed** unless you opt in:

```bash
GAMESCOUT_ALLOW_PRODUCTION_SEED=1 npm run start
```

See [Configuration](../reference/configuration) for the full list of env vars.

## Next steps

- **[First Recommendations](./first-recommendations)** — walk through the quiz and discover page.
- **[Recommendation Engine](../concepts/recommendation-engine)** — understand how scores are computed.
- **[API Reference](../reference/api)** — every REST endpoint with payloads.
