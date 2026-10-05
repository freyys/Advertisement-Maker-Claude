import React from 'react';
import {FONT} from '../theme';

// Minimal iPhone (no logos). The screenshots are 780 px wide; the screen
// keeps their aspect, and the app content sits below a status bar.
export const PHONE_SRC_W = 780;
export const PHONE_SRC_H = 1688;
/** Status bar height in screenshot pixels. */
export const STATUS_H = 100;

export const phoneSize = (screenW: number) => {
  const bezel = screenW * 0.034;
  const screenH = screenW * (PHONE_SRC_H / PHONE_SRC_W);
  return {screenW, screenH, bezel, w: screenW + bezel * 2, h: screenH + bezel * 2, k: screenW / PHONE_SRC_W};
};

const StatusBar: React.FC<{k: number; color: string; dark?: boolean}> = ({k, color, dark}) => {
  const fg = dark ? '#0A0A0A' : '#F4F6F8';
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: PHONE_SRC_W,
        height: STATUS_H + 26,
        background: `linear-gradient(${color}, ${color} ${STATUS_H}px, transparent)`,
        transformOrigin: '0 0',
        transform: `scale(${k})`,
        zIndex: 5,
      }}
    >
      <div style={{position: 'absolute', left: 74, top: 30, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: fg, letterSpacing: '-0.01em'}}>
        9:41
      </div>
      <svg style={{position: 'absolute', right: 56, top: 36}} width="152" height="26" viewBox="0 0 152 26">
        {/* signal */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 11} y={18 - i * 5} width="7" height={8 + i * 5} rx="2" fill={fg} />
        ))}
        {/* wifi */}
        <path d="M58 9a20 20 0 0 1 28 0l-3 3.2a15.5 15.5 0 0 0-22 0Z M63.5 14.6a12 12 0 0 1 17 0l-3 3.2a7.6 7.6 0 0 0-11 0Z M68.8 20.2a4.6 4.6 0 0 1 6.4 0L72 23.6Z" fill={fg} />
        {/* battery */}
        <rect x="100" y="3" width="42" height="21" rx="6" fill="none" stroke={fg} strokeOpacity="0.45" strokeWidth="2" />
        <rect x="103.5" y="6.5" width="31" height="14" rx="3.5" fill={fg} />
        <rect x="145" y="10" width="3" height="7" rx="1.5" fill={fg} fillOpacity="0.45" />
      </svg>
    </div>
  );
};

/**
 * `content` is laid out in screenshot pixels (780 wide). `scroll` moves the
 * app content up (source px), like a real scroll under the status bar.
 */
export const Phone: React.FC<{
  screenW: number;
  content: React.ReactNode;
  scroll?: number;
  statusColor?: string;
  rim?: number;
  glare?: number;
  overlay?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({screenW, content, scroll = 0, statusColor = '#1C272D', rim = 1, glare = 1, overlay, style}) => {
  const s = phoneSize(screenW);
  const R = s.w * 0.155;
  const r = screenW * 0.13;
  return (
    <div style={{position: 'relative', width: s.w, height: s.h, ...style}}>
      {/* side buttons */}
      {[
        {side: 'left', top: 0.17, h: 0.045},
        {side: 'left', top: 0.25, h: 0.075},
        {side: 'left', top: 0.34, h: 0.075},
        {side: 'right', top: 0.27, h: 0.11},
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            [b.side]: -s.w * 0.008,
            top: s.h * b.top,
            width: s.w * 0.012,
            height: s.h * b.h,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #2b3036, #4a5058 50%, #22262b)',
          }}
        />
      ))}
      {/* titanium body */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: R,
          background: 'linear-gradient(140deg, #4a5058 0%, #1c1f23 22%, #2d3238 50%, #15171a 78%, #3d434a 100%)',
          boxShadow: [
            `0 0 0 1px rgba(255,255,255,0.10)`,
            `0 ${s.w * 0.06}px ${s.w * 0.16}px rgba(0,0,0,0.65)`,
            `0 0 ${s.w * 0.18 * rim}px rgba(91,200,232,${0.22 * rim})`,
          ].join(', '),
        }}
      />
      {/* black bezel */}
      <div style={{position: 'absolute', inset: s.w * 0.008, borderRadius: R - s.w * 0.008, background: '#030405'}} />
      {/* screen */}
      <div
        style={{
          position: 'absolute',
          left: s.bezel,
          top: s.bezel,
          width: s.screenW,
          height: s.screenH,
          borderRadius: r,
          overflow: 'hidden',
          background: '#0A0A0A',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${s.k}) translateY(${STATUS_H - scroll}px)`}}>
          {content}
        </div>
        <StatusBar k={s.k} color={statusColor} />
        {/* dynamic island */}
        <div
          style={{
            position: 'absolute',
            left: (s.screenW - s.screenW * 0.3) / 2,
            top: s.screenW * 0.026,
            width: s.screenW * 0.3,
            height: s.screenW * 0.088,
            borderRadius: 999,
            background: '#000',
            zIndex: 6,
          }}
        />
        {overlay}
        {/* glass glare */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 7,
            opacity: glare,
            background: 'linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0) 42%)',
            pointerEvents: 'none',
          }}
        />
      </div>
      {/* rim light on the edge */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: R,
          boxShadow: `inset 0 0 0 1.5px rgba(160,225,245,${0.28 * rim})`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
