import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {STAGE} from '../theme';
import {drift} from '../lib/anim';

/**
 * A virtual camera over the 1920×1080 stage. The point (x, y) is placed in
 * the centre of the frame at the given zoom. A slow drift is always added so
 * no scene is ever static.
 */
export const Camera: React.FC<{
  frame: number;
  x?: number;
  y?: number;
  zoom?: number;
  rotate?: number;
  driftAmp?: number;
  seed?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  frame,
  x = STAGE.width / 2,
  y = STAGE.height / 2,
  zoom = 1,
  rotate = 0,
  driftAmp = 10,
  seed = 1,
  children,
  style,
}) => {
  const dx = drift(frame, seed, driftAmp);
  const dy = drift(frame, seed + 3, driftAmp * 0.6);
  const dr = drift(frame, seed + 7, 0.25);
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${STAGE.width / 2 + dx}px, ${STAGE.height / 2 + dy}px) rotate(${rotate + dr}deg) scale(${zoom}) translate(${-x}px, ${-y}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Directional (horizontal/vertical) blur via an SVG filter — used for the
 * whip transitions. Amounts in px.
 */
export const DirBlur: React.FC<{
  x?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = 0, y = 0, children, style}) => {
  const id = useId().replace(/:/g, '');
  const active = x > 0.3 || y > 0.3;
  return (
    <AbsoluteFill style={style}>
      {active ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <AbsoluteFill style={{filter: active ? `url(#${id})` : undefined}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
