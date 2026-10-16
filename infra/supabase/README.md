# Supabase local

Entorno de desarrollo de Focal Drop para la issue #8 (D90, D94, D101 y D116). Cada desarrollador
tiene su propia base de datos y sus propias credenciales locales. El proyecto de staging corresponde
a la #30; estos pasos no requieren iniciar sesión, enlazar un proyecto ni acceder a staging.

## Requisitos

- Node 24 compatible con `engines` y `.nvmrc`, y pnpm **10.34.6**.
- Docker Desktop iniciado, con el motor de contenedores **Linux** funcionando.
- Internet para la instalación de dependencias y la primera descarga de imágenes de Docker.
  Las ejecuciones siguientes reutilizan las imágenes y los volúmenes locales.

En Windows se puede usar PowerShell 5.1 o 7. WSL2 con Docker Desktop también es válido.
Comprueba el entorno desde la raíz del repositorio:

```sh
node --version
pnpm --version
docker info --format '{{.OSType}}'
```

El último comando debe devolver `linux`. Si Docker no responde, abre Docker Desktop y espera a que
el motor termine de iniciar.

## Instalar y arrancar

Desde la raíz del repositorio:

```sh
pnpm install --frozen-lockfile
pnpm exec supabase --version
pnpm db:start
```

La CLI está fijada como dependencia de desarrollo en el `package.json` raíz y en `pnpm-lock.yaml`.
No hace falta instalar otra copia global ni ejecutar `supabase init`: la configuración ya está
versionada en esta carpeta. La primera ejecución tarda más por la descarga de imágenes.

| Servicio                     | Dirección local          |
| ---------------------------- | ------------------------ |
| API de Supabase y Auth       | `http://127.0.0.1:54321` |
| Postgres 17                  | `127.0.0.1:54322`        |
| Studio (tablas y editor SQL) | <http://127.0.0.1:54323> |
| Mailpit (visor de correos)   | <http://127.0.0.1:54324> |
| SMTP de Mailpit              | `127.0.0.1:54325`        |

Los puertos deben estar libres. Si otro proyecto local de Supabase los está usando, detén ese
proyecto antes de arrancar este. El identificador de los contenedores y volúmenes es `focaldrop-local`.

## Credenciales en `.env.local`

Después del arranque, exporta las variables de la CLI al archivo **`.env.local` de la raíz**.
La salida contiene credenciales: guárdala en ese archivo, que Git ignora, y conserva únicamente
valores de ejemplo en `.env.example`.

En **PowerShell 5.1 o 7**:

```powershell
if (Test-Path -LiteralPath .env.local) {
    throw '.env.local ya existe; conserva su contenido y actualiza solo las variables necesarias.'
}

$localEnv = pnpm exec supabase status --workdir infra --output env
if ($LASTEXITCODE -ne 0) {
    throw 'No se pudo consultar Supabase. Comprueba pnpm db:start antes de crear .env.local.'
}
$localEnv | Set-Content -LiteralPath .env.local -Encoding utf8
Remove-Variable localEnv
```

Se especifica UTF-8 porque la redirección `>` de Windows PowerShell 5.1 guarda texto como UTF-16.

En **Bash** (Linux, macOS o WSL):

```sh
local_env="$(pnpm exec supabase status --workdir infra --output env)" &&
  (set -C; printf '%s\n' "$local_env" > .env.local)
unset local_env
```

`set -C` impide sobrescribir un archivo existente. Si ya tienes `.env.local`, combina las variables
necesarias conservando las demás. Estas variables describen la pila local; la configuración de cada
app se incorporará con sus respectivas issues. Las credenciales de staging siguen en Bitwarden.

## Configuración del proyecto

- `db.major_version = 17`: misma versión mayor que CI y staging.
- `auth.enable_signup = false`: registro público deshabilitado (D94).
- `auth.email.enable_signup = false` y `auth.sms.enable_signup = false`: tampoco se permite
  registrar usuarios por correo o SMS. Los usuarios del MVP se aprovisionarán por script.
- `auth.enable_anonymous_sign_ins = false`: sin acceso anónimo de Auth.
- `auth.email.enable_confirmations = false`: sin confirmaciones de correo en local.
- `api.auto_expose_new_tables = false`: las tablas nuevas no reciben permisos automáticos para
  la Data API. Los permisos y RLS de capa 0 se implementan en la #11 (D60).
- Las migraciones de aplicación se incorporarán en `apps/api/drizzle/` con la #11. La ejecución
  de migraciones y seeds de Supabase está deshabilitada; el seed de la agencia demo es la #15.
- Storage, Realtime, Edge Functions y Analytics están deshabilitados: esta configuración cubre
  Postgres, Auth, Studio y Mailpit. Los archivos irán a R2 y el Worker de ZIP a Cloudflare.

Los cambios en `config.toml` requieren detener y volver a iniciar la pila local.

## Detener y volver a iniciar

```sh
pnpm db:stop
pnpm db:start
```

`db:stop` conserva los datos para el siguiente arranque. El proyecto no ofrece todavía comandos
de migración, seed ni reset; se incorporan en sus respectivas issues. No añadas `--no-backup`
al comando habitual de parada, porque descarta los datos locales.

## Comprobación en las dos máquinas

Fabian y Rubén deben completar esta lista en sus propios equipos antes de cerrar la #8:

- [ ] Instalar con `pnpm install --frozen-lockfile` y comprobar la versión de la CLI.
- [ ] Ejecutar `pnpm db:start` sin errores de salud de los contenedores.
- [ ] Abrir Studio y Mailpit en las direcciones de la tabla.
- [ ] Guardar las credenciales propias en `.env.local` y confirmar que `git status` no las muestra.
- [ ] Comprobar Postgres y la disponibilidad de `pg_cron` y `pg_net` en el editor SQL de Studio:

  ```sql
  select current_setting('server_version') as server_version;
  select name, default_version
  from pg_available_extensions
  where name in ('pg_cron', 'pg_net');
  ```

- [ ] Crear un dato sintético de comprobación en Studio:

  ```sql
  create schema focaldrop_local_check;
  create table focaldrop_local_check.persistence_probe (id integer primary key);
  insert into focaldrop_local_check.persistence_probe values (1);
  ```

- [ ] Ejecutar `pnpm db:stop` y después `pnpm db:start`. En Studio, comprobar y retirar la prueba:

  ```sql
  select id from focaldrop_local_check.persistence_probe;
  -- Debe devolver 1.
  drop table focaldrop_local_check.persistence_probe;
  drop schema focaldrop_local_check;
  ```

Esta prueba no crea usuarios ni tablas de negocio. Las pruebas de login con el owner se incorporan
cuando existan su aprovisionamiento y el seed.

## Referencias

- [Issue #8](https://github.com/Rurbis/focaldrop/issues/8).
- [Instalación y ejecución de Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).
- [Referencia de `config.toml`](https://supabase.com/docs/guides/local-development/cli/config).
