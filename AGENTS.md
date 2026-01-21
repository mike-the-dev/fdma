# Repository Guidelines

## Repository Identity
- Name: admin-app
- Type: Frontend
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Package Manager: npm
- Owner: Instpaytient Engineering

## Global Organization Standards
- Engineering standards: `docs/agent/engineering/global-standards.md`
- Commit and PR templates: `commit-messages.md`, `docs/agent/pr-description-template.md`
- Commit tooling: `./gitmark.sh`
- Everything below this section is project-specific.

## Project Structure & Module Organization
This is a Next.js 15 TypeScript app using the App Router. Core application code lives in `src/`, with feature areas split into folders like `components/`, `features/`, `app/`, `utils/`, `context/`, `hooks/`, `providers/`, and `schemas/`. Entry points are `src/app/layout.tsx` and `src/app/page.tsx`. Static assets live in `public/`.
- Feature folder architecture: `docs/agent/architecture/feature-folder-architecture.md`.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` runs the app in development mode (Turbopack).
- `npm run build` builds the production bundle.
- `npm run start` starts the production server.
- `npm run lint` runs ESLint.

## Coding Style & Naming Conventions
Use TypeScript with Next.js App Router conventions. Formatting is enforced by Prettier and linted by ESLint (`npm run lint`). Keep file and folder names consistent with existing feature areas (e.g., `features/`, `components/`, `utils/`).
- Framework addendum: `docs/agent/engineering/standards-nextjs.md`.

## Testing Guidelines
No formal test runner is configured in this repo at the moment. If tests are added later, document the runner and conventions here.

## Security & Configuration Tips
Credentials and secrets should be supplied via environment configuration (use `.env.local` and `process.env`, with `NEXT_PUBLIC_*` only for variables safe to expose to the client). If you add new external integrations, document required env vars and update scripts/tests accordingly.

## Commit & Pull Request Guidelines
Recent commit history uses Conventional Commits (e.g., `feat(ui): ...`, `chore(app): ...`). Follow that pattern for new work. Run `./gitmark.sh` for all commits unless explicitly told otherwise. PRs should include a short description, testing notes (commands run), and any relevant context about affected modules (for example, `src/features/` or `src/components/`). Use the templates in `docs/agent/pr-description-template.md`.

## Parallel Worktrees
When running multiple agents in parallel, use a dedicated git worktree per task to avoid branch collisions. Prefer `scripts/worktree-new.sh` to create a new worktree and branch from a base (default `staging`). Example: `./scripts/worktree-new.sh fix/sentry-7149304198`.
- Before creating a new worktree, check if the branch/worktree already exists; reuse it if present.
- Each task must have its own worktree and branch; never reuse another agent's worktree.
- Do not work directly on `staging`; always create a feature branch for PRs.
- In a new worktree, run `npm install` before running scripts/tests.
- Copy `.env` from the base repo into the worktree when running scripts/tests that depend on env vars, and remove it after.

## Special Workflows (Repo-Specific)
- Add repo-specific workflows under `docs/agent/` as needed.
