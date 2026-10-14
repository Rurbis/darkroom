import { describe, expect, it } from 'vitest';

import { type Agency, AgencySchema } from './agency.js';

const validAgency = {
  id: '0199e0a4-7c2b-7d3e-8f41-2a6b9c0d1e2f',
  slug: 'agencia-demo',
  name: 'Agencia Demo',
  status: 'active',
  timezone: 'America/Mexico_City',
  locale: 'es-MX',
  currency: 'MXN',
  notificationEmail: 'avisos@example.com',
  retentionDays: 60,
  createdAt: '2026-10-13T18:30:00.000Z',
  updatedAt: '2026-10-13T18:30:00-06:00',
} satisfies Agency;

function parseWith(overrides: Record<string, unknown>) {
  return AgencySchema.safeParse({ ...validAgency, ...overrides });
}

describe('AgencySchema', () => {
  it('accepts a valid agency', () => {
    expect(AgencySchema.parse(validAgency)).toEqual(validAgency);
  });

  it('trims the name', () => {
    expect(AgencySchema.parse({ ...validAgency, name: '  Agencia Demo ' }).name).toBe(
      'Agencia Demo',
    );
  });

  it('accepts a slug of exactly 63 characters', () => {
    expect(parseWith({ slug: 'a'.repeat(63) }).success).toBe(true);
  });

  it.each([
    ['uppercase', 'Agencia-Demo'],
    ['spaces', 'agencia demo'],
    ['accents', 'cámara-lúcida'],
    ['leading hyphen', '-agencia'],
    ['double hyphen', 'agencia--demo'],
    ['too short', 'ab'],
    ['longer than a DNS label', 'a'.repeat(64)],
  ])('rejects a slug with %s', (_case, slug) => {
    expect(parseWith({ slug }).success).toBe(false);
  });

  it.each(['America/Mexico_City', 'America/Tijuana', 'UTC'])(
    'accepts the time zone %s',
    (timezone) => {
      expect(parseWith({ timezone }).success).toBe(true);
    },
  );

  it.each(['Mars/Olympus_Mons', 'GMT-6 Mexico', ''])('rejects the time zone "%s"', (timezone) => {
    expect(parseWith({ timezone }).success).toBe(false);
  });

  it.each([0, -5, 1.5])('rejects %s retention days', (retentionDays) => {
    expect(parseWith({ retentionDays }).success).toBe(false);
  });

  it.each([
    ['an unknown status', { status: 'deleted' }],
    ['an unsupported locale', { locale: 'en-US' }],
    ['an unsupported currency', { currency: 'USD' }],
    ['an invalid email', { notificationEmail: 'avisos@' }],
    ['an empty name', { name: '   ' }],
    ['an id that is not a UUID', { id: '42' }],
    ['a date without time zone', { createdAt: '2026-10-13T18:30:00' }],
  ])('rejects %s', (_case, overrides) => {
    expect(parseWith(overrides).success).toBe(false);
  });

  it('rejects a missing field', () => {
    const { slug, ...withoutSlug } = validAgency;
    expect(AgencySchema.safeParse(withoutSlug).success).toBe(false);
  });
});
