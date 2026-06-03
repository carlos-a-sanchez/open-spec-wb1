# Project Brief: Agile Sprint Task Manager (Kanban Board)

## Objective
Build a fully functional, single-tenant Sprint Task Manager web application featuring a drag-and-drop Kanban board interface. The application consists of a React frontend and a Node.js/Express backend using in-memory storage.

## Technical Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** In-memory storage (variables/collections in memory, reset on server restart)
Tests: Vitest (and Supertest for API tests if needed)
Runtime: The app should be scaffolded to run frontend and backend together with a single command (npm run dev)

## Core Features & Requirements

### 1. Data Model
- **Task Card:** - `id` (Unique identifier)
  - `title` (String, required)
  - `description` (String, optional)
  - `status` (Enum: 'ToDo', 'InProgress', 'Review', 'Done')
  - `assignedTo` (String, optional - name or ID of a team member)
- **Team Member:** - `id` (Unique identifier)
  - `name` (String, required)

### 2. Frontend (React / Vite / TypeScript / Tailwind CSS)
- **Board Layout:** Display four vertical lanes ordered from left to right: **To Do**, **In Progress**, **Review**, and **Done**.
  - The title and part of the description SHALL be readable from the dashboard 
- **Drag-and-Drop:** Implement smooth drag-and-drop functionality to move task cards between any lanes (both forward and backward transitions are allowed). 
  
- **Task Management UI:**
  - A form/modal to create new tasks (Title, Description, and an optional dropdown to assign a team member).
  - Ability to view task details on the card.
  - Initial stats is: "InProgress
- **Team Management UI:** A simple interface or input to manage/populate the list of available team members so they can be assigned to tasks.

### 3. Backend API & Validation (Node.js / Express)
- Implement a RESTful API to handle CRUD operations for tasks and team members.
- **State & Data Validation:** The backend must validate the incoming data structure. It must ensure that any state transition updates match the allowed status enum values before modifying the in-memory state.

### 4. Testing Requirements
- **Frontend:** Include basic unit/integration tests (e.g., using Vitest or Jest with React Testing Library) to verify card rendering and lane filtering.
- **Backend:** Include API integration tests (e.g., using Jest and Supertest) to verify data validation, successful task creation, and state updates.

## TDD is REQUIRED
- Follow Red-Green-Refactor
- For every behavior in the specs, write test FIRST (failing), then implement.
- The task list must explicitly sequence: tests → implementation → refactor.

## Architecture & Code Quality Guidelines
- Maintain a strict separation of concerns between the frontend client and backend API.
- Use TypeScript strictly on both client and server sides (avoid `any`).
- Ensure code is modular, cleanly commented, and follows modern best practices for React components and Express middleware.

