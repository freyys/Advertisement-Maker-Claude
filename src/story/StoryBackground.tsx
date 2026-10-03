import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette} from '../theme';
import {rgba, Wallpaper} from '../components/Background';
import {END} from './timeline';
import {ease, prog} from '../lib/anim';
import {span} from './util';

/** Calm, breathing glows; resolves into the Kavox wallpaper at the end. */
export const StoryBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END.holdFrom);
  const t = f / 30;
  const b1 = Math.sin(t * 0.9) * 0.5 + 0.5;
  const b2 = Math.sin(t * 0.7 + 2) * 0.5 + 0.5;
  const wake = prog(frame, 0, 40, ease.soft);
  const wall = span(frame, END.wallpaper, ease.soft);
  return (
    <AbsoluteFill style={{background: palette.bg}}>
      <AbsoluteFill style={{opacity: wake * (1 - wall)}}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${50 + b1 * 5}% ${70 + b1 * 6}% at ${14 + Math.sin(t * 0.25) * 4}% ${18 + Math.cos(t * 0.2) * 4}%, ${rgba(palette.violet, 0.3 + b1 * 0.06)} 0%, ${rgba(palette.indigo, 0.4)} 34%, transparent 74%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${46 + b2 * 5}% ${64 + b2 * 6}% at ${86 + Math.sin(t * 0.22 + 1) * 4}% ${84 + Math.cos(t * 0.24) * 4}%, ${rgba('#3A3FD8', 0.24 + b2 * 0.06)} 0%, ${rgba(palette.indigo, 0.34)} 38%, transparent 76%)`,
          }}
        />
        <AbsoluteFill
          style={{background: `radial-gradient(ellipse 34% 30% at 0% 0%, ${rgba(palette.blush, 0.14)} 0%, transparent 70%)`}}
        />
      </AbsoluteFill>
      <Wallpaper opacity={wall} breathe={b1} />
    </AbsoluteFill>
  );
};

/** Grain + vignette for the story cut (lighter on the end card). */
export const StoryGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const v = 1 - 0.65 * span(frame, END.wallpaper, ease.soft);
  const seed = frame % 12;
  const id = `story-grain-${seed}`;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 78% at 50% 50%, transparent 56%, rgba(0,0,0,${0.28 * v}) 83%, rgba(0,0,0,${0.5 * v}) 100%)`,
        }}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay'}}>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
