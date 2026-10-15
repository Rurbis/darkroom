# Registro de decisiones de arquitectura (ADRs)

Un ADR resume en una pantalla una decisión importante: qué problema había, qué se decidió, qué cuesta y qué se descartó. El detalle largo vive en la [bitácora](../project-log.md), donde cada decisión tiene su número (D#), y en los documentos de las Fases 1 y 2; el ADR los enlaza (D96).

## Reglas

- Un archivo por decisión: `NNNN-titulo-en-ingles.md`. El número no se reutiliza; el contenido va en español.
- Cabe en una pantalla. Si necesita más, el detalle va a la bitácora o a la Fase correspondiente.
- Estados: `propuesta`, `aceptada` o `reemplazada por ADR-NNNN`.
- Una decisión aceptada no se edita en silencio: si cambia, se escribe un ADR nuevo con `Reemplaza: ADR-NNNN` y el anterior cambia su estado.
- El ADR va en el mismo PR que cambia la decisión (Fase 2 §7.3).

## Plantilla

```markdown
# ADR-NNNN: Título

- Estado: aceptada · Fecha: AAAA-MM-DD · Reemplaza: — · Origen: D#, D#

## Contexto

## Decisión

## Consecuencias

**Positivas**

**Negativas**

**Riesgos**

## Alternativas descartadas
```

## Índice

Los 13 ADRs que propuso la Parte C §7.

| #    | Título                                                                                | Origen             | Estado                    |
| ---- | ------------------------------------------------------------------------------------- | ------------------ | ------------------------- |
| 0001 | Multi-tenancy con base de datos compartida y `agency_id` en todas las tablas          | B2, D59, D69       | Pendiente (#24)           |
| 0002 | [Next.js renderiza, NestJS decide](0002-nextjs-renders-nestjs-decides.md)             | D56, D62           | Aceptada                  |
| 0003 | Supabase Auth con validación JWKS en Nest y API automática bloqueada                  | D57, D60           | Pendiente (#24)           |
| 0004 | Drizzle con migraciones SQL versionadas; enumeraciones como `text` + `CHECK`; UUID v7 | D58, D67, D68      | Pendiente (#24)           |
| 0005 | Archivos directo a R2 con URLs prefirmadas y previews en el navegador                 | B6, D9, D13, D52   | Pendiente, sin issue      |
| 0006 | ZIP virtual en un Cloudflare Worker con CRC-32 calculado al subir                     | D65, D66, D84      | Pendiente, sin issue      |
| 0007 | Ciclo de vida de galerías con transiciones atómicas y purga con la BD al final        | D14, D16, D48, D61 | Pendiente, sin issue      |
| 0008 | Outbox de avisos con canales como providers de Nest                                   | D47                | Pendiente, sin issue      |
| 0009 | Tokens y PIN cifrados + hash; sesión de galería en cookie firmada                     | D42, D43           | Pendiente, sin issue      |
| 0010 | Hosting: Cloudflare para el front, Cloud Run para la API, todo gratis hasta lanzar    | D1, D63, D83, D90  | Pendiente (#25, tras S-4) |
| 0011 | Tema por tokens y layout en código en la v1                                           | B4, D85            | Pendiente, sin issue      |
| 0012 | [MVP por hitos usables](0012-mvp-by-usable-milestones.md)                             | D82, D91, D92      | Aceptada                  |
| 0013 | Observabilidad y protección de costos                                                 | D86, D87           | Pendiente (#24)           |
