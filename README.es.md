# Focal Drop

[![CI](https://github.com/Rurbis/focaldrop/actions/workflows/ci.yml/badge.svg)](https://github.com/Rurbis/focaldrop/actions/workflows/ci.yml)

[English](README.md) · **Español**

Plataforma multi-tenant para agencias de fotografía. Cada agencia tiene su propio sitio público y entrega fotos y videos a sus clientes en galerías privadas que vencen a los 30 días.

> **En construcción.** Estamos en el hito 0 (fundaciones). El primer cliente es una agencia de fotografía en México, así que la interfaz está en español (es-MX); el código y los README están en inglés y los documentos de diseño, en español.

## Qué hace

| Función                                                                                                                  | Hito         |
| ------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Panel de la agencia, con inicio de sesión                                                                                | 0 (en curso) |
| Galerías privadas: subida de archivos grandes directo al almacenamiento, links que vencen, descargas en calidad original | 1            |
| Descarga de la galería completa como ZIP armado al vuelo, reanudable y nunca guardado                                    | 1            |
| Sitio público de cada agencia: tema con _design tokens_, portafolio, paquetes y contacto                                 | 2            |
| Lanzamiento en el dominio de la agencia                                                                                  | 3            |

Cada hito termina con algo que la agencia puede usar de verdad ([hitos y alcance](docs/phase-1c-scope-and-closing.md)).

## Arquitectura

```mermaid
flowchart LR
    U["Visitantes, clientes<br/>y la agencia"] --> WEB
    subgraph CF["Cloudflare"]
        WEB["apps/web · Next.js<br/>sitio · galerías · panel"]
        ZIP["apps/zip-worker<br/>ZIP virtual"]
        R2[("R2<br/>fotos y videos")]
    end
    subgraph GC["Google Cloud"]
        API["apps/api · NestJS<br/>Cloud Run"]
    end
    subgraph SB["Supabase"]
        AUTH["Auth"]
        DB[("Postgres")]
    end
    WEB -->|"/api/* mismo origen + JWT"| API
    WEB -->|login| AUTH
    API -.->|"verifica el JWT (JWKS)"| AUTH
    API -->|Drizzle| DB
    API -->|"firma URLs de subida y descarga"| R2
    U -.->|"subida / descarga directa"| R2
    U -->|descarga del ZIP| ZIP
    ZIP --> R2
```

- **Next.js renderiza, NestJS decide.** El navegador solo habla con Next, y Next reenvía `/api/*` a Nest en el mismo origen, así que no hay CORS. Toda regla de negocio, permiso y filtro por agencia vive en Nest.
- **Los archivos nunca pasan por un servidor.** Nest firma URLs temporales de R2 y el navegador sube y descarga directo: los videos grandes no gastan tiempo de servidor y R2 no cobra la salida.
- **Multi-tenant desde el día uno:** una sola base de datos con `agency_id` en todas las tablas, y la agencia se resuelve por el dominio de la petición. RLS está activo en todas las tablas desde el inicio, y las políticas por agencia llegan antes que la segunda agencia.
- **Planes gratuitos por diseño, con tope real de gasto:** la API escala a cero y un corte automático desconecta la facturación si se supera el presupuesto mensual ([`infra/gcp`](infra/gcp/README.md)).

Diseño completo: [arquitectura](docs/phase-1a-architecture.md) · [datos y usuarios](docs/phase-1b-data-and-users.md) · [metodología](docs/phase-2-methodology.md).

## Stack

| Capa                  | Elección                                                                               |
| --------------------- | -------------------------------------------------------------------------------------- |
| Front                 | Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript                          |
| API                   | NestJS en Google Cloud Run (`us-east4`)                                                |
| Base de datos y auth  | Supabase Postgres + Supabase Auth; Drizzle ORM con migraciones SQL versionadas         |
| Archivos y ZIP        | Cloudflare R2 con URLs prefirmadas; Cloudflare Worker para el ZIP virtual              |
| Contratos compartidos | Esquemas Zod en `@focaldrop/shared`, validados en el navegador, en Nest y en el Worker |
| Monorepo y CI         | pnpm workspaces, Turborepo, GitHub Actions, Workload Identity Federation (sin llaves)  |
| Calidad               | ESLint con información de tipos, Prettier, Vitest, Husky + lint-staged                 |
| Monitoreo             | Sentry y UptimeRobot                                                                   |

## Estructura del repo

```text
apps/
  web/            Front en Next.js (hoy el panel; después el sitio y las galerías)
  api/            API en NestJS                   (en curso)
  zip-worker/     Worker de Cloudflare para el ZIP (hito 1)
packages/
  shared/         Esquemas Zod, tipos y constantes compartidos por todas las apps
infra/
  gcp/            Script de arranque de Google Cloud y corte automático de facturación
docs/             Bitácora de decisiones y documentos de diseño
.github/          Workflow de CI, plantillas de issues y PRs, Dependabot
```

## Cómo empezar

**Requisitos:** Git, Node.js 24 (ver `.nvmrc`) y pnpm 10.34.6.

```bash
npm install -g pnpm@10.34.6
git clone https://github.com/Rurbis/focaldrop.git
cd focaldrop
pnpm install
pnpm dev
```

El panel corre en http://localhost:3000/admin.

> **La base de datos local llega pronto.** Supabase corre en local con Docker mediante la CLI de Supabase, con datos de muestra de una agencia demo. Los pasos llegan con las issues #8 y #15.

## Comandos

Se corren desde la raíz del repo. Turborepo ejecuta cada tarea en las apps y paquetes que la tengan, compilando primero las dependencias.

| Comando                             | Qué hace                                  |
| ----------------------------------- | ----------------------------------------- |
| `pnpm dev`                          | Levanta todas las apps en modo desarrollo |
| `pnpm build`                        | Compila todas las apps y paquetes         |
| `pnpm lint`                         | ESLint, con información de tipos          |
| `pnpm typecheck`                    | Revisión de tipos de TypeScript           |
| `pnpm test`                         | Pruebas (Vitest)                          |
| `pnpm format` / `pnpm format:check` | Prettier                                  |

## Cómo contribuir

- **Ramas cortas** desde `main` (`feat/`, `fix/`, `chore/`, `docs/`, `ci/`, `spike/`) y **Conventional Commits** con _scope_: `feat(web): add login page`.
- Todo cambio entra por **pull request** con el checklist de la plantilla. Lo revisa la otra persona, los checks `quality` y `test` deben pasar, y el autor lo mezcla con **squash** después de la aprobación.
- Issues y PRs se escriben en español; títulos, commits y código, en inglés.
- La bitácora se actualiza en el mismo PR que el cambio que registra.

## Documentación

Los documentos de diseño viven en [`docs/`](docs/):

- [Bitácora](docs/project-log.md): todas las decisiones (D1–D128), pendientes, supuestos, glosario e historial.
- [Arquitectura](docs/phase-1a-architecture.md), [datos y usuarios](docs/phase-1b-data-and-users.md), [alcance y cierre](docs/phase-1c-scope-and-closing.md) y [metodología](docs/phase-2-methodology.md).
- Los ADRs (_Architecture Decision Records_) llegan a `docs/adr/`.

## Estado

Hito 0, fundaciones. Listo: monorepo, CI, paquete compartido y cuentas en la nube. En curso: esqueletos de la web y de la API, esquema de la base de datos, inicio de sesión y los primeros despliegues a staging. El avance se sigue en el [tablero del proyecto](https://github.com/users/Rurbis/projects/1).

## Licencia

© 2026 The Focal Drop authors. Todos los derechos reservados. Este repositorio es público como proyecto de portafolio; no se otorga licencia para usar, copiar, modificar ni distribuir el código.
