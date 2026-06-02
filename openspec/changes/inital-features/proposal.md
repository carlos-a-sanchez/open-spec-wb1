## Why
Agile teams need a lightweight sprint board they can stand up quickly for demos and internal productivity experiments. We currently lack a cohesive example that ties a modern React Kanban UI, a TypeScript Express API, and test-first development practices together. Shipping this change provides the reference Sprint Task Manager requested in the initial project brief so stakeholders can validate the workflow before investing in persistent storage.

## What Changes
- Build a React + Vite frontend that renders the four-lane Kanban board (To Do, In Progress, Review, Done) with readable task cards and smooth drag-and-drop lane transitions.
- Add task management UI affordances (create form/modal, card detail preview, optional assignee dropdown) plus a lightweight interface to seed/edit team members.
- Implement a Node.js/Express API with in-memory stores for tasks and team members, enforcing the task schema and status enum on every CRUD call.
- Establish full-stack automated tests: Vitest/RTL coverage for card rendering & filtering, and Jest/Supertest integration tests for the REST API validation flow.
- Enforce test-first sequencing (Red→Green→Refactor) in the task plan so implementation cannot be merged without matching tests.

## Capabilities

### New Capabilities
- `kanban-task-board`: Frontend Kanban experience with four swimlanes, drag-and-drop interactions, and card-level detail visibility.
- `task-lifecycle-api`: Backend REST interface for creating, updating, validating, and persisting (in-memory) tasks & team members with strict schema enforcement.
- `team-roster-management`: Simple UI + API flows to maintain the available team-member list for assignment.
- `tdd-sprint-quality`: Required testing artifacts and sequencing that guarantee UI and API behaviors are protected by automated tests.

### Modified Capabilities
- _None_

## Impact
- Frontend code under `apps/frontend` (React/Vite/TypeScript) for board UI, drag-and-drop behavior, and task/member forms.
- Backend code under `apps/backend` (Express/TypeScript) for REST controllers, validation middleware, and in-memory repositories.
- Shared TypeScript types and enums for task & team models.
- Test suites: Vitest + React Testing Library for UI, Jest + Supertest for API integration, wired into the project’s CI scripts.
