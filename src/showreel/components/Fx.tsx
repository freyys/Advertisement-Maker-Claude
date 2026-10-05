import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, EASE, FONT, STRIPES} from '../theme';
import {pop, prog, useFormat} from '../util';
import {K_MARK} from '../../components/Logo';

// ---- PDF stripes ------------------------------------------------------------
// The three diagonal bands from the PDF corners run along lines x − y = c
// ("\" direction). A position p (0..1) runs from the bottom-left corner to the
// top-right corner, matching CSS linear-gradient(45deg, …) percentages.

const band = (c1: number, c2: number, W: number, H: number) => {
  const t0 = -(W + H) * 2;
  const t1 = (W + H) * 2;
  return `${c1 + t0},${t0} ${c1 + t1},${t1} ${c2 + t1},${t1} ${c2 + t0},${t0}`;
};

/** Three stripes whose leading edge sits at position p (0..1). */
export const StripeBands: React.FC<{p: number; width?: number; gap?: number; opacity?: number; glow?: number}> = ({
  p,
  width = 50,
  gap = 14,
  opacity = 1,
  glow = 1,
}) => {
  const {W, H} = useFormat();
  const c = p * (W + H) - H;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: glow ? `drop-shadow(0 0 ${18 * glow}px rgba(91,200,232,0.35))` : undefined}}>
        {STRIPES.map((col, i) => {
          const lead = c - i * (width + gap);
          return <polygon key={col} points={band(lead - width, lead, W, H)} fill={col} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Stripe transition: the outgoing scene is cut away along the stripes'
 * trailing edge, the incoming one is already underneath.
 */
export const StripeWipe: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => {
  const {W, H} = useFormat();
  const width = 50;
  const gap = 14;
  // edge just behind the last stripe
  const trail = p - (3 * width + 2 * gap) / (W + H);
  const pct = trail * 100;
  const mask = `linear-gradient(45deg, transparent ${pct}%, black ${pct + 0.6}%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>{children}</AbsoluteFill>
      <StripeBands p={p} width={width} gap={gap} />
    </AbsoluteFill>
  );
};

// ---- Light sweep across a surface -------------------------------------------
export const LightSweep: React.FC<{t: number; width?: number; strength?: number; angle?: number}> = ({
  t,
  width = 0.22,
  strength = 0.16,
  angle = 112,
}) => {
  if (t <= 0 || t >= 1) return null;
  const pos = -0.3 + t * 1.6;
  const a = (pos - width / 2) * 100;
  const b = pos * 100;
  const c = (pos + width / 2) * 100;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        background: `linear-gradient(${angle}deg, rgba(255,255,255,0) ${a}%, rgba(210,240,255,${strength}) ${b}%, rgba(255,255,255,0) ${c}%)`,
        zIndex: 20,
      }}
    />
  );
};

// ---- Tap indicator ----------------------------------------------------------
export const Tap: React.FC<{x: number; y: number; at: number; size?: number}> = ({x, y, at, size = 90}) => {
  const f = useCurrentFrame();
  if (f < at - 8 || f > at + 30) return null;
  const inT = prog(f, at - 8, at, EASE);
  const press = f < at ? 1 - 0.15 * inT : 0.85 + 0.15 * prog(f, at, at + 8);
  const out = prog(f, at + 8, at + 22);
  const ring = prog(f, at, at + 26, EASE);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: 30}}>
      <div
        style={{
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.28)',
          border: '2px solid rgba(255,255,255,0.7)',
          transform: `scale(${press * (0.6 + 0.4 * inT)})`,
          opacity: inT * (1 - out),
          boxShadow: '0 0 30px rgba(91,200,232,0.6)',
        }}
      />
      {f >= at && (
        <div
          style={{
            position: 'absolute',
            left: -size,
            top: -size,
            width: size * 2,
            height: size * 2,
            borderRadius: '50%',
            border: `3px solid rgba(91,200,232,${0.9 * (1 - ring)})`,
            transform: `scale(${0.4 + ring * 1.2})`,
          }}
        />
      )}
    </div>
  );
};

// ---- Pulse rings (button pulses, dot pulses) -------------------------------
export const PulseRings: React.FC<{
  at: number;
  every?: number;
  count?: number;
  size: number;
  color?: string;
  radius?: string | number;
  w?: number;
  h?: number;
  spread?: number;
  life?: number;
}> = ({at, every = 18, count = 2, size, color = '91,200,232', radius = '50%', w, h, spread = 0.35, life = 30}) => {
  const f = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const s = at + i * every;
        if (f < s) return null;
        const t = prog(f, s, s + life, EASE);
        if (t >= 1) return null;
        const ww = w ?? size;
        const hh = h ?? size;
        const grow = size * spread * t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -grow,
              top: -grow,
              width: ww + grow * 2,
              height: hh + grow * 2,
              borderRadius: radius,
              border: `3px solid rgba(${color},${0.85 * (1 - t)})`,
              boxShadow: `0 0 ${24 * (1 - t)}px rgba(${color},${0.6 * (1 - t)})`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

// ---- Kavox K mark -----------------------------------------------------------
export const KMark: React.FC<{size: number; draw?: number; fill?: number; color?: string; glow?: number; style?: React.CSSProperties}> = ({
  size,
  draw = 1,
  fill = 1,
  color = C.cyan,
  glow = 0,
  style,
}) => (
  <svg width={size * (140 / 108)} height={size} viewBox="-4 -4 140 108" style={{overflow: 'visible', ...style}}>
    <path
      d={K_MARK}
      fill={color}
      fillOpacity={fill}
      stroke={color}
      strokeWidth={2.6}
      strokeLinejoin="round"
      strokeOpacity={draw >= 1 ? 1 - fill : 1}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
      style={{filter: glow ? `drop-shadow(0 0 ${12 * glow}px rgba(91,200,232,${0.8 * glow}))` : undefined}}
    />
  </svg>
);

// ---- 3D keycap --------------------------------------------------------------
export const Keycap: React.FC<{label: string; at: number; press: number; w?: number; h?: number; fontSize?: number}> = ({
  label,
  at,
  press,
  w = 170,
  h = 150,
  fontSize = 52,
}) => {
  const f = useCurrentFrame();
  const inT = pop(f, at, {damping: 14, stiffness: 160});
  // pressed for ~8 frames, then released
  const down = prog(f, press, press + 3) * (1 - prog(f, press + 9, press + 16));
  const depth = 22;
  const d = depth * (1 - 0.75 * down);
  const glowT = down + (f > press ? Math.max(0, 1 - (f - press) / 30) * 0.6 : 0);
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h + depth,
        opacity: Math.min(1, inT * 1.4),
        transform: `translateY(${(1 - inT) * 120}px) rotateX(${(1 - inT) * 40}deg)`,
      }}
    >
      {/* cyan underglow */}
      <div
        style={{
          position: 'absolute',
          left: -w * 0.25,
          top: h * 0.4,
          width: w * 1.5,
          height: h * 0.9,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, rgba(91,200,232,${0.55 * glowT}), rgba(91,200,232,0))`,
        }}
      />
      {/* side / depth */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: depth - d,
          width: w,
          height: h + d,
          borderRadius: 26,
          background: 'linear-gradient(180deg, #15181c, #0b0d10)',
          boxShadow: `0 ${10 + d}px ${30 + d}px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)`,
        }}
      />
      {/* top face */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: depth - d,
          width: w,
          height: h,
          borderRadius: 26,
          background: 'linear-gradient(170deg, #3a4048 0%, #262a30 55%, #1f2328 100%)',
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.14), inset 0 0 0 1.5px rgba(${glowT > 0.05 ? '91,200,232' : '255,255,255'},${0.08 + 0.6 * glowT})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize,
          letterSpacing: '-0.01em',
          color: glowT > 0.05 ? `rgba(235,250,255,1)` : C.white,
          textShadow: `0 0 ${20 * glowT}px rgba(91,200,232,0.9)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};
