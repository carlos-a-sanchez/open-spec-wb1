## 1. Shared Types & Environment

- [x] 1.1 Create `packages/types` module defining Task, TeamMember, and Status enum plus Zod schemas shared by client/server.
- [x] 1.2 Wire workspace/tsconfig/Vite/Express path aliases so frontend and backend import the shared types without relative paths.
- [x] 1.3 Add seeding utility (optional fixtures) and document that in-memory stores reset on server restart.

## 2. Backend Task & Team APIs (TDD)

- [x] 2.1 RED: Write Jest/Supertest tests for POST /tasks covering required fields and invalid status rejection.
- [x] 2.2 GREEN: Implement POST /tasks route, service, and store logic enforcing schema validation and returning 201 payloads.
- [x] 2.3 RED: Add tests for PATCH/PUT task updates ensuring enum-restricted status transitions and 400s for bad input.
- [x] 2.4 GREEN: Implement update endpoints that persist status changes atomically in the in-memory store.
- [x] 2.5 RED: Write tests verifying assignedTo must reference an existing team member.
- [x] 2.6 GREEN: Implement validation + error responses for assignedTo checks across create/update flows.
- [x] 2.7 RED: Write tests for team member CRUD (create/list/delete) including guard against deleting assigned members.
- [x] 2.8 GREEN: Implement team member routes/services with deletion guard and roster responses.
- [x] 2.9 REFACTOR: Extract shared validation middleware/services and ensure store reset helpers keep tests isolated.

## 3. Frontend Kanban Board (TDD)

- [x] 3.1 RED: Create Vitest/RTL test asserting four workflow lanes render in the correct order with seeded tasks.
- [x] 3.2 GREEN: Build Kanban board layout component with Tailwind styling and lane filtering selectors.
- [x] 3.3 RED: Add tests confirming cards show title, truncated description, and assignee indicator.
- [x] 3.4 GREEN: Implement TaskCard component that satisfies readability requirements.
- [x] 3.5 RED: Write tests simulating drag-and-drop (using DnD kit helpers) to ensure callbacks fire with source/target lanes.
- [x] 3.6 GREEN: Integrate `@dnd-kit` drag-and-drop interactions wired to backend mutations and optimistic UI updates.
- [x] 3.7 RED: Add tests for keyboard-accessible move controls (e.g., action buttons) to change status without drag.
- [x] 3.8 GREEN: Implement keyboard move controls with ARIA roles and backend sync.
- [x] 3.9 REFACTOR: Optimize rendering/memoization for large task lists and share selectors via hooks.

## 4. Task & Team Management UI (TDD)

- [x] 4.1 RED: Write tests for task create/edit forms validating required title, enum status default, and roster-driven assignee dropdown.
- [x] 4.2 GREEN: Implement modal/form components, hooking submission to backend and refreshing board state.
- [x] 4.3 RED: Add tests for team roster management UI (add/remove) ensuring deletion is blocked when tasks depend on a member.
- [x] 4.4 GREEN: Build roster management panel with optimistic updates and error handling for 409 guard responses.
- [x] 4.5 REFACTOR: Centralize fetch hooks/state management (e.g., React Query or custom hooks) for tasks + roster.

## 5. Quality Gates & Developer Experience

- [x] 5.1 Add integration smoke test that drives the frontend against the live Express API to confirm contracts align.
- [x] 5.2 Update README/dev docs with run/test commands, seed behavior, and TDD expectations.
- [x] 5.3 Configure CI scripts to run `pnpm test:frontend` and `pnpm test:backend`, failing the pipeline on regressions.
