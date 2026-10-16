import { BadRequestException, Controller, Get, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as Sentry from '@sentry/nestjs';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { SENTRY_DATA_COLLECTION } from '../src/constants/sentry.constants.js';

@Controller('__test-errors')
class ErrorController {
  @Get('unexpected')
  unexpected(): never {
    throw new Error('Synthetic API failure');
  }

  @Get('expected')
  expected(): never {
    throw new BadRequestException('Synthetic bad request');
  }
}

describe('Sentry exception reporting (e2e)', () => {
  let app: INestApplication<App>;
  const events: Sentry.ErrorEvent[] = [];

  beforeAll(async () => {
    Sentry.init({
      dsn: 'https://public@example.invalid/1',
      dataCollection: SENTRY_DATA_COLLECTION,
      tracesSampleRate: 0,
      beforeSend(event) {
        events.push(event);
        return event;
      },
      // Keep verification entirely local; no events are sent to Sentry.
      transport: () => ({
        send: () => Promise.resolve({ statusCode: 200 }),
        flush: () => Promise.resolve(true),
      }),
    });

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [ErrorController],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    await app.init();
  });

  beforeEach(() => {
    events.length = 0;
  });

  afterAll(async () => {
    await app.close();
    await Sentry.close(2000);
  });

  it('reports an unexpected server error while returning HTTP 500', async () => {
    await request(app.getHttpServer())
      .get('/__test-errors/unexpected?email=synthetic@example.invalid')
      .set('Cookie', 'session=synthetic-session')
      .set('Authorization', 'Bearer synthetic-token')
      .set('X-Test-Email', 'synthetic@example.invalid')
      .expect(500);
    await Sentry.flush(2000);

    expect(events).toHaveLength(1);
    expect(events[0]?.exception?.values?.[0]?.value).toBe('Synthetic API failure');
    expect(events[0]?.user).toBeUndefined();
    expect(JSON.stringify(events)).not.toMatch(
      /synthetic-session|synthetic-token|synthetic@example/,
    );
  });

  it('does not report an expected HTTP 400 error', async () => {
    await request(app.getHttpServer()).get('/__test-errors/expected').expect(400);
    await Sentry.flush(2000);

    expect(events).toHaveLength(0);
  });
});
