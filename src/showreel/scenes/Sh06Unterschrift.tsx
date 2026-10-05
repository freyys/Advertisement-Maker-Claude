import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, FONT, tabular} from '../theme';
import {beat} from '../timeline';
import {H04, IMG} from '../assets';
import {countTo, eur, mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Phone, phoneSize, STATUS_H} from '../components/Phone';
import {Highlight, Patch, Space} from '../components/Screen';
import {Headline} from '../components/Headline';
import {Callout} from '../components/Callout';
import {LightSweep, PulseRings} from '../components/Fx';

// 0:33 – "Summe vor Ort": the gross total counts up on the phone, then the
// "Kunde unterschreibt vor Ort" button pulses.
const BRUTTO = 1741.71;

export const Sh06Unterschrift: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {v} = useFormat();
  const tCount = beat('unterschrift', 'count');
  const tCountEnd = beat('unterschrift', 'countEnd');
  const tPulse = beat('unterschrift', 'pulse');

  const ps = phoneSize(v ? 860 : 600);
  // centre of "Summe" card + button, relative to the phone centre
  const focusSrcY = (H04.summe.y + H04.signBtn.y + H04.signBtn.h) / 2;
  const focusY = ps.bezel + (focusSrcY + STATUS_H) * ps.k - ps.h / 2;
  const cam = prog(f, 0, dur, EASE_CAM);
  const enter = prog(f, 0, 24, EASE);
  const s = mix(1.02, v ? 1.12 : 1.26, cam);
  const Ty = v ? mix(150, 110, cam) : mix(90, 40, cam);
  const x = v ? 0 : 330;

  const value = countTo(f, tCount, tCountEnd, BRUTTO);
  const done = f >= tCountEnd;
  const flash = done ? Math.exp(-(f - tCountEnd) / 10) : 0;
  const pulse = f >= tPulse ? 0.5 + 0.5 * Math.sin(((f - tPulse) / 16) * Math.PI * 2 - Math.PI / 2) : 0;
  const bv = H04.bruttoValue;
  const btn = H04.signBtn;

  const content = (
    <>
      <Space img={IMG.h04} />
      {/* the gross amount counts up in place */}
      <Patch rect={bv} fill={C.card} />
      <div
        style={{
          position: 'absolute',
          left: bv.x - 40,
          top: bv.y - 4,
          width: 260,
          height: bv.h,
          textAlign: 'right',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 41,
          lineHeight: `${bv.h}px`,
          letterSpacing: '-0.025em',
          color: C.white,
          textShadow: `0 0 ${24 * flash}px rgba(91,200,232,0.9)`,
          whiteSpace: 'nowrap',
          ...tabular,
        }}
      >
        {eur(done ? BRUTTO : value)}
      </div>
      <Highlight rect={H04.brutto} t={prog(f, tCount, tCount + 10) * (1 - prog(f, tPulse - 6, tPulse + 6))} radius={14} pad={4} />
      <Highlight rect={H04.netto} t={prog(f, tCount - 12, tCount - 4) * (1 - prog(f, tCount + 4, tCount + 12))} radius={12} pad={2} />
      <Highlight rect={H04.mwst} t={prog(f, tCount - 6, tCount + 2) * (1 - prog(f, tCount + 8, tCount + 16))} radius={12} pad={2} />
      {/* sign-on-site button pulses */}
      <div style={{position: 'absolute', left: btn.x, top: btn.y, width: btn.w, height: btn.h, borderRadius: 22, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,1)', opacity: 0.22 * pulse, mixBlendMode: 'screen'}} />
        <LightSweep t={prog(f, tPulse - 4, tPulse + 22, EASE_CAM)} strength={0.4} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: btn.x,
          top: btn.y,
          width: btn.w,
          height: btn.h,
          borderRadius: 22,
          boxShadow: `0 0 ${50 * pulse}px rgba(119,194,225,${0.7 * pulse})`,
        }}
      >
        <PulseRings at={tPulse} every={16} count={4} size={btn.h} w={btn.w} h={btn.h} radius={24} spread={0.45} />
      </div>
    </>
  );

  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : 0.67} glowY={v ? 0.58 : 0.5} glow={1 + flash * 0.6} />
      <Camera>
        <Plane
          w={ps.w}
          h={ps.h}
          x={x + (1 - enter) * 60}
          y={Ty - focusY * s + (1 - enter) * 80}
          scale={s}
          rx={10}
          ry={mix(-6, -14, cam)}
          rz={mix(-0.6, 0.4, cam)}
        >
          <Phone screenW={ps.screenW} content={content} statusColor="#0A0A0A" />
        </Plane>
      </Camera>
      <div style={{position: 'absolute', left: v ? 70 : 120, top: v ? 230 : 120}}>
        <Headline text={'Unterschrift\nvor Ort.'} at={6} size={v ? 96 : 104} />
      </div>
      <div style={{position: 'absolute', left: v ? 70 : 120, top: v ? 470 : 470}}>
        <Callout label="BRUTTO · SUMME VOR ORT" value={BRUTTO} at={tCount - 6} countFrom={tCount} countTo={tCountEnd} size={v ? 80 : 88} sub="Netto 1.463,62 € + MwSt 19 % 278,09 €" />
      </div>
    </AbsoluteFill>
  );
};
