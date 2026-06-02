## Context
Agile Sprint Task Manager is a demo-grade Kanban application meant to showcase an end-to-end TypeScript stack (React + Vite front-end, Express API back-end) with strict TDD discipline. The frontend must render four workflow lanes, surface enough task detail for at-a-glance decisions, and support bi-directional drag-and-drop across statuses. The backend keeps canonical task and team member state in memory, validating every mutation against shared types/enums. Tests (Vitest/RTL for UI, Jest/Supertest for API) gate every behavior. Because storage is volatile and access is single-tenant, the design prioritizes clarity and developer experience over persistence or multi-user concerns.

## Goals / Non-Goals

**Goals:**
- Deliver a polished Kanban UI with fluid drag-and-drop interactions and accessible task cards.
- Provide ergonomic task/member management flows (create, edit, assign) with consistent validation across client and server.
- Maintain a single source of truth for task and team metadata via typed contracts shared between frontend and backend.
- Enforce TDD by structuring work so tests lead every change and CI blocks regressions.
- Keep deployment friction low by using in-memory storage and avoiding external dependencies.

**Non-Goals:**
- Persistent databases, multi-tenant auth, or offline sync.
- Real-time collaboration or websocket fan-out.
- Advanced workflow automation (WIP limits, burndown charts, sprint analytics).
- Production-grade security hardening beyond basic Express middleware.

## Decisions
1. **Drag-and-drop substrate**: Use `@dnd-kit/core` for flexible drag overlays, touch support, and TS typings. Alternatives like `react-beautiful-dnd` are deprecated and less customizable.
2. **State modeling**: Normalize tasks in the frontend using a `Record<string, Task>` plus derived lane arrays to avoid duplicating logic. Filters compute lane contents on render, keeping updates O(1).
3. **Forms & UI primitives**: Drive task/member forms through controlled components backed by Zod schemas. Reuse Tailwind utility classes with a small design token layer for consistent spacing and color semantics.
4. **Backend structure**: Organize Express API as `routers/`, `controllers/`, `services/`, and `stores/`. Stores own in-memory arrays; services enforce business rules; controllers validate input and map HTTP semantics. Shared DTOs live in `packages/types` consumed by both apps.
5. **Validation**: Share Zod schemas between client and server to ensure identical constraints. Server re-validates even if the client ran checks, preventing drift.
6. **Testing strategy**: Frontend Vitest + RTL snapshots for board rendering, drag-drop lane transitions (simulated), and form flows. Backend Jest + Supertest runs against the Express app with the in-memory store reset per test. Test data builders keep specs readable.
7. **TDD enforcement**: Tasks.md will explicitly order steps as RED → GREEN → REFACTOR for each capability. CI scripts run `pnpm test:frontend` and `pnpm test:backend` to block merges without passing suites.

## Risks / Trade-offs
- **In-memory storage loses data on restart** → Acceptable for demo; document behavior prominently and seed default data in dev mode.
- **Drag-and-drop accessibility** → DnD libraries are mouse-centric. Add keyboard shortcuts for lane transitions (e.g., buttons) and ensure ARIA roles to mitigate.
- **Shared schema versioning** → A change in shared types can break either side. Mitigate with type tests and ensure packages/types is versioned and imported via workspace aliases.
- **Performance with large boards** → Rendering hundreds of cards could stutter. Mitigate with lightweight card components, virtualization hooks, and memoized selectors if needed.

## Migration Plan
1. Scaffold shared type package and wire path aliases in both Vite and tsconfig for backend.
2. Implement backend services + API first with Jest/Supertest TDD to lock down behavior.
3. Build frontend Kanban experience incrementally, starting with static lanes, then wiring drag-and-drop, then forms—all via Vitest/RTL TDD.
4. Add integration smoke test that hits live Express API via the frontend dev server to ensure contracts match.
5. Document run/test commands in README; hook both suites into CI.
6. Rollback strategy: revert to previous commit; no persistent schema migrations are required because storage is volatile.

## Open Questions
- Should we seed demo tasks/team members automatically for first-run UX, and if so, what dataset?
- Do we need optimistic UI updates for drag-and-drop or rely on server acknowledgement before reflecting status changes?
- Is authentication or basic user identification required for demo environments?
- Should tasks support ordering within a lane beyond drag position (e.g., priority score)?
