# Bitácora del proyecto

> **Documento vivo.** Resume todo lo acordado, lo pendiente y el estado del proyecto. Vive en `docs/` del repo desde el 2026-10-15 (#23, D128) y **se actualiza en el PR de cada issue**: las decisiones y el tiempo real viajan con el código y los revisa la otra persona. Las decisiones importantes se resumen como ADRs en `docs/adr/`.
>
> **Repo público:** aquí van decisiones y sus razones, nunca datos personales ni detalles operativos de las cuentas (quién paga, datos fiscales, dónde vive el 2FA, cuentas de recuperación). Eso vive en el gestor de contraseñas del equipo.

- **Última actualización:** 2026-10-15
- **Estado:** Fases 1 y 2 **aprobadas (2026-10-11)** · **Fase 3 en curso: hito 0** · #1 ✅ (1.25 h) · #2 ✅ (≈ 1.5 h) · #5 ✅ (1.25 h) · #6 ✅ (1 h) · #30 ✅ (1 h) · #9 ✅ (1.5 h) · #3 ✅ (≈ 1.25 h) · #4 ✅ (≈ 1.25 h) · #7 ✅ (≈ 2 h) · #17 ✅ (≈ 1 h) · **en revisión:** #23 parcial (PR #36), #25 parcial (PR #37) y #8 de Fabian (PR #38) · S-4 (#21) parcial (D129) · **siguiente para el dueño del repo:** revisar el PR #40 (#10 de Fabian); la #18 espera el PR #38, con cambios pedidos.
- **Nombre de la plataforma:** **Focal Drop** (D118), identificador técnico `focaldrop`. Antes: nombre en clave `darkroom` (D98).
- **Repo:** https://github.com/Rurbis/focaldrop (local: `…\Fotos Jr\focaldrop`) · **Tablero:** https://github.com/users/Rurbis/projects/1

---

## 1. Contexto

**Equipo.** Dos desarrolladores full-stack recién egresados (dueño del repo + colaborador), 5–10 h/semana cada uno. Objetivo personal: entender y poder defender cada decisión técnica (entrevistas). El compañero quiere ganar experiencia de backend con NestJS (D56).

**Por qué existe el proyecto.**
1. Necesidad real: la agencia de fotografía de un amigo la usará en producción. Su nombre probablemente cambiará → **nada de la agencia (nombre, logo, colores, textos) queda fijo en el código**.
2. Portafolio para CV/GitHub → importa la calidad del repo (README, commits, decisiones documentadas, CI, tests en partes críticas).
3. Futuro: venderlo como SaaS multi-tenant / white-label.

**Mercado.** México. Interfaz en español. Código, tablas, variables, ramas y commits en inglés.

**Presupuesto.** Planes gratuitos. Gastos aceptados: almacenamiento R2 sobre el nivel gratuito, dominio y correo (si supera el plan gratuito). Cualquier otro costo es una excepción documentada (monto, razón, alternativa gratuita): ver §4.1.
Refinado en D1/D5: **todo gratis durante el desarrollo; se paga al lanzar o cuando un límite real lo exija.** Paga la agencia (D2). Desarrollo en local primero; la tarjeta solo entra para Google Cloud en el despliegue de prueba y para R2 al empezar la subida de archivos (D90).

**Volumen esperado.** 5–15 galerías/mes, 300–1,000 archivos cada una; galería típica < 10 GB (D11).

## 2. Reglas de trabajo

- Tres fases. No se avanza sin aprobación explícita ("Fase X aprobada").
- Fases 1 y 2: sin código de aplicación ni comandos de instalación. Solo documentos de diseño en Markdown/Mermaid (autorizados en la carpeta `files/`).
- Si falta información, se pregunta. Lo asumido se marca como **Supuesto**.
- **Las preguntas se hacen siempre con el selector interactivo de opciones** (una tanda a la vez), no como texto suelto.
- Si algo propuesto es mala idea, se dice directamente con alternativa.
- Decisiones importantes: opciones con pros/contras y recomendación clara.
- Al cerrar cada fase: ADRs breves + propuesta de `CLAUDE.md`.
- **El MVP se construye por hitos usables** (D82): cada hito termina con algo que la agencia puede usar de verdad. Lo que no es Must del hito en curso va al backlog, no al hito.
- **Spikes antes de más documentos:** tras la Parte C y la Fase 2 no se escriben más documentos largos. El diseño sigue en ADRs cortos dentro del repo y se ajusta con lo que enseñen los spikes.

## 3. Estado de las fases

| Fase | Estado |
|---|---|
| **1 · Producto y arquitectura** | ✅ **Aprobada el 2026-10-11** (Partes A v3.1, B v1.2 y C v1.1; revisión de alcance D82–D90) |
| **2 · Metodología y división del trabajo** | ✅ **Aprobada el 2026-10-11** (documento v1.1; D98–D110) |
| **3 · Ejecución** | 🟡 Hito 0 en curso desde el 2026-10-11 (Fase 2 §9). Cerradas: #1–#7, #9, #17 y #30. En revisión: #23 y #25 (parciales) y #8 (Fabian). Siguiente: revisar el PR #40 (#10); la #18 espera el #38. Tiempos reales en §10. |

Documentos de la Fase 1:
- [phase-1a-architecture.md](phase-1a-architecture.md): Parte A, arquitectura (v3.1 ✅).
- [phase-1b-data-and-users.md](phase-1b-data-and-users.md): Parte B, datos y usuarios (v1.2 ✅).
- [phase-1c-scope-and-closing.md](phase-1c-scope-and-closing.md): Parte C, alcance y cierre (v1.1 ✅): hitos, MoSCoW, criterios de "terminado", riesgos, costos, ADRs y `CLAUDE.md`.

Documentos de la Fase 2:
- [phase-2-methodology.md](phase-2-methodology.md): metodología, repo, monorepo, flujo de Git, entornos y secretos, entorno local, CI/CD, calidad, división del trabajo y backlog del hito 0 (v1.1 ✅).

## 4. Stack vigente

| Pieza | Elección | Estado |
|---|---|---|
| Front | Next.js 16 (App Router, React) + TypeScript: renderizado, SSR y SEO | Decidido (B1, D56) |
| API | **NestJS** + TypeScript: reglas de negocio, datos, cron, firmas de R2 | Decidido (D56) |
| ZIP | **Cloudflare Worker** que compone el ZIP al vuelo desde R2, con reanudación (Range) | Decidido (D65) |
| Estructura | Monorepo: `apps/web`, `apps/api`, `apps/zip-worker`, `packages/shared` (esquemas Zod y tipos compartidos) | Decidido (D56, D65) |
| Estilos | Tailwind CSS v4 + CSS variables por agencia | Decidido (B1, B4) |
| Hosting del front | **Cloudflare Workers (OpenNext) desde el inicio** si el spike S-4 lo confirma; si no, Vercel Hobby en desarrollo y Vercel Pro al lanzar | D1, D83 · S-4 en el hito 0 |
| Hosting de la API | Google Cloud Run (plan gratuito; escala a cero) | D56, D63 |
| Hosting del Worker de ZIP | Cloudflare Workers: Free en desarrollo; Paid en producción **solo si S-2 muestra que Free no alcanza** | D65, D84 |
| BD | Supabase Postgres (`pg_cron`, Vault) + **Drizzle** como ORM | Decidido · región `us-east-1` (D41, D58) |
| Auth | Supabase Auth (correo + contraseña, Google); Nest valida el JWT | Decidido (D57) |
| Archivos | Cloudflare R2: buckets privado, público y de respaldos | Decidido (D50) |
| Correo | Resend + React Email | Decidido |
| Anti-spam | Cloudflare Turnstile | Decidido |
| Video del portafolio | Embeds de YouTube/Vimeo | D35 |
| Monitoreo | Sentry (errores) + UptimeRobot (disponibilidad), planes gratuitos | D86 |
| Monorepo y CI | pnpm workspaces + Turborepo; GitHub Actions; Workload Identity Federation hacia Google Cloud | D103, D106 |
| Desarrollo local | Supabase CLI (Postgres, Auth, `pg_cron`, visor de correos) + Nest y Next locales + `wrangler dev`; bucket R2 de desarrollo | D90 · detalle en la Fase 2 |

### 4.1 Excepciones de costo (fuera de los gastos aceptados)

| Excepción | Monto | Cuándo | Por qué | Alternativa gratuita |
|---|---|---|---|---|
| **Cloudflare Workers Paid** | US$5/mes | **Condicional** (D84): solo si S-2 muestra que el Worker de ZIP excede los 10 ms de CPU o las 1,000 lecturas a R2 del plan Free, o si el front en Cloudflare lo necesita (D83). | Una sola suscripción cubre el Worker de ZIP y el front. | Quedarse en Free si S-2 y S-4 caben. |
| Vercel Pro (front) | US$20/mes | Solo si S-4 descarta Cloudflare (D83) | Vercel Hobby prohíbe el uso comercial, y la primera galería real ya lo es. | Cloudflare Workers: Free sin restricción comercial, o Paid compartido con la fila anterior. |
| Instancia mínima de Cloud Run | ~US$8–10/mes | Solo si los arranques en frío molestan en la práctica | Evitar los 1–3 s del arranque en frío. | Aceptar el arranque en frío; el job de cada 10 min mantiene despierta la API casi siempre. |
| Supabase Pro | US$25/mes | Opcional, cuando haya ingresos o 2+ agencias | Backups gestionados y sin pausa por inactividad. | Respaldo propio nocturno (D4). |

### 4.2 Gastos reales

| Concepto | Monto | Desde | Quién paga | Nota |
|---|---|---|---|---|
| Dominio **focaldrop.com** (Cloudflare Registrar) | US$10.46/año | 2026-10-13 | Los desarrolladores (D119) | Renovación automática; vence el 2027-10-14. Gasto aceptado (dominio), no es excepción. |

## 5. Registro de decisiones

Estado: ✅ aprobada · 🟡 propuesta (pendiente de aprobación) · ~~tachada~~ = reemplazada.

### Base (evaluación inicial, sin objeciones) ✅

| # | Decisión |
|---|---|
| B1 | Stack: Next.js App Router + TS, Tailwind v4, Supabase (Postgres, Auth, RLS), Cloudflare R2, Resend. *Ampliado con NestJS (D56) y el Worker de ZIP (D65).* |
| B2 | Multi-tenancy: BD compartida + `agency_id` en todas las tablas. Descartados: schema por agencia y proyecto Supabase por agencia. *El aislamiento se aplica según D59/D60: primero en código y con RLS por agencia antes del SaaS.* |
| B3 | Resolución del tenant por el header `Host` + tabla `agency_domains`. |
| B4 | Theming: tokens en BD → CSS variables. Catálogo curado de fuentes con `next/font`. Una plantilla con secciones configurables (orden, visibilidad, textos), con `template_key` y `variant` preparados. Sin page builder. |
| B5 | i18n ligero: textos de UI en un diccionario `es-MX` centralizado + formato con `Intl`. Sin librería ni locale en la URL. |
| B6 | Archivos: navegador ↔ R2 directo con URLs prefirmadas (multipart para archivos grandes). Las previews se generan en el navegador de la agencia. *El ZIP se compone en un Worker junto a R2 (D65).* |

### Cambio de stack ✅

| # | Decisión | Detalle |
|---|---|---|
| D56 | **Next.js (front) + NestJS (API) + Postgres + Tailwind** | Propuesta del compañero, adoptada para cubrir el objetivo de aprendizaje (backend con Nest). Se descartó React SPA porque el sitio público perdería SEO y vistas previas en WhatsApp (que leen las `<meta>` sin ejecutar JS). Costos asumidos: ~30–40 % más esfuerzo hasta el MVP, dos deploys y un segundo hosting (Cloud Run, con arranques en frío de 1–3 s). Reemplaza en parte a B1 y B2. |
| D57 | **Autenticación: Supabase Auth + Nest valida** | Supabase maneja la identidad: contraseñas, Google, recuperación, invitaciones y registro solo por invitación. Nest verifica el JWT con las llaves públicas de Supabase (JWKS) y aplica roles y agencia en guards. |
| D58 | **ORM: Drizzle** | Esquema en TypeScript y consultas cercanas al SQL. Migraciones como archivos `.sql` versionados en el repo, generados con `drizzle-kit`. |
| D59 | **Aislamiento por capas** | MVP: guard + contexto de agencia por request (AsyncLocalStorage) + repositorios que exigen `agency_id` + tests e2e que intentan cruzar agencias. **Antes de dar de alta una segunda agencia**: RLS por agencia como segunda capa (transacción por request con `set_config('app.agency_id', …)`). |
| D60 | **API automática de Supabase bloqueada** | RLS activado en todas las tablas, sin políticas para `anon` ni `authenticated`. Nest se conecta con un rol propio `app_api` que tiene una política "todo permitido" en el MVP; en la capa 2 se reemplaza por políticas por agencia. |
| D61 | **Lógica de negocio en servicios de Nest** | Las transiciones de estado (vencer, extender, papelera, purga) y el registro de descargas se hacen en transacciones de Drizzle (`UPDATE … WHERE status = … RETURNING` + insert en el outbox). |
| D62 | **Comunicación Next ↔ Nest** | Server Components y Server Actions llaman a Nest de servidor a servidor, con JWT y host de la agencia. Las llamadas del navegador van al mismo origen (`/api/*`, `/g/[token]/api/*`) y Next las reenvía a Nest. El cron llama directo a Nest. |
| D63 | **Configuración de Cloud Run** | Región `us-east4`, junto a Supabase `us-east-1` y Vercel `iad1`. Escala a cero. Conexión a Postgres por el pooler de Supabase en modo transacción. |
| D64 | **Contrato de API: REST + Zod compartido + OpenAPI** | Esquemas Zod en `packages/shared` que validan en Nest y en los formularios del front. Documentación OpenAPI generada automáticamente. *(Detalle en la Fase 2.)* |

### ZIP virtual ✅

| # | Decisión | Detalle |
|---|---|---|
| D65 | **ZIP virtual en un Cloudflare Worker** (reemplaza a D45) | `apps/zip-worker` compone el ZIP **al vuelo** a partir de los originales en R2, sin guardarlo nunca. Como se conocen de antemano el tamaño y el CRC-32 de cada archivo, el Worker sabe el tamaño total (progreso real) y puede atender **peticiones Range** (la descarga se reanuda si se corta). Siempre está al día (la lista se arma al hacer clic), funciona en cualquier dispositivo como una descarga normal y no duplica el almacenamiento. Mismo mecanismo para "todo" y para "selección". Link firmado por Nest (HMAC, 24 h), revocable al borrar el manifiesto. Es la técnica de `mod_zip` de NGINX. Excepción: Workers Paid US$5/mes en producción. |
| D66 | **CRC-32 calculado al subir** | El navegador de la agencia calcula el CRC-32 de cada archivo durante la subida (Web Worker, lectura secuencial del archivo local, en paralelo a la subida). Se guarda en `gallery_files.crc32`. Un archivo no cuenta como `uploaded` sin CRC. Motivo: R2 no ofrece el CRC-32 del archivo completo en subidas multipart. |

Opciones descartadas para el ZIP (2026-10-09), para futuras referencias:

| Opción | Por qué se descartó |
|---|---|
| ZIP en el navegador del cliente (D45) | Compatibilidad dudosa en Safari/iOS, no se reanuda y depende de que la página siga viva. |
| ZIP pregenerado en el navegador de la agencia | Duplica el tiempo de subida. Agregar una sola foto obliga a rehacer el ZIP completo, y la agencia ya no tiene los demás archivos en su equipo. Duplica el almacenamiento. |
| ZIP pregenerado en Nest (Cloud Run) | Google cobra por enviar los datos de vuelta a R2 (~US$1.20 por cada ZIP de 10 GB). Duplica el almacenamiento. |
| ZIP pregenerado en un Worker | Duplica el almacenamiento, queda desactualizado tras cada cambio y su construcción por partes es compleja. |

### Infraestructura y costos ✅

| # | Decisión | Detalle |
|---|---|---|
| D1 | Hosting en dos etapas | Desarrollo en Vercel Hobby ($0). Antes de la primera galería real o de publicar el sitio con el dominio de la agencia, se migra a un host que permita uso comercial: Vercel Pro (US$20/mes, sin migración) o Cloudflare Workers (US$0–5/mes, migración pequeña). Un spike en Cloudflare a mitad del desarrollo da los datos. Regla: código portable, sin servicios exclusivos de Vercel (Blob, KV, Edge Config, Cron, optimización de imágenes). |
| D2 | Paga la agencia | Cuentas (Cloudflare, Supabase, Resend, Google Cloud) a nombre de la plataforma, con un correo compartido. La agencia paga con tarjeta en la cuenta o reembolsa. Así el SaaS no requiere migrar cuentas. |
| D3 | R2 en el plan gratuito durante el desarrollo | 10 GB-mes. Activarlo exige registrar un método de pago. Se cobra por promedio mensual. Alerta de facturación configurada. Datos de prueba pequeños. |
| D4 | Respaldo propio de la BD | Workflow nocturno de GitHub Actions: `supabase db dump` → cifrado → bucket de respaldos en R2. Se construye antes del lanzamiento, con un simulacro de restauración. |
| D5 | Gastos diferidos | Todo se paga al lanzar o cuando un límite real lo exija. Las excepciones vigentes están en §4.1. |
| D6 | Repositorio público, sin licencia | "All rights reserved". Cero secretos y cero datos reales en el repo. Escaneo de secretos de GitHub activado. Logs de Actions públicos: los respaldos se cifran y nunca se imprimen. |
| D7 | Sin dominio hasta el lanzamiento | En desarrollo: `localhost`, `*.vercel.app` y `*.workers.dev`. Fallback del tenant: host desconocido fuera de producción → agencia por defecto (variable de entorno). El dominio es requisito para lanzar. |
| D8 | Correos desde el dominio futuro | `avisos@<dominio>` vía Resend, con Reply-To al Gmail de la agencia. Los avisos a la agencia llegan a su Gmail. En desarrollo, los correos se capturan en el visor local de Supabase. |
| D11 | Costo estimado de R2 para la agencia | ≈ US$0.5–3.5/mes (5–15 galerías/mes de 5–10 GB, residencia promedio de 1.5 meses). El ZIP virtual no añade almacenamiento. |

### Archivos y medios ✅

| # | Decisión | Detalle |
|---|---|---|
| D9 | Todos los formatos; previews en el navegador del admin | JPG/PNG/GIF: nativo. HEIC: nativo en Safari o WASM (libheif). RAW: JPEG incrustado extraído con LibRaw WASM. Video H.264/HEVC: póster con `<video>` + canvas si el equipo lo decodifica. ProRes y otros: ícono. |
| D10 | Sin transcodificación de video en el MVP | El original se reproduce si el navegador puede; si no, se ofrece la descarga. `playback_key` queda preparado. Opciones futuras: proxy con WebCodecs ($0), worker con ffmpeg en VPS (~US$4–6/mes, excepción), o que la agencia suba su propia versión MP4 H.264. Se decide después del lanzamiento. |
| D12 | Dónde se sube | Computadora (Chrome, Edge, Safari): soporte completo. Celular: tandas pequeñas, con Wake Lock y reanudación. Panel responsivo como prioridad. |
| D13 | Flujo de subida | El original va primero (es el entregable), junto con su CRC-32 (D66). Las previews se generan en Web Workers en paralelo y su fallo no bloquea nada ("Regenerar previews"). Reanudar exige volver a seleccionar los archivos (restricción de seguridad del navegador); las partes multipart ya subidas se reutilizan. |
| D35 | Videos del portafolio vía YouTube/Vimeo | `youtube-nocookie.com` + fachada (el iframe se carga al hacer clic). |

### Galerías y ciclo de vida ✅

| # | Decisión | Detalle |
|---|---|---|
| — | Vencimiento | 23:59 (America/Mexico_City) del día 30 después de publicar. Descargas ilimitadas mientras esté vigente. |
| D14 | Gracia antes de borrar | Si vence con todo descargado: `pending_deletion` 7 días (restaurable) → borrado. |
| D15 | Respaldo de la agencia desconocido | Aviso "entrega, no archivo" aceptado una vez por agencia (`storage_policy_accepted_at`). Doble aviso antes de cualquier borrado automático. La agencia puede descargar la galería completa desde el panel (con el mismo ZIP virtual). Recomendar a la agencia un respaldo propio. |
| D16 | Retención máxima sin decisión: 60 días | Recordatorios a la agencia en los días 0, 7, 30 y 53. Al día 60 → `pending_deletion` (7 días) → borrado. Configurable por agencia (60 por defecto). Vida máxima sin extensión: 30 + 60 + 7 = 97 días. |
| D17 | Al vencer, el cliente pierde el acceso | Página "Galería vencida" con botón de WhatsApp a la agencia. |
| D30 | PIN | 6 dígitos generados por la plataforma; la agencia lo envía por otro canal (WhatsApp). Bloqueo progresivo (5 intentos → 15 min, creciente). Cookie de sesión tras validarlo. |
| D31 | Publicar | Correo automático + "Copiar link" + "Enviar por WhatsApp" (`wa.me` con texto prellenado, sin API de Meta). El PIN tiene su propio botón para mandarlo en un mensaje separado. |

### Clientes y descargas ✅

| # | Decisión | Detalle |
|---|---|---|
| D18 | Tabla `clients` | Un cliente puede tener varias galerías. |
| D19 | Un link, varios destinatarios | Tabla `gallery_recipients`. Permite pasar a "un link por persona" sin migraciones dolorosas. |
| D20 | Descarga en ambos dispositivos | ZIP de todo o de una selección (Worker, D65), en computadora y en celular. Además, en celular: descarga individual y "Guardar en Fotos" (Web Share API, que confirma cuando la acción se completó). |
| D21 | Descargar una selección es Must | Mismo motor que el ZIP completo. `downloads.type`: `single`, `zip_all`, `zip_selection`, `save_to_photos`. La selección no se guarda (≠ favoritas, fuera del MVP). |

### Avisos ✅

| # | Decisión | Detalle |
|---|---|---|
| D32 | Al cliente | Al publicar; 7, 3 y 1 día antes del vencimiento; si nadie abrió la galería a los 5 días (`first_viewed_at`); al extender. **Sin** recordatorios de vencimiento si ya descargó el 100 %. |
| D33 | A la agencia | Nueva solicitud de contacto (correo + panel); primera apertura (panel); 100 % descargado (panel); resumen semanal (correo, Could). Preferencias por agencia en JSONB (preparado). Obligatorios: pendiente de decisión, recordatorios de retención, aviso antes de borrar. |

### Sitio público y diseño ✅

| # | Decisión | Detalle |
|---|---|---|
| D22 | `price_type` por paquete | `fixed`, `from` o `quote`. Precios con IVA incluido (Ley Federal de Protección al Consumidor) + campo de notas. |
| D23 | Portafolio independiente de las galerías | Vive en el bucket público, con subida propia. |
| D24 | Diseño | Ustedes diseñan, la agencia aprueba o pide cambios. Moodboard previo (3–5 referencias). Revisiones sobre un preview deployment real. Cada petición es un issue `design-feedback`, clasificado como token (panel), variante (código) o estructural (código). |
| D25 | Secciones del MVP | Hero, portafolio, paquetes, contacto, "Sobre nosotros" (JSONB en las props de la sección), testimonios y FAQ (tablas propias). |
| D28 | Blog como Should, versión mínima | Editor Markdown con vista previa, portada, slug, borrador/publicado, SEO básico, sitemap. El MVP puede cerrarse sin él. |
| D36 | Aviso de privacidad | Plantilla editable desde el panel en una tabla `site_pages` (slug, título, `body_md`). Enlazado desde el formulario (consentimiento) y el pie de las galerías. Requiere revisión legal por la agencia. |

### Usuarios y permisos ✅

| # | Decisión | Detalle |
|---|---|---|
| D26 | Roles: owner + staff | Invitaciones por correo (tabla `agency_invitations`). |
| D27 | Sin interfaz de SuperAdmin en el MVP | Dashboard de Supabase + scripts versionados en el repo. Por mínimo privilegio, el SuperAdmin no navega galerías privadas desde la app. |
| D29 | Login con correo + contraseña y con Google | Registro solo por invitación (Auth Hook que rechaza correos sin invitación). Vinculación automática de identidades con el mismo correo. Comodín de URLs de retorno para los previews. SMTP propio (Resend) para los correos de Auth en producción. |
| D34 | Permisos del staff | Puede: clientes, galerías (crear, subir, publicar), portafolio, solicitudes de contacto, extender galerías, testimonios/FAQ/blog. No puede: configuración del sitio, paquetes, miembros, **eliminar galerías** (solo el owner). |
| D37 | Nombre de la plataforma | Se decide en la Fase 2. |

### Parte A: arquitectura ✅ (aprobada el 2026-10-09)

| # | Decisión | Resumen |
|---|---|---|
| D38 | Idioma de las rutas | Sitio público y galería con URLs en español (`/portafolio`, `/paquetes`, `/contacto`, `/blog`, `/privacidad`, `/g/[token]`). Panel en `/admin/...` con segmentos en inglés. |
| D39 | Diseño del panel | Diseño neutro de la plataforma, no el tema de la agencia (solo su logo y nombre). El sitio público y la galería sí usan el tema. |
| D40 | Rol de `proxy.ts` | `proxy.ts` solo refresca la sesión de Supabase. Next resuelve la agencia pidiéndosela a Nest, con caché etiquetada. Nest la resuelve por el header `X-Tenant-Host`, con caché en memoria. El host solo define el contexto **público**; los permisos salen del JWT + membresía. |
| D41 | Región | Supabase `us-east-1`, Vercel `iad1` y Cloud Run `us-east4`: los tres en el este de EE. UU., para minimizar la latencia entre ellos. |
| D42 | Tokens y PIN | Aleatorios criptográficos (token de 128 bits). Se guardan **cifrados** (AES-256-GCM, clave en variable de entorno, con versión de clave) **+ hash SHA-256** para buscarlos. La agencia puede volver a copiarlos; una fuga solo de la BD no expone galerías. |
| D43 | Sesión de galería | Cookie httpOnly firmada (galería, versión del link, expiración), con `Path=/g/<token>`. Regenerar el link invalida las sesiones. |
| D44 | Qué cuenta como "descargado" *(rev. v3)* | Individual: Nest emitió la URL prefirmada (inicio). ZIP: **el Worker terminó de enviar todos los bytes de ese archivo** (señal del servidor, no falsificable por el cliente). Guardar en Fotos: el diálogo de compartir se completó. |
| ~~D45~~ | ~~ZIP en el navegador~~ | **Reemplazada por D65** el 2026-10-09. |
| D46 | Cron | `pg_cron` + `pg_net` llaman directo a Nest (`/cron/*`) con un secreto. Tres jobs: `lifecycle` (cada hora), `reminders` (diario 10:00 CDMX) y `notifications` (cada 10 min, que de paso mantiene despierta la API). Idempotentes, por lotes, con transiciones atómicas (D61). |
| D47 | Notificaciones | Patrón outbox (tabla `notifications`) en el módulo `notifications` de Nest. Cada canal es un *provider* inyectable (`email`, `in_app`; `whatsapp` en el futuro). Intento de envío inmediato para avisos urgentes; el job reintenta los fallidos. |
| D48 | Borrado manual | El borrado manual también pasa por la papelera (`pending_deletion`, 7 días). Desde ahí, el owner puede elegir "Eliminar ahora". Un solo camino hacia `deleting`. |
| D49 | Reglas de ciclo de vida de R2 | Solo abortar multipart incompletos a los 7 días. Ninguna regla por antigüedad sobre originales. |
| D50 | Buckets | Privado (galerías y manifiestos de ZIP), público con dominio y CDN (portafolio, logos), respaldos. Un juego por entorno (dev y prod). |
| D51 | Portafolio | En el bucket público se guardan solo versiones optimizadas (varios anchos, sin EXIF ni GPS). El original no se publica. |
| D52 | Previews | Miniatura de 400 px y preview de 2048 px en WebP, sin metadatos. Se pueden regenerar descargando el original desde R2 al navegador del admin. |
| D53 | Endurecimiento de la galería *(rev. v3)* | `noindex`, `Referrer-Policy: no-referrer`, URLs prefirmadas cortas (5 min individual / 6 h para reproducir video), link de ZIP firmado de 24 h y revocable, `Content-Disposition: attachment` en descargas. |
| D54 | Rate limiting | Contadores en Postgres para el PIN y el formulario de contacto. Sin servicios extra. |
| D55 | Extensiones | Nueva fecha > hoy y ≤ hoy + 365 días. Posible desde `active`, `pending_decision` y `pending_deletion`. |

### Parte B: datos y usuarios ✅ (aprobada el 2026-10-11)

| # | Decisión | Resumen |
|---|---|---|
| D67 | Identificadores | `uuid` v7 generado en Nest: no adivinable, se conoce antes del `INSERT` y es ordenable por tiempo. |
| D68 | Enumeraciones | `text` + `CHECK`; tipos de TypeScript desde los esquemas Zod. |
| D69 | Integridad entre agencias | Claves foráneas compuestas `(id, agency_id)`: la BD garantiza que padre e hijo son de la misma agencia. |
| D70 | Descargas de la agencia | Las que inicia la agencia (copia de respaldo, D15) **no** cuentan para el avance del cliente (`downloads.initiated_by`). |
| D71 | Borrar clientes | Solo el owner. `RESTRICT` si el cliente tiene galerías. |
| D72 | Link de galería | Un solo link activo por galería (índice único parcial). `session_version` para cerrar sesiones al cambiar el PIN. |
| D73 | Avisos del panel | Compartidos por toda la agencia (un solo `read_at`); `recipient_user_id` preparado para avisos personales. |
| D74 | Reportes idempotentes | `download_items` con PK `(download_id, file_id)` + `ON CONFLICT DO NOTHING`. |
| D75 | Sin *soft delete* | Borrado físico, salvo el ciclo de vida de las galerías. |
| D76 | Retención fija | Avisos 90 días, invitaciones 30 días, auditoría 12 meses. |
| D77 | EXIF con lista blanca | Cámara, lente, focal, apertura, velocidad, ISO y fecha. Nunca GPS. |
| D78 | Auditoría | `audit_events` como Should, solo para acciones sensibles. |
| D79 ✅ | Estadística anónima al purgar | `finishPurge` inserta una fila en `gallery_stats` (mes, archivos, GB, descargas, extensiones, días de vida, motivo de fin), sin título, cliente ni archivos. Para métricas de la agencia y costos del SaaS. |
| D80 ✅ | Retención de solicitudes de contacto | 12 meses desde su creación; después se borran solas. |
| D81 ✅ | Clientes sin galerías | A los 12 meses sin galerías, el panel lo avisa con botones "Anonimizar" y "Borrar". Nada se borra automáticamente. |

### Revisión de alcance ✅ (2026-10-11)

Revisión integral de las Partes A y B con la pregunta "¿esto lo pueden construir dos personas a 15 h/semana y sin pagar?". Veredicto: la arquitectura es correcta; el riesgo es el alcance. El diseño completo se estimó en 500–750 h (8–12 meses); un MVP delgado, en 250–350 h (4–6 meses).

| # | Decisión | Detalle |
|---|---|---|
| D82 | **MVP por hitos usables** (rebanada vertical) | El diseño completo es el destino, no el primer entregable. Se construye por hitos que la agencia pueda usar: **0** fundaciones y spikes, **1** entrega de galerías, **2** sitio público, **3** lanzamiento. El reparto y el MoSCoW están en la Parte C. Lo que no es Must del hito en curso va al backlog. |
| D83 | **Cloudflare como host del front por defecto; S-4 en el hito 0** (revisa D1) | Vercel Hobby prohíbe el uso comercial y la primera galería real ya lo es. Cloudflare Workers Free no tiene esa restricción y concentra front, R2, Worker de ZIP, Turnstile y DNS en un proveedor; una sola suscripción de US$5 cubriría todo si hiciera falta. S-4 (OpenNext en Workers Free) se corre en el hito 0, antes de escribir código que dependa del host. Si no cabe: Vercel Hobby en desarrollo y Vercel Pro (US$20/mes) al lanzar. |
| D84 | **Worker de ZIP por etapas; Workers Paid condicional** (precisa D65) | Etapa 1 (hito 1): streaming con `Content-Length` exacto, sin Range ni ZIP64; galerías de hasta 4 GiB y 65,535 archivos. Etapa 2: Range y ZIP64. Límites corregidos del plan Free: 10 ms de CPU, **1,000 lecturas internas a R2** y 50 subrequests externos por petición. Como el Worker casi no calcula, S-2 mide si Free alcanza también en producción; Paid deja de ser un gasto asumido. |
| D85 | **Sitio público v1 con layout en código** (acota B4) | Una plantilla con el orden de secciones fijo en código. En la BD: tema, textos e imágenes de cada sección, contacto, redes y SEO (P4 se cumple). El registro `type` + `variant`, borrador/publicado y la verificación WCAG se construyen cuando una segunda agencia necesite otro layout. `agency_sites.sections` se conserva en el esquema. |
| D86 | **Observabilidad desde el hito 0** | Sentry (plan gratuito de un usuario: la cuenta de la plataforma) en Next, Nest y el Worker. UptimeRobot (gratis, cada 5 min) sobre el sitio y la API. Alertas al correo compartido. Sin datos personales en los eventos. |
| D87 | **Protección contra cobros** | Google Cloud: presupuesto con alertas al 50/90/100 %, `max-instances` 2, sin `min-instances`. Cloudflare: alerta de facturación de R2. Se configura el primer día de cada cuenta. |
| D88 | **Cuentas compartidas** | Una cuenta de Google de la plataforma con 2FA es dueña de todos los proveedores (D2). Credenciales en una organización gratuita de Bitwarden (2 usuarios). Nunca en chats ni en el repo. |
| D89 | **Migraciones solo del hito en curso** | El ERD de la Parte B es el diseño objetivo; cada tabla nace en la migración del hito que la usa (reparto en la Parte C §2.1). Las columnas "PREPARADO" sí se crean desde el inicio. |
| D90 | **Desarrollo local primero** | Todo corre en local sin cuentas de pago: Supabase CLI (Postgres, Auth, `pg_cron`, visor de correos), Nest y Next con un comando, Worker con `wrangler dev`. La tarjeta entra en dos momentos: Google Cloud para el despliegue de prueba de S-0 (hito 0; puede retrasarse al final del hito 1) y R2 al empezar la subida (hito 1). Detalle del entorno en la Fase 2. |

### Parte C: alcance y cierre ✅ (aprobada el 2026-10-11; P-C1 a P-C3 resueltas: PIN como Should, solo owner en el MVP, hitos 0–3 como están)

| # | Decisión | Resumen |
|---|---|---|
| D91 | Hitos 0–3 | Alcances y estimaciones de la Parte C §2; demo a la agencia al cierre de cada hito. MVP ≈ 320–395 h, 5–6 meses (hito 0 ajustado a 65–80 h por D109). |
| D92 | MoSCoW | La Parte C §3 es el alcance vigente. Todo lo nuevo entra como Should al backlog, nunca al hito en curso. |
| D93 | "MVP terminado" | Los 9 criterios de la Parte C §4. |
| D94 | Usuarios del MVP | Solo el owner, creado por script, con el registro público deshabilitado en Supabase Auth. Staff, invitaciones y Auth Hook pasan a Should. |
| D95 | Avisos del MVP | Outbox completo, pero 5 plantillas (4 de galerías + solicitud de contacto) y sin canal `in_app`: el panel muestra el estado en la lista de galerías. |
| D96 | ADRs | `docs/adr/NNNN-titulo.md` con contexto, decisión, consecuencias, alternativas y D# de origen. Se crean en el hito 0 a partir de la Parte C §7. |
| D97 | `CLAUDE.md` | La Parte C §8 como punto de partida; los comandos se completan en la Fase 2. |

### Fase 2: metodología y división del trabajo ✅ (aprobada el 2026-10-11)

| # | Decisión | Detalle |
|---|---|---|
| D98 ✅ | **Nombre en clave provisional** (resuelve D37 por ahora) | El repo, el monorepo y los paquetes usan un nombre en clave hasta que la agencia confirme el suyo. GitHub redirige el repo renombrado; lo único que espera al nombre definitivo es el dominio. Nombre elegido (P2-5): **`darkroom`**. Paquetes `@darkroom/*`; proyectos, buckets y Workers con el prefijo `darkroom-`.  *Reemplazado por D118 (2026-10-13): Focal Drop, identificador `focaldrop`.* |
| D99 ✅ | **Reparto por capa en los hitos 0 y 1, rotando después** | Compañero: API en Nest, BD y migraciones, cron y avisos. Dueño del repo: front en Next, Worker de ZIP, CI e infraestructura. Desde el hito 2, cada quien toma rebanadas completas (front + API) para que ambos puedan defender todo el sistema. Las fronteras son los módulos de Nest (Parte A §2.4) y las apps del monorepo. |
| D100 ✅ | **Flujo de Git: ramas cortas desde `main` + PR revisado** | Trunk-based: ramas `feat/…`, `fix/…`, `chore/…` de pocos días; PR que revisa el otro; CI en verde obligatoria; *squash merge*; `main` siempre desplegable a staging. Conventional Commits. Protección de rama en `main` (repo público: gratis). |
| D101 ✅ | **Entorno local: Supabase CLI + bucket R2 de desarrollo** | Postgres, Auth, `pg_cron` y visor de correos en Docker con la CLI de Supabase; Nest y Next locales; Worker con `wrangler dev`. Archivos en un bucket R2 compartido de desarrollo (se activa al empezar la subida, hito 1). Cada quien tiene su BD local; las migraciones viajan por Git. |
| D102 ✅ | **README bilingüe** | `README.md` en inglés para reclutadores y comunidad; `README.es.md` enlazado desde la primera línea. Los demás documentos siguen en español. Política: código, identificadores, ramas y commits en inglés; interfaz es-MX; documentos en español. |
| D103 ✅ | **Monorepo: pnpm + Turborepo** | Paquetes `@focaldrop/web`, `@focaldrop/api`, `@focaldrop/zip-worker`, `@focaldrop/shared` (nombres actualizados por D118). Node LTS fijado en `.nvmrc` y pnpm en `packageManager`. TypeScript `strict` en todo. `shared` no usa APIs exclusivas de Node. |
| D104 ✅ | **Tres entornos** | Local (Supabase CLI), staging (Cloud Run + Workers + proyecto Supabase `focaldrop-staging` (D118)) y producción. Staging y producción como *GitHub Environments*; **producción exige la aprobación de la otra persona**. Dos proyectos Supabase Free: justo los dos permitidos. |
| D105 ✅ | **Secretos** | Copia maestra en Bitwarden; `.env.example` por app con todas las variables; GitHub Environments para CI; variables de Cloud Run fijadas por el deploy; `wrangler secret` para el Worker; Vault para `CRON_SECRET`; Google Cloud por *Workload Identity Federation*, sin llaves JSON. Inventario en la Fase 2 §4.3. |
| D106 ✅ | **CI/CD** | `ci.yml` en cada PR: lint, typecheck, unitarias, integración y e2e contra Postgres plano en contenedor, tests de bytes del ZIP; checks requeridos. Deploy por app a staging al mezclar en `main`. Nightly con Supabase CLI y Playwright. Producción por tag con aprobación. Migrar antes de desplegar, con migraciones *expand/contract*. |
| D107 ✅ | **Pruebas** | Vitest en `shared`, `web` y `zip-worker`; Jest en Nest; Playwright para tres flujos (login, publicar, abrir y descargar). Sin meta global de cobertura; ≥ 90 % en máquina de estados, descargas, layout del ZIP y guards. |
| D108 ✅ | **Definición de "terminado"** | Por PR: 9 puntos en la plantilla (issue enlazada, CI verde, `agency_id` en toda consulta, Zod, textos en el diccionario, nada de la agencia ni secretos, probado en móvil si aplica, docs, Sentry limpio tras el deploy). Por hito: entregable en staging + demo + retro + tag + tablero del siguiente. |
| D109 ✅ | **Backlog del hito 0** | 27 issues (Fase 2 §9), ≈ 77 h: compañero ≈ 35 h, dueño del repo ≈ 42 h. La Parte C ajusta el hito 0 de 50–60 h a **65–80 h (4–5 semanas)**; el MVP queda en ≈ 320–395 h. Fuera del hito 0: Worker de ZIP, R2, Google como login, tablas más allá de las cuatro de plataforma. |
| D110 ✅ | **Configuración del repo** | Protección de `main` (PR, 1 aprobación, checks, aplica a administradores), escaneo de secretos con *push protection*, Dependabot semanal agrupado sin auto-merge, plantillas de issue y PR, labels por hito/área/tipo/prioridad, GitHub Projects, sin CODEOWNERS en el MVP. *Los labels `hito:*` fueron reemplazados por milestones (D111).* |

### Fase 3: ejecución

| # | Decisión | Detalle |
|---|---|---|
| D111 ✅ | **Hitos como milestones de GitHub** (revisa D110) | Un milestone por hito (`Hito 0 · Fundaciones` … `Hito 4+ · Después del MVP`) en lugar de labels `hito:*`. Dan barra de progreso nativa, se cierran al terminar el hito y el tablero puede agruparse por ellos (con labels no se puede). Solo el hito 0 tiene fecha: 2026-11-15. |
| D112 ✅ | **Entorno de trabajo del dueño del repo** (precisa S9) | Windows nativo, repo en la subcarpeta `focaldrop/` de esta carpeta (antes `darkroom/`, D118), GitHub CLI 2.102 (`C:\Program Files\GitHub CLI\gh.exe`). Commits con el correo *noreply* de GitHub configurado solo en el repo (`263442215+Rurbis@users.noreply.github.com`): el repo es público y el correo de cada commit queda visible. `core.longpaths=true` por la ruta con espacios. **Autoría:** commits, PRs y comentarios en GitHub solo a nombre de Rurbis, sin líneas de coautor (preferencia del dueño del repo, 2026-10-12). Los scripts de `gh` con textos en español o JSON se escriben en Node: PowerShell 5.1 altera comillas y acentos al pasarlos a programas externos. |
| D114 ✅ | **Node 24 LTS en todo el proyecto** (precisa D103) | `.nvmrc`, `engines`, CI y la imagen de Cloud Run usan Node 24, el LTS activo con soporte hasta 2028. Node 22 entra en fin de vida en abril de 2027, cerca del lanzamiento. pnpm llega por `corepack`. Se instala al empezar la #2 en ambas máquinas. |
| D115 ✅ | **Versiones de la cadena de herramientas** (precisa D103 y D107) | Node 24.20 · **pnpm 10.34.6**: pnpm 12 (reescrito en Rust) sin soporte confirmado de Turborepo ni Dependabot. Se instala con `npm install -g`, no con `corepack`, porque `corepack enable` exige permisos de administrador en Windows y Node lo dejó de incluir desde la v25; pnpm se autogestiona con `packageManager`. · **TypeScript 6.0.3**, no 7.0: TS 7, nativo en Go, no es compatible con typescript-eslint (`<6.1.0`) ni con ts-jest, y Dependabot ignora el salto mayor. · **ESLint 10.12** (la Fase 2 decía 9) + typescript-eslint 8.71 con información de tipos · Prettier 3.9 · Turborepo 2.11 con `agentGuidance: false`, porque creaba un `AGENTS.md` al detectar un agente de IA; la guía de agentes es `CLAUDE.md` (#26). · Husky 9.1 + lint-staged 17.6 · herramientas con versión exacta. **Para la #10: NestJS va en la versión 12** (la Fase 2 decía 11). |
| D116 ✅ | **Las cuentas y proyectos en plataformas los configura el dueño del repo** (precisa D99; corregida en D123: las cuentas son de los dos) | Reparto de tareas, no de propiedad: Fabian no hace la configuración de plataformas y se concentra en desarrollar. Entra a las plataformas como **miembro invitado con su propia cuenta** donde el plan gratuito lo permite (Cloudflare, Supabase, Google Cloud), y con la cuenta compartida en Bitwarden donde el plan gratuito es de un solo usuario (Sentry, UptimeRobot). Reparto: **#9 pasa a R**; **#8 queda solo con la CLI local y `config.toml` (C)**, ya sin depender de la #5; **nueva #30 (R):** proyecto `focaldrop-staging`; el SDK de Sentry entra en la #10 (C) y en la #22 (R); la #16 depende también de la #30. |
| D117 ✅ | **Cuenta de Google de la plataforma ya, con nombre interno** (precisa D88) | Se crea ahora, sin esperar el nombre definitivo: su dirección nunca la ven los clientes (los correos les llegan desde el dominio de la agencia) y el nombre definitivo llegó el mismo día (D118), así que la cuenta se crea como `focaldrop`. Evita migrar la propiedad de 6 servicios después. 2FA con app autenticadora y códigos de respaldo en Bitwarden; los detalles de recuperación están fuera del repo (D128). |
| D118 ✅ | **Nombre de la plataforma: Focal Drop** (resuelve D37; reemplaza el nombre en clave de D98) | Nombre visible **Focal Drop**; identificador técnico **`focaldrop`** (una palabra, coincide con el dominio): repo `Rurbis/focaldrop`, paquetes `@focaldrop/*`, proyectos, buckets y Workers con el prefijo `focaldrop-`, tablero "Focal Drop MVP". Es el nombre de **la plataforma** (el producto de ustedes); la agencia conserva su propio nombre, que vive en la BD (P4). Dominio: **focaldrop.com** y **focaldrop.app** aparecían libres el 2026-10-13; el dueño del repo lo asegura en Cloudflare Registrar (~US$10–11 al año, gasto aceptado) en cuanto exista la cuenta de Cloudflare (#6). Renombrados el 2026-10-13: el repo (GitHub redirige el nombre viejo), el tablero, las issues abiertas (#3, #7, #30), el `package.json`, el README y la plantilla de PR (commit en el PR #29). Las issues cerradas y el historial conservan `darkroom`. |
| D119 ✅ | **focaldrop.com es de los desarrolladores** (precisa D2) | El dominio de la plataforma es la marca de su producto y del futuro SaaS: queda a nombre de los desarrolladores y lo pagan ellos (~US$9–10.5 al año, a precio de costo en Cloudflare Registrar). La agencia sigue pagando lo propio de su operación, incluido su dominio en el hito 3 (D2). **Comprado en la #6 (2026-10-13): US$10.46 al año**, ver §4.2. |
| D120 ✅ | **Formato de `@focaldrop/shared` y versión de Vitest** (precisa D64, D103 y D107) | **Compilado a ESM con `tsc`** (`module`/`moduleResolution` `NodeNext`) en `dist/`, con `.d.ts` y *source maps*. Por qué: Nest 12 ya es ESM (`@nestjs/core` 12.1 declara `type: module`) y, como Node, no ejecuta `.ts` desde `node_modules`; la misma salida sirve a Nest, Next y Wrangler. Turborepo lo compila antes de cada app (`^build`); `pnpm dev` lo deja en *watch*. **Sin APIs de Node, con dos candados:** el `tsconfig` del paquete no carga tipos de Node ni del DOM (`types: []`, `lib` ES2023), y ESLint prohíbe en `packages/shared/src` los módulos de Node (`node:*`, `fs`…) y sus globales (`process`, `Buffer`…). **Zod 4.6.7**, la misma versión exacta en cada app que lo use: dos copias de Zod pueden romper validaciones entre paquetes (si se repite mucho, evaluar los *catalogs* de pnpm). **Vitest 4.1.11, no 5:** `@cloudflare/vitest-pool-workers`, que necesitan los tests de la zip-worker, solo soporta `^4.1`; Dependabot ignora el salto mayor hasta entonces. **Contrato:** camelCase (Drizzle traduce a snake_case), fechas como texto ISO 8601 con zona, y esquemas **sin mensajes de interfaz**: la web traduce los códigos de error de Zod al diccionario `es-MX` (B5). **Para la #10:** Nest 12 es ESM; revisar si su plantilla trae Vitest en lugar de Jest, lo que cambiaría D107 y la nota de `ts-jest` en Dependabot. |
| D121 ✅ | **Supabase de staging: llaves nuevas, Data API apagada y Fabian como Administrator** (precisa D57, D60, D63, D104 y D116) | Proyecto `focaldrop-staging` (Free, `us-east-1`) en la organización **Focal Drop**, creada con la cuenta de la plataforma y con MFA del dueño del repo. **Llaves:** solo las nuevas, publicable (`sb_publishable_…`) y secreta (`sb_secret_…`); las legacy `anon` y `service_role` quedan **desactivadas** desde el inicio (es reversible), porque Supabase las retira a finales de 2026 y nada las usa. Variables renombradas en la Fase 2 §4.3. **JWT:** firma asimétrica **ES256 (ECC P-256)**, verificada en `/auth/v1/.well-known/jwks.json`: Nest valida con JWKS sin conocer secretos (D57). **Data API apagada:** Nest usa Postgres directo y Auth es un servicio aparte, así que nada la necesita; es un segundo candado sobre RLS sin políticas (D60). No usar supabase-js para consultar datos. **Conexiones:** Nest por el *transaction pooler* (6543, D63); las migraciones de CI por el *session pooler* (5432), porque la conexión directa es solo IPv6 en Free. Contraseña de la BD de 32 caracteres alfanuméricos para no codificarla en las URLs. Registro público apagado (D94). Todo en Bitwarden (*Secretos de la app*). **Fabian entra como Administrator** (elección del dueño del repo): puede ajustar Auth, la API y el pooler sin esperar, pero también crear, pausar y borrar proyectos. En Free el rol aplica a toda la organización. **Para la #8:** el `config.toml` local copia estos ajustes (registro cerrado y Data API apagada) para que local y staging se comporten igual. |
| D122 ✅ | **Diseño de la CI** (precisa D106 y D113) | `ci.yml` con dos jobs en paralelo, **`quality`** (Prettier, `lint`, `typecheck`) y **`test`** (`test`, `build`), que son los checks requeridos. **Postgres 17** como *service container*, la misma versión mayor que staging (Supabase 17.11). La preparación (pnpm desde `packageManager`, Node desde `.nvmrc`, cachés de pnpm y de Turbo) vive en una acción compuesta, `.github/actions/setup`, que reutilizarán los deploys. **Solo lo afectado** con `turbo run --affected` y base explícita en `TURBO_SCM_BASE`: en un PR, el commit base del PR; en un push a `main`, el commit anterior. **Hallazgo (probado con *dry run*):** Turbo atribuye los archivos de la raíz solo al workspace raíz (`//`), así que un cambio en `eslint.config.js`, `tsconfig.base.json` o el lockfile no revisaba ningún paquete. Esos archivos, `.nvmrc` y la propia CI van en **`globalDependencies`** de `turbo.json`. **Seguridad:** `permissions: contents: read`; acciones **fijadas por SHA** con la versión en comentario y al menos 2 semanas de publicadas (un tag se puede mover, como en el incidente de `tj-actions` de 2025); Dependabot también actualiza la acción compuesta. **Ruleset:** `quality` y `test` requeridos y atados a GitHub Actions, **sin exigir rama al día** con `main`: con dos personas y PRs chicos solo agrega fricción, y el push a `main` vuelve a correr la CI. |
| D123 ✅ | **Las cuentas son de los dos; Sentry con un solo usuario** (corrige D116 y D117; precisa D86) | **Propiedad:** Rubén y Fabian son **dueños por igual** de la plataforma y de la cuenta de Google de la plataforma; los dos tienen acceso a ella. D116 solo reparte quién configura las plataformas. **Sentry:** sus términos (sección 2.2) prohíben compartir credenciales entre personas y el plan Developer es de un usuario, así que **una sola persona entra a Sentry** (Rubén, que lo configuró). Que la cuenta de Google sea de los dos no cambia esto: el límite es por persona. Organización `focaldrop` en EE. UU., proyectos `web` (Next.js), `api` (NestJS) y `zip-worker` (Cloudflare), alerta "high priority issues" por correo, sin IP almacenada y con *scrubbers*. Plan Team (US$26/mes) cuando haya ingresos. En local, Fabian usa **Sentry Spotlight**, que no requiere cuenta. **UptimeRobot:** desde mayo de 2026 su plan gratuito permite uso comercial y sus términos no prohíben compartir la cuenta. Se entra con Google (cuenta de la plataforma), así que los dos tienen acceso. Sin monitores activos hasta que exista staging; el que creó el asistente sobre `focaldrop.com` quedó en pausa. |
| D124 ✅ | **Google Cloud: cuenta de pago desde el inicio y tope real de gasto** (precisa D63, D87 y D105) | Se evaluaron alternativas a Cloud Run (Workers + Hono, Koyeb, Render, Railway, planes fijos) después de que Fabian cuestionó Google Cloud: le preocupaba que la prueba gratuita apagara todo en enero y que el autoescalado disparara el gasto. Se queda **Cloud Run** (D63) con tres capas de protección: (1) **cuenta de pago activada desde el inicio**, para que nada se apague a los 90 días; se conservan los US$300 de crédito y el nivel gratuito sigue para siempre; la tarjeta es de uno de los dos; (2) `max-instances = 2` en Cloud Run (#16) y **presupuesto de US$5** con alertas al 50, 90 y 100 %, sin contar créditos; (3) **corte automático**: el presupuesto publica en Pub/Sub (`billing-alerts`) y la función `billing-guard` desconecta la facturación al pasar de US$5. Es seguro porque en Google Cloud no hay datos (la BD está en Supabase y los archivos en R2). Los avisos tardan horas, así que el tope real queda un poco arriba de US$5. **Sin max-instances ni corte**, el peor caso con 2 instancias ocupadas todo el mes sería de unos US$60–130. Todo va en `infra/gcp/bootstrap.sh`, idempotente, que se corre en Cloud Shell: Artifact Registry con limpieza, cuenta de servicio propia para la API, `github-deployer` con permisos mínimos y WIF restringido por los IDs inmutables del repo y de su dueño. **Cero llaves JSON.** El corte se prueba de verdad al configurarlo. |
| D125 ✅ | **Google Cloud dentro de la organización que creó Google, con sus políticas seguras por defecto** (precisa D116, D123 y D124) | Al crear la cuenta de facturación (2026-10-15, en MXN: el crédito equivale a MX$5,344 y vence el 2027-01-13), Google creó una **organización** para la plataforma con políticas *secure-by-default*: (1) **no se pueden crear llaves de cuentas de servicio**, así que D105 queda garantizado por la plataforma; (2) **las cuentas de servicio por defecto no reciben roles**, por eso cada pieza tiene su propia cuenta, incluida `function-builder` para construir el corte automático; (3) **uso compartido restringido al dominio**: no se pueden dar permisos a Gmails personales ni a `allUsers`. Se dejan las tres intactas: **Fabian entra con la cuenta de la plataforma** (es de los dos, D123), a costa de que la auditoría no distinga quién hizo qué, y en la #16 la API se hace pública con `--no-invoker-iam-check` en lugar de `allUsers`. Se crea el proyecto **`focaldrop`** y se cierra el "My First Project" que Google creó solo. |
| D126 ✅ | **GitHub Environments, y Supabase sin integración de GitHub** (precisa D104, D105, D121 y D123) | **Supabase no se conecta al repo** (integración de GitHub): esa integración aplica migraciones desde `supabase/migrations`, y las nuestras son de Drizzle (`apps/api/drizzle/`) y las aplica el workflow de deploy (D58, D106). Habría dos sistemas migrando la misma BD, y las BD de prueba por PR son del plan Pro. **Fabian entra a Supabase con la cuenta de la plataforma**, igual que a Google Cloud y UptimeRobot, con su propio 2FA ahí; la invitación como Administrator de D121 ya no hace falta. **Environments creados el 2026-10-15:** `staging` solo despliega desde `main`; `production` despliega desde `main` o tags `v*`, con revisores Rurbis y AntonioWalls y *prevent self-review*: siempre aprueba **el otro**. **Variables:** a nivel repo, las `GCP_*` (un solo proyecto para los dos entornos); por entorno, `CLOUD_RUN_SERVICE`, más `SUPABASE_URL` y `SUPABASE_JWKS_URL` en staging (las de producción llegan en el hito 3). **Secretos** `DATABASE_URL` y `MIGRATIONS_DATABASE_URL` de staging: los pegó el dueño del repo desde Bitwarden el 2026-10-15 (verificados por nombre). |
| D127 ✅ | **Web: Next 16 a mano, lint sin `eslint-config-next` y diccionario tipado** (precisa B5, D39 y D115) | Next 16.3.8, React 19.3 y Tailwind 4.3 se instalan **a mano** con versiones exactas, no con `create-next-app` (archivos de ejemplo, versiones con `^`). **Lint:** `@next/eslint-plugin-next` (Core Web Vitals) y `eslint-plugin-react-hooks` directamente, en el `eslint.config.js` raíz y solo para `apps/web`. `eslint-config-next` trae `eslint-plugin-react` y `eslint-plugin-import`, que no soportan ESLint 10. **Pendiente:** agregar `jsx-a11y` cuando soporte ESLint 10. **Textos:** diccionario `src/i18n/es-MX.ts` (`as const`); una clave inexistente es error de compilación. Rutas tipadas (`typedRoutes`), `typecheck` = `next typegen && tsc --noEmit`, `/admin` con `noindex` y títulos "%s · Focal Drop". `@types/node` fijado en 24.x: `next typegen` instala la última si falta, que no coincide con Node 24 (D114). |
| D128 ✅ | **Los documentos viven en `docs/`; bitácora pública y limpia** (precisa D102 y la Fase 2 §10) | Desde la #23 (2026-10-15), `docs/` del repo es la fuente de verdad: la bitácora y los documentos de las Fases 1 y 2, con los mismos nombres para que sus enlaces sigan funcionando. **La bitácora se actualiza en el PR de cada issue:** las decisiones y el tiempo real viajan con el código y los revisa la otra persona. Las tareas sin código van en un PR pequeño `docs(log): …`. **El repo es público:** la bitácora conserva decisiones y razones, pero no datos personales ni detalles operativos de las cuentas (quién paga, datos fiscales, dónde vive el 2FA, cuentas de recuperación, nombres de cuentas). Esos detalles viven en una nota segura de Bitwarden, "Operación de cuentas". Los documentos internos (onboarding de Fabian, prompts) se quedan fuera del repo. **README bilingüe:** `README.md` en inglés, para el portafolio, y `README.es.md`, con el mismo contenido. |
| D129 ✅ | **S-4 parcial: el front cabe en Workers Free, pero OpenNext se compila solo en Linux** (precisa D83 y D127) | Avance del spike S-4 (#21) con el esqueleto de la #17, rama `spike/opennext-workers` (no se mezcla). `@opennextjs/cloudflare` 1.20.7 + `wrangler` 4.145.0. **Tamaño:** 865 KiB comprimido en Linux, el 28 % del límite de 3 MiB. **Linux (GitHub Actions):** `/` y `/admin` responden 200 en el runtime de Workers, sin errores. **Windows nativo:** compila, pero todas las páginas dan 500 (`Dynamic require of "/.next/server/middleware-manifest.json"`): OpenNext no reescribe bien las rutas con `\`, como advierte su documentación. **Decisión:** el build y el deploy del front con OpenNext se hacen **siempre en CI (Linux)**; en Windows se desarrolla con `next dev`, y probar el runtime de Workers en local requiere WSL. **`sharp` con pnpm:** el optimizador de imágenes nativo de Next no puede ir en un Worker, y el bundler de OpenNext lo encuentra por los enlaces de pnpm. Con la #22 entra a `pnpm-workspace.yaml` `ignoredOptionalDependencies: [sharp]` y un `hoistPattern` que excluye `sharp` y `@img/*`. **Pendiente del spike** (después de la #20): CPU por petición con el panel dinámico y login, `proxy.ts`, `revalidateTag`, deploy desde CI con token de Cloudflare y el ADR-0010. |
| D130 ✅ | **Respuestas de la agencia: solo JPG y MP4, fotos de ~24 MB y ZIP64 en la etapa 1** (precisa D9, D11, D15 y D84) | Respuestas del 2026-10-15. **Formatos:** entrega solo JPG y MP4, así que el procesamiento de RAW, HEIC y HEVC (D9) **sale del MVP y pasa a Could** (regla de D82); S-1 prueba solo JPG y MP4. **Tamaño:** cada foto editada pesa ~24 MB y la agencia quiere entregarlas **sin compresión** (su problema actual), justo lo que hace el diseño: originales tal cual y vistas previas aparte. Una galería de 300 a 1,000 fotos pesa **7 a 24 GB** sin contar videos (S3 actualizado). **ZIP64 pasa a la etapa 1 del Worker de ZIP (hito 1)**: sin él, el ZIP no puede pasar de 4 GiB y casi ninguna galería cabría. La reanudación con Range sigue en la etapa 2, como candidata a adelantarse. **R2:** con 5 a 15 galerías al mes de ~15 GB guardadas de 1 a 3 meses, serían unos 100 a 500 GB, alrededor de US$1.5 a 7.5 al mes sobre el nivel gratuito (gasto aceptado; actualiza D11). **Vistas previas en el navegador (D52):** con JPG de 24 MB, S-1 debe medir memoria y tiempo con las muestras reales de la agencia. **Respaldo (D15):** la agencia guarda sus originales en su PC; la plataforma sigue siendo "entrega, no archivo". **Nombre:** provisional y guardado fuera del repo; dominio pendiente. **Moodboard:** mandó canales de YouTube de enseñanza de fotografía, no sitios; se le proponen 5 sitios con estilos distintos para que elija. |
| D113 ✅ | **Protección de `main` como ruleset** | Ruleset `main` (no la "branch protection" clásica): PR con 1 aprobación que se invalida con pushes nuevos, conversaciones resueltas, historial lineal, solo squash, sin *force push* ni borrado, **0 excepciones**. Los checks `quality` y `test` se agregan en la #4, cuando existan. |

## 6. Pendientes con la agencia

- [x] ¿Tiene respaldo propio de lo que entrega? (D15) → Sí, en su PC (D130). Sugerirle una segunda copia.
- [x] **¿Qué formatos entrega a sus clientes?** → JPG y MP4 (D130): RAW/HEIC/HEVC salen del MVP.
- [~] Carpeta de muestra: llegaron 5 JPG (fuera del repo), pero **comprimidos** (1600 px, 0.3–0.5 MB: el tamaño al que WhatsApp reduce las fotos). **Faltan los originales de ~24 MB y 2–3 videos MP4** para S-1 y S-5; la agencia los manda después.
- [~] Nombre **de la agencia**: provisional, guardado fuera del repo (D130). **No tiene dominio todavía** (2026-10-15): se necesita antes del lanzamiento (hito 3, D7). Mientras tanto, staging usa `workers.dev` y `run.app`. El de la plataforma ya está resuelto: Focal Drop, focaldrop.com (D118). El DNS vivirá en Cloudflare: lo requieren el dominio del bucket público y el del Worker de ZIP.
- [~] Referencias para el moodboard: mandó canales de YouTube, no sitios. Se le propusieron 5 sitios para que elija (D130); los está revisando.
- [ ] Revisión legal del aviso de privacidad (plantilla).

## 7. Pendientes técnicos

- **Fase 3 · Hito 0 (en curso):** issues #1–#27 de la Fase 2 §9, en orden, creadas en GitHub con la misma numeración. ✅ #1–#7, #9, #17 y #30. **#7 cerrada (2026-10-15):** PR #33 mezclado en `8318edb` (D124, D125). Configurado y **probado el 2026-10-14**:
  - cuenta de pago activa y proyecto `focaldrop`;
  - script corrido en Cloud Shell y presupuesto de MX$100 conectado a `billing-alerts`;
  - corte probado de verdad: `No action` con 10 de 100; con 150 de 100, `billingEnabled = False`; se vinculó otra vez y quedó en `True`, con la función `ACTIVE`.
  - Para la #16: variables `GCP_*` en Bitwarden, `--max-instances=2` y `--no-invoker-iam-check`. Fabian tiene desbloqueadas la #8 y la #10, y con la #10 la #11.
  - **2026-10-15:** Fabian aprobó los PRs #33, #35, #36 y #37. Mezclados #33 (#7, `8318edb`) y #35 (#17, `dd18907`); el #36 se actualizó con `main` y espera una nueva aprobación, y el #37 (#25 parcial) va después. **PR #38 de Fabian (#8, Supabase local):** el dueño del repo lo prueba en su máquina, que necesita WSL2 y Docker Desktop. Quedan para el dueño del repo: #18–#20 (esperan la #8, la #12, la #13 y la #15), el resto de S-4 (#21, después de la #20), #22, el resto de la #23, la ADR-0010 de la #25 y #27.
  - **PR #38 (#8) probado en la máquina del dueño del repo (2026-10-15):** la guía pasa completa (Postgres 17.11 con `pg_cron` y `pg_net`, persistencia tras `db:stop`/`db:start`, registro y acceso anónimo rechazados). **Cambios pedidos:** `[auth.email] enable_signup = false` apaga el proveedor de correo y bloquea el login de la #18 (el registro ya lo cierra `[auth] enable_signup = false`); falta `[api] enabled = false` (D121); y el comando de PowerShell 5.1 guarda `.env.local` con BOM, que Node no lee bien. La CLI local ya firma las sesiones con ES256 y publica su JWKS, igual que staging (buena noticia para la #12). Fabian abrió también el **PR #40 (#10, esqueleto de Nest)**.
  - **PR #41:** `overrides` de npm a `uuid` 11.1.1 en `infra/gcp/billing-guard` por la alerta de Dependabot #1 (GHSA-w5hq-g745-h8pq). `cloudevents` 10.0.0, ya en su última versión, pide `uuid@^8.3.2`; solo usa `v4()`, así que el riesgo era bajo. Se redespliega la próxima vez que corra `bootstrap.sh`.
- ✅ **#3 y #4 mezcladas (2026-10-14):** Fabian aprobó los dos PRs. PR #32 (CI) en `19bc510`; luego el PR #31 se actualizó con `main`, pasó la CI requerida (typecheck, lint, 46 tests y build; `quality` y `test` en menos de 45 s) y se mezcló en `37b3f58`. **Desbloqueadas para Fabian: #8 y #10; con la #10 también la #11** (esquema del hito 0). **Siguiente para el dueño del repo: #7** (Google Cloud, requiere tarjeta para la facturación).
- ✅ **#9 cerrada (2026-10-14, 1.5 h):** Sentry `focaldrop` (EE. UU.) con `web`, `api` y `zip-worker`, alertas "high priority" por correo, sin IP y con *scrubbers*; DSN en Bitwarden. UptimeRobot con Google, con el monitor del asistente en pausa. Las cuentas son de los dos (D123); solo una persona entra a Sentry por sus términos; Fabian ve las alertas en el Gmail de la plataforma.
- ✅ **#30 cerrada (2026-10-13, 1 h):** organización de Supabase **Focal Drop** (Free) con MFA del dueño del repo; proyecto `focaldrop-staging` en `us-east-1`; registro público apagado; Data API apagada; solo llaves nuevas (las legacy desactivadas); JWT ES256 verificado; todo en Bitwarden (D121). **Pendiente de Fabian:** aceptar la invitación a Supabase (Administrator) con su propia cuenta y el mismo correo, y activar su MFA.
- ✅ Fabian (@AntonioWalls) aceptó la invitación; tiene asignadas #8–#16, #24 y #26.
- ✅ Tablero configurado: 3 vistas (Tablero, Por Hito, Por Persona) y 8 flujos activos (verificado por API).
- **Onboarding de Fabian (2026-10-12):** guía y primer mensaje para su Claude Code, en documentos internos fuera del repo.
- ✅ **#5 cerrada (2026-10-13, 1.25 h):** organización de Bitwarden **Focal Drop** con 2 colecciones y Fabian confirmado; cuenta de Google de la plataforma con 2FA y códigos de respaldo en Bitwarden. Desbloquea #6, #7, #9 y #30.
- ✅ **#2 cerrada (2026-10-13, ≈ 1.5 h):** PR #29 aprobado y mezclado con squash en `2f3d2e3`. **Recordatorio de proceso:** lo mezcló Fabian; según la Fase 2 §3, el revisor aprueba y **el autor mezcla**.
- ✅ **#6 cerrada (2026-10-13, 1 h):** cuenta de Cloudflare **Focal Drop** con 2FA y códigos de respaldo en Bitwarden; **focaldrop.com** en Cloudflare Registrar (US$10.46 al año, renovación automática, vence el 2027-10-14, DNS en Cloudflare verificado por RDAP); widget de Turnstile `focaldrop` con las llaves en Bitwarden y las llaves de prueba para local; R2 sin activar (D90).
- **Reparto D116 aplicado en GitHub (2026-10-13):** #9 → Rurbis; #8 → solo la CLI local (Fabian, depende solo de la #2); nueva **#30** (Rurbis, proyecto de staging); SDK de Sentry en la #10 y la #22; la #16 depende de la #30.
- **Para Fabian, antes de trabajar en su máquina:** Node 24 y pnpm 10.34.6 (`npm install -g pnpm@10.34.6`), `gh`, clonar el repo, correo *noreply* y `core.longpaths` en el repo. Docker Desktop antes de su #8. Confirmar Windows nativo o WSL2 (S9).
- **Hito 0, al arrancar:** elegir el día fijo de la sincronización semanal; confirmar quién es el contacto con la agencia (S8); el compañero confirma si trabaja en Windows nativo (S9).
- ✅ Node 24.20 instalado en la máquina del dueño del repo (reemplazó a la 22.14). Docker Desktop 4.95 con WSL2 instalado el 2026-10-15; Windows pidió reiniciar después de activar WSL y Virtual Machine Platform.
- **Spikes de la Fase 3** (detalle en la Parte A, §5): hito 0: esqueleto Next + Nest (S-0) y front en Cloudflare Workers (S-4). Hito 1: subida con Uppy (S-5), previews (S-1, solo JPG/MP4 salvo que la agencia entregue más formatos) y ZIP etapa 1 (S-2). Diferido: Guardar en Fotos (S-3).

## 8. Supuestos vigentes

| # | Supuesto |
|---|---|
| S1 | ✅ La agencia conserva sus originales en su PC (confirmado el 2026-10-15, D130). |
| S2 | Zona horaria America/Mexico_City (UTC−6 todo el año), moneda MXN, idioma es-MX. |
| S3 | Galería típica de **7–24 GB** (300–1,000 fotos de ~24 MB, D130) más videos; ocasionalmente hasta ~50 GB por videos largos. |
| S4 | Ustedes dos son SuperAdmin; no hay onboarding de otras agencias en el MVP. |
| S5 | Las galerías se sirven bajo el dominio de la agencia (`<dominio>/g/<token>`); el ZIP, bajo `zip.<dominio>`. |
| S6 | Tamaño máximo por archivo: 50 GB (configurable). |
| S7 | Capacidad sostenida de 15 h/semana entre los dos; las estimaciones de la Parte C parten de ahí. |
| S8 | El dueño del repo es el único canal con la agencia. |
| S9 | Los dos trabajan en Windows; WSL2 es recomendación, no requisito. *El dueño del repo confirmó Windows nativo (D112); el compañero, por confirmar.* |

## 9. Glosario (para explicar en entrevistas)

| Término | Definición breve |
|---|---|
| Multi-tenancy | Una sola instalación del software atiende a varios clientes (tenants; aquí, agencias) con sus datos aislados. |
| RLS (Row Level Security) | Reglas dentro de Postgres que deciden qué filas puede leer o escribir cada usuario. Se aplican aunque el código olvide filtrar. |
| URL prefirmada | URL temporal, firmada con una clave secreta, que autoriza una sola operación (subir o bajar un objeto) por unos minutos sin exponer credenciales. |
| Multipart upload | Subir un archivo grande en partes independientes (en paralelo y reintentables) que el almacenamiento une al final. |
| Egress | Tráfico de salida de un proveedor (descargas). En R2 cuesta $0; en Google Cloud se cobra. |
| Spike | Experimento corto y desechable para resolver una incógnita técnica antes de comprometerse. |
| Design tokens | Valores de diseño con nombre (`color-primary`, `font-heading`) que el código usa en lugar de valores fijos. |
| Idempotencia | Ejecutar una operación varias veces produce el mismo resultado que ejecutarla una vez. |
| Desnormalizar | Guardar un dato derivado (p. ej., un contador) para no recalcularlo en cada lectura. |
| WASM (WebAssembly) | Permite correr en el navegador librerías escritas en C/C++ a velocidad casi nativa. |
| Web Worker | Hilo en segundo plano del navegador; procesa sin congelar la interfaz. |
| Cloudflare Worker | Programa pequeño que corre en la red de Cloudflare, junto a R2, sin servidor que mantener. Lo usamos para el ZIP virtual. |
| CRC-32 | "Huella" de 4 bytes calculada sobre el contenido de un archivo. El ZIP la guarda para que el programa que descomprime compruebe que el archivo llegó íntegro. |
| ZIP virtual | ZIP que no existe guardado: se compone byte a byte mientras se descarga, a partir de los archivos originales y un manifiesto (lista con nombre, tamaño y CRC-32 de cada archivo). |
| Petición Range (HTTP) | Pedir solo un rango de bytes de un recurso ("desde el byte X"). Permite reanudar descargas y adelantar videos. |
| ZIP64 | Extensión del formato ZIP para archivos > 4 GB o más de 65,535 entradas. |
| Outbox | Guardar la intención de enviar un aviso en la BD, en la misma transacción que el cambio que lo origina, y enviarlo después. Ningún aviso se pierde ni se envía por algo que no ocurrió. |
| Transición atómica | Cambio de estado que solo ocurre si el estado previo es el esperado (`UPDATE … WHERE status = 'active'`). Evita procesar dos veces lo mismo. |
| HMAC | Firma calculada con una clave secreta compartida. Permite verificar que un dato (p. ej., un link) lo emitió quien conoce la clave y no fue alterado. |
| ORM | Librería que traduce entre tablas de la BD y objetos del lenguaje, y maneja las migraciones. Usamos Drizzle. |
| Migración | Cambio versionado del esquema de la BD (un archivo `.sql` en el repo) que se aplica igual en todos los entornos. |
| UUID v7 | Identificador único que empieza con la fecha de creación: no se puede adivinar, pero sí ordenar por tiempo, lo que mantiene los índices compactos. |
| Clave foránea compuesta | Referencia que usa dos columnas a la vez, p. ej. `(gallery_id, agency_id)`. La usamos para que la BD impida mezclar datos de agencias distintas. |
| Índice parcial | Índice que solo cubre las filas que cumplen una condición, p. ej. "links no revocados". Sirve para reglas como "un solo link activo por galería". |
| Paginación por cursor | Pedir "los siguientes 100 después de este elemento" en vez de "saltar 300 filas" (`OFFSET`). Es estable aunque se agreguen filas y no se vuelve lenta. |
| *Soft delete* | Marcar un registro como borrado (`deleted_at`) en lugar de borrarlo. Lo evitamos: complica todas las consultas y retiene datos personales. |
| Restricción `CHECK` | Regla que la BD verifica en cada escritura, p. ej. "si está `active`, debe tener fecha de vencimiento". |
| JWT / JWKS | JWT: token firmado que dice quién es el usuario. JWKS: las llaves públicas con las que se verifica su firma sin conocer el secreto. |
| Guard (Nest) | Clase que corre antes de un endpoint y decide si la petición pasa (p. ej., "¿es owner de esta agencia?"). |
| AsyncLocalStorage | Mecanismo de Node para guardar datos de una petición (como la agencia actual) y leerlos en cualquier capa sin pasarlos por parámetro. |
| Monorepo | Un solo repositorio con varias apps y paquetes (`apps/web`, `apps/api`, `apps/zip-worker`, `packages/shared`) que comparten código y herramientas. |
| Arranque en frío (*cold start*) | Retraso de la primera petición cuando el servicio estaba apagado (escala a cero) y debe arrancar. |
| Pooler | Intermediario que reparte pocas conexiones reales a Postgres entre muchas instancias del backend. |
| Responsable / Encargado | En la LFPDPPP: el responsable decide sobre los datos (la agencia); el encargado los trata por cuenta del responsable (la plataforma). |
| Rebanada vertical (*vertical slice*) | Construir una función completa de punta a punta (interfaz, API, BD, archivos) antes que muchas funciones a medias. Cada hito es una rebanada que la agencia puede usar. |
| MoSCoW | Priorización en Must (sin esto no hay MVP), Should (lo primero después), Could (si sobra tiempo) y Won't (fuera por ahora). |
| OpenNext | Adaptador que empaqueta una app de Next.js para correr fuera de Vercel, p. ej. en Cloudflare Workers. |
| Observabilidad | Saber qué pasa dentro del sistema en producción: errores, caídas y tiempos. Aquí: Sentry y UptimeRobot. |
| ADR (*Architecture Decision Record*) | Documento corto que registra una decisión técnica: contexto, decisión, consecuencias y alternativas. Uno por decisión importante, en `docs/adr/`. |
| Ruleset (GitHub) | Conjunto de reglas que protege ramas (PR obligatorio, aprobaciones, checks, sin *force push*). Es el sistema actual de GitHub y reemplaza a la "branch protection" clásica. |
| Milestone (GitHub) | Agrupación de issues con fecha opcional y barra de progreso. Aquí, uno por hito. |
| Correo *noreply* | Dirección que da GitHub (`<id>+<usuario>@users.noreply.github.com`) para firmar commits sin exponer el correo personal en un repo público. |

## 10. Registro de tiempo

Horas reales frente a las estimadas, por issue. Es el insumo de la retro de cada hito (Fase 2 §8.2).

| Issue | Responsable | Estimado | Real | Nota |
|---|---|---|---|---|
| #1 Crear el repo | R | 2 h | 1.25 h | Incluye las preguntas y el plan. Las vistas del tablero quedan como paso manual. |
| #2 Monorepo | R | 4 h | ≈ 1.5 h | ~1 h hasta el PR, con la investigación de versiones (TS 7, pnpm 12); ~0.5 h por el renombre (D118) y por reabrir el PR (#28 → #29). |
| #5 Google + Bitwarden | R | 1 h | 1.25 h | 0.75 h de Bitwarden + 0.5 h de la cuenta de Google. Incluyó decidir D116–D118. |
| #6 Cloudflare + dominio | R | 1.5 h | 1 h | Cuenta, focaldrop.com y Turnstile. |
| #17 Web: esqueleto | R | 3 h | ≈ 1 h hasta el PR | Incluyó revisar la compatibilidad de los plugins de lint con ESLint 10 y verificar en el navegador integrado. PR #35 mezclado el 2026-10-15 (`dd18907`). |
| #7 Google Cloud | R | 3 h | ≈ 2 h (dueño) | Consola, Cloud Shell y prueba del corte. Aparte: evaluar alternativas (D124), adaptar el script a la organización (D125) y el *billing guard*. PR #33 mezclado el 2026-10-15 (`8318edb`). |
| #25 ADRs 0002, 0010 y 0012 | R | 2 h | ≈ 0.5 h hasta el PR | Parcial: índice y plantilla de `docs/adr/`, ADR-0002 y ADR-0012 (PR #37). La ADR-0010 sale del cierre de S-4. |
| #9 Sentry + UptimeRobot | R | 1.5 h | 1.5 h | Incluyó revisar los términos de Sentry y UptimeRobot (D123) y adaptar los pasos a las pantallas nuevas de Sentry. |
| #30 Supabase staging | R | 1 h | 1 h | Incluyó verificar en la documentación los cambios recientes de Supabase (llaves nuevas, JWT asimétrico, Data API). |
| #4 CI | R | 3 h | ≈ 1.25 h | Incluyó probar cómo detecta Turbo los cambios de la raíz (hallazgo de D122), los checks requeridos y la mezcla. |
| #3 `@focaldrop/shared` | R | 2 h | ≈ 1.25 h | Incluye verificar el formato de Nest 12 y la compatibilidad de Vitest 5, actualizar el PR con `main` y la mezcla. |

## 11. Historial

| Fecha | Evento |
|---|---|
| 2026-10-06 | Kickoff: evaluación inicial del stack, borrador del ERD, 8 preguntas. |
| 2026-10-07 | Respuestas a P1–P8 y preguntas derivadas → D1–D37. Bitácora creada. Parte A entregada → D38–D55 propuestas. |
| 2026-10-07 | El compañero propone NestJS como backend; se abre la evaluación del stack. Nueva regla: preguntas siempre con el selector interactivo. |
| 2026-10-07 | Stack adoptado: Next.js + NestJS (D56). Auth, ORM y aislamiento definidos (D57–D59). Propuestas D60–D64. Parte A actualizada a la v2. |
| 2026-10-09 | Parte A v2 aprobada por el equipo. D45 (ZIP en el navegador) se reabre a discusión. |
| 2026-10-09 | El equipo elige el **ZIP virtual en un Cloudflare Worker** (D65) + CRC-32 al subir (D66). D44 y D53 revisadas. Parte A v3. Excepciones de costo consolidadas en §4.1. |
| 2026-10-09 | Parte B v1 entregada: ERD en 3 dominios (25 tablas), reglas e índices, columnas vs JSONB, RLS por capas, retención, matriz de permisos, endpoints por módulo y 4 flujos. Propuestas D67–D78; preguntas P-B1 a P-B3. |
| 2026-10-09 | P-B1 a P-B3 resueltas → D79 (tabla `gallery_stats`, ahora son 26 tablas), D80 y D81. La Parte B pasa a revisión del equipo. |
| 2026-10-11 | **Revisión integral de las Partes A y B.** Hallazgo principal: el alcance diseñado equivale a 8–12 meses de trabajo; se adopta el MVP por hitos (D82). Parte B v1.2 aprobada (D67–D78 ✅). S-4 al hito 0 y Cloudflare por defecto (D83), ZIP por etapas (D84), sitio v1 con layout en código (D85), observabilidad (D86), protección contra cobros (D87), cuentas compartidas (D88), migraciones por hito (D89), desarrollo local primero (D90). Parte A v3.1. **Parte C v1 entregada:** hitos, MoSCoW, criterios de "terminado", riesgos, costos, ADRs y `CLAUDE.md`; propuestas D91–D97 y preguntas P-C1 a P-C3. |
| 2026-10-11 | P-C1 a P-C3 resueltas (PIN como Should, solo owner en el MVP, hitos 0–3 como están) y D91–D97 aprobadas. Parte C v1.1. |
| 2026-10-11 | **"Fase 1 aprobada"** por el equipo. Arranca la Fase 2 con las preguntas iniciales: nombre, división del trabajo, flujo de Git y entorno local. |
| 2026-10-11 | P2-1 a P2-6 resueltas → D98 (`darkroom`), D99 (reparto por capa con rotación), D100 (trunk-based), D101 (Supabase CLI + R2 dev), D102 (README bilingüe). **Fase 2 v1 entregada** con D103–D110 propuestas: monorepo, entornos, secretos, CI/CD, pruebas, "terminado", backlog del hito 0 (27 issues, ≈ 77 h) y configuración del repo. Hito 0 ajustado a 65–80 h. |
| 2026-10-11 | **"Fase 2 aprobada"** por el equipo (D103–D110 ✅, Fase 2 v1.1). **Arranca la Fase 3** con el hito 0. El trabajo continúa en la conversación original con un prompt de traspaso (`files/handoff-prompt-2026-10-11.md`). |
| 2026-10-11 | **#1 cerrada (1.25 h de 2 h):** repo público `Rurbis/darkroom` con commit inicial, ajustes y seguridad, ruleset `main` sin excepciones, 15 labels, 5 milestones, las 27 issues del hito 0 con la numeración de la Fase 2, tablero público "Darkroom MVP" e invitación a @AntonioWalls. D111 (milestones), D112 (entorno del dueño del repo) y D113 (ruleset). |
| 2026-10-11 | Tablero configurado (3 vistas, 8 flujos). Fabian aceptó la invitación y tiene sus 11 issues. D114 (Node 24). **#2 → PR #28:** workspace pnpm + Turborepo, TypeScript 6.0.3 estricto, ESLint 10 con tipos, Prettier, Husky + lint-staged, Dependabot desde la raíz. D115 (versiones). Turborepo creó un `AGENTS.md` con instrucciones para agentes: se consultó y se desactivó (`agentGuidance: false`). |
| 2026-10-12 | Historial reescrito para dejar solo la autoría de Rurbis, sin líneas de coautor: `main` `182f3a1` → `3c313f4` y los 4 commits del PR #28. El contenido es idéntico (mismos árboles). El ruleset se desactivó durante el *force push* (`--force-with-lease`) y se reactivó con sus 4 reglas, verificado por API. GitHub cerró el PR #28 al recibir `main` reescrito antes que la rama, y no se pudo reabrir: **continúa en el PR #29** (misma rama, mismos 4 commits). Lección: al reescribir la base de un PR, subir primero la rama y después la base. #5 en curso. |
| 2026-10-13 | #5: Bitwarden listo (0.75 h); la cuenta de Google de la plataforma se crea ya con nombre interno (D117). **D116:** las cuentas en plataformas son del dueño del repo y Fabian solo desarrolla: #9 → R, #8 → solo la CLI local, nueva #30 (staging de Supabase), SDK de Sentry en la #10 y la #22. Onboarding de Fabian actualizado. |
| 2026-10-13 | **Nombre definitivo: Focal Drop** (`focaldrop`, D118). Renombrados el repo (`Rurbis/darkroom` → `Rurbis/focaldrop`, con redirección), el tablero ("Focal Drop MVP"), las issues #3, #7 y #30, y el código en el PR #29 (commit `75be01d`). Dominio focaldrop.com por asegurar en la #6. Pendiente del dueño del repo: renombrar la organización de Bitwarden y crear el Gmail de la plataforma con el nombre nuevo. |
| 2026-10-13 | **#5 cerrada (1.25 h de 1 h):** Bitwarden "Focal Drop" con Fabian confirmado y cuenta de Google de la plataforma con 2FA. Siguiente: #6 (Cloudflare y compra de focaldrop.com), mientras Fabian revisa el PR #29. |
| 2026-10-13 | **#6 cerrada (1 h de 1.5 h):** Cloudflare "Focal Drop", **focaldrop.com** comprado (US$10.46 al año, §4.2) y Turnstile. **#2 cerrada (≈ 1.5 h de 4 h):** Fabian aprobó y mezcló el PR #29 (`2f3d2e3`); recordatorio: mezcla el autor. Siguiente: #3. |
| 2026-10-13 | **#3 → PR #31:** `@focaldrop/shared` compilado a ESM con `tsc`, `AgencySchema`, `ThemeSchema` mínimo con `DEFAULT_THEME` y `parseThemeOrDefault`, 46 tests con Vitest 4.1 y candados contra APIs de Node (tipos + ESLint). Importación verificada desde una app temporal. D120. |
| 2026-10-13 | **#30 cerrada (1 h de 1 h):** Supabase "Focal Drop" con el proyecto `focaldrop-staging` (`us-east-1`), registro público y Data API apagados, solo llaves nuevas, JWT ES256 y Fabian invitado como Administrator. D121; Fase 2 v1.3 (variables de Supabase). |
| 2026-10-13 | El dueño del repo propuso crear ya el esquema completo de la BD; se mantuvo D89 (cada tabla en su hito) y se priorizó la #4, que desbloquea la #11. **#4 → PR #32:** CI con `quality` y `test`, Postgres 17, `--affected` con `globalDependencies` y acciones fijadas por SHA. D122. |
| 2026-10-14 | **#9 cerrada (1.5 h de 1.5 h):** Sentry y UptimeRobot. **D123:** las cuentas de la plataforma son de Rubén y Fabian por igual (corrige D116 y D117). Sentry, con una sola persona por sus términos. |
| 2026-10-14 | **#4 y #3 mezcladas:** PR #32 (`19bc510`) y PR #31 (`37b3f58`), aprobados por Fabian. El #31 fue el primer PR que pasó por los checks requeridos. Hito 0: cerradas #1–#6, #9 y #30. Desbloqueadas para Fabian: #8, #10 y, con la #10, la #11. |
| 2026-10-14 | #7: Fabian cuestionó Google Cloud (temía que se apagara en enero y que el autoescalado disparara el gasto). Se compararon alternativas y se mantuvo Cloud Run con cuenta de pago desde el inicio, `max-instances` 2, presupuesto de US$5 y corte automático (D124). Script `infra/gcp/bootstrap.sh` + `billing-guard` en el PR #33. |
| 2026-10-14 | **#7 → PR #33:** cuenta de pago activada, proyecto `focaldrop` en la organización que creó Google (D125), script corrido, presupuesto de MX$100 y corte automático probado de verdad (se desconectó y se volvió a conectar la facturación). |
| 2026-10-15 | Fabian pidió conectar el repo a Supabase; se descartó la integración de GitHub (choca con las migraciones de Drizzle) y se crearon los GitHub Environments `staging` y `production` con sus variables para la #16 (D126). Fabian ya entra a Supabase con la cuenta de la plataforma. |
| 2026-10-15 | **#17 → PR #35:** `apps/web` con Next 16.3.8, Tailwind 4.3, diccionario `es-MX` y layout neutro de `/admin`, verificado en escritorio, celular y con teclado. D127. |
| 2026-10-15 | **#23 (parcial) → PR:** documentos migrados a `docs/` con la bitácora pública limpia, y `README.md` / `README.es.md` con arquitectura, stack, comandos y contribución. Falta la instalación de la BD local (llega con la #8 y la #15). D128. |
| 2026-10-15 | **S-4 adelantado (#21):** el esqueleto cabe en Workers Free (865 KiB, 28 %) y renderiza en Linux; en Windows nativo OpenNext falla en tiempo de ejecución, así que se compila y despliega solo en CI. Resultados en la #21. D129. |
| 2026-10-15 | **Respuestas de la agencia:** solo JPG y MP4, fotos de ~24 MB sin compresión y respaldo propio en su PC. RAW/HEIC salen del MVP, ZIP64 pasa a la etapa 1 del ZIP y las galerías se estiman en 7–24 GB. D130. |
| 2026-10-15 | **#25 (parcial) → PR #37:** `docs/adr/` con reglas, plantilla e índice de los 13 ADRs, más la ADR-0002 (Next.js renderiza, NestJS decide) y la ADR-0012 (MVP por hitos usables). La ADR-0010 queda para el cierre de S-4. |
| 2026-10-15 | **#7 y #17 cerradas:** Fabian aprobó los PRs #33, #35, #36 y #37 (y mezcló el Dependabot #34, `setup-node` 7.1.0). Mezclados el #33 (`8318edb`) y el #35 (`dd18907`); el #36 se actualizó con `main` (choque en `.prettierignore`) y pide una nueva aprobación. **Fabian abrió el PR #38 (#8, Supabase local):** el dueño del repo lo prueba en su máquina, que primero necesita WSL2 y Docker Desktop. |
| 2026-10-15 | **PR #38 (#8) probado** en la máquina del dueño del repo, después de instalar WSL2 y Docker Desktop: la guía pasa completa, pero se pidieron cambios (login con correo apagado por `[auth.email] enable_signup = false`, Data API encendida y BOM en `.env.local`). Fabian abrió el PR #40 (#10). |
| 2026-10-15 | **PR #41:** `uuid` 11.1.1 con `overrides` de npm en `billing-guard` (alerta de Dependabot #1); la función se probó en local con `functions-framework`. |
