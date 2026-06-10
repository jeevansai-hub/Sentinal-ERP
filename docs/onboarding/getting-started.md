# ERP7 — Developer Onboarding Guide

## Welcome

ERP7 is a full-suite Enterprise Resource Planning system.  
Before writing a single line of code, read these files in order:

1. [`RULES.md`](../../RULES.md) — **Mandatory** development standards
2. [`ARCHITECTURE.md`](../../ARCHITECTURE.md) — System architecture overview
3. This file — Local setup & codebase tour

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 20.x LTS |
| npm | 10.x |
| Docker | 24.x |
| Docker Compose | 2.x |
| PostgreSQL client | 15.x (optional, for direct DB access) |
| Git | 2.40+ |

---

## Local Setup (< 30 minutes)

### 1. Clone & Install

```bash
git clone <repository-url> erp7
cd erp7
npm install
```

### 2. Environment Setup

```bash
# Copy environment templates
cp configs/environments/.env.development.example apps/api/.env
cp configs/environments/.env.development.example apps/web/.env.local
# Edit the .env files with your local values
```

### 3. Start Infrastructure

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
# Starts: PostgreSQL, Redis
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

### 5. Seed Development Data

```bash
npm run db:seed:dev
```

### 6. Start Development Servers

```bash
# Terminal 1 — Backend API
cd apps/api && npm run dev

# Terminal 2 — Frontend
cd apps/web && npm run dev
```

### 7. Verify

- API: http://localhost:3001/health/ready
- Frontend: http://localhost:3000

---

## Codebase Tour

### Where is the business logic?
`apps/api/src/modules/<domain>/application/` — use cases

### Where are the database models?
`apps/api/src/modules/<domain>/domain/` — entities  
`database/migrations/<domain>/` — schema migrations

### Where is the UI?
`apps/web/src/features/<domain>/` — domain-specific pages & components

### Where are shared types?
`shared/types/` — TypeScript interfaces shared across apps

### Where are the tests?
`apps/api/tests/` and `apps/web/tests/` for app-level tests  
`tests/` for cross-module and E2E tests

---

## Common Commands

```bash
npm run dev              # Start all dev servers
npm run test             # Run all unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests (Playwright)
npm run lint             # ESLint
npm run type-check       # TypeScript compiler check
npm run db:migrate       # Run pending migrations
npm run db:rollback      # Rollback last migration
npm run db:seed:dev      # Seed development data
```

---

## Getting Help

1. Check module `README.md` (in `modules/<domain>/`)
2. Check `docs/runbooks/` for operational guides
3. Check `docs/architecture/decisions/` for past decisions
4. Ask your module lead
