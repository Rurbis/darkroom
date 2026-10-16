# Focal Drop

[![CI](https://github.com/Rurbis/focaldrop/actions/workflows/ci.yml/badge.svg)](https://github.com/Rurbis/focaldrop/actions/workflows/ci.yml)

Multi-tenant platform for photography agencies: a public website for each agency and private, expiring galleries to deliver photos and videos to their clients.

> **Work in progress.** Currently building milestone 0 (foundations). Full documentation, in English and Spanish, arrives with issue #23.

**Stack:** Next.js · NestJS · Supabase (Postgres + Auth) · Cloudflare R2 and Workers · pnpm + Turborepo

## Local Supabase

With the Node and pnpm versions pinned by this repository and Docker Desktop running Linux containers:

```sh
pnpm install --frozen-lockfile
pnpm db:start
```

Open Studio at <http://127.0.0.1:54323>. Stop the local services with `pnpm db:stop`; database
data is preserved. See the [local setup guide (Spanish)](infra/supabase/README.md) for credentials,
ports, configuration, and the verification checklist for both developers.

© 2026 The Focal Drop authors. All rights reserved. This repository is public as a portfolio project; no license is granted to use, copy, modify or distribute the code.
