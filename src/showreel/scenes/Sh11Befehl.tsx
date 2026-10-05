import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, FONT} from '../theme';
import {beat} from '../timeline';
import {D03, IMG} from '../assets';
import {mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Display, viewAt} from '../components/Display';
import {Band, Patch} from '../components/Screen';
import {Headline} from '../components/Headline';
import {Keycap, LightSweep} from '../components/Fx';

// 1:01 – Strg + K: the keys go down in 3D, the command palette opens over the
// cockpit and "Rech" types itself; the results fall into place.

const PAL = D03.palette;
const HOLE = `path(evenodd, 'M0 0 H2880 V1800 H0 Z M${PAL.x} ${PAL.y} H${PAL.x + PAL.w} V${PAL.y + PAL.h} H${PAL.x} Z')`;

export const Sh11Befehl: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tKeys = beat('befehl', 'keys');
  const tPress = beat('befehl', 'press');
  const tPal = beat('befehl', 'palette');
  const tType = beat('befehl', 'type');
  const every = beat('befehl', 'typeEvery');
  const tRows = beat('befehl', 'rows');

  const open = prog(f, tPal, tPal + 12, EASE);
  const dim = prog(f, tPal - 2, tPal + 8);
  const n = Math.max(0, Math.min(4, Math.floor((f - tType) / every) + 1));
  const caret = Math.floor(f / 7) % 2 === 0;
  const cam = prog(f, 0, dur, EASE_CAM);
  const enter = prog(f, 0, 20, EASE);
  const rowsTop = D03.rows[0].y;
  const footTop = D03.footer.y;

  const content = (
    <>
      {/* the same cockpit with the dimmed backdrop of the open palette */}
      <div style={{position: 'absolute', inset: 0, clipPath: HOLE, opacity: dim}}>
        <Img src={IMG.d03.src} style={{position: 'absolute', left: 0, top: 0, width: 2880, height: 1800}} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: open,
          transformOrigin: `${PAL.x + PAL.w / 2}px ${PAL.y}px`,
          transform: `translateY(${(1 - open) * -24}px) scale(${mix(0.95, 1, open)})`,
        }}
      >
        <Band img={IMG.d03} rect={PAL} radius={34} style={{boxShadow: '0 40px 120px rgba(0,0,0,0.6)'}} />
        {/* input: typed live */}
        <Patch rect={{x: D03.typed.x - 8, y: D03.typed.y - 4, w: D03.typed.w + 40, h: D03.typed.h + 8}} fill={C.palette} />
        <div style={{position: 'absolute', left: 921, top: D03.typed.y - 4, height: D03.typed.h + 8, display: 'flex', alignItems: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 30, letterSpacing: '-0.005em', color: '#EDEDEF', whiteSpace: 'nowrap'}}>
          {f >= tType ? 'Rech'.slice(0, n) : ''}
          <span style={{display: 'inline-block', width: 2.5, height: 36, marginLeft: 1, background: '#EDEDEF', opacity: caret || (f >= tType && n < 4) ? 1 : 0}} />
        </div>
        {/* results: empty until the query is in, then row by row */}
        <Patch rect={{x: PAL.x + 3, y: rowsTop, w: PAL.w - 6, h: footTop - rowsTop}} fill={C.palette} />
        {D03.rows.map((r, i) => {
          const t = prog(f, tRows + i * 2, tRows + i * 2 + 10, EASE);
          return <Band key={i} img={IMG.d03} rect={r} style={{opacity: t, transform: `translateY(${(1 - t) * 18}px)`}} />;
        })}
        <div style={{position: 'absolute', left: D03.rows[0].x + 12, top: D03.rows[0].y + 50, width: D03.rows[0].w - 24, height: 84, overflow: 'hidden', borderRadius: 16}}>
          <LightSweep t={prog(f, tRows + 10, tRows + 34, EASE_CAM)} strength={0.2} />
        </div>
      </div>
    </>
  );

  const keys = (size: number) => (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.18, perspective: 900}}>
      <Keycap label="Strg" at={tKeys} press={tPress} w={size * 1.45} h={size} fontSize={size * 0.32} />
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: size * 0.4, color: C.muted, opacity: prog(f, tKeys + 4, tKeys + 12)}}>+</div>
      <Keycap label="K" at={tKeys + 3} press={tPress + 4} w={size} h={size} fontSize={size * 0.4} />
    </div>
  );

  if (v) {
    const aspect = 1000 / 1080;
    const view = viewAt(1440, 800, 1300, aspect);
    return (
      <AbsoluteFill>
        <Stage glowX={0.5} glowY={0.55} />
        <Camera>
          <Plane w={1000} h={1080} y={110 + (1 - enter) * 60} z={cam * 50} rx={8} ry={mix(-4, 4, cam)} opacity={enter}>
            <Display img={IMG.d02} view={view} w={1000} h={1080} radius={26}>
              {content}
            </Display>
          </Plane>
        </Camera>
        <div style={{position: 'absolute', left: 70, top: 230}}>
          <Headline text="Strg + K." at={tPress} size={110} />
        </div>
        <div style={{position: 'absolute', left: 70, top: 372}}>{keys(110)}</div>
      </AbsoluteFill>
    );
  }

  const view = viewAt(1440, 800, 2200, 1500 / 900);
  return (
    <AbsoluteFill>
      <Stage glowX={0.6} glowY={0.5} />
      <Camera perspective={2400}>
        <Plane w={1500} h={900} x={260} y={40 + (1 - enter) * 60} z={mix(0, 110, cam)} rx={8} ry={mix(-13, -8, cam)} opacity={enter}>
          <Display img={IMG.d02} view={view} w={1500} h={900}>
            {content}
          </Display>
        </Plane>
      </Camera>
      <div style={{position: 'absolute', left: 120, top: 120}}>
        <Headline text="Strg + K." at={tPress} size={128} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 640}}>{keys(150)}</div>
    </AbsoluteFill>
  );
};
