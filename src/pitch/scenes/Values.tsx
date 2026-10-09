import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, EASE, FONT, HY, LN} from '../theme';
import {keys} from '../../showreel/util';
import {BlackStage, H, useShotFrame, W} from '../ui';
import type {SceneProps} from '../Pitch';

// 0:19 – 0:21. The four brand values on suspended glass planes; the camera
// flies through one plane per beat. The last plane is linen: it becomes the
// end card (see End).

export const VP = {w: 1200, h: 640, P: 1400, D: 1600};
const OFFS: Array<[number, number, number]> = [
  [-60, -20, -2],
  [70, 30, 1.5],
  [-50, 40, -1],
  [0, 0, 0],
];

/** One value plane at depth `rel` (0 = in focus, negative = ahead of the camera). */
export const ValuePlane: React.FC<{i: number; word: string; rel: number; last: boolean}> = ({i, word, rel, last}) => {
  const {w, h, P} = VP;
  if (rel >= P * 0.85) return null;
  const s = P / (P - rel);
  const [ox, oy, rz] = OFFS[i];
  const near = rel > 0 ? Math.max(0, 1 - rel / (P * 0.45)) : 1;
  const far = rel < 0 ? Math.max(0, 1 - -rel / (VP.D * 2.6)) : 1;
  const blur = rel < 0 ? Math.min(10, -rel / 260) : rel / 70;
  // only the plane in focus carries its word; the ones ahead are bare glass
  const text = rel < 0 ? Math.max(0, 1 + rel / (VP.D * 0.4)) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: W / 2 - w / 2,
        top: H / 2 - h / 2,
        width: w,
        height: h,
        transform: `translate(${ox * s}px, ${oy * s}px) scale(${s}) rotate(${rz}deg)`,
        opacity: near * far,
        filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
        borderRadius: 40,
        background: last ? B.linen : 'linear-gradient(140deg, #2C283A, #14121C 58%, #2C1C68)',
        boxShadow: last
          ? `0 40px 120px rgba(${HY},0.45)`
          : `inset 0 0 0 1.5px rgba(${LN},0.20), 0 30px 90px rgba(0,0,0,0.5)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <div style={{position: 'absolute', left: 46, top: 40, fontSize: 22, fontWeight: 600, letterSpacing: '0.28em', color: B.hyacinth, opacity: text}}>
        0{i + 1}
      </div>
      <div style={{fontSize: 118, fontWeight: 600, letterSpacing: '-0.035em', color: last ? B.black : B.linen, whiteSpace: 'nowrap', opacity: text}}>
        {word.slice(0, -1)}
        <span style={{color: B.hyacinth}}>.</span>
      </div>
    </div>
  );
};

/** Camera depth: each plane lands 7 frames after its beat and holds. */
export const valueCam = (f: number) => {
  const D = VP.D;
  return keys(
    f,
    [
      [0, -0.6 * D],
      [7, 0],
      [15, 0],
      [22, D],
      [30, D],
      [37, 2 * D],
      [45, 2 * D],
      [52, 3 * D],
    ],
    EASE,
  );
};

export const Values: React.FC<SceneProps> = ({copy}) => {
  const f = useShotFrame();
  const cz = valueCam(f);
  return (
    <AbsoluteFill>
      <BlackStage f={f} glow={1.1} />
      {/* far planes first */}
      {[3, 2, 1, 0].map((i) => (
        <ValuePlane key={i} i={i} word={copy.values[i]} rel={cz - i * VP.D} last={i === 3} />
      ))}
    </AbsoluteFill>
  );
};
