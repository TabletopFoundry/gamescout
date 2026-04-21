# GameScout — Improvement Plan

> Analysis date: 2025 · Project: Next.js 16 + TypeScript + SQLite board game discovery app

---

## 1. Executive Summary

GameScout is a well-structured MVP with a solid feature set. The codebase demonstrates good patterns
(shared types, input sanitization, session security, accessibility foundations) but has room for
improvement in developer experience, documentation, and production readiness. Below are the 5
highest-impact changes:

1. **Fix all lint errors** — 4 ESLint errors and 1 warning blocked clean CI ✅ DONE
2. **Upgrade README to top-project quality** — badges, tables, quick start, architecture ✅ DONE
3. **Add CONTRIBUTING.md and .editorconfig** — clear contributor onboarding ✅ DONE
4. **Fix privacy page documentation drift** — cookie name was outdated ✅ DONE
5. **Accessibility fixes** — aria-hidden on decorative emojis, skeleton roles ✅ DONE

---

## 2. Current State Assessment

| Dimension              | Score (1-10) | Key Gap                                                |
| ---------------------- | ------------ | ------------------------------------------------------ |
| Language Modernity     | 8            | React 19 + Next.js 16 + TS strict; some React patterns outdated |
| Tooling & CI/CD        | 4            | No CI pipeline, no pre-commit hooks, no test framework |
| Type Safety            | 8            | Strict mode, shared types; some inline type duplication |
| Documentation          | 6            | README was functional but plain; no CONTRIBUTING       |
| Security Posture       | 6            | Session tokens good, sanitization present; no SBOM/scanning |
| Community Health       | 3            | No issue templates, no PR template, no CONTRIBUTING    |
| Discoverability        | 4            | No badges, no topic tags, no social preview            |

---

## 3. Changes Implemented

### ✅ Quick Wins (Completed)

#### 3.1 Fixed All ESLint Errors (0 errors now)

**Files changed:**
- `src/components/GameCard.tsx` — Removed `useEffect` syncing prop to state; use prop directly
- `src/app/quiz/page.tsx` — Replaced `useEffect` state init with `useState` lazy initializer
- `src/app/games/[id]/page.tsx` — Hoisted `loadCollectionStatuses` above its usage with `useCallback`
- `src/app/error.tsx` — Replaced `<a>` with `<Link>` for internal navigation
- `src/app/collection/page.tsx` — Removed unused `Game` import

**Impact:** Clean `npm run lint` enables future CI integration without blockers.

#### 3.2 Enhanced README

**File:** `README.md`

- Added badges (Next.js, TypeScript, Tailwind, SQLite, License)
- Converted features list to scannable table format
- Added "Quick Start" section (2-step setup)
- Added tech stack with links
- Added database schema table
- Added recommendation engine scoring breakdown
- Added available scripts table
- Added contributing and license sections

#### 3.3 Added Project Configuration Files

**Files created:**
- `CONTRIBUTING.md` — Development setup, architecture overview, PR workflow, commit conventions
- `.editorconfig` — Consistent formatting across editors (2-space indent, UTF-8, LF)

#### 3.4 Fixed Privacy Page Documentation Drift

**File:** `src/app/privacy/page.tsx`

- Updated cookie name from `gs_user_id` to `gs_session` to match actual implementation
- Updated description from "numeric identifier" to "opaque session token"

#### 3.5 Accessibility Improvements

**Files changed:**
- `src/components/EmptyState.tsx` — Added `aria-hidden="true"` to decorative emoji icon
- `src/components/TopGamesShowcase.tsx` — Added `aria-hidden="true"` to fallback emoji
- `src/components/LoadingSkeleton.tsx` — Added `role="status"` and `aria-label` to skeletons
- `src/app/page.tsx` — Added `aria-hidden="true"` to highlight section emojis

#### 3.6 Enhanced AGENTS.md

**File:** `AGENTS.md`

- Added project overview, key conventions, and command reference for AI assistants
- Documented the React 19 `setState`-in-effect rule to prevent future regressions

#### 3.7 Improved .gitignore

**File:** `.gitignore`

- Added IDE directories (.vscode, .idea), OS files (.DS_Store), debug logs, env variants

#### 3.8 Enhanced SEO Metadata

**File:** `src/app/layout.tsx`

- Added title template for child pages
- Added keywords meta tag
- Added OpenGraph metadata

---

## 4. Recommended Next Steps

### Medium Effort (1 day – 1 week)

#### 4.1 Add GitHub Actions CI Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

#### 4.2 Add Testing Framework

Install Vitest + React Testing Library:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Priority test targets:
1. `src/lib/recommendations.ts` — Unit test scoring algorithm
2. `src/lib/sanitize.ts` — Unit test XSS prevention
3. `src/lib/db.ts` — Integration test schema + seeding
4. API routes — Integration tests for CRUD operations

#### 4.3 Add Issue & PR Templates

Create `.github/ISSUE_TEMPLATE/bug_report.yml` and `.github/pull_request_template.md`.

#### 4.4 Server-Side Rendering for Game Detail Pages

The game detail page (`src/app/games/[id]/page.tsx`) is currently client-rendered, which hurts
SEO and shareability. Convert to server component with client sub-components:

```tsx
// src/app/games/[id]/page.tsx — server component
export async function generateMetadata({ params }) {
  const game = getGameById(params.id);
  return { title: game.name, description: game.description };
}

export default async function GameDetailPage({ params }) {
  const data = await loadGameData(params.id);
  return <GameDetailClient data={data} />;
}
```

#### 4.5 Add `not-found.tsx` Pages

Create custom 404 pages for better UX:
- `src/app/not-found.tsx` — Global 404
- `src/app/games/[id]/not-found.tsx` — Game-specific 404

### Strategic Investments (> 1 week)

#### 4.6 Authentication System

Replace the demo single-user model with proper auth:
- NextAuth.js or Clerk for OAuth / magic link login
- Per-user collections, play logs, and reviews
- User profile pages

#### 4.7 BGG API Integration

Import games from BoardGameGeek API:
- Search BGG by name to add games not in the seed catalog
- Import user collections from BGG
- Sync BGG ratings and rank data

#### 4.8 Performance Optimization

- Add database indexes on frequently-queried columns
- Implement pagination for large result sets
- Add Redis/in-memory caching for recommendation scores
- Move filtering logic from client-side to SQL queries

---

## 5. GitHub Project Health Checklist

```
Repository Basics:
[x] Descriptive README with quick start
[ ] LICENSE file
[x] CONTRIBUTING.md
[ ] Issue templates
[ ] PR template
[ ] CODEOWNERS

Automation:
[ ] CI running on PRs
[x] ESLint configured (0 errors)
[ ] Automated testing
[ ] Dependency updates (Dependabot)
[ ] Release automation
[ ] Security scanning

Documentation:
[ ] API docs
[x] Architecture in README
[ ] Changelog
[ ] Architecture Decision Records (ADRs)

Community:
[ ] Good first issues labeled
[ ] Discussion forum or chat
[ ] Social preview image (1280×640)
[ ] Repository topic tags

Code Quality:
[x] TypeScript strict mode
[x] Input sanitization
[x] Session security (opaque tokens)
[x] Accessibility foundations (skip link, aria-current, focus-visible)
[x] Error boundaries
[x] Loading skeletons
```

---

## 6. 90-Day Roadmap

### Days 1–7: Foundation ✅ (Partially Complete)

- [x] Fix all lint errors
- [x] Enhanced README with badges and structure
- [x] CONTRIBUTING.md
- [x] .editorconfig
- [x] Accessibility fixes
- [ ] Add LICENSE file (MIT recommended)
- [ ] Add GitHub Actions CI (lint + build)
- [ ] Add issue templates and PR template

### Days 8–30: Testing & Quality

- [ ] Set up Vitest testing framework
- [ ] Write unit tests for recommendation engine and sanitization
- [ ] Write API integration tests
- [ ] Add Dependabot configuration
- [ ] Convert game detail page to SSR for SEO
- [ ] Add custom 404 pages
- [ ] Add Prettier for consistent formatting

### Days 31–60: Features & Polish

- [ ] Add database indexes for performance
- [ ] Implement proper pagination
- [ ] Add `loading.tsx` files for streaming SSR
- [ ] Create API documentation
- [ ] Add dark/light theme toggle
- [ ] Implement BGG search integration

### Days 61–90: Community & Growth

- [ ] Add authentication system
- [ ] Create social preview image
- [ ] Write architecture decision records
- [ ] Set up Discussions on GitHub
- [ ] Tag "good first issues"
- [ ] Submit to awesome-nextjs list
