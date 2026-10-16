import { readFileSync } from 'node:fs';

import { z } from 'zod';

const PackageMetadataSchema = z.object({
  version: z.string().min(1),
});

const metadata: unknown = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);

export const APP_VERSION = PackageMetadataSchema.parse(metadata).version;
