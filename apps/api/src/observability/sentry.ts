import * as Sentry from '@sentry/nestjs';

import type { Env } from '../config/env.js';
import { APP_VERSION } from '../constants/app.constants.js';
import { SENTRY_DATA_COLLECTION } from '../constants/sentry.constants.js';

export function initializeSentry(env: Env): void {
  if (!env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT ?? env.NODE_ENV,
    release: `focaldrop-api@${APP_VERSION}`,
    dataCollection: SENTRY_DATA_COLLECTION,
    tracesSampleRate: 0,
  });
}
