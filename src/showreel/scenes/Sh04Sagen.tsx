import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, EASE_IN, FONT} from '../theme';
import {beat} from '../timeline';
import {H02, IMG} from '../assets';
import {keys, mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Phone, phoneSize} from '../components/Phone';
import {Band, Highlight, Patch, Space} from '../components/Screen';
import {Headline} from '../components/Headline';
import {Callout} from '../components/Callout';
import {LightSweep} from '../components/Fx';

// 0:17 – Hero. The spoken request types itself into the chat bubble, then
// the AI draft slides up row by row and the net amount counts up.

// App background behind the chat (sampled from the screenshot).
const CHAT_BG =
  'linear-gradient(180deg, #1c272d 0px, #19242a 100px, #181f27 200px, #141c1f 300px, #13181c 400px, #101417 500px, #0b0c0e 700px, #0a0a0a 900px)';

const TypedBubble: React.FC<{f: number; from: number; to: number}> = ({f, from, to}) => {
  const lines = H02.bubbleLines;
  const total = lines.reduce((n, l) => n + l.length, 0);
  const n = Math.round(mix(0, total, prog(f, from, to, (t) => t)));
  // reveal across lines
  let left = n;
  const shown = lines.map((l) => {
    const s = l.slice(0, Math.max(0, Math.min(l.length, left)));
    left -= l.length;
    return s;
  });
  const lastLine = Math.max(0, shown.reduce((last, s, i) => (s.length > 0 ? i : last), 0));
  const t = H02.bubbleText;
  const appear = prog(f, from - 6, from + 6, EASE);
  // grows by one line whenever typing reaches the next line
  let height = 80;
  let before = 0;
  lines.forEach((l, i) => {
    if (i > 0) {
      const at = from + ((to - from) * before) / total;
      height += 40 * prog(f, at - 1, at + 5, EASE);
    }
    before += l.length;
  });
  const caret = n < total ? (Math.floor(f / 8) % 2 === 0 ? 1 : 0) : 0;
  const b = H02.bubble;
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y,
        width: b.w,
        height,
        borderRadius: 34,
        background: C.bubble,
        opacity: appear,
        transformOrigin: '100% 0%',
        transform: `scale(${0.85 + 0.15 * appear})`,
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', left: t.x - b.x, top: t.y - b.y + 1, fontFamily: FONT, fontWeight: 500, fontSize: t.size, lineHeight: `${t.lineH}px`, color: '#0A2133', letterSpacing: '-0.005em', whiteSpace: 'pre'}}>
        {shown.map((s, i) => (
          <div key={i} style={{height: t.lineH}}>
            {s}
            {i === lastLine && <span style={{display: 'inline-block', width: 3, height: 32, marginLeft: 2, verticalAlign: '-6px', background: '#0A2133', opacity: caret}} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const Waveform: React.FC<{f: number; on: number; bars?: number; w: number; h: number}> = ({f, on, bars = 30, w, h}) => (
  <div style={{position: 'relative', width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: on}}>
    {new Array(bars).fill(0).map((_, i) => {
      const env = Math.sin((Math.PI * (i + 0.5)) / bars);
      const a = Math.abs(Math.sin(f * 0.37 + i * 0.71) * Math.sin(f * 0.13 + i * 1.37));
      const bh = h * (0.08 + 0.92 * a * env) * on;
      return (
        <div
          key={i}
          style={{
            width: w / bars / 2.2,
            height: Math.max(4, bh),
            borderRadius: 99,
            background: C.cyan,
            boxShadow: '0 0 14px rgba(91,200,232,0.8)',
            opacity: 0.45 + 0.55 * env,
          }}
        />
      );
    })}
  </div>
);

export const Sh04Sagen: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tType = beat('sagen', 'typeStart');
  const tTypeEnd = beat('sagen', 'typeEnd');
  const tReply = beat('sagen', 'reply');
  const tCard = beat('sagen', 'card');
  const every = beat('sagen', 'rowEvery');
  const tCount = beat('sagen', 'count');
  const tFertig = beat('sagen', 'fertig');
  const tPan = beat('sagen', 'pan');
  const tPanEnd = beat('sagen', 'panEnd');

  const ps = phoneSize(v ? 860 : 640);
  const A = v ? 355 : 294; // bubble in frame
  const B = v ? -192 : -146; // card in frame
  const y = keys(f, [
    [0, A + 60],
    [24, A],
    [tPan, A - 12],
    [tPanEnd, B],
    [dur, B - 24],
  ]);
  const x = v ? 0 : 280;
  const cam = prog(f, 0, dur, EASE_CAM);
  const exit = prog(f, dur - 10, dur, EASE_IN);

  const swap = prog(f, tTypeEnd + 4, tTypeEnd + 12);
  const reply = prog(f, tReply, tReply + 14, EASE);
  const card = prog(f, tCard, tCard + 18, EASE);
  const rowsFrom = tCard + 6;
  const nettoAt = rowsFrom + 7 * every;
  const voice = prog(f, tType - 4, tType + 8) * (1 - prog(f, tTypeEnd - 4, tTypeEnd + 8));

  const content = (
    <>
      <Space img={IMG.h02} />
      <Patch rect={{x: 0, y: 22, w: 780, h: 1350}} fill={CHAT_BG} />
      {/* typed request → original bubble pixels */}
      {swap < 1 && (
        <div style={{opacity: 1 - swap}}>
          <TypedBubble f={f} from={tType} to={tTypeEnd} />
        </div>
      )}
      {swap > 0 && <Band img={IMG.h02} rect={H02.bubble} radius={34} style={{opacity: swap}} />}
      {/* AI reply */}
      <Band img={IMG.h02} rect={H02.reply} style={{opacity: reply, transform: `translateY(${(1 - reply) * 30}px)`}} />
      {/* draft card: frame first, then row by row */}
      <div style={{position: 'absolute', inset: 0, opacity: card, transform: `translateY(${(1 - card) * 90}px)`}}>
        <Band img={IMG.h02} rect={H02.card} radius={30} />
        <Patch rect={{x: 44, y: 481, w: 692, h: 880}} fill={C.card} radius={24} />
        {H02.cardBands.map((r, i) => {
          const t = prog(f, rowsFrom + i * every, rowsFrom + i * every + 12, EASE);
          return <Band key={i} img={IMG.h02} rect={r} style={{opacity: t, transform: `translateY(${(1 - t) * 26}px)`}} />;
        })}
        <Highlight rect={H02.netto} t={prog(f, nettoAt + 4, nettoAt + 14) * (1 - prog(f, nettoAt + 60, nettoAt + 80))} radius={12} pad={6} />
        <div style={{position: 'absolute', left: H02.card.x, top: H02.card.y, width: H02.card.w, height: H02.card.h, borderRadius: 30, overflow: 'hidden'}}>
          <LightSweep t={prog(f, nettoAt + 10, nettoAt + 40, EASE_CAM)} strength={0.12} />
        </div>
      </div>
    </>
  );

  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : 0.65} glowY={0.5} camY={y * 0.3} />
      <Camera>
        <Plane
          w={ps.w}
          h={ps.h}
          x={x}
          y={y}
          z={cam * 70 + exit * 160}
          rx={8}
          ry={mix(-15, -8, cam)}
          rz={mix(0.6, -0.4, cam)}
        >
          <Phone screenW={ps.screenW} content={content} statusColor={C.appTop} />
        </Plane>
      </Camera>

      {/* voice → text */}
      <div style={{position: 'absolute', left: v ? 190 : 610, top: v ? 520 : 300, transform: `translateX(${(1 - voice) * -30}px)`}}>
        <Waveform f={f} on={voice} w={v ? 700 : 360} h={v ? 90 : 110} />
      </div>

      <div style={{position: 'absolute', left: v ? 70 : 120, top: v ? 230 : 140}}>
        <Headline text="Sagen. Fertig." at={tType} size={v ? 104 : 118} wordAt={[tType, tFertig]} />
      </div>
      <div style={{position: 'absolute', left: v ? 60 : 120, top: v ? 1250 : 600}}>
        <Callout label="NETTO LAUT KATALOG" value={1463.62} at={tCount} countTo={tCount + 40} size={v ? 92 : 96} sub="Wohnzimmer · 5 Positionen" />
      </div>
    </AbsoluteFill>
  );
};
