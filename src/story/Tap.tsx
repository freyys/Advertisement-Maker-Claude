import React from 'react';
import {prog, ease} from '../lib/anim';

/** Touch indicator: a soft dot lands, then a ring ripples out. */
export const Tap: React.FC<{frame: number; at: number; x: number; y: number; size: number}> = ({
  frame,
  at,
  x,
  y,
  size,
}) => {
  if (frame < at - 8 || frame > at + 18) return null;
  const land = prog(frame, at - 8, at, ease.out);
  const lift = prog(frame, at + 3, at + 12, ease.soft);
  const ring = prog(frame, at, at + 16, ease.out);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.32)',
          border: '1.5px solid rgba(255,255,255,0.6)',
          opacity: land * (1 - lift),
          transform: `scale(${1.25 - 0.25 * land})`,
          pointerEvents: 'none',
        }}
      />
      {frame >= at ? (
        <div
          style={{
            position: 'absolute',
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: 999,
            border: '2px solid rgba(255,255,255,0.75)',
            opacity: 0.8 * (1 - ring),
            transform: `scale(${1 + ring * 1.4})`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </>
  );
};
