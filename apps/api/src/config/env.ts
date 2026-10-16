import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  SENTRY_DSN: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .url({ protocol: /^https?$/ })
      .pipe(
        z.string().refine((value) => {
          const dsn = new URL(value);
          return Boolean(dsn.username) && /\/\d+$/.test(dsn.pathname);
        }, 'Expected a Sentry DSN with a public key and project ID'),
      )
      .optional(),
  ),
  SENTRY_ENVIRONMENT: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.string().trim().min(1).optional(),
  ),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(input: Record<string, unknown>): Env {
  const result = EnvSchema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return result.data;
}
