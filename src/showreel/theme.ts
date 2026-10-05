import {Easing} from 'remotion';

// Palette taken from the Kavox UI screenshots.
export const C = {
  bg0: '#07090C',
  bg1: '#0E1318',
  cyan: '#5BC8E8',
  cyanUi: '#5CC4E4', // exact accent in the desktop screenshots
  bubble: '#77C2E1', // user bubble / primary buttons on the phone
  ink: '#0B2F44', // text on the cyan buttons
  yellow: '#F5C04A',
  red: '#F0607A',
  green: '#3DDC97',
  greenUi: '#34D399', // the "Offline" dot in the sidebar
  violet: '#9B8CFF',
  white: '#F4F6F8',
  muted: 'rgba(244,246,248,0.62)',
  faint: 'rgba(244,246,248,0.38)',
  // App surfaces (sampled)
  appBg: '#0A0A0A',
  appTop: '#1C272D',
  card: '#111113',
  cardDesk: '#111114',
  palette: '#17171C',
} as const;

// The red / green / blue diagonal stripes from the PDF corners.
export const STRIPES = ['#0077C0', '#00975F', '#E40230'] as const;

export const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

export const tabular = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1',
} as const;

// Motion language: one signature curve for everything that lands.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
// Slow camera moves that start and stop softly.
export const EASE_CAM = Easing.bezier(0.45, 0, 0.2, 1);
// Exits: accelerate away.
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
