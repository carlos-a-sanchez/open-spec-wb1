## 1. Project Scaffolding & Monorepo Setup

- [ ] 1.1 Convert root to npm workspaces: add `workspaces` field to root `package.json` pointing to `apps/frontend`, `apps/backend`, and `packages/types`
- [ ] 1.2 Scaffold `apps/frontend/` with Vite + React + TypeScript (move existing root `src/`, `index.html`, `vite.config.ts` into `apps/frontend/`)
- [ ] 1.3 Scaffold `apps/backend/` with Express + TypeScript: `package.json`, `tsconfig.json`, and `src/index.ts` entry point
- [ ] 1.4 Scaffold `packages/types/` with `package.json` and `tsconfig.json`; configure workspace alias `@project/types`
- [ ] 1.5 Install `concurrently` at root and add `npm run dev` script that starts both `apps/frontend` (Vite) and `apps/backend` (ts-node or nodemon) in parallel
- [ ] 1.6 Configure `tsconfig` path aliases in `apps/frontend` and `apps/backend` to resolve `@project/types` from the workspace package

## 2. Shared Types Package

- [ ] 2.1 Define `TaskStatus` enum (`ToDo | InProgress | Review | Done`) in `packages/types/src/index.ts`
- [ ] 2.2 Define `Task` interface (`id`, `title`, `description?`, `status: TaskStatus`, `assignedTo?: string`) in `packages/types/src/index.ts`
- [ ] 2.3 Define `TeamMember` interface (`id`, `name`) in `packages/types/src/index.ts`
- [ ] 2.4 Define shared Zod schemas (`createTaskSchema`, `updateTaskSchema`, `createTeamMemberSchema`) in `packages/types/src/schemas.ts`
- [ ] 2.5 Export all types and schemas from `packages/types/src/index.ts`; verify both apps can import them

## 3. Backend – Task Lifecycle API (RED → GREEN → REFACTOR)

- [ ] 3.1 [RED] Write failing Supertest test: `POST /tasks` with missing title returns 400
- [ ] 3.2 [RED] Write failing Supertest test: `POST /tasks` with status `"Blocked"` (outside enum) returns 400 with error detail
- [ ] 3.3 [RED] Write failing Supertest test: valid `POST /tasks` (title + status `"ToDo"`) returns 201 with generated `id`
- [ ] 3.4 [GREEN] Implement `TaskStore` (in-memory array, reset on import), `TaskService` (Zod validation + business rules), and `POST /tasks` route in `apps/backend/src/`; use `routers/`, `controllers/`, `services/`, `stores/` layout
- [ ] 3.5 [RED] Write failing Supertest test: `PATCH /tasks/:id` with `status: "Review"` returns 200 with updated representation
- [ ] 3.6 [RED] Write failing Supertest test: `PATCH /tasks/:id` with invalid status value returns 400
- [ ] 3.7 [GREEN] Implement `PATCH /tasks/:id` route; validate status against `TaskStatus` enum and persist atomically in `TaskStore`
- [ ] 3.8 [RED] Write failing Supertest test: `GET /tasks` returns empty list on fresh server start
- [ ] 3.9 [GREEN] Implement `GET /tasks` route returning all tasks from `TaskStore`
- [ ] 3.10 [REFACTOR] Ensure `beforeEach` in all backend test files resets `TaskStore` to empty; extract test data builders for reuse

## 4. Backend – Team Member API (RED → GREEN → REFACTOR)

- [ ] 4.1 [RED] Write failing Supertest test: `POST /team-members` with valid name returns 201 with generated `id`
- [ ] 4.2 [RED] Write failing Supertest test: `GET /team-members` returns list of all members
- [ ] 4.3 [GREEN] Implement `TeamMemberStore`, `TeamMemberService`, and `POST` / `GET /team-members` routes
- [ ] 4.4 [RED] Write failing Supertest test: `POST /tasks` with unknown `assignedTo` id returns 400 and does not persist
- [ ] 4.5 [RED] Write failing Supertest test: `PATCH /tasks/:id` with unknown `assignedTo` id returns 400
- [ ] 4.6 [GREEN] Add cross-entity validation in `TaskService`: look up `assignedTo` in `TeamMemberStore`; reject with 400 if not found
- [ ] 4.7 [RED] Write failing Supertest test: `DELETE /team-members/:id` for member assigned to a task returns 409 and does not remove member
- [ ] 4.8 [RED] Write failing Supertest test: `DELETE /team-members/:id` for unassigned member returns 200 and removes member
- [ ] 4.9 [GREEN] Implement `DELETE /team-members/:id` route; query `TaskStore` for any task with `assignedTo === id`; return 409 if found, else delete
- [ ] 4.10 [REFACTOR] Reset both `TaskStore` and `TeamMemberStore` in `beforeEach`; verify no test leakage across suites

## 5. Frontend – Kanban Board (RED → GREEN → REFACTOR)

- [ ] 5.1 Install Tailwind CSS and configure in `apps/frontend`
- [ ] 5.2 Install `@dnd-kit/core` and `@dnd-kit/sortable` in `apps/frontend`
- [ ] 5.3 [RED] Write failing Vitest + RTL test: board renders four lane headers (`To Do`, `In Progress`, `Review`, `Done`) in left-to-right order
- [ ] 5.4 [GREEN] Implement `KanbanBoard` component with four vertical lane columns using `TaskStatus` enum order; render in `App.tsx`
- [ ] 5.5 [RED] Write failing Vitest + RTL test: task card shows title, truncated description (first 120 chars), and assignee indicator
- [ ] 5.6 [GREEN] Implement `TaskCard` component displaying title, description snippet, and assignee avatar/initials; render inside lane columns
- [ ] 5.7 [RED] Write failing Vitest + RTL test: lane contains only tasks whose status matches the lane label (filter logic)
- [ ] 5.8 [GREEN] Derive lane task arrays from normalized `Record<string, Task>` state using status filter; no duplicated state
- [ ] 5.9 [RED] Write failing Vitest + RTL test: drag callback fires with correct source task id and new target status
- [ ] 5.10 [GREEN] Implement `DndContext` wrapping the board; on drop call `PATCH /tasks/:id` with new status and update local state
- [ ] 5.11 [RED] Write failing Vitest + RTL test: keyboard move action on a focused card emits the same status update as drag-and-drop
- [ ] 5.12 [GREEN] Add a move-to-lane button group on each `TaskCard`; activate via keyboard; call same status-update handler as drag-and-drop
- [ ] 5.13 [REFACTOR] Memoize lane selector arrays; ensure `TaskCard` is a pure component to avoid unnecessary re-renders

## 6. Frontend – Team Roster & Task Forms (RED → GREEN → REFACTOR)

- [ ] 6.1 [RED] Write failing Vitest + RTL test: assignee dropdown in task form lists members by name after roster fetch resolves
- [ ] 6.2 [GREEN] Fetch `GET /team-members` on app mount; store roster in React state (or context); pass to task create/edit form as dropdown options
- [ ] 6.3 [RED] Write failing Vitest + RTL test: submitting add-member form calls `POST /team-members` and roster list immediately includes new member
- [ ] 6.4 [GREEN] Implement `AddMemberForm` with required name field; on success update local roster state without page reload
- [ ] 6.5 [RED] Write failing Vitest + RTL test: after deleting a member, roster list and assignment dropdowns no longer include that member
- [ ] 6.6 [GREEN] Wire delete action to `DELETE /team-members/:id`; remove member from local state on success; refresh all dropdowns
- [ ] 6.7 [REFACTOR] Drive all form validation through shared Zod schemas imported from `@project/types`; remove any duplicated client-side validation logic

## 7. Integration & Developer Experience

- [ ] 7.1 Verify `npm run dev` starts Vite dev server and Express API concurrently; confirm both are reachable
- [ ] 7.2 Add integration smoke test: Supertest (or Playwright) makes a full round-trip — create a task via `POST /tasks`, verify it appears in `GET /tasks`
- [ ] 7.3 Add `npm run test:frontend` script (`vitest run`) and `npm run test:backend` script (`jest`) at root
- [ ] 7.4 Verify all Vitest and Jest suites pass with zero failures after completing implementation
- [ ] 7.5 Update root `README.md` with setup, dev, and test commands; note in-memory storage reset behavior
