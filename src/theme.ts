import type {CSSProperties} from 'react';

// Brand palette (derived from the Kavox logo wallpaper) — used for the
// cinematic world around the UI: backgrounds, glows, light strokes, bloom.
export const palette = {
  bg: '#07060F',
  night: '#120D2E',
  indigo: '#2A1B6E',
  violet: '#6D4AFF',
  lavender: '#A98BFF',
  blush: '#E6A6C8',
  white: '#FFFFFF',
  muted: 'rgba(255,255,255,0.55)',
  success: '#4ADE9B',
} as const;

// Kavox app UI tokens — sampled from the real app (Assistent, Entwurf,
// Aufmaß screens). The recreated UI uses these so it looks like the product,
// not like a generic mockup.
export const app = {
  bg: '#0A0A0A',
  bgTint: '#1B262B', // teal tint at the top of every app screen
  surface: '#111012', // bubbles, cards
  field: '#161519', // inputs
  card: '#181719', // Aufmaß position cards
  button: '#1A191B', // secondary button
  border: 'rgba(255,255,255,0.075)',
  borderStrong: '#303135',
  accent: '#79C2E3', // sky blue: user bubble, primary button, labels
  accentInk: '#0B2F44', // text on accent
  accentDeep: '#3B5C6C', // send button
  toggleKnob: '#439288',
  text: '#F4F4F5',
  textSoft: '#D9D9DC',
  muted: '#8B8A8E',
  danger: '#F07A7A',
} as const;

export const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

export const tabular: CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1',
};

// Logical stage. Every scene is laid out on this canvas; the vertical
// composition places the same stage inside a tilted 16:10 screen panel.
export const STAGE = {width: 1920, height: 1080} as const;
