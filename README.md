# Agile Sprint Task Manager

This project houses the reference implementation for the Agile Sprint Task Manager—an end-to-end demo showcasing a TypeScript React frontend, an Express backend, and strict TDD practices. The repository includes shared domain types (`packages/types`) used by both apps, plus an integration smoke test that drives the UI against the live API.

## Getting started

```bash
npm install
# Start both stacks in separate terminals
npm run dev           # Vite frontend at http://localhost:5173
npm run dev:backend   # Express API at http://localhost:3000
```

Key scripts (run from repo root):

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the frontend with hot reload. |
| `npm run dev:backend` | Boots the Express API with seeding + request logging. |
| `npm run build` | Type-checks and builds the frontend bundle. |
| `npm run preview` | Serves the built frontend locally. |
| `npm run test --workspace @sprint/frontend` | Runs Vitest (unit + RTL + integration smoke test). |
| `npm run test --workspace @sprint/backend` | Runs Jest + Supertest suites for the API. |

## Testing strategy

- **Frontend unit/UI**: Vitest + React Testing Library cover drag-and-drop, keyboard moves, forms, and optimistic roster flows (`apps/frontend/src/App.test.tsx`).
- **Frontend ↔ backend integration**: `apps/frontend/src/App.integration.test.tsx` spins up the Express app in-process and renders the real React tree to ensure contracts align.
- **Backend API**: Jest/Supertest suites validate task + team routes (`apps/backend/tests`).

> Tip: `npm run test --workspaces --if-present` executes every workspace suite, mirroring the intended CI workflow.

## In-memory data & seeding

The backend operates entirely in memory. Every server restart (or Jest test) calls `resetStore`, which repopulates tasks/team members via `createSeedData` from `@sprint/types`.

- **Volatile storage**: expect a clean slate after each restart—persist anything important elsewhere.
- **Deterministic seeds**: helper functions are safe to invoke repeatedly; IDs are regenerated and tests isolate state by calling `resetStore` in `jest.setup.ts`.
- **Docs**: surface this behavior in user-facing comms so stakeholders understand the limitation.

## TDD expectations

All work in `openspec/changes/inital-features/tasks.md` follows a RED → GREEN → REFACTOR cadence:

1. **RED** – add failing unit/integration tests that describe the required behavior.
2. **GREEN** – implement the minimal code to make those tests pass, including optimistic update handling where specified.
3. **REFACTOR** – tidy shared hooks, selectors, and request helpers without altering observable behavior.

CI (Task 5.3) will eventually run `npm run test:frontend` and `npm run test:backend` to block regressions; keep both suites green before pushing.

## Workspace layout

- `apps/frontend`: React + Vite client entry point, Vitest suites, and integration smoke tests.
- `apps/backend`: Express API, Jest/Supertest suites, and in-memory store.
- `packages/types`: Shared Task/Team schemas, enums, and seeding helpers consumed by all apps.
