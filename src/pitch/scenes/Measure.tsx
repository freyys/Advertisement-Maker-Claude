import React from 'react';
import {AbsoluteFill} from 'remotion';
import {B, EASE, FONT, HY, tabular} from '../theme';
import {pop, prog} from '../../showreel/util';
import {useShotFrame} from '../ui';
import {TextBlock} from './common';
import {num} from '../copy';
import type {SceneProps} from '../Pitch';

// 0:07 – 0:09. The measurement calculator, drawn as pristine geometry:
// a 5 × 4 × 2.6 m room, two windows and a door; the equation builds on the
// beat and lands on 41.8 m² (18 × 2.6 − 2 × 1.25 × 1.2 − 1 × 2).

const SC = 80; // px per metre
const OX = 1440;
const OY = 352;
type P3 = [number, number, number];
const iso = ([x, y, z]: P3): [number, number] => [OX + (x - y) * 0.866 * SC, OY + (x + y) * 0.5 * SC - z * SC];
const poly = (pts: P3[]) => pts.map((p) => iso(p).join(',')).join(' ');
const line = (a: P3, b: P3) => {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return `M${x1} ${y1} L${x2} ${y2}`;
};

const L = 5;
const D = 4;
const HGT = 2.6;
const WALL_A: P3[] = [[0, 0, 0], [L, 0, 0], [L, 0, HGT], [0, 0, HGT]]; // back right (y = 0)
const WALL_B: P3[] = [[0, 0, 0], [0, D, 0], [0, D, HGT], [0, 0, HGT]]; // back left (x = 0)
const FLOOR: P3[] = [[0, 0, 0], [L, 0, 0], [L, D, 0], [0, D, 0]];
const WIN = (x0: number): P3[] => [[x0, 0, 0.9], [x0 + 1.25, 0, 0.9], [x0 + 1.25, 0, 2.1], [x0, 0, 2.1]];
const DOOR: P3[] = [[0, 1.4, 0], [0, 2.4, 0], [0, 2.4, 2.0], [0, 1.4, 2.0]];

const EDGES: Array<[P3, P3, boolean]> = [
  // [a, b, front edge (drawn dashed)]
  [[0, 0, 0], [L, 0, 0], false],
  [[0, 0, 0], [0, D, 0], false],
  [[L, 0, 0], [L, D, 0], true],
  [[0, D, 0], [L, D, 0], true],
  [[0, 0, 0], [0, 0, HGT], false],
  [[L, 0, 0], [L, 0, HGT], false],
  [[0, D, 0], [0, D, HGT], false],
  [[L, D, 0], [L, D, HGT], true],
  [[0, 0, HGT], [L, 0, HGT], false],
  [[0, 0, HGT], [0, D, HGT], false],
  [[L, 0, HGT], [L, D, HGT], true],
  [[0, D, HGT], [L, D, HGT], true],
];

export const Measure: React.FC<SceneProps> = ({copy, lang, dur}) => {
  const f = useShotFrame();
  const c = copy.measure;
  const T1 = 8;
  const T2 = 17;
  const T3 = 26;
  const RES = 35;
  const walls = prog(f, T1, T1 + 10);
  const wins = pop(f, T2, {damping: 14, stiffness: 200});
  const door = pop(f, T3, {damping: 14, stiffness: 200});
  const res = prog(f, RES, RES + 10, EASE);
  const value = 41.8 * res;
  const dims = prog(f, 12, 24);
  const drift = (f / dur) * 14;

  const terms: Array<{label: string; text: string; at: number}> = [
    {label: c.labels[0], text: `18 × ${num(2.6, 1, lang)}`, at: T1},
    {label: c.labels[1], text: `− 2 × ${num(1.25, 2, lang)} × ${num(1.2, 1, lang)}`, at: T2},
    {label: c.labels[2], text: '− 1 × 2', at: T3},
  ];

  const wallFill = `rgba(217,209,245,${0.75 * walls})`;
  const holeFill = (t: number) => `rgba(${HY},${0.85 * Math.min(1, t)})`;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, transform: `translate(${-drift}px, ${drift * 0.3}px)`}}>
        {/* walls fill as the first term lands */}
        <polygon points={poly(FLOOR)} fill={`rgba(10,10,12,${0.03 * walls})`} />
        <polygon points={poly(WALL_A)} fill={wallFill} />
        <polygon points={poly(WALL_B)} fill={wallFill} />
        {/* windows and door pop in as they are deducted */}
        {[WIN(0.9), WIN(2.85)].map((w, i) => (
          <polygon
            key={i}
            points={poly(w)}
            fill={holeFill(wins)}
            stroke={B.hyacinth}
            strokeWidth={2}
            opacity={wins > 0.01 ? 1 : 0}
            style={{transformBox: 'fill-box', transformOrigin: '50% 50%', transform: `scale(${0.4 + 0.6 * wins})`}}
          />
        ))}
        <polygon
          points={poly(DOOR)}
          fill={holeFill(door)}
          stroke={B.hyacinth}
          strokeWidth={2}
          opacity={door > 0.01 ? 1 : 0}
          style={{transformBox: 'fill-box', transformOrigin: '50% 100%', transform: `scaleY(${0.3 + 0.7 * door})`}}
        />
        {/* wireframe draws on */}
        {EDGES.map(([a, b, front], i) => {
          const t = prog(f, i * 1.2 - 6, i * 1.2 + 4, EASE); // already drawing as the whip lands
          return (
            <path
              key={i}
              d={line(a, b)}
              stroke={front ? 'rgba(10,10,12,0.35)' : B.black}
              strokeWidth={front ? 1.5 : 2.2}
              strokeDasharray={front ? '6 8' : undefined}
              fill="none"
              pathLength={front ? undefined : 1}
              style={front ? {opacity: t} : {strokeDasharray: '1 1', strokeDashoffset: 1 - t}}
              strokeLinecap="round"
            />
          );
        })}
        {/* corner ticks */}
        {([[0, 0, 0], [L, 0, 0], [0, D, 0], [0, 0, HGT]] as P3[]).map((p, i) => {
          const [x, y] = iso(p);
          return <circle key={i} cx={x} cy={y} r={4.5 * prog(f, i * 2 - 2, i * 2 + 6)} fill={B.hyacinth} />;
        })}
        {/* dimensions */}
        <g opacity={dims} fontFamily={FONT} fontWeight={600} fontSize={22} fill={B.grey} style={tabular}>
          <text {...lbl(iso([L / 2, D, 0]), 22, 30)}>{num(5, 1, lang)} m</text>
          <text {...lbl(iso([L, D / 2, 0]), 26, 26)}>{num(4, 1, lang)} m</text>
          <text {...lbl(iso([L, 0, HGT / 2]), 18, 0)}>{num(2.6, 1, lang)} m</text>
        </g>
      </svg>

      <TextBlock f={f} n="02" kicker={c.kicker} title={c.title} sub={c.sub} top={250} />

      {/* the equation */}
      <div style={{position: 'absolute', left: 128, top: 790, display: 'flex', alignItems: 'flex-end', gap: 30, fontFamily: FONT, ...tabular}}>
        {terms.map((t, i) => {
          const a = prog(f, t.at, t.at + 10, EASE);
          return (
            <div key={i} style={{opacity: a, transform: `translateY(${(1 - a) * 22}px)`}}>
              <div style={{fontSize: 17, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: i === 0 ? '#8C7FC2' : B.hyacinth, marginBottom: 10}}>
                {t.label}
              </div>
              <div style={{fontSize: 46, fontWeight: 600, color: B.ink, letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>{t.text}</div>
            </div>
          );
        })}
        <div style={{opacity: prog(f, RES - 2, RES + 6), transform: `translateY(${(1 - prog(f, RES - 2, RES + 8, EASE)) * 22}px)`, display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <div style={{fontSize: 46, fontWeight: 600, color: B.ink}}>=</div>
          <div style={{fontSize: 80, fontWeight: 700, lineHeight: 0.9, color: B.hyacinth, letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>
            {num(value, 1, lang)} m²
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const lbl = ([x, y]: [number, number], dx: number, dy: number) => ({x: x + dx, y: y + dy, textAnchor: 'start' as const});
