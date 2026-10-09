// Kavox pitch reel: 24 s at 30 fps, cut to a 120 BPM grid.
// One beat = 15 frames, one bar = 60 frames. The music has a half-bar pickup,
// so bar lines fall on frame 30 + 60·n; every cut below sits on one.

export const FPS = 30;
export const BEAT = 15;
export const BAR = 60;
export const DURATION = 720;

export type ShotId =
  | 'hook'
  | 'reveal'
  | 'quote'
  | 'measure'
  | 'pdf'
  | 'invoice'
  | 'overview'
  | 'companion'
  | 'offline'
  | 'values'
  | 'end';

/** `pre`: frames the shot is already running underneath the previous one (transitions). */
export const SHOTS: Array<{id: ShotId; from: number; to: number; pre?: number}> = [
  {id: 'hook', from: 0, to: 90},
  {id: 'reveal', from: 90, to: 150},
  {id: 'quote', from: 150, to: 210, pre: 16},
  {id: 'measure', from: 210, to: 270},
  {id: 'pdf', from: 270, to: 330},
  {id: 'invoice', from: 330, to: 390},
  {id: 'overview', from: 390, to: 450},
  {id: 'companion', from: 450, to: 510},
  {id: 'offline', from: 510, to: 570},
  {id: 'values', from: 570, to: 630},
  {id: 'end', from: 630, to: 720},
];

export const shot = (id: ShotId) => SHOTS.find((s) => s.id === id)!;

/** The six product shots share one linen stage and whip-pan into each other. */
export const MONTAGE: ShotId[] = ['quote', 'measure', 'pdf', 'invoice', 'overview', 'companion'];
