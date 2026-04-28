# Code Quality & Architecture Review — GameScout (Third Pass)

**Date:** 2025-07-26  
**Reviewer:** Principal Software Engineer (automated review)  
**Scope:** Full codebase — `02-gamescout/src/` (Next.js 16 + better-sqlite3 + Tailwind v4)  
**Baseline:** Compared against `docs/CODE_REVIEW.md` (2025-07-17) and `docs/CODE_REVIEW_2.md` (2025-07-25). Only **genuinely new** P0/P1 findings are listed.

---

## Executive Summary

| Dimension              | CODE_REVIEW | CODE_REVIEW_2 | Current       |
|------------------------|-------------|---------------|---------------|
| Overall Quality Score  | B           | B+            | **A-**        |
| Architecture Health    | Good        | Good+         | **Good+**     |
| Maintainability Index  | Medium      | Medium-High   | **Medium-High**|
| Technical Debt         | Medium      | Low-Medium    | **Low-Medium** |

Every P0 from both prior reviews is now resolved. The quiz input validation, session expiration, `removeItem()` error handling, date validation, and price validation are all fixed. The `useMemo` deduplication for quiz persistence is applied. The codebase is in strong shape.

**This review surfaces 0 new P0 findings and 3 new P1 findings.**

---

## Resolved Items from CODE_REVIEW_2

| ID | Status | Notes |
|-------------|--------|-------|
| P0-NEW-1 (Quiz arbitrary ratings) | ✅ **Fixed** | `VALID_RATINGS` + `VALID_PREF_KEYS` sets in `quiz/route.ts:42-43` |
| P0-NEW-2 (Session tokens never expire) | ✅ **Fixed** | `expires_at` column + `datetime('now')` check in `session.ts:33` |
| P1-NEW-1 (`removeItem()` swallows errors) | ✅ **Fixed** | `res.ok` check + `setTimedError()` in `collection/page.tsx:95-99` |
| P1-NEW-2 (Negative `targetPrice`) | ✅ **Fixed** | `typeof targetPrice !== "number" || targetPrice <= 0` in `price-alerts/route.ts:46` |
| P1-NEW-3 (`playedAt` accepts garbage) | ✅ **Fixed** | Regex + `Date.parse` guard in `play-logs/route.ts:90-93` |
| P1-NEW-4 (`PlayLogSection` 16 props) | ⚠️ **Still open** | 16 props unchanged — see tracked items |
| P1-NEW-5 (Double `loadPersistedState`) | ✅ **Fixed** | `useMemo` + flat `useState` in `quiz/page.tsx:167-169` |

---

## New Findings — P0 (Must Address)

None. 🎉

---

## New Findings — P1

### P1-3-1: CSP `strict-dynamic` Without Nonces Negates `'self'` — Scripts May Break or Be Mispermissioned

**File:** `next.config.ts:28`  
**Severity:** 🟠 Security / Correctness  

The Content-Security-Policy sets `script-src 'self' 'strict-dynamic'`. Per the [CSP Level 3 spec](https://www.w3.org/TR/CSP3/#strict-dynamic-usage), when `'strict-dynamic'` is present, source-list fallbacks like `'self'` are **ignored** in supporting browsers. This means:

1. If Next.js injects nonces into `<script>` tags (which it does in production), `'strict-dynamic'` propagates trust to dynamically loaded scripts — this works but makes `'self'` misleading dead code in the policy.
2. If any non-nonce'd first-party script is loaded via a regular `<script src="/foo.js">` tag, it will be **blocked** because `'self'` is ignored.
3. The developer likely intended `'self'` as a safeguard, but it provides no protection when `'strict-dynamic'` is present.

```typescript
// next.config.ts:28
"script-src 'self' 'strict-dynamic'",
// ← 'self' is ignored per CSP3 when 'strict-dynamic' is present
```

**Impact:** Confusing security posture — the policy appears restrictive but behaves differently than written. Any future non-framework scripts added via `<script>` tags will fail silently.

**Fix:** Either rely solely on `'strict-dynamic'` (remove `'self'`) and document that all scripts must flow through Next.js nonce propagation, or drop `'strict-dynamic'` and use `'self'` with explicit hashes for inline scripts:

```typescript
// Option A: Embrace strict-dynamic (recommended for Next.js)
"script-src 'strict-dynamic'",
// + add 'unsafe-inline' as a CSP2 fallback for older browsers:
"script-src 'strict-dynamic' 'unsafe-inline' https:",

// Option B: Drop strict-dynamic, use self only
"script-src 'self'",
```

---

### P1-3-2: Unbounded Anonymous User + Session Creation — DoS / DB Growth Vector

**File:** `src/lib/session.ts:42-54`  
**Severity:** 🟠 Data Integrity / Availability  

Every request without a valid session cookie creates a new row in **both** the `users` and `sessions` tables. There is no rate limiting, CAPTCHA, or maximum-user guard. An attacker (or even a misbehaving crawler) can spray unauthenticated requests to create millions of rows:

```typescript
// session.ts:42-54 — runs on EVERY request without a valid cookie
const result = db
  .prepare(`INSERT INTO users (username, created_at) VALUES (@username, datetime('now'))`)
  .run({ username: `user_${Date.now()}` });  // ← new user every time

const token = crypto.randomUUID();
db.prepare(
  `INSERT INTO sessions (token, user_id, created_at, expires_at) ...`
).run({ token, userId });
```

**Impact:** Unbounded SQLite growth, eventually degrading write performance (WAL file bloat). The `user_${Date.now()}` username could also collide under high concurrency since `Date.now()` has millisecond resolution — though the UNIQUE constraint on `username` would cause a 500 error rather than silent corruption.

**Distinct from P2-10 (rate limiting):** P2-10 is about API abuse in general; this finding is about the specific creation-without-bound pattern that amplifies the impact of no rate limiting.

**Fix (short-term):** Add a session-creation rate limit keyed by IP, using a simple in-memory window or middleware:

```typescript
// Lightweight in-memory rate limit for session creation
const SESSION_CREATION_WINDOW = 60_000; // 1 minute
const MAX_SESSIONS_PER_WINDOW = 5;
const sessionCreationLog = new Map<string, number[]>();

function canCreateSession(ip: string): boolean {
  const now = Date.now();
  const log = sessionCreationLog.get(ip) ?? [];
  const recent = log.filter(t => now - t < SESSION_CREATION_WINDOW);
  if (recent.length >= MAX_SESSIONS_PER_WINDOW) return false;
  recent.push(now);
  sessionCreationLog.set(ip, recent);
  return true;
}
```

**Fix (long-term):** Add a `Date.now()` collision guard (e.g., append random suffix to username), and implement periodic cleanup of expired sessions + orphaned users:

```sql
DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days');
DELETE FROM users WHERE id NOT IN (SELECT DISTINCT user_id FROM sessions);
```

---

### P1-3-3: Collection Page Duplicates `GameCard` Rendering Inline — 70-Line Code Clone

**File:** `src/app/collection/page.tsx:346-415`  
**Severity:** 🟠 Maintainability / DRY Violation  

The collection page renders a custom card layout inline (~70 lines) that duplicates 80% of what `GameCard.tsx` already provides: image with fallback, title, year, rating badge, gradient overlay, hover effects, and complexity label. The only additions are the "Owned"/"Wishlist" badge and the "Move to Owned" / "Remove" buttons.

**Collection page inline card (lines 346-415):**
```tsx
<div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 ...">
  <Link href={`/games/${game.id}`}>
    <div className="relative h-48 overflow-hidden bg-zinc-800">
      {!imgErrors[game.id] ? (
        <Image src={game.thumbnail_url} alt={game.name} fill ... />
      ) : (
        <div ...>🎲</div>
      )}
      {/* gradient overlay, badge, etc. */}
    </div>
    <div className="p-3">
      <h3 ...>{game.name}</h3>
      <p ...>Added {new Date(addedAt).toLocaleDateString()}</p>
      <div ...>★ {game.bgg_rating.toFixed(1)} · {players}</div>
    </div>
  </Link>
  {/* action buttons */}
</div>
```

**Contrast with `GameCard.tsx` (lines 64-170):** Nearly identical structure — same class names, same image fallback pattern, same rating badge placement, same link wrapping pattern.

**Impact:** Any visual change to game cards (e.g., new badge placement, updated hover effect, accessibility improvement) must be made in two places. The collection page card also **omits** the complexity label and category tags that `GameCard` shows, creating an inconsistent UX.

**Fix:** Extend `GameCard` with optional props for the collection-specific features:

```tsx
interface GameCardProps {
  game: Game;
  reason?: string;
  collectionStatus?: CollectionStatus;
  onCollectionChange?: (gameId: number, status: CollectionStatus) => void;
  size?: "sm" | "md" | "lg";
  // New optional props for collection view
  addedAt?: string;             // Show "Added ..." instead of year
  onRemove?: (gameId: number) => void;    // Show remove button
  onMoveToOwned?: (gameId: number) => void; // Show move button (wishlist items)
  removing?: boolean;           // Disable remove button while pending
}
```

Then the collection page grid becomes:

```tsx
{sortedItems.map(({ game, status, addedAt }) => (
  <GameCard
    key={game.id}
    game={game}
    collectionStatus={status}
    addedAt={addedAt}
    onRemove={(id) => setConfirmRemove({ gameId: id, gameName: game.name })}
    onMoveToOwned={status === "wishlist" ? moveToOwned : undefined}
    removing={removing[game.id]}
  />
))}
```

This eliminates ~70 lines of duplicated rendering logic and ensures visual consistency.

---

## Previously Reported Items — Status Tracker

### From CODE_REVIEW (2025-07-17)

| ID | Summary | Previous Status | Current Status |
|----|---------|-----------------|----------------|
| P0-1 | IDOR session vulnerability | ✅ Fixed (R2) | ✅ Fixed |
| P0-2 | SQL injection pattern | ✅ Fixed (R2) | ✅ Fixed |
| P0-3 | LIKE wildcard injection | ✅ Fixed (R2) | ✅ Fixed |
| P0-4 | Stored XSS | ✅ Fixed (R2) | ✅ Fixed |
| P1-1 | God Components | ✅ Fixed (R2) | ✅ Fixed |
| P1-2 | Duplicate types | ✅ Fixed (R2) | ✅ Fixed |
| P1-3 | `SELECT *` | ✅ Fixed (R2) | ✅ Fixed |
| P1-4 | Fetch-all similar games | ✅ Fixed (R2) | ✅ Fixed |
| P1-5 | Silent mutation errors | ✅ Fixed (R2) | ✅ Fixed |
| **P1-6** | **No test coverage** | ⚠️ Open | ⚠️ **Still open** |
| P1-7 | DB files in repo | ✅ Fixed (R2) | ✅ Fixed |
| P2-1 | Hardcoded `QUIZ_GAMES` | ⚠️ Open | ⚠️ Still open |
| P2-2 | Magic numbers in scoring | ⚠️ Open | ⚠️ Still open |
| P2-3 | Inconsistent fetch error handling | ⚠️ Partial | ⚠️ Partial (`discover/page.tsx:72` still uses `console.error`) |
| P2-6 | `useEffect` missing deps | ⚠️ Open | ✅ **Fixed** — `discover/page.tsx` initial `useEffect` (line 39) correctly uses `[]` since `load`/`loadColl` are local closures |
| **P2-7** | **Dead ternary** `fromQuiz ? "recommended" : "recommended"` | ⚠️ Open | ⚠️ **Still open** (`discover/page.tsx:16-17`) |
| P2-10 | No rate limiting on APIs | ⚠️ Open | ⚠️ Still open |

### From CODE_REVIEW_2 (2025-07-25)

| ID | Summary | Current Status |
|----|---------|----------------|
| P0-NEW-1 | Quiz arbitrary ratings | ✅ Fixed |
| P0-NEW-2 | Session never expires | ✅ Fixed |
| P1-NEW-1 | `removeItem()` errors | ✅ Fixed |
| P1-NEW-2 | Negative `targetPrice` | ✅ Fixed |
| P1-NEW-3 | `playedAt` garbage dates | ✅ Fixed |
| **P1-NEW-4** | **PlayLogSection 16 props** | ⚠️ **Still open** — also applies to `PriceComparison` (11 props) and `ReviewSection` (9 props) |
| P1-NEW-5 | Double `loadPersistedState()` | ✅ Fixed |

---

## Refactoring Roadmap (New Items Only)

### High Impact, Low Effort
1. **Fix dead ternary** (P2-7, third review still open) — `discover/page.tsx:16-17`, one-line fix (~2 min)

### High Impact, Medium Effort
2. **Reuse `GameCard` in collection page** (P1-3-3) — Extend `GameCard` props, delete ~70 lines of inline card rendering (~1-2 hours)
3. **Fix CSP `strict-dynamic` / `'self'` conflict** (P1-3-1) — Update `next.config.ts`, verify scripts still load (~30 min)

### Medium Impact, Medium Effort
4. **Add session-creation rate limiting** (P1-3-2) — In-memory IP-based window or middleware (~1-2 hours)
5. **Add expired session + orphaned user cleanup** (P1-3-2) — Periodic SQL cleanup job (~1 hour)

### Previously Recommended, Still Outstanding
6. **Internalize form state in sub-components** (P1-NEW-4 from R2) — `PlayLogSection`, `PriceComparison`, `ReviewSection` own their form state (~2-3 hours)
7. **Add test coverage** (P1-6 from R1) — Install vitest, add API route + recommendation engine tests (~4-8 hours)

---

## Positive Observations (New Since Last Review)

1. **All prior P0s resolved:** IDOR, SQL patterns, XSS, wildcard injection, session expiration, quiz validation — every critical security and data integrity finding has been addressed. This is excellent remediation velocity.

2. **Input validation significantly improved:** Quiz ratings use a server-side allowlist (`VALID_RATINGS`, `VALID_PREF_KEYS`). Play log dates are regex + `Date.parse` validated. Price alerts check for positive numbers with `typeof`. This is now a well-validated API surface.

3. **Session management is solid:** Opaque `crypto.randomUUID()` tokens, `expires_at` column with 30-day TTL, `httpOnly` + `sameSite: lax` + `secure` in production. The `sessions` table schema is clean.

4. **Quiz persistence deduplication:** The `useMemo(() => loadPersistedState(), [])` pattern avoids double-parsing localStorage. Clean implementation.

5. **Error handling consistency improved:** `setTimedError()` pattern with `useRef`-based timer cleanup is used consistently in `collection/page.tsx`, `games/[id]/page.tsx`, and `GameCard.tsx`. The `errorTimerRef` + `useEffect` cleanup prevents memory leaks.

6. **Proper abort handling everywhere:** Every `fetch` call passes an `AbortController` signal, and cleanup functions abort on unmount. The `DOMException` name check pattern (`e.name === "AbortError"`) is applied consistently across all pages.

7. **Email validation on price alerts:** `price-alerts/route.ts:50` adds regex validation for the optional email field — a thoughtful addition that wasn't in the prior review.

---

## Metrics Comparison

| Metric | CODE_REVIEW | CODE_REVIEW_2 | Current | Trend |
|--------|-------------|---------------|---------|-------|
| P0 Issues Open | 4 | 2 | **0** | ✅ All clear |
| P1 Issues Open | 7 | 5 | **5** (2 legacy + 3 new) | ➡️ Stable |
| Max Component Lines | 751 | 419 | 447 (discover) | ➡️ Stable |
| Max useState/Component | 15 | 12 | 19 (game detail) | ⚠️ Increased (form state) |
| API Input Validation | Partial | Partial (quiz gap) | **Complete** | ✅ Fixed |
| Session Security | Forgeable | Expiration missing | **Solid** | ✅ Fixed |
| Test Coverage | 0% | 0% | 0% | ⚠️ Unchanged |
| Code Duplication | Moderate | Low-Moderate | Low-Moderate (1 clone) | ⚠️ New clone found |

---

*End of third review. 0 P0 findings, 3 new P1 findings. Total estimated remediation for new items: ~4-5 hours.*
