# GameScout — Second-Pass UX & DX Audit

**Reviewer:** Senior engineer, second encounter with codebase  
**Date:** 2025-07-18  
**Scope:** Remaining UX gaps, accessibility, visual polish, responsive edge cases, error handling, regressions  
**Baseline:** First review in `docs/UX_REVIEW.md` (2025-07-17) — fixes implemented afterward

---

## 1. Executive Summary

The first review and subsequent fixes addressed the most visible structural gaps (error boundary, shared types, moods dedup, privacy/terms pages, skip-to-content link, `aria-current` on nav). However, a deeper pass reveals a systemic pattern of **missing keyboard/screen-reader support**, **silent failure modes throughout the API layer**, and **responsive fragility on sub-400px viewports**. The accessibility gaps alone would fail a WCAG 2.2 AA audit — most interactive patterns (tabs, toggles, modals, rating controls) lack proper ARIA roles, focus management, and keyboard equivalents. Error handling is the other major theme: almost every API route can return a 500 on malformed input, and almost every client-side fetch silently swallows failures. These two themes — a11y and resilience — represent the highest-impact remaining work.

---

## 2. Remaining Issues by Category

### 2.1 Accessibility (WCAG 2.2 AA Gaps)

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| A1 | **GameCard nests interactive elements inside a link** | `GameCard.tsx:61–159` | The entire card is a `<Link>`, but collection action `<button>`s sit inside it. This creates ambiguous tab order and invalid HTML (interactive content inside `<a>`). Screen readers and keyboard users cannot reliably distinguish "navigate to game" from "add to collection." Fix: separate the link target from the button area, e.g. make the card a `<div>` with a distinct link on the title/image. |
| A2 | **Modal has no focus trap or initial focus** | `games/[id]/page.tsx:536–633` | The "Log a Play" modal has `role="dialog"` and `aria-modal`, but focus is never moved into the modal on open. The `onKeyDown` Escape handler is on a `<div>` that won't receive keyboard events unless focused. After closing, focus is not restored to the trigger button. |
| A3 | **Tab controls lack ARIA tab pattern** | `discover/page.tsx:161–176`, `collection/page.tsx:217–239` | The "Recommended / Browse / Search" and "Owned / Wishlist" controls use `<button>` elements with visual-only active state (bg color). Missing: `role="tablist"` on container, `role="tab"` on each button, `aria-selected`, `role="tabpanel"` on content, and arrow-key navigation between tabs. |
| A4 | **Mood filter buttons lack `aria-pressed`** | `discover/page.tsx:187–202` | Mood pills are stateful toggles but have no `aria-pressed` attribute. The selected state is communicated only via color change — invisible to screen readers. |
| A5 | **Rating/preference option groups lack semantic grouping** | `quiz/page.tsx:411–429, 581–597` | Quiz rating buttons and theme checkboxes are bare `<button>` elements in a `<div>`. No `role="group"` or `role="radiogroup"` with `aria-label` to communicate "Rate this game" or "Select themes you enjoy." |
| A6 | **Progress bar missing accessible label** | `quiz/page.tsx:368–372` | Has `role="progressbar"` and `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, but no `aria-label` (e.g., "Quiz progress: step 3 of 14"). |

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| A7 | **No visible focus indicators on interactive elements** | Global — `globals.css`, all components | Tailwind's default `outline-none` via preflight removes browser focus rings. No custom `focus-visible` styles are defined anywhere. Keyboard users cannot see which element is focused. Add a global `focus-visible:ring-2 ring-emerald-500` or equivalent. |
| A8 | **Error messages not announced to assistive tech** | `GameCard.tsx:134–136`, `error.tsx`, `quiz/page.tsx:330–334` | Error text is rendered as plain `<p>` elements. Should use `role="alert"` or `aria-live="assertive"` so screen readers announce failures immediately. |
| A9 | **Charts have no text alternative** | `stats/page.tsx:246–309, 357–388` | Recharts SVG charts are opaque to screen readers. No `aria-label`, `<desc>`, or data table alternative is provided. Users relying on assistive tech get zero data from the stats page. |
| A10 | **Decorative content exposed to AT** | `EmptyState.tsx:18`, `TopGamesShowcase.tsx:29`, `quiz/page.tsx:386–402` | Emoji/icon fallbacks are announced by screen readers. Add `aria-hidden="true"` to purely decorative emoji and image-error fallback elements. |
| A11 | **No `prefers-reduced-motion` support** | `globals.css`, `LoadingSkeleton.tsx:3,34` | `animate-pulse` runs on every loading skeleton. Users with vestibular disorders who set `prefers-reduced-motion: reduce` still see animations. Add `@media (prefers-reduced-motion: reduce) { .animate-pulse { animation: none; } }`. |
| A12 | **Skeleton loading not communicated to AT** | `LoadingSkeleton.tsx` | Skeleton placeholders have no `aria-hidden`, `aria-busy`, or screen-reader-only "Loading…" text. AT users encounter meaningless empty rectangles. |

---

### 2.2 Error Handling & Resilience

#### P0 — Critical

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| E1 | **Every API POST route crashes on malformed JSON** | All `route.ts` POST handlers | `await request.json()` is never wrapped in `try/catch`. Sending a non-JSON body (e.g., `Content-Type: text/plain`) throws an unhandled exception → 500 instead of 400. Affects: `/api/collection`, `/api/quiz`, `/api/reviews`, `/api/play-logs`, `/api/price-alerts`. |
| E2 | **`parseGame()` crashes on corrupted JSON fields** | `lib/db.ts:263–269` | `JSON.parse(row.categories)` and `JSON.parse(row.mechanics)` have no `try/catch`. A single corrupted row crashes the entire request for any endpoint that lists games. |

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| E3 | **Client-side fetches don't check `res.ok`** | `collection/page.tsx:23–50`, `games/[id]/page.tsx:119–201`, `stats/page.tsx:64–74` | Multiple `fetch()` calls proceed to `.json()` without checking response status. A 500 response will either throw on JSON parse or produce garbage data rendered to the UI. |
| E4 | **Stats page loading hangs forever on fetch failure** | `stats/page.tsx:64–74` | `Promise.all().then()` has no `.catch()`. If either request rejects, `setLoading(false)` never executes — user sees a permanent loading spinner. |
| E5 | **Browse/search fetch has no error handling** | `discover/page.tsx:72–124` | `loadBrowse()` and `handleSearch()` have no `try/catch` or `.catch()`. Network failures silently leave stale or empty data with no user feedback. |
| E6 | **Destructive actions have no confirmation** | `collection/page.tsx:53–79` | Remove-from-collection and delete-play-log execute immediately on click with no "Are you sure?" confirmation. Combined with no undo capability, accidental deletions are permanent. |
| E7 | **Optimistic updates with no rollback** | `collection/page.tsx:53–79`, `GameCard.tsx:60–80` | Collection mutations update local state before the API responds. If the request fails, the UI shows the new state but the server has the old state. No rollback or error reconciliation. |
| E8 | **DELETE routes return success even when nothing was deleted** | `api/collection/route.ts:76–78`, `api/play-logs/route.ts:100–102`, `api/price-alerts/route.ts:53–55` | All DELETE handlers return `{ ok: true }` regardless of whether a row was actually deleted. Clients cannot distinguish "removed" from "was already gone." |

---

### 2.3 Responsive Design & Visual Polish

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| R1 | **Game detail key stats grid is always 3 columns** | `games/[id]/page.tsx:325–348` | `grid-cols-3` is hardcoded with no responsive breakpoint. On iPhone SE (320px), each column is ~93px — stat labels like "Complexity" and values like "2-4 players" wrap poorly. Should be `grid-cols-1 sm:grid-cols-3`. |
| R2 | **Filter row overflows on narrow screens** | `discover/page.tsx:207–256` | Sort, player count, playtime, and complexity dropdowns are in a single flex row. On screens < 400px, they wrap into a cramped multi-line layout with no spacing adjustments. Consider stacking into a 2×2 grid on mobile. |
| R3 | **Stats chart axis labels unreadable on mobile** | `stats/page.tsx:329–336, 360–365` | `YAxis width={90}` truncates long category names. X-axis `fontSize: 10` on the plays-over-time chart is too small to read on mobile. Line chart labels overlap when there are > 6 months of data. |
| R4 | **Collection header actions wrap awkwardly** | `collection/page.tsx:97–120` | The header contains title + play-log toggle + sort dropdown in a flex row. On narrow viewports, elements wrap mid-word. Needs `flex-wrap` with proper gap/margin or a stacked mobile layout. |
| R5 | **TopGamesShowcase cards too small at `grid-cols-6`** | `TopGamesShowcase.tsx:45` | On `lg` breakpoint (~1024px), 6 columns make each card ~140px wide. Game titles truncate aggressively and images are postage-stamp sized. Consider `lg:grid-cols-4 xl:grid-cols-6`. |

#### P2 — Polish

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| R6 | **`text-zinc-400` / `text-zinc-500` contrast borderline** | Global — 30+ instances | Against `bg-zinc-900` (#18181b), `text-zinc-400` (#a1a1aa) gives ~4.8:1 contrast (passes AA for normal text) but `text-zinc-500` (#71717a) gives ~3.5:1 (fails AA for normal text at standard sizes). All body-text usages of `text-zinc-500` should be upgraded to `text-zinc-400`. |
| R7 | **No `color-scheme: dark` on `<html>`** | `layout.tsx:25` | Without `color-scheme: dark`, browser-native controls (scrollbars, form elements, date pickers) render in light mode, creating visual inconsistency. Add `<meta name="color-scheme" content="dark">` or CSS `color-scheme: dark`. |
| R8 | **Image error fallback inconsistent** | `GameCard.tsx:74–78`, `quiz/page.tsx:386–402` | Some components show a dice emoji on image error, others show nothing. The emoji fallback has no `aria-hidden` and no alt text. Standardize to a consistent placeholder component. |
| R9 | **Hero section padding excessive on small screens** | `page.tsx:44–75` | `py-20 md:py-32` creates large empty space above the fold on mobile. Combined with the large heading (`text-4xl md:text-6xl`), the CTA buttons may be pushed below the fold on shorter phones. |

---

### 2.4 Input Validation & Data Integrity

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| V1 | **Numeric params parsed with `Number()` but checked with falsy test** | `api/games/route.ts:69–74`, `api/reviews/route.ts:31–36`, `api/play-logs/route.ts:93–98`, `api/price-alerts/route.ts:46–51` | Pattern: `const id = Number(param); if (!id) return 400`. This treats `NaN` and `0` identically — `0` is a valid (if unlikely) ID that gets rejected, and `NaN` falls through to DB queries in some code paths. Use `Number.isNaN()` or `parseInt` with explicit checks. |
| V2 | **Quiz preferences accept arbitrary keys** | `api/quiz/route.ts:31–45` | `preferences` array items have `key` and `value` fields with no whitelist. Arbitrary keys can be stored in the DB, potentially bloating the table or causing unexpected behavior in the recommendation engine. |
| V3 | **Review body has no length limit** | `api/reviews/route.ts:10–24` | No server-side length validation on `reviewBody`. A client could POST megabytes of text. Add a reasonable limit (e.g., 5000 chars). |
| V4 | **Price alert accepts invalid email** | `api/price-alerts/route.ts:24–38` | `email` field is stored directly with no format validation. Invalid emails will be stored and never deliverable. |
| V5 | **`parseGame()` trusts JSON shape blindly** | `lib/db.ts:266–268` | `JSON.parse(row.categories)` is assumed to be `string[]`. If the stored JSON is `null`, a number, or an object, downstream code will produce wrong results silently. |

---

### 2.5 Keyboard & Focus Management

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| K1 | **Mobile nav menu has no focus management** | `Navbar.tsx:52–90` | When the hamburger menu opens, focus stays on the toggle button. Keyboard users must Tab through all background content to reach menu items. No focus trap, no Escape-to-close, no click-outside-to-close. |
| K2 | **Quiz auto-advance doesn't move focus** | `quiz/page.tsx:206–213` | After selecting a rating, a 200ms `setTimeout` advances to the next step. Focus stays on the (now invisible) previous button. Screen reader users lose context entirely — they don't know a new game appeared. Should `focus()` the new game's heading or first interactive element. |
| K3 | **Form focus not managed on show/hide** | `games/[id]/page.tsx` (review form, alert form, log modal) | Toggling `showReviewForm`, `showAlertForm`, or `showLogModal` renders new form elements but never moves focus to them. Users must Tab forward to find the newly appeared inputs. On close, focus is not restored to the trigger. |
| K4 | **Error.tsx doesn't focus heading on mount** | `error.tsx` | When an error boundary catches, the error page renders but focus stays wherever it was. Keyboard/AT users aren't informed that the page content has changed. The heading should receive focus via `tabIndex={-1}` + `ref.focus()`. |

---

### 2.6 State & Interaction Bugs

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| S1 | **GameCard `status` state desyncs from prop** | `GameCard.tsx:24–26` | `useState(collectionStatus)` initializes from the prop but never updates if the parent re-renders with a new value. If a user adds a game to their collection via the detail page and navigates back, the card may show stale status. Use `useEffect` to sync or lift state. |
| S2 | **`fromQuiz` URL param does nothing** | `discover/page.tsx:16–18` | `fromQuiz ? "recommended" : "recommended"` — both branches return the same value. The quiz-to-discover transition provides no special welcome message, animation, or scroll-to-recommendations behavior. Either implement the intended behavior or remove the param. |
| S3 | **Quiz `setTimeout` not cleaned up on unmount** | `quiz/page.tsx:206–213, 460–463, 501–504, 542–545` | `setTimeout(..., 200)` calls in rating/preference handlers are never cleared via `clearTimeout`. If the component unmounts before the timeout fires (e.g., user navigates away), React will attempt a state update on an unmounted component. |
| S4 | **`error.tsx` uses `unstable_retry` prop** | `error.tsx:7, 10, 29` | Depends on an unstable/internal Next.js API. This may break or be removed in future Next.js versions without warning. |

#### P2 — Nice to Have

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| S5 | **`setShowReviewForm(!showReviewForm)` uses stale closure** | `games/[id]/page.tsx:640–645` | Toggle uses the current closure value rather than a functional update (`prev => !prev`). In rapid double-clicks, this can produce unexpected behavior. |
| S6 | **Collection `setTimeout(..., 0)` for initial load** | `collection/page.tsx:34–40` | Wrapping the initial data load in `setTimeout(..., 0)` is unnecessary and can cause a flash of empty state before data appears. Remove and call directly in `useEffect`. |

---

### 2.7 Security & Session

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| X1 | **Session cookie is trivially spoofable** | `lib/session.ts:11–35` | The `gs_user_id` cookie stores a plain-text numeric user ID with no signature or encryption. Any user can set `document.cookie = "gs_user_id=1"` to impersonate another user and access/modify their collection, reviews, and play logs. For a demo this is acceptable, but should be documented as a known limitation. |
| X2 | **Implicit user creation on every request** | `lib/session.ts:20–37` | `getUserId()` creates a new user row if the cookie doesn't match an existing user. This means any bot or crawler hitting any API endpoint will create orphan user rows in the database. |
| X3 | **Cookie lacks `Secure` and `SameSite` attributes** | `lib/session.ts:30–35` | Cookie is set with `path` and `httpOnly` only. Missing `Secure` (HTTPS-only) and `SameSite=Lax` (CSRF protection). |

---

### 2.8 Performance & Scalability (New Findings)

#### P1 — Important

| # | Issue | Location | Detail |
|---|-------|----------|--------|
| P1 | **N+1 query in taste profile builder** | `lib/recommendations.ts:58–63` | `buildTasteProfile()` queries each rated game individually inside a loop: `db.prepare("SELECT * FROM games WHERE id = ?").get(gameId)` × N. Should be a single `WHERE id IN (...)` query. |
| P2 | **O(n²) similar-game matching** | `lib/recommendations.ts:229–239` | `allGames.find(g => g.id === ...)` inside a loop over all rated games. At 500+ games and 50+ ratings, this becomes measurably slow. Use a `Map` for O(1) lookup. |
| P3 | **Games API filters in JS after DB fetch** | `api/games/route.ts:20–61` | `limit` is applied at the DB level, then filters (minPlayers, maxComplexity, maxPlaytime, categories, moods) are applied in JS. This means the limit truncates before filtering — valid matches beyond the limit are silently dropped. Move filters to SQL WHERE clauses. |
| P4 | **Play logs stats computed in-memory** | `api/play-logs/route.ts:10–43` | GET handler fetches ALL play logs, then computes monthly grouping and statistics in JS. At scale, this should be SQL aggregation. |

---

## 3. Fixes Already Applied from First Review

The following items from the first review appear to have been addressed:

| First Review # | Issue | Evidence of Fix |
|----------------|-------|-----------------|
| 8 | Duplicated `Game` type | `src/types/index.ts` exists with shared types |
| 9 | Duplicated MOODS | `src/lib/moods.ts` extracted as separate module |
| 10 | No error boundaries | `src/app/error.tsx` exists |
| 14 | Dead footer links | `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` exist |
| 16 | No `aria-current` on nav | Present in `Navbar.tsx` |
| 24 | No skip-to-content link | Present in `layout.tsx` |

---

## 4. Prioritized Action Plan

### P0 — Blocks Launch / Critical Failures (1–2 days)

1. **Wrap all API `request.json()` calls in try/catch** → return 400 on parse failure (E1)
2. **Add try/catch to `parseGame()` JSON.parse** → skip corrupted rows instead of crashing (E2)
3. **Fix nested interactive elements in GameCard** → separate link from buttons (A1)
4. **Add focus trap + initial focus + focus restore to modal** (A2)
5. **Add ARIA tab pattern to tab controls** (A3)

### P1 — Important UX/A11y/Resilience (3–5 days)

6. Add global `focus-visible` ring styles (A7)
7. Add `role="alert"` / `aria-live` to error messages (A8)
8. Add `aria-pressed` to mood filter buttons (A4)
9. Add `role="group"` + `aria-label` to quiz option sets (A5)
10. Check `res.ok` on all client-side fetches; show error UI on failure (E3, E4, E5)
11. Add confirmation dialog for destructive actions (E6)
12. Fix `GameCard` state desync from props (S1)
13. Add mobile nav focus management + Escape-to-close (K1)
14. Move quiz focus on auto-advance (K2)
15. Fix game detail key stats responsive grid (R1)
16. Fix filter row mobile layout (R2)
17. Replace `Number()` + falsy check with proper numeric validation (V1)
18. Add N+1 query fix for taste profile (P1)
19. Move game API filters to SQL (P3)
20. Add `prefers-reduced-motion` support (A11)
21. Add text alternatives for charts (A9)
22. Add cookie `Secure` and `SameSite` attributes (X3)
23. Add `aria-label` to progress bar (A6)

### P2 — Polish & Maintenance (1 sprint)

24. Upgrade all `text-zinc-500` body text to `text-zinc-400` for contrast (R6)
25. Add `color-scheme: dark` meta tag (R7)
26. Standardize image error fallback component (R8)
27. Add `aria-hidden` to decorative emoji (A10)
28. Add `aria-busy` / SR-only text to loading skeletons (A12)
29. Clean up stale `setTimeout` in quiz (S3)
30. Fix `fromQuiz` param (implement welcome UX or remove) (S2)
31. Use functional updates for state toggles (S5)
32. Remove unnecessary `setTimeout(..., 0)` in collection (S6)
33. Add review body length limit (V3)
34. Add email format validation for price alerts (V4)
35. Whitelist quiz preference keys (V2)
36. Replace `unstable_retry` with stable API (S4)
37. Reduce hero padding on mobile (R9)
38. Fix TopGamesShowcase column density (R5)

---

## 5. Comparison to First Review

| Dimension | First Review Assessment | Current Status |
|-----------|------------------------|----------------|
| **Accessibility** | 7 issues found | 12 new issues found — systemic gap in ARIA patterns, focus management, and keyboard nav |
| **Error Handling** | 3 issues found (silent catches, no boundaries) | 8 new issues — API resilience is the biggest remaining gap |
| **Responsive** | 3 issues found | 5 new issues — mostly sub-400px edge cases and chart readability |
| **Code Quality** | Duplication issues flagged | Duplication partially fixed; new state management bugs identified |
| **Security** | Auth gap flagged | Session security details now documented (cookie spoofing, missing attributes) |
| **Performance** | Caching + SSR flagged | N+1 queries and O(n²) algorithms now identified in recommendation engine |

---

## 6. Bottom Line

The codebase has improved since the first review — shared types, extracted moods, error boundary, and privacy/terms pages are solid progress. But the remaining work is deeper and more systematic: **ARIA patterns need to be applied consistently across every interactive component**, **every API route needs defensive JSON parsing and input validation**, and **every client-side fetch needs `res.ok` checks with user-visible error states**. These aren't one-off fixes — they require establishing patterns (a `safeJson()` wrapper, a `useApiCall()` hook, a focus-management utility) that are then applied everywhere. The good news is that none of this requires architectural changes — it's all incremental improvement on a solid foundation.
