<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

GameScout is a Next.js 16 + TypeScript board game discovery app with SQLite backend.
It features personalised recommendations via a taste profile quiz, mood-based
browsing, collection tracking, play logging, price comparison, and a stats dashboard.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — ESLint (must pass with 0 errors before committing)
- `npm run lint:types` — TypeScript type checking (must pass with 0 errors)
- `npm run check` — Run both lint and type check

## Key Conventions

- TypeScript strict mode is enabled (`noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`)
- All shared types live in `src/types/index.ts`
- Database access goes through `src/lib/db.ts` (getDb singleton)
- User session management via `src/lib/session.ts` (getUserId)
- All user text inputs must be sanitized with `src/lib/sanitize.ts` before DB storage
- Use explicit column lists (`GAME_COLUMNS`, `GAME_LIST_COLUMNS`) instead of `SELECT *`
- Use the `@/*` import alias for all `src/` paths
- React 19: avoid `setState` inside `useEffect` — use initializers or derived state instead
- All API routes should have JSDoc module comments describing their HTTP methods
- All lib modules should have JSDoc `@module` documentation
- Client pages export metadata via sibling `layout.tsx` files (since pages use `"use client"`)

## Architecture

```
src/
├── app/              # Next.js App Router (pages + API routes)
│   ├── api/          # REST API: collection, games, play-logs, price-alerts,
│   │                 #   quiz, recommendations, reviews, health
│   └── [page]/       # Client pages with sibling layout.tsx for metadata
├── components/       # Shared UI: GameCard, Navbar, EmptyState, etc.
├── data/games.ts     # Seed data (55 real board games)
├── lib/              # Server-side: db, recommendations, moods, session, sanitize
└── types/index.ts    # Single source of truth for TypeScript interfaces
```
