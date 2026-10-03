import React from 'react';
import {palette} from '../theme';
import {drift} from '../lib/anim';
import {KMark} from './Logo';

export const ICON_SIZE = 230;
export const ICON_END_SCALE = 1.04;

/** Icon centre in S2 (shared with S3 so the hand-off is seamless). */
export const iconDrift = (frame: number) => ({
  x: drift(frame, 11, 7),
  y: drift(frame, 14, 5),
});

/** Rounded-square glass app icon with the white K mark inside. */
export const AppIcon: React.FC<{
  size: number;
  draw?: number;
  fill?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({size, draw = 1, fill = 1, glow = 1, style}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      position: 'relative',
      background: `linear-gradient(145deg, #8A6BFF 0%, ${palette.violet} 38%, #3F2AA6 72%, ${palette.indigo} 100%)`,
      boxShadow: [
        `inset 0 ${size * 0.012}px ${size * 0.02}px rgba(255,255,255,0.45)`,
        `inset 0 0 ${size * 0.16}px rgba(169,139,255,0.55)`,
        `inset 0 -${size * 0.06}px ${size * 0.12}px rgba(18,13,46,0.55)`,
        `0 0 ${size * 0.5 * glow}px rgba(109,74,255,${0.55 * glow})`,
        `0 ${size * 0.08}px ${size * 0.25}px rgba(0,0,0,0.45)`,
      ].join(', '),
      overflow: 'hidden',
      ...style,
    }}
  >
    {/* glass sheen */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 34%, rgba(255,255,255,0) 52%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: size * 0.28,
        border: `${Math.max(1, size * 0.008)}px solid rgba(255,255,255,0.22)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: size * 0.02,
        filter: `drop-shadow(0 0 ${size * 0.05}px rgba(255,255,255,0.5))`,
      }}
    >
      <KMark size={size * 0.44} draw={draw} fill={fill} strokeWidth={3} />
    </div>
  </div>
);
