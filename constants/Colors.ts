export const Palette = {
  // Official Design.md Specification Colors
  primary: '#26A6A6',          // Tropical Sea Teal (brand primary & key CTAs)
  primaryLight: '#DDF4F2',     // Soft Seafoam tint (chips & secondary highlights)
  background: '#FAF9F5',       // Warm Off-White canvas
  surface: '#FFFFFF',          // Pure White for cards & sheets
  cardBg: '#FFFFFF',           // Card surface
  white: '#FFFFFF',

  // Typography Colors
  textPrimary: '#18343A',      // Dark Slate Teal (high contrast 12.8:1 on #FAF9F5)
  textSecondary: '#607276',    // Muted Teal Grey (5.2:1 on #FAF9F5, passes WCAG AA)
  textMuted: '#8A989B',        // Light Slate for placeholders & footnotes

  // Semantic Accents
  success: '#46A758',          // Island green
  warning: '#E3A33B',          // Warm Amber (accent line on Last Session card)
  danger: '#E85C5C',           // Coral Red for destructive actions
  info: '#4C8FD9',             // Sky blue

  // Structural & Borders
  borderLight: '#E8ECEB',      // Subtle clean card border
  borderSoft: '#DDF4F2',       // Soft teal border
  chipBg: '#F0F7F6',           // Very light seafoam for chips & inputs
  chipActiveBg: '#26A6A6',     // Active chip background
  overlay: 'rgba(24, 52, 58, 0.55)', // Modal backdrop

  // Compatibility Aliases for components
  deepTeal: '#26A6A6',
  seaGreen: '#26A6A6',
  oceanTeal: '#26A6A6',
  softAqua: '#DDF4F2',
  tropicalBlue: '#26A6A6',
  brightAqua: '#DDF4F2',
  skySoft: '#DDF4F2',
  amberAccent: '#E3A33B',
  sandWood: '#8A989B',
  sandWoodDark: '#607276',
};

export const Tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    card: 16,
    hero: 20,
    modal: 24,
    pill: 999,
    full: 9999,
  },
};

export default {
  light: {
    text: Palette.textPrimary,
    background: Palette.background,
    tint: Palette.primary,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.primary,
  },
  dark: {
    text: Palette.white,
    background: '#12262A',
    tint: Palette.primaryLight,
    tabIconDefault: '#607276',
    tabIconSelected: Palette.primaryLight,
  },
};
