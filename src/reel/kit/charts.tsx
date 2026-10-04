// Cashflow-Radar (cumulative area line) and the monthly revenue bars, drawn
// in SVG like the app's charts.
import React from 'react';
import {d, tnum} from '../tokens';
import {de} from '../../lib/format';
import {clamp01} from '../../lib/anim';

const yLabel: React.CSSProperties = {position: 'absolute', fontSize: 11.5, color: d.muted, textAlign: 'right', width: 44, ...tnum};

/** Smooth path with flat tangents at every point (plateaus stay flat). */
const smooth = (pts: Array<[number, number]>) =>
  pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return `${acc} C${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }, '');

export const CashflowChart: React.FC<{
  w: number;
  weeks: string[];
  values: number[];
  max: number;
  draw: number; // 0…1
  pulse?: number;
  activeWeek?: number;
}> = ({w, weeks, values, max, draw, pulse = 0, activeWeek = 0}) => {
  const left = 56;
  const right = w - 18;
  const top = 10;
  const h = 134;
  const x0 = left + 74;
  const step = (right - 54 - x0) / (weeks.length - 1);
  const xs = weeks.map((_, i) => x0 + i * step);
  const y = (v: number) => top + h - (v / max) * h;
  const pts: Array<[number, number]> = [[left + 18, y(0)], ...values.map((v, i) => [xs[i], y(v)] as [number, number]), [right, y(values[values.length - 1])]];
  const line = smooth(pts);
  const area = `${line} L${right} ${top + h} L${left + 18} ${top + h} Z`;
  const clipW = left + 18 + (right - left - 18) * draw;
  const ticks = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  const major = [1, 2, 3, 5];
  return (
    <div style={{position: 'relative', width: w, height: top + h + 34}}>
      {ticks.map((t, i) => (
        <React.Fragment key={i}>
          <div style={{...yLabel, left: 0, top: y(t) - 8}}>{t === 0 ? '0 €' : `${de(t / 1000, t % 1000 === 0 ? 0 : 1)} T€`}</div>
          <div style={{position: 'absolute', left: left + 18, right: w - right, top: y(t), height: 1, background: 'rgba(255,255,255,0.05)'}} />
        </React.Fragment>
      ))}
      <svg width={w} height={top + h + 4} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="cf-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#24404C" stopOpacity={0.95} />
            <stop offset="1" stopColor="#15232A" stopOpacity={0.8} />
          </linearGradient>
          <clipPath id="cf-clip">
            <rect x={0} y={-20} width={clipW} height={top + h + 40} />
          </clipPath>
        </defs>
        <g clipPath="url(#cf-clip)">
          <path d={area} fill="url(#cf-area)" />
          <path d={line} fill="none" stroke={d.accent} strokeWidth={2.6} strokeLinecap="round" style={{filter: `drop-shadow(0 0 6px rgba(92,196,228,0.55))`}} />
        </g>
        {xs.map((x, i) => {
          const on = clamp01((clipW - x) / 30);
          if (on <= 0) return null;
          const big = major.includes(i);
          return (
            <g key={i} transform={`translate(${x} ${y(values[i])}) scale(${on})`}>
              {big ? (
                <>
                  <circle r={7 + pulse * 6} fill="rgba(92,196,228,0.18)" opacity={i === 5 ? 1 : 0.6} />
                  <circle r={5} fill={d.accent} stroke="#0B1216" strokeWidth={2} />
                </>
              ) : (
                <circle r={2.6} fill="#5B6C74" />
              )}
            </g>
          );
        })}
      </svg>
      {weeks.map((wk, i) => (
        <div
          key={wk}
          style={{
            position: 'absolute',
            left: xs[i] - 30,
            width: 60,
            top: top + h + 10,
            textAlign: 'center',
            fontSize: 12,
            color: i === activeWeek ? '#fff' : d.muted,
            fontWeight: i === activeWeek ? 700 : 500,
          }}
        >
          {wk}
        </div>
      ))}
    </div>
  );
};

export const BarChart: React.FC<{
  w: number;
  h: number;
  labels: string[];
  values: number[];
  max: number;
  grow: (i: number) => number;
  barW?: number;
  dim?: number;
  peakLabel?: string;
  peakT?: number;
}> = ({w, h, labels, values, max, grow, barW = 44, dim = 0, peakLabel, peakT = 0}) => {
  const left = 64;
  const right = w - 14;
  const top = 12;
  const plotH = h - top - 30;
  const slot = (right - left) / labels.length;
  const y = (v: number) => top + plotH - (v / max) * plotH;
  const ticks = [5, 4, 3, 2, 1, 0].map((t) => (t * max) / 5);
  const last = labels.length - 1;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      {ticks.map((t, i) => (
        <React.Fragment key={i}>
          <div style={{...yLabel, left: 6, top: y(t) - 8}}>{t === 0 ? '0 €' : `${de(t / 1000, 1)} T€`}</div>
          <div style={{position: 'absolute', left, right: w - right, top: y(t), height: 1, background: 'rgba(255,255,255,0.05)'}} />
        </React.Fragment>
      ))}
      {labels.map((l, i) => {
        const g = clamp01(grow(i));
        const bh = (values[i] / max) * plotH * g;
        const cx = left + slot * (i + 0.5);
        return (
          <React.Fragment key={l}>
            {values[i] > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: cx - barW / 2,
                  width: barW,
                  top: top + plotH - bh,
                  height: bh,
                  borderRadius: '4px 4px 0 0',
                  background: dim ? `rgba(92,196,228,${1 - dim * 0.6})` : d.accent,
                  boxShadow: i === last ? `0 0 ${24 * g}px rgba(92,196,228,0.45)` : undefined,
                }}
              />
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: cx - 30,
                width: 60,
                top: top + plotH + 9,
                textAlign: 'center',
                fontSize: 12.5,
                color: i === last ? '#fff' : d.muted,
                fontWeight: i === last ? 700 : 500,
              }}
            >
              {l}
            </div>
          </React.Fragment>
        );
      })}
      {peakLabel ? (
        <div
          style={{
            position: 'absolute',
            left: left + slot * (last + 0.5) - 40,
            width: 80,
            top: y(values[last]) - 26 - (1 - peakT) * 8,
            textAlign: 'center',
            fontSize: 12.5,
            fontWeight: 700,
            color: '#fff',
            opacity: peakT,
          }}
        >
          {peakLabel}
        </div>
      ) : null}
    </div>
  );
};
