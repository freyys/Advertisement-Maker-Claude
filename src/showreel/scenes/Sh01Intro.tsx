import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, EASE_IN} from '../theme';
import {beat} from '../timeline';
import {mix, pop, prog, useFormat} from '../util';
import {KMark, PulseRings} from '../components/Fx';

// 0:00 – Black. A cyan dot breathes, a light leak drifts past, and the dot
// becomes the full stop behind the Kavox K mark.
export const Sh01Intro: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {W, H, v} = useFormat();
  const tDot = beat('intro', 'dot');
  const tP1 = beat('intro', 'pulse1');
  const tP2 = beat('intro', 'pulse2');
  const tMark = beat('intro', 'mark');
  const tPush = beat('intro', 'push');

  const markH = v ? 190 : 170;
  const markW = markH * (140 / 108);
  const dotD = markH * 0.17;
  const gap = markH * 0.08;
  const groupW = markW + gap + dotD;
  const cx = W / 2;
  const cy = H / 2;
  const markLeft = cx - groupW / 2;
  const dotFinal = {x: markLeft + markW + gap + dotD / 2, y: cy + markH / 2 - dotD / 2 - markH * 0.04};

  const appear = pop(f, tDot, {damping: 11, stiffness: 140});
  const beat1 = Math.exp(-Math.pow((f - tP1 - 4) / 5, 2));
  const beat2 = Math.exp(-Math.pow((f - tP2 - 4) / 5, 2));
  const move = prog(f, tMark, tMark + 22, EASE);
  const dotX = mix(cx, dotFinal.x, move);
  const dotY = mix(cy, dotFinal.y, move);
  const dotScale = appear * (1 + 0.45 * beat1 + 0.45 * beat2) * mix(1.5, 1, move);

  const draw = prog(f, tMark + 2, tMark + 30, EASE);
  const fill = prog(f, tMark + 22, tMark + 40, EASE);
  const flash = f >= tMark ? Math.exp(-(f - tMark) / 7) : 0;

  // slow push, then a fast push through into the next shot
  const push = prog(f, tMark + 30, tPush, EASE_CAM) * 0.07 + prog(f, tPush, dur, EASE_IN) * 0.9;
  const out = prog(f, tPush + 4, dur, EASE_IN);

  // light leak: two soft blobs drifting across
  const leak = prog(f, 12, dur - 10, EASE_CAM);
  const leakA = Math.sin(Math.PI * Math.min(1, Math.max(0, (f - 12) / (dur - 30))));

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.9 * leakA}}>
        <div
          style={{
            position: 'absolute',
            left: mix(-0.6, 0.9, leak) * W,
            top: H * 0.05,
            width: W * 0.9,
            height: H * 0.9,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, rgba(91,200,232,0.35), rgba(91,200,232,0))`,
            transform: 'rotate(-18deg) scaleY(0.55)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: mix(-0.9, 0.6, leak) * W,
            top: H * 0.25,
            width: W * 0.7,
            height: H * 0.7,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, rgba(155,140,255,0.28), rgba(155,140,255,0))`,
            transform: 'rotate(-18deg) scaleY(0.5)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          transformOrigin: `${dotFinal.x}px ${dotFinal.y}px`,
          transform: `scale(${1 + push})`,
          opacity: 1 - out,
          filter: out > 0.02 ? `blur(${out * 10}px)` : undefined,
        }}
      >
        {/* bloom when the mark ignites */}
        <div
          style={{
            position: 'absolute',
            left: cx - W * 0.4,
            top: cy - W * 0.4,
            width: W * 0.8,
            height: W * 0.8,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(190,236,250,0.55), rgba(91,200,232,0.18) 40%, rgba(91,200,232,0))',
            opacity: flash,
            transform: `scale(${0.4 + (1 - flash) * 0.8})`,
          }}
        />
        <div style={{position: 'absolute', left: markLeft, top: cy - markH / 2}}>
          <KMark size={markH} draw={draw} fill={fill} glow={0.6 + flash} color={C.cyan} />
        </div>
        {/* the dot */}
        <div style={{position: 'absolute', left: dotX - dotD / 2, top: dotY - dotD / 2, width: dotD, height: dotD}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: C.cyan,
              transform: `scale(${dotScale})`,
              boxShadow: `0 0 ${dotD * (1.2 + beat1 + beat2)}px rgba(91,200,232,0.9), 0 0 ${dotD * 4}px rgba(91,200,232,0.35)`,
            }}
          />
          <PulseRings at={tP1} every={tP2 - tP1} count={2} size={dotD} spread={4} life={40} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
