import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import type { Env } from './config/env.js';

export async function bootstrap(env: Env): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true, colors: false, compact: true }),
  });

  app.enableShutdownHooks();

  try {
    await app.listen(env.PORT);
  } catch (error) {
    await app.close();
    throw error;
  }
}
