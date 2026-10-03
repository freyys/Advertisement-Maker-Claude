// All timings live here (30 fps). Retime the teaser by editing this file only.
export const FPS = 30;
export const DURATION = 390; // 13.0 s

export const SCENES = {
  S1: {start: 0, end: 30}, // Ignition
  S2: {start: 30, end: 75}, // App icon
  S3: {start: 75, end: 165}, // Assistant at work
  S4: {start: 165, end: 210}, // Whip-zoom positions
  S5: {start: 210, end: 255}, // Quote ready
  S6: {start: 255, end: 285}, // Light arcs
  S7: {start: 285, end: 345}, // Command bar
  S8: {start: 345, end: 390}, // Bloom -> logo
} as const;

export type SceneKey = keyof typeof SCENES;

// How long a scene may stay mounted before/after its slot, so transitions can
// overlap (no hard cuts).
export const OVERLAP: Record<SceneKey, {pre: number; post: number}> = {
  S1: {pre: 0, post: 0},
  S2: {pre: 0, post: 0},
  S3: {pre: 0, post: 6},
  S4: {pre: 0, post: 8},
  S5: {pre: 0, post: 10},
  S6: {pre: 0, post: 0},
  S7: {pre: 0, post: 5},
  S8: {pre: 0, post: 0},
};

// Accent frames (whoosh hits of the reference sound).
export const HIT = {
  ignition: 15,
  send: 120,
  whip: 168,
  ready: 231,
  click: 327,
  bloom: 348,
} as const;

// Frame from which the end card is completely still.
export const HOLD_FROM = DURATION - 20;

// ---- Scene-internal beats (absolute frames) ------------------------------
export const S3_BEATS = {
  windowIn: 75, // icon starts flying to the title bar
  windowSettled: 92,
  dictateStart: 88,
  dictateEnd: 117,
  send: HIT.send,
  stepsStart: 123,
  stepEvery: 7,
  stepCheckAfter: 7,
  rowsStart: 127,
  rowEvery: 6,
  done: 153,
  whipOut: 159,
} as const;

export const S4_BEATS = {
  land: 177,
  rowSweepStart: 178,
  rowSweepEvery: 7,
  out: 204,
} as const;

export const S5_BEATS = {
  paperIn: 208,
  countStart: 214,
  countEnd: 240,
  pill: HIT.ready,
  out: 250,
} as const;

export const S6_BEATS = {
  arcsStart: 255,
  arcsMeet: 276,
} as const;

export const S7_BEATS = {
  typeStart: 287,
  typeEnd: 306,
  menuOpen: 302,
  cursorIn: 304,
  cursorArrive: 322,
  click: HIT.click,
  menuClose: 334,
} as const;

export const S8_BEATS = {
  stretch: 341,
  bloom: HIT.bloom,
  logoIn: 352,
  tagline1: 361,
  tagline2: 366,
} as const;
