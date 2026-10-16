import { Injectable } from '@nestjs/common';
import { HealthResponseSchema, type HealthResponse } from '@focaldrop/shared';

import { APP_VERSION } from './constants/app.constants.js';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return HealthResponseSchema.parse({
      status: 'ok',
      version: APP_VERSION,
    });
  }
}
