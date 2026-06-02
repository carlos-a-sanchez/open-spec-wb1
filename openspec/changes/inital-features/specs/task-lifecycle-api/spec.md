## ADDED Requirements

### Requirement: Task creation enforces schema
The backend API SHALL reject task creation requests that omit title or status, or provide a status outside the enum {ToDo, InProgress, Review, Done}, returning HTTP 400 with error details.

#### Scenario: Reject invalid status
- **WHEN** the client submits POST /tasks with status "Blocked"
- **THEN** the API SHALL respond with 400 and a payload describing the invalid status value

#### Scenario: Create valid task
- **WHEN** the client submits POST /tasks with a valid title, optional description, status="ToDo", and optional assignedTo
- **THEN** the API SHALL respond with 201, returning the persisted task including generated id

### Requirement: Status updates must follow enum rules
PATCH/PUT requests to update a task SHALL only accept status values defined in the enum and SHALL persist the change atomically in the in-memory store.

#### Scenario: Move task forward
- **WHEN** the client sends PATCH /tasks/:id with status="Review"
- **THEN** the API SHALL update the task’s status and return 200 with the new representation

### Requirement: Team member references must exist
When assignedTo is provided on task creation or update, the backend SHALL validate that the referenced team member id exists, otherwise return 400.

#### Scenario: Reject missing assignee
- **WHEN** the client assigns a task to an unknown team member id
- **THEN** the API SHALL return 400 and SHALL not update the task

### Requirement: In-memory data resets per server start
The system SHALL initialize with empty task and team collections unless seeded data is configured, and every server restart SHALL clear previous runtime state.

#### Scenario: Restart wipes state
- **WHEN** the Express server restarts
- **THEN** a subsequent GET /tasks SHALL return an empty list (or only seeded fixtures) regardless of tasks created before the restart
