import { z } from 'zod';

import { KEBAB_CASE } from './patterns.js';

export const RADIUS_SCALE = ['none', 'sm', 'md', 'lg'] as const;

/** `#rrggbb`, stored in lowercase so equal colors compare equal. */
export const HexColorSchema = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i)
  .toLowerCase();

/** Key of a font in the platform catalog (`next/font`), such as `system-sans`. */
export const FontKeySchema = z.string().max(40).regex(KEBAB_CASE);

/**
 * Design tokens of an agency site (`agency_sites.theme`). The web app prints
 * them as CSS variables (Phase 1A §3.4). Minimal on purpose: it grows with the
 * design in milestone 2.
 */
export const ThemeSchema = z.object({
  colors: z.object({
    primary: HexColorSchema,
    background: HexColorSchema,
    foreground: HexColorSchema,
  }),
  fonts: z.object({
    heading: FontKeySchema,
    body: FontKeySchema,
  }),
  radius: z.enum(RADIUS_SCALE),
});

export type Theme = z.infer<typeof ThemeSchema>;

/** Neutral platform theme. It belongs to Focal Drop, never to an agency. */
export const DEFAULT_THEME = {
  colors: {
    primary: '#1f2937',
    background: '#ffffff',
    foreground: '#111827',
  },
  fonts: {
    heading: 'system-sans',
    body: 'system-sans',
  },
  radius: 'md',
} as const satisfies Theme;

/**
 * Reads a stored theme. A broken theme falls back to the default instead of
 * breaking the public site (Phase 1A §3.4); `onInvalid` lets the caller report it.
 */
export function parseThemeOrDefault(
  value: unknown,
  onInvalid?: (error: z.ZodError) => void,
): Theme {
  const result = ThemeSchema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  onInvalid?.(result.error);
  return DEFAULT_THEME;
}
