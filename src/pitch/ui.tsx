import React from 'react';
import {AbsoluteFill, Img as RImg, staticFile, useCurrentFrame} from 'remotion';
import type {Img, Rect} from '../showreel/assets';
import {GLYPHS} from '../components/Logo';
import {B, EASE, EASE_IN, FONT, HY} from './theme';
import {pop, prog} from '../showreel/util';

export const W = 1920;
export const H = 1080;

/** Frame inside the current shot (0 = the shot's cut; negative during `pre`). */
export const useShotFrame = (pre = 0) => useCurrentFrame() - pre;

// ---- Type -------------------------------------------------------------------

/**
 * Headline whose lines rise out of a mask, one after another. A line-final
 * "." is the hyacinth brand dot and pops in after its line lands.
 */
export const Title: React.FC<{
  text: string;
  f: number;
  at: number;
  size?: number;
  weight?: number;
  color?: string;
  stagger?: number;
  dur?: number;
  out?: number;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({text, f, at, size = 92, weight = 600, color = B.black, stagger = 5, dur = 16, out, align = 'left', lineHeight = 1.04, style}) => {
  const lines = text.split('\n');
  const leave = out === undefined ? 0 : prog(f, out, out + 9, EASE_IN);
  return (
    <div style={{fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight, letterSpacing: '-0.035em', color, textAlign: align, ...style}}>
      {lines.map((line, i) => {
        const start = at + i * stagger;
        const t = prog(f, start, start + dur);
        const dotted = line.endsWith('.');
        const body = dotted ? line.slice(0, -1) : line;
        const dot = pop(f, start + dur * 0.45, {damping: 10, stiffness: 240, mass: 0.6});
        return (
          // the padding keeps descenders inside the mask
          <div key={i} style={{overflow: 'hidden', paddingBottom: size * 0.16, marginBottom: -size * 0.16, whiteSpace: 'pre'}}>
            <div style={{transform: `translateY(${(1 - t) * 108 - leave * 108}%)`}}>
              {body}
              {dotted && (
                <span style={{display: 'inline-block', color: B.hyacinth, transform: `scale(${dot})`, transformOrigin: '50% 80%'}}>.</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** One line of supporting text that slides in. */
export const Sub: React.FC<{text: string; f: number; at: number; size?: number; color?: string; out?: number; style?: React.CSSProperties}> = ({
  text,
  f,
  at,
  size = 28,
  color = B.grey,
  out,
  style,
}) => {
  const t = prog(f, at, at + 14);
  const leave = out === undefined ? 0 : prog(f, out, out + 8, EASE_IN);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: '-0.005em',
        color,
        whiteSpace: 'nowrap',
        opacity: t * (1 - leave),
        transform: `translateY(${(1 - t) * 14}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Chapter label in the brand book's manner: "01 — QUOTE", with a hairline that draws first. */
export const Kicker: React.FC<{n: string; label: string; f: number; at: number; dark?: boolean; extra?: React.ReactNode}> = ({
  n,
  label,
  f,
  at,
  dark,
  extra,
}) => {
  const line = prog(f, at, at + 10);
  const t = prog(f, at + 3, at + 15);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT, fontWeight: 600, fontSize: 21, letterSpacing: '0.28em', textTransform: 'uppercase'}}>
      <div style={{width: 46 * line, height: 2, background: B.hyacinth, borderRadius: 2}} />
      <div style={{opacity: t, transform: `translateX(${(1 - t) * -12}px)`, display: 'flex', gap: 14, alignItems: 'center'}}>
        <span style={{color: B.hyacinth}}>{n}</span>
        <span style={{color: dark ? B.greyDark : B.grey}}>{label}</span>
        {extra}
      </div>
    </div>
  );
};

/** Small rounded label (e.g. "Coming soon"). */
export const Pill: React.FC<{children: React.ReactNode; tone?: 'hy' | 'linen' | 'outline'; size?: number; style?: React.CSSProperties}> = ({
  children,
  tone = 'outline',
  size = 18,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.5,
      padding: `${size * 0.42}px ${size * 0.9}px`,
      borderRadius: 999,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.02em',
      textTransform: 'none',
      whiteSpace: 'nowrap',
      ...(tone === 'hy'
        ? {background: B.hyacinth, color: '#fff'}
        : tone === 'linen'
          ? {background: B.linen, color: B.black}
          : {border: `1.5px solid rgba(${HY},0.55)`, color: B.hyacinth, background: `rgba(${HY},0.06)`}),
      ...style,
    }}
  >
    {children}
  </div>
);

export const Check: React.FC<{size?: number; color?: string; draw?: number}> = ({size = 20, color = 'currentColor', draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path
      d="M4.5 12.5l4.8 4.8L19.5 7"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
    />
  </svg>
);

// ---- Logo -------------------------------------------------------------------

/**
 * The Kavox wordmark. `k` 0→1 lands the K mark; `letters[i]` 0→1 moves each of
 * A·V·O·X into place. `mode` picks how the letters travel: out from behind the
 * K, or up out of a baseline mask.
 */
export const Wordmark: React.FC<{
  width: number;
  color?: string;
  k?: number;
  kBlur?: number;
  kScale?: number;
  letters?: number[];
  mode?: 'behind' | 'rise';
  id: string;
}> = ({width, color = B.black, k = 1, kBlur = 0, kScale = 1, letters = [1, 1, 1, 1], mode = 'behind', id}) => {
  const height = (width / 472.29) * 100;
  return (
    <svg width={width} height={height} viewBox="0 0 472.29 100" style={{overflow: 'visible', display: 'block'}}>
      <defs>
        <clipPath id={`${id}-clip`}>
          {mode === 'behind' ? <rect x={133} y={-20} width={400} height={140} /> : <rect x={120} y={-20} width={400} height={108} />}
        </clipPath>
        {kBlur > 0.1 && (
          <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={kBlur} />
          </filter>
        )}
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {GLYPHS.slice(1).map((d, i) => {
          const t = letters[i] ?? 1;
          const tf = mode === 'behind' ? `translate(${(1 - t) * -(345 + (3 - i) * 34)} 0)` : `translate(0 ${(1 - t) * 105})`;
          return <path key={i} d={d} fill={color} fillRule="evenodd" transform={tf} />;
        })}
      </g>
      <g
        opacity={Math.min(1, k * 1.5)}
        transform={`translate(66 50) scale(${kScale}) translate(-66 -50)`}
        filter={kBlur > 0.1 ? `url(#${id}-blur)` : undefined}
      >
        <path d={GLYPHS[0]} fill={color} />
      </g>
    </svg>
  );
};

// ---- Planes -----------------------------------------------------------------

/** A screenshot as a suspended plane: rounded, hairline edge, layered soft shadow. */
export const Shot: React.FC<{
  img: Img;
  w: number;
  view?: Rect;
  radius?: number;
  shadow?: number;
  children?: React.ReactNode; // overlays in SOURCE pixels of `img`
  style?: React.CSSProperties;
}> = ({img, w, view, radius = 16, shadow = 1, children, style}) => {
  const v = view ?? {x: 0, y: 0, w: img.w, h: img.h};
  const k = w / v.w;
  const h = v.h * k;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        background: B.black,
        boxShadow: [
          `0 0 0 1px rgba(10,10,12,0.10)`,
          `0 ${30 * shadow}px ${70 * shadow}px -${10 * shadow}px rgba(40,24,90,${0.34 * shadow})`,
          `0 ${8 * shadow}px ${22 * shadow}px rgba(10,10,12,${0.16 * shadow})`,
        ].join(', '),
        ...style,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${k}) translate(${-v.x}px, ${-v.y}px)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: img.w, height: img.h}}>
          <RImg src={img.src} style={{position: 'absolute', left: 0, top: 0, width: img.w, height: img.h, maxWidth: 'none'}} />
          {children}
        </div>
      </div>
      {/* glass sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 28%, rgba(255,255,255,0) 45%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/** Perspective root; children are placed with `Place` around the frame centre. */
export const Space3D: React.FC<{perspective?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  perspective = 2000,
  children,
  style,
}) => <AbsoluteFill style={{perspective, perspectiveOrigin: '50% 50%', ...style}}>{children}</AbsoluteFill>;

export const Place: React.FC<{
  x?: number; // centre, frame px
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  s?: number;
  w: number;
  h: number;
  opacity?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = W / 2, y = H / 2, z = 0, rx = 0, ry = 0, rz = 0, s = 1, w, h, opacity = 1, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);

// ---- Backgrounds ------------------------------------------------------------

/** Linen stage: warm falloff, a measuring grid of hairlines with crop marks, a hyacinth haze. */
export const LinenStage: React.FC<{f: number; glowX?: number; glowY?: number; glow?: number}> = ({f, glowX = 0.66, glowY = 0.5, glow = 1}) => {
  const step = 120;
  const ox = (-f * 0.35) % step;
  const oy = (-f * 0.12) % step;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 80% at 55% 45%, ${B.linenHi} 0%, ${B.linen} 55%, ${B.linenLo} 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,10,12,0.045) 1px, transparent 1px), linear-gradient(0deg, rgba(10,10,12,0.045) 1px, transparent 1px)`,
          backgroundSize: `${step}px ${step}px`,
          backgroundPosition: `${ox}px ${oy}px`,
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 85%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: W * glowX - 700,
          top: H * glowY - 600,
          width: 1400,
          height: 1200,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, rgba(${HY},${0.16 * glow}), rgba(${HY},${0.05 * glow}) 55%, rgba(${HY},0))`,
          transform: `scale(${1 + Math.sin(f * 0.06) * 0.04})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const BlackStage: React.FC<{f: number; glowX?: number; glowY?: number; glow?: number}> = ({f, glowX = 0.5, glowY = 0.55, glow = 1}) => (
  <AbsoluteFill style={{background: B.black, overflow: 'hidden'}}>
    <div
      style={{
        position: 'absolute',
        left: W * glowX - 800,
        top: H * glowY - 700,
        width: 1600,
        height: 1400,
        borderRadius: '50%',
        background: `radial-gradient(closest-side, rgba(${HY},${0.22 * glow}), rgba(${HY},${0.06 * glow}) 50%, rgba(${HY},0))`,
        transform: `scale(${1 + Math.sin(f * 0.07) * 0.05})`,
      }}
    />
  </AbsoluteFill>
);

// ---- Motion helpers ---------------------------------------------------------

/**
 * Whip pan between two montage shots: the shot arrives from the right with a
 * horizontal blur and leaves to the left the same way.
 */
export const Whip: React.FC<{f: number; dur: number; inLen?: number; outLen?: number; noIn?: boolean; id: string; children: React.ReactNode}> = ({
  f,
  dur,
  inLen = 7,
  outLen = 5,
  noIn,
  id,
  children,
}) => {
  const tin = noIn ? 1 : prog(f, 0, inLen, EASE);
  const tout = prog(f, dur - outLen, dur, EASE_IN);
  const dx = (1 - tin) * 260 - tout * 260;
  const blur = (1 - tin) * 46 + tout * 46;
  return (
    <AbsoluteFill>
      {blur > 0.5 && (
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <filter id={id} x="-10%" y="0" width="120%" height="100%">
            <feGaussianBlur stdDeviation={`${blur} 0`} />
          </filter>
        </svg>
      )}
      <AbsoluteFill style={{transform: `translateX(${dx}px)`, filter: blur > 0.5 ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Soft hyacinth glow sweep across an element (0→1). */
export const Sweep: React.FC<{t: number; strength?: number}> = ({t, strength = 0.35}) => {
  if (t <= 0 || t >= 1) return null;
  const p = -30 + t * 160;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        background: `linear-gradient(110deg, rgba(255,255,255,0) ${p - 14}%, rgba(200,185,255,${strength}) ${p}%, rgba(255,255,255,0) ${p + 14}%)`,
      }}
    />
  );
};

/** Expanding ring for clicks and beats. */
export const Ring: React.FC<{f: number; at: number; x: number; y: number; r?: number; color?: string; len?: number}> = ({
  f,
  at,
  x,
  y,
  r = 60,
  color = `rgba(${HY},1)`,
  len = 18,
}) => {
  if (f < at || f > at + len) return null;
  const t = prog(f, at, at + len, EASE);
  const rr = r * (0.3 + t);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - rr,
        top: y - rr,
        width: rr * 2,
        height: rr * 2,
        borderRadius: '50%',
        border: `${3 * (1 - t) + 1}px solid ${color}`,
        opacity: 1 - t,
      }}
    />
  );
};

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.12}) => {
  const f = useCurrentFrame();
  const src = `assets/showreel/fx/grain-${f % 3}.jpg`;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <RImg
        src={staticFile(src)}
        style={{position: 'absolute', left: -((f * 37) % 200), top: -((f * 53) % 200), width: 2400, height: 2400, maxWidth: 'none'}}
      />
    </AbsoluteFill>
  );
};
