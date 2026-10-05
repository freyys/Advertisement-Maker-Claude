// Gold reel: every scene slot in seconds, synced to public/gold/voice.mp3 (71.5 s).
// The brief planned ~55 s; the delivered voice-over runs 71.5 s, so each scene
// is stretched to the sentence it illustrates.
export const FPS = 24;
export const W = 1080;
export const H = 1920;
/** Instagram UI: keep text out of the top and bottom 250 px. */
export const SAFE = 250;

export const sec = (s: number) => Math.round(s * FPS);

export const SCENES = {
  s1: [0, 9.0], // pillow + fading 100 € note
  s2: [9.0, 20.0], // ounce + growing bar 330 → 3.680 €
  s3: [20.0, 27.3], // split: press vs. bar
  s4: [27.3, 37.3], // central bank vault, 289 t
  s5: [37.3, 43.6], // banker closes the vault door
  s6: [43.6, 51.4], // montage silver/copper/EV/servers
  s7: [51.4, 62.0], // chart: Jan 2026 peak, −25 %
  s8: [62.0, 67.2], // bar sinks like an anchor
  s9: [67.2, 72.3], // logo / handle
} as const;

export type SceneKey = keyof typeof SCENES;
/** Crossfade length between scenes (frames). */
export const XFADE = 8;
export const DURATION = sec(SCENES.s9[1]);
