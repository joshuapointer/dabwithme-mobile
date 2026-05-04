// dabwith.me — squishy-pastel design tokens
// Hex approximations of brand-spec.md OKLCH values.

import { Platform, TextStyle } from 'react-native';

export const colors = {
  bg: '#F6F0F4',
  surface: '#FBF6F9',
  border: '#E2D7E0',
  muted: '#7C6E7E',
  fg: '#3F3447',
  accent: '#EE9C7B',
  accentDeep: '#D17855',
  mint: '#A6DCC2',
  mintDeep: '#5DA988',
  lilac: '#CDB6DB',
  butter: '#EADD9A',
  warm: '#E8B07B',
  bgScrim: 'rgba(246, 240, 244, 0.7)',
  shadow: 'rgba(110, 90, 130, 0.18)',
};

export const fonts = {
  display: Platform.select({
    ios: 'SF Pro Rounded',
    default: 'System',
  }) as string,
  body: Platform.select({
    ios: 'System',
    default: 'System',
  }) as string,
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'Menlo',
  }) as string,
};

export const radii = {
  card: 24,
  pill: 999,
  chip: 14,
  small: 16,
};

export const shadow = {
  soft: {
    shadowColor: '#5A4868',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  pop: {
    shadowColor: '#D17855',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

export const text: Record<string, TextStyle> = {
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  h1: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -1,
    color: colors.fg,
  },
  lede: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    maxWidth: 320,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.muted,
    textTransform: 'uppercase',
  },
};
