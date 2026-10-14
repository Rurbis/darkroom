# @focaldrop/shared

Zod schemas, inferred types and constants shared by `apps/web`, `apps/api` and `apps/zip-worker`. One schema validates a form in Next, a request body in Nest and a JSONB column when it is read.

## Rules

- **No Node-only APIs.** The package runs in the browser, in Nest and in Cloudflare Workers. The build has no Node types and ESLint forbids `node:*` imports and Node globals such as `process` or `Buffer`.
- **No agency data.** Constants here belong to the platform; anything that identifies an agency lives in the database.
- **No UI text.** Validation errors carry Zod issue codes; the web app turns them into Spanish messages.

## Usage

```jsonc
// apps/<app>/package.json
"dependencies": {
  "@focaldrop/shared": "workspace:*",
  "zod": "4.6.7" // same exact version as this package
}
```

```ts
import { AgencySchema, parseThemeOrDefault, type Agency } from '@focaldrop/shared';
```

The package is compiled to ESM in `dist/` with `tsc`. Turborepo builds it before any app that depends on it, and `pnpm dev` keeps it in watch mode.

## Scripts

| Script                                       | What it does                                                          |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `pnpm --filter @focaldrop/shared build`      | Compiles `src/` to `dist/` (JavaScript, declarations and source maps) |
| `pnpm --filter @focaldrop/shared test`       | Runs the Vitest suite once                                            |
| `pnpm --filter @focaldrop/shared test:watch` | Runs Vitest in watch mode                                             |
