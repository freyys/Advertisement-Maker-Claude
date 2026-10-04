// The world around the UI: background, grain, captions, phase transitions,
// tap ripples and the pointer. Shared by every phase.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {d, FONT, H, rgba, SAFE, W} from '../tokens';
import {clamp01, ease, keys, prog} from '../../lib/anim';
import type {Caption as CaptionT} from '../copy';

export {clamp01, ease, keys, prog};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Eased count-up between two frames. */
export const count = (frame: number, from: number, to: number, value: number, easing = ease.out) =>
  value * prog(frame, from, to, easing);

/** Visibility helper for staggered entrances. */
export const rise = (t: number, dy = 24, blur = 8): React.CSSProperties => ({
  opacity: t,
  transform: `translateY(${(1 - t) * dy}px)`,
  filter: t < 1 ? `blur(${(1 - t) * blur}px)` : undefined,
});

// ---- background ---------------------------------------------------------------

/**
 * Charcoal stage with the app's teal tint (top-left) and a cool indigo glow
 * (bottom-right), a faint dot grid and slow breathing. Reads the *global*
 * frame so it runs continuously across phase cuts.
 */
export const ReelBackground: React.FC<{frame: number; endWarm?: number}> = ({frame, endWarm = 0}) => {
  const t = frame / 30;
  const b1 = Math.sin(t * 0.8) * 0.5 + 0.5;
  const b2 = Math.sin(t * 0.63 + 2) * 0.5 + 0.5;
  const gx = 12 + Math.sin(t * 0.21) * 6;
  const gy = 14 + Math.cos(t * 0.17) * 5;
  const hx = 88 + Math.sin(t * 0.19 + 1) * 6;
  const hy = 86 + Math.cos(t * 0.23) * 5;
  return (
    <AbsoluteFill style={{background: d.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${70 + b1 * 8}% ${46 + b1 * 5}% at ${gx}% ${gy}%, ${rgba(d.accent, 0.2 + b1 * 0.05 + endWarm * 0.1)} 0%, ${rgba('#1B3A47', 0.45)} 32%, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${64 + b2 * 8}% ${40 + b2 * 5}% at ${hx}% ${hy}%, ${rgba('#5B4BD8', 0.2 + b2 * 0.05 + endWarm * 0.08)} 0%, ${rgba('#1C1747', 0.42)} 36%, transparent 74%)`,
        }}
      />
      {/* dot grid, masked to the middle so it never competes with the UI */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${rgba('#FFFFFF', 0.09)} 1.4px, transparent 1.6px)`,
          backgroundSize: '44px 44px',
          backgroundPosition: `${(frame * 0.35) % 44}px ${(frame * 0.6) % 44}px`,
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 52%, black 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 52%, black 0%, transparent 78%)',
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

/** Film grain (pre-rendered tiles, cheap) + vignette. */
export const Grain: React.FC<{frame: number; vignette?: number}> = ({frame, vignette = 1}) => {
  const tile = frame % 4;
  const ox = ((frame * 137) % 360) - 360;
  const oy = ((frame * 211) % 360) - 360;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,${0.32 * vignette}) 85%, rgba(0,0,0,${0.55 * vignette}) 100%)`,
        }}
      />
      <AbsoluteFill style={{overflow: 'hidden', opacity: 0.075, mixBlendMode: 'overlay'}}>
        <div
          style={{
            position: 'absolute',
            left: ox,
            top: oy,
            width: W + 720,
            height: H + 720,
            backgroundImage: `url(${staticFile(`reel/grain-${tile}.png`)})`,
            backgroundSize: '360px 360px',
          }}
        />
      </AbsoluteFill>
      {/* keeps the grain tiles in the bundle's preload list */}
      <Img src={staticFile('reel/grain-0.png')} style={{display: 'none'}} />
    </AbsoluteFill>
  );
};

// ---- captions -------------------------------------------------------------------

/** A headline line; a trailing "." is drawn in the accent colour (as in the app). */
const HeadLine: React.FC<{text: string; frame: number; at: number; size: number; color?: string}> = ({
  text,
  frame,
  at,
  size,
  color = '#fff',
}) => {
  const words = text.split(' ');
  return (
    <div style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.04, color, whiteSpace: 'nowrap'}}>
      {words.map((w, i) => {
        const t = prog(frame, at + i * 3, at + i * 3 + 16, ease.out);
        const dot = i === words.length - 1 && w.endsWith('.');
        return (
          <React.Fragment key={i}>
            <span style={{display: 'inline-block', ...rise(t, size * 0.45, 10)}}>
              {dot ? w.slice(0, -1) : w}
              {dot ? <span style={{color: d.accent}}>.</span> : null}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const CAPTION_TOP = SAFE.top + 34;

/** "01 — COCKPIT" kicker + headline + sub, top-left inside the safe zone. */
export const Caption: React.FC<{c: CaptionT; frame: number; dur: number; at?: number; size?: number}> = ({
  c,
  frame,
  dur,
  at = 4,
  size = 92,
}) => {
  const out = prog(frame, dur - 10, dur - 1, ease.in);
  const kick = prog(frame, at, at + 14, ease.out);
  const bar = prog(frame, at + 2, at + 20, ease.out);
  const headAt = at + 6;
  const nWords = c.head.join(' ').split(' ').length;
  const subT = prog(frame, headAt + nWords * 3 + 4, headAt + nWords * 3 + 20, ease.out);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        top: CAPTION_TOP,
        width: W - SAFE.side * 2,
        fontFamily: FONT,
        opacity: 1 - out,
        transform: `translateY(${-out * 40}px)`,
        filter: out > 0 ? `blur(${out * 10}px)` : undefined,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, fontWeight: 700, letterSpacing: '0.16em', ...rise(kick, 0, 0)}}>
        {c.no ? <span style={{color: d.accent, transform: `translateX(${(1 - kick) * -20}px)`}}>{c.no}</span> : null}
        <span style={{width: 34 * bar, height: 2, background: 'rgba(255,255,255,0.45)', display: 'inline-block'}} />
        <span style={{color: '#fff', textTransform: 'uppercase', transform: `translateX(${(1 - kick) * 20}px)`}}>{c.kicker}</span>
      </div>
      <div style={{marginTop: 22}}>
        {c.head.map((line, i) => (
          <HeadLine
            key={i}
            text={line}
            frame={frame}
            at={headAt + c.head.slice(0, i).join(' ').split(' ').filter(Boolean).length * 3}
            size={size}
          />
        ))}
      </div>
      {c.sub ? (
        <div style={{marginTop: 22, fontSize: 33, fontWeight: 500, lineHeight: 1.32, color: 'rgba(255,255,255,0.66)', maxWidth: 900, ...rise(subT, 16, 6)}}>
          {c.sub}
        </div>
      ) : null}
    </div>
  );
};

// ---- phase transitions -------------------------------------------------------

/**
 * Vertical whip: the visual enters fast from below and leaves fast upwards,
 * stretched + blurred like motion blur. Back-to-back phases read as one
 * continuous swipe.
 */
export const Whip: React.FC<{
  frame: number;
  dur: number;
  children: React.ReactNode;
  inFrames?: number;
  outFrames?: number;
  noIn?: boolean;
  noOut?: boolean;
  style?: React.CSSProperties;
}> = ({frame, dur, children, inFrames = 14, outFrames = 9, noIn, noOut, style}) => {
  const i = noIn ? 0 : 1 - prog(frame, 0, inFrames, ease.out);
  const o = noOut ? 0 : prog(frame, dur - outFrames, dur, ease.in);
  const ty = i * 520 - o * 620;
  const stretch = 1 + i * 0.22 + o * 0.26;
  const blur = i * 22 + o * 26;
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${ty}px) scaleY(${stretch})`,
        transformOrigin: '50% 60%',
        opacity: Math.min(1, (1 - i) * 1.6) * (1 - o * 0.85),
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Soft light bloom across a cut (peaks on frame 0 and on the last frame). */
export const CutFlash: React.FC<{frame: number; dur: number; noIn?: boolean; noOut?: boolean; color?: string}> = ({
  frame,
  dur,
  noIn,
  noOut,
  color = d.accent,
}) => {
  const a = (noIn ? 0 : 1 - prog(frame, 0, 10, ease.out)) + (noOut ? 0 : prog(frame, dur - 6, dur, ease.in));
  if (a <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        background: `radial-gradient(ellipse 90% 55% at 50% 50%, ${rgba(color, 0.42 * a)} 0%, ${rgba(color, 0.12 * a)} 45%, transparent 75%)`,
      }}
    />
  );
};

// ---- interaction -------------------------------------------------------------

/** Touch ripple at (x, y), starting at `at`. */
export const Tap: React.FC<{frame: number; at: number; x: number; y: number; color?: string; size?: number}> = ({
  frame,
  at,
  x,
  y,
  color = '#fff',
  size = 120,
}) => {
  const t = prog(frame, at - 6, at + 18, ease.out);
  if (frame < at - 8 || frame > at + 20) return null;
  const press = prog(frame, at - 6, at, ease.out) * (1 - prog(frame, at + 2, at + 12, ease.soft));
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: '50%',
          border: `3px solid ${rgba(color, 0.8 * (1 - t))}`,
          transform: `scale(${0.4 + t * 1.1})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -34,
          top: -34,
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: rgba(color, 0.35 * press),
          boxShadow: `0 0 30px ${rgba(color, 0.4 * press)}`,
          transform: `scale(${0.7 + press * 0.3})`,
        }}
      />
    </div>
  );
};

/** macOS-style pointer. */
export const Pointer: React.FC<{x: number; y: number; size?: number; press?: number; opacity?: number}> = ({
  x,
  y,
  size = 46,
  press = 0,
  opacity = 1,
}) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 20 28"
    style={{
      position: 'absolute',
      left: x - size * 0.12,
      top: y - size * 0.06,
      opacity,
      transform: `scale(${1 - press * 0.12})`,
      transformOrigin: '10% 5%',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      pointerEvents: 'none',
    }}
  >
    <path d="M2 1.5v21.2l5.3-5 3.4 7.6 3.6-1.6-3.4-7.4h7.3Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

/** Sparkle burst (success moments). */
export const Sparkles: React.FC<{frame: number; at: number; x: number; y: number; color?: string; n?: number; r?: number}> = ({
  frame,
  at,
  x,
  y,
  color = d.accent,
  n = 8,
  r = 120,
}) => {
  const t = prog(frame, at, at + 26, ease.out);
  if (frame < at || t >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const dist = r * (0.55 + (i % 3) * 0.22) * t;
        const s = (1 - t) * (i % 2 ? 16 : 24);
        return (
          <svg
            key={i}
            width={s}
            height={s}
            viewBox="0 0 24 24"
            style={{position: 'absolute', left: Math.cos(a) * dist - s / 2, top: Math.sin(a) * dist - s / 2}}
          >
            <path d="M12 0c.8 6 3.6 9.2 12 12-8.4 2.8-11.2 6-12 12-.8-6-3.6-9.2-12-12C8.4 9.2 11.2 6 12 0Z" fill={i % 3 ? color : '#fff'} />
          </svg>
        );
      })}
    </div>
  );
};

// ---- keycaps ------------------------------------------------------------------

export const Keycap: React.FC<{label: string; press: number; w?: number}> = ({label, press, w = 170}) => (
  <div
    style={{
      width: w,
      height: 150,
      borderRadius: 30,
      background: 'linear-gradient(180deg, #2A2B31 0%, #1A1B20 100%)',
      border: '1.5px solid rgba(255,255,255,0.14)',
      boxShadow: `0 ${14 - press * 10}px 0 #0B0B0E, 0 ${24 - press * 12}px 40px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12)${
        press > 0.05 ? `, 0 0 ${50 * press}px ${rgba(d.accent, 0.45 * press)}` : ''
      }`,
      transform: `translateY(${press * 10}px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
      fontSize: 52,
      fontWeight: 700,
      color: press > 0.3 ? d.accent : '#fff',
    }}
  >
    {label}
  </div>
);

/** Fades the visual layer out towards the caption so UI never collides with text. */
export const UnderCaption: React.FC<{top: number; fade?: number; children: React.ReactNode}> = ({top, fade = 170, children}) => {
  const mask = `linear-gradient(180deg, transparent 0px, transparent ${top}px, black ${top + fade}px)`;
  return <AbsoluteFill style={{maskImage: mask, WebkitMaskImage: mask}}>{children}</AbsoluteFill>;
};
export {springAt as springAtLocal} from '../../lib/anim';
