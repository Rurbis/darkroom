import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

import { validateEnv, type Env } from './env.js';

export function loadEnv(): Env {
  const envFile = new URL('../../.env', import.meta.url);

  if (existsSync(envFile)) {
    loadEnvFile(envFile);
  }

  return validateEnv(process.env);
}
