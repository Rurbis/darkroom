# ADR-0012: MVP por hitos usables

- Estado: aceptada · Fecha: 2026-10-11 · Reemplaza: — · Origen: D82, D91, D92

## Contexto

Las Partes A y B diseñaron el producto completo: 26 tablas, ZIP virtual, ciclo de vida de las galerías, sitio público configurable, avisos por varios canales, roles e invitaciones. La revisión integral del 2026-10-11 estimó ese alcance en 8 a 12 meses para dos personas con unas 15 h por semana entre las dos (S7). La agencia necesita algo usable mucho antes, y un proyecto que pasa meses sin entregar nada corre el riesgo de no terminarse.

## Decisión

- El diseño completo es el destino, no el primer entregable. Se construye en **hitos usables** (rebanadas verticales): cada uno termina con algo que la agencia ve o usa, y con una demo corta para ella.

  | Hito                    | Entrega                                                        | Horas   |
  | ----------------------- | -------------------------------------------------------------- | ------- |
  | 0 · Fundaciones         | Un panel con login que lee datos de Nest, desplegado           | 65–80   |
  | 1 · Entrega de galerías | La agencia entrega una galería real con un dominio temporal    | 140–170 |
  | 2 · Sitio público       | El sitio de la agencia, aprobado por ella                      | 80–100  |
  | 3 · Lanzamiento         | Dominio propio, primera galería real con él, costo ≤ US$10/mes | 35–45   |
  | 4+ · Después del MVP    | Una mejora a la vez, en el orden del MoSCoW                    | —       |

- **MoSCoW por área** (Parte C §3): solo se construye lo Must del hito en curso. Todo lo nuevo entra como Should al backlog, nunca al hito en curso (D92).
- Cada hito es un milestone de GitHub (D111). Las tablas nacen en la migración del hito que las usa (D89).
- Semana 1 de cada hito: spikes y backlog en issues, con la estimación corregida (D109). Última semana: pruebas de punta a punta, demo, retro y ajuste del siguiente hito.

Detalle: [Parte C §2 y §3](../phase-1c-scope-and-closing.md).

## Consecuencias

**Positivas**

- La agencia entrega galerías reales al cerrar el hito 1, unos 3 a 4 meses después de empezar, en lugar de esperar todo el diseño.
- Las incógnitas técnicas más grandes (subida, ZIP y ciclo de vida) se enfrentan primero, en el hito 1.
- La retroalimentación de la agencia llega temprano y corrige el rumbo con datos reales.
- Desde el hito 0 hay algo desplegado que enseñar en el portafolio.

**Negativas**

- Funciones ya diseñadas quedan fuera del MVP: PIN, login con Google, staff e invitaciones, blog, entre otras.
- Algunas piezas se rehacen al crecer, como el sitio público con layout en código (D85).
- Exige disciplina para decir "no" a lo que no es Must del hito en curso.

**Riesgos**

- Que el hito 1, el más grande, se alargue. Mitigación: spikes al inicio y ajuste del alcance en su semana 1.
- Que el alcance se infle a mitad de un hito. Mitigación: la regla de D92.

## Alternativas descartadas

| Opción                                           | Por qué no                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Construir todo el diseño antes de entregar       | 8 a 12 meses sin nada usable y sin retroalimentación real de la agencia.                               |
| Por capas: toda la BD, luego la API, luego la UI | Nada se puede usar hasta el final, y los problemas de integración aparecen tarde.                      |
| Sitio público antes que las galerías             | Depende de insumos de la agencia que tardan (moodboard, textos, fotos) y no es su necesidad principal. |
