# GameScout — UX & Developer Experience Audit

**Reviewer:** Senior engineer, first-time encounter with codebase  
**Date:** 2025-07-17  
**Scope:** Product UX, Developer Experience, PRD Feature Completeness, Polish, Performance

---

## 1. Executive Summary

GameScout is a well-structured, visually polished MVP that delivers core discovery and collection features with surprising completeness for an early-stage project. The dark theme is cohesive, the quiz flow is engaging, and the code is clean and navigable. However, significant gaps remain against the PRD: no authentication system, no BGG import, no analytics, and several accessibility failures that would block a public launch. The biggest product UX risks are the lack of mobile hamburger navigation (the mobile nav takes up persistent screen space), the quiz's inability to go back, and the absence of keyboard/screen-reader support. From a DX perspective, the project is easy to set up (clone → `npm install` → `npm run dev`) but has zero tests, no CI, and duplicated type definitions scattered across pages.

---

## 2. PRD Feature Completeness

### ✅ Implemented (partial or full)

| PRD Req | Status | Notes |
|---------|--------|-------|
| FR-002 Taste Quiz | ✅ Implemented | 10-game rating + 4 preference steps. Missing: progress persistence across sessions (quiz state is ephemeral React state). |
| FR-003 Catalog Search & Detail | ✅ Implemented | Search by name, detail pages with all required fields. Missing: autocomplete, year/publisher disambiguation for duplicate titles. |
| FR-004 Collection Management | ✅ Implemented | Owned/Wishlist, sorting, empty states. |
| FR-006 Recommendation Feed | ✅ Implemented | Content-based scoring with rationale. Fallback to popular games when no quiz data exists. |
| FR-007 Mood Browsing | ✅ Implemented | 8 mood presets with filter combinations. Missing: "broadened results" labeling when few matches. |
| FR-008 Wishlist | ✅ Implemented | Add/remove, move-to-owned. Missing: sort by lowest price. |
| FR-009 Price Tracker | ✅ Partial | Prices shown with retailer + "Best Price" badge. Deal alerts are stored but not functional (no notification system). Prices are static seed data, not live. |
| Play Logging | ✅ Implemented | Full CRUD via game detail page. Listed in PRD as out-of-scope for v1 but implemented anyway — nice bonus. |
| Reviews | ✅ Implemented | Also out of v1 scope per PRD, but functional. |
| Stats Dashboard | ✅ Implemented | Charts for plays, complexity, categories, ratings. Out of v1 scope per PRD. |

### ❌ Not Implemented

| PRD Req | Priority | Impact |
|---------|----------|--------|
| **FR-001 Authentication** | Must | No auth at all — hardcoded `user_id = 1` everywhere. All data is shared across all visitors. This is the single largest gap. |
| **FR-005 BGG Import** | Must | No import flow exists. The PRD considers this a core acquisition feature. |
| **FR-010 Analytics** | Must | No event tracking instrumentation. |
| **NFR: Accessibility (WCAG 2.2 AA)** | Must | Major gaps (see Section 4 below). |
| **NFR: String externalization (i18n)** | Should | All strings are hardcoded inline. |
| **NFR: Stale price labeling** | Should | No freshness check on price timestamps. |

---

## 3. Product UX Findings

### 3.1 User Flows

#### Quiz Flow
- **P0 — No back button in quiz.** Users cannot revisit or change a previous rating. The auto-advance on selection (200ms timeout) compounds this — a misclick is permanent. The only option is to restart the entire quiz.
- **P0 — Quiz state not persisted.** If a user refreshes the page or navigates away mid-quiz, all progress is lost. The PRD explicitly requires: "Given a user who abandons onboarding mid-flow, when they return later, then progress is restored." (`quiz/page.tsx` stores state only in React `useState`.)
- **P1 — No confirmation before quiz submission.** While there is a summary screen, there's no warning that submitting overwrites previous quiz answers.
- **P2 — "Haven't Played" auto-advances like a real rating.** Conceptually, skipping and saying "Haven't played" are the same action, but they behave differently — one advances, the other doesn't. This is mildly confusing.

#### Discovery Flow
- **P1 — Tab state resets on navigation.** If a user is on the "Browse" tab with filters applied, navigates to a game detail, then goes back, the entire discover page re-renders with default state (recommended tab, no filters).
- **P1 — Mood filters applied client-side after fetching all games.** The browse tab fetches up to 50 games from the API, then filters in JS. Mood category filtering (e.g., "Cooperative") happens entirely client-side in `discover/page.tsx:115-133`. If the catalog grows beyond 50 games, mood results will silently miss matches.
- **P2 — Search has no empty-state prompt until you type.** Good — there's an initial "Search for games" empty state. But the search doesn't trigger on Enter key — it only uses a 400ms debounce, which is acceptable but could feel sluggish.

#### Collection Flow
- **P1 — No optimistic UI on collection changes.** Adding/removing from collection waits for the API response before updating the button state. On slow connections, buttons feel unresponsive.
- **P2 — Play logs section is hidden by default behind a toggle.** Users must click "Play Logs" to see play history. This is fine, but the toggle text doesn't indicate count (e.g., "📝 Play Logs (3)").

#### Game Detail Flow
- **P0 — Game detail page is entirely client-rendered.** The page fetches all data via `/api/games/[id]` in a `useEffect`, meaning no SSR, no SEO, no social sharing metadata. For a discovery product, game detail pages are the most likely to be shared/linked. (`games/[id]/page.tsx` is `"use client"` with `useState` + `useEffect`.)
- **P1 — Similar games section has no collection status.** The `GameCard` components in the "Similar Games" section don't receive `collectionStatus` or `onCollectionChange` props, so the owned/wishlist buttons there operate independently and will desync from the actual collection state.

### 3.2 UI Clarity & Visual Design

- **P2 — Inconsistent card layouts.** `GameCard` component renders different content than the inline cards in `collection/page.tsx:304-354`. The collection page duplicates most of the card layout instead of reusing `GameCard`, leading to visual inconsistencies (different height images: `h-52` vs `h-48`, different metadata shown).
- **P2 — StarRating component uses dots, not stars.** Despite the name, `StarRating` in `games/[id]/page.tsx:64-86` renders 10 tiny circles. This is visually fine but semantically misleading — the function name and the yellow-400 color suggest stars. Rename or add a visual star icon.
- **P1 — Footer privacy/terms links go nowhere.** Both `<a href="#">Privacy</a>` and `<a href="#">Terms</a>` in `layout.tsx:37-39` are dead links. For a product with affiliate disclosures and price tracking, this is a compliance gap.

### 3.3 Responsiveness

- **P1 — Mobile nav takes permanent screen real estate.** On mobile (`md:hidden`), the nav renders a persistent bottom-ish bar with 4 links (`Navbar.tsx:52-66`). This is always visible and compresses content area. There's no hamburger menu or collapsible behavior.
- **P2 — Quiz game images on mobile.** The 16:9 aspect ratio image in the quiz (`aspect-[16/9] max-h-64`) works well, but the rating buttons below require scrolling on shorter phones. The full quiz step (image + description + 5 buttons + skip) doesn't fit in a single viewport on iPhone SE-sized screens.
- **P1 — Price comparison section not responsive.** On narrow screens, the price row in `games/[id]/page.tsx:433-467` has a flex layout with "Best Price" badge + retailer name + date on the left and price + "Buy" button on the right. On screens < 400px, this wraps awkwardly.

### 3.4 Accessibility

- **P0 — No focus management in modals.** The "Log a Play" modal (`games/[id]/page.tsx:577-665`) and the alert form have no focus trap. Users can tab behind the modal to interact with background content. No `role="dialog"` or `aria-modal`.
- **P0 — No skip-to-content link.** No landmark skip navigation for keyboard users.
- **P0 — Interactive emoji-only buttons lack accessible labels.** Delete buttons use "✕" (`collection/page.tsx:366`), play log delete uses "✕" (`collection/page.tsx:221`), and various UI elements use emoji as the sole content. Screen readers will announce these as "multiplication sign" or nothing.
- **P1 — Form inputs lack associated labels.** Many inputs in the quiz, log form, and alert form use `<label>` wrappers but the review form's textarea has no explicit label. The range slider for review rating has a label but no `id` association.
- **P1 — Color-only complexity indication.** Complexity uses color (green → red) as the sole indicator in `GameCard.tsx:40-45`. While there's also a text label ("Light", "Medium", etc.), the color mapping would fail for color-blind users.
- **P1 — No `aria-current="page"` on active nav links.** The active state is visual only (background color).
- **P2 — Custom scrollbar CSS is WebKit-only.** `globals.css:19-31` styles scrollbars with `::-webkit-scrollbar` only. Firefox users get the default scrollbar (not broken, but inconsistent).

---

## 4. Developer Experience Findings

### 4.1 Onboarding & Setup
- **P2 — Excellent.** Clone → `npm install` → `npm run dev` works. SQLite DB auto-creates and seeds. No env vars needed. README documents this clearly. Time to running: ~60 seconds. This is best-in-class for an MVP.

### 4.2 Code Organization
- **P1 — Duplicated `Game` interface across 5+ files.** The `Game` type is redefined in: `GameCard.tsx`, `discover/page.tsx`, `collection/page.tsx`, `games/[id]/page.tsx`, `TopGamesShowcase.tsx`. These interfaces drift (e.g., `discover/page.tsx` includes `mechanics` but `GameCard.tsx` doesn't). Should have a single `types.ts` or export from `lib/db.ts`.
- **P1 — Duplicated MOODS definition.** `MOODS` is defined in both `lib/recommendations.ts:282-339` and `discover/page.tsx:10-19` with different shapes. The page-level version omits fields like `minPlayers`, `description`. Any mood logic change requires updating two places.
- **P1 — Duplicated complexity color/label logic.** `getComplexityColor` appears in `GameCard.tsx:40-45` and as `COMPLEXITY_COLOR` in `games/[id]/page.tsx:88-93`. Same logic, different function names.
- **P2 — Game detail page is 773 lines.** `games/[id]/page.tsx` is a single component managing 12+ state variables, 4 forms, and rendering the entire page. This should be decomposed into sub-components (PriceSection, ReviewSection, PlayLogSection, etc.).

### 4.3 API Design
- **P1 — No input validation/sanitization on API routes.** The `POST` handlers in `quiz/route.ts`, `reviews/route.ts`, etc. destructure `request.json()` directly with type assertions but no runtime validation. Malformed JSON or unexpected types will cause runtime errors, not 400 responses.
- **P1 — SQL injection risk in search.** `games/route.ts:22` uses `LIKE ?` with parameterized queries — this is safe. However, the pattern `%${q}%` means a search for `%` or `_` will match unintentionally (SQL wildcard characters). Not a security issue but a correctness issue.
- **P2 — Collection GET response maps game fields manually.** `collection/route.ts:17-39` manually remaps every field from the joined query result. If a column is added to `games`, this mapping must be updated too. The `parseGame` helper should handle this.
- **P2 — Similar games loads entire catalog.** `games/[id]/route.ts:44-57` fetches ALL games from the DB, parses them, then filters client-side. With 55 games this is fine; at 500+ it's a performance concern.

### 4.4 Testing
- **P0 — Zero tests.** No test files, no test runner configured, no test scripts in `package.json`. The recommendation engine (`lib/recommendations.ts`) in particular has complex scoring logic that is completely unverified. This is the #1 DX risk.

### 4.5 Tooling & CI
- **P1 — No CI/CD pipeline.** No GitHub Actions, no pre-commit hooks, no automated lint-on-save enforcement. The eslint config exists but there's no evidence it's being run regularly.
- **P2 — No Prettier or formatting config.** Code style is consistent by convention, but there's no formatter to enforce it.
- **P2 — `.gitignore` doesn't exclude `gamescout.db`.** The SQLite database file (`gamescout.db`, `gamescout.db-shm`, `gamescout.db-wal`) appears to be tracked in the repo. Database files should not be in version control.

### 4.6 Error Handling
- **P1 — Silent `catch` blocks.** Multiple places swallow errors with empty catches: `discover/page.tsx:97` (`catch {}`), `collection/page.tsx` collection loading, `GameCard.tsx:78` (`console.error(e)`). Users see no feedback on failed operations. The quiz submission error handler (`quiz/page.tsx:189-190`) catches errors but leaves the user on the summary page with no error message.
- **P1 — No error boundaries.** No React error boundaries anywhere. A rendering crash in any component will white-screen the entire app.

---

## 5. Performance Findings

- **P1 — All pages that could be server-rendered are client-rendered.** The home page (`page.tsx`) correctly uses server-side DB queries — good. But `discover/page.tsx`, `collection/page.tsx`, `stats/page.tsx`, and `games/[id]/page.tsx` are all `"use client"` with `useEffect` data fetching. This means: no streaming, no SSR, blank page until JS loads and API responds. The game detail page is the most impactful — it should be a server component with client islands for interactive sections.
- **P1 — Recommendation engine loads all games on every request.** `recommendations.ts:159` does `SELECT * FROM games` on every `/api/recommendations` call, then iterates all games for scoring. Fine at 55 games, but O(n²) with the inner loop over rated games (`recommendations.ts:229-239`).
- **P2 — No data caching.** Every page navigation triggers fresh API calls. The `discover` page re-fetches recommendations, collection statuses, and browse data on every mount. `SWR` or `React Query` would dramatically reduce redundant fetches.
- **P2 — Images use BGG thumbnail URLs directly.** The `next/image` component provides optimization, but the source images are external (cf.geekdo-images.com). If BGG CDN is slow or rate-limits, the entire UI degrades. No preloading or priority hints except on the detail page hero image.
- **P2 — All 55 games rendered at once in browse.** No pagination or virtual scrolling. The browse tab renders up to 50 game cards simultaneously. Each card has an Image component, two buttons, and hover animations. On low-end devices, this will jank.

---

## 6. Recommendations by Priority

### P0 — Critical (blocks launch)

| # | Issue | Location | Recommendation |
|---|-------|----------|----------------|
| 1 | No authentication | All API routes hardcode `user_id = 1` | Implement session-based auth or at minimum a cookie-based demo user ID so multiple visitors don't share data |
| 2 | Zero test coverage | Entire project | Add Jest/Vitest + React Testing Library. Start with `lib/recommendations.ts` (pure logic, high value) and API routes |
| 3 | Quiz has no back button | `quiz/page.tsx` | Add a "← Back" button next to "Skip →". Store each step's answer so going back restores the previous selection |
| 4 | Quiz state not persisted | `quiz/page.tsx` | Persist quiz progress to `localStorage` or the DB (via API) so abandoned quizzes can be resumed |
| 5 | No focus trap in modals | `games/[id]/page.tsx:577-665` | Use `<dialog>` element or a focus-trap library. Add `role="dialog"`, `aria-modal="true"`, Escape-to-close |
| 6 | No accessible labels on icon buttons | `collection/page.tsx:221,366` | Add `aria-label="Remove from collection"`, `aria-label="Delete play log"`, etc. |
| 7 | Game detail page not server-rendered | `games/[id]/page.tsx` | Convert to server component with client islands for forms/buttons. Critical for SEO and social sharing |

### P1 — Important (significant UX/DX impact)

| # | Issue | Location | Recommendation |
|---|-------|----------|----------------|
| 8 | Duplicated `Game` type across files | 5+ files | Create `src/types/index.ts` with shared interfaces. Export from there, import everywhere |
| 9 | Duplicated MOODS definition | `discover/page.tsx` + `lib/recommendations.ts` | Single source of truth in `lib/recommendations.ts`, import in page |
| 10 | No error boundaries | App-wide | Add a root error boundary in `app/error.tsx` and per-route boundaries |
| 11 | Silent error swallowing | `discover/page.tsx:97`, `GameCard.tsx:78` | Show toast/inline error on failed collection/API operations |
| 12 | Mobile nav permanently visible | `Navbar.tsx:52-66` | Convert to hamburger menu or bottom tab bar that doesn't steal content space |
| 13 | No CI pipeline | Project root | Add GitHub Actions for lint + type-check + test on PR |
| 14 | Footer links dead | `layout.tsx:37-39` | Create placeholder privacy/terms pages or remove links |
| 15 | Similar games lack collection status | `games/[id]/page.tsx:764` | Pass `collectionStatus` and `onCollectionChange` to similar game cards |
| 16 | No `aria-current="page"` on nav | `Navbar.tsx:30` | Add `aria-current="page"` to the active link |
| 17 | API routes lack input validation | All `POST` handlers | Add runtime validation (zod) before DB writes |
| 18 | Price section not responsive | `games/[id]/page.tsx:433-467` | Stack price row content vertically on small screens |
| 19 | Collection page duplicates card layout | `collection/page.tsx:304-354` | Refactor to use `GameCard` component with a `variant` prop |
| 20 | Client-rendered pages that should be server components | `discover`, `collection`, `stats` | Extract data fetching to server components; keep interactive parts as client islands |

### P2 — Nice to have (polish & maintainability)

| # | Issue | Location | Recommendation |
|---|-------|----------|----------------|
| 21 | Game detail page is 773 lines | `games/[id]/page.tsx` | Extract PriceSection, ReviewSection, PlayLogSection, GameInfoHeader into separate components |
| 22 | No data fetching cache | All client pages | Adopt SWR or React Query for deduplication and stale-while-revalidate |
| 23 | No pagination on browse | `discover/page.tsx` | Add "Load More" or pagination for browse results |
| 24 | DB files in git | `gamescout.db*` | Add `*.db`, `*.db-shm`, `*.db-wal` to `.gitignore` |
| 25 | No Prettier config | Project root | Add `.prettierrc` and format-on-save |
| 26 | Play log toggle doesn't show count | `collection/page.tsx:144` | Change to "📝 Play Logs (N)" |
| 27 | WebKit-only scrollbar styles | `globals.css:19-31` | Add `scrollbar-width: thin; scrollbar-color: #3f3f46 #18181b;` for Firefox |
| 28 | Search doesn't escape SQL wildcards | `games/route.ts:22` | Escape `%` and `_` in the search query parameter |
| 29 | No loading indicator on quiz submission | `quiz/page.tsx` | Add a spinner or skeleton while navigating to discover after quiz submit |
| 30 | `StarRating` renders dots not stars | `games/[id]/page.tsx:64-86` | Rename to `DotRating` or switch to actual star icons |
| 31 | Hardcoded strings (no i18n) | All files | Centralize user-facing strings into a constants file as a first step toward i18n |
| 32 | `fromQuiz` param unused effectively | `discover/page.tsx:44` | The ternary evaluates to the same value on both branches. Consider showing a "Welcome!" toast or auto-scrolling to recommendations |
| 33 | No `<title>` per page | All route pages | Add `metadata` exports to each page for proper tab titles |

---

## 7. Missing PRD Features — Implementation Roadmap

### Quick wins (< 1 day each)
1. Add `app/error.tsx` error boundary
2. Add `aria-label` to all icon-only buttons
3. Add skip-to-content link in layout
4. Create shared `types.ts` and deduplicate interfaces
5. Add `.gitignore` entries for SQLite files
6. Fix dead footer links (create stub pages)
7. Add per-page `<title>` metadata

### Medium effort (1–3 days each)
1. Quiz back button + localStorage persistence
2. Server-render game detail page (RSC refactor)
3. Add Vitest + first test suite for recommendation engine
4. Add zod validation to all API POST handlers
5. GitHub Actions CI (lint + typecheck + test)
6. Responsive price comparison section
7. Extract game detail page into sub-components
8. Focus trap for modals

### Large effort (1–2 weeks)
1. Authentication system (NextAuth or custom)
2. BGG collection import flow
3. Analytics instrumentation
4. Convert discover/collection/stats to server components with client islands
5. Data fetching layer with SWR/React Query
6. Full WCAG 2.2 AA accessibility audit and remediation

---

## 8. What's Done Well

Credit where due — these aspects are strong:

- **Visual design coherence.** The dark theme with emerald accents is consistent across every page. Card designs, spacing, and typography are polished.
- **Zero-config setup.** SQLite auto-seeds, no env vars needed. Best possible DX for first run.
- **Comprehensive seed data.** 55 real board games with real BGG data, descriptions, mechanics, categories, and mock prices. The data feels real.
- **Thoughtful empty states.** Every empty view (collection, wishlist, stats, search, recommendations) has a distinct icon, message, and CTA. This is better than most production apps.
- **Skeleton loading states.** `LoadingSkeleton.tsx` provides card grid and detail page skeletons. Loading feels intentional, not broken.
- **Recommendation engine with rationale.** The scoring system in `lib/recommendations.ts` produces genuinely useful "why" text. This is a key differentiator vs. generic top-lists.
- **Over-delivering on scope.** Play logging, reviews, and stats dashboard are all working despite being out of v1 scope. Shows good product instinct.
- **Clean README.** Accurate, complete, well-structured project documentation.
