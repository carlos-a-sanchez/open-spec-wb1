## ADDED Requirements

### Requirement: Manage team member directory
The UI SHALL provide a form to add team members with required name field, and the backend SHALL persist each entry with generated id inside the in-memory store.

#### Scenario: Add a team member
- **WHEN** the user submits the add-member form with a valid name
- **THEN** the backend SHALL create the member, return it via POST /team-members, and the UI SHALL render it in the roster

### Requirement: Team list available for assignment
The frontend SHALL fetch the roster on load and expose it as a dropdown/select control within the task creation and edit forms.

#### Scenario: Populate assignee dropdown
- **WHEN** the page loads and the roster endpoint returns members
- **THEN** the task form’s assignee dropdown SHALL list each member by name and underlying id

### Requirement: Remove team members safely
The system SHALL allow deleting a team member via DELETE /team-members/:id only if no tasks are currently assigned to that member; otherwise it SHALL reject the request.

#### Scenario: Prevent deletion when assigned
- **WHEN** a user attempts to delete a member who is assigned to any task
- **THEN** the API SHALL respond with 409 and SHALL not remove the member

### Requirement: Handle roster changes in UI state
When team members are added or removed, the frontend SHALL update its local roster state and refresh any assignment controls without requiring a full page reload.

#### Scenario: Optimistic roster refresh
- **WHEN** a new team member is added successfully
- **THEN** the roster list and assignment dropdowns SHALL immediately include the new member
