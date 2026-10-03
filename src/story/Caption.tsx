import React from 'react';
import {useCurrentFrame} from 'remotion';
import {app, FONT, palette} from '../theme';
import {ease, prog} from '../lib/anim';
import type {Layout} from './layout';
import {CHAPTERS, ChapterKey} from './timeline';
import {captions, Caption} from './copy';

const ORDER: Array<Exclude<ChapterKey, 'end'>> = ['intro', 'sagen', 'rechnen', 'aendern', 'pruefen', 'uebergeben'];
const IN_DELAY: Partial<Record<ChapterKey, number>> = {intro: 14};
const OUT_FRAMES = 11;

const Label: React.FC<{text: string; size: number}> = ({text, size}) => {
  const m = text.match(/^(\d\d) — (.*)$/);
  const base: React.CSSProperties = {fontSize: size, fontWeight: 800, letterSpacing: '0.16em'};
  if (!m) return <div style={{...base, color: palette.lavender}}>{text}</div>;
  return (
    <div style={{...base, display: 'flex', gap: size * 0.45}}>
      <span style={{color: app.accent}}>{m[1]}</span>
      <span style={{color: app.muted, letterSpacing: 0}}>—</span>
      <span style={{color: palette.white}}>{m[2]}</span>
    </div>
  );
};

const Block: React.FC<{c: Caption; frame: number; start: number; end: number; layout: Layout}> = ({
  c,
  frame,
  start,
  end,
  layout,
}) => {
  const L = layout.caption;
  const tOut = prog(frame, end - OUT_FRAMES - 2, end - 2, ease.in);
  const out = (t: number): React.CSSProperties => ({
    opacity: t * (1 - tOut),
    transform: `translateY(${(1 - t) * 22 - tOut * 18}px)`,
  });
  const labelT = prog(frame, start, start + 12);
  let wordIdx = 0;
  const words = c.lines.map((line) => line.split(' '));
  const totalWords = words.flat().length;
  const subT = prog(frame, start + 6 + totalWords * 2.6 + 4, start + 6 + totalWords * 2.6 + 18);

  return (
    <div
      style={{
        position: 'absolute',
        left: L.x,
        width: L.w,
        top: L.top ?? L.centerY,
        transform: L.top === undefined ? 'translateY(-50%)' : undefined,
        fontFamily: FONT,
      }}
    >
      <div style={out(labelT)}>
        <Label text={c.label} size={L.label} />
      </div>
      <div style={{marginTop: L.label * 0.85}}>
        {words.map((ws, li) => (
          <div
            key={li}
            style={{
              fontSize: L.head,
              fontWeight: 800,
              letterSpacing: '-0.028em',
              lineHeight: 1.07,
              color: li === 0 ? palette.white : '#CDBDFF',
              whiteSpace: 'nowrap',
            }}
          >
            {ws.map((w, wi) => {
              const i = wordIdx++;
              const t = prog(frame, start + 6 + i * 2.6, start + 6 + i * 2.6 + 15);
              return (
                <React.Fragment key={wi}>
                  <span style={{display: 'inline-block', ...out(t)}}>{w}</span>
                  {wi < ws.length - 1 ? ' ' : null}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
      {c.sub ? (
        <div
          style={{
            marginTop: L.head * 0.36,
            fontSize: L.sub,
            fontWeight: 500,
            lineHeight: 1.35,
            color: 'rgba(255,255,255,0.64)',
            ...out(subT),
          }}
        >
          {c.sub}
        </div>
      ) : null}
    </div>
  );
};

/** Chapter captions: one at a time, words rise in, the block lifts out. */
export const Captions: React.FC<{layout: Layout}> = ({layout}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {ORDER.map((key) => {
        const {start, end} = CHAPTERS[key];
        const s = start + (IN_DELAY[key] ?? 0);
        if (frame < s || frame >= end) return null;
        return <Block key={key} c={captions[key]} frame={frame} start={s} end={end} layout={layout} />;
      })}
    </>
  );
};
