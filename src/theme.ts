// Visual design system, inspired by the MemoDremo learning app:
// warm cream background, white rounded cards, soft shadows, a warm-orange
// accent, charcoal header, and clear green/red answer feedback.
export const theme = {
  bg: '#F5E7DA', // warm cream background
  card: '#FFFFFF', // lesson / stat cards
  imageBg: '#F1E8DC', // neutral frame behind a centered (contained) image
  header: '#2A2622', // charcoal navigation header
  headerText: '#FFFFFF',

  accent: '#E5913C', // warm orange — primary actions, active states
  accentDark: '#CC7E2C', // pressed state

  textPrimary: '#2A2620',
  textSecondary: '#9C8E7C',

  success: '#4FB477',
  successBg: '#E2F3E8',
  danger: '#E0695B',
  dangerBg: '#F7E1DD',

  option: '#F3ECE2', // option pill on a white card
  optionText: '#2A2620',

  radius: 24,
  radiusSm: 16,
} as const;
