## ADDED Requirements

### Requirement: Kanban board displays all workflow lanes in order
The frontend SHALL render four vertical lanes labeled "To Do", "In Progress", "Review", and "Done" in that exact left-to-right order on all viewport sizes.

#### Scenario: Render lanes on initial load
- **WHEN** the user loads the dashboard
- **THEN** the UI SHALL display each lane header in order with an empty drop zone beneath it

### Requirement: Task cards expose key details at a glance
Each card SHALL show the task title and first 120 characters of the description, along with any assigned team member avatar or initials, without requiring a click or hover.

#### Scenario: Display summarized card content
- **WHEN** a task with title, description, and assignee is rendered in a lane
- **THEN** the card SHALL show the title, truncated description snippet, and assignee indicator inline

### Requirement: Drag-and-drop updates task status bidirectionally
Users SHALL be able to drag a card from any lane to any other lane, including backward movements, and the drop action SHALL immediately update the card’s status and lane membership.

#### Scenario: Move task from Review back to In Progress
- **WHEN** a user drags a card from the Review lane into the In Progress lane
- **THEN** the board SHALL re-render with the card in In Progress and persist the new status via the backend API

### Requirement: Keyboard-accessible lane transitions
The UI SHALL provide an alternative control (e.g., button group or menu) that allows keyboard users to move a selected task to another lane without drag-and-drop.

#### Scenario: Move task using keyboard action
- **WHEN** a user focuses a card and activates the "Move to Done" action via keyboard
- **THEN** the card SHALL relocate to the Done lane and emit the same status update as drag-and-drop
