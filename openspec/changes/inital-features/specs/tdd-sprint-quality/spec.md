## ADDED Requirements

### Requirement: Frontend tests cover lane rendering and filtering
Vitest + React Testing Library suites SHALL include tests that render the board with seeded tasks and assert each lane shows the correct subset based on status.

#### Scenario: Filter tasks per lane
- **WHEN** tests render the board with tasks across statuses
- **THEN** each lane SHALL contain only tasks whose status matches the lane label

### Requirement: Drag-and-drop interactions have automated coverage
At least one test SHALL simulate dragging a card between lanes (using DnD test utilities) and assert that callbacks fire with the expected source/target ids.

#### Scenario: Simulate drag from To Do to Review
- **WHEN** a test triggers drag from a To Do card into Review drop zone
- **THEN** the handler SHALL receive the new status and the UI SHALL reflect the change

### Requirement: Backend integration tests validate CRUD flows
Jest + Supertest suites SHALL cover task creation, updates, validation failures, and team member CRUD responses, resetting the in-memory store between tests.

#### Scenario: Backend rejects invalid payload
- **WHEN** a Supertest suite submits POST /tasks without title
- **THEN** the response SHALL be 400 and the store SHALL remain unchanged

### Requirement: TDD sequence enforced in task plan
Tasks.md SHALL order work items so tests are authored before implementation (RED), followed by implementation changes (GREEN), then refactors, preventing merges that skip the sequence.

#### Scenario: Tasks list enforces order
- **WHEN** reviewing tasks.md
- **THEN** each item SHALL clearly indicate the test-first sequence for its associated feature area
