import {Easing} from 'remotion';

// Kavox brand book (Pomelli): Classic Linen, Jet Black, Hyacinth Blue.
export const B = {
  linen: '#F4F1EA',
  linenHi: '#FAF8F3',
  linenLo: '#E8E3D7',
  black: '#0A0A0C',
  hyacinth: '#6E44FF',
  hyacinthSoft: '#B5A2FF',
  lilac: '#D9D1F5', // the "Aesthetic" card in the brand book
  ink: '#1B1B20',
  grey: '#6E6A62', // secondary text on linen
  greyDark: '#8F8C85', // secondary text on black
  hair: 'rgba(10,10,12,0.08)',
} as const;

export const HY = '110,68,255'; // hyacinth as an rgb triplet
export const LN = '244,241,234'; // linen as an rgb triplet

export const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

export const tabular = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1',
} as const;

// One landing curve for everything, a soft camera curve, and an exit curve.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_CAM = Easing.bezier(0.45, 0, 0.2, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IO = Easing.bezier(0.83, 0, 0.17, 1);
