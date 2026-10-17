# Fase 1 · Parte C: Alcance y cierre

- **Versión:** v1.1 · 2026-10-11 (v1.1: D91–D97 aprobadas y P-C1 a P-C3 resueltas)
- **Estado:** ✅ aprobada por el equipo (2026-10-11)
- **Relacionado:** [project-log.md](project-log.md) (decisiones D#) · [phase-1a-architecture.md](phase-1a-architecture.md) (arquitectura, v3.1) · [phase-1b-data-and-users.md](phase-1b-data-and-users.md) (datos y usuarios, v1.2)

> Esta parte convierte el diseño de las Partes A y B en un plan que dos personas con 5–10 h/semana cada una pueden ejecutar. La regla que lo gobierna es D82: **el diseño completo es el destino; el MVP es la ruta más corta a que la agencia entregue su primera galería real.**

## Índice

1. [Objetivo del MVP](#1-objetivo-del-mvp)
2. [Hitos](#2-hitos)
3. [MoSCoW por área](#3-moscow-por-área)
4. [Criterios de "MVP terminado"](#4-criterios-de-mvp-terminado)
5. [Riesgos](#5-riesgos)
6. [Costos a 1, 10 y 100 agencias](#6-costos-a-1-10-y-100-agencias)
7. [ADRs propuestos](#7-adrs-propuestos)
8. [Propuesta de CLAUDE.md](#8-propuesta-de-claudemd)
9. [Decisiones propuestas y preguntas abiertas](#9-decisiones-propuestas-y-preguntas-abiertas)

---

## 1. Objetivo del MVP

**Una frase.** La agencia entrega galerías privadas a sus clientes con su propio dominio, sin intervención de ustedes, y tiene un sitio público que la representa.

**Lo que el MVP no intenta ser.** Ni un SaaS con alta de agencias en autoservicio, ni un constructor de páginas, ni un sistema de venta de fotos. Todo eso queda diseñado (Partes A y B) y preparado en el esquema, pero no se construye hasta que haya una segunda agencia o ingresos.

**Capacidad (S7).** 15 h/semana entre los dos, sostenidas. Las estimaciones incluyen el aprendizaje de NestJS, Drizzle, Uppy y Workers, y un margen del 30 % para imprevistos. Son órdenes de magnitud para planear hitos, no compromisos. La estimación de la revisión (250–350 h) se afinó a 305–375 h al detallar los hitos, y a 320–395 h cuando la Fase 2 bajó el hito 0 a issues (D109). Cada hito se corregirá igual en su semana 1.

---

## 2. Hitos

Cada hito termina con algo que la agencia puede ver o usar y con una demo corta a ella. Nada de un hito posterior se adelanta "porque ya estamos ahí".

| Hito | Entrega | Contenido | Horas | Semanas a 15 h |
|---|---|---|---|---|
| **0 · Fundaciones** | Un panel con login que lee datos de Nest, desplegado | Repo monorepo (pnpm + Turborepo), lint, formato, CI (lint, typecheck, tests, build). Entorno local (D90). Esqueleto Next + Nest + Supabase Auth con guards de agencia (S-0). **S-4: OpenNext en Workers Free → decisión del host (D83).** Cuenta de la plataforma, Bitwarden, Sentry, UptimeRobot, presupuestos (D86–D88). Owner creado por script (D94). ADRs iniciales y README con instalación local. | 65–80 *(ajustado por D109 al bajar a issues)* | 4–5 |
| **1 · Entrega de galerías** | La agencia entrega una galería real a un cliente real, con dominio temporal | Clientes. Galerías con máquina de estados y cron `lifecycle`. Subida con Uppy multipart, CRC-32 y `HeadObject` (S-5). Previews JPG/PNG y póster de MP4 (S-1 reducido). Publicar, link, copiar y WhatsApp. Vista del cliente: cuadrícula, visor, descarga individual. ZIP etapa 1 (S-2). Registro de descargas y avance X de Y. Outbox con 4 plantillas. Papelera y purga. Copia de respaldo de la agencia. Tests críticos. Staging en Cloud Run y en el host del front. | 140–170 | 10–12 |
| **2 · Sitio público** | El sitio de la agencia, aprobado por ella, en el dominio temporal | Tema por tokens. Portada, portafolio por categoría con subida optimizada, paquetes, contacto (Turnstile, límite por IP, WhatsApp), aviso de privacidad, SEO básico y sitemap, caché por etiquetas. Panel de configuración: tema, textos e imágenes de cada sección, contacto, redes y SEO. Moodboard y dos rondas de revisión (D24). | 80–100 | 6–7 |
| **3 · Lanzamiento** | Dominio propio, primera galería real con el dominio, costo ≤ US$10/mes | Dominio y DNS en Cloudflare. Correo: SPF, DKIM, DMARC y SMTP de Auth vía Resend. Buckets de producción y CORS. Respaldo nocturno (D4) y simulacro de restauración. Alertas probadas. Checklist de seguridad. Aviso de privacidad revisado por la agencia. Migración de host si S-4 falló. Runbook de operación. | 35–45 | 2–3 |
| **MVP total** | | | **320–395** | **22–27** (5–6 meses) |
| **4+ · Después del MVP** | Una mejora a la vez, en el orden del MoSCoW | PIN, Google, staff e invitaciones, selección en ZIP, Range y ZIP64, Guardar en Fotos, HEIC/RAW, avisos completos, testimonios, FAQ, blog, auditoría, estadísticas, RLS capa 2, secciones configurables, resumen semanal, exportación ARCO. | — | — |

**Por qué este orden.** El hito 1 es el valor real para la agencia y concentra las incógnitas técnicas (subida, ZIP, ciclo de vida): conviene enfrentarlas primero. El sitio público depende de insumos de la agencia (moodboard, textos, fotos) que tardan en llegar, así que va después y no bloquea nada. El lanzamiento es un hito propio porque dominio, correo y respaldos tienen tiempos de espera (DNS, verificación) y no conviene mezclarlos con desarrollo.

**Qué puede usar la agencia y cuándo.** Al cerrar el hito 1 puede entregar galerías reales con un dominio temporal (`*.workers.dev` o `*.vercel.app`, según S-4; en Vercel Hobby eso ya sería uso comercial, otra razón para preferir Cloudflare). Al cerrar el hito 3, todo con su dominio.

### 2.1 Reparto de tablas por hito (D89)

| Hito | Tablas que se crean |
|---|---|
| 0 | `agencies`, `agency_domains`, `profiles`, `agency_members` |
| 1 | `clients`, `galleries`, `gallery_recipients`, `gallery_access_links`, `gallery_files`, `gallery_extensions`, `downloads`, `download_items`, `notifications` |
| 2 | `agency_sites`, `site_pages`, `portfolio_categories`, `portfolio_items`, `packages`, `contact_requests`, `rate_limits` |
| 4+ | `agency_invitations`, `testimonials`, `faqs`, `blog_posts`, `audit_events`, `gallery_stats` |

Las columnas marcadas "PREPARADO" en el ERD (`playback_key`, `whatsapp_opt_in_at`, `recipient_user_id`, `verified_at`) sí se crean desde el inicio: son baratas y evitan migraciones después.

### 2.2 Ritmo de trabajo dentro de un hito

- **Semana 1 del hito:** spikes del hito y backlog en issues de GitHub (una épica por módulo de Nest, Parte A §2.4).
- **Cada semana:** una sesión corta de sincronización de los dos; cada quien toma issues de módulos distintos para no pisarse.
- **Última semana:** pruebas de punta a punta, demo a la agencia, retro de 20 minutos y ajuste del siguiente hito con lo aprendido.

---

## 3. MoSCoW por área

**Must** = sin esto no hay MVP (hitos 0–3) · **Should** = lo primero después de lanzar · **Could** = cuando sobre tiempo o lo pida una segunda agencia · **Won't** = fuera del horizonte; se reconsidera si cambia el negocio.

### 3.1 Galerías y ciclo de vida

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Crear, editar y borrar borradores; publicar con vencimiento a 30 días | Must | 1 | |
| Vencimiento automático, `pending_decision`, papelera de 7 días, purga con R2 vacío antes de borrar filas | Must | 1 | D14, D16, D48, D61 |
| Extender y restaurar | Must | 1 | D55 |
| "Eliminar ahora" (owner) | Must | 1 | D48 |
| Link único por galería; regenerar; cerrar sesiones | Must | 1 | D72 |
| Avance X de Y y primera apertura visibles en la lista de galerías | Must | 1 | D44 |
| Varios destinatarios por link | Must | 1 | D19; es solo una tabla |
| PIN con bloqueo progresivo | Should | 4 | D30, ~12 h. Ver P-C1 |
| Recordatorios a la agencia en los días 7, 30 y 53 | Should | 4 | En el MVP: aviso al vencer y 1 día antes de purgar |
| Auditoría (`audit_events`) y estadísticas (`gallery_stats`) | Should | 4 | D78, D79 |
| Reordenar a mano, favoritas, un link por destinatario | Could | — | |
| Venta de fotos, marca de agua, selección para edición (*proofing*) | Won't | — | Es otro producto |

### 3.2 Subida y previews

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Uppy multipart directo a R2, 4 archivos × 4 partes, reintentos, reanudación de partes | Must | 1 | S-5 |
| CRC-32 en Web Worker y `HeadObject` al completar | Must | 1 | D66 |
| Previews JPG/PNG/WebP (400 y 2048 px, WebP sin EXIF) y póster de MP4 H.264 | Must | 1 | D52 |
| Otros formatos → ícono; "Regenerar previews" | Must | 1 | |
| Subida desde celular en tandas con Wake Lock | Should | 4 | D12 |
| HEIC (nativo en Safari + libheif) | Should | 4 | Depende de la respuesta de la agencia |
| RAW (LibRaw WASM), HEVC y ProRes | Could | — | D9 |
| Transcodificación de video | Could | — | D10 |

### 3.3 Descargas

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Individual con URL prefirmada de 5 min y `attachment` | Must | 1 | D53 |
| ZIP de toda la galería, etapa 1: streaming con tamaño exacto, sin Range ni ZIP64 | Must | 1 | D84. Galerías > 4 GiB: aviso y descarga individual |
| Registro de descargas, `recordItems`, 100 % → aviso | Must | 1 | D74 |
| Copia de respaldo de la agencia desde el panel | Must | 1 | D15, D70. Mismo ZIP |
| ZIP de selección | Should | 4 | D21. Mismo motor, ~10 h de interfaz |
| Range y ZIP64 (etapa 2) | Should | 4 | |
| Guardar en Fotos (Web Share) | Should | 4 | D20, S-3 |

### 3.4 Avisos

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Outbox, dispatcher, reintentos, tope diario | Must | 1 | D47 |
| `gallery_published`, `gallery_expiring` (una vez, 3 días antes), `agency_gallery_pending_decision`, `agency_gallery_trash_warning` | Must | 1 | 4 plantillas con React Email (D95) |
| Correos de Auth (recuperar contraseña) | Must | 0 | Supabase; SMTP de Resend en el hito 3 |
| `agency_contact_request` | Must | 2 | |
| Canal `in_app` (campana del panel) | Should | 4 | En el MVP la información va en la lista de galerías |
| `gallery_expiring` 7/3/1, `gallery_not_opened`, `gallery_extended`, `agency_retention_reminder`, `staff_invitation` | Should | 4 | |
| Resumen semanal, WhatsApp Cloud API | Could | — | |

### 3.5 Sitio público

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Tema por tokens → CSS variables, renderizado en servidor, validado con Zod | Must | 2 | B4 |
| Layout fijo en código: hero, portafolio destacado, paquetes, contacto | Must | 2 | D85 |
| Portafolio por categoría con versiones optimizadas sin EXIF | Must | 2 | D51 |
| Paquetes con `price_type` e IVA incluido | Must | 2 | D22 |
| Contacto: formulario, Turnstile, límite por IP, consentimiento y botón de WhatsApp | Must | 2 | D54, D36 |
| Aviso de privacidad editable (`site_pages`) | Must | 2 | D36 |
| SEO: meta, Open Graph, sitemap, `robots.txt` | Must | 2 | |
| Caché por etiquetas e invalidación al guardar | Must | 2 | Parte A §3.4 |
| "Sobre nosotros", testimonios, FAQ | Should | 4 | D25 |
| Blog | Could | — | D28 |
| Secciones configurables (`type` + `variant`), borrador/publicado, verificación WCAG | Could | — | D85; cuando haya una segunda agencia |
| Constructor de páginas, varios idiomas | Won't | — | |

### 3.6 Panel y usuarios

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Login con correo y contraseña; registro público deshabilitado; owner creado por script | Must | 0 | D94. Ver P-C2 |
| Dashboard: galerías por estado y acciones pendientes | Must | 1 | |
| Clientes: crear, editar y borrar (owner) | Must | 1 | D71 |
| Aceptación de la política "entrega, no archivo" | Must | 1 | D15 |
| Panel responsivo | Must | 1 | D12 |
| Configuración del sitio | Must | 2 | |
| Google como método de login | Should | 4 | D29 |
| Staff, invitaciones y Auth Hook | Should | 4 | D26, D34, ~20 h |
| Preferencias de avisos | Should | 4 | D33 |
| Interfaz de SuperAdmin, selector de agencia, dominios desde el panel | Could | — | D27 |
| Facturación del SaaS | Won't | — | |

### 3.7 Infraestructura, calidad y operación

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Monorepo, CI, entorno local, deploy automático a staging | Must | 0 | |
| Host del front decidido con S-4 | Must | 0 | D83 |
| Sentry, UptimeRobot, presupuestos y alertas | Must | 0 | D86, D87 |
| Tests: máquina de estados (unitarios), aislamiento entre agencias (e2e), bytes del ZIP (integración con `unzip -t`), esquemas Zod | Must | 1 | |
| Respaldo nocturno y simulacro de restauración | Must | 3 | D4 |
| README, ADRs y runbook | Must | 0–3 | |
| Preview deployments por PR | Should | 4 | Depende del host |
| OpenAPI generado | Should | 4 | D64 |
| RLS capa 2 | Should | Antes de la segunda agencia | D59 |
| Reconciliación semanal R2 ↔ BD; exportación ARCO | Could | — | |

### 3.8 Seguridad

| Capacidad | Prioridad | Hito | Nota |
|---|---|---|---|
| Guards de JWT, agencia y rol; repositorios con `agency_id` obligatorio; 404 entre agencias | Must | 0–1 | D59 |
| API automática de Supabase bloqueada | Must | 0 | D60 |
| Escaneo de secretos en GitHub; secretos solo en Nest | Must | 0 | D6 |
| Tokens y PIN cifrados + hash | Must | 1 | D42 |
| Cookie de sesión de galería firmada | Must | 1 | D43 |
| Link de ZIP firmado con HMAC y revocable | Must | 1 | D65 |
| `noindex`, `no-referrer`, TTL cortos, `attachment` | Must | 1 | D53 |
| Turnstile y límite por IP en el contacto | Must | 2 | D54 |
| Límite por IP para el PIN | Should | 4 | Con el PIN |

---

## 4. Criterios de "MVP terminado"

El MVP está terminado cuando **todo** esto es verdad:

1. La agencia ha entregado al menos **3 galerías reales** a clientes reales con su dominio, sin intervención de ustedes.
2. Un cliente descargó un **ZIP de más de 2 GB** en Windows y lo abrió sin errores; otro abrió la galería en iPhone y descargó una foto.
3. Una galería **venció sola**, pasó a la papelera y se purgó, y el prefijo de R2 quedó vacío (verificado a mano una vez).
4. El sitio público está publicado con el dominio, **aprobado por la agencia**, con Lighthouse ≥ 90 en rendimiento y SEO en móvil.
5. El **respaldo nocturno** corre y una restauración se probó en un proyecto vacío.
6. Las alertas de Sentry y UptimeRobot están activas y **se recibieron al menos una vez** (provocadas a propósito).
7. CI en verde con los tests críticos: aislamiento entre agencias, máquina de estados y bytes del ZIP.
8. Una persona nueva instala el entorno local con el README en **menos de 30 minutos**.
9. El costo mensual real es **≤ US$10 más el dominio**.

---

## 5. Riesgos

Probabilidad e impacto: alta / media / baja.

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | **El alcance crece** ("una cosita más") | Alta | Alto | MoSCoW escrito y aprobado (D92). Todo lo nuevo entra como Should al backlog, no al hito en curso. La retro de cada hito revisa si algo debe subir de prioridad. |
| R2 | **Abandono por falta de resultados visibles** | Media | Alto | Hitos usables y demo a la agencia al cierre de cada uno. El hito 1 ya entrega valor real. |
| R3 | **ZIP corrupto en algún descompresor** | Media | Alto | Etapa 1 simple (D84); tests con `unzip -t`, 7-Zip, Windows, macOS, iOS y Android; fallback a descarga individual. |
| R4 | **OpenNext no cabe en Workers Free** | Media | Medio | S-4 en el hito 0; Vercel Hobby y Pro como respaldo; código portable (P5). |
| R5 | **La subida de 10 GB falla desde la red de la agencia** | Media | Alto | S-5 con archivos reales y la conexión real de la agencia; reanudación de partes; tandas. |
| R6 | **La agencia no responde** (muestras, moodboard, aviso legal) | Media | Medio | Lista de pendientes con fechas (bitácora §6). El hito 1 no depende del diseño del sitio. |
| R7 | **Arranques en frío de Cloud Run molestan** | Media | Bajo | Sitio público cacheado en Next; UptimeRobot cada 5 min; instancia mínima (US$8–10) como excepción documentada. |
| R8 | **Supabase Free se pausa** en desarrollo | Alta | Bajo | Trabajo en local con la CLI (D90); el proyecto compartido se reactiva a mano. En producción, el cron genera actividad. |
| R9 | **Cobro inesperado** | Baja | Medio | D87: presupuestos, alertas, `max-instances`, sin `min-instances`. |
| R10 | **Pérdida de datos** | Baja | Alto | D4: respaldo nocturno cifrado y simulacro de restauración antes de lanzar. R2 sin reglas de borrado por antigüedad (D49). |
| R11 | **Dependencia de Cloudflare** | Baja | Medio | APIs estándar (S3, HTTP). El Worker de ZIP es la única pieza específica, de unas 300 líneas; su equivalente existe en cualquier runtime con streams. |
| R12 | **Incumplimiento de la LFPDPPP** | Baja | Alto | Aviso de privacidad revisado por la agencia; minimización; retención (Parte B §6.2); sin GPS en previews. |
| R13 | **Los dos tocan el mismo código** | Media | Bajo | Módulos de Nest como frontera: cada quien toma épicas distintas; PRs pequeños con CI en verde. |

---

## 6. Costos a 1, 10 y 100 agencias

Supuestos por agencia: 10 galerías/mes de 7 GB, residencia promedio de 1.5 meses (≈ 110 GB-mes con previews), ~200 correos/mes, ~20k peticiones/mes a Nest. Precios de octubre de 2026 en USD por mes; los planes gratuitos se agotan donde se indica. Son estimaciones para planear, no cotizaciones.

| Concepto | 1 agencia | 10 agencias | 100 agencias |
|---|---|---|---|
| R2 (US$0.015/GB-mes sobre 10 GB gratis; operaciones despreciables) | 1.5–3.5 | ~15 | ~150 |
| Cloudflare Workers (front + ZIP) | 0–5 | 5 | ~10 |
| Cloud Run (API) | 0 | 0–5 | 15–30 |
| Supabase | 0 | 25 (Pro: backups, sin pausa, 8 GB) | 40–60 (Pro + cómputo Small) |
| Resend | 0 | 20 (Pro: el tope de 100/día ya no alcanza) | 20 |
| Sentry | 0 | 0–26 | 26 |
| Dominio de la plataforma | ~1 | ~1 | ~1 |
| **Total** | **3–10** | **65–100** | **260–300** |
| **Por agencia** | 3–10 | 7–10 | ~3 |

Lo que dice la tabla:

- **El costo dominante es el almacenamiento** y crece con los GB, no con el número de agencias. Un precio por GB-mes o por galerías al mes es más justo que una tarifa plana.
- Con un precio de referencia de **MXN 400–600 al mes por agencia** (≈ US$20–30), el margen bruto supera el 60 % desde 10 agencias. No es un plan de negocio; es la comprobación de que el modelo no pierde dinero.
- Los saltos de costo están en **10 agencias** (Supabase Pro y Resend Pro), no en 100: la arquitectura escala sin cambiar de proveedor.

**Prerrequisitos técnicos antes de la segunda agencia** (no cuestan dinero, cuestan horas): RLS capa 2 (D59), script de alta de agencias (Parte B §9.4), Cloudflare for SaaS para dominios propios (gratis hasta 100 hostnames) y un contrato de encargo de datos (LFPDPPP). **Antes de 100:** interfaz de SuperAdmin, `min-instances` en Cloud Run y Supabase con cómputo dedicado.

---

## 7. ADRs propuestos

Formato de cada ADR en `docs/adr/NNNN-titulo.md` (D96):

```text
# ADR-0006: ZIP virtual en un Cloudflare Worker
- Estado: aceptada · Fecha: 2026-10-09 · Reemplaza: — · Origen: D65, D66, D84
## Contexto
## Decisión
## Consecuencias (positivas, negativas, riesgos)
## Alternativas descartadas
```

Cada ADR cabe en una pantalla. El detalle largo ya existe en las Partes A y B, que se migran a `docs/` al crear el repo; el ADR las enlaza.

| # | Título | Origen |
|---|---|---|
| 0001 | Multi-tenancy con base de datos compartida y `agency_id` en todas las tablas | B2, D59, D69 |
| 0002 | Next.js renderiza, NestJS decide | D56, D62 |
| 0003 | Supabase Auth con validación JWKS en Nest y API automática bloqueada | D57, D60 |
| 0004 | Drizzle con migraciones SQL versionadas; enumeraciones como `text` + `CHECK`; UUID v7 | D58, D67, D68 |
| 0005 | Archivos directo a R2 con URLs prefirmadas y previews en el navegador | B6, D9, D13, D52 |
| 0006 | ZIP virtual en un Cloudflare Worker con CRC-32 calculado al subir | D65, D66, D84 |
| 0007 | Ciclo de vida de galerías con transiciones atómicas y purga con la BD al final | D14, D16, D48, D61 |
| 0008 | Outbox de avisos con canales como providers de Nest | D47 |
| 0009 | Tokens y PIN cifrados + hash; sesión de galería en cookie firmada | D42, D43 |
| 0010 | Hosting: Cloudflare para el front, Cloud Run para la API, todo gratis hasta lanzar | D1, D63, D83, D90 |
| 0011 | Tema por tokens y layout en código en la v1 | B4, D85 |
| 0012 | MVP por hitos usables | D82, D91, D92 |
| 0013 | Observabilidad y protección de costos | D86, D87 |

---

## 8. Propuesta de CLAUDE.md

Punto de partida para el repo (D97). Los comandos se completan en la Fase 2 y el nombre cuando se decida (D37).

````markdown
# <plataforma> · guía para Claude Code

## Qué es
Plataforma multi-tenant para agencias de fotografía: sitio público por agencia y entrega de
galerías privadas que vencen a los 30 días. Primera agencia: una real, en México.
Interfaz en es-MX. Dos desarrolladores a 15 h/semana; el objetivo es entender y poder
defender cada decisión.

## Reglas que no se negocian
- Nada de la agencia en el código (nombre, logo, colores, textos): todo viene de la BD.
- Los archivos nunca pasan por Next ni por Nest: el navegador habla directo con R2 y el ZIP
  lo compone el Worker.
- Toda consulta lleva `agency_id` tomado del contexto de la petición, nunca del body.
  Un recurso de otra agencia responde 404.
- Transiciones de estado: `UPDATE … WHERE status = … RETURNING` + fila en el outbox,
  en la misma transacción.
- Secretos solo en Nest y en `.env` locales; nunca en el repo ni en el front.
- Cero costo fuera de los planes gratuitos, salvo lo listado en `docs/project-log.md` §4.1.

## Estructura
- `apps/web`: Next.js 16 (App Router). Renderiza, cachea por etiquetas, reenvía `/api/*` a Nest.
- `apps/api`: NestJS. Reglas de negocio, datos (Drizzle), firmas de R2, avisos, cron.
- `apps/zip-worker`: Cloudflare Worker. ZIP virtual desde R2 con link firmado.
- `packages/shared`: esquemas Zod, tipos y plantillas de correo.

## Convenciones
- Código, identificadores, ramas y commits en inglés; interfaz y docs en español (es-MX).
- Commits con Conventional Commits. Ramas `feat/…`, `fix/…`, `chore/…` desde `main`;
  PR con CI en verde antes de mezclar.
- Rutas públicas de Next en español; panel `/admin/*` y API de Nest en inglés.
- Tablas `snake_case` en plural; enumeraciones `text` + `CHECK`; ids `uuid` v7 generados
  en Nest; dinero en centavos; fechas `timestamptz` en UTC.
- JSONB solo con un esquema Zod en `packages/shared`.

## Comandos
(se completan en la Fase 2: dev, test, lint, db:migrate, db:seed)

## Antes de cambiar algo
1. Lee `docs/project-log.md` (decisiones D#) y el ADR del área en `docs/adr/`.
2. Si una decisión estorba, escribe un ADR nuevo que la reemplace; no la edites en silencio.
3. Si falta información, pregunta con opciones; marca lo asumido como **Supuesto**.
4. Tests obligatorios al tocar su área: aislamiento entre agencias (e2e), máquina de estados
   (unitarios), bytes del ZIP (integración).

## Alcance
El MoSCoW vigente está en `docs/phase-1c-scope-and-closing.md` §3. Lo que no es Must del
hito en curso va al backlog, no al PR.
````

---

## 9. Decisiones propuestas y preguntas abiertas

### 9.1 Decisiones de esta parte (✅ aprobadas el 2026-10-11)

| # | Decisión | Sección |
|---|---|---|
| D91 | Hitos 0–3 con los alcances y estimaciones de §2; demo a la agencia al cierre de cada hito | §2 |
| D92 | El MoSCoW de §3 es el alcance vigente; todo lo nuevo entra como Should al backlog | §3 |
| D93 | Los 9 criterios de "MVP terminado" de §4 | §4 |
| D94 | Solo el owner en el MVP, creado por script, con el registro público deshabilitado en Supabase Auth; staff, invitaciones y Auth Hook pasan a Should | §3.6 |
| D95 | Avisos del MVP: outbox completo, 5 plantillas (4 de galerías + contacto), sin canal `in_app` | §3.4 |
| D96 | ADRs en `docs/adr/NNNN-titulo.md` con el formato de §7, creados en el hito 0 | §7 |
| D97 | `CLAUDE.md` de §8 como punto de partida | §8 |

### 9.2 Preguntas resueltas (✅ 2026-10-11)

| # | Pregunta | Respuesta | Efecto |
|---|---|---|---|
| P-C1 | ¿El PIN entra al MVP? | Should, después de lanzar | §3.1 y §3.8 quedan como están. El token de 128 bits protege el link en el MVP. |
| P-C2 | ¿El MVP arranca solo con el owner? | Sí: owner por script y registro cerrado | D94 confirmada. Staff e invitaciones son lo primero del hito 4+ si la agencia contrata a alguien. |
| P-C3 | ¿El tamaño del MVP es el correcto? | Como está: hitos 0 a 3 | D91 y D92 confirmadas. Si la agencia necesita entregar con su dominio antes del sitio, se reordena a 0, 1, 3, 2 sin cambiar el alcance. |

Con esto, la Fase 1 queda completa. Se cierra cuando el equipo escriba "Fase 1 aprobada"; entonces empieza la Fase 2 (metodología y división del trabajo).
