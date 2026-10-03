import React from 'react';
import {app, FONT, palette} from '../theme';
import {ArrowUp} from './Icons';
import {keys} from '../lib/anim';
import {SCENES} from '../timeline';

// Shared geometry for S6–S8 (stage coordinates)
export const BAR = {cx: 960, cy: 700, w: 1120, h: 112};
export const BAR_TOP = BAR.cy - BAR.h / 2;

/** One camera for S6 → S8 so the bar never jumps between scenes. */
export const barCamera = (frame: number) => ({
  zoom: keys(frame, [
    [SCENES.S6.start, 0.98],
    [SCENES.S7.start, 1.02],
    [SCENES.S8.start, 1.06],
  ]),
  x: 960,
  y: keys(frame, [
    [SCENES.S6.start, 640],
    [SCENES.S7.start + 15, 560],
    [SCENES.S8.start, 600],
  ]),
  driftAmp: 9,
  seed: 21,
});

/**
 * The glassy command bar — styled like the Kavox chat input (dark field,
 * round send button), scaled up.
 */
export const CommandBar: React.FC<{
  text?: string;
  placeholder: string;
  caret?: boolean;
  sendGlow?: number;
  sendActive?: number;
  glow?: number;
  contentOpacity?: number;
}> = ({text, placeholder, caret, sendGlow = 0, sendActive = 0, glow = 0, contentOpacity = 1}) => (
  <div
    style={{
      width: BAR.w,
      height: BAR.h,
      borderRadius: 30,
      background: 'linear-gradient(180deg, rgba(30,26,52,0.92), rgba(18,16,30,0.94))',
      border: `1.5px solid rgba(169,139,255,${0.22 + glow * 0.5})`,
      boxShadow: [
        'inset 0 1px 0 rgba(255,255,255,0.10)',
        'inset 0 0 40px rgba(109,74,255,0.10)',
        `0 0 ${40 + glow * 80}px rgba(109,74,255,${0.25 + glow * 0.45})`,
        '0 30px 90px rgba(0,0,0,0.55)',
      ].join(', '),
      display: 'flex',
      alignItems: 'center',
      padding: '0 22px 0 40px',
      fontFamily: FONT,
      position: 'relative',
    }}
  >
    <div
      style={{
        flex: 1,
        fontSize: 36,
        fontWeight: 600,
        color: text ? palette.white : app.muted,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        opacity: contentOpacity,
        letterSpacing: '-0.005em',
      }}
    >
      {text || placeholder}
      {caret ? (
        <span
          style={{
            display: 'inline-block',
            width: 3,
            height: 40,
            marginLeft: 4,
            verticalAlign: '-6px',
            background: palette.lavender,
            borderRadius: 2,
          }}
        />
      ) : null}
    </div>
    <div style={{position: 'relative', opacity: contentOpacity}}>
      {sendGlow > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 99,
            border: `3px solid rgba(169,139,255,${0.9 * (1 - sendGlow)})`,
            transform: `scale(${1 + sendGlow * 1.3})`,
          }}
        />
      ) : null}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 99,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `color-mix(in srgb, ${palette.violet} ${Math.round(sendActive * 100)}%, ${app.accentDeep})`,
          boxShadow: `0 0 ${50 * sendActive}px rgba(109,74,255,${0.8 * sendActive})`,
        }}
      >
        <ArrowUp size={34} color={sendActive > 0.5 ? '#fff' : app.accentInk} stroke={2.6} />
      </div>
    </div>
  </div>
);
