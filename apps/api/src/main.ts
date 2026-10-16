import * as Sentry from '@sentry/nestjs';

import { loadEnv } from './config/load-env.js';
import { initializeSentry } from './observability/sentry.js';

try {
  const env = loadEnv();
  initializeSentry(env);

  // Load Nest only after Sentry has installed its ESM instrumentation hooks.
  const { bootstrap } = await import('./bootstrap.js');
  await bootstrap(env);
} catch (error) {
  process.stderr.write(
    JSON.stringify({
      level: 'error',
      timestamp: Date.now(),
      context: 'Bootstrap',
      message: error instanceof Error ? error.message : 'Unknown startup error',
    }) + '\n',
  );

  if (Sentry.getClient()) {
    Sentry.captureException(error);
    await Sentry.close(2000);
  }

  process.exitCode = 1;
}
