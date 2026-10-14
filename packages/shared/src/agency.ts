import { z } from 'zod';

import { KEBAB_CASE } from './patterns.js';

export const AGENCY_STATUSES = ['active', 'suspended'] as const;
export const SUPPORTED_LOCALES = ['es-MX'] as const;
export const SUPPORTED_CURRENCIES = ['MXN'] as const;

/** Days a delivered gallery waits for a decision before deletion (D16). */
export const DEFAULT_RETENTION_DAYS = 60;

/**
 * The agency slug becomes a subdomain (`{slug}.focaldrop.com`), so it is capped
 * at 63 characters, the maximum length of a DNS label.
 */
export const AgencySlugSchema = z.string().min(3).max(63).regex(KEBAB_CASE);

function isTimeZone(value: string): boolean {
  // `Intl` exists in the browser, in Node and in Workers; it throws on unknown zones.
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** IANA time zone, such as `America/Mexico_City`. */
export const TimeZoneSchema = z.string().refine(isTimeZone);

/**
 * An agency as the API exposes it. Fields are camelCase; Drizzle maps them to
 * the snake_case columns of `agencies` (Phase 1B §2). Dates travel as ISO 8601.
 */
export const AgencySchema = z.object({
  id: z.uuid(),
  slug: AgencySlugSchema,
  name: z.string().trim().min(1).max(120),
  status: z.enum(AGENCY_STATUSES),
  timezone: TimeZoneSchema,
  locale: z.enum(SUPPORTED_LOCALES),
  currency: z.enum(SUPPORTED_CURRENCIES),
  notificationEmail: z.email(),
  retentionDays: z.int().min(1),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export type Agency = z.infer<typeof AgencySchema>;
