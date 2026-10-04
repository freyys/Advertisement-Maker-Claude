// P12 · Baustellen-Modus (phone): one tap on "Baustellen-Modus" and the
// Übersicht switches to maximum contrast (circular reveal from the button),
// then a sun glare sweeps over it and everything stays readable.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {captions, overview} from '../copy';
import {FONT, m, rgba, tnum} from '../tokens';
import {Caption, CutFlash, ease, keys, prog, Tap, UnderCaption, Whip} from '../kit/stage';
import {MPill, MSection, MStatus, MTitle, Phone, Screen} from '../kit/mobile';
import {ISun} from '../kit/icons';
import {CutWhoosh, S} from '../kit/sfx';

const K = 1.75;
const TOP = 650;
const T = {tap: 40, reveal: [42, 66] as const, glare: [72, 112] as const};
const Y0 = 58; // below the status bar

const OverviewScreen: React.FC<{strong?: boolean; sunSpin?: number}> = ({strong, sunSpin = 0}) => {
  const s = strong ? 1.1 : 1;
  const card: React.CSSProperties = strong
    ? {background: '#0A0A0A', border: '1.5px solid #9A9A9A', borderRadius: 17}
    : {background: m.card, border: `1px solid ${m.line}`, borderRadius: 17};
  const stat = (label: string, dot: string, value: string, foot: string) => (
    <div style={{flex: 1, padding: strong ? '16px 14px' : '17px 14px', ...card}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 * s, fontWeight: 700, letterSpacing: '0.12em', color: strong ? '#fff' : m.textSoft}}>
        <span style={{width: 6, height: 6, borderRadius: 3, background: dot}} />
        {label}
      </div>
      <div style={{marginTop: 8, fontSize: 24 * s, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', ...tnum}}>{value}</div>
      <div style={{marginTop: 6, fontSize: 12.5 * s, color: strong ? '#E6E6E6' : m.muted}}>{foot}</div>
    </div>
  );
  return (
    <Screen tint={strong ? 0 : 1} style={strong ? {background: '#000'} : undefined}>
      <div style={{position: 'absolute', left: 20, right: 20, top: Y0}}>
        <MPill strong={strong}>{overview.pill}</MPill>
        <div style={{marginTop: 12}}>
          <MTitle size={strong ? 41 : 36}>{overview.title}</MTitle>
        </div>
        <div style={{marginTop: 6, fontSize: 15.5 * s, color: strong ? '#fff' : m.muted}}>{overview.sub}</div>
        <div
          style={{
            marginTop: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            height: strong ? 48 : 38,
            padding: strong ? '0 20px' : '0 16px',
            borderRadius: 24,
            border: strong ? `2.5px solid ${m.accent}` : '1px solid rgba(255,255,255,0.18)',
            background: strong ? '#0E1A1F' : 'transparent',
            fontSize: strong ? 16.5 : 14.5,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          <ISun size={strong ? 18 : 16} color="#fff" stroke={2} style={{transform: `rotate(${sunSpin * 180}deg)`}} />
          {strong ? 'Baustellen-Modus an' : 'Baustellen-Modus'}
        </div>
        <div style={{marginTop: 18, display: 'flex', gap: 10}}>
          {stat('OFFEN', m.yellow, overview.offen.value, overview.offen.foot)}
          {stat('ÜBERFÄLLIG', m.rose, overview.over.value, overview.over.foot)}
        </div>
        <MSection no="01" title="Offene Rechnungen" right="2" strong={strong} style={{marginTop: 26}} />
        {overview.invoices.map((inv, i) => (
          <div key={inv.no} style={{marginTop: i === 0 ? 18 : 9, padding: strong ? '16px 18px' : '15px 15px', display: 'flex', ...card}}>
            <div style={{flex: 1}}>
              <div style={{fontSize: 17 * s, fontWeight: 800, color: '#fff', ...tnum}}>{inv.no}</div>
              <div style={{fontSize: 15 * s, marginTop: 3, color: strong ? '#fff' : m.textSoft}}>{inv.who}</div>
              <div style={{fontSize: 13 * s, marginTop: 3, color: inv.status === 'Überfällig' ? m.rose : strong ? '#E6E6E6' : m.muted}}>{inv.note}</div>
            </div>
            <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 9}}>
              <div style={{fontSize: 17 * s, fontWeight: 800, color: '#fff', ...tnum}}>{inv.sum}</div>
              <MStatus status={inv.status} strong={strong} />
            </div>
          </div>
        ))}
        <MSection no="02" title="Angebote ohne Antwort" right="2" strong={strong} style={{marginTop: 28}} />
        {overview.offers.slice(0, 1).map((o) => (
          <div key={o.no} style={{marginTop: 18, padding: strong ? '16px 18px' : '15px 15px', display: 'flex', ...card}}>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 17 * s, fontWeight: 800, color: '#fff', ...tnum}}>{o.no}</div>
              <div style={{fontSize: 15 * s, marginTop: 3, color: strong ? '#fff' : m.textSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{o.who}</div>
              <div style={{fontSize: 13 * s, marginTop: 3, color: strong ? '#E6E6E6' : m.muted}}>{o.note}</div>
            </div>
            <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 9}}>
              <div style={{fontSize: 17 * s, fontWeight: 800, color: '#fff', ...tnum}}>{o.sum}</div>
              <MStatus status={o.status} strong={strong} />
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
};

export const P12Baustelle: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const reveal = prog(frame, T.reveal[0], T.reveal[1], ease.inOut);
  const glare = prog(frame, T.glare[0], T.glare[1], ease.inOut);
  const ry = keys(frame, [[0, 10], [36, 2], [dur, -6]], ease.inOut);
  // toggle centre in screen points
  const cx = 20 + 100;
  const cy = Y0 + 31 + 12 + 40 + 6 + 20 + 16 + 19;
  const r = reveal * 1000;
  const tapX = 540 - (195 - cx) * K;
  const tapY = TOP + (8 + cy) * K;
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <Phone cx={540} top={TOP} k={K} ry={ry} rx={4} glow={0.3 + reveal * 0.3}>
            <OverviewScreen />
            {reveal > 0 ? (
              <div style={{position: 'absolute', inset: 0, clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>
                <OverviewScreen strong sunSpin={reveal} />
              </div>
            ) : null}
            {reveal > 0 && reveal < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: cx - r,
                  top: cy - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: '50%',
                  boxShadow: `0 0 0 2px ${rgba(m.accent, 0.9 * (1 - reveal))}, 0 0 40px ${rgba(m.accent, 0.5 * (1 - reveal))}`,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
            {/* sunlight glare sweeping across the screen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(115deg, transparent ${-40 + glare * 140}%, rgba(255,246,225,0.32) ${-20 + glare * 140}%, rgba(255,246,225,0.5) ${-12 + glare * 140}%, transparent ${8 + glare * 140}%)`,
                mixBlendMode: 'screen',
                opacity: glare > 0 && glare < 1 ? 1 : 0,
              }}
            />
          </Phone>
          <Tap frame={frame} at={T.tap} x={tapX} y={tapY} color={m.accent} />
          {/* warm sun flare outside the phone */}
          <div
            style={{
              position: 'absolute',
              right: -260,
              top: 420,
              width: 900,
              height: 900,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255,226,170,${0.4 * Math.sin(glare * Math.PI)}) 0%, rgba(255,200,120,${0.12 * Math.sin(glare * Math.PI)}) 35%, transparent 65%)`,
              mixBlendMode: 'screen',
            }}
          />
        </UnderCaption>
      </Whip>
      <Caption c={captions.baustelle} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      <S at={T.tap} src="click.wav" vol={0.8} />
      <S at={T.reveal[0]} src="whoosh-b.wav" vol={0.5} />
      <S at={T.glare[0] + 6} src="shimmer.wav" vol={0.35} />
      <CutWhoosh dur={dur} vol={0.6} />
    </AbsoluteFill>
  );
};
