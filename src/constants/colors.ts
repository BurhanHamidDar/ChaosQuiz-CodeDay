export const COLORS = {
  // Backgrounds
  BG_PRIMARY: '#06060f',
  BG_SECONDARY: '#0d0d1a',
  BG_CARD: '#111122',
  BG_CARD_BORDER: '#1a1a35',

  // Neon accents
  NEON_CYAN: '#00ffff',
  NEON_PINK: '#ff0080',
  NEON_PURPLE: '#8000ff',
  NEON_GREEN: '#00ff88',
  NEON_YELLOW: '#ffff00',
  NEON_ORANGE: '#ff6600',

  // Text
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#aaaacc',
  TEXT_MUTED: '#555577',
  TEXT_GLITCH: '#ff0080',

  // Status
  CORRECT: '#00ff88',
  WRONG: '#ff0033',
  WARNING: '#ffaa00',
  DANGER: '#ff0000',

  // Meter
  METER_FULL: '#00ff88',
  METER_MID: '#ffaa00',
  METER_LOW: '#ff4400',
  METER_CRITICAL: '#ff0000',

  // Transparency
  OVERLAY: 'rgba(0,0,0,0.85)',
  GLOW_CYAN: 'rgba(0,255,255,0.15)',
  GLOW_PINK: 'rgba(255,0,128,0.15)',
  GLOW_PURPLE: 'rgba(128,0,255,0.15)',
};

export const GRADIENTS = {
  BG: ['#06060f', '#0d0d1a', '#06060f'] as const,
  CHAOS: ['#1a0000', '#06060f', '#000011'] as const,
  RECOVERY: ['#000a05', '#06060f', '#05000a'] as const,
  NEON_BORDER: ['#00ffff', '#8000ff', '#ff0080'] as const,
  WELCOME: ['#06060f', '#0a0022', '#06060f'] as const,
};
