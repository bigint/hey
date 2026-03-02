# Repository Guidelines

## Project Structure

- `src/`: Application source code
  - `components/`: React components organized by feature
  - `data/`: Constants, configuration, and data utilities
  - `helpers/`: Utility functions and helper modules
  - `hooks/`: Custom React hooks
  - `indexer/`: Apollo GraphQL client and code generation
  - `store/`: Zustand state management
  - `types/`: TypeScript type definitions
- `public/`: Static assets served by the application
- `script/`: Maintenance utilities (e.g., cleaning dependencies, sorting `package.json`)
- Tooling: Biome config (`biome.json`), Husky hooks (`.husky/`)

## Build, Test, and Development

- Dev: `pnpm dev` - run in watch mode on port 4783
- Build: `pnpm build` - build for production
- Preview: `pnpm start` - preview production build
- Lint/format: `pnpm biome:check` (auto-fix: `pnpm biome:fix`)
- Types: `pnpm typecheck` - TypeScript type checking
- Node & PM: Node 20 (`.nvmrc`), pnpm 10 (see `package.json#packageManager`)

## Coding Style & Naming

- Language: TypeScript (strict mode)
- Formatting: Biome controls style; no trailing commas; spaces for indentation
- Imports: Use alias `@/*` to `src/`
- Files: React components `PascalCase.tsx`; helpers/stores `camelCase.ts`
- Keep modules small, colocate domain helpers with their feature when practical

## Testing Guidelines

- Current status: no formal unit tests present. Enforce quality via `biome` and `tsc`
- If adding tests, prefer Vitest for web and lightweight integration tests
- Naming: `*.test.ts` or `*.test.tsx`, colocated with the code or under `__tests__/`

## Commit & Pull Requests

- Commits: imperative mood, concise subject; optional scope like `web:`, `api:`, `helpers:`
- Include rationale and references (e.g., `Closes #123`)
- PRs: clear description, screenshots for UI changes, reproduction steps for fixes
- CI hooks: pre-commit runs `biome` and type checks; ensure both pass locally before pushing
