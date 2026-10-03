import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette} from '../theme';
import {HOLD_FROM, SCENES, S8_BEATS} from '../timeline';
import {keys, prog, ease} from '../lib/anim';

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/**
 * Signature Kavox wallpaper: blush → violet glow in the top-left corner,
 * lavender in the bottom-right, black through the middle.
 */
export const Wallpaper: React.FC<{opacity?: number; breathe?: number}> = ({
  opacity = 1,
  breathe = 0,
}) => (
  <AbsoluteFill style={{opacity}}>
    <AbsoluteFill style={{background: palette.bg}} />
    {/* top-left: blush corner fading through violet into the black centre */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse ${52 + breathe * 2}% ${122 + breathe * 3}% at 0% 0%, #CD98A9 0%, #AE80AC 14%, #8360A3 29%, #583D8E 44%, #301E66 60%, #140C38 76%, rgba(7,6,15,0) 94%)`,
      }}
    />
    {/* bottom-right: lavender corner */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse ${37 + breathe * 2}% ${88 + breathe * 3}% at 100% 100%, #A271E7 0%, #8C60D0 19%, #6A44A8 38%, #43306A 57%, #1A1230 75%, rgba(7,6,15,0) 93%)`,
      }}
    />
  </AbsoluteFill>
);

/**
 * The world behind the UI. Reads the global frame and the timeline, so every
 * scene sits on the same continuous, breathing background (no hard cuts).
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // S1 starts on pure black; the ambient glows wake up with the app icon.
  const wake = prog(frame, 22, 60, ease.soft);
  // S6–S7: shift to a deeper blue-violet
  const deep = keys(
    frame,
    [
      [SCENES.S6.start - 8, 0],
      [SCENES.S6.start + 12, 1],
      [SCENES.S8.start, 1],
      [SCENES.S8.start + 10, 0.4],
    ],
    ease.inOut,
  );
  // S8: signature wallpaper
  const wall = prog(frame, S8_BEATS.bloom + 4, S8_BEATS.bloom + 22, ease.soft);

  // breathing stops for the final hold so the end card is perfectly still
  const t = Math.min(frame, HOLD_FROM) / 30;
  const b1 = Math.sin(t * 1.3) * 0.5 + 0.5;
  const b2 = Math.sin(t * 1.05 + 2.1) * 0.5 + 0.5;

  // Glow positions drift slowly
  const ax = 18 + Math.sin(t * 0.35) * 4;
  const ay = 20 + Math.cos(t * 0.3) * 4;
  const bx = 84 + Math.sin(t * 0.32 + 1) * 4;
  const by = 82 + Math.cos(t * 0.28 + 2) * 4;

  return (
    <AbsoluteFill style={{background: palette.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: wake * (1 - wall)}}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${48 + b1 * 6}% ${62 + b1 * 8}% at ${ax}% ${ay}%, ${rgba(palette.violet, 0.34 + b1 * 0.08)} 0%, ${rgba(palette.indigo, 0.42)} 32%, transparent 72%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${44 + b2 * 6}% ${58 + b2 * 8}% at ${bx}% ${by}%, ${rgba('#3A3FD8', 0.26 + b2 * 0.08)} 0%, ${rgba(palette.indigo, 0.36)} 36%, transparent 74%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 30% 30% at 2% 0%, ${rgba(palette.blush, 0.16)} 0%, transparent 70%)`,
          }}
        />
      </AbsoluteFill>
      {/* Deep blue-violet wash for the light-arc + command bar scenes */}
      <AbsoluteFill
        style={{
          opacity: deep * (1 - wall),
          background: `radial-gradient(ellipse 80% 70% at 50% 58%, ${rgba('#3A2BB8', 0.55 + b1 * 0.08)} 0%, ${rgba('#1B1466', 0.65)} 38%, ${rgba('#0B0828', 0.9)} 72%, ${palette.bg} 100%)`,
        }}
      />
      <Wallpaper opacity={wall} breathe={b1} />
    </AbsoluteFill>
  );
};

/** Film grain (2–3 %) + vignette, on top of everything. */
export const GrainVignette: React.FC<{seedOffset?: number}> = ({seedOffset = 0}) => {
  const frame = useCurrentFrame();
  // lighter vignette on the end card so the wallpaper corners keep their colour
  const v = 1 - 0.65 * prog(frame, S8_BEATS.bloom, S8_BEATS.bloom + 14, ease.soft);
  const seed = (frame + seedOffset) % 12;
  const id = `grain-${seed}`;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(ellipse 78% 76% at 50% 50%, transparent 55%, rgba(0,0,0,${0.3 * v}) 82%, rgba(0,0,0,${0.55 * v}) 100%)`,
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay'}}
      >
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
