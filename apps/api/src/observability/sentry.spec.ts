import * as Sentry from '@sentry/nestjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APP_VERSION } from '../constants/app.constants.js';
import { initializeSentry } from './sentry.js';

vi.mock('@sentry/nestjs', () => ({ init: vi.fn() }));

describe('initializeSentry', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not initialize the SDK when the DSN is absent', () => {
    initializeSentry({ NODE_ENV: 'development', PORT: 3001 });

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('disables default PII and uses the application environment and release', () => {
    initializeSentry({
      NODE_ENV: 'production',
      PORT: 3001,
      SENTRY_DSN: 'https://public@example.invalid/1',
    });

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: 'https://public@example.invalid/1',
      environment: 'production',
      release: `focaldrop-api@${APP_VERSION}`,
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        genAI: { inputs: false, outputs: false },
        databaseQueryData: false,
        queues: false,
        graphQL: { document: false, variables: false },
        stackFrameVariables: false,
      },
      tracesSampleRate: 0,
    });
  });

  it('uses SENTRY_ENVIRONMENT when supplied', () => {
    initializeSentry({
      NODE_ENV: 'production',
      PORT: 3001,
      SENTRY_DSN: 'https://public@example.invalid/1',
      SENTRY_ENVIRONMENT: 'staging',
    });

    expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ environment: 'staging' }));
  });
});
