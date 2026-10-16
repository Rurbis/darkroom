# @focaldrop/web

Next.js 16 (App Router) front of Focal Drop: the admin panel today, and the public site and client galleries of each agency later. See the [main README](../../README.md) for the whole project.

## Conventions

- **Interface texts live in [`src/i18n/es-MX.ts`](src/i18n/es-MX.ts)**, never inline in components (B5). A missing key is a compile error.
- **The admin panel is neutral** (D39): the same design for every agency. Nothing that identifies an agency goes in the code; it comes from the database.
- **Tailwind CSS v4** is configured in CSS ([`src/app/globals.css`](src/app/globals.css)); there is no `tailwind.config.js`.
- **Typed routes**: a `Link` to a route that does not exist fails `pnpm typecheck`.

## Scripts

| Script                                   | What it does                                      |
| ---------------------------------------- | ------------------------------------------------- |
| `pnpm --filter @focaldrop/web dev`       | Development server on http://localhost:3000       |
| `pnpm --filter @focaldrop/web build`     | Production build                                  |
| `pnpm --filter @focaldrop/web lint`      | ESLint with the Next.js and React hooks rules     |
| `pnpm --filter @focaldrop/web typecheck` | Generates the route types and runs `tsc --noEmit` |
