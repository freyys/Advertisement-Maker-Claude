import {Easing, interpolate, spring} from 'remotion';
import {FPS} from '../timeline';

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  soft: Easing.bezier(0.4, 0, 0.2, 1),
  whip: Easing.bezier(0.7, 0, 0.2, 1),
};

const clampOpts = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

/** Eased 0→1 progress between two frames. */
export const prog = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = ease.out,
) => interpolate(frame, [from, to], [0, 1], {...clampOpts, easing});

/** Map frame through eased range. */
export const tween = (
  frame: number,
  from: number,
  to: number,
  a: number,
  b: number,
  easing: (t: number) => number = ease.out,
) => interpolate(frame, [from, to], [a, b], {...clampOpts, easing});

/**
 * Keyframes: [[frame, value], ...] with eased segments.
 */
export const keys = (
  frame: number,
  kf: Array<[number, number]>,
  easing: (t: number) => number = ease.inOut,
) => {
  if (frame <= kf[0][0]) return kf[0][1];
  for (let i = 0; i < kf.length - 1; i++) {
    const [f0, v0] = kf[i];
    const [f1, v1] = kf[i + 1];
    if (frame <= f1) {
      return interpolate(frame, [f0, f1], [v0, v1], {...clampOpts, easing});
    }
  }
  return kf[kf.length - 1][1];
};

/** Spring starting at a given frame (0 before). */
export const springAt = (
  frame: number,
  at: number,
  config: Partial<{damping: number; stiffness: number; mass: number}> = {},
  durationInFrames?: number,
) =>
  spring({
    frame: frame - at,
    fps: FPS,
    config: {damping: 14, stiffness: 170, mass: 0.9, ...config},
    durationInFrames,
  });

/** Smooth pseudo-noise drift for "never static" cameras. */
export const drift = (frame: number, seed: number, amp: number, speed = 1) =>
  amp *
  (Math.sin(frame * 0.021 * speed + seed * 1.7) * 0.6 +
    Math.sin(frame * 0.013 * speed + seed * 4.1) * 0.4);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
