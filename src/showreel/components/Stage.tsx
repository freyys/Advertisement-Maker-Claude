import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {useFormat} from '../util';

/** Deep background: graphite gradient, a cyan volumetric glow and dust. */
export const Stage: React.FC<{
  glowX?: number; // 0..1 of width
  glowY?: number;
  glow?: number; // intensity
  glowSize?: number; // px
  hue?: string; // rgb triplet
  dust?: number;
  camX?: number; // camera offset for dust parallax (px)
  camY?: number;
  children?: React.ReactNode;
}> = ({glowX = 0.5, glowY = 0.5, glow = 1, glowSize, hue = '91,200,232', dust = 1, camX = 0, camY = 0, children}) => {
  const f = useCurrentFrame();
  const {W, H} = useFormat();
  const size = glowSize ?? Math.max(W, H) * 0.55;
  const breathe = 1 + Math.sin(f * 0.05) * 0.06;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 120% 90% at 50% 40%, ${C.bg1} 0%, ${C.bg0} 70%)`, overflow: 'hidden'}}>
      {/* volumetric glow behind the device */}
      <div
        style={{
          position: 'absolute',
          left: W * glowX - size / 2,
          top: H * glowY - size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${hue},${0.30 * glow}) 0%, rgba(${hue},${0.12 * glow}) 35%, rgba(${hue},0) 70%)`,
          transform: `scale(${breathe})`,
        }}
      />
      {/* faint light shafts */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5 * glow,
          background: `conic-gradient(from 200deg at ${glowX * 100}% ${glowY * 100 - 45}%, rgba(${hue},0) 0deg, rgba(${hue},0.06) 12deg, rgba(${hue},0) 24deg, rgba(${hue},0.04) 40deg, rgba(${hue},0) 52deg)`,
        }}
      />
      {dust > 0 && <Dust camX={camX} camY={camY} amount={dust} />}
      {children}
    </AbsoluteFill>
  );
};

/** Floating dust particles on three depth layers (parallax with the camera). */
export const Dust: React.FC<{camX?: number; camY?: number; amount?: number}> = ({camX = 0, camY = 0, amount = 1}) => {
  const f = useCurrentFrame();
  const {W, H} = useFormat();
  const N = 46;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(N).fill(0).map((_, i) => {
        const depth = 0.25 + random(`dd${i}`) * 0.9;
        const x0 = random(`dx${i}`) * (W + 200) - 100;
        const y0 = random(`dy${i}`) * (H + 200) - 100;
        const vx = (random(`vx${i}`) - 0.5) * 0.25;
        const vy = -0.12 - random(`vy${i}`) * 0.25;
        const x = ((x0 + f * vx * depth - camX * depth + W + 200) % (W + 200)) - 100;
        const y = ((y0 + f * vy * depth - camY * depth + H + 200) % (H + 200)) - 100;
        const s = 1.5 + depth * 3.2;
        const tw = 0.5 + 0.5 * Math.sin(f * 0.07 + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: 'rgba(200,236,248,1)',
              opacity: (0.1 + 0.25 * tw) * depth * amount,
              boxShadow: `0 0 ${s * 3}px rgba(91,200,232,${0.5 * depth})`,
              filter: depth > 1 ? `blur(${(depth - 1) * 4}px)` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 3D camera: perspective root. Children are placed around the centre. */
export const Camera: React.FC<{
  perspective?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({perspective = 2200, children, style}) => (
  <AbsoluteFill style={{perspective, perspectiveOrigin: '50% 50%', overflow: 'hidden', ...style}}>{children}</AbsoluteFill>
);

/** A plane positioned by its centre in 3D space. */
export const Plane: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  scale?: number;
  w: number;
  h: number;
  opacity?: number;
  blur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, scale = 1, w, h, opacity = 1, blur = 0, children, style}) => {
  const {W, H} = useFormat();
  return (
    <div
      style={{
        position: 'absolute',
        left: W / 2 - w / 2,
        top: H / 2 - h / 2,
        width: w,
        height: h,
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
        opacity,
        filter: blur > 0.15 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 9:16 only: darkens the top of the frame so captions read over the UI. */
export const TopScrim: React.FC<{h?: number}> = ({h = 600}) => {
  const {v} = useFormat();
  if (!v) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `linear-gradient(180deg, rgba(5,7,9,0.95) 0px, rgba(5,7,9,0.9) ${h * 0.62}px, rgba(5,7,9,0) ${h}px)`,
      }}
    />
  );
};

/** 9:16 only: darkens the bottom from y = `from` so a callout reads on top. */
export const BottomScrim: React.FC<{from: number; opacity?: number}> = ({from, opacity = 1}) => {
  const {v} = useFormat();
  if (!v || opacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
        background: `linear-gradient(180deg, rgba(5,7,9,0) ${from}px, rgba(5,7,9,0.94) ${from + 130}px, rgba(5,7,9,0.97) 100%)`,
      }}
    />
  );
};
