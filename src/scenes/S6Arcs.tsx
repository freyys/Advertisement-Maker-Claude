import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {palette, STAGE} from '../theme';
import {S6_BEATS as B, SCENES} from '../timeline';
import {ease, prog} from '../lib/anim';
import * as copy from '../copy';
import {Camera} from '../components/Camera';
import {BAR, BAR_TOP, barCamera, CommandBar} from '../components/CommandBar';

type Pt = [number, number];
type Cubic = [Pt, Pt, Pt, Pt];

const MEET: Pt = [BAR.cx, BAR_TOP + 4];
const ARCS: Cubic[] = [
  [[-80, -60], [520, 30], [800, 300], MEET],
  [[STAGE.width + 80, -60], [1400, 30], [1120, 300], MEET],
];

const at = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

// Arc-length lookup so the comet head sits exactly on the stroke's end.
const lut = (c: Cubic) => {
  const n = 240;
  const lens = [0];
  let prev = at(c, 0);
  for (let i = 1; i <= n; i++) {
    const p = at(c, i / n);
    lens.push(lens[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1]));
    prev = p;
  }
  return lens.map((l) => l / lens[n]);
};
const LUTS = ARCS.map(lut);
const pointAtFraction = (i: number, f: number): Pt => {
  const L = LUTS[i];
  let j = 0;
  while (j < L.length - 1 && L[j + 1] < f) j++;
  const span = L[j + 1] - L[j] || 1;
  const t = (j + (f - L[j]) / span) / (L.length - 1);
  return at(ARCS[i], Math.min(1, Math.max(0, t)));
};

const d = (c: Cubic) => `M${c[0].join(' ')} C${c[1].join(' ')} ${c[2].join(' ')} ${c[3].join(' ')}`;

export const S6Arcs: React.FC = () => {
  const frame = useCurrentFrame();
  const head = prog(frame, B.arcsStart, B.arcsMeet, ease.inOut);
  const tail = prog(frame, B.arcsStart + 9, B.arcsMeet + 6, ease.inOut);
  const strokeOn = frame < B.arcsMeet + 6;

  const grow = prog(frame, B.arcsMeet - 2, B.arcsMeet + 9, ease.out);
  const flash = prog(frame, B.arcsMeet - 1, B.arcsMeet + 2) * (1 - prog(frame, B.arcsMeet + 2, B.arcsMeet + 14));
  const placeholderT = prog(frame, B.arcsMeet + 4, B.arcsMeet + 10);
  const cam = barCamera(frame);

  return (
    <AbsoluteFill>
      <Camera frame={frame} {...cam}>
        {strokeOn ? (
          <svg width={STAGE.width} height={STAGE.height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs>
              <filter id="arc-glow-wide" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            {ARCS.map((c, i) => {
              const len = Math.max(0.0001, head - tail);
              const dash = {
                pathLength: 1,
                strokeDasharray: `${len} 2`,
                strokeDashoffset: -tail,
                fill: 'none',
                strokeLinecap: 'round' as const,
              };
              const [hx, hy] = pointAtFraction(i, head);
              return (
                <g key={i}>
                  <path d={d(c)} stroke={palette.violet} strokeWidth={26} opacity={0.5} filter="url(#arc-glow-wide)" {...dash} />
                  <path d={d(c)} stroke={palette.lavender} strokeWidth={8} opacity={0.9} filter="url(#arc-glow)" {...dash} />
                  <path d={d(c)} stroke="#F3EEFF" strokeWidth={2.6} {...dash} />
                  {head > 0 && head < 1 ? (
                    <>
                      <circle cx={hx} cy={hy} r={26} fill={palette.lavender} opacity={0.55} filter="url(#arc-glow-wide)" />
                      <circle cx={hx} cy={hy} r={6} fill="#fff" />
                    </>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : null}
        {/* the empty command bar materialises where the strokes meet */}
        {frame < SCENES.S7.start && grow > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: BAR.cx - BAR.w / 2,
              top: BAR_TOP,
              opacity: Math.min(1, grow * 1.5),
              transform: `scaleX(${0.04 + 0.96 * grow}) scaleY(${0.5 + 0.5 * grow})`,
              transformOrigin: '50% 0%',
            }}
          >
            <CommandBar placeholder={copy.commandBar.placeholder} glow={flash} contentOpacity={placeholderT} />
          </div>
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};
