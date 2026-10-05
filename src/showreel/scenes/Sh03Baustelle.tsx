import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {EASE, EASE_CAM} from '../theme';
import {beat} from '../timeline';
import {H01, H05, IMG} from '../assets';
import {mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Phone, phoneSize} from '../components/Phone';
import {Space} from '../components/Screen';
import {Headline} from '../components/Headline';
import {PulseRings, Tap} from '../components/Fx';

// 0:11 – On site. A tap on "Baustellen-Modus" switches the phone to the
// high-contrast view; the button flares like sunlight.
export const Sh03Baustelle: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {W, H, v} = useFormat();
  const tHead = beat('baustelle', 'headline');
  const tTap = beat('baustelle', 'tap');
  const tFlare = beat('baustelle', 'flare');

  const ps = phoneSize(v ? 820 : 470);
  const enter = prog(f, 0, 30, EASE);
  const cam = prog(f, 0, dur, EASE_CAM);
  const sw = prog(f, tFlare, tFlare + 8, EASE);
  const flash = f >= tFlare ? Math.exp(-(f - tFlare) / 5) : 0;
  const sun = f >= tFlare ? Math.exp(-(f - tFlare) / 10) * 0.8 + 0.25 * prog(f, tFlare, tFlare + 20) : 0;

  const base = v ? {x: 0, y: 514, ry: -6, rx: 6} : {x: 300, y: 8, ry: -16, rx: 9};
  const ry = mix(base.ry - 10, base.ry + 6, cam);
  const btn = H05.modeBtn;

  const content = (
    <>
      <Space img={IMG.h01} />
      <Space img={IMG.h05} style={{opacity: sw}} />
      {/* flare on the switched button */}
      <div
        style={{
          position: 'absolute',
          left: btn.x - 60,
          top: btn.y - 60,
          width: btn.w + 120,
          height: btn.h + 120,
          borderRadius: 999,
          background: 'radial-gradient(closest-side, rgba(220,246,255,0.9), rgba(91,200,232,0.4) 45%, rgba(91,200,232,0))',
          opacity: flash * 0.9,
          mixBlendMode: 'screen',
        }}
      />
      <div style={{position: 'absolute', left: btn.x, top: btn.y, width: btn.w, height: btn.h}}>
        <PulseRings at={tFlare + 6} every={22} count={3} size={btn.h} w={btn.w} h={btn.h} radius={999} spread={0.5} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: '#E6FAFF', opacity: flash * 0.35}} />
      <Tap x={H01.modeBtn.x + H01.modeBtn.w / 2} y={H01.modeBtn.y + H01.modeBtn.h / 2} at={tTap} size={110} />
    </>
  );

  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : 0.66} glowY={v ? 0.62 : 0.52} glow={1 + flash} camX={cam * 60} />
      <Camera>
        <Plane
          w={ps.w}
          h={ps.h}
          x={base.x + (1 - enter) * (v ? 0 : 120)}
          y={base.y + (1 - enter) * 220 - cam * (v ? 40 : 20)}
          z={-(1 - enter) * 300 + cam * 90}
          rx={base.rx + (1 - enter) * 10}
          ry={ry}
          opacity={enter}
        >
          <Phone screenW={ps.screenW} content={content} statusColor={sw > 0.5 ? '#000' : '#1C272D'} rim={1 + flash} />
        </Plane>
      </Camera>
      {/* sunlight: anamorphic streak + bloom after the switch */}
      {sun > 0.01 && (
        <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
          <div
            style={{
              position: 'absolute',
              left: -W * 0.2,
              top: H * (v ? 0.47 : 0.3) - 6,
              width: W * 1.4,
              height: 12,
              background: 'linear-gradient(90deg, rgba(255,240,210,0), rgba(255,244,225,0.9) 50%, rgba(255,240,210,0))',
              opacity: sun * 0.8,
              filter: 'blur(3px)',
              transform: `translateX(${(f - tFlare) * 6}px) scaleY(${0.6 + sun})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: W * (v ? 0.55 : 0.78) - 500,
              top: -500 + (v ? 300 : 0),
              width: 1000,
              height: 1000,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,245,225,0.55), rgba(255,220,170,0.18) 40%, rgba(255,220,170,0))',
              opacity: sun,
            }}
          />
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', left: v ? 70 : 120, top: v ? 240 : 380}}>
        <Headline text={'Direkt auf der\nBaustelle.'} at={tHead} size={v ? 92 : 104} />
      </div>
    </AbsoluteFill>
  );
};
