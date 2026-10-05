import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './fx';
import {FPS} from './timeline';
import words from './words.json';

type Word = {w: string; s: number; e: number; br: boolean};
const MAX_CHARS = 20;

/** Splits the voice-over into short caption lines (new line on each sentence break). */
const groupWords = (ws: Word[]) => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  for (const w of ws) {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0);
    if (cur.length && (w.br || len + w.w.length > MAX_CHARS)) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) groups.push(cur);
  return groups;
};

/** Word-by-word captions: white, the active word gold. */
export const Captions: React.FC<{y?: number}> = ({y = 1380}) => {
  const t = useCurrentFrame() / FPS;
  const groups = useMemo(() => groupWords(words as Word[]), []);
  const gi = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    const end = next ? Math.min(next[0].s - 0.02, g[g.length - 1].e + 0.6) : g[g.length - 1].e + 0.8;
    return t >= g[0].s - 0.08 && t < end;
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const appear = Math.min(1, (t - (g[0].s - 0.08)) / 0.12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top: y,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 66,
        lineHeight: 1.15,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 14}px)`,
      }}
    >
      {g.map((w, i) => {
        const active = t >= w.s && t < (g[i + 1]?.s ?? w.e + 0.3);
        const k = active ? Math.min(1, (t - w.s) / 0.08) : 0;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 14px',
              color: active ? C.gold : C.white,
              transform: `scale(${1 + 0.1 * k})`,
              WebkitTextStroke: '2px rgba(0,0,0,0.55)',
              paintOrder: 'stroke fill',
              textShadow: active ? '0 0 26px rgba(232,181,74,0.75), 0 4px 14px rgba(0,0,0,0.9)' : '0 4px 14px rgba(0,0,0,0.95)',
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
