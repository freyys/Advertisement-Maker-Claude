import React from 'react';
import type {Img, Rect} from '../assets';
import {View} from './Screen';

/**
 * A close-up of the MacBook screen: a floating glass panel showing a region
 * of a desktop screenshot, with a thin bezel edge and a cyan rim light.
 */
export const Display: React.FC<{
  img: Img;
  view: Rect;
  w: number;
  h: number;
  radius?: number;
  rim?: number;
  glare?: number;
  hideBase?: boolean;
  children?: React.ReactNode;
}> = ({img, view, w, h, radius = 22, rim = 1, glare = 1, hideBase, children}) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: h,
      borderRadius: radius,
      boxShadow: [
        '0 0 0 1px rgba(255,255,255,0.10)',
        `0 ${w * 0.03}px ${w * 0.08}px rgba(0,0,0,0.6)`,
        `0 0 ${w * 0.08 * rim}px rgba(91,200,232,${0.18 * rim})`,
      ].join(', '),
    }}
  >
    <View img={img} view={view} w={w} h={h} radius={radius} hideBase={hideBase}>
      {children}
    </View>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        opacity: glare,
        pointerEvents: 'none',
        background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 30%, rgba(255,255,255,0) 45%)',
        boxShadow: `inset 0 0 0 1.5px rgba(160,225,245,${0.22 * rim})`,
      }}
    />
  </div>
);

/** Interpolate two rectangles. */
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

/** A view rectangle of the given aspect, centred on (cx, cy) with width w. */
export const viewAt = (cx: number, cy: number, w: number, aspect: number): Rect => ({x: cx - w / 2, y: cy - w / aspect / 2, w, h: w / aspect});
