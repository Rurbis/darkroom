<!-- Título del PR en inglés, con Conventional Commits: feat(api): add gallery state machine -->

Closes #

## Qué cambia

<!-- De 2 a 5 líneas: qué cambia y por qué. -->

## Cómo probarlo

<!-- Pasos para que quien revisa lo compruebe en local o en staging. -->

## Checklist de "terminado"

<!-- Fase 2 §7.3. Marca "N/A" en lo que no aplique. -->

- [ ] Issue enlazada (`Closes #N`) y el cambio es Must del hito en curso, o tiene una excepción acordada.
- [ ] CI en verde, con tests de lo crítico que toca.
- [ ] Toda consulta nueva filtra por el `agency_id` del contexto, nunca del body.
- [ ] Todo payload nuevo tiene su esquema Zod en `@focaldrop/shared` y se valida en Nest.
- [ ] Los textos de interfaz están en el diccionario `es-MX`, no en el componente.
- [ ] Nada de la agencia en el código; sin secretos ni datos reales.
- [ ] Si toca la interfaz pública o la galería: probado en celular (o en el emulador) y con teclado.
- [ ] Documentación: `.env.example`, ADR o README actualizados si aplica.
- [ ] Después del deploy a staging: sin errores nuevos en Sentry (lo revisa el autor).

## Tiempo real

<!-- Horas reales frente a las estimadas en la issue. -->
