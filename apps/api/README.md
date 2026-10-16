# @focaldrop/api

NestJS 12 API for Focal Drop, using ESM and the monorepo's shared TypeScript,
ESLint and Prettier configuration.

`GET /health` returns HTTP 200 with the API status and the version declared in
this package's `package.json`:

```json
{ "status": "ok", "version": "0.0.1" }
```

The response is validated with `HealthResponseSchema` from `@focaldrop/shared`.
The package version is loaded once in `src/constants/app.constants.ts`.
This endpoint checks that the API responds; it does not check database connectivity.

## Development

Run these commands from the repository root, with the Node and pnpm versions
pinned by the project:

```sh
pnpm install --frozen-lockfile
```

Copy this app's `.env.example` to `apps/api/.env`, then start the workspace:

```sh
pnpm dev
```

The health endpoint is <http://localhost:3001/health>. Turbo builds workspace
dependencies before starting their consumers. To run only the API in watch mode:

```sh
pnpm exec turbo run dev --filter=@focaldrop/api
```

The API loads `apps/api/.env` when present. Variables supplied by the environment
take precedence. Zod validates the configuration before Nest starts:

| Variable             | Required | Values / default                                                |
| -------------------- | -------- | --------------------------------------------------------------- |
| `NODE_ENV`           | Yes      | `development`, `test` or `production`                           |
| `PORT`               | No       | Integer from 1 to 65535; defaults to `3001`                     |
| `SENTRY_DSN`         | No       | HTTP(S) DSN for the existing API project; empty disables Sentry |
| `SENTRY_ENVIRONMENT` | No       | Deployment label, e.g. `staging`; defaults to `NODE_ENV`        |

Invalid configuration stops startup and identifies the affected variable.
Restart the API after changing environment variables.

## Logs and error reporting

Nest logs and startup failures use one JSON object per line, with a level,
timestamp, context and message. Colors are disabled so log collectors can parse
the output directly.

When `SENTRY_DSN` is present, `src/main.ts` initializes `@sentry/nestjs` before
dynamically loading the Nest bootstrap. This order lets the SDK instrument ESM
modules before they load. The global Sentry exception filter reports unexpected
server errors; expected HTTP errors such as 400 responses are not reported.
Sentry 11 replaced `sendDefaultPii` with
[`dataCollection`](https://github.com/getsentry/sentry-javascript/blob/11.8.0/MIGRATION.md).
Our policy in `src/constants/sentry.constants.ts` disables automatic user info,
cookies, headers, bodies, query parameters and integration payload collection.
Performance tracing is disabled, and releases use `focaldrop-api@<package version>`.

Issue #9 already provisioned the Sentry API project. For staging, use its DSN
from the team's secret store and set `SENTRY_ENVIRONMENT=staging`; do not create
a second project or commit the DSN. A post-deploy check in the real Sentry project
still requires that environment's DSN and access to its dashboard.

## Checks and production build

```sh
pnpm exec turbo run lint typecheck test build
pnpm --filter @focaldrop/api start:prod
```

`test` runs configuration and SDK initialization unit tests, plus HTTP end-to-end
tests with Vitest. The e2e tests create their own servers on available ports; they
do not need `pnpm dev` running. `/health` is checked against the version read
independently from this package's `package.json`. Error-reporting tests exercise
the actual SDK and global exception filter with an in-memory transport, so they
never send events to Sentry or require a real DSN. The synthetic error routes exist
only in the test module.

`tsconfig.json` covers source, tests and Vitest configuration. The build uses
`tsconfig.build.json` to compile only application source into `dist/`, with
`src/main.ts` emitted as `dist/main.js`.

Production deployments must retain this package's `package.json` alongside
`dist/`, because the API reads its version at startup.

Formatting is managed from the repository root with `pnpm format:check` and
`pnpm format`.
