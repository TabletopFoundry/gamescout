# GameScout — Fifth-Pass UX & DX Audit

**Reviewer:** Senior engineer, fresh codebase encounter  
**Date:** 2025-07-24  
**Scope:** New P0/P1/P2 issues only — not previously flagged in Reviews 1–4  
**Baseline:** All four prior reviews read in full; only genuinely new findings included

---

## 1. Executive Summary

GameScout has matured significantly through four review cycles: API routes now have comprehensive try/catch, SQL-level filtering replaced JS post-fetch filtering, Recharts is lazy-loaded, mobile nav has a proper focus trap, and session management is solid. This fifth pass shifts focus to **security surface, runtime resilience, and architectural friction** — areas that earlier reviews either didn't examine or only touched superficially. The headline findings are: (1) the XSS sanitizer is a regex-based tag stripper that's trivially bypassable; (2) zero security headers are configured despite Next.js making this easy; (3) no fetch call in the entire codebase uses an AbortController, creating race conditions on every client-side navigation; and (4) the SQLite schema has zero secondary indexes. There are **4 P0**, **6 P1**, and **4 P2** new issues.

---

## 2. New Issues

### 2.1 Security

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| S1 | **XSS sanitizer is bypassable regex** | `lib/sanitize.ts:22-23` | `sanitizeText` strips HTML with `/<[^>]*>/g`. This is a known-broken pattern. It does not handle: unclosed tags (`<img src=x onerror=alert(1)`), SVG/MathML constructs, HTML entities (`&lt;script&gt;`), `javascript:` URLs, or event-handler attributes on self-closing tags. The function is used for review bodies (`api/reviews/route.ts:40`), play log winners and notes (`api/play-logs/route.ts:106-108`) — all of which are rendered in the UI. Replace with a proper allowlist sanitizer (e.g., `DOMPurify` or `sanitize-html`) or HTML-entity-encode all output. |
| S2 | **Zero security headers** | `next.config.ts` | The config has `poweredByHeader: false` (good) but no `headers()` function. Missing: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`. Next.js supports these via `async headers()` in `next.config.ts`. A single CSP header alone would mitigate the XSS risk in S1 even if the sanitizer is bypassed. |

---

### 2.2 Client-Side Data Fetching — Race Conditions

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| F1 | **No AbortController on any fetch call** | All client pages | Zero instances of `AbortController` exist in the codebase (confirmed by full-text search). Every `useEffect` that fetches data — `discover/page.tsx:46,60,82`, `stats/page.tsx:51,55`, `collection/page.tsx:32`, `games/[id]/page.tsx:56,72` — lacks an abort signal. When a user navigates away before a response returns, the stale response still calls `setState`, potentially overwriting data for the current route. This is particularly dangerous on `games/[id]/page.tsx` where navigating between game detail pages reuses the component. Add `AbortController` to all data-fetching effects and pass `signal` to each `fetch()`. |
| F2 | **Multiple uncleared `setTimeout` calls in mutation handlers** | `GameCard.tsx:48`, `collection/page.tsx:73,94,105`, `games/[id]/page.tsx:130,153,184,207` | Error toast timers (`setTimeout(() => setError(null), 3000)`) are never stored in refs or cleaned up on unmount. If a component unmounts during the 3-second window (e.g., navigating away after an error), React will attempt to set state on an unmounted component. Prior reviews flagged quiz-specific timeouts (S2, S5 in Review 3) but not these mutation-error timers, which exist in 4 separate components. Store timeout IDs in `useRef` and clear in cleanup. |

---

### 2.3 Database — Missing Indexes and Resilience

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| DB1 | **Zero secondary indexes in schema** | `lib/db.ts:35-135` | The schema has no `CREATE INDEX` statements beyond implicit PK/UNIQUE constraints. Queries that filter on non-indexed columns:<br>• `reviews` by `game_id` + `created_at` (`api/reviews/route.ts:58-60`)<br>• `play_logs` by `user_id` + `played_at` (`api/play-logs/route.ts:20-28`)<br>• `price_history` by `game_id` (`api/games/[id]/route.ts:35`)<br>• `quiz_answers` by `user_id` (`lib/recommendations.ts:41-45`)<br>All do full table scans. With 55 games and single-user this is invisible, but the schema should be correct regardless of scale. Add composite indexes for each query's WHERE/ORDER pattern. |
| DB2 | **No `busy_timeout` pragma** | `lib/db.ts:27` | WAL mode is enabled, but `PRAGMA busy_timeout` is never set. Under concurrent Next.js requests (SSR + API), a write that encounters a lock immediately throws `SQLITE_BUSY` instead of retrying. Add `db.pragma('busy_timeout = 5000')` after WAL mode to allow 5 seconds of retry before failing. |

---

### 2.4 Image & Network Security

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| N1 | **Wildcard `**.cloudfront.net` in image remote patterns** | `next.config.ts:13` | The `remotePatterns` entry allows _any_ CloudFront subdomain. CloudFront is a generic CDN — any AWS customer can create a distribution. An attacker who controls seed data or injects a game record could serve images from their own CloudFront distribution, enabling pixel-tracking or exploiting image decoder vulnerabilities. Restrict to the specific CloudFront hostname used by BGG (e.g., `d2k4q26owzy373.cloudfront.net`) or remove if unused. |

---

### 2.5 Documentation & Onboarding

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| DOC1 | **CONTRIBUTING.md has non-functional clone URL** | `CONTRIBUTING.md:16` | `git clone https://github.com/your-org/gamescout.git` — this is a placeholder that never got updated. A new contributor copy-pasting this command gets a 404. Replace with the actual repository URL or a generic instruction like "Clone this repository". |
| DOC2 | **Sitemap references undeclared env var** | `sitemap.ts:4` | `process.env.NEXT_PUBLIC_BASE_URL` is used with a fallback to `https://gamescout.app`, but this environment variable is never documented, never set in any config, and no `.env.example` exists. The fallback domain `gamescout.app` may not be owned. Document the env var or hardcode the correct value. |

---

### 2.6 Next.js Best Practices

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| NX1 | **Footer uses raw `<a>` instead of `next/link` for internal routes** | `layout.tsx:49-54` | `<a href="/privacy">` and `<a href="/terms">` cause full-page reloads instead of client-side navigation. Every page transition through the footer discards React state, re-fetches all resources, and flashes white. Use `<Link href="/privacy">` and `<Link href="/terms">`. |
| NX2 | **No route-level `error.tsx` boundaries** | All route folders | Only the root `src/app/error.tsx` exists. A failure in the stats page (e.g., Recharts crash) takes down the entire application frame. Per-route `error.tsx` files would contain failures to the affected segment while keeping the navbar and layout intact. At minimum, add `error.tsx` to `games/[id]/`, `stats/`, and `discover/`. |

---

### 2.7 Component Architecture

#### P2 — Polish

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| C1 | **Game detail page is a 343-line monolith with 16 `useState` declarations** | `games/[id]/page.tsx:20-51` | The page manages game data, collection status, review form (4 states), play log form (6 states), price alert form (4 states), confirmation dialogs, and mutation errors all in one component. Sub-components exist for rendering (`GameHero`, `PlayLogSection`, `ReviewSection`, `PriceComparison`) but all form state and submission logic lives in the parent. Extract form logic into the sub-components or use `useReducer` to consolidate state. |
| C2 | **`discover/page.tsx` is 405 lines managing 3 independent tabs** | `discover/page.tsx` | Recommendations, Browse, and Search are three independent data-fetching workflows stuffed into one component. Each has its own loading state, error state, and fetch logic. Extracting each tab into a separate component would make the file navigable and independently testable. |

---

### 2.8 Accessibility — Remaining Gap

#### P2 — Polish

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| A1 | **No `<meta name="color-scheme" content="dark">` despite dark theme** | `layout.tsx` | The app uses a full dark theme (`dark` class on `<html>`, `bg-zinc-950`), but the `color-scheme` meta tag is missing. Browser-native UI elements (scrollbars, autofill backgrounds, date inputs on `games/[id]/page.tsx:36`) render in light mode, creating jarring visual inconsistency. This was flagged as X7/P2 in Review 3 but categorized under "decorative" polish — it has actual UX impact on form inputs. |
| A2 | **`text-zinc-600` in footer fails WCAG AA** | `layout.tsx:46` | Footer text uses `text-zinc-600` (#52525b) against `bg-zinc-950` (#09090b) — contrast ratio ~2.8:1, well below the 4.5:1 WCAG AA minimum. Review 3 flagged `text-zinc-500` across components (R3) but not this even-worse footer instance. Upgrade to `text-zinc-400`. |

---

## 3. Prioritized Action Plan

### P0 — Fix Immediately (< 2 hours total)

1. **S1 — Replace regex sanitizer** (`lib/sanitize.ts`): Install `sanitize-html` or `isomorphic-dompurify`. Rewrite `sanitizeText` to use a proper allowlist. ~30 minutes.
2. **S2 — Add security headers** (`next.config.ts`): Add `async headers()` returning CSP (with `script-src 'self'`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Strict-Transport-Security`. ~20 minutes.
3. **F1 — Add AbortController to all fetch effects** (all client pages): Create an `AbortController` in each data-fetching `useEffect`, pass `{ signal }` to `fetch()`, return `controller.abort()` in cleanup. ~45 minutes across 5 pages + GameCard.
4. **F2 — Clear mutation timeout IDs on unmount** (`GameCard.tsx`, `collection/page.tsx`, `games/[id]/page.tsx`): Store `setTimeout` return values in `useRef`, clear in useEffect cleanup or before setting new timeouts. ~20 minutes.

### P1 — Important (1–3 days)

5. **DB1 — Add secondary indexes** (`lib/db.ts`): Add `CREATE INDEX IF NOT EXISTS` for `reviews(game_id, created_at)`, `play_logs(user_id, played_at)`, `price_history(game_id)`, `quiz_answers(user_id)`, `collection(user_id, status)`. ~15 minutes.
6. **DB2 — Set `busy_timeout`** (`lib/db.ts:28`): Add `_db.pragma('busy_timeout = 5000')` after WAL pragma. 1 minute.
7. **N1 — Restrict CloudFront image pattern** (`next.config.ts:13`): Replace `**.cloudfront.net` with the specific hostname in use, or remove if only `cf.geekdo-images.com` is needed. ~5 minutes.
8. **DOC1 — Fix clone URL** (`CONTRIBUTING.md:16`): Replace placeholder with actual repo URL. 1 minute.
9. **DOC2 — Document or remove env var** (`sitemap.ts:4`): Either create `.env.example` documenting `NEXT_PUBLIC_BASE_URL` or remove the env var reference and hardcode correctly. ~5 minutes.
10. **NX1 — Use `<Link>` in footer** (`layout.tsx:49-54`): Replace `<a>` with `<Link>` from `next/link`. 2 minutes.
11. **NX2 — Add route-level error boundaries** (`games/[id]/error.tsx`, `stats/error.tsx`, `discover/error.tsx`): Create lightweight `error.tsx` files per route. ~15 minutes.

### P2 — Polish (1 sprint)

12. **C1 — Decompose game detail page** (`games/[id]/page.tsx`): Move review form, play log form, and price alert form state+logic into their respective sub-components. ~2 hours.
13. **C2 — Split discover tabs into components** (`discover/page.tsx`): Extract `RecommendedTab`, `BrowseTab`, `SearchTab` components. ~1 hour.
14. **A1 — Add color-scheme meta** (`layout.tsx`): `<meta name="color-scheme" content="dark">`. 1 minute.
15. **A2 — Fix footer contrast** (`layout.tsx:46`): Change `text-zinc-600` to `text-zinc-400`. 1 minute.

---

## 4. Issues Not Re-Flagged (Confirmed Still Open from Prior Reviews)

The following issues from Reviews 1–4 remain open but are already documented:

- **T1–T2**: Zero tests, no CI pipeline (Review 3)
- **S1**: `fromQuiz` dead code — `discover/page.tsx:17` still has `fromQuiz ? "recommended" : "recommended"` (Review 3)
- **D1–D3**: No formatter, no pre-commit hooks, no `.env.example` (Review 3)
- **D4**: `console.error` in production code (Review 3)
- **D5**: `allowJs: true` in `tsconfig.json` (Review 3)
- **DS1**: Seed data uses runtime timestamps (Review 3)
- **DS2**: No migration strategy (Review 3)
- **P1 (R4)**: Game detail loads full catalog for similarity (Review 4)
- **P2 (R4)**: Full collection fetched for status-only lookups (Review 4)
- **D1 (R4)**: Sessions accumulate without cleanup (Review 4)
- **D2 (R4)**: Reviews hardcode 'demo' username (Review 4)
- **L1 (R4)**: Play log thumbnail fallback not wired (Review 4)

---

## 5. What's Improved Since Review 4

| Area | Status |
|------|--------|
| Quiz POST try/catch (R4-R1) | ✅ Wrapped in try/catch with structured error response |
| Price alerts error handling (R4-R2) | ✅ All three handlers have try/catch |
| Recharts lazy-loading (R4-P3) | ✅ `StatsCharts` dynamically imported with `{ ssr: false }` and loading skeleton |
| Complexity bucketing unified (R4-L2) | ✅ `getComplexityBucket()` extracted to `types/index.ts:126-132`, imported in stats |
| Stats page decomposed | ✅ `SummaryCards`, `RecentPlaysTable`, `StatsCharts` extracted as sub-components |
| Session expiration column | ✅ `expires_at` column added to sessions table (`lib/db.ts:133`) |

---

## 6. Bottom Line

GameScout continues to improve with each review cycle. The new findings cluster in two areas that prior reviews under-examined: **security posture** (sanitizer, headers, image allowlist) and **client-side resilience** (AbortController, timeout cleanup). The security items (S1, S2) are the highest-impact fixes — they protect against real attack vectors. The AbortController gap (F1) is the most widespread code change but follows a mechanical pattern. The database index and pragma fixes (DB1, DB2) are trivial to implement and establish correct foundations. Total estimated effort for all P0+P1 items: ~4 hours.
