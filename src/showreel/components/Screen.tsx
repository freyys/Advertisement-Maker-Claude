import React from 'react';
import {Img as RImg} from 'remotion';
import type {Img, Rect} from '../assets';

/**
 * Natural-pixel space of one screenshot. Children are positioned in SOURCE
 * pixels, so overlays (patches, highlights, typed text) line up with the UI.
 */
export const Space: React.FC<{
  img: Img;
  children?: React.ReactNode;
  hideBase?: boolean;
  style?: React.CSSProperties;
}> = ({img, children, hideBase, style}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: img.w, height: img.h, ...style}}>
    {!hideBase && <RImg src={img.src} style={{position: 'absolute', left: 0, top: 0, width: img.w, height: img.h}} />}
    {children}
  </div>
);

/**
 * A viewport that maps the source rectangle `view` of a screenshot into a box
 * of `w` × `h` output pixels (cover). Animate `view` to zoom/pan inside it.
 */
export const View: React.FC<{
  img: Img;
  view?: Rect;
  w: number;
  h: number;
  radius?: number;
  hideBase?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({img, view, w, h, radius = 0, hideBase, children, style}) => {
  const v = view ?? {x: 0, y: 0, w: img.w, h: img.h};
  const k = Math.max(w / v.w, h / v.h);
  // centre the view inside the box
  const ox = (w - v.w * k) / 2 - v.x * k;
  const oy = (h - v.h * k) / 2 - v.y * k;
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: radius, ...style}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${ox}px, ${oy}px) scale(${k})`}}>
        <Space img={img} hideBase={hideBase}>
          {children}
        </Space>
      </div>
    </div>
  );
};

/** One rectangular piece of a screenshot, placed at its own position (source px). */
export const Band: React.FC<{
  img: Img;
  rect: Rect;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({img, rect, radius = 0, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      overflow: 'hidden',
      borderRadius: radius,
      ...style,
    }}
  >
    <RImg src={img.src} style={{position: 'absolute', left: -rect.x, top: -rect.y, width: img.w, height: img.h, maxWidth: 'none'}} />
    {children}
  </div>
);

/** A piece of a screenshot rendered standalone, scaled to `w` px wide. */
export const Crop: React.FC<{img: Img; rect: Rect; w: number; radius?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  img,
  rect,
  w,
  radius = 0,
  style,
  children,
}) => {
  const k = w / rect.w;
  return (
    <div style={{position: 'relative', width: w, height: rect.h * k, overflow: 'hidden', borderRadius: radius, ...style}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${k}) translate(${-rect.x}px, ${-rect.y}px)`}}>
        <Space img={img}>{children}</Space>
      </div>
    </div>
  );
};

/** Covers a rectangle of the screenshot (source px) with a flat colour or gradient. */
export const Patch: React.FC<{rect: Rect; fill: string; radius?: number; opacity?: number; feather?: number}> = ({
  rect,
  fill,
  radius = 0,
  opacity = 1,
  feather = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: rect.x,
      top: rect.y,
      width: rect.w,
      height: rect.h,
      background: fill,
      borderRadius: radius,
      opacity,
      filter: feather ? `blur(${feather}px)` : undefined,
    }}
  />
);

/** Soft cyan highlight box on top of a UI element. */
export const Highlight: React.FC<{rect: Rect; t: number; radius?: number; color?: string; pad?: number}> = ({
  rect,
  t,
  radius = 14,
  color = '91,200,232',
  pad = 8,
}) =>
  t <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: rect.x - pad,
        top: rect.y - pad,
        width: rect.w + pad * 2,
        height: rect.h + pad * 2,
        borderRadius: radius,
        border: `2px solid rgba(${color},${0.9 * t})`,
        background: `rgba(${color},${0.1 * t})`,
        boxShadow: `0 0 ${40 * t}px rgba(${color},${0.45 * t}), inset 0 0 ${24 * t}px rgba(${color},${0.18 * t})`,
      }}
    />
  );
