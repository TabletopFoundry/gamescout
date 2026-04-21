<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

GameScout is a Next.js 16 + TypeScript board game discovery app with SQLite backend.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — ESLint (must pass with 0 errors before committing)

## Key Conventions

- TypeScript strict mode is enabled
- All shared types live in `src/types/index.ts`
- Database access goes through `src/lib/db.ts` (getDb singleton)
- User session management via `src/lib/session.ts` (getUserId)
- All user text inputs must be sanitized with `src/lib/sanitize.ts` before DB storage
- Use explicit column lists (`GAME_COLUMNS`, `GAME_LIST_COLUMNS`) instead of `SELECT *`
- Use the `@/*` import alias for all `src/` paths
- React 19: avoid `setState` inside `useEffect` — use initializers or derived state instead
