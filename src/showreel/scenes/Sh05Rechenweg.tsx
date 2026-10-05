import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, FONT, tabular} from '../theme';
import {beat} from '../timeline';
import {H03, IMG} from '../assets';
import {mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage, TopScrim} from '../components/Stage';
import {Phone, phoneSize, STATUS_H} from '../components/Phone';
import {Highlight, Space} from '../components/Screen';
import {Headline} from '../components/Headline';

// 0:27 – Zoom into the take-off: the full calculation behind "41,8 m²"
// lifts off the screen, and each step lights up as the voice names it.

// Exactly the calculation shown in Handy_03 (first position).
const LINES = [
  {math: '18 × 2,6 m', label: 'Wände (Umfang × Höhe)'},
  {math: '– 1,25 × 1,2 m (2×)', label: 'Fenster'},
  {math: '– 1 × 2 m', label: 'Tür'},
];

const Formula: React.FC<{f: number; t: number[]; tResult: number; w: number; s: number}> = ({f, t, tResult, w, s}) => {
  const res = prog(f, tResult, tResult + 26, EASE);
  const val = mix(0, 41.8, res).toFixed(1).replace('.', ',');
  return (
    <div
      style={{
        width: w,
        padding: `${34 * s}px ${44 * s}px ${36 * s}px`,
        borderRadius: 30 * s,
        background: 'linear-gradient(160deg, rgba(24,30,36,0.92), rgba(11,14,17,0.9))',
        border: '1.5px solid rgba(91,200,232,0.35)',
        boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 ${60 + 60 * res}px rgba(91,200,232,${0.15 + 0.2 * res})`,
        fontFamily: FONT,
      }}
    >
      <div style={{fontWeight: 700, fontSize: 21 * s, letterSpacing: '0.16em', color: C.cyan, marginBottom: 22 * s}}>TAPETE ENTFERNEN · RECHENWEG</div>
      {LINES.map((l, i) => {
        const on = prog(f, t[i], t[i] + 10, EASE);
        const next = i < LINES.length - 1 ? prog(f, t[i + 1], t[i + 1] + 10) : prog(f, tResult, tResult + 10);
        const active = on * (1 - 0.6 * next);
        const appear = prog(f, t[i] - 8, t[i] + 6, EASE);
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'baseline',
              gap: 18 * s,
              padding: `${8 * s}px 0`,
              opacity: 0.35 + 0.65 * appear,
              transform: `translateX(${(1 - appear) * -18}px)`,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: 44 * s,
                letterSpacing: '-0.02em',
                color: active > 0.05 ? `rgb(${mix(244, 91, active)},${mix(246, 200, active)},${mix(248, 232, active)})` : C.white,
                textShadow: `0 0 ${24 * active}px rgba(91,200,232,0.8)`,
                whiteSpace: 'nowrap',
                ...tabular,
              }}
            >
              {l.math}
            </span>
            <span style={{fontWeight: 500, fontSize: 30 * s, color: C.muted, whiteSpace: 'nowrap'}}>{l.label}</span>
            {/* underline sweep */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: 3 * s,
                width: `${on * 100}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, rgba(91,200,232,${0.9 * active}), rgba(91,200,232,0))`,
              }}
            />
          </div>
        );
      })}
      <div style={{height: 2, background: 'rgba(255,255,255,0.14)', margin: `${18 * s}px 0 ${14 * s}px`}} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18 * s, opacity: prog(f, tResult - 6, tResult + 6), transform: `translateY(${(1 - prog(f, tResult - 6, tResult + 10, EASE)) * 16}px)`}}>
        <span style={{fontWeight: 800, fontSize: 72 * s, letterSpacing: '-0.03em', color: C.white, textShadow: `0 0 ${30 * res}px rgba(91,200,232,0.7)`, ...tabular}}>
          = {val} m²
        </span>
      </div>
    </div>
  );
};

export const Sh05Rechenweg: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tZoom = beat('rechenweg', 'zoom');
  const tLift = beat('rechenweg', 'lift');
  const t1 = beat('rechenweg', 'line1');
  const t2 = beat('rechenweg', 'line2');
  const t3 = beat('rechenweg', 'line3');
  const tRes = beat('rechenweg', 'result');

  const ps = phoneSize(v ? 860 : 560);
  // first position card, relative to the phone centre (output px at scale 1)
  const card = H03.card1;
  const cardY = ps.bezel + (card.y + card.h / 2 + STATUS_H) * ps.k - ps.h / 2;
  const zoom = prog(f, tZoom, tZoom + 50, EASE);
  const s = mix(1, v ? 1.22 : 1.45, zoom) + prog(f, 0, dur, EASE_CAM) * 0.05;
  const Ty = mix(v ? -120 : 40, v ? -390 : -150, zoom);
  const x = v ? 0 : mix(380, 430, zoom);
  const lift = prog(f, tLift, tLift + 26, EASE);

  const lineOn = (a: number, b: number) => prog(f, a, a + 8) * (1 - prog(f, b, b + 10));
  const content = (
    <>
      <Space img={IMG.h03} />
      <Highlight rect={{x: H03.calcLine1.x, y: H03.calcLine1.y, w: 432, h: 30}} t={lineOn(t1, t2)} radius={8} pad={5} />
      <Highlight rect={{x: H03.calcLine2.x, y: H03.calcLine2.y, w: 300, h: 30}} t={lineOn(t2, t3)} radius={8} pad={5} />
      <Highlight rect={{x: 388, y: H03.calcLine2.y, w: 114, h: 30}} t={lineOn(t3, tRes)} radius={8} pad={5} />
      <Highlight rect={H03.qty1} t={prog(f, tRes, tRes + 10)} radius={10} pad={6} />
      {/* the other positions dim slightly so the first one leads */}
      {H03.cards.slice(1).map((r, i) => (
        <div key={i} style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 18, background: 'rgba(0,0,0,0.45)', opacity: zoom}} />
      ))}
    </>
  );

  const panel = v ? {x: 0, y: 330, w: 960, s: 1.12} : {x: -420, y: 150, w: 800, s: 1};
  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : 0.68} glowY={0.45} />
      <Camera>
        <Plane w={ps.w} h={ps.h} x={x} y={Ty - cardY * s} scale={s} rx={9} ry={mix(-18, -12, zoom)} rz={-0.5}>
          <Phone screenW={ps.screenW} content={content} statusColor="#0A0A0A" />
        </Plane>
        {/* the calculation lifts off the screen towards the camera */}
        <Plane
          w={panel.w}
          h={420}
          x={mix(x, panel.x, lift)}
          y={mix(Ty, panel.y, lift)}
          z={mix(-40, 160, lift)}
          ry={mix(-14, v ? 0 : 6, lift)}
          rx={mix(9, 2, lift)}
          scale={mix(0.45, 1, lift)}
          opacity={prog(f, tLift, tLift + 8)}
        >
          <Formula f={f} t={[t1, t2, t3]} tResult={tRes} w={panel.w} s={panel.s} />
        </Plane>
      </Camera>
      <TopScrim h={640} />
      <div style={{position: 'absolute', left: v ? 70 : 120, top: v ? 230 : 120}}>
        <Headline text={'Jeder Rechenweg\nsichtbar.'} at={tZoom + 4} size={v ? 92 : 92} />
      </div>
    </AbsoluteFill>
  );
};
