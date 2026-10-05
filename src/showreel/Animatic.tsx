import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame} from 'remotion';
import {IMG} from './assets';
import {C, FONT} from './theme';
import {ShotId, TIMED_SHOTS, FPS} from './timeline';
import {useFormat} from './util';
import {Stage} from './components/Stage';
import {Phone, phoneSize} from './components/Phone';
import {MacBook, macSize} from './components/MacBook';
import {Headline} from './components/Headline';
import {Grain, Vignette} from './components/FilmFx';
import {KMark} from './components/Fx';
import {Space} from './components/Screen';
import {Wordmark} from '../components/Logo';

// Phase-1 blocking pass: static framing of every shot (device, asset, caption)
// on the final timeline. Used for the contact sheet and to time the voiceover.

const PHONE_SHOTS: Partial<Record<ShotId, keyof typeof IMG>> = {
  baustelle: 'h05',
  sagen: 'h02',
  rechenweg: 'h03',
  unterschrift: 'h04',
};
const DESK_SHOTS: Partial<Record<ShotId, keyof typeof IMG>> = {
  uebergabe: 'd05',
  pruefen: 'd07',
  cockpit: 'd01',
  cashflow: 'd02',
  befehl: 'd03',
};

const tc = (frames: number) => {
  const s = frames / FPS;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export const Block: React.FC<{id: ShotId; caption: string | null; n: number; from: number; to: number}> = ({id, caption, n, from, to}) => {
  const {W, H, v} = useFormat();
  const phone = PHONE_SHOTS[id];
  const desk = DESK_SHOTS[id];
  const ps = phoneSize(v ? 760 : 520);
  const ms = macSize(v ? 940 : 1180);
  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : 0.62} glowY={0.55} />
      <AbsoluteFill style={{perspective: 2200}}>
        {phone && (
          <div
            style={{
              position: 'absolute',
              left: v ? (W - ps.w) / 2 : W * 0.66 - ps.w / 2,
              top: v ? H * 0.3 : (H - ps.h) / 2 + 60,
              transform: 'rotateY(-10deg) rotateX(10deg)',
            }}
          >
            <Phone screenW={ps.screenW} content={<Space img={IMG[phone]} />} statusColor={phone === 'h05' ? '#000' : phone === 'h02' ? C.appTop : '#0A0A0A'} />
          </div>
        )}
        {desk && (
          <div
            style={{
              position: 'absolute',
              left: v ? (W - ms.lidW) / 2 : W * 0.6 - ms.lidW / 2,
              top: v ? H * 0.38 : (H - ms.lidH) / 2 - 20,
              transformStyle: 'preserve-3d',
              transform: 'rotateY(-10deg) rotateX(8deg)',
            }}
          >
            <MacBook screenW={ms.screenW} content={<Space img={IMG[desk]} />} />
          </div>
        )}
        {id === 'archiv' && (
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: v ? 'column' : 'row', gap: 30, alignItems: 'center', justifyContent: 'center', paddingTop: v ? 300 : 120}}>
            {(['d04', 'd08'] as const).map((k) => (
              <Img key={k} src={IMG[k].src} style={{width: v ? 900 : 860, borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}} />
            ))}
          </div>
        )}
        {id === 'pruefen' && (
          <Img
            src={IMG.d06.src}
            style={{position: 'absolute', width: v ? 380 : 330, left: v ? W - 430 : 120, top: v ? H - 760 : H - 520, transform: 'rotate(-6deg)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}
          />
        )}
        {id === 'intro' && (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: '#000'}}>
            <KMark size={150} glow={1} />
          </AbsoluteFill>
        )}
        {id === 'outro' && (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: '#000', gap: 40, flexDirection: 'column'}}>
            <Wordmark width={v ? 640 : 720} color={C.white} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {caption && (
        <div style={{position: 'absolute', left: v ? 70 : 110, top: v ? 230 : 120, width: v ? W - 140 : 820}}>
          <Headline text={caption} at={-100} size={v ? 84 : 92} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: v ? 40 : 40,
          bottom: 34,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 26,
          color: C.cyan,
          letterSpacing: '0.08em',
        }}
      >
        {String(n).padStart(2, '0')} · {id.toUpperCase()} · {tc(from)}–{tc(to)}
      </div>
    </AbsoluteFill>
  );
};

export const Animatic: React.FC = () => {
  useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg0}}>
      {TIMED_SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
          <Block id={s.id} caption={s.caption} n={i + 1} from={s.from} to={s.from + s.dur} />
        </Sequence>
      ))}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
