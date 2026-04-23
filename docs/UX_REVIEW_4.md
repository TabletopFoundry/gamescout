# GameScout — Fourth-Pass UX & DX Audit

**Reviewer:** Senior engineer, focused delta review  
**Date:** 2025-07-23  
**Scope:** New P0/P1 issues only — not previously flagged in `UX_REVIEW.md`, `UX_REVIEW_2.md`, or `UX_REVIEW_3.md`  
**Baseline:** All three prior reviews read in full; only genuinely new findings included

---

## 1. Executive Summary

The three prior reviews and subsequent fixes have brought GameScout to a solid state. Most structural issues (nested interactives, ARIA patterns, focus traps, JSON parsing guards, SQL-level filtering, quiz persistence, confirm dialogs, session security) are addressed. This fourth pass uncovered **9 new issues** — 2 at P0 and 7 at P1 — that weren't flagged before. The P0s are two API routes (`quiz`, `price-alerts`) where DB operations still lack try/catch despite other routes being fixed, creating an inconsistent resilience posture. The P1s cluster around performance (full-catalog loads on every game detail request, redundant collection fetches, static Recharts import) and data-layer gaps (unbounded session growth, hardcoded review usernames, dead state, duplicated complexity logic).

---

## 2. New Issues

### 2.1 API Resilience — Remaining Unguarded Routes

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| R1 | **Quiz POST has no try/catch around DB transaction** | `api/quiz/route.ts:56` | `save()` calls a `db.transaction()` wrapping multiple upserts (lines 43–54). If any constraint violation or DB lock occurs, the transaction throws an unhandled error → 500 with no structured response. Every other mutating API route (`collection`, `reviews`, `play-logs`) now wraps DB operations in try/catch — quiz is the lone exception. |
| R2 | **Price alerts routes have partial or missing error handling** | `api/price-alerts/route.ts:9-18,42-46,61` | **GET** (lines 9–18): raw `db.prepare().all()` with no try/catch. **POST** (lines 42–46): JSON parsing is guarded, but the `db.prepare().run()` on line 42 is not — a duplicate key violation or corrupt row crashes without a 400/500 response. **DELETE** (line 61): same — bare `db.prepare().run()`. These are the only remaining routes with unguarded DB operations, creating an inconsistent error-handling surface. |

---

### 2.2 Performance — Unnecessary Full-Catalog Loads

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| P1 | **Game detail API loads entire catalog to compute similarity** | `api/games/[id]/route.ts:48-61` | Every GET to `/api/games/:id` executes `SELECT ${GAME_LIST_COLUMNS} FROM games` (all 55+ rows), deserializes JSON columns for each, then computes category overlap in JS. At the current scale this is ~5ms, but it's O(n) per request with full deserialization. A SQL query like `SELECT g.* FROM games g WHERE g.id != ? AND EXISTS (SELECT 1 FROM json_each(g.categories) WHERE value IN (SELECT value FROM json_each((SELECT categories FROM games WHERE id = ?))))` would push this into SQLite and avoid loading/parsing every row. The existing `TODO` comment on line 47 acknowledges this but sets the threshold at "~500 entries" — even at 55 games, it's gratuitous work repeated on every page view. |
| P2 | **Full collection fetched redundantly for status-only lookups** | `discover/page.tsx:58-71`, `games/[id]/page.tsx:54-66` | Both pages call `GET /api/collection` (which JOINs `collection` + `games` and returns full game objects) solely to build a `Record<number, CollectionStatus>` map. The entire game data in the response is discarded. A lightweight `GET /api/collection/statuses` returning `[{gameId: 1, status: "owned"}, ...]` would cut response size by ~90% and avoid the JOIN entirely. |
| P3 | **Recharts imported statically — no code splitting** | `stats/page.tsx:5-17` | Six Recharts components (`BarChart`, `LineChart`, `PieChart`, `XAxis`, `YAxis`, etc.) are statically imported. Recharts is ~460KB minified. Since the stats page is the only consumer and is client-rendered, wrapping with `next/dynamic(() => import(...), { ssr: false })` would remove this from the initial JS bundle and improve first-load performance across all other pages. |

---

### 2.3 Data Integrity & Session Management

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| D1 | **Sessions and users accumulate without cleanup** | `lib/session.ts:26-47` | When a visitor arrives without a `gs_session` cookie (cleared browser, incognito, expired), a new `users` row and `sessions` row are created unconditionally. Sessions have a 1-year `maxAge` on the cookie but no server-side TTL or expiration column. There is no cleanup job, no `expires_at` column, and no limit on sessions per user. Over time, both tables grow unboundedly. Add an `expires_at` column to `sessions`, and periodically prune expired rows (or prune on read). |
| D2 | **Reviews always display 'demo' as username regardless of author** | `api/games/[id]/route.ts:35` | The reviews query hardcodes `'demo' as username`. Even though the session system creates distinct users with unique usernames (`user_<timestamp>`), the JOIN to `users` is never performed. All reviews on a game detail page appear to be from the same person, creating a misleading UX. At minimum, JOIN on `users.id = reviews.user_id` and return `users.username`. |

---

### 2.4 Dead Code & Logic Inconsistencies

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| L1 | **`imgErrors` state tracked but never used for play log thumbnails** | `collection/page.tsx:16,178-183` | In the play logs section, the `Image` `onError` callback sets `imgErrors[log.id] = true` (line 179–183), but unlike the collection cards (lines 316–331) which conditionally render a 🎲 fallback, the play log thumbnails always render the `<Image>`. The error state is tracked but produces no visible effect — a broken thumbnail shows a broken image rather than the fallback emoji. Either wire up the fallback or remove the dead `onError` handler. |
| L2 | **Stats page reimplements complexity bucketing with different thresholds and labels** | `stats/page.tsx:126-144` vs `types/index.ts:92-110` | The shared `getComplexityLabel()` in `types/index.ts` uses `Math.round()` then maps to `"Light" / "Medium-Light" / "Medium" / "Medium-Heavy" / "Heavy"`. The stats page independently implements bucketing with `<1.5 / <2.5 / <3.5 / <4.5` boundaries and shortened labels `"Light" / "Med-Light" / "Medium" / "Med-Heavy" / "Heavy"`. The different rounding logic can classify the same game differently at boundary values (e.g., complexity 2.45 rounds to 2 → "Medium-Light" in the shared helper, but falls in `<2.5` → "Med-Light" in stats). Extract a single canonical bucketing function into `types/index.ts` and reuse it. |

---

## 3. Prioritized Action Plan

### P0 — Fix Immediately (< 1 hour)

1. **R1 — Wrap quiz transaction in try/catch** (`api/quiz/route.ts:56`): Add try/catch around `save()`, return `{ error: "Failed to save quiz results" }` with status 500 on failure. 5 minutes.
2. **R2 — Add try/catch to all price-alerts handlers** (`api/price-alerts/route.ts`): Wrap GET (lines 9–18), POST db call (lines 42–46), and DELETE (line 61) in try/catch with structured error responses. 15 minutes.

### P1 — Important (1–3 days)

3. **P1 — Move similarity computation to SQL** (`api/games/[id]/route.ts:48-61`): Use SQLite's `json_each()` to compute category overlap in a single query. Eliminates full-catalog load on every game detail page. ~2 hours.
4. **P2 — Add lightweight collection-status endpoint** (`api/collection/`): New `GET /api/collection/statuses` returning `[{gameId, status}]` without JOINing game data. Update discover and game detail pages to use it. ~1 hour.
5. **P3 — Lazy-load Recharts** (`stats/page.tsx`): Wrap chart components with `next/dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false })` or extract a `Charts` component and dynamically import it. ~30 minutes.
6. **D1 — Add session expiration** (`lib/session.ts`, `lib/db.ts`): Add `expires_at TEXT` column to sessions table. Set to `datetime('now', '+1 year')` on creation. Prune expired rows on session lookup. ~1 hour.
7. **D2 — JOIN users for review username** (`api/games/[id]/route.ts:35`): Replace `'demo' as username` with `u.username` from a JOIN to `users`. ~10 minutes.
8. **L1 — Wire up play log thumbnail fallback** (`collection/page.tsx:171-184`): Add the same `imgErrors[log.id]` conditional rendering used for collection cards. ~10 minutes.
9. **L2 — Unify complexity bucketing** (`stats/page.tsx:126-144`, `types/index.ts`): Extract a `getComplexityBucket(c: number): string` function into `types/index.ts` and import it in stats. ~15 minutes.

---

## 4. Issues Not Re-Flagged (Confirmed Still Open from Prior Reviews)

The following issues from Reviews 1–3 remain open but are already documented and prioritized there. They are not repeated in this review:

- **T1–T3**: Zero tests, no CI, no typecheck script (Review 3)
- **A3**: Mood category filters still applied client-side post-fetch (Review 3) — the SQL migration was done for numeric filters but mood categories remain in JS at `discover/page.tsx:87-108`
- **S1**: `fromQuiz` dead code (Review 3)
- **S2**: Quiz `setTimeout` cleanup (Review 3)
- **D1–D5**: Formatter, pre-commit hooks, .env.example, console.error, allowJs (Review 3)
- **DS1–DS2**: Seed timestamps, migration strategy (Review 3)
- **R3**: `text-zinc-500` contrast below WCAG AA (Review 3)

---

## 5. What's Improved Since Review 3

| Area | Status |
|------|--------|
| `loading.tsx` at root | ✅ Added with `role="status"`, `aria-label`, and SR text |
| `not-found.tsx` at root | ✅ Added with branded design, `aria-hidden` on emoji |
| Route-level `loading.tsx` | ✅ `games/[id]/loading.tsx` and `stats/loading.tsx` now exist |
| Stats page `layout.tsx` | ✅ Added for stats route |
| Quiz state persistence | ✅ localStorage persistence with hydration guard |
| Quiz back button | ✅ `goBack()` function wired to all steps |
| Charts SR data tables | ✅ `<table className="sr-only">` added under each chart |
| Decorative emoji `aria-hidden` | ✅ Applied in `GameCard.tsx`, `page.tsx` highlights, `not-found.tsx` |
| Review body length limit | ✅ 5000 char limit enforced server-side (`reviews/route.ts:24-25`) |
| Email validation on price alerts | ✅ Regex validation (`price-alerts/route.ts:38-39`) |
| Confirm dialogs for destructive actions | ✅ `ConfirmDialog` component with focus trap used in collection and game detail |
| Game detail `res.ok` checks | ✅ All fetch calls in `games/[id]/page.tsx` now check `res.ok` |

---

## 6. Bottom Line

GameScout has addressed the vast majority of issues from three prior reviews. The remaining new findings are narrow and well-defined: two missing try/catch blocks (P0, <20 min to fix), and seven P1 issues that are all independently addressable in under a day of total work. The codebase shows consistent improvement velocity and disciplined follow-through on review feedback.
