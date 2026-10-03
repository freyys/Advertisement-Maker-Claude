import type React from 'react';
import {interpolateColors} from 'remotion';
import type {Rect} from './layout';
import {ease, prog} from '../lib/anim';

// Material-style "emphasized" easing used for every container transform, so
// all morphs share one motion language.
export const emph = ease.inOut;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

export const mixColor = (a: string, b: string, t: number) =>
  interpolateColors(Math.min(1, Math.max(0, t)), [0, 1], [a, b]);

/** 0→1 between two frames given as a tuple. */
export const span = (frame: number, [a, b]: readonly [number, number], easing = emph) =>
  prog(frame, a, b, easing);

/** Fade/rise used for every entering element. */
export const enter = (t: number, dy = 14): React.CSSProperties => ({
  opacity: t,
  transform: `translateY(${(1 - t) * dy}px)`,
});
