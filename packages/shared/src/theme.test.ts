import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { DEFAULT_THEME, parseThemeOrDefault, type Theme, ThemeSchema } from './theme.js';

const validTheme = {
  colors: { primary: '#c2410c', background: '#fafaf9', foreground: '#1c1917' },
  fonts: { heading: 'playfair-display', body: 'inter' },
  radius: 'sm',
} satisfies Theme;

function withColor(primary: string) {
  return { ...validTheme, colors: { ...validTheme.colors, primary } };
}

describe('ThemeSchema', () => {
  it('accepts a valid theme', () => {
    expect(ThemeSchema.parse(validTheme)).toEqual(validTheme);
  });

  it('stores colors in lowercase', () => {
    expect(ThemeSchema.parse(withColor('#C2410C')).colors.primary).toBe('#c2410c');
  });

  it.each(['c2410c', '#fff', '#c2410c80', 'red', 'rgb(194, 65, 12)'])(
    'rejects the color "%s"',
    (color) => {
      expect(ThemeSchema.safeParse(withColor(color)).success).toBe(false);
    },
  );

  it.each(['Playfair Display', 'playfair_display', ''])('rejects the font key "%s"', (heading) => {
    const theme = { ...validTheme, fonts: { ...validTheme.fonts, heading } };
    expect(ThemeSchema.safeParse(theme).success).toBe(false);
  });

  it('rejects a radius outside the scale', () => {
    expect(ThemeSchema.safeParse({ ...validTheme, radius: 'xl' }).success).toBe(false);
  });

  it('drops unknown keys', () => {
    expect(ThemeSchema.parse({ ...validTheme, shadow: 'lg' })).toEqual(validTheme);
  });

  it('accepts its own default theme', () => {
    expect(ThemeSchema.parse(DEFAULT_THEME)).toEqual(DEFAULT_THEME);
  });
});

describe('parseThemeOrDefault', () => {
  it('returns a valid theme as parsed', () => {
    const onInvalid = vi.fn();
    expect(parseThemeOrDefault(withColor('#C2410C'), onInvalid)).toEqual(validTheme);
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it.each([
    ['null', null],
    ['an empty object', {}],
    ['a broken color', withColor('red')],
    ['a string', 'dark'],
  ])('falls back to the default theme for %s', (_case, value) => {
    expect(parseThemeOrDefault(value)).toEqual(DEFAULT_THEME);
  });

  it('reports why the theme was invalid', () => {
    const onInvalid = vi.fn();
    parseThemeOrDefault(withColor('red'), onInvalid);
    expect(onInvalid).toHaveBeenCalledOnce();
    expect(onInvalid.mock.calls[0]?.[0]).toBeInstanceOf(z.ZodError);
  });
});
