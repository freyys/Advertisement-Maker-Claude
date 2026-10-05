import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, FONT, tabular} from '../theme';
import {beat} from '../timeline';
import {CASHFLOW_LINE, D02, IMG} from '../assets';
import {eur, mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Display, viewAt} from '../components/Display';
import {Band, Patch} from '../components/Screen';
import {Headline} from '../components/Headline';
import {Callout} from '../components/Callout';

// 0:56 – Cashflow radar: the expected-payments line draws itself across
// KW 40 → KW 47 and the total counts up with it to 7.648,61 €.

const TOTAL = 7648.61;
const X0 = CASHFLOW_LINE[0][0];
const X1 = CASHFLOW_LINE[CASHFLOW_LINE.length - 1][0];
const ZERO_Y = 1122; // 0 € line
const END_Y = 917; // 7.648,61 €
const GRID_Y = [854, 920, 988, 1054];

/** y of the line at a given x (linear between traced points). */
const lineY = (x: number) => {
  for (let i = 0; i < CASHFLOW_LINE.length - 1; i++) {
    const [ax, ay] = CASHFLOW_LINE[i];
    const [bx, by] = CASHFLOW_LINE[i + 1];
    if (x <= bx) return ay + ((by - ay) * (x - ax)) / Math.max(1, bx - ax);
  }
  return CASHFLOW_LINE[CASHFLOW_LINE.length - 1][1];
};

const pathTo = (x: number) => {
  const pts = CASHFLOW_LINE.filter(([px]) => px < x);
  pts.push([x, lineY(x)]);
  return pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px} ${py}`).join(' ');
};

export const Sh10Cashflow: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tDraw = beat('cashflow', 'draw');
  const tEnd = beat('cashflow', 'drawEnd');
  const p = prog(f, tDraw, tEnd, EASE_CAM);
  const tipX = mix(X0, X1, p);
  const tipY = lineY(tipX);
  const value = p >= 1 ? TOTAL : Math.max(0, Math.round(((TOTAL * (ZERO_Y - tipY)) / (ZERO_Y - END_Y)) * 100) / 100);
  const done = f >= tEnd;
  const flash = done ? Math.exp(-(f - tEnd) / 10) : 0;
  const cam = prog(f, 0, dur, EASE_CAM);
  const enter = prog(f, 0, 24, EASE);
  const plot = D02.plot;
  const tot = D02.total;

  const overlay = (
    <>
      {/* empty plot, then the original chart is revealed behind the tip */}
      <Patch rect={plot} fill={C.cardDesk} />
      {GRID_Y.map((y) => (
        <div key={y} style={{position: 'absolute', left: plot.x, top: y, width: plot.w, height: 2, background: '#1D1D20'}} />
      ))}
      <Band img={IMG.d02} rect={plot} style={{clipPath: `inset(0 ${(1 - (tipX - plot.x) / plot.w) * 100}% 0 0)`}} />
      <svg width={2880} height={1800} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={pathTo(tipX)} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 10px rgba(91,200,232,0.9))'}} />
        {p > 0 && p < 1.01 && (
          <>
            <circle cx={tipX} cy={tipY} r={34 + 10 * Math.sin(f * 0.5)} fill="rgba(91,200,232,0.18)" />
            <circle cx={tipX} cy={tipY} r={12} fill="#E6FAFF" style={{filter: 'drop-shadow(0 0 14px rgba(91,200,232,1))'}} />
          </>
        )}
      </svg>
      {/* the total counts up in place */}
      <Patch rect={{x: tot.x, y: tot.y + 6, w: 2526 - tot.x, h: tot.h - 10}} fill={C.cardDesk} />
      <div
        style={{
          position: 'absolute',
          left: 2526 - 500,
          width: 500,
          top: tot.y,
          height: tot.h,
          textAlign: 'right',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 37,
          lineHeight: `${tot.h}px`,
          letterSpacing: '-0.01em',
          color: '#F2F2F3',
          textShadow: `0 0 ${26 * flash}px rgba(91,200,232,0.9)`,
          whiteSpace: 'nowrap',
          ...tabular,
        }}
      >
        {eur(value)}
      </div>
    </>
  );

  if (v) {
    // 9:16: the camera rides along the line, the total as a callout
    const aspect = 1000 / 760;
    const vw = 1060;
    const cx = mix(760 + vw / 2, 2719 - vw / 2, prog(f, tDraw, tEnd + 10, EASE_CAM));
    const view = viewAt(cx, 990, vw, aspect);
    return (
      <AbsoluteFill>
        <Stage glowX={0.5} glowY={0.5} />
        <Camera>
          <Plane w={1000} h={760} y={-20 + (1 - enter) * 60} z={cam * 60} rx={10} ry={mix(-6, 3, cam)} opacity={enter}>
            <Display img={IMG.d02} view={view} w={1000} h={760} radius={26}>
              {overlay}
            </Display>
          </Plane>
        </Camera>
        <div style={{position: 'absolute', left: 70, top: 230}}>
          <Headline text={'Du weißt, was\nreinkommt.'} at={6} size={92} />
        </div>
        <div style={{position: 'absolute', left: 70, top: 1340}}>
          <Callout label="ERWARTETE ZAHLUNGSEINGÄNGE" value={TOTAL} at={tDraw} countFrom={tDraw} countTo={tEnd} size={70} sub="brutto, aufsummiert · bis So 22.11." />
        </div>
      </AbsoluteFill>
    );
  }

  const dw = 1720;
  const chart = D02.chart;
  const dh = (dw / chart.w) * chart.h;
  return (
    <AbsoluteFill>
      <Stage glowX={0.5} glowY={0.6} />
      <Camera perspective={2600}>
        <Plane w={dw} h={dh} x={mix(40, -40, cam)} y={150 + (1 - enter) * 80} z={mix(0, 120, cam)} rx={mix(13, 8, cam)} ry={mix(-9, -3, cam)} opacity={enter}>
          <Display img={IMG.d02} view={chart} w={dw} h={dh} radius={28}>
            {overlay}
          </Display>
        </Plane>
      </Camera>
      <div style={{position: 'absolute', left: 120, top: 110}}>
        <Headline text={'Du weißt, was\nreinkommt.'} at={6} size={100} />
      </div>
    </AbsoluteFill>
  );
};
