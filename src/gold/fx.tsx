import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FPS, H, W} from './timeline';

export const FONT = "'Plus Jakarta Sans', 'DejaVu Sans', sans-serif";

export const C = {
  black: '#030405',
  gold: '#E8B54A',
  goldLight: '#FFE3A1',
  goldDeep: '#8A5A12',
  teal: '#1E5A63',
  tealGlow: '#4FD1D9',
  white: '#F5F2EA',
};

/** Gold material stops for SVG gradients. */
export const GOLD_STOPS: Array<[number, string]> = [
  [0, '#5C3A08'],
  [0.22, '#B98222'],
  [0.45, '#FFE7A8'],
  [0.55, '#F2C25A'],
  [0.78, '#A06A14'],
  [1, '#4A2E06'],
];

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Eased 0→1 between two times in seconds (relative to the scene). */
export const p = (t: number, a: number, b: number, e: (x: number) => number = ease.out) =>
  interpolate(t, [a, b], [0, 1], {...clamp, easing: e});

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Scene-local time in seconds. */
export const useT = () => useCurrentFrame() / FPS;

export const GoldGradient: React.FC<{id: string; x2?: string; y2?: string; shift?: number}> = ({
  id,
  x2 = '0',
  y2 = '1',
  shift = 0,
}) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
    {GOLD_STOPS.map(([o, c]) => (
      <stop key={o} offset={Math.min(1, Math.max(0, o + shift))} stopColor={c} />
    ))}
  </linearGradient>
);

/** Floating gold dust with depth-of-field (near ones big + blurred). */
export const Particles: React.FC<{count?: number; seed?: number; speed?: number; opacity?: number}> = ({
  count = 70,
  seed = 1,
  speed = 1,
  opacity = 1,
}) => {
  const t = useT();
  const dots = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const z = rand(seed * 31 + i * 7.3);
        return {
          x: rand(seed + i * 3.1) * W,
          y: rand(seed * 2 + i * 5.7) * H,
          z,
          r: 1.5 + z * z * 9,
          drift: 8 + rand(i * 1.9 + seed) * 22,
          ph: rand(i * 9.1) * 6.28,
        };
      }),
    [count, seed],
  );
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity}}>
      {dots.map((d, i) => {
        const y = (((d.y - t * d.drift * speed * (0.5 + d.z)) % H) + H) % H;
        const x = d.x + Math.sin(t * 0.6 + d.ph) * 18 * (0.4 + d.z);
        const tw = 0.55 + 0.45 * Math.sin(t * 2.2 + d.ph * 3);
        const blur = d.z > 0.75 ? (d.z - 0.75) * 24 : d.z < 0.25 ? 1.5 : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${C.goldLight} 0%, ${C.gold} 40%, rgba(232,181,74,0) 70%)`,
              opacity: tw * (0.35 + d.z * 0.5),
              filter: blur ? `blur(${blur}px)` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Warm volumetric light cone from above. */
export const LightCone: React.FC<{x?: number; top?: number; width?: number; height?: number; opacity?: number; color?: string}> = ({
  x = W / 2,
  top = -200,
  width = 900,
  height = 1900,
  opacity = 0.5,
  color = '255,205,120',
}) => {
  const t = useT();
  const flicker = 1 + 0.04 * Math.sin(t * 3.1) + 0.03 * Math.sin(t * 7.7);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top,
        width,
        height,
        clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
        background: `linear-gradient(180deg, rgba(${color},${0.55 * opacity * flicker}) 0%, rgba(${color},${0.12 * opacity}) 60%, rgba(${color},0) 100%)`,
        filter: 'blur(28px)',
        mixBlendMode: 'screen',
      }}
    />
  );
};

/** Film grain, teal-and-gold grade, vignette. Sits above every scene. */
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 12;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* teal shadows / warm highlights split-tone */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(20,80,90,0.35) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(16,70,80,0.4) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />
      <AbsoluteFill style={{background: 'rgba(255,170,60,0.06)', mixBlendMode: 'overlay'}} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)',
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', opacity: 0.16, mixBlendMode: 'overlay'}}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Big bold headline in the upper safe area. */
export const Headline: React.FC<{text: React.ReactNode; at: number; y?: number; size?: number; out?: number}> = ({
  text,
  at,
  y = 330,
  size = 84,
  out,
}) => {
  const t = useT();
  const k = p(t, at, at + 0.7);
  const o = out !== undefined ? 1 - p(t, out, out + 0.4, ease.inOut) : 1;
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: y,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -1.5,
        color: C.white,
        opacity: k * o,
        transform: `translateY(${(1 - k) * 40}px) scale(${0.94 + 0.06 * k})`,
        filter: `blur(${(1 - k) * 10}px)`,
        textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(232,181,74,0.25)',
      }}
    >
      {text}
    </div>
  );
};

export const Gold: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span
    style={{
      background: 'linear-gradient(180deg, #FFF1C4 0%, #F2C25A 45%, #B98222 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      textShadow: 'none',
      filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.8))',
    }}
  >
    {children}
  </span>
);

export const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');
