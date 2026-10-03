import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette, STAGE} from '../theme';
import {HIT} from '../timeline';
import {ease, keys, prog, tween} from '../lib/anim';

export const BLOOM_RADIUS = 680; // ~70 % of the frame

/** Soft radial bloom: white-hot core, violet body, lavender rim. */
export const Bloom: React.FC<{
  radius: number;
  heat?: number; // 0..1 how white the core is
  opacity?: number;
  x?: number;
  y?: number;
}> = ({radius, heat = 0.5, opacity = 1, x = STAGE.width / 2, y = STAGE.height / 2}) => (
  <div
    style={{
      position: 'absolute',
      left: x - radius,
      top: y - radius,
      width: radius * 2,
      height: radius * 2,
      borderRadius: '50%',
      opacity,
      background: `radial-gradient(circle, rgba(${236 + heat * 19},${228 + heat * 27},255,${0.5 + heat * 0.5}) 0%, rgba(196,176,255,${0.42 + heat * 0.4}) ${7 + heat * 7}%, rgba(150,118,255,0.6) ${22 + heat * 6}%, rgba(109,74,255,0.4) 40%, rgba(60,40,170,0.2) 58%, rgba(42,27,110,0.08) 70%, rgba(42,27,110,0) 80%)`,
    }}
  />
);

export const S1Ignition: React.FC = () => {
  const frame = useCurrentFrame();

  // Light point pulses twice, then explodes at the ⚡ frame.
  const pulse =
    keys(frame, [
      [0, 0],
      [3, 0.55],
      [6, 1],
      [9, 0.55],
      [12, 1.15],
      [HIT.ignition - 1, 0.7],
    ]) * (frame < HIT.ignition ? 1 : 0);
  const pointOpacity = tween(frame, 0, 4, 0, 1);

  const burst = prog(frame, HIT.ignition, HIT.ignition + 13, ease.out);
  const radius = burst * BLOOM_RADIUS;
  const heat = keys(frame, [
    [HIT.ignition, 1],
    [HIT.ignition + 4, 1],
    [HIT.ignition + 15, 0.45],
  ]);
  const ring = prog(frame, HIT.ignition, HIT.ignition + 14, ease.out);

  const cx = STAGE.width / 2;
  const cy = STAGE.height / 2;

  return (
    <AbsoluteFill>
      {frame < HIT.ignition + 1 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: cx - 120,
              top: cy - 120,
              width: 240,
              height: 240,
              borderRadius: '50%',
              opacity: pointOpacity * (0.35 + pulse * 0.4),
              transform: `scale(${0.5 + pulse * 0.6})`,
              background: `radial-gradient(circle, rgba(169,139,255,0.55) 0%, rgba(109,74,255,0.18) 35%, rgba(109,74,255,0) 70%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: cx - 7,
              top: cy - 7,
              width: 14,
              height: 14,
              borderRadius: '50%',
              opacity: pointOpacity,
              transform: `scale(${0.7 + pulse * 0.5})`,
              background: '#fff',
              boxShadow: `0 0 18px 6px ${palette.lavender}, 0 0 50px 14px rgba(109,74,255,0.7)`,
            }}
          />
        </>
      ) : null}
      {frame >= HIT.ignition ? (
        <>
          <Bloom radius={Math.max(1, radius)} heat={heat} />
          {/* shock ring */}
          <div
            style={{
              position: 'absolute',
              left: cx - 600,
              top: cy - 600,
              width: 1200,
              height: 1200,
              borderRadius: '50%',
              border: `3px solid rgba(214,200,255,${0.7 * (1 - ring)})`,
              transform: `scale(${0.05 + ring * 0.95})`,
              boxShadow: `0 0 40px rgba(169,139,255,${0.5 * (1 - ring)})`,
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
