import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {IMG} from '../../showreel/assets';
import {EASE, EASE_CAM, HY} from '../theme';
import {pop, prog, tween} from '../../showreel/util';
import {Pill, Place, Space3D, useShotFrame} from '../ui';
import {TextBlock} from './common';
import type {SceneProps} from '../Pitch';

// 0:09 – 0:11. The finished PDF (the real AN-2026-041) drops onto the linen
// like a sheet of paper, page 2 underneath; a "Live preview" tag pulses.
const PH = 880;
const PW = (IMG.d06.w / IMG.d06.h) * PH;

const Paper: React.FC<{children?: React.ReactNode; shade?: number}> = ({children, shade = 0}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: '#FFFFFF',
      borderRadius: 6,
      overflow: 'hidden',
      boxShadow: '0 0 0 1px rgba(10,10,12,0.06), 0 40px 70px -20px rgba(40,24,90,0.35), 0 10px 20px rgba(10,10,12,0.10)',
    }}
  >
    {children}
    {shade > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(10,10,12,${shade})`}} />}
  </div>
);

export const Pdf: React.FC<SceneProps> = ({copy, dur}) => {
  const f = useShotFrame();
  const c = copy.pdf;
  const land = prog(f, 0, 20, EASE);
  const land2 = prog(f, -3, 17, EASE);
  const cam = tween(f, 0, dur, 1, 1.04, EASE_CAM);
  const badge = pop(f, 16, {damping: 12, stiffness: 200});
  const sweep = prog(f, 14, 44, EASE_CAM);
  const blink = 0.55 + 0.45 * Math.cos(f * 0.42);

  return (
    <AbsoluteFill>
      <Space3D perspective={1800} style={{transform: `scale(${cam})`}}>
        {/* page 2 */}
        <Place x={600 + 46} y={545 + 22 - 700 * (1 - land2)} z={-40} rx={52 * (1 - land2) + 6} rz={4 - 10 * (1 - land2)} w={PW} h={PH}>
          <Paper shade={0.04}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} style={{position: 'absolute', left: 60, right: 60 + (i % 3) * 70, top: 140 + i * 64, height: 9, borderRadius: 4, background: '#ECEAF0'}} />
            ))}
          </Paper>
        </Place>
        {/* page 1: the real PDF */}
        <Place x={600} y={545 - 720 * (1 - land)} z={0} rx={56 * (1 - land) + 6} rz={-3 - 9 * (1 - land)} w={PW} h={PH}>
          <Paper>
            <Img src={IMG.d06.src} style={{width: PW, height: PH, display: 'block'}} />
            {sweep > 0 && sweep < 1 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(115deg, rgba(${HY},0) ${sweep * 160 - 40}%, rgba(${HY},0.10) ${sweep * 160 - 25}%, rgba(${HY},0) ${sweep * 160 - 10}%)`,
                }}
              />
            )}
          </Paper>
          <div style={{position: 'absolute', right: -36, top: 46, transform: `scale(${badge}) translateZ(40px)`, transformOrigin: '100% 50%'}}>
            <Pill tone="hy" size={20} style={{boxShadow: `0 12px 30px -6px rgba(${HY},0.6)`}}>
              <span style={{width: 10, height: 10, borderRadius: 10, background: '#fff', opacity: blink}} />
              {c.badge}
            </Pill>
          </div>
        </Place>
      </Space3D>
      <TextBlock f={f} n="03" kicker={c.kicker} title={c.title} sub={c.sub} x={1080} />
    </AbsoluteFill>
  );
};

