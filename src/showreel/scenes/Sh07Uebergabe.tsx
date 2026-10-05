import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {SceneProps} from '../Showreel';
import {C, EASE, EASE_CAM, EASE_IN, FONT} from '../theme';
import {beat} from '../timeline';
import {D05, H04, IMG} from '../assets';
import {keys, mix, prog, useFormat} from '../util';
import {Camera, Plane, Stage} from '../components/Stage';
import {Phone, phoneSize, STATUS_H} from '../components/Phone';
import {MacBook, macSize} from '../components/MacBook';
import {Space} from '../components/Screen';
import {LightSweep, Tap} from '../components/Fx';

// 0:39 – One tap on "An den Rechner übergeben": the phone shrinks into the
// cyan brand dot, flies into the MacBook and the desktop opens around it.

const SCROLL = 300; // phone scrolled to the bottom of the "Wohnzimmer" page

/** The button sits at the very bottom edge of the screenshot, so it is drawn whole here. */
const HandoverButton: React.FC<{press: number; glow: number}> = ({press, glow}) => {
  const b = H04.handoverBtn;
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        borderRadius: 24,
        background: C.bubble,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 31,
        letterSpacing: '-0.01em',
        color: C.ink,
        transform: `scale(${1 - 0.04 * press})`,
        boxShadow: `0 0 ${60 * glow}px rgba(119,194,225,${0.8 * glow})`,
      }}
    >
      An den Rechner übergeben
    </div>
  );
};

export const Sh07Uebergabe: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const {W, H, v} = useFormat();
  const tTap = beat('uebergabe', 'tap');
  const tFly = beat('uebergabe', 'fly');
  const tLand = beat('uebergabe', 'land');
  const tSettle = beat('uebergabe', 'settle');

  // ---- phone ----
  const ps = phoneSize(v ? 820 : 600);
  const btnY = ps.bezel + (H04.handoverBtn.y + H04.handoverBtn.h / 2 - SCROLL + STATUS_H) * ps.k - ps.h / 2;
  const phone0 = v ? {x: 0, y: 260 - btnY} : {x: 330, y: 230 - btnY};

  // ---- MacBook ----
  const ms = macSize(v ? 900 : 1180);
  const mac0 = v ? {x: 0, y: -60} : {x: -40, y: -40};
  const macIn = prog(f, tFly - 6, tLand, EASE);
  const dolly = prog(f, tLand, dur, EASE_CAM);
  const macScale = mix(1, v ? 1.12 : 1.32, dolly);
  // after landing, drift the view towards the live PDF preview
  const pan = prog(f, tSettle, dur, EASE_CAM);
  const macX = mac0.x + (v ? 0 : mix(0, -200, pan));
  const macY = mac0.y + (1 - macIn) * 520 + (v ? 0 : mix(0, 30, pan));

  // ---- flight ----
  const fly = prog(f, tFly, tLand, EASE_IN);
  const flyEase = prog(f, tFly, tLand, EASE_CAM);
  const phoneScale = mix(1, 0.12, flyEase);
  const phoneOpacity = 1 - prog(f, tLand - 10, tLand - 2);
  const px = mix(phone0.x, macX, flyEase);
  const py = mix(phone0.y, macY - ms.lidH * 0.02, flyEase) - Math.sin(Math.PI * flyEase) * (v ? 220 : 160);
  const press = prog(f, tTap, tTap + 3) * (1 - prog(f, tTap + 6, tTap + 12));
  const btnGlow = prog(f, tTap, tTap + 4) * (1 - prog(f, tFly + 10, tLand));

  // the cyan dot that carries the quote over
  const dotOn = prog(f, tFly + 8, tLand - 6) * (1 - prog(f, tLand, tLand + 4));
  const dotSize = mix(10, 36, dotOn);

  // screen opens from the landing point
  const reveal = prog(f, tLand, tLand + 20, EASE);
  const ring = f >= tLand ? prog(f, tLand, tLand + 24, EASE) : 0;
  const flash = f >= tLand ? Math.exp(-(f - tLand) / 6) : 0;

  const screen = (
    <>
      <div style={{position: 'absolute', inset: 0, clipPath: `circle(${reveal * 3600}px at 1440px 900px)`}}>
        <Space img={IMG.d05} />
        <div style={{position: 'absolute', left: D05.preview.x, top: D05.preview.y, width: D05.preview.w, height: D05.preview.h, overflow: 'hidden', borderRadius: 30}}>
          <LightSweep t={prog(f, tSettle + 6, tSettle + 40, EASE_CAM)} strength={0.14} />
        </div>
      </div>
      {ring > 0 && ring < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 1440 - ring * 3600,
            top: 900 - ring * 3600,
            width: ring * 7200,
            height: ring * 7200,
            borderRadius: '50%',
            border: `${18 * (1 - ring)}px solid rgba(91,200,232,${0.9 * (1 - ring)})`,
            boxShadow: `0 0 120px rgba(91,200,232,${0.6 * (1 - ring)})`,
          }}
        />
      )}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(220,247,255,0.8), rgba(91,200,232,0.2) 40%, rgba(91,200,232,0) 70%)', opacity: flash}} />
    </>
  );

  const phoneContent = (
    <>
      <Space img={IMG.h04} />
      <HandoverButton press={press} glow={btnGlow} />
      <Tap x={H04.handoverBtn.x + H04.handoverBtn.w / 2} y={H04.handoverBtn.y + H04.handoverBtn.h / 2} at={tTap} size={120} />
    </>
  );

  const scroll = keys(f, [
    [0, SCROLL - 140],
    [tTap - 6, SCROLL],
  ]);

  return (
    <AbsoluteFill>
      <Stage glowX={v ? 0.5 : mix(0.67, 0.48, macIn)} glowY={mix(0.5, 0.46, macIn)} glow={1 + flash} />
      <Camera perspective={2400}>
        {macIn > 0 && (
          <Plane w={ms.lidW} h={ms.lidH} x={macX} y={macY} z={mix(-500, 0, macIn)} scale={macScale} rx={-10} ry={mix(-4, -10, dolly)} opacity={macIn}>
            <MacBook screenW={ms.screenW} content={screen} rim={0.6 + flash} lean={12} />
          </Plane>
        )}
        {phoneOpacity > 0 && (
          <Plane
            w={ps.w}
            h={ps.h}
            x={px}
            y={py}
            z={mix(0, 80, Math.sin(Math.PI * flyEase))}
            scale={phoneScale}
            rx={mix(9, 0, flyEase)}
            ry={mix(-12, 0, flyEase)}
            rz={mix(0, -8, fly)}
            opacity={phoneOpacity}
          >
            <Phone screenW={ps.screenW} content={phoneContent} scroll={scroll} statusColor="#0A0A0A" rim={1 + 2 * fly} />
          </Plane>
        )}
      </Camera>
      {dotOn > 0 && (
        <div
          style={{
            position: 'absolute',
            left: W / 2 + px - dotSize / 2,
            top: H / 2 + py - dotSize / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: C.cyan,
            opacity: dotOn,
            boxShadow: `0 0 ${dotSize * 1.5}px rgba(91,200,232,1), 0 0 ${dotSize * 4}px rgba(91,200,232,0.5)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
