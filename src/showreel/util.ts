import {interpolate, spring, useVideoConfig} from 'remotion';
import {EASE} from './theme';
import {FPS} from './timeline';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Eased 0→1 progress between two frames. */
export const prog = (f: number, from: number, to: number, easing: (t: number) => number = EASE) =>
  interpolate(f, [from, to], [0, 1], {...CLAMP, easing});

/** Eased value between two frames. */
export const tween = (
  f: number,
  from: number,
  to: number,
  a: number,
  b: number,
  easing: (t: number) => number = EASE,
) => interpolate(f, [from, to], [a, b], {...CLAMP, easing});

/** Keyframes [[frame, value], ...], each segment eased. */
export const keys = (f: number, kf: Array<[number, number]>, easing: (t: number) => number = EASE) => {
  if (f <= kf[0][0]) return kf[0][1];
  for (let i = 0; i < kf.length - 1; i++) {
    const [f0, v0] = kf[i];
    const [f1, v1] = kf[i + 1];
    if (f <= f1) return interpolate(f, [f0, f1], [v0, v1], {...CLAMP, easing});
  }
  return kf[kf.length - 1][1];
};

/** Spring that starts at frame `at` (0 before). */
export const pop = (f: number, at: number, config: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: 180, mass: 0.8, ...config}});

/** Slow organic drift so a plane is never perfectly static. */
export const drift = (f: number, seed: number, amp: number, speed = 1) =>
  amp * (Math.sin(f * 0.021 * speed + seed * 1.7) * 0.6 + Math.sin(f * 0.013 * speed + seed * 4.1) * 0.4);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ---- German number format --------------------------------------------------
const eurFmt = new Intl.NumberFormat('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
// Guard against a renderer without German locale data.
const intlOk = eurFmt.format(1463.62) === '1.463,62';
const manual = (n: number) => {
  const [i, d] = Math.abs(n).toFixed(2).split('.');
  return `${n < 0 ? '−' : ''}${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d}`;
};

/** 1463.62 → "1.463,62 €" (no-break space before the euro sign). */
export const eur = (n: number) => `${intlOk ? eurFmt.format(n) : manual(n)} €`;

/** Count-up value: eased from 0 to `to`, rounded to cents. */
export const countTo = (f: number, from: number, to: number, value: number) =>
  Math.round(value * prog(f, from, to, EASE) * 100) / 100;

/** Typewriter: the first n characters of a string. */
export const typed = (text: string, f: number, from: number, to: number) => {
  const n = Math.round(interpolate(f, [from, to], [0, text.length], CLAMP));
  return text.slice(0, n);
};

/** Layout helper: are we rendering the 9:16 cut? */
export const useFormat = () => {
  const {width, height} = useVideoConfig();
  return {W: width, H: height, v: height > width};
};
