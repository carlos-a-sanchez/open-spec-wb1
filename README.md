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

## Tech Stack

| Layer | Library / Tool | Version |
|-------|---------------|---------|
| UI framework | React | 19 |
| Build tool | Vite | 8 |
| Language | TypeScript | 6 |
| Linter | ESLint | 10 |
