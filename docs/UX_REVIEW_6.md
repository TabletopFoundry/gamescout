# GameScout — Sixth-Pass UX & DX Audit

**Reviewer:** Senior engineer, fresh codebase encounter  
**Date:** 2025-07-25  
**Scope:** New P0/P1 issues only — not previously flagged in Reviews 1–5  
**Baseline:** All five prior reviews read in full; only genuinely new findings included

---

## 1. Executive Summary

GameScout has matured substantially through five review cycles. The sanitizer is now `sanitize-html`, security headers exist, `AbortController` is wired throughout, indexes are in place, `busy_timeout` is set, the wildcard CloudFront pattern is pinned, footer links use `next/link`, and error boundaries exist at route level. This sixth pass shifts focus to **CSP policy weaknesses, SEO gaps, mutation-refresh race conditions, and remaining architectural safety holes**. The headline findings are: (1) the CSP header includes `'unsafe-eval'` and `'unsafe-inline'` for scripts, largely negating XSS protection; (2) the sitemap is static-only — all 55 dynamic `/games/:id` pages are invisible to crawlers; (3) `refreshRecommendations()` and post-mutation `loadGame()` calls fire without an `AbortController`, creating a new class of race condition not covered by Review 5's F1 fix; and (4) the home page calls `getDb()` at the module top-level inside a React Server Component's render, which runs on every request with no error boundary around it. There are **2 P0** and **5 P1** new issues.

---

## 2. New Issues

### 2.1 Security — CSP Defeats Its Own Purpose

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| CSP1 | **CSP `script-src` includes `'unsafe-inline'` and `'unsafe-eval'`** | `next.config.ts:27` | Review 5 (S2) flagged the *absence* of security headers. They were subsequently added — but the `script-src` directive includes both `'unsafe-inline'` and `'unsafe-eval'`. `'unsafe-inline'` allows any injected `<script>` tag to execute, which is the exact attack vector CSP is designed to block. `'unsafe-eval'` permits `eval()`, `Function()`, and `setTimeout(string)`. Together, these directives reduce CSP to little more than a `frame-ancestors` policy. **Fix:** Remove `'unsafe-inline'` and `'unsafe-eval'`. Use Next.js nonce-based CSP (`experimental.strictNextHead` + nonce forwarding) or `'strict-dynamic'` to allow framework scripts while blocking injected ones. If `'unsafe-eval'` is needed for Recharts/dev mode, gate it behind `process.env.NODE_ENV` and only apply it in development. |

---

### 2.2 Client Data Fetching — Unaborted Imperative Refreshes

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| RF1 | **`refreshRecommendations()` fires `fetch` with no `AbortController`** | `discover/page.tsx:80-93` | Review 5 (F1) flagged that *no* fetch calls used `AbortController`. The initial `useEffect` data loads were subsequently fixed — they all create an `AbortController` and abort on cleanup. However, `refreshRecommendations()` (called from both the retry button at line 332 and the refresh button at line 348) still fires a bare `fetch("/api/recommendations")` with no signal. If a user clicks "Refresh" and navigates away before the response returns, the stale response sets state on the now-unmounted or re-mounted component. The same pattern appears in `games/[id]/page.tsx:169,199` where post-mutation `loadGame()` is called without a signal. These are *new* call sites not covered by the F1 fix because they are imperative callbacks, not `useEffect` data loads. **Fix:** Store the `AbortController` in a `useRef`, create a new one per imperative call, and abort the previous one before starting a new request. |

---

### 2.3 SEO — Incomplete Sitemap and Missing Robots Sitemap Directive

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| SEO1 | **Sitemap omits all 55 dynamic `/games/:id` pages** | `sitemap.ts:5-14` | The sitemap only lists 7 static routes (`/`, `/discover`, `/quiz`, `/collection`, `/stats`, `/privacy`, `/terms`). The 55 individual game pages — which are the most content-rich, linkable, and searchable pages in the app — are completely absent. Search engines cannot discover them via the sitemap. The fix is straightforward: query the games table and generate an entry per game. This is a server-side file (no `"use client"`), so `getDb()` can be called directly. |
| SEO2 | **`robots.ts` does not advertise the sitemap** | `robots.ts:3-12` | The `robots.txt` output has no `sitemap:` directive. While some crawlers will discover `/sitemap.xml` by convention, many rely on the explicit `sitemap:` line in `robots.txt`. The Next.js `MetadataRoute.Robots` type supports a `sitemap` field — add `sitemap: \`\${BASE_URL}/sitemap.xml\`` to the return object. |

---

### 2.4 Home Page — Unguarded Server-Side DB Call

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| HP1 | **Home page calls `getDb()` directly in component render with no try/catch** | `page.tsx:34-39` | `HomePage()` is a React Server Component that calls `getDb()` and `db.prepare(...).all()` directly in the render function. If the DB file is locked, corrupted, or missing, this throws an unhandled exception during server rendering. Unlike API routes (which all now have try/catch), this is the only server-side DB access in a page component, and it has no error handling. A DB failure on the home page crashes the entire app entry point. **Fix:** Wrap the DB access in a try/catch and fall back to an empty array, or extract it into a `getTopGames()` function in `lib/` with error handling. Alternatively, use the existing `/api/games` endpoint via a server-side fetch. |

---

### 2.5 TypeScript — Unsafe Compiler Option

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| TS1 | **`exactOptionalPropertyTypes: false` weakens strict mode** | `tsconfig.json:19` | The project enables `strict: true`, `noUncheckedIndexedAccess`, and `noFallthroughCasesInSwitch` — all good. But `exactOptionalPropertyTypes` is explicitly set to `false`. This allows assigning `undefined` to optional properties that don't include `undefined` in their type, hiding real bugs. For example, `{ name?: string }` would silently accept `{ name: undefined }`, which can cause downstream `null` vs `undefined` confusion in API responses. This is a strict-mode escape hatch that shouldn't be needed. **Fix:** Remove the line (it defaults to `false` anyway — but keeping it explicitly signals intent to allow this unsafety) or set it to `true` and fix any resulting type errors. |

---

### 2.6 Collection Page — Play Log Fetch Missing AbortController

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| PL1 | **`loadPlayLogs()` has no `AbortController` and no cleanup** | `collection/page.tsx:71-83` | Unlike the initial `loadCollection` effect (which properly aborts on cleanup), `loadPlayLogs()` is an imperative function called on button click (line 154) with no signal and no abort mechanism. If the user toggles "Play Logs" and then navigates away before the response arrives, the stale response calls `setPlayLogs` on an unmounted component. This is the same category as RF1 but in a different component and a different code path, so it's listed separately. **Fix:** Store an `AbortController` in a ref, pass its signal to the fetch, and abort in a cleanup effect or before re-fetching. |

---

## 3. Prioritized Action Plan

### P0 — Fix Immediately (< 1 hour total)

1. **CSP1 — Remove `'unsafe-inline'` and `'unsafe-eval'` from CSP** (`next.config.ts:27`): Switch to nonce-based CSP or `'strict-dynamic'`. If Recharts requires `'unsafe-eval'` at runtime, confirm with a production build first — many charting libraries work without it. If eval is truly needed, scope it to development only. ~30 minutes.

2. **RF1 — Add AbortController to imperative refresh/mutation-reload calls** (`discover/page.tsx:80-93`, `games/[id]/page.tsx:169,199`): Store an `AbortController` ref, abort previous before starting new, pass `{ signal }` to fetch. ~20 minutes.

### P1 — Important (< 1 day total)

3. **SEO1 — Generate dynamic sitemap entries for all games** (`sitemap.ts`): Import `getDb` and `GAME_LIST_COLUMNS`, query all game IDs and names, map to `{ url: \`\${BASE_URL}/games/\${id}\`, ... }`. ~15 minutes.

4. **SEO2 — Add `sitemap:` directive to robots.txt** (`robots.ts`): Add `sitemap: \`\${BASE_URL}/sitemap.xml\`` to the return object. 2 minutes.

5. **HP1 — Wrap home page DB call in try/catch** (`page.tsx:34-39`): Add try/catch around `getDb()` / `db.prepare().all()`, fall back to `[]`. ~5 minutes.

6. **TS1 — Remove or enable `exactOptionalPropertyTypes`** (`tsconfig.json:19`): Delete the line or set to `true` and fix resulting type errors. ~15-30 minutes.

7. **PL1 — Add AbortController to `loadPlayLogs`** (`collection/page.tsx:71-83`): Same pattern as RF1 — ref-based controller with signal passing. ~10 minutes.

---

## 4. Issues Not Re-Flagged (Confirmed Still Open from Prior Reviews)

The following issues from Reviews 1–5 remain open but are already documented:

- **T1–T2**: Zero tests, no CI pipeline (Review 3)
- **S1 (R3)**: `fromQuiz` dead code — `discover/page.tsx:17` still has `fromQuiz ? "recommended" : "recommended"` (Review 3)
- **D1–D2 (R3)**: No formatter, no pre-commit hooks (Review 3)
- **D4 (R3)**: `console.error` in production code (Review 3, plus `games/[id]/error.tsx:14`, `collection/page.tsx:53,79`, `discover/page.tsx:70`, `api/recommendations/route.ts:19`)
- **D5 (R3)**: `allowJs: true` in `tsconfig.json` (Review 3)
- **DS1 (R3)**: Seed data uses runtime timestamps (Review 3)
- **DS2 (R3)**: No migration strategy (Review 3)
- **S4 (R3)**: `setTimeout(..., 0)` for initial data loads remains in `discover/page.tsx:164`, `games/[id]/page.tsx:105`, `collection/page.tsx:61`
- **N3 (R3)**: `unstable_retry` used in `error.tsx` — now also in `games/[id]/error.tsx:9`
- **D2 (R4)**: Reviews still rely on `users.username` which is `user_<timestamp>` — better than hardcoded 'demo' but still not user-friendly
- **C1 (R5)**: Game detail page remains a monolith with 16+ useState (forms moved to sub-components for rendering, but all state/logic remains in parent)
- **C2 (R5)**: Discover page remains 440+ lines managing 3 independent tabs
- **A1 (R5)**: No `<meta name="color-scheme" content="dark">` despite dark theme
- **A2 (R5)**: `text-zinc-600` footer fails WCAG AA contrast

---

## 5. What's Improved Since Review 5

| Area | Status |
|------|--------|
| XSS sanitizer (S1, R5) | ✅ Now uses `sanitize-html` with empty allowlist and `recursiveEscape` mode |
| Security headers (S2, R5) | ✅ CSP, X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy all present (but CSP effectiveness weakened — see CSP1) |
| AbortController on useEffect fetches (F1, R5) | ✅ All `useEffect` data-loading calls now use `AbortController` with cleanup |
| setTimeout cleanup (F2, R5) | ✅ `errorTimerRef` pattern with cleanup on unmount in `GameCard`, `collection/page`, `games/[id]/page` |
| Secondary indexes (DB1, R5) | ✅ 5 composite indexes added to schema |
| `busy_timeout` pragma (DB2, R5) | ✅ `db.pragma('busy_timeout = 5000')` present at `lib/db.ts:28` |
| CloudFront image pattern (N1, R5) | ✅ Pinned to `d2k4q26owzy373.cloudfront.net` instead of wildcard |
| CONTRIBUTING.md clone URL (DOC1, R5) | ✅ Changed to `<this-repository-url>` (generic placeholder, not a 404) |
| `.env.example` (DOC2, R5) | ✅ Created with `NEXT_PUBLIC_BASE_URL` documented |
| Footer uses `<Link>` (NX1, R5) | ✅ Footer privacy/terms links now use `next/link` |
| Route-level error boundaries (NX2, R5) | ✅ `games/[id]/error.tsx` exists |
| Complexity bucketing unified (L2, R4) | ✅ `getComplexityBucket()` in `types/index.ts:126-132` used by stats |
| Play log thumbnail fallback (L1, R4) | ✅ `imgErrors` conditional rendering now wired in `collection/page.tsx:193-209` |
| Reviews JOIN users (D2, R4) | ✅ `api/games/[id]/route.ts:42-44` now JOINs `users u ON u.id = r.user_id` |
| Session expiration (D1, R4) | ✅ `expires_at` column with `datetime('now', '+30 days')` default, checked on lookup |

---

## 6. Bottom Line

GameScout continues its strong improvement trajectory. The new findings cluster in three areas: **CSP misconfiguration** (the highest-impact item — `'unsafe-inline'` effectively disables script-src protection), **incomplete AbortController coverage** (initial loads are fixed but imperative refresh/reload calls were missed), and **SEO completeness** (sitemap excludes the app's most valuable pages). All 7 issues are independently addressable, well-scoped, and collectively represent ~2 hours of work. The codebase is approaching production quality with each review cycle; the remaining open items from prior reviews (tests, CI, formatter) are the largest remaining structural gaps.
