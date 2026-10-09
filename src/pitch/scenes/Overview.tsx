import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CASHFLOW_LINE, D02, IMG, r} from '../../showreel/assets';
import {EASE, EASE_CAM, FONT, HY, tabular} from '../theme';
import {eur, keys, prog, tween} from '../../showreel/util';
import {Place, Shot, Space3D, useShotFrame} from '../ui';
import {TextBlock} from './common';
import type {SceneProps} from '../Pitch';

// 0:13 – 0:15. Cash-flow radar: the chart lifts off the screen and draws
// itself week by week while the expected total counts up in place.
const PW = 1060;
const K = PW / IMG.d02.w;
const PH = IMG.d02.h * K;
const CH = D02.chart;
const BG = 'rgb(17,17,20)'; // the chart card's fill, sampled
const TOTAL = r(2318, 758, 210, 66);
const X0 = CASHFLOW_LINE[0][0];
const X1 = CASHFLOW_LINE[CASHFLOW_LINE.length - 1][0];

const lineY = (x: number) => {
  for (let i = 0; i < CASHFLOW_LINE.length - 1; i++) {
    const [ax, ay] = CASHFLOW_LINE[i];
    const [bx, by] = CASHFLOW_LINE[i + 1];
    if (x <= bx) return ay + ((by - ay) * (x - ax)) / Math.max(1, bx - ax);
  }
  return CASHFLOW_LINE[CASHFLOW_LINE.length - 1][1];
};

export const Overview: React.FC<SceneProps> = ({copy, dur}) => {
  const f = useShotFrame();
  const c = copy.overview;
  const enter = prog(f, 0, 20, EASE);
  const lift = prog(f, 5, 18, EASE);
  const draw = prog(f, 9, 44, EASE_CAM);
  const tipX = X0 + (X1 - X0) * draw;
  const tipY = lineY(tipX);
  const total = Math.round(7648.61 * prog(f, 9, 44, EASE_CAM) * 100) / 100;

  return (
    <AbsoluteFill>
      <Space3D perspective={2100}>
        <Place x={1310} y={520 + 60 * (1 - enter)} z={-420 * (1 - enter)} rx={tween(f, 0, 20, 14, 5)} ry={keys(f, [[0, -30], [20, -15], [dur, -11]], EASE_CAM)} w={PW} h={PH}>
          <Shot img={IMG.d02} w={PW}>
            <div style={{position: 'absolute', left: CH.x, top: CH.y, width: CH.w, height: CH.h, borderRadius: 20, background: `rgba(0,0,0,${0.65 * lift})`}} />
          </Shot>
          <div
            style={{
              position: 'absolute',
              left: CH.x * K,
              top: CH.y * K,
              transformOrigin: '50% 50%',
              transform: `translateZ(${190 * lift}px) translateY(${-30 * lift}px) scale(${1 + 0.2 * lift})`,
            }}
          >
            <Shot
              img={IMG.d02}
              view={CH}
              w={CH.w * K}
              radius={12}
              shadow={0}
              style={{boxShadow: `0 0 0 1px rgba(${HY},${0.5 * lift}), 0 24px 50px -10px rgba(${HY},${0.5 * lift}), 0 8px 18px rgba(0,0,0,${0.35 * lift})`}}
            >
              {/* the chart is drawn up to the tip */}
              <div style={{position: 'absolute', left: tipX, top: 832, width: X1 + 30 - tipX, height: 296, background: BG}} />
              {draw > 0 && draw < 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: tipX - 11,
                    top: tipY - 11,
                    width: 22,
                    height: 22,
                    borderRadius: 22,
                    background: '#fff',
                    boxShadow: `0 0 0 6px rgba(${HY},0.45), 0 0 40px 12px rgba(${HY},0.8)`,
                  }}
                />
              )}
              {/* expected total counts up in place (the UI's German format) */}
              <div style={{position: 'absolute', left: TOTAL.x, top: TOTAL.y, width: TOTAL.w, height: TOTAL.h, background: BG}} />
              <div
                style={{
                  position: 'absolute',
                  right: IMG.d02.w - (TOTAL.x + TOTAL.w) + 4,
                  top: TOTAL.y + 4,
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 45,
                  color: '#F4F6F8',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  ...tabular,
                }}
              >
                {eur(total)}
              </div>
            </Shot>
          </div>
        </Place>
      </Space3D>
      <TextBlock f={f} n="05" kicker={c.kicker} title={c.title} sub={c.sub} />
    </AbsoluteFill>
  );
};
