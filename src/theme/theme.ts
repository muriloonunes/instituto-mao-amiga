export const theme = {
  colors: {
    background: '#121214',
    card: '#202024',
    border: '#29292e',
    primary: '#00b37e',
    text: '#f1f1f1',
    textSecondary: '#c4c4cc',
    textMuted: '#8d8d99',
    placeholder: '#7c7c8a',
    danger: '#f75a68',
    shadow: '#000',
  },
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 15,
    xl: 16,
    '2xl': 18,
    '3xl': 22,
    '4xl': 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  spacing: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
    '2xl': 16,
    '3xl': 32,
    '4xl': 40,
  },
} as const;

export type Theme = typeof theme;
