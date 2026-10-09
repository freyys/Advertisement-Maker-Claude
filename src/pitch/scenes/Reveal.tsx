import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {B, EASE, EASE_IN} from '../theme';
import {prog} from '../../showreel/util';
import {H, LinenStage, Title, useShotFrame, W, Wordmark} from '../ui';
import type {SceneProps} from '../Pitch';

// 0:03 – 0:05. The drop: the K mark lands, A·V·O·X slide out from behind it.
// Exit: the camera dives through the counter of the "O" into the product
// montage, which is already running underneath (see `pre` on the quote shot).

const LOGO_W = 820;
const LOGO_K = LOGO_W / 472.29;
const LOGO_X = W / 2 - LOGO_W / 2;
const LOGO_Y = 470 - 50 * LOGO_K; // wordmark centre at y = 470
// The O's counter (wordmark units): its centre, and the outline from the logo path.
const O = {cx: 346.1, cy: 50.1};
const COUNTER =
  'M358.24 50.19C358.24 43.41 353.79 34.91 346.1 34.91C338.41 34.91 333.95 43.41 333.95 50.19C333.95 57.18 338.41 65.17 346.2 65.27C353.79 65.27 358.24 56.87 358.24 50.19Z';

/** Maps every x,y pair of an absolute path through `fn`. */
const mapPath = (d: string, fn: (x: number, y: number) => [number, number]) =>
  d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => fn(Number(x), Number(y)).map((v) => v.toFixed(2)).join(' '));
const ZOOM_AT = 44;
const ZOOM_MAX = 80;

export const Reveal: React.FC<SceneProps> = ({copy, dur}) => {
  const f = useShotFrame();
  // K: slams in from 1.3× with a short blur
  const kT = prog(f, 0, 9, EASE);
  // A·V·O·X leave the K as one train, spaced out while moving
  const train = prog(f, 4, 22, EASE);
  const letters = [0, 1, 2, 3].map(() => train);
  const breathe = interpolate(f, [0, dur], [1, 1.03]);

  // zoom through the O
  const z = prog(f, ZOOM_AT, dur, EASE_IN);
  const s = Math.exp(Math.log(ZOOM_MAX) * z);
  const cx0 = LOGO_X + O.cx * LOGO_K;
  const cy0 = LOGO_Y + O.cy * LOGO_K;
  // the counter's centre after the breathe scale (around the frame centre)
  const bx = W / 2 + (cx0 - W / 2) * breathe;
  const by = H / 2 + (cy0 - H / 2) * breathe;
  const pan = prog(f, ZOOM_AT, dur, EASE);
  const tx = bx + (W / 2 - bx) * pan;
  const ty = by + (H / 2 - by) * pan;
  const zooming = z > 0.0005;
  // logo units → frame px (placement, breathe around the centre, then the zoom)
  const toFrame = (u: number, v: number): [number, number] => {
    const qx = W / 2 + (LOGO_X + u * LOGO_K - W / 2) * breathe;
    const qy = H / 2 + (LOGO_Y + v * LOGO_K - H / 2) * breathe;
    return [tx + s * (qx - bx), ty + s * (qy - by)];
  };
  const hole = zooming ? `path(evenodd, "M-10 -10 H${W + 10} V${H + 10} H-10 Z ${mapPath(COUNTER, toFrame)}")` : undefined;

  return (
    <AbsoluteFill style={{clipPath: hole}}>
      <LinenStage f={f + 90} glowY={0.45} glow={0.8} />
      <AbsoluteFill
        style={{
          transformOrigin: `${bx}px ${by}px`,
          transform: zooming ? `translate(${tx - bx}px, ${ty - by}px) scale(${s})` : undefined,
        }}
      >
        <AbsoluteFill style={{transform: `scale(${breathe})`}}>
          <div style={{position: 'absolute', left: LOGO_X, top: LOGO_Y}}>
            <Wordmark id="reveal" width={LOGO_W} k={kT} kScale={1.3 - 0.3 * kT} kBlur={(1 - kT) * 6} letters={letters} mode="behind" />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 610, display: 'flex', justifyContent: 'center'}}>
            <Title text={copy.reveal.sub} f={f} at={14} size={48} weight={500} color={B.ink} align="center" out={ZOOM_AT - 8} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
