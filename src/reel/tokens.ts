import type React from 'react';

// Colour + type tokens for the "KavoxReel" showreel. Every value is sampled
// from the real app screenshots (desktop at 2880×1800, phone at 780×1688), so
// the rebuilt UI matches the product instead of a generic mockup.

/** Desktop app (Cockpit, Dokumente, Angebot, Auswertung …). */
export const d = {
  bg: '#0A0A0C',
  sidebar: '#0C0C0F',
  card: '#111114',
  cardHi: '#141418',
  active: '#1A1D20',
  button: '#15161A',
  palette: '#17171C',
  paletteSel: '#22333D',
  line: 'rgba(255,255,255,0.075)',
  lineStrong: 'rgba(255,255,255,0.12)',
  accent: '#5CC4E4',
  accentInk: '#06273A',
  accentSoft: 'rgba(92,196,228,0.12)',
  area: '#1C2A31',
  text: '#F4F4F5',
  textSoft: '#D4D4D8',
  muted: '#A1A1AA',
  faint: '#71717A',
  yellow: '#FBBF24',
  rose: '#FB7185',
  green: '#34D399',
  violet: '#B49BFA',
} as const;

/** Phone app (Übersicht, Assistent, Aufmaß …). */
export const m = {
  bg: '#0A0A0A',
  tint: '#1C272D',
  card: '#111113',
  card2: '#18181A',
  field: '#161519',
  line: 'rgba(255,255,255,0.09)',
  accent: '#79C2E3',
  accentInk: '#0B2F44',
  accentDeep: '#3B5C6C',
  text: '#F4F4F5',
  textSoft: '#D9D9DC',
  muted: '#8B8A8E',
  rose: '#F07A8A',
  yellow: '#F5C04A',
  violet: '#B9A2FF',
  green: '#34D399',
} as const;

/** PDF document colours (Angebot). */
export const pdf = {
  blue: '#0093D9',
  blueLight: '#E1F1FA',
  red: '#E5173F',
  green: '#12A150',
  stripeBlue: '#0A72C7',
  ink: '#111111',
  grey: '#6B6B6B',
} as const;

export const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';
export const PDF_FONT = 'Arial, "Liberation Sans", "Helvetica Neue", Helvetica, sans-serif';

export const tnum: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1',
};

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

// Output canvas (9:16). Platform UI covers roughly the top 220 px and the
// bottom 380 px, plus a right-hand column of buttons on TikTok.
export const W = 1080;
export const H = 1920;
export const SAFE = {top: 220, bottom: 380, side: 72} as const;
