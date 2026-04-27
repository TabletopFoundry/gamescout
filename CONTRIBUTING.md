# Contributing to GameScout

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

### Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/gamescout.git
cd gamescout

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database is created and seeded automatically on first run.

### Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start development server             |
| `npm run build`     | Production build                     |
| `npm run start`     | Start production server              |
| `npm run lint`      | Run ESLint (Next.js + TypeScript)    |
| `npm run lint:types`| Run TypeScript type-checking         |
| `npm run check`     | Run both lint and type check         |

## Project Architecture

```
src/
├── app/               # Next.js App Router pages and API routes
│   ├── api/           # REST API endpoints (collection, games, quiz, etc.)
│   ├── games/[id]/    # Game detail page with sub-components
│   ├── quiz/          # Taste profile quiz flow
│   ├── discover/      # Discovery page (recommendations, browse, search)
│   ├── collection/    # Collection management
│   └── stats/         # Stats dashboard with charts
├── components/        # Shared UI components (GameCard, Navbar, etc.)
├── data/              # Seed data (55 real board games)
├── lib/               # Server-side utilities (DB, recommendations, session)
└── types/             # Shared TypeScript types
```

### Key Patterns

- **App Router**: All pages use the Next.js App Router with file-based routing
- **Client Components**: Most interactive pages are client-rendered (`"use client"`)
- **API Routes**: REST endpoints under `src/app/api/` handle data mutations
- **SQLite**: `better-sqlite3` with auto-seeding; the DB file is gitignored
- **Shared Types**: `src/types/index.ts` is the single source of truth for interfaces

## Making Changes

### Code Style

- TypeScript strict mode is enabled
- ESLint with `next/core-web-vitals` and `next/typescript` configs
- Tailwind CSS v4 for styling (dark theme)
- Use the `@/*` import alias for `src/` paths

### Submitting a Pull Request

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run lint: `npm run check`
4. Run build: `npm run build`
5. Commit with a descriptive message
6. Open a PR with a clear description of what changed and why

### Commit Message Convention

Use conventional commit format:

```
feat: add game sorting by play count
fix: correct quiz progress bar calculation
docs: update API documentation
refactor: extract price comparison component
```

## Reporting Issues

When filing an issue, please include:

- Steps to reproduce the problem
- Expected vs actual behavior
- Browser and Node.js version
- Screenshots if applicable
