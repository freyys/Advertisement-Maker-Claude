import React from 'react';
import {AbsoluteFill} from 'remotion';
import {D05, IMG} from '../../showreel/assets';
import {EASE, EASE_CAM, HY} from '../theme';
import {keys, prog, tween} from '../../showreel/util';
import {Place, Shot, Space3D, Sweep, useShotFrame} from '../ui';
import {TextBlock} from './common';
import type {SceneProps} from '../Pitch';

// 0:05 – 0:07. The guided quote: the five-step stepper lifts off the screen.
const PW = 1060;
const K = PW / IMG.d05.w;
const PH = IMG.d05.h * K;
const S = D05.stepper;

export const Quote: React.FC<SceneProps> = ({copy, dur, pre}) => {
  const f = useShotFrame(pre);
  const c = copy.quote;
  const enter = prog(f, -pre, 22, EASE);
  const z = -700 * (1 - enter);
  const ry = keys(f, [[-pre, -36], [22, -15], [dur, -10]], EASE_CAM);
  const rx = tween(f, -pre, 22, 16, 5);
  const s = tween(f, 0, dur, 1, 1.035, EASE_CAM);
  const lift = prog(f, 12, 26, EASE);

  return (
    <AbsoluteFill>
      <Space3D perspective={2100}>
        <Place x={1300} y={545 + 70 * (1 - enter)} z={z} rx={rx} ry={ry} s={s} w={PW} h={PH}>
          <Shot img={IMG.d05} w={PW}>
            <div style={{position: 'absolute', left: S.x - 10, top: S.y - 6, width: S.w + 20, height: S.h + 12, borderRadius: 18, background: `rgba(0,0,0,${0.6 * lift})`}} />
          </Shot>
          {/* the stepper lifts off the screen */}
          <div
            style={{
              position: 'absolute',
              left: S.x * K,
              top: S.y * K,
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 50%',
              transform: `translateZ(${170 * lift}px) translateY(${-26 * lift}px) scale(${1 + 0.32 * lift})`,
              opacity: lift > 0.01 ? 1 : 0,
            }}
          >
            <Shot
              img={IMG.d05}
              view={S}
              w={S.w * K}
              radius={10}
              shadow={0}
              style={{boxShadow: `0 0 0 1px rgba(${HY},${0.6 * lift}), 0 18px 40px -6px rgba(${HY},${0.55 * lift}), 0 6px 14px rgba(0,0,0,${0.3 * lift})`}}
            >
              <div style={{position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h}}>
                <Sweep t={prog(f, 22, 50)} strength={0.4} />
              </div>
            </Shot>
          </div>
        </Place>
      </Space3D>
      <TextBlock f={f} n="01" kicker={c.kicker} title={c.title} sub={c.sub} />
    </AbsoluteFill>
  );
};
