/**
 * Nex Guard Premium Product Theme
 * Inspired by Apple Health, WHOOP, Oura, Linear, Nothing.
 * Minimalist, typography-driven, semantic, and human.
 */

export const theme = {
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    surfaceCard: '#FFFFFF',

    // Text Hierarchy
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textSubtle: '#94A3B8',
    textInverse: '#FFFFFF',

    // Primary Brand
    primary: '#0F172A',
    primaryMuted: '#334155',

    // Semantic Status
    safe: '#059669',
    safeVibrant: '#10B981',
    safeBg: '#ECFDF5',

    warning: '#D97706',
    warningVibrant: '#F59E0B',
    warningBg: '#FFFBEB',

    emergency: '#DC2626',
    emergencyVibrant: '#EF4444',
    emergencyBg: '#FEF2F2',

    // Borders & Dividers
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    divider: '#F1F5F9',

    // Development / Neutral Tag
    tagBg: '#F1F5F9',
    tagText: '#64748B',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 36,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },

  typography: {
    displayHero: {
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 52,
      letterSpacing: -1.2,
    },
    displayStatus: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 38,
      letterSpacing: -0.8,
    },
    titleLarge: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
      letterSpacing: -0.4,
    },
    titleMedium: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    labelMedium: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '700' as const,
      letterSpacing: 1.5,
      color: '#64748B',
    },
  },
};
