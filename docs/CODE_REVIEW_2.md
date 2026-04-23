# Code Quality & Architecture Review — GameScout (Follow-Up)

**Date:** 2025-07-25  
**Reviewer:** Principal Software Engineer (automated review)  
**Scope:** Full codebase — `02-gamescout/src/` (Next.js 16 + better-sqlite3 + Tailwind v4)  
**Baseline:** Compared against `docs/CODE_REVIEW.md` (2025-07-17). Only **genuinely new** P0/P1 findings are listed.

---

## Executive Summary

| Dimension              | Previous | Current       |
|------------------------|----------|---------------|
| Overall Quality Score  | B        | **B+**        |
| Architecture Health    | Good     | **Good+**     |
| Maintainability Index  | Medium   | **Medium-High**|
| Technical Debt         | Medium   | **Low-Medium** |

Significant remediation has occurred since the first review. The IDOR vulnerability (P0-1) is fixed with opaque session tokens, XSS is mitigated via `sanitize.ts`, God Components are decomposed into `_components/`, `SELECT *` is replaced with explicit column constants, and mutation error handling has been added throughout. The codebase is in meaningfully better shape.

**This review surfaces only issues that are net-new or materially changed since the first review.**

---

## Resolved Items from CODE_REVIEW.md

| Original ID | Status | Notes |
|-------------|--------|-------|
| P0-1 (IDOR session) | ✅ **Fixed** | `session.ts` now uses `crypto.randomUUID()` + `sessions` table |
| P0-2 (SQL injection pattern) | ✅ **Fixed** | Safety comment added, uses `GAME_COLUMNS` constant |
| P0-3 (LIKE wildcard injection) | ✅ **Fixed** | `games/route.ts` now escapes `%`, `_`, `\` with `ESCAPE '\\'` |
| P0-4 (Stored XSS) | ✅ **Fixed** | `sanitizeText()` applied on reviews, play log winner/notes |
| P1-1 (God Components) | ✅ **Fixed** | Pages decomposed: 751→343 (game detail), 620→357 (quiz), 526→247 (stats) |
| P1-2 (Duplicate types) | ✅ **Fixed** | Shared types in `src/types/index.ts`; `StatsCollectionItem` is page-local (acceptable) |
| P1-3 (`SELECT *`) | ✅ **Fixed** | `GAME_COLUMNS` and `GAME_LIST_COLUMNS` used everywhere |
| P1-4 (Fetch-all similar games) | ✅ **Fixed** | `games/[id]/route.ts` now uses SQL `json_each` for similarity |
| P1-5 (Silent mutation errors) | ✅ **Fixed** | `mutationError` state + toast pattern in game detail, collection pages |
| P1-7 (DB files in repo) | ✅ **Fixed** | `.gitignore` covers `*.db*`, files not tracked |
| P2-7 (Dead ternary) | ⚠️ **Still present** | `discover/page.tsx:16-17` — `fromQuiz ? "recommended" : "recommended"` |

---

## New Findings — P0 (Must Address)

### P0-NEW-1: Quiz API Accepts Arbitrary `rating` Values — No Server-Side Validation

**File:** `src/app/api/quiz/route.ts:34-40`  
**Severity:** 🔴 Data Integrity / Potential Injection  

The quiz POST endpoint blindly stores whatever `rating` string the client sends. The DB column has no CHECK constraint, and the server performs zero validation on the `rating` value.

```typescript
// Current — trusts client-provided rating string
const upsertGameRating = db.prepare(`
  INSERT INTO quiz_answers (user_id, game_id, rating)
  VALUES (@userId, @gameId, @rating)
  ON CONFLICT(user_id, game_id) DO UPDATE SET rating = excluded.rating
`);
// ... loops over gameRatings without validating gr.rating
```

An attacker can POST `{"gameRatings": [{"gameId": 1, "rating": "'; DROP TABLE games; --"}]}`. While `better-sqlite3` parameterizes, the invalid rating value (`"anything"`) will be stored and later cast via `RATING_SCORES[ans.rating as RatingValue]` in `recommendations.ts:65`, silently producing `undefined ?? 0` — corrupting the recommendation engine's scoring.

Similarly, the `preference_key` and `preference_value` fields are unvalidated, allowing arbitrary keys to be stored.

**Impact:** Corrupted taste profiles, recommendation engine producing nonsensical results, and unbounded data growth if arbitrary keys are inserted.

**Fix:**
```typescript
const VALID_RATINGS = new Set(["loved", "liked", "neutral", "disliked", "havent_played"]);
const VALID_PREF_KEYS = new Set(["player_count", "duration", "complexity", "themes"]);

if (gameRatings) {
  for (const gr of gameRatings) {
    if (!Number.isInteger(gr.gameId) || gr.gameId <= 0) continue;
    if (!VALID_RATINGS.has(gr.rating)) continue;
    upsertGameRating.run({ userId, gameId: gr.gameId, rating: gr.rating });
  }
}
if (preferences) {
  for (const pref of preferences) {
    if (!VALID_PREF_KEYS.has(pref.key)) continue;
    if (typeof pref.value !== "string" || pref.value.length > 200) continue;
    upsertPref.run({ userId, key: pref.key, value: pref.value });
  }
}
```

---

### P0-NEW-2: Session Tokens Never Expire — Unlimited Session Lifetime

**File:** `src/lib/session.ts:37-47`  
**Severity:** 🟡 Security  

The `sessions` table has no expiration column, and the cookie is set with `maxAge: 365 days`. Once created, a session token is valid forever — there is no mechanism to invalidate or rotate it. If a token is stolen (e.g., via XSS in a future non-React rendering context, or shared browser), the attacker has permanent access.

```typescript
// sessions table has no expires_at column
// Cookie: maxAge: 60 * 60 * 24 * 365 — one year, never rotated
```

**Fix (short-term):** Add an `expires_at` column to the `sessions` table. Check expiration in `getUserId()`:
```typescript
const session = db
  .prepare(`SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')`)
  .get(token);
```

**Fix (long-term):** Implement session rotation — issue a new token on each request or after a fixed interval (e.g., 24 hours), invalidating the old one.

---

## New Findings — P1

### P1-NEW-1: `removeItem()` in Collection Page Silently Swallows Errors

**File:** `src/app/collection/page.tsx:65-73`  
**Severity:** 🟠 Correctness  

While `moveToOwned()` and `deletePlayLog()` were fixed with proper try/catch + user error feedback, the `removeItem()` function still has no error handling. If the DELETE request fails, the item is optimistically removed from state but the server still has it — a silent data inconsistency.

```typescript
async function removeItem(gameId: number) {
  setRemoving((prev) => ({ ...prev, [gameId]: true }));
  try {
    await fetch(`/api/collection?gameId=${gameId}`, { method: "DELETE" });
    // ← No res.ok check! Silently removes from UI even on 500
    setItems((prev) => prev.filter((i) => i.game.id !== gameId));
  } finally {
    setRemoving((prev) => ({ ...prev, [gameId]: false }));
  }
}
```

**Fix:**
```typescript
async function removeItem(gameId: number) {
  setRemoving((prev) => ({ ...prev, [gameId]: true }));
  try {
    const res = await fetch(`/api/collection?gameId=${gameId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to remove");
    setItems((prev) => prev.filter((i) => i.game.id !== gameId));
  } catch {
    setMutationError("Failed to remove game. Please try again.");
    setTimeout(() => setMutationError(null), 3000);
  } finally {
    setRemoving((prev) => ({ ...prev, [gameId]: false }));
  }
}
```

---

### P1-NEW-2: Price Alert Accepts Negative or Zero `targetPrice`

**File:** `src/app/api/price-alerts/route.ts:31-35`  
**Severity:** 🟠 Data Integrity  

The price alert endpoint validates that `gameId` and `targetPrice` are truthy, but `targetPrice` can be negative or zero (since `!0` is true, zero is already rejected — but negative values pass). A user can set a target price of `-1`, which will never trigger and pollutes the database.

```typescript
if (!gameId || !targetPrice) {
  return Response.json({ error: "gameId and targetPrice required" }, { status: 400 });
}
// ← No check: targetPrice could be -50
```

**Fix:**
```typescript
if (!gameId || typeof targetPrice !== "number" || targetPrice <= 0) {
  return Response.json({ error: "gameId and a positive targetPrice are required" }, { status: 400 });
}
```

---

### P1-NEW-3: Play Log `playedAt` Date Not Validated — Accepts Arbitrary Strings

**File:** `src/app/api/play-logs/route.ts:79-81`  
**Severity:** 🟠 Data Integrity  

The play log POST endpoint checks only that `playedAt` is truthy, but it accepts any string — including `"banana"`, `"2099-13-45"`, or extremely long strings. This corrupts the `played_at` column and breaks the month aggregation logic in the GET handler (`log.played_at.slice(0, 7)`).

```typescript
if (!gameId || !playedAt) {
  return Response.json({ error: "gameId and playedAt required" }, { status: 400 });
}
// ← "banana" passes validation and is stored as played_at
```

**Fix:**
```typescript
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!gameId || !playedAt || !dateRegex.test(playedAt) || isNaN(Date.parse(playedAt))) {
  return Response.json({ error: "gameId and valid playedAt date (YYYY-MM-DD) required" }, { status: 400 });
}
```

---

### P1-NEW-4: `PlayLogSection` Props Interface Has 16 Props — Excessive Prop Drilling

**File:** `src/app/games/[id]/_components/PlayLogSection.tsx:6-23`  
**Severity:** 🟠 Maintainability  

The `PlayLogSection` component accepts **16 individual props**, of which 11 are form-field state + callbacks that are drilled one-by-one from the parent. This is a form state management smell — the parent owns all form state but the child renders it.

```typescript
interface PlayLogSectionProps {
  playLogs: GamePlayLog[];
  gameName: string;
  showLogForm: boolean;
  logDate: string;           // ← form field
  logPlayers: string;        // ← form field
  logWinner: string;         // ← form field
  logRating: string;         // ← form field
  logNotes: string;          // ← form field
  logSubmitting: boolean;
  onShowLogForm: (show: boolean) => void;
  onLogDateChange: (value: string) => void;   // ← callback
  onLogPlayersChange: (value: string) => void; // ← callback
  onLogWinnerChange: (value: string) => void;  // ← callback
  onLogRatingChange: (value: string) => void;  // ← callback
  onLogNotesChange: (value: string) => void;   // ← callback
  onSubmitLog: () => void;
}
```

**Fix:** Move form state ownership into `PlayLogSection` itself. The parent only needs to know about the submit action and its result:

```typescript
interface PlayLogSectionProps {
  playLogs: GamePlayLog[];
  gameName: string;
  gameId: number;
  onPlayLogged: () => void; // callback after successful submit
}
```

The same pattern applies to `PriceComparison` (11 props) and to a lesser extent `ReviewSection` (9 props). Each form-modal component should own its own form state internally and only call back on success.

---

### P1-NEW-5: `loadPersistedState()` Called Twice During Quiz Page Initialization

**File:** `src/app/quiz/page.tsx:167-174`  
**Severity:** 🟡 Performance (minor)  

Two separate `useState` initializers each call `loadPersistedState()`, which parses the same `localStorage` JSON twice on mount:

```typescript
const [step, setStep] = useState(() => {
  const saved = loadPersistedState();  // ← parse #1
  return saved ? saved.step : 0;
});
const [quizState, setQuizState] = useState<QuizState>(() => {
  const saved = loadPersistedState();  // ← parse #2 (redundant)
  return saved ? saved.quizState : DEFAULT_QUIZ_STATE;
});
```

**Fix:** Parse once and share:
```typescript
const persisted = useMemo(() => loadPersistedState(), []);
const [step, setStep] = useState(persisted?.step ?? 0);
const [quizState, setQuizState] = useState<QuizState>(persisted?.quizState ?? DEFAULT_QUIZ_STATE);
```

(Note: `useMemo` is fine here since `loadPersistedState` is synchronous and only runs on the client.)

---

## Previously Reported Items Still Outstanding (Tracked, Not New)

These were identified in CODE_REVIEW.md and remain unresolved. They are **not** counted as new findings but are tracked for completeness:

| Original ID | Summary | Status |
|-------------|---------|--------|
| P1-6 | No test coverage (0 tests, no test runner) | ⚠️ Still open |
| P2-1 | Hardcoded `QUIZ_GAMES` data in quiz page | ⚠️ Still open |
| P2-2 | Magic numbers in recommendation scoring | ⚠️ Still open |
| P2-3 | Inconsistent fetch error handling patterns | Partially fixed — game detail, collection have `mutationError`; discover page `loadCollection` still uses `console.error` only (line 69) |
| P2-6 | `useEffect` missing deps in discover page | ⚠️ Still open (line 37-40) |
| P2-7 | Dead ternary `fromQuiz ? "recommended" : "recommended"` | ⚠️ Still open (line 16-17) |
| P2-10 | No rate limiting on API routes | ⚠️ Still open |

---

## Refactoring Roadmap (New Items Only)

### High Impact, Low Effort
1. **Validate quiz ratings server-side** (P0-NEW-1) — Allowlist `VALID_RATINGS` + `VALID_PREF_KEYS` (~30 min)
2. **Fix `removeItem()` error handling** (P1-NEW-1) — Add `res.ok` check + error toast (~10 min)
3. **Validate `playedAt` date format** (P1-NEW-3) — Regex + `Date.parse` check (~15 min)
4. **Validate `targetPrice` is positive** (P1-NEW-2) — One-line guard (~5 min)
5. **Fix dead ternary** (P2-7, still open) — One-line fix (~5 min)
6. **Deduplicate `loadPersistedState` calls** (P1-NEW-5) — Lift to single `useMemo` (~10 min)

### High Impact, Medium Effort
7. **Add session expiration** (P0-NEW-2) — Add `expires_at` column + migration + check in `getUserId()` (~1-2 hours)

### Medium Impact, Medium Effort
8. **Internalize form state in sub-components** (P1-NEW-4) — `PlayLogSection`, `PriceComparison`, `ReviewSection` own their form state (~2-3 hours)

---

## Positive Observations (New Since Last Review)

1. **Excellent decomposition**: God Components are gone. `games/[id]/page.tsx` dropped from 751 to 343 lines with clean sub-components (`GameHero`, `PriceComparison`, `PlayLogSection`, `ReviewSection`, `StarRating`). Quiz page dropped from 620 to 357 lines. Stats page dropped from 526 to 247 lines with `dynamic(() => import(...))` for chart code-splitting.

2. **SQL-based similarity**: The `json_each` approach for similar games (`games/[id]/route.ts:44-53`) is an elegant SQLite solution that replaces the O(n) JS approach. Well done.

3. **Charts code-split with `next/dynamic`**: `StatsCharts` is lazy-loaded with `ssr: false`, keeping the initial bundle small. The loading placeholder matches the chart grid layout.

4. **Confirmation dialogs**: Destructive actions (collection removal, play log deletion) now use `ConfirmDialog` with proper focus management, Escape key handling, and focus trap. This is a meaningful UX and a11y improvement.

5. **Focus management in modals**: Both `PlayLogSection` and `ConfirmDialog` implement proper focus traps with Shift+Tab wrapping and focus restoration to trigger element on close.

6. **`GAME_COLUMNS` / `GAME_LIST_COLUMNS` pattern**: Clean column list constants co-located with type definitions. The `GAME_LIST_COLUMNS` properly excludes `description` for listing views.

7. **Sanitization convention codified**: `AGENTS.md` documents the `sanitize.ts` requirement, ensuring future contributors follow the pattern.

8. **Accessible data tables for screen readers**: Each Recharts visualization in `StatsCharts.tsx` includes a hidden `<table>` with `<caption>` for screen reader users — this is above-average chart accessibility.

---

## Metrics Comparison

| Metric | CODE_REVIEW | Current | Trend |
|--------|------------|---------|-------|
| Max Component Lines | 751 | 419 (collection) | ✅ Improved |
| Max State Variables/Component | 15 | 12 (game detail) | ✅ Improved |
| Sub-component Extraction | 0 | 11 `_components/` | ✅ Improved |
| `SELECT *` Usage | 6 locations | 0 | ✅ Fixed |
| Mutation Error Handling | 0/5 | 4/5 | ✅ Mostly fixed |
| Test Coverage | 0% | 0% | ⚠️ Unchanged |
| API Input Validation | Partial | Partial (quiz gap) | ⚠️ New gap found |

---

*End of follow-up review. 3 P0 findings, 5 P1 findings. Total estimated remediation: ~5 hours.*
