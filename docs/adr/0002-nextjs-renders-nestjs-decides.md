# ADR-0002: Next.js renderiza, NestJS decide

- Estado: aceptada · Fecha: 2026-10-09 · Reemplaza: — · Origen: D56, D62

## Contexto

El stack inicial (B1) era solo Next.js: páginas, Server Actions y route handlers sobre Supabase. El 2026-10-07 Fabian propuso NestJS para el backend: el equipo quiere experiencia de backend y el proyecto también es portafolio. Al tener dos aplicaciones había que repartir el trabajo sin duplicar reglas y sin perder lo que Next hace bien: el renderizado en el servidor, el SEO y las vistas previas de WhatsApp, que leen las `<meta>` sin ejecutar JavaScript.

## Decisión

- **Next.js (`apps/web`) renderiza:** presentación, SEO, caché de páginas por etiquetas y sesión del panel. No escribe en la BD ni decide permisos.
- **NestJS (`apps/api`) decide:** reglas de negocio, acceso a datos con Drizzle, permisos, firmas de R2, avisos y cron. Es la única app con credenciales de la BD y de R2 (el Worker de ZIP lee R2 por su _binding_, sin llaves).
- **Comunicación (D62):**
  - Los Server Components y las Server Actions llaman a Nest de servidor a servidor, con el JWT del usuario y el host de la agencia (`X-Tenant-Host`, D40).
  - El navegador solo habla con su mismo origen (`/api/*`, `/g/[token]/api/*`) y Next reenvía a Nest: sin CORS y con cookies propias.
  - `pg_cron` llama directo a Nest (`/cron/*`) con un secreto.
- El contrato son los esquemas Zod de `@focaldrop/shared`, que validan en Nest y en los formularios del front (D64).

Detalle: [Parte A §1 y §2](../phase-1a-architecture.md).

## Consecuencias

**Positivas**

- Una sola fuente de reglas y permisos. El front no puede saltárselas: no tiene credenciales de la BD y la Data API de Supabase está apagada (D60, D121).
- Cada quien trabaja en su app con un contrato tipado y pocos choques (reparto por capa, D99).
- Cubre el objetivo de aprendizaje de backend, y la estructura de Nest (módulos, guards, inyección de dependencias) aguanta el crecimiento a SaaS.
- La API es un contenedor portable (principio P5).

**Negativas**

- Unos 30–40 % más de esfuerzo hasta el MVP, dos despliegues y un segundo hosting (Cloud Run).
- Un salto de red más en cada página dinámica, y el arranque en frío de Cloud Run (1–3 s) tras un rato sin uso.
- Next mantiene un reenvío same-origin hacia Nest (#19).

**Riesgos**

- Que reglas de negocio se cuelen en Next "por rapidez". Mitigación: Next no tiene acceso a la BD y todo PR pasa por revisión cruzada.
- Latencia entre las dos apps. Mitigación: regiones vecinas en el este de EE. UU. (D41) y caché etiquetada en Next.

## Alternativas descartadas

| Opción                            | Por qué no                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Solo Next.js (B1)                 | Más simple: un despliegue y menos esfuerzo. No cubre el objetivo de backend del equipo.                                             |
| React SPA + NestJS                | El sitio público perdería el SEO y las vistas previas en WhatsApp.                                                                  |
| El navegador llama directo a Nest | Exige CORS, cookies entre dominios y exponer la URL de la API; la cookie de la galería ya no podría limitarse a `/g/<token>` (D43). |
