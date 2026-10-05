import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, FONT} from '../theme';
import {beat} from '../timeline';
import {D01, IMG, Rect} from '../assets';
import {mix, pop, prog, typed, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {MacBook, macSize} from '../components/MacBook';
import {Band, Crop, Highlight, Patch, Space} from '../components/Screen';
import {Display} from '../components/Display';
import {Headline} from '../components/Headline';
import {LightSweep} from '../components/Fx';

// 0:50 – Morning in the cockpit: "Guten Tag." types itself, the four KPI
// cards fly in, and "offen" / "überfällig" light up as the voice names them.

const YELLOW = '245,192,74';
const RED = '240,96,122';

/** "Guten Tag." typed over the original title, the cyan dot pops last. */
const TypedTitle: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = D01.title;
  const text = typed('Guten Tag', f, at, at + 22);
  const dotAt = at + 26;
  const dot = pop(f, dotAt, {damping: 9, stiffness: 220, mass: 0.6});
  const caret = text.length < 9 && Math.floor(f / 6) % 2 === 0;
  return (
    <>
      <Patch rect={{x: t.x - 6, y: t.y - 4, w: t.w + 24, h: t.h + 10}} fill="linear-gradient(90deg, #10181d, #0e1418 45%, #0b0d10)" feather={3} />
      <div
        style={{
          position: 'absolute',
          left: 759,
          top: 208,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 78,
          lineHeight: '120px',
          letterSpacing: '-0.025em',
          color: '#F2F2F3',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
        {caret && <span style={{display: 'inline-block', width: 4, height: 66, marginLeft: 4, verticalAlign: '-6px', background: C.cyan}} />}
        <span style={{display: 'inline-block', color: C.cyanUi, transformOrigin: '50% 82%', transform: `scale(${dot})`, opacity: f >= dotAt ? 1 : 0, textShadow: `0 0 ${24 * dot}px rgba(91,200,232,0.8)`}}>.</span>
      </div>
    </>
  );
};

const flyIn = (f: number, at: number) => {
  const t = prog(f, at, at + 18, EASE);
  return {
    opacity: Math.min(1, t * 1.6),
    transform: `translateY(${(1 - t) * 60}px) scale(${mix(1.35, 1, t)})`,
    filter: t < 0.98 ? `blur(${(1 - t) * 14}px)` : undefined,
  } as React.CSSProperties;
};

const glowRing = (f: number, at: number) => prog(f, at, at + 8) * (1 - prog(f, at + 26, at + 40));

export const Sh09Cockpit: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tType = beat('cockpit', 'type');
  const tCards = beat('cockpit', 'cards');
  const every = beat('cockpit', 'cardEvery');
  const tOffen = beat('cockpit', 'offen');
  const tUeber = beat('cockpit', 'ueberfaellig');
  const cam = prog(f, 0, dur, EASE_CAM);
  const enter = prog(f, 0, 30, EASE);

  const rings = (
    <>
      <Highlight rect={D01.kpis[0]} t={glowRing(f, tOffen)} radius={30} pad={6} color={YELLOW} />
      <Highlight rect={D01.kpis[1]} t={glowRing(f, tUeber)} radius={30} pad={6} color={RED} />
    </>
  );

  if (v) {
    // 9:16 recut: header on top, the four KPI cards as a 2 × 2 grid
    const head: Rect = {x: 720, y: 120, w: 1080, h: 290};
    const hw = 960;
    const cw = 455;
    const ch = (cw / D01.kpis[0].w) * D01.kpis[0].h;
    return (
      <AbsoluteFill>
        <Stage glowX={0.5} glowY={0.45} />
        <Camera>
          <Plane w={hw} h={(hw / head.w) * head.h} y={-560 + (1 - enter) * 40} rx={6} opacity={enter}>
            <Display img={IMG.d01} view={head} w={hw} h={(hw / head.w) * head.h} radius={26}>
              <TypedTitle f={f} at={tType} />
            </Display>
          </Plane>
          <Plane w={cw * 2 + 30} h={ch * 2 + 30} y={-110} z={cam * 40} rx={10} ry={mix(-6, 4, cam)}>
            {D01.kpis.map((r, i) => {
              const at = tCards + i * every;
              const ring = i === 0 ? glowRing(f, tOffen) : i === 1 ? glowRing(f, tUeber) : 0;
              const rgb = i === 0 ? YELLOW : RED;
              return (
                <div key={i} style={{position: 'absolute', left: (i % 2) * (cw + 30), top: Math.floor(i / 2) * (ch + 30), ...flyIn(f, at)}}>
                  <Crop img={IMG.d01} rect={r} w={cw} radius={22} style={{boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 ${50 * ring}px rgba(${rgb},${0.7 * ring})`, outline: ring > 0.02 ? `2px solid rgba(${rgb},${ring})` : undefined}} />
                  <div style={{position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden'}}>
                    <LightSweep t={prog(f, at + 14, at + 40, EASE_CAM)} strength={0.12} />
                  </div>
                </div>
              );
            })}
          </Plane>
        </Camera>
        <div style={{position: 'absolute', left: 70, top: 1250}}>
          <Headline text={'Dein Tag auf\neinen Blick.'} at={tCards + 10} size={92} />
        </div>
      </AbsoluteFill>
    );
  }

  // 16:9: MacBook, dolly into the KPI row
  const ms = macSize(1300);
  const kpi = {x: 1740, y: 666};
  const rel = {x: ms.bezel + kpi.x * ms.k - ms.lidW / 2, y: ms.bezel + kpi.y * ms.k - ms.lidH / 2};
  const dolly = prog(f, 4, dur - 10, EASE_CAM);
  const s = mix(1.0, 1.55, dolly);
  const T = {x: mix(60 + rel.x, 130, dolly), y: mix(-10 + rel.y, -150, dolly)};
  const content = (
    <>
      <Space img={IMG.d01} />
      <TypedTitle f={f} at={tType} />
      {D01.kpis.map((r, i) => (
        <Patch key={`p${i}`} rect={{x: r.x - 6, y: r.y - 6, w: r.w + 12, h: r.h + 12}} fill="#0A0A0C" radius={34} />
      ))}
      {D01.kpis.map((r, i) => {
        const at = tCards + i * every;
        return (
          <Band key={i} img={IMG.d01} rect={r} radius={30} style={{...flyIn(f, at), transformOrigin: '50% 50%'}}>
            <LightSweep t={prog(f, at + 14, at + 40, EASE_CAM)} strength={0.12} />
          </Band>
        );
      })}
      {rings}
    </>
  );
  return (
    <AbsoluteFill>
      <Stage glowX={0.55} glowY={0.45} />
      <Camera perspective={2600}>
        <Plane w={ms.lidW} h={ms.lidH} x={T.x - rel.x * s} y={T.y - rel.y * s + (1 - enter) * 60} scale={s} rx={-9} ry={mix(-8, -3, dolly)}>
          <MacBook screenW={ms.screenW} content={content} lean={11} />
        </Plane>
      </Camera>
      {/* scrim so the caption reads over the screen */}
      <AbsoluteFill style={{background: 'linear-gradient(20deg, rgba(5,7,9,0.92) 0%, rgba(5,7,9,0.55) 30%, rgba(5,7,9,0) 55%)'}} />
      <div style={{position: 'absolute', left: 120, top: 760}}>
        <Headline text={'Dein Tag auf\neinen Blick.'} at={tCards + 10} size={96} />
      </div>
    </AbsoluteFill>
  );
};
