# OpenSpec Workshop — Base App

This is the starting point for the **SDD & OpenSpec** workshop. You will build on top of this React + TypeScript + Vite application throughout the sessions.

## Prerequisites

Make sure the following runtimes and tools are installed before you begin.

### Runtime

| Tool | Minimum version | Recommended |
|------|----------------|-------------|
| [Node.js](https://nodejs.org/) | **20 LTS** | 22 LTS or 24 |
| npm | **9** | bundled with Node (10+) |

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage Node versions. A `.nvmrc` / `.node-version` file can pin the project version automatically.

### Editor (optional but recommended)

- [VS Code](https://code.visualstudio.com/) with the **ESLint** and **TypeScript** extensions.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (Vite's default port).

## Verify the App Is Running

After `npm run dev` starts, open your browser and navigate to:

```
http://localhost:5173
```

You should see the React starter page. To confirm everything is wired up correctly, run the following in a separate terminal:

```bash
# Type-check the project (no errors should be reported)
npx tsc --noEmit

# Run the linter (no errors should be reported)
npm run lint
```

Both commands should exit cleanly with no errors before you start the workshop exercises.

## OpenSpec Setup

OpenSpec is the spec-driven development tool used throughout the workshop. It requires a separate global CLI installation plus a one-time project initialization.

### 1. Install the CLI

```bash
npm install -g @fission-ai/openspec
```

Verify it is available:

```bash
openspec --version
```

### 2. Initialize OpenSpec in the project

Run the following once from the project root. When prompted for AI tools, select **windsurf** (or pass the flag directly):

```bash
openspec init --tools windsurf
```

This creates (or updates) the workflow files under `.windsurf/workflows/` so the `/opsx:*` slash commands are available in Windsurf.

> **Note:** The `openspec/` directory and `openspec/config.yaml` are already committed to this repository, so no additional project scaffolding is needed.

### 3. Verify the setup

```bash
# List available changes
openspec list

# Show the OpenSpec dashboard
openspec view
```

### Available slash commands

Once initialized, use these commands in the Windsurf AI chat panel:

| Command | What it does |
|---------|-------------|
| `/opsx-propose` | Create a change and generate all artifacts |
| `/opsx-apply` | Implement tasks from a change |
| `/opsx-explore` | Think through problems before/during work |
| `/opsx-archive` | Archive a completed change |
| `/opsx-new` | Start a new change, step through artifacts one at a time |
| `/opsx-continue` | Continue working on an existing change |
| `/opsx-onboard` | Guided walkthrough of a complete OpenSpec cycle |

## Tech Stack

| Layer | Library / Tool | Version |
|-------|---------------|---------|
| UI framework | React | 19 |
| Build tool | Vite | 8 |
| Language | TypeScript | 6 |
| Linter | ESLint | 10 |
