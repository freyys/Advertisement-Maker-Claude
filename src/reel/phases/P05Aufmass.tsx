// P05 · Aufmaß mit Rechenweg (phone): the five position cards stack in, the
// wall formula lights up and a callout shows the calculation in big type.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {calcCeiling, calcWall, captions, positions, posTotal} from '../copy';
import {FONT, m, rgba, tnum} from '../tokens';
import {de, eur} from '../../lib/format';
import {Caption, CutFlash, ease, keys, prog, rise, UnderCaption, Whip} from '../kit/stage';
import {Phone, PW, Screen} from '../kit/mobile';
import {IArrowLeft} from '../kit/icons';
import {CutWhoosh, S} from '../kit/sfx';

const K = 1.75;

export const AufmassHeader: React.FC<{title: string}> = ({title}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: 108, background: '#000', zIndex: 2, display: 'flex', alignItems: 'flex-end', padding: '0 0 22px 20px', gap: 30}}>
    <IArrowLeft size={26} color={m.accent} stroke={2.4} />
    <span style={{fontSize: 21, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em'}}>{title}</span>
  </div>
);

export const PositionCard: React.FC<{
  name: string;
  calc: string[];
  qty: string;
  sum: string;
  t?: number;
  hl?: number;
}> = ({name, calc, qty, sum, t = 1, hl = 0}) => (
  <div
    style={{
      marginTop: 10,
      borderRadius: 15,
      background: m.card2,
      border: `1px solid ${hl > 0 ? rgba(m.accent, 0.3 + 0.6 * hl) : m.line}`,
      padding: '15px 16px 14px 16px',
      display: 'flex',
      gap: 10,
      opacity: t,
      transform: `translateY(${(1 - t) * 40}px) scale(${0.96 + 0.04 * t})`,
      boxShadow: hl > 0 ? `0 0 ${30 * hl}px ${rgba(m.accent, 0.3 * hl)}` : undefined,
    }}
  >
    <div style={{flex: 1}}>
      <div style={{fontSize: 16.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em'}}>{name}</div>
      <div style={{marginTop: 5, fontSize: 12.8, lineHeight: 1.33, color: m.muted, position: 'relative'}}>
        {calc.map((c) => (
          <div key={c} style={{whiteSpace: 'nowrap'}}>
            {c}
          </div>
        ))}
        {hl > 0 ? (
          <div style={{position: 'absolute', left: -4, top: -1, bottom: -1, width: `${hl * 104}%`, background: rgba(m.accent, 0.14), borderRadius: 4}} />
        ) : null}
      </div>
    </div>
    <div style={{textAlign: 'right', ...tnum}}>
      <div style={{fontSize: 16.5, fontWeight: 800, color: '#fff'}}>{qty}</div>
      <div style={{marginTop: 4, fontSize: 13.5, color: m.textSoft}}>{sum}</div>
    </div>
  </div>
);

export const P05Aufmass: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const card = (i: number) => prog(frame, 8 + i * 6, 26 + i * 6, ease.out);
  const qty = (i: number) => prog(frame, 12 + i * 6, 44 + i * 6, ease.out);
  const hl = prog(frame, 52, 70, ease.inOut) * (1 - prog(frame, 104, 112));
  const callout = prog(frame, 56, 74, ease.out);
  const scroll = keys(frame, [[0, 0], [60, 0], [96, 34]], ease.inOut);
  const ry = keys(frame, [[0, 10], [40, 3], [dur, -4]], ease.inOut);
  const eq = prog(frame, 74, 90, ease.out);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Whip frame={frame} dur={dur}>
        <UnderCaption top={600}>
          <Phone cx={540} top={650} k={K} ry={ry} rx={4} glow={0.3}>
            <Screen>
              <AufmassHeader title="Wohnzimmer" />
              <div style={{position: 'absolute', left: 20, right: 20, top: 92 - scroll}}>
                <div style={{border: `1px solid ${m.line}`, borderRadius: 18, background: m.card, padding: '24px 13px 13px'}}>
                  <div style={{height: 50, borderRadius: 12, border: `1px solid ${m.line}`, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 16, fontWeight: 700}}>
                    Wohnzimmer
                  </div>
                  <div style={{marginTop: 10, height: 50, borderRadius: 12, border: `1px solid ${m.line}`, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 14.5, color: m.muted}}>
                    Farbton (optional), z. B. Sandbeige matt
                  </div>
                  {positions.map((p, i) => (
                    <PositionCard
                      key={i}
                      name={p.name.replace(' · Decke', '')}
                      calc={p.calc === 'wall' ? calcWall : [calcCeiling]}
                      qty={`${de(p.qty * qty(i), p.qty % 1 ? 1 : 0)} m²`}
                      sum={eur(posTotal(p) * qty(i))}
                      t={card(i)}
                      hl={i === 0 ? hl : 0}
                    />
                  ))}
                  <div style={{marginTop: 10, height: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, opacity: card(5)}}>
                    + Position
                  </div>
                </div>
              </div>
            </Screen>
          </Phone>
        </UnderCaption>

        {/* calculation callout */}
        <div
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            top: 1270,
            padding: '30px 34px',
            borderRadius: 30,
            background: 'rgba(17,17,20,0.86)',
            border: `1.5px solid ${rgba(m.accent, 0.5)}`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.65), 0 0 60px ${rgba(m.accent, 0.18)}`,
            backdropFilter: 'blur(14px)',
            ...rise(callout, 40, 10),
            transform: `translateY(${(1 - callout) * 40}px) scale(${0.94 + 0.06 * callout})`,
          }}
        >
          <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '0.14em', color: m.accent}}>RECHENWEG · WÄNDE</div>
          <div style={{marginTop: 14, fontSize: 36, fontWeight: 600, color: m.textSoft, ...tnum}}>
            18 × 2,6 m <span style={{color: m.muted}}>−</span> 2 × 1,25 × 1,2 m <span style={{color: m.muted}}>−</span> 1 × 2 m
          </div>
          <div style={{marginTop: 8, fontSize: 70, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', ...tnum, ...rise(eq, 20, 6)}}>
            = 41,8 m²
          </div>
        </div>
      </Whip>
      <Caption c={captions.aufmass} frame={frame} dur={dur} />
      <CutFlash frame={frame} dur={dur} />
      {[0, 1, 2, 3, 4].map((i) => (
        <S key={i} at={10 + i * 6} src="tick.wav" vol={0.4} />
      ))}
      <S at={54} src="whoosh-soft.wav" vol={0.5} />
      <S at={76} src="shimmer.wav" vol={0.4} />
      <CutWhoosh dur={dur} />
    </AbsoluteFill>
  );
};
